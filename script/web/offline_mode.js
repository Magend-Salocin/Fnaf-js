/*
 * Mode hors ligne de la version web publiée : enregistre le service worker
 * (sw.js, à la racine du site, généré par tools/build-web.js).
 *
 * Seulement en HTTPS hors Electron : les navigateurs refusent les service
 * workers en HTTP, et npm run web ne sert pas sw.js.
 */
(function () {
  if (window.appInfo || location.protocol !== 'https:' || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(error => {
      console.warn(`Mode hors ligne indisponible : ${error.message}`);
    });
  });
})();
