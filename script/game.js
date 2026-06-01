//game.js

// Variables pour la gestion du temps (heures:minutes)
let gameTime = { hours: 0, minutes: 0 }; // Temps actuel dans le jeu (00:00 à 23:59)
const TICKS_PER_MINUTE = 60; // 60 ticks = 1 minute (1 tick = 1/60s)
const MINUTES_PER_HOUR = 60; // 60 minutes = 1 heure
let ticksSinceLastMinute = 0; // Compteur de ticks depuis la dernière minute


// Variables pour les tours de jeu (toutes les 5 minutes in-game)
const MINUTES_PER_TURN = 5; // Un tour toutes les 5 minutes
let minutesSinceLastTurn = 0; // Compteur de minutes depuis le dernier tour
let currentTurn = 1; // Numéro du tour actuel

// Variables globales
let activeView = 'office';
let activeCamera = '0';
let lastActiveCamera = '1a';
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
const startButton = document.getElementById('start');


startButton.addEventListener('click', () => {
  startAmbientSounds();
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

toggleButton.addEventListener('click', () => {
  // Jouer le son de "put down" lorsque les caméras sont masquées
  cameraPutDownSound.currentTime = 0;
  cameraPutDownSound.play().catch(error => {
    console.error("Erreur lors de la lecture du son :", error);
  });

  cameraLayout.style.display = cameraLayout.style.display === 'block' ? 'none' : 'block';
  if(cameraLayout.style.display=='none'){
    cameraDown();
    activeView = 'office';
    lastActiveCamera = activeCamera;
    activeCamera = 0;
    stopSound(cameraToggleSound);
  }else{
    cameraUp();

  }
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
     console.log(activeCamera);
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
  

  document.getElementById('leftDoor').addEventListener('click', () => toggleDoor(0));
  document.getElementById('rightDoor').addEventListener('click', () => toggleDoor(1));
  document.getElementById('leftLight').addEventListener('click', () => toggleLight('left'));
  document.getElementById('rightLight').addEventListener('click', () => toggleLight('right'));


}

// Boucle de jeu
function gameLoop() {

    onCamera();

    // Gestion du temps (heures:minutes)
    ticksSinceLastMinute++;
    if (ticksSinceLastMinute >= TICKS_PER_MINUTE) {
        ticksSinceLastMinute = 0;
        gameTime.minutes++;
        minutesSinceLastTurn++; // Incrémente le compteur de minutes depuis le dernier tour

        // Vérifie si 5 minutes se sont écoulées (tour de jeu)
        if (minutesSinceLastTurn >= MINUTES_PER_TURN) {
            minutesSinceLastTurn = 0;
            currentTurn++;
            console.log(`=== Tour ${currentTurn} (${formatGameTime(gameTime)}) ===`);
            onNewTurn(currentTurn); // Appelle la fonction pour gérer le tour
        }

        if (gameTime.minutes >= MINUTES_PER_HOUR) {
            gameTime.minutes = 0;
            gameTime.hours = (gameTime.hours + 1) % 24;
            console.log(`Il est maintenant ${formatGameTime(gameTime)}.`);
        }
    }

    drawGameTime(ctx); // Affiche l'heure
    drawCurrentTurn(ctx); // Affiche le tour actuel
}
/**
 * Gère les actions à effectuer à chaque nouveau tour
 * @param {number} turn - Numéro du tour actuel
 */
function onCamera() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  	// Affichage selon la vue active
	if (activeView === 'office') {
	  drawOfficeView(ctx);

	}else{

    // Animation automatique de panoramique
    if (activeView === 'camera') {

      power -= 0.001;
      updatePowerDisplay();

      const camera = cameras.find(c => c.id === activeCamera);
      if (!camera) return;

      // Utilise roomsArray pour trouver la pièce associée à la caméra
      const room = roomsArray.find(r => r.id === camera.roomId);
      if (!room) return;

        // Mise à jour de room.cameraOffset en fonction des touches
        if (isPanningLeft && room.cameraOffset > 0) {
            room.cameraOffset -= panSpeed;
        }
        if (isPanningRight && room.cameraOffset < room.maxCameraOffset) {
            room.cameraOffset += panSpeed;
        }

        // Panoramique automatique (va-et-vient)
        room.cameraOffset += autoPanDirection * 1;
        if (room.cameraOffset <= 0 || room.cameraOffset >= room.maxCameraOffset) {
            autoPanDirection *= -1;
        }

      if (isUsingCamera) {
        cameraUsageTimer -= 1/60;
        if (cameraUsageTimer <= 0) {
          camera.isAvailable = false;
          camera.remainingTime = 5;
          isUsingCamera = false;
        }
      } else {
        camera.remainingTime -= 1/60;
        if (camera.remainingTime <= 0) {
          camera.isAvailable = true;
          cameraUsageTimer = camera.maxUsageTime;
          isUsingCamera = true;
        }
      }
      if (isUsingCamera) {
        drawWithCamera(ctx, camera); // Affiche la caméra normalement
      } else {
        drawStaticEffect(ctx, camera); // Affiche l'effet de statique pendant la recharge
      }

    }
  }


}

/**
 * Gère les actions à effectuer à chaque nouveau tour
 * @param {number} turn - Numéro du tour actuel
 */
function onNewTurn(currentTurn) {

  animatronics.forEach(animatronic => animatronic.move());
}


// Formate l'heure en "HH:MM"
function formatGameTime(time) {
    const hoursStr = time.hours.toString().padStart(2, '0');
    const minutesStr = time.minutes.toString().padStart(2, '0');
    return `${hoursStr}:${minutesStr}`;
}