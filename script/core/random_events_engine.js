/* ============================================================
   RANDOM EVENTS — MOTEUR
   ------------------------------------------------------------
   Dépend de random_events_data.js (doit être chargé AVANT ce
   fichier dans ton HTML).

   Ce que fait ce moteur :
   1. Précharge les images "cachées" (GAB-XXX.png) dans un
      registre dédié (loadedHiddenEventImages).
   2. À chaque frame, évalue les conditions (nuit / heure /
      caméra affichée / type de déclencheur) et tire au sort
      si un événement doit s'activer.
   3. Joue le son associé via ta fonction playSound() existante.
   4. Dessine l'image de l'événement actif par-dessus la pièce
      (à appeler depuis drawWithCamera, juste après le dessin
      de la pièce et avant le restore()).
   5. Permet d'enregistrer des handlers JS custom par événement
      (RANDOM_EVENT_HANDLERS) pour la logique spécifique
      (ex: GAB-008 ne peut apparaître que si GAB-007 a eu lieu).

*/
function getCurrentNight() {
  // Retourne le numéro de la nuit actuelle depuis la variable _night
  return (typeof _night !== 'undefined') ? _night : 1;
}

function getCurrentHourDecimal() {
  // Retourne l'heure en format décimal (0-6) depuis gameTime
  // ex: 02h15 → 2.25
  if (typeof gameTime !== 'undefined' && gameTime) {
    return gameTime.hours + (gameTime.minutes / 60);
  }
  return 0;
}

/* ============================================================
   ÉTAT INTERNE
   ============================================================ */

// Images préchargées des événements : { "GAB-001": HTMLImageElement, ... }
const loadedHiddenEventImages = {};

// État runtime par événement :
// { triggered: bool, active: bool, resolvedTonight: bool,
//   continuousTimer: number, remainingDisplay: number }
const eventRuntimeState = {};

// Temps (en secondes de jeu) passé en continu sur la caméra actuelle
let _currentCameraContinuousTime = 0;
let _lastObservedCameraId = null;
let _cameraVisitToken = 0;

// Mémorise pour quel "passage caméra" le son d'un event a déjà été joué
const _lastSoundCameraVisitByEvent = {};

// Pour le déclencheur "silence"
let _lastUserInputTimestamp = Date.now();
const SILENCE_THRESHOLD_SECONDS = 8; // doit être inactif depuis 8s

// Combien de temps un événement déclenché reste visible à l'écran
// (sauf si evolution = "persistant", auquel cas il reste toute la nuit)
const DEFAULT_EVENT_DISPLAY_SECONDS = 6;

// À quelle fréquence on retente une chance pour les triggers
// "observe" / "silence" (pour ne pas tirer 60 fois par seconde)
const CHANCE_CHECK_INTERVAL_SECONDS = 1;
let _chanceCheckTimer = 0;
let _globalCheckTimer = 0;

function initEventRuntimeState() {
  if (typeof RANDOM_EVENTS === 'undefined') {
    console.warn('[RandomEvents] RANDOM_EVENTS non défini, retard d\'initialisation');
    return;
  }
  Object.keys(RANDOM_EVENTS).forEach(id => {
    eventRuntimeState[id] = {
      triggered: false,
      active: false,
      resolvedTonight: false,
      continuousTimer: 0,
      remainingDisplay: 0
    };
  });
}
if (typeof RANDOM_EVENTS !== 'undefined') {
  initEventRuntimeState();
}

/**
 * Réinitialise l'état des événements (à appeler au début de
 * chaque nouvelle nuit, en plus de la remise à zéro habituelle
 * de ton jeu).
 */
function resetRandomEventsForNewNight() {
  initEventRuntimeState();
  _currentCameraContinuousTime = 0;
  _lastObservedCameraId = null;
  _cameraVisitToken = 0;
  _chanceCheckTimer = 0;
  _globalCheckTimer = 0;
  Object.keys(_lastSoundCameraVisitByEvent).forEach(id => delete _lastSoundCameraVisitByEvent[id]);
}

/* ============================================================
   HANDLERS CUSTOM PAR ÉVÉNEMENT (optionnel)
   ------------------------------------------------------------
   Ajoute une entrée ici si un événement a besoin d'une logique
   spécifique au moment où il se déclenche (au-delà d'afficher
   l'image + jouer le son). Le nom de clé correspond au champ
   `js` du tableau (ex. "gift_open").
   ============================================================ */
const RANDOM_EVENT_HANDLERS = {
  gift_open: function(event) {
    // GAB-008 ne peut survenir que si GAB-007 a déjà eu lieu cette nuit
    const required = event.requiresEvent;
    if (required && !eventRuntimeState[required]?.triggered) {
      return false; // annule le déclenchement
    }
    return true;
  },
  // CASSIDY-07 (cassette secrète finale) ne peut survenir que si les 6
  // cassettes secrètes précédentes ont déjà été débloquées — potentiellement
  // lors de nuits antérieures, donc via Collectibles (persistant) plutôt que
  // eventRuntimeState (remis à zéro chaque nuit).
  cassidy_finale: function() {
    return typeof Collectibles !== 'undefined' && Collectibles.isTapeUnlocked('TAPE_ERREUR_06');
  }
  // Ajoute d'autres handlers ici : chair, balloon, plate, stare, etc.
  // function(event) { ... return true/false; }
};

/**
 * Normalise une liste d'animatronics ("Chica,Bonnie" ou "Bonnie, Chica")
 * en une clé comparable ("Bonnie,Chica"), pour que l'ordre et les espaces
 * du JSON n'empêchent pas la correspondance avec l'état de la pièce.
 */
function normalizeAnimatronicList(value) {
  if (!value) return "";
  return value.split(',').map(name => name.trim()).filter(Boolean).sort().join(',');
}

function runCustomHandler(event) {
  const handler = event.jsHandler && RANDOM_EVENT_HANDLERS[event.jsHandler];
  if (!handler) return true; // pas de handler = toujours autorisé
  return handler(event) !== false;
}

/* ============================================================
   PRÉCHARGEMENT DES IMAGES
   ============================================================ */
function preloadHiddenEventImages() {
  if (typeof RANDOM_EVENTS === 'undefined') {
    console.warn('[RandomEvents] Préchargement ignoré, RANDOM_EVENTS non défini');
    return;
  }
  Object.values(RANDOM_EVENTS).forEach(event => {
    if (!event.imagePath) return; // ex: GAB-006 n'a pas d'image
    const img = new Image();
    img.src = event.imagePath;
    img.onerror = () => {
      console.warn(`[RandomEvents] Image introuvable pour ${event.id} : ${event.imagePath}`);
    };
    loadedHiddenEventImages[event.id] = img;
  });
}

/* ============================================================
   CONDITIONS
   ============================================================ */
function isEventTimeWindowActive(event) {
  const eventNight = Number(event.night);
  if (eventNight !== 0 && eventNight !== getCurrentNight()) return false;
  const hour = getCurrentHourDecimal();
  return hour >= event.hourRange.start && hour < event.hourRange.end;
}

function isEventEligibleNow(event, cameraId) {
  const state = eventRuntimeState[event.id];
  if (state.resolvedTonight && event.evolution !== "revient") return false;
  if (event.cameraId && event.cameraId !== cameraId) return false;
  if (!isEventTimeWindowActive(event)) return false;
  return true;
}

/**
 * Tire au sort si l'événement se déclenche, en respectant sa
 * `chance`. Retourne true si déclenché.
 */
function rollEventChance(event) {
  return Math.random() < event.chance;
}

/* ============================================================
   DÉCLENCHEMENT / RÉSOLUTION
   ============================================================ */
function triggerEvent(event) {
  if (!runCustomHandler(event)) return;

  const state = eventRuntimeState[event.id];
  state.triggered = true;
  state.active = true;
  state.resolvedTonight = true;
  state.remainingDisplay = (event.evolution === "persistant")
    ? Infinity
    : DEFAULT_EVENT_DISPLAY_SECONDS;

  // Débloque la cassette/le journal associés, de façon persistante
  // (cf. script/core/collectibles.js — contrairement à l'état ci-dessus,
  // remis à zéro chaque nuit, ce déblocage reste acquis pour la partie).
  if (typeof Collectibles !== 'undefined') {
    if (event.tape) Collectibles.unlockTape(event.tape);
    if (event.journal) Collectibles.unlockJournal(event.journal);
  }

  //console.log(`[RandomEvents] Déclenché : ${event.id} — ${event.description}`);
}

function isTerminalCommandUnlocked(commandId) {
  const normalized = (commandId || '').trim().toUpperCase();
  if (!normalized || typeof RANDOM_EVENTS === 'undefined') return false;

  const matchingEvents = Object.values(RANDOM_EVENTS).filter(event => {
    return typeof event.terminal === 'string' && event.terminal.toUpperCase() === normalized;
  });

  // Commande non liée à un random event : pas de verrouillage par ce moteur.
  if (matchingEvents.length === 0) return true;

  return matchingEvents.some(event => eventRuntimeState[event.id]?.triggered === true);
}

function getActiveEventForCamera(cameraId) {
  return Object.values(RANDOM_EVENTS).find(event => {
    const state = eventRuntimeState[event.id];
    return state.active && event.cameraId === cameraId;
  }) || null;
}

/* ============================================================
   BOUCLE PRINCIPALE (appelée depuis onCamera)
   ============================================================ */
function updateRandomEvents(deltaSeconds, camera, room) {
  if (!camera) return;
  const cameraId = camera.id;

  // Gère le temps continu passé sur cette caméra (pour observeDuration)
  if (_lastObservedCameraId !== cameraId) {
    _currentCameraContinuousTime = 0;
    _lastObservedCameraId = cameraId;
    _cameraVisitToken += 1;
  } else {
    _currentCameraContinuousTime += deltaSeconds;
  }

  // Fait diminuer l'affichage des événements actifs non-persistants
  Object.values(RANDOM_EVENTS).forEach(event => {
    const state = eventRuntimeState[event.id];
    if (state.active && state.remainingDisplay !== Infinity) {
      state.remainingDisplay -= deltaSeconds;
      if (state.remainingDisplay <= 0) {
        state.active = false;
      }
    }
  });

  // Ne tente une nouvelle chance qu'à intervalle régulier
  _chanceCheckTimer += deltaSeconds;
  if (_chanceCheckTimer < CHANCE_CHECK_INTERVAL_SECONDS) return;
  _chanceCheckTimer = 0;

  Object.values(RANDOM_EVENTS).forEach(event => {
    if (!isEventEligibleNow(event, cameraId)) return;

    const state = eventRuntimeState[event.id];

    if (event.trigger.type === "observe") {
      if (rollEventChance(event)) triggerEvent(event);
    } else if (event.trigger.type === "observeDuration") {
      if (_currentCameraContinuousTime >= event.trigger.duration && rollEventChance(event)) {
        triggerEvent(event);
      }
    }
    // "cameraReturn" est géré dans notifyCameraSwitch(), pas ici
    // "silence" et "time" sont gérés dans updateGlobalEvents(), pas ici
  });
}

/**
 * À appeler quand le joueur bascule vers une nouvelle caméra
 * (depuis activateCamera). Gère les événements de type
 * "Retour caméra".
 */
function notifyCameraSwitch(cameraId) {
  Object.values(RANDOM_EVENTS).forEach(event => {
    if (event.trigger.type !== "cameraReturn") return;
    if (!isEventEligibleNow(event, cameraId)) return;
    if (rollEventChance(event)) triggerEvent(event);
  });
}

/**
 * À appeler sur chaque input utilisateur (clic, touche) pour
 * détecter les périodes de silence (GAB-006 et similaires).
 */
function notifyUserInput() {
  _lastUserInputTimestamp = Date.now();
}

/**
 * Identifiant de la caméra actuellement affichée, ou null si le joueur
 * est dans le bureau. Lu depuis l'état global du jeu (camera.js).
 */
function getWatchedCameraId() {
  if (typeof activeView === 'undefined' || activeView !== 'camera') return null;
  return (typeof activeCamera !== 'undefined') ? activeCamera : null;
}

/**
 * Déclencheur "silence" : le joueur est resté inactif au moins
 * SILENCE_THRESHOLD_SECONDS. Un événement sans caméra (roomLabel "Bureau")
 * est évalué quelle que soit la vue ; un événement rattaché à une salle
 * exige en plus que sa caméra soit affichée, sinon le joueur ne pourrait
 * ni voir ni entendre ce qui s'y passe.
 */
function rollSilenceEvents(watchedCameraId) {
  const silentForSeconds = (Date.now() - _lastUserInputTimestamp) / 1000;
  if (silentForSeconds < SILENCE_THRESHOLD_SECONDS) return;

  Object.values(RANDOM_EVENTS).forEach(event => {
    if (event.trigger.type !== "silence") return;
    if (event.cameraId !== null && event.cameraId !== watchedCameraId) return;
    const state = eventRuntimeState[event.id];
    if (state.resolvedTonight) return;
    if (!isEventTimeWindowActive(event)) return;
    if (rollEventChance(event)) triggerEvent(event);
  });
}

/**
 * Déclencheur "time" (colonne Déclencheur = "Heure") : seule la fenêtre
 * horaire compte, le joueur n'a rien à observer. L'image éventuelle reste
 * affichée sur la caméra de la salle pendant la durée habituelle.
 */
function rollTimedEvents() {
  Object.values(RANDOM_EVENTS).forEach(event => {
    if (event.trigger.type !== "time") return;
    const state = eventRuntimeState[event.id];
    if (state.resolvedTonight) return;
    if (!isEventTimeWindowActive(event)) return;
    if (rollEventChance(event)) triggerEvent(event);
  });
}

/**
 * À appeler à chaque frame depuis la boucle de jeu, quelle que soit la vue
 * affichée, pour les déclencheurs qui ne dépendent pas de l'observation
 * d'une caméra ("Silence" et "Heure").
 * @param {number} deltaSeconds - Temps écoulé depuis la frame précédente.
 */
function updateGlobalEvents(deltaSeconds) {
  if (typeof RANDOM_EVENTS === 'undefined') return;

  // Même cadence que updateRandomEvents : une tentative par seconde, pas une
  // par frame (sinon une chance de 0.05 se déclenche en moins d'une seconde).
  _globalCheckTimer += deltaSeconds;
  if (_globalCheckTimer < CHANCE_CHECK_INTERVAL_SECONDS) return;
  _globalCheckTimer = 0;

  rollSilenceEvents(getWatchedCameraId());
  rollTimedEvents();
}


/* ============================================================
   RENDU (appelé depuis drawWithCamera, dans le repère room)
   ============================================================ */
function drawActiveRandomEventOverlay(ctx, camera, room) {
  const event = getActiveEventForCamera(camera.id);
  let animatronic = "";
  const roomData = (typeof rooms !== 'undefined') ? rooms[camera.id] : null;
  if (roomData) {
    const _animatronic = [];
    if (roomData.b === 1) _animatronic.push('Bonnie');
    if (roomData.c === 1) _animatronic.push('Chica');
    if (roomData.f === 1) _animatronic.push('Freddy');
    if (roomData.foxy === 1) _animatronic.push('Foxy');
    if (_animatronic.length > 0) animatronic = _animatronic.join(', ');
  }

  // Si aucun événement actif ou si l'image n'est pas prête, ne rien dessiner
  if (!event || !event.imagePath) return;

  // Si l'événement a un animatronic associé, ne le dessine que si l'animatronic est présent dans la pièce (ex: GAB-001 ne se déclenche que si Bonnie est là).
  if (normalizeAnimatronicList(animatronic) !== normalizeAnimatronicList(event.animatronic)) return;
  

  const img = loadedHiddenEventImages[event.id];
  // Si l'image n'est pas encore chargée ou est invalide, ne rien dessiner
  if (!img || !img.complete || img.naturalWidth === 0) return;

  // Si l'événement a un son associé, le jouer (mais pas à chaque frame)
  if (event.sound) {
    // Ne rejoue pas le son tant qu'on reste sur la même caméra.
    if (!event.cameraId || _lastSoundCameraVisitByEvent[event.id] !== _cameraVisitToken) {
      playSound(event.sound); // réutilise ton système de son existant
      if (event.cameraId) {
        _lastSoundCameraVisitByEvent[event.id] = _cameraVisitToken;
      }
    }
  }

  //console.log(`[RandomEvents] Dessin de l'image cachée pour ${event.id} : ${event.imagePath}`);
  // Dessine l'image cachée par-dessus la pièce, alignée sur le
  // panoramique actuel de la pièce (même logique que drawRoom).
  const sourceX = Math.max(0, Math.min(room.cameraOffset, img.width - room.width));
  ctx.drawImage(
    img,
    sourceX, 0, room.width, img.height,
    0, 0, room.width, room.height
  );
}

/* ============================================================
   API PUBLIQUE EXPOSÉE (namespace global RandomEvents)
   ============================================================ */
const RandomEvents = {
  preload: preloadHiddenEventImages,
  update: updateRandomEvents,
  updateGlobal: updateGlobalEvents,
  notifyCameraSwitch,
  notifyUserInput,
  drawActiveOverlay: drawActiveRandomEventOverlay,
  resetForNewNight: resetRandomEventsForNewNight,
  isTerminalCommandUnlocked
};

// Rend RandomEvents accessible globalement
if (typeof window !== 'undefined') {
  window.RandomEvents = RandomEvents;
}
