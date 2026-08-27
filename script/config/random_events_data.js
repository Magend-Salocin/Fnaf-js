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
   Définition brute — c'est ICI que tu ajoutes une ligne pour
   créer un nouvel événement GAB-XXX.
   ------------------------------------------------------------

   Le bloc ci-dessous (nuits 1 à 5) est généré depuis
   ".github/Projet/04 - Production/Tableau_Production_Regroupe_Par_Nuit.csv".
   Champs du CSV non repris ici car absents/toujours vides sur ce fichier :
   "Priority" (colonne inexistante), "Script JS" et "RequiresEvent" (vides
   sur les 111 lignes — seule exception : GAB-008/GAB-007 ci-dessous,
   relation conservée manuellement depuis la version précédente du fichier),
   "evolution" (colonne inexistante — laissé à "" partout, comportement par
   défaut du moteur : affichage simple de 6 s, non répétable dans la nuit).
   Champs ajoutés en plus du format existant, gardés uniquement quand
   renseignés dans le CSV : weight / retryWeight / lastNightBoost (nuit 1
   seulement) et realised (colonne "Réalisé", pour le suivi de production
   des assets — non exploité par le moteur).

   Points à vérifier / arbitrages faits lors de la génération :
   - "West Hall" et "East Hall" ne sont pas distingués A/B dans le CSV ;
     mappés respectivement sur les caméras 2a et 4a (voir EVENT_ROOM_MAP).
   - SUS-006 était dupliqué à l'identique (nuit 3, East Hall) dans le CSV :
     une seule occurrence conservée ici.
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
const RANDOM_EVENTS_RAW = [

  // ---------- Nuit 1 ----------
  {
    id: "GAB-001", type: "Screen", roomLabel: "Dining Area",
    night: 1, hourStr: "02h00–03h00", chance: 0.1, triggerStr: "Observer",
    description: "Une chaise est reculée", lore: "Quelqu'un était assis",
    image: "GAB-001.png", sound: "chair", js: null,
    terminal: null, journal: "NEWS_GAB_01", tape: "TAPE_GAB_01", evolution: "",
    animatronic: "Freddy", weight: 10, retryWeight: 6, lastNightBoost: 3, realised: true
  },
  {
    id: "GAB-002", type: "Screen", roomLabel: "Dining Area",
    night: 1, hourStr: "Toute nuit", chance: 0.15, triggerStr: "Retour caméra",
    description: "Un ballon jaune apparaît", lore: "Décoration oubliée",
    image: "GAB-002.png", sound: "balloon", js: null,
    terminal: "PARTY", journal: null, tape: null, evolution: "",
    animatronic: "Freddy", weight: 15, retryWeight: 8, lastNightBoost: 4, realised: true
  },
  {
    id: "JER-001", type: "Screen", roomLabel: "West Hall",
    night: 1, hourStr: "Toute nuit", chance: 0.15, triggerStr: "Observer",
    description: "Une feuille blanche apparaît", lore: "Jeremy préparait un dessin",
    image: "JER-001.png", sound: "paper", js: null,
    terminal: "DRAWINGS", journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", weight: 15, retryWeight: 8, lastNightBoost: 4, realised: true
  },
  {
    id: "JER-003", type: "Screen", roomLabel: "Supply Closet",
    night: 1, hourStr: "03h00–04h00", chance: 0.1, triggerStr: "Observer",
    description: "Une boîte de crayons apparaît", lore: "Crayons oubliés",
    image: "JER-003.png", sound: "crayons", js: null,
    terminal: null, journal: "NEWS_JER_01", tape: "TAPE_JER_01", evolution: "",
    animatronic: "Bonnie", weight: 10, retryWeight: 6, lastNightBoost: 3, realised: true
  },
  {
    id: "SUS-001", type: "Screen", roomLabel: "Dining Area",
    night: 1, hourStr: "Toute nuit", chance: 0.15, triggerStr: "Observer",
    description: "Gamelle métallique sous une table", lore: "Appartient au chien",
    image: "SUS-001.png", sound: "bowl", js: null,
    terminal: "PETS", journal: null, tape: null, evolution: "",
    animatronic: "Chica", weight: 15, retryWeight: 8, lastNightBoost: 4, realised: true
  },
  {
    id: "SUS-003", type: "Son", roomLabel: "Kitchen",
    night: 1, hourStr: "04h00–05h00", chance: 0.1, triggerStr: "Écoute CAM06",
    description: "Aboiement très lointain", lore: "Faux espoir",
    image: null, sound: "dog_far", js: null,
    terminal: null, journal: "NEWS_SUS_01", tape: "TAPE_SUS_01", evolution: "",
    animatronic: "Chica", weight: 10, retryWeight: 6, lastNightBoost: 3, realised: true
  },
  {
    id: "FRT-001", type: "Screen", roomLabel: "Pirate Cove",
    night: 1, hourStr: "Toute nuit", chance: 0.15, triggerStr: "Observer 5 s",
    description: "Petite voiture rouge apparaît", lore: "Jouet préféré de Fritz",
    image: "FRT-001.png", sound: "toy_roll", js: null,
    terminal: "TOYS", journal: null, tape: null, evolution: "",
    animatronic: "Foxy", weight: 15, retryWeight: 8, lastNightBoost: 4, realised: false
  },
  {
    id: "FRT-002", type: "Animation", roomLabel: "Pirate Cove",
    night: 1, hourStr: "05h00–06h00", chance: 0.05, triggerStr: "Retour caméra",
    description: "Foxy pousse doucement la voiture", lore: "Fritz continue de jouer",
    image: "FRT-002.png", sound: "wheel", js: null,
    terminal: null, journal: "NEWS_FRT_01", tape: "TAPE_FRT_01", evolution: "",
    animatronic: "Foxy", weight: 5, retryWeight: 3, lastNightBoost: 5, realised: false
  },

  // ---------- Nuit 2 ----------
  {
    id: "GAB-003", type: "Décor", roomLabel: "Dining Area",
    night: 2, hourStr: "01h00", chance: 0.1, triggerStr: "Observer 8 s",
    description: "Une cinquième assiette apparaît", lore: "Cinquième enfant",
    image: "GAB-003.png", sound: null, js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Freddy", realised: true
  },
  {
    id: "GAB-004", type: "IA", roomLabel: "Stage",
    night: 2, hourStr: "03h00", chance: 0.06, triggerStr: "Retour caméra",
    description: "Freddy regarde une chaise vide", lore: "Gabriel attend",
    image: "GAB-004.png", sound: "breathe", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Freddy", realised: false
  },
  {
    id: "GAB-005", type: "Overlay", roomLabel: "Dining Area",
    night: 2, hourStr: "02h00", chance: 0.12, triggerStr: "Observer",
    description: "Une bougie est allumée", lore: "Anniversaire",
    image: "GAB-005.png", sound: "flame", js: null,
    terminal: null, journal: null, tape: "TAPE_GAB_02", evolution: "",
    animatronic: "Freddy", realised: true
  },
  {
    id: "GAB-006", type: "Son", roomLabel: "Bureau",
    night: 2, hourStr: "02h15", chance: 0.07, triggerStr: "Silence",
    description: "Applaudissements lointains", lore: "Souvenir d'une fête",
    image: null, sound: "applause", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Freddy", realised: false
  },
  {
    id: "JER-002", type: "Overlay", roomLabel: "West Hall",
    night: 2, hourStr: "Retour caméra", chance: 0.12, triggerStr: "Retour caméra",
    description: "Un soleil est dessiné", lore: "Dessin terminé",
    image: "JER-002.png", sound: "pencil", js: null,
    terminal: "LOST_ART", journal: "NEWS_JER_02", tape: "TAPE_JER_02", evolution: "",
    animatronic: "Bonnie", realised: true
  },
  {
    id: "JER-004", type: "IA", roomLabel: "Backstage",
    night: 2, hourStr: "02h00", chance: 0.07, triggerStr: "Observer 8s",
    description: "Bonnie tient un crayon", lore: "Bonnie continue le dessin",
    image: "JER-004.png", sound: "scratch", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: true
  },
  {
    id: "JER-006", type: "Son", roomLabel: "Supply Closet",
    night: 2, hourStr: "Toute nuit", chance: 0.09, triggerStr: "Silence",
    description: "Bruit de crayon sur papier", lore: "Jeremy dessine",
    image: null, sound: "pencil_loop", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "SUS-002", type: "Objet", roomLabel: "Dining Area",
    night: 2, hourStr: "01h00", chance: 0.1, triggerStr: "Retour caméra",
    description: "Laisse rouge oubliée", lore: "Dernière promenade",
    image: "SUS-002.png", sound: "chain", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: true
  },
  {
    id: "SUS-011", type: "Objet", roomLabel: "Dining Area",
    night: 2, hourStr: "Toute nuit", chance: 0.08, triggerStr: "Observer",
    description: "Gamelle déplacée", lore: "Quelqu'un est revenu",
    image: "SUS-011.png", sound: "bowl", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "SUS-012", type: "Objet", roomLabel: "Dining Area",
    night: 2, hourStr: "Toute nuit", chance: 0.07, triggerStr: "Observer",
    description: "Laisse au sol", lore: "Dernière promenade",
    image: "SUS-012.png", sound: "chain", js: null,
    terminal: "LOST_PETS", journal: "NEWS_SUS_02", tape: "TAPE_SUS_02", evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "FRT-003", type: "Overlay", roomLabel: "Pirate Cove",
    night: 2, hourStr: "Toute nuit", chance: 0.12, triggerStr: "Retour caméra",
    description: "La voiture change de position", lore: "Souvenir vivant",
    image: "FRT-003.png", sound: null, js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-006", type: "Son", roomLabel: "Bureau",
    night: 2, hourStr: "02h20", chance: 0.07, triggerStr: "Silence",
    description: "Petite voiture qui roule", lore: "Fritz traverse le couloir",
    image: null, sound: "toy_car", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-011", type: "Objet", roomLabel: "West Hall",
    night: 2, hourStr: "Toute nuit", chance: 0.08, triggerStr: "Observer",
    description: "Voiture rouge", lore: "Jouet favori de Fritz",
    image: "FRT-011.png", sound: "toy_roll", js: null,
    terminal: "PIRATE", journal: "NEWS_FRT_01", tape: "TAPE_FRT_01", evolution: "",
    animatronic: "Foxy", realised: false
  },

  // ---------- Nuit 3 ----------
  {
    id: "JER-008", type: "Décor", roomLabel: "Supply Closet",
    night: 3, hourStr: "01h00", chance: 0.06, triggerStr: "Observer",
    description: "Deux feuilles sont au sol", lore: "Dessins abandonnés",
    image: "JER-008.png", sound: "paper", js: null,
    terminal: "LOST_ART", journal: "NEWS_JER_02", tape: "TAPE_JER_02", evolution: "",
    animatronic: "Bonnie", realised: true
  },
  {
    id: "SUS-006", type: "Objet", roomLabel: "East Hall",
    night: 3, hourStr: "01h30", chance: 0.06, triggerStr: "Observer",
    description: "???", lore: "Objet perdu",
    image: "SUS-006.png", sound: "bell", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "FRT-004", type: "Objet", roomLabel: "Pirate Cove",
    night: 3, hourStr: "01h45", chance: 0.06, triggerStr: "Observer",
    description: "Bateau pirate miniature", lore: "Jeu abandonné",
    image: "FRT-004.png", sound: "wood", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "GAB-007", type: "Objet", roomLabel: "Dining Area",
    night: 3, hourStr: "00h00", chance: 0.09, triggerStr: "Observer",
    description: "Boîte cadeau fermée", lore: "Cadeau jamais ouvert",
    image: "GAB-007.png", sound: "paper", js: null,
    terminal: "BALLOON", journal: null, tape: null, evolution: "",
    animatronic: "Freddy", realised: true
  },
  {
    id: "JER-026", type: "IA", roomLabel: "Backstage",
    night: 3, hourStr: "01h30", chance: 0.08, triggerStr: "Observer 8s",
    description: "Bonnie regarde un dessin", lore: "Il contemple l'œuvre de Jeremy",
    image: "JER-026.png", sound: "breath", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "SUS-026", type: "IA", roomLabel: "Restroom",
    night: 3, hourStr: "02h00", chance: 0.06, triggerStr: "Retour caméra",
    description: "Chica regarde la cuisine", lore: "Elle cherche quelque chose",
    image: "SUS-026.png", sound: "servo", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: true
  },
  {
    id: "FRT-021", type: "IA", roomLabel: "Pirate Cove",
    night: 3, hourStr: "02h30", chance: 0.06, triggerStr: "Observer 8 s",
    description: "Foxy regarde la voiture", lore: "Il surveille le jouet",
    image: "FRT-021.png", sound: "servo", js: null,
    terminal: "TABLES", journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "JER-027", type: "IA", roomLabel: "Backstage",
    night: 3, hourStr: "02h30", chance: 0.07, triggerStr: "Observer 8s",
    description: "Bonnie dessine", lore: "Le dessin continue sans personne",
    image: "JER-027.png", sound: "scratch", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "FRT-007", type: "IA", roomLabel: "Pirate Cove",
    night: 3, hourStr: "03h00", chance: 0.04, triggerStr: "Observer 10 s",
    description: "Foxy ramasse le bateau", lore: "Le souvenir évolue",
    image: "FRT-007.png", sound: "wood", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-022", type: "IA", roomLabel: "Pirate Cove",
    night: 3, hourStr: "03h00", chance: 0.05, triggerStr: "Observer 8 s",
    description: "Foxy pousse le bateau", lore: "Le jeu continue",
    image: "FRT-022.png", sound: "wood", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "SUS-004", type: "IA", roomLabel: "Kitchen",
    night: 3, hourStr: "03h00", chance: 0.04, triggerStr: "Écoute 10 s",
    description: "Chica tourne la tête vers une porte", lore: "Elle « entend » quelque chose",
    image: "SUS-004.png", sound: "metal", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "JER-005", type: "Overlay", roomLabel: "Dining Area",
    night: 3, hourStr: "03h00", chance: 0.06, triggerStr: "Retour caméra",
    description: "Un dessin est accroché au mur", lore: "Personne ne l'avait vu",
    image: "JER-005.png", sound: null, js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: true
  },
  {
    id: "GAB-008", type: "Overlay", roomLabel: "Dining Area",
    night: 3, hourStr: "04h00", chance: 0.05, triggerStr: "Retour caméra",
    description: "Le cadeau est ouvert", lore: "Souvenir évolutif",
    image: "GAB-008.png", sound: null, js: "gift_open",
    terminal: null, journal: null, tape: "TAPE_GAB_03", evolution: "",
    animatronic: "Freddy", realised: true,
    requiresEvent: "GAB-007" // conservé manuellement : absent du CSV (colonne toujours vide), mais logique déjà présente dans ce fichier et cohérente avec la description (le cadeau ne peut s'ouvrir qu'après GAB-007)
  },
  {
    id: "FRT-016", type: "Overlay", roomLabel: "West Hall",
    night: 3, hourStr: "Retour caméra", chance: 0.06, triggerStr: "Retour caméra",
    description: "La voiture avance seule", lore: "Le jeu continue",
    image: "FRT-016.png", sound: "wheel", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "SUS-016", type: "Overlay", roomLabel: "Dining Area",
    night: 3, hourStr: "Retour caméra", chance: 0.06, triggerStr: "Retour caméra",
    description: "Cupcake orienté vers la caméra", lore: "Il semble observer",
    image: "SUS-016.png", sound: "ceramic", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "FRT-005", type: "Objet", roomLabel: "Pirate Cove",
    night: 3, hourStr: "Toute nuit", chance: 0.09, triggerStr: "Observer",
    description: "Coffre à trésor entrouvert", lore: "Fritz jouait aux pirates",
    image: "FRT-005.png", sound: "creak", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-008", type: "Décor", roomLabel: "Pirate Cove",
    night: 3, hourStr: "Toute nuit", chance: 0.06, triggerStr: "Observer",
    description: "Trois cubes en bois apparaissent", lore: "Jeu d'enfant",
    image: "FRT-008.png", sound: "block", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-012", type: "Objet", roomLabel: "Pirate Cove",
    night: 3, hourStr: "Toute nuit", chance: 0.07, triggerStr: "Observer",
    description: "Bateau pirate", lore: "Pirate Cove devient un terrain de jeu",
    image: "FRT-012.png", sound: "wood", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-013", type: "Objet", roomLabel: "Dining Area",
    night: 3, hourStr: "Toute nuit", chance: 0.06, triggerStr: "Observer",
    description: "Coffre miniature", lore: "Chasse au trésor imaginaire",
    image: "FRT-013.png", sound: "creak", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-014", type: "Objet", roomLabel: "West Hall",
    night: 3, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Cube en bois", lore: "Construction interrompue",
    image: "FRT-014.png", sound: "block", js: null,
    terminal: "LOST_TOYS", journal: "NEWS_FRT_02", tape: "TAPE_FRT_02", evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "GAB-021", type: "Décor", roomLabel: "Dining Area",
    night: 3, hourStr: "Toute nuit", chance: 0.08, triggerStr: "Observer",
    description: "Horloge bloquée à 17h45", lore: "L'heure de la fête",
    image: "GAB-021.png", sound: "clock", js: null,
    terminal: null, journal: "NEWS_GAB_02", tape: null, evolution: "",
    animatronic: "Freddy", realised: false
  },
  {
    id: "JER-021", type: "Objet", roomLabel: "Supply Closet",
    night: 3, hourStr: "Toute nuit", chance: 0.1, triggerStr: "Observer",
    description: "Crayon bleu au sol", lore: "Jeremy a commencé son dessin",
    image: "JER-021.png", sound: "paper", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "JER-022", type: "Objet", roomLabel: "Supply Closet",
    night: 3, hourStr: "Toute nuit", chance: 0.08, triggerStr: "Observer",
    description: "Crayon rouge cassé", lore: "Quelqu'un s'est interrompu",
    image: "JER-022.png", sound: "crack", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "SUS-017", type: "Overlay", roomLabel: "Dining Area",
    night: 3, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Cupcake regarde la porte", lore: "Il attend quelqu'un",
    image: "SUS-017.png", sound: "ceramic", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "SUS-021", type: "Son", roomLabel: "Kitchen",
    night: 3, hourStr: "Toute nuit", chance: 0.06, triggerStr: "Écoute",
    description: "Gamelle métallique déplacée", lore: "Quelqu'un est dans la cuisine",
    image: null, sound: "bowl_move", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "SUS-022", type: "Son", roomLabel: "Kitchen",
    night: 3, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Écoute",
    description: "Placard ouvert", lore: "Une recherche silencieuse",
    image: null, sound: "cupboard", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "GAB-009", type: "Objet", roomLabel: "Dining Area",
    night: 3, hourStr: "Toute nuit", chance: 0.08, triggerStr: "Observer",
    description: "Part de gâteau oubliée", lore: "Dernier anniversaire",
    image: "GAB-009.png", sound: "flies", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Freddy", realised: true
  },
  {
    id: "GAB-010", type: "Objet", roomLabel: "Dining Area",
    night: 3, hourStr: "Toute nuit", chance: 0.06, triggerStr: "Observer",
    description: "Verre en carton renversé", lore: "Fête interrompue",
    image: "GAB-010.png", sound: "drip", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Freddy", realised: true
  },
  {
    id: "GAB-011", type: "IA", roomLabel: "Stage",
    night: 3, hourStr: "Toute nuit", chance: 0.06, triggerStr: "Retour caméra",
    description: "Freddy regarde toujours la même chaise", lore: "Gabriel attend son père",
    image: "GAB-011.png", sound: "breathe", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Freddy", realised: true
  },
  {
    id: "JER-007", type: "Objet", roomLabel: "Supply Closet",
    night: 3, hourStr: "Toute nuit", chance: 0.08, triggerStr: "Observer",
    description: "Une gomme est posée sur le sol, un dessin d'anniversaire est effacé", lore: "Quelqu'un corrige",
    image: "JER-007.png", sound: "eraser", js: null,
    terminal: "CLEANING", journal: "NEWS_JER_03", tape: "TAPE_JER_03", evolution: "",
    animatronic: "Bonnie", realised: true
  },
  {
    id: "SUS-005", type: "Overlay", roomLabel: "Dining Area",
    night: 3, hourStr: "Toute nuit", chance: 0.07, triggerStr: "Observer",
    description: "Cupcake légèrement déplacé", lore: "Chica protège un souvenir",
    image: "SUS-005.png", sound: "ceramic", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: true
  },
  {
    id: "SUS-013", type: "Objet", roomLabel: "East Hall",
    night: 3, hourStr: "Toute nuit", chance: 0.06, triggerStr: "Observer",
    description: "Collier usé", lore: "Objet jamais récupéré",
    image: "SUS-013.png", sound: "bell", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: true
  },
  {
    id: "SUS-014", type: "Décor", roomLabel: "East Hall",
    night: 3, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Empreintes de pattes poussiéreuses", lore: "Vieilles traces",
    image: "SUS-014.png", sound: "step", js: null,
    terminal: "KITCHEN", journal: "NEWS_SUS_03", tape: "TAPE_SUS_03", evolution: "",
    animatronic: "Chica", realised: true
  },

  // ---------- Nuit 4 ----------
  {
    id: "JER-028", type: "IA", roomLabel: "Backstage",
    night: 4, hourStr: "01h00", chance: 0.06, triggerStr: "Retour caméra",
    description: "Bonnie tient une feuille", lore: "Il protège un souvenir",
    image: "JER-028.png", sound: "paper", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "GAB-012", type: "IA", roomLabel: "Stage",
    night: 4, hourStr: "02h00", chance: 0.05, triggerStr: "Retour caméra",
    description: "Freddy regarde la caméra quelques secondes", lore: "Michael ressemble à William",
    image: "GAB-012.png", sound: "servo", js: null,
    terminal: "LOST", journal: null, tape: null, evolution: "",
    animatronic: "Freddy", realised: true
  },
  {
    id: "FRT-023", type: "IA", roomLabel: "Pirate Cove",
    night: 4, hourStr: "02h30", chance: 0.05, triggerStr: "Observer 8 s",
    description: "Foxy ramasse un cube", lore: "Il construit quelque chose",
    image: "FRT-023.png", sound: "block", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "JER-009", type: "IA", roomLabel: "West Hall",
    night: 4, hourStr: "02h30", chance: 0.04, triggerStr: "Retour caméra",
    description: "Bonnie tourne une feuille", lore: "Le dessin continue",
    image: "JER-009.png", sound: "page", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: true
  },
  {
    id: "SUS-027", type: "IA", roomLabel: "Stage",
    night: 4, hourStr: "02h30", chance: 0.05, triggerStr: "Retour caméra",
    description: "Chica protège le Cupcake", lore: "Elle garde un souvenir",
    image: "SUS-027.png", sound: "breathe", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: true
  },
  {
    id: "SUS-007", type: "Son", roomLabel: "Bureau",
    night: 4, hourStr: "02h45", chance: 0.03, triggerStr: "Silence",
    description: "Petit jappement très faible", lore: "Souvenir",
    image: null, sound: "puppy", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "JER-029", type: "IA", roomLabel: "Backstage",
    night: 4, hourStr: "03h00", chance: 0.05, triggerStr: "Retour caméra",
    description: "Bonnie baisse la tête devant un dessin", lore: "Comme un instant de recueillement",
    image: "JER-029.png", sound: "servo", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "GAB-013", type: "IA", roomLabel: "Stage",
    night: 4, hourStr: "03h00", chance: 0.05, triggerStr: "Observer",
    description: "Freddy baisse légèrement la tête", lore: "Résignation",
    image: "GAB-013.png", sound: "servo", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Freddy", realised: true
  },
  {
    id: "SUS-028", type: "IA", roomLabel: "Stage",
    night: 4, hourStr: "03h00", chance: 0.04, triggerStr: "Observer 10 s",
    description: "Chica baisse la tête", lore: "Comme si elle pleurait",
    image: "SUS-028.png", sound: "servo", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: true
  },
  {
    id: "FRT-024", type: "IA", roomLabel: "Pirate Cove",
    night: 4, hourStr: "03h30", chance: 0.04, triggerStr: "Retour caméra",
    description: "Foxy laisse tomber un jouet", lore: "Comme un enfant distrait",
    image: "FRT-024.png", sound: "drop", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-017", type: "Overlay", roomLabel: "Dining Area",
    night: 4, hourStr: "Retour caméra", chance: 0.05, triggerStr: "Retour caméra",
    description: "Le bateau change d'étagère", lore: "Quelqu'un joue encore",
    image: "FRT-017.png", sound: "wood", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-018", type: "Overlay", roomLabel: "West Hall",
    night: 4, hourStr: "Retour caméra", chance: 0.05, triggerStr: "Retour caméra",
    description: "Un cube disparaît", lore: "La construction change",
    image: "FRT-018.png", sound: "block", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-027", type: "Overlay", roomLabel: "Pirate Cove",
    night: 4, hourStr: "Retour caméra", chance: 0.05, triggerStr: "Retour caméra",
    description: "Tour écroulée", lore: "Personne ne l'a vue tomber",
    image: "FRT-027.png", sound: "crash", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "GAB-022", type: "Overlay", roomLabel: "Dining Area",
    night: 4, hourStr: "Retour caméra", chance: 0.06, triggerStr: "Retour caméra",
    description: "Horloge repart quelques secondes", lore: "Le temps refuse d'avancer",
    image: "GAB-022.png", sound: "tick", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Freddy", realised: false
  },
  {
    id: "JER-024", type: "Décor", roomLabel: "Supply Closet",
    night: 4, hourStr: "Retour caméra", chance: 0.06, triggerStr: "Retour caméra",
    description: "Les crayons changent de place", lore: "Une présence continue le dessin",
    image: "JER-024.png", sound: "paper", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "SUS-018", type: "Overlay", roomLabel: "Dining Area",
    night: 4, hourStr: "Retour caméra", chance: 0.04, triggerStr: "Retour caméra",
    description: "Cupcake disparaît une seconde", lore: "Impossible à expliquer",
    image: "SUS-018.png", sound: "whoosh", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "SUS-019", type: "Overlay", roomLabel: "Dining Area",
    night: 4, hourStr: "Retour caméra", chance: 0.04, triggerStr: "Retour caméra",
    description: "Cupcake revient à sa place", lore: "Rien n'a changé...",
    image: "SUS-019.png", sound: "ceramic", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "FRT-009", type: "Overlay", roomLabel: "West Hall",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Retour caméra",
    description: "Petite voiture dans le couloir", lore: "Le souvenir sort de Pirate Cove",
    image: "FRT-009.png", sound: "wheel", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-015", type: "Objet", roomLabel: "Dining Area",
    night: 4, hourStr: "Toute nuit", chance: 0.04, triggerStr: "Observer",
    description: "Figurine pirate", lore: "Le capitaine du jeu",
    image: "FRT-015.png", sound: "figurine", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-026", type: "Décor", roomLabel: "Pirate Cove",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Retour caméra",
    description: "Tour de cubes construite", lore: "Un enfant est passé par là",
    image: "FRT-026.png", sound: "block", js: null,
    terminal: "MAINT_05", journal: "NEWS_FRT_03", tape: "TAPE_FRT_03", evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "GAB-023", type: "Décor", roomLabel: "Dining Area",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Une seconde horloge affiche une autre heure", lore: "Deux réalités",
    image: "GAB-023.png", sound: "clock_error", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Freddy", realised: false
  },
  {
    id: "JER-011", type: "Objet", roomLabel: "Backstage",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Dessin d'un soleil", lore: "Un souvenir heureux avant le drame",
    image: "JER-011.png", sound: null, js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "JER-016", type: "Objet", roomLabel: "Backstage",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Dessin de cinq enfants", lore: "Première allusion aux victimes",
    image: "JER-016.png", sound: null, js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "JER-017", type: "Objet", roomLabel: "Backstage",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Dessin barré", lore: "Quelqu'un tente d'effacer le souvenir",
    image: "JER-017.png", sound: null, js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "JER-018", type: "Objet", roomLabel: "Backstage",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Dessin déchiré", lore: "La mémoire se fragmente",
    image: "JER-018.png", sound: null, js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "JER-019", type: "Objet", roomLabel: "Backstage",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Dessin inachevé", lore: "Le souvenir reste bloqué",
    image: "JER-019.png", sound: null, js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "JER-020", type: "Objet", roomLabel: "Backstage",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Feuille totalement blanche", lore: "Le souvenir s'efface",
    image: "JER-020.png", sound: null, js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "JER-023", type: "Objet", roomLabel: "Supply Closet",
    night: 4, hourStr: "Toute nuit", chance: 0.07, triggerStr: "Retour caméra",
    description: "Le crayon vert disparaît", lore: "Le souvenir s'efface",
    image: "JER-023.png", sound: "whoosh", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "SUS-008", type: "Overlay", roomLabel: "Kitchen",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Retour écoute",
    description: "Bruit de gamelle déplacée", lore: "Quelqu'un nourrit encore le chien",
    image: "SUS-008.png", sound: "bowl_move", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "SUS-015", type: "Objet", roomLabel: "Dining Area",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Petite balle jaune sous une chaise", lore: "Jouet oublié",
    image: "SUS-015.png", sound: "ball", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "SUS-023", type: "Son", roomLabel: "Kitchen",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Écoute",
    description: "Couverts qui tombent", lore: "Bruit métallique inquiétant",
    image: null, sound: "cutlery", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "SUS-024", type: "Son", roomLabel: "Kitchen",
    night: 4, hourStr: "Toute nuit", chance: 0.04, triggerStr: "Écoute",
    description: "Eau qui coule", lore: "Quelqu'un utilise l'évier",
    image: null, sound: "water", js: null,
    terminal: "COOKING", journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "GAB-014", type: "IA", roomLabel: "Dining Area",
    night: 4, hourStr: "Toute nuit", chance: 0.04, triggerStr: "Observer",
    description: "Freddy semble regarder un ballon", lore: "Dernier souvenir",
    image: "GAB-014.png", sound: "metal", js: null,
    terminal: null, journal: "NEWS_GAB_03", tape: null, evolution: "",
    animatronic: "Freddy", realised: true
  },
  {
    id: "JER-010", type: "Objet", roomLabel: "Backstage",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Un dessin d'enfant est posé sur une table", lore: "Aucun adulte ne l'a vu",
    image: "JER-010.png", sound: null, js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: true
  },
  {
    id: "JER-012", type: "Objet", roomLabel: "Backstage",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Dessin de Freddy", lore: "Jeremy admirait les animatroniques",
    image: "JER-012.png", sound: null, js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: true
  },
  {
    id: "JER-013", type: "Objet", roomLabel: "Backstage",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Dessin de Bonnie", lore: "Bonnie devient son refuge",
    image: "JER-013.png", sound: null, js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: true
  },
  {
    id: "JER-014", type: "Objet", roomLabel: "Backstage",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Dessin d'une maison", lore: "Il voulait rentrer chez lui",
    image: "JER-014.png", sound: null, js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: true
  },
  {
    id: "JER-015", type: "Objet", roomLabel: "Backstage",
    night: 4, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Dessin d'une famille", lore: "Les parents ne reviendront jamais",
    image: "JER-015.png", sound: null, js: null,
    terminal: "CHILDREN_ART", journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: true
  },

  // ---------- Nuit 5 ----------
  {
    id: "FRT-010", type: "IA", roomLabel: "Pirate Cove",
    night: 5, hourStr: "03h30", chance: 0.02, triggerStr: "Retour caméra",
    description: "Foxy aligne soigneusement tous les jouets", lore: "Fritz termine sa partie",
    image: "FRT-010.png", sound: "toys", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "SUS-029", type: "IA", roomLabel: "Stage",
    night: 5, hourStr: "03h30", chance: 0.03, triggerStr: "Silence",
    description: "Chica semble écouter", lore: "Elle entend encore le chien",
    image: "SUS-029.png", sound: "static", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: true
  },
  {
    id: "FRT-025", type: "IA", roomLabel: "Pirate Cove",
    night: 5, hourStr: "03h45", chance: 0.03, triggerStr: "Observer 10 s",
    description: "Foxy regarde le coffre ouvert", lore: "Il cherche un trésor",
    image: "FRT-025.png", sound: "creak", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "GAB-024", type: "Overlay", roomLabel: "Stage",
    night: 5, hourStr: "04h00", chance: 0.04, triggerStr: "Retour caméra",
    description: "Les aiguilles tournent à l'envers", lore: "La fête revient en arrière",
    image: "GAB-024.png", sound: "reverse", js: null,
    terminal: "GUESTS", journal: null, tape: null, evolution: "",
    animatronic: "Freddy", realised: false
  },
  {
    id: "JER-030", type: "IA", roomLabel: "Backstage",
    night: 5, hourStr: "04h00", chance: 0.04, triggerStr: "Observer 10s",
    description: "Bonnie repose doucement le crayon", lore: "Le dessin est enfin terminé",
    image: "JER-030.png", sound: "drop", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "SUS-010", type: "IA", roomLabel: "Stage",
    night: 5, hourStr: "04h00", chance: 0.02, triggerStr: "Retour caméra",
    description: "Chica regarde le joueur sans bouger", lore: "Confusion avec Michael",
    image: "SUS-010.png", sound: "breathe", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "SUS-030", type: "IA", roomLabel: "Stage",
    night: 5, hourStr: "04h30", chance: 0.02, triggerStr: "Retour caméra",
    description: "Chica s'arrête devant une porte fermée", lore: "Elle attend toujours le retour de Susie",
    image: "SUS-030.png", sound: "door", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: true
  },
  {
    id: "GAB-015", type: "IA", roomLabel: "Dining Area",
    night: 5, hourStr: "05h00", chance: 0.03, triggerStr: "Retour caméra",
    description: "Freddy fixe une boîte cadeau", lore: "Cadeau jamais ouvert",
    image: "GAB-015.png", sound: "breathe", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Freddy", realised: true
  },
  {
    id: "FRT-020", type: "Overlay", roomLabel: "Pirate Cove",
    night: 5, hourStr: "05h55", chance: 0.03, triggerStr: "Heure",
    description: "Tous les objets reviennent à leur place", lore: "Comme si rien ne s'était passé",
    image: "FRT-020.png", sound: "reset", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-030", type: "Décor", roomLabel: "Pirate Cove",
    night: 5, hourStr: "05h55", chance: 0.02, triggerStr: "Heure",
    description: "Jouets parfaitement rangés", lore: "Fritz a terminé de jouer",
    image: "FRT-030.png", sound: "toys", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "GAB-025", type: "Glitch", roomLabel: "Dining Area",
    night: 5, hourStr: "05h55", chance: 0.02, triggerStr: "Heure",
    description: "L'horloge revient à 00:00", lore: "Boucle éternelle",
    image: "GAB-025.png", sound: "glitch", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Freddy", realised: false
  },
  {
    id: "FRT-019", type: "Overlay", roomLabel: "Pirate Cove",
    night: 5, hourStr: "Retour caméra", chance: 0.04, triggerStr: "Retour caméra",
    description: "Le coffre est refermé", lore: "La partie est terminée",
    image: "FRT-019.png", sound: "creak", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-028", type: "Objet", roomLabel: "Dining Area",
    night: 5, hourStr: "Toute nuit", chance: 0.04, triggerStr: "Observer",
    description: "Voiture sous une table", lore: "Fritz s'est caché en jouant",
    image: "FRT-028.png", sound: "wheel", js: null,
    terminal: "STAGE_PROP", journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "FRT-029", type: "Objet", roomLabel: "Pirate Cove",
    night: 5, hourStr: "Toute nuit", chance: 0.03, triggerStr: "Observer",
    description: "Trésor sorti du coffre", lore: "Le jeu touche à sa fin",
    image: "FRT-029.png", sound: "coins", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Foxy", realised: false
  },
  {
    id: "JER-025", type: "Objet", roomLabel: "Supply Closet",
    night: 5, hourStr: "Toute nuit", chance: 0.05, triggerStr: "Observer",
    description: "Un seul crayon reste sur la table", lore: "Il ne reste qu'un souvenir",
    image: "JER-025.png", sound: "pencil", js: null,
    terminal: "SCANNER", journal: null, tape: null, evolution: "",
    animatronic: "Bonnie", realised: false
  },
  {
    id: "SUS-009", type: "Objet", roomLabel: "Dining Area",
    night: 5, hourStr: "Toute nuit", chance: 0.04, triggerStr: "Observer",
    description: "Ruban jaune au sol", lore: "Susie",
    image: "SUS-009.png", sound: "cloth", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "SUS-020", type: "Objet", roomLabel: "Dining Area",
    night: 5, hourStr: "Toute nuit", chance: 0.03, triggerStr: "Observer",
    description: "Cupcake légèrement fissuré", lore: "Même lui se détériore",
    image: "SUS-020.png", sound: "crack", js: null,
    terminal: null, journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
  },
  {
    id: "SUS-025", type: "Son", roomLabel: "Kitchen",
    night: 5, hourStr: "Toute nuit", chance: 0.03, triggerStr: "Silence",
    description: "Petit halètement très discret", lore: "Comme un chien fatigué",
    image: null, sound: "pant", js: null,
    terminal: "REPORT_87", journal: null, tape: null, evolution: "",
    animatronic: "Chica", realised: false
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
  {
    id: "Animatronic-001", priority: "Haute", type: "Overlay", roomLabel: "Stage",
    night: 0, hourStr: "Toute nuit", chance: 0.50, triggerStr: "Observer",
    image: "Animatronic-001.jpg", animatronic: "Chica,Bonnie,Freddy", sound: "breath_2", 
    terminal: null, journal: null, tape: null, evolution: ""
  },
  {
    id: "Freddy-001", priority: "Haute", type: "Overlay", roomLabel: "Stage",
    night: 0, hourStr: "Toute nuit", chance: 0.50, triggerStr: "Observer",
    image: "Freddy-001.jpg", animatronic: "Freddy", sound: "breath_3", 
    terminal: null, journal: null, tape: null, evolution: ""
  },
     {
    id: "CHICA-002", priority: "Haute", type: "Overlay", roomLabel: "Dining",
    night: 0, hourStr: "Toute nuit", chance: 0.50, triggerStr: "Observer",
    image: "CHICA-002.jpg", animatronic: "Chica", sound: "breath_2", 
    terminal: null, journal: null, tape: null, evolution: ""
  },
    {
    id: "BONNIE-002", priority: "Haute", type: "Overlay", roomLabel: "Dining",
    night: 0, hourStr: "Toute nuit", chance: 0.50, triggerStr: "Observer",
    image: "BONNIE-002.jpg", animatronic: "Bonnie", sound: "breath_1", 
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
