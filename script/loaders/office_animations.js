// office_animations.js
// Charge les animations du bureau depuis office_animations.json.
// Pour ajouter/recalibrer une animation, edite le JSON — pas ce fichier.

function loadOfficeAnimationsConfigSync() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "script/config/office_animations.json", false);
    xhr.send(null);
    // En file://, un chargement reussi renvoie status 0 (pas de vrai code HTTP).
    if (xhr.status !== 0 && xhr.status !== 200) {
      console.error(`[OfficeAnimations] office_animations.json : statut HTTP ${xhr.status}`);
      return { enabled: false, animations: [] };
    }
    return JSON.parse(xhr.responseText);
  } catch (err) {
    console.error("[OfficeAnimations] Impossible de charger office_animations.json", err);
    return { enabled: false, animations: [] };
  }
}

const OFFICE_ANIMATIONS_CONFIG = loadOfficeAnimationsConfigSync();

/**
 * Retourne toutes les animations declarees, quelle que soit l'image du
 * bureau. Sert au prechargement des GIF.
 * @returns {Object[]} Animations declarees dans le JSON
 */
function getDeclaredOfficeAnimations() {
  if (!OFFICE_ANIMATIONS_CONFIG.enabled) return [];
  return OFFICE_ANIMATIONS_CONFIG.animations || [];
}

/**
 * Retourne les animations calibrees pour une image du bureau.
 * @param {string} officeImageKey - Cle de l'image du bureau (ex: safe_room_left_light_1_right_light_0)
 * @returns {Object[]} Animations a jouer sur cette image, avec leur zone (liste vide si aucune)
 */
function getOfficeAnimations(officeImageKey) {
  return getDeclaredOfficeAnimations()
    .map(animation => ({ ...animation, rect: animation.zones?.[officeImageKey] || null }))
    .filter(animation => animation.rect !== null);
}
