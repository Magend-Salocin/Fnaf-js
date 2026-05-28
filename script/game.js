//game.js

// Variables globales
let activeView = 'office';
let activeCamera = 0;
let cameraUsageTimer = 0;
let power = 100;
let leftLightOn = false;
let rightLightOn = false;
let gameLoopInterval;
let isUsingCamera = false;

let isPanningLeft = false;
let isPanningRight = false;
const panSpeed = 5; // Vitesse de déplacement (pixels par frame)
let autoPanDirection = 1;

// Variable pour suivre les événements en cours
const activeEvents = {};

const toggleButton = document.getElementById('toggleCameraLayout');
const cameraLayout = document.getElementById('cameraLayout');


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

// Dans la boucle gameLoop, ajoute :
function triggerRandomEvents() {
  // Exemple : Déclencher un événement aléatoire dans l'entrée (room.id === 1)
  if (Math.random() < 0.002) { // 0.2% de chance par frame
    activeEvents[1] = {
      type: 'event',
      frameCount: 120, // 2 secondes à 60 FPS
      currentFrame: 0,
      imageIndex: Math.floor(Math.random() * loadedRoomImages[1].events.length)
    };
  }

  // Gestion des événements en cours
  for (const roomId in activeEvents) {
    const event = activeEvents[roomId];
    event.currentFrame++;
    if (event.currentFrame >= event.frameCount) {
      delete activeEvents[roomId];
    }
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
  
  document.getElementById('you').addEventListener('click', () => { activeView = 'office'; });
  document.getElementById('leftDoor').addEventListener('click', () => toggleDoor(0));
  document.getElementById('rightDoor').addEventListener('click', () => toggleDoor(1));
  document.getElementById('leftLight').addEventListener('click', () => toggleLight('left'));
  document.getElementById('rightLight').addEventListener('click', () => toggleLight('right'));
}


// Boucle de jeu
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);


   // Animation automatique de panoramique
 
if (activeView === 'camera') {
    const camera = cameras.find(c => c.id === activeCamera);
    const room = rooms.find(r => r.id === camera.roomId);

    // Mise à jour du cameraOffset pour le panoramique automatique
    if (isPanningLeft && room.cameraOffset > 0) room.cameraOffset -= panSpeed;
    if (isPanningRight && room.cameraOffset < room.maxCameraOffset) room.cameraOffset += panSpeed;

    // Panoramique automatique (va-et-vient)
    room.cameraOffset += autoPanDirection * 1;

    if (room.cameraOffset <= 0 || room.cameraOffset >= room.maxCameraOffset) autoPanDirection *= -1;

    if (isUsingCamera) {
      cameraUsageTimer -= 1/60;
      if (cameraUsageTimer <= 0) {
        cameras[camera].isAvailable = false;
        cameras[camera].remainingTime = 5;
        isUsingCamera = false;
      }
    } else {
      cameras[camera].remainingTime -= 1/60;
      if (cameras[camera].remainingTime <= 0) {
        cameras[camera].isAvailable = true;
        cameraUsageTimer = cameras[camera].maxUsageTime;
        isUsingCamera = true;
      }
    }
  }

	// Affichage selon la vue active
	if (activeView === 'office') {
	  drawOfficeView(ctx);
	} else {
	  const camera = cameras.find(cam => cam.id === activeCamera);
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
