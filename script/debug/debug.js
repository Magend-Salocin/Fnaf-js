
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

/**
 * DEBUG - Ouvre immédiatement l'écran des journaux (JournalViewer), le
 * même que celui affiché en fin de nuit réussie (cf. transitionEndNight()
 * dans render.js), sans attendre 6h00. N'affiche rien si aucun journal
 * n'a encore été débloqué.
 */
function debugShowJournals() {
  JournalViewer.open(() => {});
  debugRefreshJournalsStatus();
}

/**
 * DEBUG - Débloque tous les journaux du jeu (Collectibles.unlockJournal
 * pour chaque entrée de JOURNALS_LIBRARY), pour pouvoir tester l'écran
 * de fin de nuit sans avoir à déclencher chaque événement aléatoire.
 */
function debugUnlockAllJournals() {
  JOURNALS_LIBRARY.forEach(journal => Collectibles.unlockJournal(journal.code));
  console.log(`[DEBUG] ${JOURNALS_LIBRARY.length} journaux débloqués`);
  debugRefreshJournalsStatus();
}

/**
 * Affiche dans le panneau de debug la liste des journaux débloqués
 * jusqu'ici (persistant, cf. Collectibles).
 */
function debugRefreshJournalsStatus() {
  const statusDiv = document.getElementById('debug-journals-status');
  if (!statusDiv) return;

  const unlockedCodes = Collectibles.getUnlockedJournals();
  const unlocked = JOURNALS_LIBRARY.filter(journal => unlockedCodes.includes(journal.code));

  const list = unlocked.length
    ? unlocked.map(journal => `- ${journal.code} : ${journal.title || '(sans titre)'}`).join('<br/>')
    : '(aucun journal débloqué)';

  statusDiv.innerHTML = `
    <div style="font-weight: bold;">
      JOURNAUX : ${unlocked.length} / ${JOURNALS_LIBRARY.length}
      <br/>${list}
    </div>
  `;
  statusDiv.style.display = 'block';
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