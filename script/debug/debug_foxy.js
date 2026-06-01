/* DEBUG */

/* DEBUG - Fonctions Foxy */
function debugFoxyPhase1() {
 
  foxy.foxyInstance.phase = FoxyPhase.INACTIF;
  foxy.foxyInstance.aggressivity = 10;
  foxy.foxyInstance.timeInCurrentPhase = 0;
  displayFoxyStatus();
}

function debugFoxyPhase2() {

  foxy.foxyInstance.phase = FoxyPhase.TETE_SORTIE;
  foxy.foxyInstance.aggressivity = 50;
  foxy.foxyInstance.timeInCurrentPhase = 0;
  displayFoxyStatus();
}
function debugFoxyPhase3() {

  foxy.foxyInstance.phase = FoxyPhase.PRET_A_SORTIR;
  foxy.foxyInstance.aggressivity = 75;
  foxy.foxyInstance.timeInCurrentPhase = 0;
  displayFoxyStatus();
}

function debugFoxyPhase4() {

  foxy.foxyInstance.phase = FoxyPhase.COURSE;
  foxy.foxyInstance.aggressivity = 100;
  foxy.foxyInstance.timeInCurrentPhase = 0;
  displayFoxyStatus();
}

function debugFoxyCheckCove() {

  foxy.foxyInstance.timeSinceLastCheck = 0;
  foxy.foxyInstance.aggressivity = Math.max(0, foxy.foxyInstance.aggressivity - 30);
  displayFoxyStatus();
}

function debugFoxyReset() {

  foxy.foxyInstance.reset();
  console.log("[DEBUG] Foxy réinitialisé");
  displayFoxyStatus();
}

/**
 * Affiche le statut de Foxy dans l'interface
 */
function displayFoxyStatus() {
    if (!foxy.foxyInstance) return;

    const status = foxy.foxyInstance.getStatus();
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
                FOXY: ${foxy.foxyInstance.getPhaseDescription()}
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
