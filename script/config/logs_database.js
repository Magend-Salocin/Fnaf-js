/* ============================================================
   LOGS DATABASE — Toutes les données des logs JSON
   ============================================================ */

const LogsDatabase = {};

// Liste des logs disponibles côté serveur (fichiers dans ressources/logs)
const LOG_FILES = [
  'ARCHIVE','BALLOON','CAMLOG','CHILDREN_ART','CLEANING','CLOSED','COOKING','DELETE','DRAWINGS','GUESTS','KITCHEN','LOGS','LOST','LOST001','LOST_ART','LOST_OBJECTS','LOST_PETS','LOST_TOYS','MAINT_05','MEMORY','PARTY','PETS','PIRATE','RECOVER','REPORT_87','ROOT','SCANNER','STAFF','STAGE_PROP','SUDO','TABLES','TOYS','USER','WHOAMI'
];

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