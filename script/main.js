//main.js

// Initialisation du canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameStarted = false;

const translations = window.FNAF_TRANSLATIONS || {};
const defaultLanguage = window.FNAF_DEFAULT_LANGUAGE || 'fr';

let selectedLanguage = 'fr';

function applyLanguage(lang) {
  selectedLanguage = translations[lang] ? lang : defaultLanguage;
  const t = translations[selectedLanguage];

  document.documentElement.lang = selectedLanguage;
  document.getElementById('language-title').textContent = t.languageTitle;
  document.getElementById('language-subtitle').textContent = t.languageSubtitle;
  document.getElementById('lang-fr-btn').textContent = t.languageFrButton;
  document.getElementById('lang-en-btn').textContent = t.languageEnButton;
  document.getElementById('game-title').innerHTML = t.gameTitle;
  document.getElementById('start-game').textContent = t.startGame;
  document.getElementById('powerUsage').textContent = t.powerUsage;

  document.getElementById('room-dining-area').textContent = t.rooms.diningArea;
  document.getElementById('room-backstage').textContent = t.rooms.backstage;
  document.getElementById('room-showstage').textContent = t.rooms.showstage;
  document.getElementById('camsafe').textContent = t.rooms.office;
  document.getElementById('room-pirate-cove').textContent = t.rooms.pirateCove;
  document.getElementById('room-supply-closet').textContent = t.rooms.supplyCloset;
  document.getElementById('room-rest-room').textContent = t.rooms.restRoom;
  document.getElementById('room-kitchen').textContent = t.rooms.kitchen;
  document.getElementById('room-west-hall').textContent = t.rooms.westHall;
  document.getElementById('room-east-hall').textContent = t.rooms.eastHall;

  document.getElementById('cam1a').textContent = t.cameras.cam1a;
  document.getElementById('cam1b').textContent = t.cameras.cam1b;
  document.getElementById('cam1c').textContent = t.cameras.cam1c;
  document.getElementById('cam2a').textContent = t.cameras.cam2a;
  document.getElementById('cam2b').textContent = t.cameras.cam2b;
  document.getElementById('cam3').textContent = t.cameras.cam3;
  document.getElementById('cam4a').textContent = t.cameras.cam4a;
  document.getElementById('cam4b').textContent = t.cameras.cam4b;
  document.getElementById('cam5').textContent = t.cameras.cam5;
  document.getElementById('cam6').textContent = t.cameras.cam6;
  document.getElementById('cam7').textContent = t.cameras.cam7;

  document.getElementById('start').textContent = t.debugButtons.start;
  document.getElementById('debug-game-over-0').textContent = t.debugButtons.gameOver;
  document.getElementById('debug-game-over-1').textContent = t.debugButtons.endNight;
  document.getElementById('stop').textContent = t.debugButtons.stop;
  document.getElementById('toggleCameraLayout').textContent = t.debugButtons.cam;

  window.selectedLanguage = selectedLanguage;
}

function setupLanguageScreen() {
  const languageScreen = document.getElementById('language-screen');
  const startScreen = document.getElementById('start-screen');
  const langButtons = document.querySelectorAll('.lang-btn');
  const savedLanguage = localStorage.getItem('fnaf-language');

  if (savedLanguage && translations[savedLanguage]) {
    applyLanguage(savedLanguage);
  } else {
    applyLanguage(defaultLanguage);
  }

  languageScreen.classList.remove('display-0');
  startScreen.classList.add('display-0');

  langButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const lang = button.getAttribute('data-lang') || 'fr';
      localStorage.setItem('fnaf-language', lang);
      applyLanguage(lang);
      languageScreen.classList.remove('language-screen');
      languageScreen.classList.add('display-0');
      startScreen.classList.remove('display-0');
      console.log(`Langue sélectionnée : ${lang}`);
   
      startMenuSounds();

    });
  });
}


// Chargement des scripts dans l'ordre
document.addEventListener('DOMContentLoaded',async () => {
    setupLanguageScreen();
    preloadImages(); // Précharge les images des salles  
});

document.addEventListener('keydown', (e) => {
  if (activeView === 'camera') {
    if (e.key === 'ArrowLeft') isPanningLeft = true;
    if (e.key === 'ArrowRight') isPanningRight = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') isPanningLeft = false;
  if (e.key === 'ArrowRight') isPanningRight = false;
});

// Écouteurs d'événements
function setupEventListeners() {
  document.getElementById('cam1a').addEventListener('click', () => activateCamera("1a"));
  document.getElementById('cam1b').addEventListener('click', () => activateCamera("1b"));
  document.getElementById('cam1c').addEventListener('click', () => activateCamera("1c"));
  document.getElementById('cam2a').addEventListener('click', () => activateCamera("2a"));
  document.getElementById('cam2b').addEventListener('click', () => activateCamera("2b"));
  document.getElementById('cam3').addEventListener('click', () => activateCamera("3"));
  document.getElementById('cam4a').addEventListener('click', () => activateCamera("4a"));
  document.getElementById('cam4b').addEventListener('click', () => activateCamera("4b"));
  document.getElementById('cam5').addEventListener('click', () => activateCamera("5"));
  document.getElementById('cam6').addEventListener('click', () => activateCamera("6"));
  document.getElementById('cam7').addEventListener('click', () => activateCamera("7"));

  document.getElementById('toggleCameraLayout').addEventListener('click', () => showCloseCamera());


  /*Debug*/
  document.getElementById('debug-game-over-0').addEventListener('click', () => _transitionFreddy());
  document.getElementById('debug-game-over-1').addEventListener('click', () => _endGameAt5h50());
    document.getElementById('start').addEventListener('click', () => startAmbientSounds());
  document.getElementById('stop').addEventListener('click', () => stopAllSounds());

  /* DEBUG - Boutons Foxy */
  document.getElementById('debug-foxy-phase1').addEventListener('click', () => debugFoxyPhase1());
  document.getElementById('debug-foxy-phase2').addEventListener('click', () => debugFoxyPhase2());
  document.getElementById('debug-foxy-phase3').addEventListener('click', () => debugFoxyPhase3());
  document.getElementById('debug-foxy-check-cove').addEventListener('click', () => debugFoxyCheckCove());
  document.getElementById('debug-foxy-close-door').addEventListener('click', () => debugFoxyCloseDoor());
  document.getElementById('debug-foxy-open-door').addEventListener('click', () => debugFoxyOpenDoor());
  document.getElementById('debug-foxy-reset').addEventListener('click', () => debugFoxyReset());

  /*Gestion des portes*/
  document.getElementById('left-door-toggle').addEventListener('click', () => toggleDoor('left'));
  document.getElementById('right-door-toggle').addEventListener('click', () => toggleDoor('right'));
  
  /*Gestion des lumières*/
  document.getElementById('left-light-toggle').addEventListener('click', () => setupLightToggle(leftLight));
  document.getElementById('right-light-toggle').addEventListener('click', () => setupLightToggle(rightLight));
}

/* DEBUG */
function _transitionFreddy(){

  chica.forceMoveToRoom("safe");
  /*
    power = 0;
    gameTime.hours = 5 ;
    gameTime.minutes = 30;
    */
}

function _endGameAt5h50(){
  gameTime.hours = 6;
  gameTime.minutes = 0;
}
/* DEBUG */

/* DEBUG - Fonctions Foxy */
function debugFoxyPhase1() {
  if (!foxyInstance) foxyInstance = initializeFoxy();
  foxyInstance.phase = FoxyPhase.INACTIF;
  foxyInstance.aggressivity = 10;
  foxyInstance.timeInCurrentPhase = 0;
  console.log("[DEBUG] Foxy forcé en Phase 1 (INACTIF)");
  displayFoxyStatus();
}

function debugFoxyPhase2() {
  if (!foxyInstance) foxyInstance = initializeFoxy();
  foxyInstance.phase = FoxyPhase.TETE_SORTIE;
  foxyInstance.aggressivity = 50;
  foxyInstance.timeInCurrentPhase = 0;
  console.log("[DEBUG] Foxy forcé en Phase 2 (TETE_SORTIE)");
  displayFoxyStatus();
}

function debugFoxyPhase3() {
  if (!foxyInstance) foxyInstance = initializeFoxy();
  foxyInstance.phase = FoxyPhase.COURSE;
  foxyInstance.aggressivity = 100;
  foxyInstance.timeInCurrentPhase = 0;
  console.log("[DEBUG] Foxy forcé en Phase 3 (COURSE)");
  displayFoxyStatus();
}

function debugFoxyCheckCove() {
  if (!foxyInstance) foxyInstance = initializeFoxy();
  foxyInstance.timeSinceLastCheck = 0;
  foxyInstance.aggressivity = Math.max(0, foxyInstance.aggressivity - 30);
  console.log("[DEBUG] Pirate Cove vérifié - Agressivité réduite");
  displayFoxyStatus();
}

function debugFoxyCloseDoor() {
  if (!foxyInstance) foxyInstance = initializeFoxy();
  // Simuler la fermeture de la porte
  if (typeof doors !== 'undefined' && doors.right) {
    doors.right.isClosed = true;
    doors.right.value = 1;
  }
  const rightDoor = document.getElementById('right-door');
  if (rightDoor) {
    rightDoor.classList.add('closed');
  }
  console.log("[DEBUG] Porte Est fermée");
  displayFoxyStatus();
}

function debugFoxyOpenDoor() {
  if (!foxyInstance) foxyInstance = initializeFoxy();
  // Simuler l'ouverture de la porte
  if (typeof doors !== 'undefined' && doors.right) {
    doors.right.isClosed = false;
    doors.right.value = 0;
  }
  const rightDoor = document.getElementById('right-door');
  if (rightDoor) {
    rightDoor.classList.remove('closed');
  }
  console.log("[DEBUG] Porte Est ouverte");
  displayFoxyStatus();
}

function debugFoxyReset() {
  if (!foxyInstance) foxyInstance = initializeFoxy();
  foxyInstance.reset();
  console.log("[DEBUG] Foxy réinitialisé");
  displayFoxyStatus();
}
/* DEBUG - Fin Fonctions Foxy */

function toggleDebugPanel() {
  const panel = document.getElementById('debug-panel');
  const btn = document.getElementById('debug-toggle-btn');
  if (!panel) return;
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  btn.style.backgroundColor = isOpen ? '#222' : '#ff8800';
  btn.style.color = isOpen ? '#ff8800' : '#000';
}

function Start(){
    document.getElementById('start-screen').classList.add('display-0');
    document.querySelector('.preloader').classList.remove('display-0', 'display-1')
    document.querySelector('.transition').classList.remove('display-0', 'display-1')
    night=1;
    transitionScreen(1);
}

function gamestart(){
    // Appelle la fonction au chargement et au redimensionnement de la fenêtre
    window.addEventListener('load', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);

    setupEventListeners();

    // Démarre la nuit courante avec une réinitialisation complète
    startNight(night);

    resizeCanvas();

    // Démarre le compteur d'heures (1 tick = 1/60s)
    hourInterval = setInterval(() => {
        // La gestion des heures est déjà dans gameLoop, donc cet intervalle n'est pas nécessaire.
        // On peut le supprimer ou l'utiliser pour d'autres mises à jour moins fréquentes.
    }, 1000/60);
}