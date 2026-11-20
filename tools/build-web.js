/*
 * npm run build-web : construit la version web dans _site/ (publiée par
 * .github/workflows/pages.yml).
 *
 * Copie ce que le jeu charge (index.html, script/, style/, templates/,
 * images/, audio/, ressources/ sans les sources de voix), place le service
 * worker à la racine et écrit precache-manifest.js : la liste des fichiers
 * de code à télécharger à l'installation, et deux versions (empreintes du
 * contenu) qui renouvellent les caches quand le code ou les médias changent.
 *
 * Seulement des modules Node intégrés : le workflow n'a pas besoin de npm install.
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, '_site');
const PUBLIC_DIRS = ['script', 'style', 'templates', 'images', 'audio', 'ressources'];
const EXCLUDED = ['script/core/unused', 'ressources/voix', 'images/atlas/src'];
const ROOT_FILES = ['index.html'];
const PRELOADED_FILE = 'script/web/preloaded_files.js';
const CODE_EXTENSIONS = new Set(['.html', '.js', '.css', '.json', '.txt', '.webmanifest']);

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

const toUrlPath = file => path.relative(SITE, file).split(path.sep).join('/');

function fingerprint(files) {
  const hash = crypto.createHash('sha256');
  for (const file of files) hash.update(file).update(fs.readFileSync(path.join(SITE, file)));
  return hash.digest('hex').slice(0, 12);
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

function build() {
  fs.rmSync(SITE, { recursive: true, force: true });
  for (const dir of PUBLIC_DIRS) fs.cpSync(path.join(ROOT, dir), path.join(SITE, dir), { recursive: true });
  for (const excluded of EXCLUDED) fs.rmSync(path.join(SITE, excluded), { recursive: true, force: true });
  for (const file of ROOT_FILES) fs.copyFileSync(path.join(ROOT, file), path.join(SITE, file));
  fs.cpSync(path.join(ROOT, 'web'), path.join(SITE, 'web'), { recursive: true });
  fs.renameSync(path.join(SITE, 'web', 'sw.js'), path.join(SITE, 'sw.js'));
  writePreloadedFiles();

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
  process.stdout.write(`_site/ : ${codeFiles.length} fichiers de code, ${mediaFiles.length} médias, version ${manifest.version}\n`);
}

build();
