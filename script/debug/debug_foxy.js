/* DEBUG */

/* DEBUG - Fonctions Foxy */
function debugFoxyPhase1() {
  if (!foxyInstance) foxyInstance = initializeFoxy();
  foxyInstance.phase = FoxyPhase.INACTIF;
  foxyInstance.aggressivity = 10;
  foxyInstance.timeInCurrentPhase = 0;
  displayFoxyStatus();
}

function debugFoxyPhase2() {
  if (!foxyInstance) foxyInstance = initializeFoxy();
  foxyInstance.phase = FoxyPhase.TETE_SORTIE;
  foxyInstance.aggressivity = 50;
  foxyInstance.timeInCurrentPhase = 0;
  displayFoxyStatus();
}
function debugFoxyPhase3() {
  if (!foxyInstance) foxyInstance = initializeFoxy();
  foxyInstance.phase = FoxyPhase.PRET_A_SORTIR;
  foxyInstance.aggressivity = 75;
  foxyInstance.timeInCurrentPhase = 0;
  displayFoxyStatus();
}

function debugFoxyPhase4() {
  if (!foxyInstance) foxyInstance = initializeFoxy();
  foxyInstance.phase = FoxyPhase.COURSE;
  foxyInstance.aggressivity = 100;
  foxyInstance.timeInCurrentPhase = 0;
  displayFoxyStatus();
}

function debugFoxyCheckCove() {
  if (!foxyInstance) foxyInstance = initializeFoxy();
  foxyInstance.timeSinceLastCheck = 0;
  foxyInstance.aggressivity = Math.max(0, foxyInstance.aggressivity - 30);
  displayFoxyStatus();
}

function debugFoxyReset() {
  if (!foxyInstance) foxyInstance = initializeFoxy();
  foxyInstance.reset();
  console.log("[DEBUG] Foxy réinitialisé");
  displayFoxyStatus();
}

/**
 * Affiche le statut de Foxy dans l'interface
 */
function displayFoxyStatus() {
    if (!foxyInstance) return;

    const status = foxyInstance.getStatus();
    const statusDiv = document.getElementById('foxy-status');
    
    if (statusDiv) {
        const phaseColor = {
            'INACTIF': '#00ff00',
            'TETE_SORTIE': '#ffff00',
            'COURSE': '#ff0000',
            'RETRAIT': '#0088ff'
        };

        const color = phaseColor[status.phase] || '#ffffff';

        statusDiv.innerHTML = `
            <div style="color: ${color}; font-weight: bold;">
                FOXY: ${foxyInstance.getPhaseDescription()}
                <br/>Agressivité: ${status.aggressivity}%
                <br/>Dernier scan: ${status.timeSinceLastCheck}s
            </div>
        `;
        
        // Afficher le div pendant le jeu
        if (!statusDiv.style.display || statusDiv.style.display === 'none') {
            statusDiv.style.display = 'block';
        }
    }
}
/* DEBUG - Fin Fonctions Foxy */
