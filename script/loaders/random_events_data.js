/* ============================================================
   RANDOM EVENTS — FICHIER DE CHARGEMENT
   ------------------------------------------------------------
   Ce fichier ne contient AUCUNE logique de jeu et AUCUNE donnée
   en dur : il charge la liste des événements depuis
   random_events_data.json et la transforme pour le moteur
   (random_events_engine.js). Pour ajouter/modifier un événement
   GAB-XXX, édite le JSON — pas ce fichier.

   HYPOTHÈSES FAITES (à corriger si ton code utilise d'autres
   noms — voir aussi le bloc "ADAPTER ICI" dans le moteur) :

   1. Tu as deux variables globales qui donnent la nuit en cours
      et l'heure en cours :
        - currentNight  (1, 2, 3, ...)
        - gameHour      (nombre décimal entre 0 et 6, ex: 2.25
                          représente 02h15)
      Si elles s'appellent autrement dans ton code, change les
      deux lignes indiquées dans le moteur (section ADAPTER ICI).

   2. Les images "cachées" des événements sont stockées dans un
      sous-dossier hidden/ de chaque pièce, par ex. :
        images/rooms/1b_dining_area/hidden/GAB-001.png
      (donc PAS "images/rooms/1b_dining_area/hidden GAB-001.png"
      comme écrit dans ta question — j'ai supposé un dossier
      "hidden" avec un slash. Dis-moi si le nom de fichier réel
      est différent, ex. sans tiret.)

   3. Les sons sont déclarés ici par un nom LOGIQUE ("chair",
      "balloon", ...). Il faut que ta fonction playSound(nom)
      sache résoudre ce nom vers le bon fichier audio, exactement
      comme pour tes sons existants (camera_toggle, breath_1...).
   ============================================================ */

// Associe le libellé "Salle" du tableau à un cameraId existant
// (cf. cameras_images / roomsArray) et au dossier d'images.
const EVENT_ROOM_MAP = {
  "Dining Area": { cameraId: "1b", folder: "1b_dining_area" },
  "Dining":      { cameraId: "1b5", folder: "1b_dining_area" },
  "Backstage":   { cameraId: "5", folder: "5_backstage" },
  "Stage":       { cameraId: "1a", folder: "1a_show_stage" },
  "Restroom":    { cameraId: "7", folder: "7_restroom" },
  "East Hall Corner":    { cameraId: "4b", folder: "4b_east_hall_corner" },
  "Bureau":      { cameraId: null, folder: null }, // pas de caméra (vue office)

  // Ajoutés pour couvrir les salles du tableau de production (CSV nuit 1-5).
  // "West Hall" et "East Hall" n'y sont pas distingués en A/B : mappés sur
  // les caméras "principales" (2a / 4a) par choix, à corriger si besoin.
  "West Hall":     { cameraId: "2a", folder: "2a_west_hall" },
  "East Hall":     { cameraId: "4a", folder: "4a_east_hall" },
  "Supply Closet": { cameraId: "3", folder: "3_supply_closet" },
  "Kitchen":       { cameraId: "6", folder: "6_kitchen" },
  "Pirate Cove":   { cameraId: "1c", folder: "1c_pirate_cove" }
};

function buildHiddenImagePath(roomLabel, fileName) {
  const mapping = EVENT_ROOM_MAP[roomLabel];
  if (!mapping || !mapping.folder || !fileName) return null;
  return `images/rooms/${mapping.folder}/hidden/${fileName}`;
}

/**
 * Transforme une chaîne d'heure du tableau ("00h-06h", "01h",
 * "Toute nuit", "02h15") en intervalle décimal {start, end}
 * (une nuit = 0 à 6). "Toute nuit" => {start:0, end:6}.
 */
function parseHourRange(str) {
  if (!str || /toute nuit/i.test(str)) return { start: 0, end: 6 };

  const parts = str.split("-").map(s => s.trim());
  const toDecimal = (h) => {
    const m = h.match(/(\d{1,2})h(\d{2})?/i);
    if (!m) return null;
    const hh = parseInt(m[1], 10);
    const mm = m[2] ? parseInt(m[2], 10) : 0;
    return hh + mm / 60;
  };

  const start = toDecimal(parts[0]);
  const end = parts.length > 1 ? toDecimal(parts[1]) : (start !== null ? start + 1 : 6);
  return { start: start ?? 0, end: end ?? 6 };
}

/**
 * Types de déclencheur reconnus par le moteur :
 *  - "observe"          : chance évaluée régulièrement tant que
 *                          la caméra de la pièce est affichée
 *  - "observeDuration"   : il faut regarder la caméra EN CONTINU
 *                          pendant `duration` secondes avant que
 *                          la chance soit évaluée
 *  - "cameraReturn"      : chance évaluée au moment où on BASCULE
 *                          sur cette caméra (peu importe la durée)
 *  - "silence"           : pas de caméra (vue bureau), évalué quand
 *                          le joueur reste inactif un moment
 */
function parseTrigger(str) {
  if (!str) return { type: "observe", duration: 0 };
  const s = str.toLowerCase();
  if (s.includes("retour caméra") || s.includes("retour camera")) {
    return { type: "cameraReturn", duration: 0 };
  }
  if (s.includes("silence")) return { type: "silence", duration: 0 };
  const durMatch = s.match(/observer\s+(\d+)\s*s/);
  if (durMatch) return { type: "observeDuration", duration: parseInt(durMatch[1], 10) };
  return { type: "observe", duration: 0 };
}

/* ------------------------------------------------------------
   Définition brute — chargée depuis random_events_data.json.
   C'est CE FICHIER JSON qu'on édite pour ajouter/modifier un
   événement GAB-XXX, pas ce .js (qui ne contient que la logique
   de chargement et de transformation).

   Le JSON est généré depuis
   ".github/Projet/04 - Production/Tableau_Production_Regroupe_Par_Nuit.csv"
   (nuits 1 à 5) plus quelques événements "legacy" (night: 0) déjà
   présents avant la mise en place du tableau de production.
   Champs du CSV non repris car absents/toujours vides sur ce fichier :
   "Priority" (colonne inexistante), "Script JS" et "RequiresEvent" (vides
   sur les 111 lignes — seule exception : GAB-008/GAB-007, relation
   conservée manuellement depuis la version précédente du fichier),
   "evolution" (colonne inexistante — laissé à "" partout, comportement par
   défaut du moteur : affichage simple de 6 s, non répétable dans la nuit).
   Champs ajoutés en plus du format existant, gardés uniquement quand
   renseignés dans le CSV : weight / retryWeight / lastNightBoost (nuit 1
   seulement) et realised (colonne "Réalisé", pour le suivi de production
   des assets — non exploité par le moteur).

   Arbitrages faits lors de la génération initiale (voir historique git
   pour le détail) :
   - "West Hall" et "East Hall" ne sont pas distingués A/B dans le CSV ;
     mappés respectivement sur les caméras 2a et 4a (voir EVENT_ROOM_MAP).
   - SUS-006 était dupliqué à l'identique (nuit 3, East Hall) dans le CSV :
     une seule occurrence conservée.
   - GAB-001 : la colonne Terminal du CSV est vide (le blocage terminal se
     fait via GAB-002 = "PARTY" pour cette même série).
   - Plusieurs lignes ont "Heure" = "Retour caméra" (probable copie de la
     colonne Déclencheur dans le tableau source) : JER-002, FRT-016,
     FRT-018, FRT-019, FRT-027, GAB-022, JER-024, SUS-018, SUS-019.
     parseHourRange() retombe alors sur {0,6} (comme "Toute nuit"), donc
     sans impact fonctionnel, mais la donnée source mériterait d'être
     corrigée.
   - JER-006 (nuit 2, Supply Closet) a un déclencheur "Silence" alors que
     ce type de déclencheur n'est traité par le moteur que pour les
     événements sans caméra (roomLabel "Bureau") : tel quel, cet événement
     ne se déclenchera jamais (updateSilenceEvents() ignore les events
     avec cameraId non nul). À corriger côté design (autre déclencheur ou
     autre salle) si l'événement doit réellement apparaître.
   ------------------------------------------------------------ */

/**
 * Charge script/config/random_events_data.json de façon SYNCHRONE.
 * Nécessaire car ce script s'exécute en <script> classique (pas de
 * bundler / pas d'await top-level) et que random_events_engine.js,
 * chargé juste après, lit RANDOM_EVENTS dès son propre chargement.
 * Fonctionne avec Electron (nodeIntegration désactivé, page servie
 * en file://) : XMLHttpRequest synchrone reste géré pour ce protocole,
 * contrairement à fetch().
 */
function loadRandomEventsRawSync() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "script/config/random_events_data.json", false);
    xhr.send(null);
    // En file://, un chargement réussi renvoie status 0 (pas de vrai code HTTP).
    if (xhr.status !== 0 && xhr.status !== 200) {
      console.error(`[RandomEvents] random_events_data.json : statut HTTP ${xhr.status}`);
      return [];
    }
    return JSON.parse(xhr.responseText);
  } catch (err) {
    console.error("[RandomEvents] Impossible de charger random_events_data.json", err);
    return [];
  }
}

const RANDOM_EVENTS_RAW = loadRandomEventsRawSync();

/* ------------------------------------------------------------
   Construction de la table finale exploitée par le moteur.
   Clé = id (ex. "GAB-001").
   ------------------------------------------------------------ */
const RANDOM_EVENTS = {};

RANDOM_EVENTS_RAW.forEach(raw => {
  const roomInfo = EVENT_ROOM_MAP[raw.roomLabel] || { cameraId: null, folder: null };

  RANDOM_EVENTS[raw.id] = {
    id: raw.id,
    priority: raw.priority,
    type: raw.type,
    roomLabel: raw.roomLabel,
    cameraId: roomInfo.cameraId,          // null => événement "bureau" (pas de caméra)
    night: raw.night,
    hourRange: parseHourRange(raw.hourStr),  // {start, end} en heures décimales (0-6)
    chance: raw.chance,                   // probabilité par tentative (0 à 1)
    trigger: parseTrigger(raw.triggerStr),// {type, duration}
    description: (raw.description) ? raw.description.trim() : "",
    lore: (raw.lore) ? raw.lore.trim() : "",
    imagePath: buildHiddenImagePath(raw.roomLabel, raw.image),
    animatronic: (raw.animatronic) ? raw.animatronic.trim() : "",
    sound: (raw.sound) ? raw.sound.trim() : "",                      // nom logique passé à playSound()
    jsHandler: (raw.js) ? raw.js.trim() : "",                    // nom du handler custom (voir RANDOM_EVENT_HANDLERS)
    terminal: raw.terminal,
    journal: raw.journal,
    tape: raw.tape,
    evolution: raw.evolution,
    requiresEvent: raw.requiresEvent || null
  };
});
