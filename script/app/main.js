//main.js

// Chargement des scripts dans l'ordre
document.addEventListener('DOMContentLoaded',async () => {
    setupLanguageScreen();
    preloadImages(); // Précharge les images des salles
    if (typeof RandomEvents !== 'undefined') {
      RandomEvents.preload(); // Précharge les images des événements aléatoires
    }
});

document.addEventListener('keydown', (e) => {
  if (typeof RandomEvents !== 'undefined') {
    RandomEvents.notifyUserInput(); // Notifie de l'activité utilisateur (GAB-006)
  }
  if (activeView === 'camera') {
    if (e.key === 'ArrowLeft') isPanningLeft = true;
    if (e.key === 'ArrowRight') isPanningRight = true;
    return;
  }

  if (activeView === 'office') {
    if (e.key === 'ArrowLeft') {
      shiftOfficeLook(-1);
    }
    if (e.key === 'ArrowRight') {
      shiftOfficeLook(1);
    }
  }
});

document.addEventListener('keyup', (e) => {
  if (typeof RandomEvents !== 'undefined') {
    RandomEvents.notifyUserInput(); // Notifie de l'activité utilisateur (GAB-006)
  }
  if (e.key === 'ArrowLeft') isPanningLeft = false;
  if (e.key === 'ArrowRight') isPanningRight = false;
});

function handleOfficeMouseLook(event) {
  if (typeof RandomEvents !== 'undefined') {
    RandomEvents.notifyUserInput(); // Notifie de l'activité utilisateur (GAB-006)
  }
  if (activeView !== 'office' || gameEnd) return;

  const viewportWidth = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
  const pointerX = Math.max(0, Math.min(viewportWidth, event.clientX));
  const normalizedX = (pointerX / viewportWidth) * 2 - 1;
  setOfficeLookTargetOffset(normalizedX);
}

function openInfoComputerPanel() {
  if (gameEnd) return;

  RetroTerminal.shell({
      title: "ARCHIVES — ACCÈS NON RÉFÉRENCÉ",
      intro: "Connexion établie...\nTapez HELP pour les commandes publiques.",
      onCommand: raw => LoreCore.handleCommand(raw),
      idleEvent: () => LoreCore.idleEvent(),
      idleIntervalMs: 5000,
      typewriterSpeed: 14,
      ambientGlitch: true
  });
}

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

  
  document.getElementById('phone-panel').addEventListener('click', () => hangupPhoneFromPanel());
  document.getElementById('camera-panel').addEventListener('click', () => showCloseCamera());
  document.getElementById('computer-panel').addEventListener('click', () => openInfoComputerPanel());
  document.getElementById('tape-panel').addEventListener('click', () => showCloseTapeScene());

  /*Gestion des portes*/
  document.getElementById('left-door-toggle').addEventListener('click', () => toggleDoor('left'));
  document.getElementById('right-door-toggle').addEventListener('click', () => toggleDoor('right'));
  
  /*Gestion des lumières*/
  setupLightToggle(leftLight);
  setupLightToggle(rightLight);

  

  document.addEventListener('mousemove', handleOfficeMouseLook);

  /*Debug*/
  setupDebugEventListeners();
}