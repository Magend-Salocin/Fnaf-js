//main.js

// Chargement des scripts dans l'ordre
document.addEventListener('DOMContentLoaded',async () => {
    setupLanguageScreen();
    preloadImages(); // Précharge les images des salles  
});

document.addEventListener('keydown', (e) => {
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
  if (e.key === 'ArrowLeft') isPanningLeft = false;
  if (e.key === 'ArrowRight') isPanningRight = false;
});

function handleOfficeMouseLook(event) {
  if (activeView !== 'office' || gameEnd) return;

  const viewportWidth = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
  const pointerX = Math.max(0, Math.min(viewportWidth, event.clientX));
  const normalizedX = (pointerX / viewportWidth) * 2 - 1;
  setOfficeLookTargetOffset(normalizedX);
}

function openInfoComputerPanel() {
  const panel = document.getElementById('computer-panel');
  const statusEl = document.getElementById('computer-panel-status');
  const footerEl = document.getElementById('computer-panel-footer');
  const lang = window.selectedLanguage || window.FNAF_DEFAULT_LANGUAGE || 'fr';
  const allTranslations = window.FNAF_TRANSLATIONS || {};
  const t = allTranslations[lang] || allTranslations[window.FNAF_DEFAULT_LANGUAGE] || {};
  const bootingLabel = t.panels?.computerBooting || 'BOOTING';
  const openingLabel = t.panels?.computerOpening || 'TERMINAL OPENING';
  const onlineLabel = t.panels?.computerOnline || 'ONLINE';
  const readyLabel = t.panels?.computerReady || 'SECURITY FEED READY';
  const idleLabel = t.panels?.computerStatus || 'IDLE';
  const idleFooterLabel = t.panels?.computerFooter || 'CLICK FOR INFO';

  if (!panel || !statusEl || !footerEl) {
    showTerminalIntro();
    return;
  }

  panel.classList.remove('computer-active');
  void panel.offsetWidth;
  panel.classList.add('computer-active');

  statusEl.textContent = bootingLabel;
  footerEl.textContent = openingLabel;

  setTimeout(() => {
    statusEl.textContent = onlineLabel;
    footerEl.textContent = readyLabel;
  }, 240);

  setTimeout(() => {
    statusEl.textContent = idleLabel;
    footerEl.textContent = idleFooterLabel;
    panel.classList.remove('computer-active');
  }, 1700);

  showTerminalIntro();
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