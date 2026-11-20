/*
 * Service worker de la version web publiée (copié à la racine de _site/ par
 * tools/build-web.js, enregistré par script/web/offline_mode.js).
 *
 * - Code (HTML, JS, CSS, JSON, TXT) : téléchargé à l'installation.
 * - Images et sons : mis en cache à leur première utilisation. Un fichier
 *   jamais chargé en ligne manque hors ligne.
 *
 * precache-manifest.js (généré) : self.PRECACHE = { version, mediaVersion, files }.
 * Le cache média ne change de nom que si une image ou un son change.
 *
 * Safari lit l'audio par requêtes partielles (en-tête Range) et attend une
 * réponse 206 : on découpe la réponse en cache, et à la première écoute on
 * laisse passer la requête partielle tout en mettant le fichier entier en
 * cache.
 */
/* global self, caches, importScripts */
importScripts('precache-manifest.js');

const { version, mediaVersion, files } = self.PRECACHE;
const PREFIX = 'fnaf-js-';
const CODE_CACHE = `${PREFIX}code-${version}`;
const MEDIA_CACHE = `${PREFIX}media-${mediaVersion}`;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CODE_CACHE)
      .then(cache => cache.addAll(files.map(file => new URL(file, self.location).href)))
      .then(() => self.skipWaiting()),
  );
});

// Une nouvelle version remplace la précédente : les anciens caches sont supprimés.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names
        .filter(name => name.startsWith(PREFIX) && name !== CODE_CACHE && name !== MEDIA_CACHE)
        .map(name => caches.delete(name))))
      .then(() => self.clients.claim()),
  );
});

/** Réponse 206 découpée dans une réponse complète, pour une requête Range. */
async function partialResponse(rangeHeader, response) {
  const buffer = await response.arrayBuffer();
  const size = buffer.byteLength;
  const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
  let start = 0;
  let end = size - 1;
  if (match && match[1]) {
    start = Number(match[1]);
    if (match[2]) end = Math.min(Number(match[2]), size - 1);
  } else if (match && match[2]) {
    start = Math.max(0, size - Number(match[2]));
  }
  if (start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  return new Response(buffer.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}

/** Télécharge le fichier entier et le garde (réponses complètes seulement). */
async function cacheMedia(url) {
  const response = await fetch(url);
  if (response.status === 200) await (await caches.open(MEDIA_CACHE)).put(url, response.clone());
  return response;
}

async function respond(event) {
  const { request } = event;
  const url = request.url.split('#')[0].split('?')[0];
  const range = request.headers.get('range');
  const cached = await caches.match(url);

  if (cached) return range ? partialResponse(range, cached) : cached;

  if (range) {
    // Première écoute : le réseau répond à la requête partielle, le fichier entier part en cache.
    event.waitUntil(cacheMedia(url).catch(() => {}));
    return fetch(request);
  }
  return cacheMedia(url);
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(respond(event));
});
