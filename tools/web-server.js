/*
 * npm run web : sert le jeu sur le réseau local pour le tester sur un
 * téléphone du même Wi-Fi, sans publier. HTTP simple : ni clé, ni hors ligne.
 * Ne sert que index.html et les dossiers que le jeu charge.
 * Gère les requêtes partielles (Range) : Safari les exige pour lire l'audio.
 * Usage : npm run web [-- --port 8080]
 */
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIRS = ['script', 'style', 'templates', 'images', 'audio', 'ressources', 'web'];
const ROOT_FILES = ['index.html'];
const portIndex = process.argv.indexOf('--port');
const PORT = portIndex > 0 ? Number(process.argv[portIndex + 1]) : 8080;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

/** Fichier absolu pour un chemin d'URL, ou null s'il est hors des dossiers publics. */
function resolvePublicFile(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  const file = path.resolve(ROOT, decoded.replace(/^\/+/, ''));
  const inPublicDir = PUBLIC_DIRS.some(dir => file.startsWith(path.join(ROOT, dir) + path.sep));
  const isRootFile = ROOT_FILES.some(name => file === path.join(ROOT, name));
  return inPublicDir || isRootFile ? file : null;
}

function handle(request, response) {
  const { pathname } = new URL(request.url, 'http://localhost');
  const file = resolvePublicFile(pathname === '/' ? '/index.html' : pathname);
  const type = file && MIME_TYPES[path.extname(file).toLowerCase()];
  if (!type || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404);
    response.end('Introuvable');
    return;
  }

  // Pas de cache : un rechargement sur le téléphone prend toujours la dernière version.
  const headers = { 'Content-Type': type, 'Cache-Control': 'no-cache', 'Accept-Ranges': 'bytes' };
  const size = fs.statSync(file).size;
  const match = /bytes=(\d*)-(\d*)/.exec(request.headers.range || '');
  if (!match) {
    response.writeHead(200, { ...headers, 'Content-Length': size });
    fs.createReadStream(file).pipe(response);
    return;
  }
  let start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  let end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  if (start > end || start >= size) {
    response.writeHead(416, { 'Content-Range': `bytes */${size}` });
    response.end();
    return;
  }
  response.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
  fs.createReadStream(file, { start, end }).pipe(response);
}

function localAddresses() {
  return Object.values(os.networkInterfaces()).flat()
    .filter(entry => entry && entry.family === 'IPv4' && !entry.internal)
    .map(entry => entry.address);
}

const server = http.createServer(handle);
server.on('error', error => {
  if (error.code !== 'EADDRINUSE') throw error;
  process.stderr.write(`Le port ${PORT} est déjà pris (un autre npm run web tourne ?). Arrêter l'autre ou lancer : npm run web -- --port 8081\n`);
  process.exit(1);
});
server.listen(PORT, '0.0.0.0', () => {
  process.stdout.write('Le jeu est servi sur le réseau local. Sur l\'iPhone (même Wi-Fi), ouvrir dans Safari :\n');
  for (const address of localAddresses()) process.stdout.write(`  http://${address}:${PORT}/\n`);
  process.stdout.write('Puis Partager > « Sur l\'écran d\'accueil » pour le plein écran. Ctrl+C pour arrêter.\n');
});
