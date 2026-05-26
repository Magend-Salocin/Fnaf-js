// Variables globales
let activeView = 'office';
let activeCamera = 0;
let cameraUsageTimer = 0;
let power = 100;
let leftLightOn = false;
let rightLightOn = false;
let gameLoopInterval;
let isUsingCamera = false;

const toggleButton = document.getElementById('toggleCameraLayout');
const cameraLayout = document.getElementById('cameraLayout');

toggleButton.addEventListener('click', () => {
  cameraLayout.style.display = cameraLayout.style.display === 'block' ? 'none' : 'block';
});


// Initialisation des boutons
function initButtons() {
  doors.forEach((door, index) => {
    const button = document.getElementById(`door${index + 1}`);
    if (button) button.textContent = `${door.name} (Ouverte)`;
  });
}

// Activer une caméra
function activateCamera(cameraId) {
  const camera = cameras.find(c => c.id === cameraId);
  if (camera && camera.isAvailable && power > 0) {
    activeView = 'camera';
    activeCamera = cameraId;
    cameraUsageTimer = camera.maxUsageTime;
    power -= 1;
    updatePowerDisplay();
    isUsingCamera = true; // La caméra est en cours d'utilisation
  }
}

// Basculer l'état d'une porte
function toggleDoor(doorId) {
  const door = doors.find(d => d.id === doorId);
  if (door && power > 0) {
    door.isClosed = !door.isClosed;
    const button = document.getElementById(`door${doorId + 1}`);
    if (button) {
      button.classList.toggle('closed', door.isClosed);
      button.textContent = `${door.name} (${door.isClosed ? 'Fermée' : 'Ouverte'})`;
    }
    power -= 1;
    updatePowerDisplay();
  }
}

// Basculer l'état d'une lumière
function toggleLight(side) {
  if (power > 0) {
    if (side === 'left') {
      leftLightOn = !leftLightOn;
      document.getElementById('leftLight').textContent = `Lumière Gauche (${leftLightOn ? 'ON' : 'OFF'})`;
    } else {
      rightLightOn = !rightLightOn;
      document.getElementById('rightLight').textContent = `Lumière Droite (${rightLightOn ? 'ON' : 'OFF'})`;
    }
    power -= 0.5;
    updatePowerDisplay();
  }
}

// Mettre à jour l'affichage de l'énergie
function updatePowerDisplay() {
  document.getElementById('powerUsage').textContent = `Puissance : ${Math.max(0, Math.floor(power))}%`;
  if (power <= 0) {
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('gameOver').textContent = "PUISSANCE ÉPUISÉE - GAME OVER";
    clearInterval(gameLoopInterval);
  }
}

// Écouteurs d'événements
function setupEventListeners() {
	
  document.getElementById('cam1A').addEventListener('click', () => activateCamera(0));
  document.getElementById('cam1B').addEventListener('click', () => activateCamera(1));
  document.getElementById('cam1C').addEventListener('click', () => activateCamera(2));
  document.getElementById('cam2A').addEventListener('click', () => activateCamera(3));
  document.getElementById('cam2B').addEventListener('click', () => activateCamera(4));
  document.getElementById('cam3').addEventListener('click', () => activateCamera(5));
  document.getElementById('cam4A').addEventListener('click', () => activateCamera(6));
  document.getElementById('cam4B').addEventListener('click', () => activateCamera(7));
  document.getElementById('cam5').addEventListener('click', () => activateCamera(8));
  document.getElementById('cam6').addEventListener('click', () => activateCamera(9));
  document.getElementById('cam7').addEventListener('click', () => activateCamera(10));
  
  //document.getElementById('officeView').addEventListener('click', () => { activeView = 'office'; });
  document.getElementById('leftDoor').addEventListener('click', () => toggleDoor(0));
  document.getElementById('rightDoor').addEventListener('click', () => toggleDoor(1));
  document.getElementById('leftLight').addEventListener('click', () => toggleLight('left'));
  document.getElementById('rightLight').addEventListener('click', () => toggleLight('right'));
}

// Boucle de jeu
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Gestion du temps d'utilisation des caméras
	if (activeView === 'camera') {
	  if (isUsingCamera) {
		cameraUsageTimer -= 1/60; // Décrémente le temps (60 FPS)
		if (cameraUsageTimer <= 0) {
		  cameras[activeCamera].isAvailable = false; // Désactive la caméra
		  cameras[activeCamera].remainingTime = 5; // Temps de recharge
		  isUsingCamera = false; // Passe en mode recharge
		}
	  } else {
		// Pendant la recharge, décrémente le temps restant
		cameras[activeCamera].remainingTime -= 1/60;
		if (cameras[activeCamera].remainingTime <= 0) {
		  cameras[activeCamera].isAvailable = true; // Réactive la caméra
		  cameraUsageTimer = cameras[activeCamera].maxUsageTime; // Réinitialise le temps d'utilisation
		  isUsingCamera = true; // Reprend l'utilisation normale
		}
	  }
	}

	// Affichage selon la vue active
	if (activeView === 'office') {
	  drawOfficeView(ctx);
	} else {
	  const camera = cameras[activeCamera];
	  if (isUsingCamera) {
		drawWithCamera(ctx, camera); // Affiche la caméra normalement
	  } else {
		drawStaticEffect(ctx, camera); // Affiche l'effet de statique pendant la recharge
	  }
	}

  animatronics.forEach(animatronic => animatronic.move());
  power -= 0.001;
  updatePowerDisplay();
}
