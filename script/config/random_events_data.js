/* ============================================================
   RANDOM EVENTS — FICHIER DE DONNÉES / CHARGEMENT
   ------------------------------------------------------------
   Ce fichier ne contient AUCUNE logique de jeu : uniquement la
   donnée (ton tableau de conception transformé en JS), pour
   pouvoir ajouter un nouvel événement GAB-XXX en une seule
   entrée, sans toucher au moteur (random_events_engine.js).

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
  "Bureau":      { cameraId: null, folder: null } // pas de caméra (vue office)
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
   Définition brute — c'est ICI que tu ajoutes une ligne pour
   créer un nouvel événement GAB-XXX.
   ------------------------------------------------------------ */
const RANDOM_EVENTS_RAW = [
  {
    id: "GAB-001", priority: "Haute", type: "Objet", roomLabel: "Dining Area",
    night: 1, hourStr: "00h-06h", chance: 0.80, triggerStr: "Observer",
    description: "Une chaise est reculée", lore: "Quelqu'un était assis",
    image: "GAB-010.png", sound: "chair", js: "chair",
    terminal: "LOST001", journal: null, tape: null, evolution: "revient"
  },
  {
    id: "GAB-002", priority: "Haute", type: "Objet", roomLabel: "Dining Area",
    night: 2, hourStr: "Toute nuit", chance: 0.15, triggerStr: "Retour caméra",
    description: "Un ballon jaune apparaît", lore: "Décoration oubliée",
    image: "GAB-002.png", sound: "balloon", js: "balloon",
    terminal: "LOST002", journal: "NEWS001", tape: null, evolution: "persistant"
  },
  {
    id: "GAB-003", priority: "Haute", type: "Décor", roomLabel: "Stage",
    night: 2, hourStr: "01h", chance: 0.10, triggerStr: "Observer 8 s",
    description: "Une cinquième assiette apparaît", lore: "Cinquième enfant",
    image: "GAB-003.png", sound: null, js: "plate",
    terminal: null, journal: "NEWS002", tape: null, evolution: "persistant"
  },
  {
    id: "GAB-004", priority: "Haute", type: "IA", roomLabel: "Stage",
    night: 2, hourStr: "03h", chance: 0.06, triggerStr: "Retour caméra",
    description: "Freddy regarde une chaise vide", lore: "Gabriel attend",
    image: "GAB-004.png", sound: "breathe", js: "stare",
    terminal: null, journal: null, tape: "TAPE003", evolution: "3_etats"
  },
  {
    id: "GAB-005", priority: "Moyenne", type: "Overlay", roomLabel: "Dining",
    night: 2, hourStr: "02h", chance: 0.12, triggerStr: "Observer",
    description: "Une bougie est allumée", lore: "Anniversaire",
    image: "GAB-005.png", sound: "flame", js: "candle",
    terminal: "REPORT05", journal: "NEWS002", tape: null, evolution: "devient_eteinte"
  },
  {
    id: "GAB-006", priority: "Haute", type: "Son", roomLabel: "Bureau",
    night: 2, hourStr: "02h15", chance: 0.07, triggerStr: "Silence",
    description: "Applaudissements lointains", lore: "Souvenir d'une fête",
    image: null, sound: "applause", js: "audio",
    terminal: null, journal: null, tape: "TAPE001", evolution: "variable"
  },
  {
    id: "GAB-007", priority: "Haute", type: "Objet", roomLabel: "Dining",
    night: 3, hourStr: "00h", chance: 0.09, triggerStr: "Observer",
    description: "Boîte cadeau fermée", lore: "Cadeau jamais ouvert",
    image: "GAB-007.png", sound: "paper", js: "gift",
    terminal: "LOST004", journal: null, tape: null, evolution: "peut_souvrir"
  },
  {
    id: "GAB-008", priority: "Moyenne", type: "Overlay", roomLabel: "Dining",
    night: 3, hourStr: "04h", chance: 0.05, triggerStr: "Retour caméra",
    description: "Le cadeau est ouvert", lore: "Souvenir évolutif",
    image: "GAB-008.png", sound: null, js: "gift_open",
    terminal: null, journal: null, tape: null, evolution: "persistant",
    requiresEvent: "GAB-007" // ne peut survenir que si GAB-007 a déjà eu lieu
  },
  {
    id: "GAB-009", priority: "Haute", type: "Objet", roomLabel: "Dining",
    night: 3, hourStr: "Toute nuit", chance: 0.08, triggerStr: "Observer",
    description: "Part de gâteau oubliée", lore: "Dernier anniversaire",
    image: "GAB-009.png", sound: "flies", js: "cake",
    terminal: "LOST005", journal: "NEWS003", tape: null, evolution: "pourrit"
  },
  {
    id: "GAB-010", priority: "Haute", type: "Objet", roomLabel: "Dining",
    night: 3, hourStr: "Toute nuit", chance: 0.06, triggerStr: "Observer",
    description: "Verre en carton renversé", lore: "Fête interrompue",
    image: "GAB-010.png", sound: "drip", js: "cup",
    terminal: "CLEAN01", journal: null, tape: null, evolution: "liquide_disparait"
  },


  // Event legacy d'overlay avec animatronic
  {
    id: "BONNIE-001", priority: "Haute", type: "Overlay", roomLabel: "Backstage",
    night: 0, hourStr: "Toute nuit", chance: 0.50, triggerStr: "Observer",
    image: "BONNIE-001.jpg", animatronic: "Bonnie", sound: "breath_1", 
    terminal: null, journal: null, tape: null, evolution: ""
  },
  {
    id: "RESTO-001", priority: "Haute", type: "Overlay", roomLabel: "Backstage",
    night: 0, hourStr: "Toute nuit", chance: 0.50, triggerStr: "Observer",
    image: "5_b0_c0_f0_event.jpg",  sound: "breath_2", 
    terminal: null, journal: null, tape: null, evolution: ""
  },
   {
    id: "CHICA-001", priority: "Haute", type: "Overlay", roomLabel: "Restroom",
    night: 0, hourStr: "Toute nuit", chance: 0.50, triggerStr: "Observer",
    image: "CHICA-001.jpg", animatronic: "Chica", sound: "breath_2", 
    terminal: null, journal: null, tape: null, evolution: ""
  },
     {
    id: "CHICA-002", priority: "Haute", type: "Overlay", roomLabel: "East Hall Corne",
    night: 0, hourStr: "Toute nuit", chance: 0.50, triggerStr: "Observer",
    image: "CHICA-002.jpg", animatronic: "Chica", sound: "breath_2", 
    terminal: null, journal: null, tape: null, evolution: ""
  },
];

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
