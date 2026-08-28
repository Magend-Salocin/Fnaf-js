
let _night = 1;
const MAX_NIGHT = 6;

/**
 * Charge game_config.json (NIGHT_AI_LEVELS, POWER_SYSTEM) de facon
 * SYNCHRONE, pour la meme raison que les autres loaders JSON du
 * projet : ces constantes doivent etre pretes avant la suite du
 * script. Pour ajuster la difficulte, edite le JSON — pas ce fichier.
 */
function loadGameConfigSync() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "script/state/game_config.json", false);
    xhr.send(null);
    // En file://, un chargement reussi renvoie status 0 (pas de vrai code HTTP).
    if (xhr.status !== 0 && xhr.status !== 200) {
      console.error(`[Game] game_config.json : statut HTTP ${xhr.status}`);
      return { nightAiLevels: {}, powerSystem: { BASE_USAGE: 1, MAX_USAGE: 5, DRAIN_PER_SECOND: {} } };
    }
    return JSON.parse(xhr.responseText);
  } catch (err) {
    console.error("[Game] Impossible de charger game_config.json", err);
    return { nightAiLevels: {}, powerSystem: { BASE_USAGE: 1, MAX_USAGE: 5, DRAIN_PER_SECOND: {} } };
  }
}

const _gameConfigData = loadGameConfigSync();
const NIGHT_AI_LEVELS = _gameConfigData.nightAiLevels;

// Variables pour la gestion du temps (heures:minutes)
let gameTime = { hours: 0, minutes: 0 }; // Temps actuel dans le jeu (00:00 à 23:59)
const TICKS_PER_MINUTE = 120; // 120 ticks = 1 minute (1 tick = 1/120s)
const MINUTES_PER_HOUR = 60; // 60 minutes = 1 heure
let ticksSinceLastMinute = 0; // Compteur de ticks depuis la dernière minute


// Variables pour les tours de jeu (toutes les 5 minutes in-game)
const MINUTES_PER_TURN = 5; // Un tour toutes les 5 minutes
let minutesSinceLastTurn = 0; // Compteur de minutes depuis le dernier tour
let currentTurn = 1; // Numéro du tour actuel


let currentNight = null; // Instance de la classe Night représentant la nuit en cours

// Variables globales
let activeView = 'office';
let activeCamera = '0';
let lastActiveCamera = '1a';
let cameraUsageTimer = 0;
let power = 100;
let currentPowerUsageLevel = 1;

const POWER_SYSTEM = Object.freeze({
  ..._gameConfigData.powerSystem,
  DRAIN_PER_SECOND: Object.freeze(_gameConfigData.powerSystem.DRAIN_PER_SECOND)
});

const POWER_DISPLAY_CACHE = {
  value: null,
  usage: null,
  lang: null
};

var gameWin = false;
var gameEnd = false;

let gameLoopInterval;

let isUsingCamera = false;
let isVocalEnd = false;
let isPanningLeft = false;
let isPanningRight = false;
const panSpeed = 5; // Vitesse de déplacement (pixels par frame)
let autoPanDirection = 1;

const OFFICE_LOOK_POSITIONS = Object.freeze({
  left: -1,
  center: 0,
  right: 1
});
const OFFICE_LOOK_PAN_INTENSITY = 0.12;
let officeLookDirection = 'center';
let officeLookTargetDirection = 'center';
let officeLookCurrentOffset = OFFICE_LOOK_POSITIONS.center;
let officeLookTargetOffset = OFFICE_LOOK_POSITIONS.center;
let officeLookIsMoving = false;

// Variable pour suivre les événements en cours
const activeEvents = {};

// Initialisation du canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameStarted = false;

const translations = window.FNAF_TRANSLATIONS || {};
const defaultLanguage = window.FNAF_DEFAULT_LANGUAGE || 'fr';

let selectedLanguage = 'fr';