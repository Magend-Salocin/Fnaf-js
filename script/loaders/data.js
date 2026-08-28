//data.js

// Salles/cameras construites automatiquement depuis ROOMS_CONFIG.js
var rooms = buildRoomsStateFromConfig(ROOMS);
const roomsArray = buildRoomsArrayFromConfig(ROOMS);
const cameras = buildCamerasFromConfig(ROOMS);

// ---------------------------------------------
// 1. TABLEAU CENTRALISÉ DES SONS AVEC IDENTIFIANTS
// ---------------------------------------------
/**
 * Charge game_sounds.json de facon SYNCHRONE et resout chaque
 * `selector` CSS vers son element DOM. Pour ajouter/modifier un son,
 * edite le JSON — pas ce fichier.
 * @type {Array<{id: string, element: HTMLAudioElement, category: string, description: string, mixVolume: number}>}
 */
function loadGameSoundsSync() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "script/config/game_sounds.json", false);
    xhr.send(null);
    // En file://, un chargement reussi renvoie status 0 (pas de vrai code HTTP).
    if (xhr.status !== 0 && xhr.status !== 200) {
      console.error(`[Data] game_sounds.json : statut HTTP ${xhr.status}`);
      return [];
    }
    const entries = JSON.parse(xhr.responseText);
    return entries.map(({ selector, ...entry }) => ({
      ...entry,
      element: document.querySelector(selector)
    }));
  } catch (err) {
    console.error("[Data] Impossible de charger game_sounds.json", err);
    return [];
  }
}

const gameSounds = loadGameSoundsSync();