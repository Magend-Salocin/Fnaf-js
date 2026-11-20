/*
 * Hors ligne, version web publiée : les loaders lisent leurs JSON en
 * XMLHttpRequest synchrone, et les navigateurs ne font pas passer ces
 * requêtes par le service worker. Sans réseau, elles échouent.
 *
 * tools/build-web.js intègre donc les fichiers JSON et TXT du jeu dans
 * script/web/preloaded_files.js (window.PRELOADED_FILES, mis en cache comme
 * le reste du code) et l'ajoute à index.html avant ce script. Une requête
 * synchrone vers l'un de ces fichiers est servie depuis la mémoire.
 *
 * Sans ce fichier (Electron, npm run web, page locale), rien ne change.
 */
(function () {
  const files = window.PRELOADED_FILES;
  if (!files) return;

  const siteRoot = new URL('./', document.baseURI).href;
  const open = XMLHttpRequest.prototype.open;
  const send = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, async) {
    const absolute = new URL(url, document.baseURI).href.split(/[?#]/)[0];
    const path = absolute.startsWith(siteRoot) ? decodeURI(absolute.slice(siteRoot.length)) : null;
    this._preloadedText = method === 'GET' && async === false && path in files ? files[path] : null;
    return open.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    if (this._preloadedText === null || this._preloadedText === undefined) return send.apply(this, arguments);
    const text = this._preloadedText;
    Object.defineProperties(this, {
      readyState: { value: 4 },
      status: { value: 200 },
      statusText: { value: 'OK' },
      responseText: { value: text },
      response: { value: text },
    });
  };
})();
