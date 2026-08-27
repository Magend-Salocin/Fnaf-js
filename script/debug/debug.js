
// Écouteurs d'événements
function setupDebugEventListeners() {

  /* DEBUG - Boutons Foxy */
  document.getElementById('debug-foxy-phase1').addEventListener('click', () => debugFoxyPhase1());
  document.getElementById('debug-foxy-phase2').addEventListener('click', () => debugFoxyPhase2());
  document.getElementById('debug-foxy-phase3').addEventListener('click', () => debugFoxyPhase3());
  document.getElementById('debug-foxy-check-cove').addEventListener('click', () => debugFoxyCheckCove());
  document.getElementById('debug-foxy-reset').addEventListener('click', () => debugFoxyReset());

}

/**
 * DEBUG - Déclenche immédiatement le game over "panne de courant + Freddy"
 * en vidant la jauge d'énergie. La gameLoop détecte power < 1 et lance
 * transitionEndNightFreddy() au prochain tick.
 */
function debugGameOverFreddy() {
  power = 0;
}

/**
 * DEBUG - Fait gagner la nuit en cours en avançant l'horloge à 6h00.
 * La gameLoop détecte gameTime.hours >= 6 et lance transitionEndNight()
 * au prochain tick.
 */
function debugWinNight() {
  gameTime.hours = 6;
  gameTime.minutes = 0;
}



function toggleDebugPanel() {
  const panel = document.getElementById('debug-panel');
  const btn = document.getElementById('debug-toggle-btn');
  if (!panel || !btn) return;
  const isOpen = window.getComputedStyle(panel).display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  btn.classList.toggle('debug-toggle-btn-open', !isOpen);
}



/**
 * Affiche le tour actuel dans le debug panel
 */
function DebugDrawCurrentTurn() {
  const nuitEl = document.getElementById('debug-info-nuit');
  const tourEl = document.getElementById('debug-info-tour');
  if (nuitEl) nuitEl.textContent = `Nuit : ${_night}`;
  if (tourEl) tourEl.textContent = `Tour : ${currentTurn}`;
}