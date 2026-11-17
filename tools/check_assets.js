/*
 * Vérifie la cohérence entre les images des caméras sur le disque et leurs déclarations.
 *
 * Usage : node tools/check_assets.js
 *
 * Une image de caméra n'est affichée que si elle est déclarée : dans
 * script/config/assets.json, ou comme image d'un événement caché
 * (random_events_data.json, dossier déduit du roomLabel par EVENT_ROOM_MAP).
 *
 * Signale :
 *   ERREUR      une déclaration qui pointe sur un fichier absent (événement
 *               marqué "realised" compris : son image ne s'affichera pas)
 *   À PRODUIRE  l'image d'un événement pas encore réalisé
 *   NON UTILISÉ une image de images/rooms/ référencée nulle part : à déclarer,
 *               à déplacer (roomLabel de l'événement) ou à supprimer
 * Sort en code 1 s'il y a au moins une erreur.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ROOMS_DIR = path.join(ROOT, 'images', 'rooms');
const IMAGE_EXT = /\.(png|jpe?g|gif|webp)$/i;

const readJson = file => JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
const toPosix = p => p.split(path.sep).join('/');

function collectImagePaths(value, out) {
  if (typeof value === 'string' && IMAGE_EXT.test(value)) out.add(value);
  else if (value && typeof value === 'object') Object.values(value).forEach(v => collectImagePaths(v, out));
  return out;
}

// EVENT_ROOM_MAP est défini en JS dans le loader : on en extrait les dossiers.
function readEventRoomMap() {
  const source = fs.readFileSync(path.join(ROOT, 'script/loaders/random_events_data.js'), 'utf8');
  const map = {};
  for (const m of source.matchAll(/"([^"]+)":\s*\{\s*cameraId:[^,]+,\s*folder:\s*"([^"]+)"/g)) map[m[1]] = m[2];
  return map;
}

function listImages(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listImages(full);
    return IMAGE_EXT.test(entry.name) ? [toPosix(path.relative(ROOT, full))] : [];
  });
}

function main() {
  // Toute configuration peut déclarer une image (assets, rooms_config, office_animations...).
  const declared = new Set();
  for (const file of fs.readdirSync(path.join(ROOT, 'script/config')).filter(f => f.endsWith('.json'))) {
    if (file === 'random_events_data.json') continue;
    collectImagePaths(readJson(`script/config/${file}`), declared);
  }

  const roomMap = readEventRoomMap();
  const toProduce = new Map(); // chemin -> id de l'événement non réalisé
  const events = readJson('script/config/random_events_data.json');
  for (const event of Array.isArray(events) ? events : Object.values(events)) {
    const folder = roomMap[event.roomLabel];
    if (typeof event.image !== 'string' || !folder) continue;
    const file = `images/rooms/${folder}/hidden/${event.image}`;
    if (event.realised) declared.add(file);
    else toProduce.set(file, event.id);
  }

  let errors = 0;
  for (const file of [...declared].sort()) {
    if (!fs.existsSync(path.join(ROOT, file))) {
      console.log(`ERREUR      déclaré mais absent : ${file}`);
      errors++;
    }
  }

  let pending = 0;
  for (const [file, id] of [...toProduce].sort()) {
    if (fs.existsSync(path.join(ROOT, file))) { declared.add(file); continue; }
    console.log(`À PRODUIRE  ${id} : ${file}`);
    pending++;
  }

  const unused = listImages(ROOMS_DIR).filter(file => !declared.has(file));
  for (const file of unused) console.log(`NON UTILISÉ ${file}`);

  console.log(`\n${declared.size} images utilisées, ${errors} erreur(s), ${pending} à produire, ${unused.length} non utilisée(s).`);
  process.exit(errors > 0 ? 1 : 0);
}

main();
