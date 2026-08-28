// translations.js
// Charge les textes de l'interface depuis translations.json. Pour
// ajouter/modifier une traduction, edite le JSON — pas ce fichier.

function loadTranslationsSync() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "script/config/translations.json", false);
    xhr.send(null);
    // En file://, un chargement reussi renvoie status 0 (pas de vrai code HTTP).
    if (xhr.status !== 0 && xhr.status !== 200) {
      console.error(`[Translations] translations.json : statut HTTP ${xhr.status}`);
      return { defaultLanguage: 'fr', translations: {} };
    }
    return JSON.parse(xhr.responseText);
  } catch (err) {
    console.error("[Translations] Impossible de charger translations.json", err);
    return { defaultLanguage: 'fr', translations: {} };
  }
}

const _translationsData = loadTranslationsSync();
window.FNAF_TRANSLATIONS = _translationsData.translations;
window.FNAF_DEFAULT_LANGUAGE = _translationsData.defaultLanguage;

