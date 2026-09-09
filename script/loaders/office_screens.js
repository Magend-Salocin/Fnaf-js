// office_screens.js
// Charge les zones d'ecran du bureau depuis office_screens.json.
// Pour ajouter/recalibrer une zone, edite le JSON — pas ce fichier.

function loadOfficeScreensConfigSync() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "script/config/office_screens.json", false);
    xhr.send(null);
    // En file://, un chargement reussi renvoie status 0 (pas de vrai code HTTP).
    if (xhr.status !== 0 && xhr.status !== 200) {
      console.error(`[OfficeScreens] office_screens.json : statut HTTP ${xhr.status}`);
      return { enabled: false, batteryScreens: {} };
    }
    return JSON.parse(xhr.responseText);
  } catch (err) {
    console.error("[OfficeScreens] Impossible de charger office_screens.json", err);
    return { enabled: false, batteryScreens: {} };
  }
}

const OFFICE_SCREENS_CONFIG = loadOfficeScreensConfigSync();

/**
 * Retourne la zone normalisee de l'ecran batterie pour une image de bureau.
 * @param {string} officeImageKey - Cle de l'image du bureau (ex: safe_room_left_light_1_right_light_0)
 * @returns {{x: number, y: number, width: number, height: number}|null} Zone normalisee, ou null si l'image n'a pas d'ecran calibre
 */
function getOfficeBatteryScreenRect(officeImageKey) {
  if (!OFFICE_SCREENS_CONFIG.enabled) return null;
  return OFFICE_SCREENS_CONFIG.batteryScreens?.[officeImageKey] || null;
}
