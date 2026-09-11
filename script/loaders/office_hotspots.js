// office_hotspots.js
// Charge les objets cliquables du bureau depuis office_hotspots.json.
// Pour ajouter/recalibrer une zone, edite le JSON — pas ce fichier.

function loadOfficeHotspotsConfigSync() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "script/config/office_hotspots.json", false);
    xhr.send(null);
    // En file://, un chargement reussi renvoie status 0 (pas de vrai code HTTP).
    if (xhr.status !== 0 && xhr.status !== 200) {
      console.error(`[OfficeHotspots] office_hotspots.json : statut HTTP ${xhr.status}`);
      return { enabled: false, hotspots: [] };
    }
    return JSON.parse(xhr.responseText);
  } catch (err) {
    console.error("[OfficeHotspots] Impossible de charger office_hotspots.json", err);
    return { enabled: false, hotspots: [] };
  }
}

const OFFICE_HOTSPOTS_CONFIG = loadOfficeHotspotsConfigSync();

/**
 * Retourne tous les objets declares, quelle que soit l'image du bureau.
 * Sert a auditer la configuration au demarrage.
 * @returns {Object[]} Objets declares dans le JSON
 */
function getDeclaredOfficeHotspots() {
  if (!OFFICE_HOTSPOTS_CONFIG.enabled) return [];
  return OFFICE_HOTSPOTS_CONFIG.hotspots || [];
}

/**
 * Retourne les objets cliquables calibres pour une image du bureau.
 * @param {string} officeImageKey - Cle de l'image du bureau (ex: safe_room_left_light_1_right_light_0)
 * @returns {{id: string, action: string, available: string|null, attract: boolean|string, tooltip: string|null, rect: {x: number, y: number, width: number, height: number}}[]} Objets presents sur cette image (liste vide si aucun)
 */
function getOfficeHotspots(officeImageKey) {
  return getDeclaredOfficeHotspots()
    .map(hotspot => ({
      id: hotspot.id,
      action: hotspot.action,
      available: hotspot.available || null,
      attract: hotspot.attract || false,
      tooltip: hotspot.tooltip || null,
      rect: hotspot.zones?.[officeImageKey] || null
    }))
    .filter(hotspot => hotspot.rect !== null);
}
