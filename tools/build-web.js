/*
 * npm run build-web : construit la version web dans _site/ (publiée par
 * .github/workflows/pages.yml).
 *
 * 1. Copie ce que le jeu charge (index.html, script/, style/, templates/,
 *    images/, audio/, ressources/ dont les voix générées, sans les sources
 *    du générateur de voix) et web/.
 * 2. Allège les médias, sans toucher au dépôt (la version PC garde les
 *    originaux) :
 *    - PNG -> WebP (transparence conservée, Safari 14+) ;
 *    - WAV -> MP3 (VBR), sauf les boucles courtes de KEEP_AS_WAV : le MP3
 *      ajoute un silence à chaque tour de boucle, audible sur un bourdonnement.
 *    Les GIF restent tels quels : gif_player.js les décode lui-même.
 * 3. Réécrit les références dans le code publié (.png -> .webp partout,
 *    sauf les icônes de web/ exigées en PNG par iOS ; chaque WAV converti
 *    par son nom, les chemins audio étant tous écrits en entier).
 * 4. Intègre les JSON et TXT dans preloaded_files.js (hors ligne), place le
 *    service worker à la racine et écrit precache-manifest.js.
 *
 * Outils : sharp (images) et ffmpeg-static (audio), en devDependencies.
 */
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const sharp = require('sharp');
const ffmpegPath = require('ffmpeg-static');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, '_site');
const PUBLIC_DIRS = ['script', 'style', 'templates', 'images', 'audio', 'ressources'];
// ressources/voix/sorties/ est publié : le jeu y lit les voix générées
// (appels, cassettes). Seules les sources du générateur sont exclues.
const EXCLUDED = [
  'script/core/unused',
  'images/atlas/src',
  'ressources/voix/textes',
  'ressources/voix/config.json',
  'ressources/voix/README.md',
];
const ROOT_FILES = ['index.html'];
const PRELOADED_FILE = 'script/web/preloaded_files.js';
const CODE_EXTENSIONS = new Set(['.html', '.js', '.css', '.json', '.txt', '.webmanifest']);
const REWRITTEN_EXTENSIONS = new Set(['.html', '.js', '.css', '.json']);
const KEEP_AS_WAV = new Set(['Buzz_Fan_Florescent2.wav', 'circus.wav', 'pirate song2.wav']);
const WEBP_OPTIONS = { quality: 80, effort: 4 };
const MP3_QUALITY = '5'; // LAME VBR V5 : ~65 kb/s en mono, ~130 kb/s en stéréo
const PARALLEL_JOBS = Math.max(2, os.cpus().length);

const runFile = promisify(execFile);

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

const toUrlPath = file => path.relative(SITE, file).split(path.sep).join('/');
const hasExtension = (file, extension) => path.extname(file).toLowerCase() === extension;
const megabytes = bytes => `${(bytes / 1048576).toFixed(1)} Mo`;

function folderSize(directory) {
  return listFiles(directory).reduce((total, file) => total + fs.statSync(file).size, 0);
}

function fingerprint(files) {
  const hash = crypto.createHash('sha256');
  for (const file of files) hash.update(file).update(fs.readFileSync(path.join(SITE, file)));
  return hash.digest('hex').slice(0, 12);
}

/** Exécute `task` sur chaque élément, `PARALLEL_JOBS` à la fois. */
async function runInParallel(items, task) {
  let next = 0;
  const worker = async () => {
    while (next < items.length) await task(items[next++]);
  };
  await Promise.all(Array.from({ length: Math.min(PARALLEL_JOBS, items.length) }, worker));
}

/** PNG -> WebP. Les icônes de web/ restent en PNG (apple-touch-icon, manifeste). */
async function convertImages() {
  const images = listFiles(SITE).filter(file => hasExtension(file, '.png') && !toUrlPath(file).startsWith('web/'));
  await runInParallel(images, async file => {
    await sharp(file).webp(WEBP_OPTIONS).toFile(file.replace(/\.png$/i, '.webp'));
    fs.rmSync(file);
  });
  return images.length;
}

/** WAV -> MP3, sauf KEEP_AS_WAV. Renvoie les noms convertis (pour réécrire les références). */
async function convertAudio() {
  const sounds = listFiles(SITE).filter(file => hasExtension(file, '.wav') && !KEEP_AS_WAV.has(path.basename(file)));
  await runInParallel(sounds, async file => {
    const output = file.replace(/\.wav$/i, '.mp3');
    await runFile(ffmpegPath, ['-v', 'error', '-y', '-i', file, '-codec:a', 'libmp3lame', '-q:a', MP3_QUALITY, output]);
    fs.rmSync(file);
  });
  return [...new Set(sounds.map(file => path.basename(file)))];
}

/** Remplace les références aux fichiers convertis dans le code publié. */
function rewriteReferences(convertedSounds) {
  const replacements = convertedSounds.flatMap(name => {
    const mp3 = name.replace(/\.wav$/i, '.mp3');
    return [[name, mp3], [encodeURI(name), encodeURI(mp3)]];
  });
  for (const file of listFiles(SITE)) {
    if (!REWRITTEN_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;
    const original = fs.readFileSync(file, 'utf8');
    let text = original.replace(/(?<!web\/icon-\d+)\.png\b/g, '.webp');
    for (const [from, to] of replacements) text = text.split(from).join(to);
    if (text !== original) fs.writeFileSync(file, text);
  }
}

/**
 * Intègre les JSON et TXT dans script/web/preloaded_files.js et l'ajoute à
 * index.html avant script/web/preloaded_xhr.js, qui sert les XHR synchrones
 * depuis la mémoire (hors ligne, elles ne passent pas par le service worker).
 */
function writePreloadedFiles() {
  const preloaded = {};
  for (const file of listFiles(SITE).map(toUrlPath).sort()) {
    if (['.json', '.txt'].includes(path.extname(file).toLowerCase())) {
      preloaded[file] = fs.readFileSync(path.join(SITE, file), 'utf8');
    }
  }
  fs.writeFileSync(
    path.join(SITE, PRELOADED_FILE),
    `// Généré par tools/build-web.js.\nwindow.PRELOADED_FILES = ${JSON.stringify(preloaded)};\n`,
  );

  const indexFile = path.join(SITE, 'index.html');
  const relayTag = '<script src="script/web/preloaded_xhr.js"></script>';
  const html = fs.readFileSync(indexFile, 'utf8');
  if (!html.includes(relayTag)) throw new Error(`index.html : balise introuvable ${relayTag}`);
  fs.writeFileSync(indexFile, html.replace(relayTag, `<script src="${PRELOADED_FILE}"></script>\n\t\t${relayTag}`));
}

function writePrecacheManifest() {
  const files = listFiles(SITE).map(toUrlPath).filter(file => file !== 'sw.js').sort();
  const codeFiles = files.filter(file => CODE_EXTENSIONS.has(path.extname(file).toLowerCase()));
  const mediaFiles = files.filter(file => !codeFiles.includes(file));
  const manifest = {
    version: fingerprint(codeFiles),
    mediaVersion: fingerprint(mediaFiles),
    files: ['./', 'precache-manifest.js', ...codeFiles],
  };
  fs.writeFileSync(
    path.join(SITE, 'precache-manifest.js'),
    `// Généré par tools/build-web.js.\nself.PRECACHE = ${JSON.stringify(manifest, null, 2)};\n`,
  );
  return { manifest, codeCount: codeFiles.length, mediaCount: mediaFiles.length };
}

async function build() {
  fs.rmSync(SITE, { recursive: true, force: true });
  for (const dir of PUBLIC_DIRS) fs.cpSync(path.join(ROOT, dir), path.join(SITE, dir), { recursive: true });
  for (const excluded of EXCLUDED) fs.rmSync(path.join(SITE, excluded), { recursive: true, force: true });
  for (const file of ROOT_FILES) fs.copyFileSync(path.join(ROOT, file), path.join(SITE, file));
  fs.cpSync(path.join(ROOT, 'web'), path.join(SITE, 'web'), { recursive: true });
  fs.renameSync(path.join(SITE, 'web', 'sw.js'), path.join(SITE, 'sw.js'));
  const sizeBefore = folderSize(SITE);

  const imageCount = await convertImages();
  const convertedSounds = await convertAudio();
  rewriteReferences(convertedSounds);
  writePreloadedFiles();
  const { manifest, codeCount, mediaCount } = writePrecacheManifest();

  process.stdout.write([
    `_site/ : ${codeCount} fichiers de code, ${mediaCount} médias, version ${manifest.version}`,
    `  ${imageCount} PNG -> WebP, ${convertedSounds.length} WAV -> MP3`,
    `  poids : ${megabytes(sizeBefore)} -> ${megabytes(folderSize(SITE))}`,
    '',
  ].join('\n'));
}

build().catch(error => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
