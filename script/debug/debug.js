
// Écouteurs d'événements
function setupDebugEventListeners() {

  /*Debug*/
  document.getElementById('debug-game-over-0').addEventListener('click', () => _transitionFreddy());
  document.getElementById('debug-game-over-1').addEventListener('click', () => _endGameAt5h50());


  /* DEBUG - Boutons Foxy */
  document.getElementById('debug-foxy-phase1').addEventListener('click', () => debugFoxyPhase1());
  document.getElementById('debug-foxy-phase2').addEventListener('click', () => debugFoxyPhase2());
  document.getElementById('debug-foxy-phase3').addEventListener('click', () => debugFoxyPhase3());
  document.getElementById('debug-foxy-check-cove').addEventListener('click', () => debugFoxyCheckCove());
  document.getElementById('debug-foxy-reset').addEventListener('click', () => debugFoxyReset());

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
  if (nuitEl) nuitEl.textContent = `Nuit : ${night}`;
  if (tourEl) tourEl.textContent = `Tour : ${currentTurn}`;
}