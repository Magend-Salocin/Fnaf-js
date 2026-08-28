
let _night = 1;
const MAX_NIGHT = 6;

const NIGHT_AI_LEVELS = {
  1: { freddy: 0, bonnie: 15, chica: 5, foxy: 0 },
  2: { freddy: 0, bonnie: 6, chica: 6, foxy: 8 },
  3: { freddy: 1, bonnie: 7, chica: 7, foxy: 4 },
  4: { freddy: 2, bonnie: 8, chica: 8, foxy: 6 },
  5: { freddy: 3, bonnie: 9, chica: 9, foxy: 8 },
  6: { freddy: 4, bonnie: 10, chica: 10, foxy: 12 }
};

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
  BASE_USAGE: 1,
  MAX_USAGE: 5,
  DRAIN_PER_SECOND: Object.freeze({
    1: 0.09,//1: 0.18,
    2: 0.27,
    3: 0.4,
    4: 0.65,
    5: 0.9
  })
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