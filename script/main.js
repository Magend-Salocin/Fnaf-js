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

  /*Gestion des portes*/
  document.getElementById('left-door-toggle').addEventListener('click', () => toggleDoor('left'));
  document.getElementById('right-door-toggle').addEventListener('click', () => toggleDoor('right'));
  
  /*Gestion des lumières*/
  document.getElementById('left-light-toggle').addEventListener('click', () => setupLightToggle(leftLight));
  document.getElementById('right-light-toggle').addEventListener('click', () => setupLightToggle(rightLight));

  /*Debug*/
  setupDebugEventListeners();
}