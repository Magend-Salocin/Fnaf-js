// rewards_data.js
// Charge les réserves de récompenses et les chaînes depuis rewards_data.json.
// Pour modifier une réserve ou une chaîne, édite le JSON — pas ce fichier.

function loadRewardsDataSync() {
  const empty = { pools: {}, chains: [] };
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "script/config/rewards_data.json", false);
    xhr.send(null);
    // En file://, un chargement reussi renvoie status 0 (pas de vrai code HTTP).
    if (xhr.status !== 0 && xhr.status !== 200) {
      console.error(`[Rewards] rewards_data.json : statut HTTP ${xhr.status}`);
      return empty;
    }
    return Object.assign(empty, JSON.parse(xhr.responseText));
  } catch (err) {
    console.error("[Rewards] Impossible de charger rewards_data.json", err);
    return empty;
  }
}

const REWARDS_DATA = loadRewardsDataSync();
