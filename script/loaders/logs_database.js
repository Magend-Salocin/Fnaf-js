/* ============================================================
   LOGS DATABASE — Toutes les données des logs JSON
   ============================================================ */

const LogsDatabase = {};

/**
 * Charge logs_database.json (liste LOG_FILES) de facon SYNCHRONE,
 * pour la meme raison que les autres loaders de script/loaders :
 * preloadLogs() ci-dessous en a besoin des son execution. Pour
 * ajouter/retirer un log, edite le JSON — pas ce fichier.
 */
function loadLogFilesSync() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "script/config/logs_database.json", false);
    xhr.send(null);
    // En file://, un chargement reussi renvoie status 0 (pas de vrai code HTTP).
    if (xhr.status !== 0 && xhr.status !== 200) {
      console.error(`[LogsDatabase] logs_database.json : statut HTTP ${xhr.status}`);
      return [];
    }
    return JSON.parse(xhr.responseText).logFiles;
  } catch (err) {
    console.error("[LogsDatabase] Impossible de charger logs_database.json", err);
    return [];
  }
}

// Liste des logs disponibles côté serveur (fichiers dans ressources/logs)
const LOG_FILES = loadLogFilesSync();

// Précharge tous les fichiers JSON dans ressources/logs au démarrage.
// Cela évite que le premier appel synchrone à `getLog` retourne null
// parce que le fetch n'a pas encore eu le temps de se faire.
(async function preloadLogs() {
  try {
    await Promise.all(LOG_FILES.map(async (name) => {
      try {
        const path = `ressources/logs/${name}.json`;
        const res = await fetch(path, { cache: 'no-cache' });
        if (!res.ok) return;
        const data = await res.json();
        LogsDatabase[name] = data;
      } catch (e) {
        // ignore erreur pour un fichier manquant
      }
    }));
  } catch (e) {
    // ne pas bloquer l'exécution si le préchargement échoue
  }
})();

/* Fonction pour accéder à un log spécifique
   Comportement :
   - retourne immédiatement l'entrée en mémoire si disponible
   - lance en tâche de fond un `fetch` vers `ressources/logs/NAME.json`
   pour mettre à jour le cache `LogsDatabase` si le fichier existe
   Ceci garde l'API synchrone pour l'appelant tout en permettant
   de charger dynamiquement des fichiers JSON externes.
*/
function getLog(commandName) {
  const name = (commandName || '').toString().toUpperCase();
  return LogsDatabase[name] || null;
}