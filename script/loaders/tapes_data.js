// tapes_data.js
// Charge le catalogue des cassettes depuis tapes_data.json. Pour
// ajouter/modifier une cassette, edite le JSON — pas ce fichier.

function loadTapesDataSync() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "script/config/tapes_data.json", false);
    xhr.send(null);
    // En file://, un chargement reussi renvoie status 0 (pas de vrai code HTTP).
    if (xhr.status !== 0 && xhr.status !== 200) {
      console.error(`[Tapes] tapes_data.json : statut HTTP ${xhr.status}`);
      return [];
    }
    return JSON.parse(xhr.responseText);
  } catch (err) {
    console.error("[Tapes] Impossible de charger tapes_data.json", err);
    return [];
  }
}

const TAPES_LIBRARY = loadTapesDataSync();
