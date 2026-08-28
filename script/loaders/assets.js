//asset.js
// Charge les chemins d'images (cameras_images, the_office) depuis
// assets.json. Pour ajouter/modifier un chemin, edite le JSON — pas
// ce fichier.
//
// Rappel salles -> cameras :
// Backstage		Cam 5
// Dining Area		Cam 1A, 1B, 1C
// East Hall		Cam 4A, 4B
// Pirates Cove		Cam 7
// Restrooms		Cam 3
// Show Stage		Cam 1A, 1B, 1C
// Supply Closet	Cam 6
// The Office		(Pas de caméra)
// West Hall		Cam 2A, 2B

function loadAssetsConfigSync() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "script/config/assets.json", false);
    xhr.send(null);
    // En file://, un chargement reussi renvoie status 0 (pas de vrai code HTTP).
    if (xhr.status !== 0 && xhr.status !== 200) {
      console.error(`[Assets] assets.json : statut HTTP ${xhr.status}`);
      return { camerasImages: {}, theOffice: {} };
    }
    return JSON.parse(xhr.responseText);
  } catch (err) {
    console.error("[Assets] Impossible de charger assets.json", err);
    return { camerasImages: {}, theOffice: {} };
  }
}

const _assetsConfigData = loadAssetsConfigSync();
const cameras_images = _assetsConfigData.camerasImages;
const the_office = _assetsConfigData.theOffice;

const loadedCameraImages = {};
const loadedTheOfficeImages = {}; // Objet pour stocker les images de the_office

// Fonction pour détecter les GIFs
function _isGif(path) {
  return path.toLowerCase().endsWith('.gif');
}

// Fonction pour précharger les images et GIFs
async function preloadImages() {
  // Charger les images des caméras
  for (const roomId in cameras_images) {
    loadedCameraImages[roomId] = {};
    for (const imageKey in cameras_images[roomId]) {
      const imagePath = cameras_images[roomId][imageKey];
      const img = new Image();
      img.src = imagePath;
      loadedCameraImages[roomId][imageKey] = img;

      // Si c'est un GIF, le charger dynamiquement
      if (_isGif(imagePath)) {
        const gifId = `${roomId}_${imageKey}`;
        await loadGif(gifId, imagePath, 0, 0, img.width, img.height, false);
      }
    }
  }

  // Charger les images de the_office
  for (const key in the_office) {
    const path = the_office[key];
    if (typeof path === 'string') {
      const img = new Image();
      img.src = path;
      loadedTheOfficeImages[key] = img;
    }
  }
}
