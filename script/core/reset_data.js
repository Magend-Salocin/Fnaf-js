/*
 * « Tout effacer » (écran d'accueil) : après une double confirmation, efface
 * progression, options, langue, identifiant d'appareil et clé d'activation
 * (localStorage, sessionStorage), puis, en version web, les caches et le
 * service worker. Le jeu se relance ensuite.
 *
 * En version web, un nouvel identifiant d'appareil apparaît : il faut une
 * nouvelle clé.
 */
async function clearAllData() {
  const t = translations[selectedLanguage] || translations[defaultLanguage];
  if (!window.confirm(t.resetConfirm) || !window.confirm(t.resetConfirmAgain)) return;

  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (error) {
    console.warn(`Stockage non effacé : ${error.message}`);
  }
  if (window.caches) {
    const names = await caches.keys();
    await Promise.all(names.map(name => caches.delete(name)));
  }
  if (navigator.serviceWorker) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.unregister()));
  }
  location.reload();
}

document.getElementById('reset-data').addEventListener('click', event => {
  event.preventDefault();
  clearAllData();
});
