//game.js

let night = 1;
const MAX_NIGHT = 6;

const NIGHT_AI_LEVELS = {
  1: { freddy: 0, bonnie: 2, chica: 2, foxy: 0 },
  2: { freddy: 0, bonnie: 4, chica: 4, foxy: 2 },
  3: { freddy: 1, bonnie: 6, chica: 6, foxy: 4 },
  4: { freddy: 2, bonnie: 8, chica: 8, foxy: 6 },
  5: { freddy: 3, bonnie: 10, chica: 10, foxy: 8 },
  6: { freddy: 4, bonnie: 12, chica: 12, foxy: 12 }
};

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

var gameWin = false;
var gameEnd = false;

let gameLoopInterval;

let isUsingCamera = false;
let isVocalEnd = false;
let isPanningLeft = false;
let isPanningRight = false;
const panSpeed = 5; // Vitesse de déplacement (pixels par frame)
let autoPanDirection = 1;

// Variable pour suivre les événements en cours
const activeEvents = {};

function getNightAI(nightNumber) {
  const fallbackNight = Math.max(1, Math.min(MAX_NIGHT, nightNumber));
  return NIGHT_AI_LEVELS[fallbackNight];
}

function clearRoomsState() {
  Object.keys(rooms).forEach(roomKey => {
    rooms[roomKey].b = 0;
    rooms[roomKey].c = 0;
    rooms[roomKey].f = 0;
    rooms[roomKey].occupy = 0;

    const camElement = document.getElementById('cam' + roomKey);
    if (camElement) {
      camElement.style.background = '#555';
    }
  });
}

function resetAnimatronicsForNight() {
  clearRoomsState();

  animatronics.forEach(animatronic => {
    animatronic.resetForNight();
    const roomKey = animatronic.getRoomKey(animatronic.startRoomId);
    if (!roomKey || !rooms[roomKey]) return;

    rooms[roomKey][animatronic.getKey()] = 1;
    rooms[roomKey].occupy = 1;
  });

  animatronics.forEach(animatronic => animatronic.draw());
}

function applyNightDifficulty(nightNumber) {
  const ai = getNightAI(nightNumber);
  freddy.setAggression(ai.freddy);
  bonnie.setAggression(ai.bonnie);
  chica.setAggression(ai.chica);
  foxy.setAggression(ai.foxy);

  console.log(
    `[Night ${nightNumber}] IA => Freddy:${ai.freddy}, Bonnie:${ai.bonnie}, Chica:${ai.chica}, Foxy:${ai.foxy}`
  );
}

function resetOfficeState() {
  activeView = 'office';
  activeCamera = '0';
  lastActiveCamera = '1a';
  isUsingCamera = false;

  document.getElementById('cameraLayout').style.display = 'none';

  doors.left.isClosed = false;
  doors.left.value = 0;
  doors.right.isClosed = false;
  doors.right.value = 0;

  leftLight.value = 0;
  leftLight.on = false;
  rightLight.value = 0;
  rightLight.on = false;
  leftLight.disabled = false;
  rightLight.disabled = false;

  document.getElementById('left-door').src = 'images/_doors/left_door_0.gif';
  document.getElementById('right-door').src = 'images/_doors/right_door_0.gif';
  document.getElementById('left-switch').src = 'images/_switch_door/left_switch_door_0_light_0.png';
  document.getElementById('right-switch').src = 'images/_switch_door/right_switch_door_0_light_0.png';

  showDoors();
}

function resetCameraState() {
  cameras.forEach(camera => {
    camera.isAvailable = true;
    camera.remainingTime = 0;
  });
}

function resetTimeState() {
  gameTime.hours = 0;
  gameTime.minutes = 0;
  ticksSinceLastMinute = 0;
  minutesSinceLastTurn = 0;
  currentTurn = 1;
}

function playNightCall(nightNumber) {
  const callNumber = Math.min(5, Math.max(1, nightNumber));
  const callId = `call_${callNumber}`;
  if (getSoundById(callId)) {
    playSound(callId);
  }
  
  let vocalDuration;
    switch (nightNumber) {
      case 1: vocalDuration = 206000; break;
      case 2: vocalDuration = 103000; break;
      case 3: vocalDuration = 75000; break;
      case 4: vocalDuration = 65000; break;
      case 5: vocalDuration = 37000; break;
      default: vocalDuration = 0;
    }

    setTimeout(function() {
      console.log(`Le vocal ${callNumber} est terminé.`);
        resetAnimatronicsForNight();
        applyNightDifficulty(night);
        isVocalEnd = true;
    }, vocalDuration);

}

function startNight(nightNumber) {
  night = Math.max(1, Math.min(MAX_NIGHT, nightNumber));
  gameWin = false;
  gameEnd = false;
  power = 100;

  resetTimeState();
  resetOfficeState();
  resetCameraState();

  // Initialiser Foxy pour la nouvelle nuit
  initializeFoxy();
  resetFoxyForNewNight();

  updatePowerDisplay();

  stopAllSounds();
  startAmbientSounds();
  playNightCall(night);

  if (gameLoopInterval) {
    clearInterval(gameLoopInterval);
  }
  gameLoopInterval = setInterval(gameLoop, 1000 / 60);

  console.log(`Nuit ${night} commencée.`);
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


// Boucle de jeu
function gameLoop() {

    if(!gameEnd){
      onCamera();
    }

    //clearInterval(gameLoopInterval);

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

            if(!gameEnd){
              onNewTurn(currentTurn); // Appelle la fonction pour gérer le tour
            }
        }else{
          //Pour chaque minute
          if(!gameEnd){
            animatronics.forEach(animatronic => animatronic.attack());

              // Mise à jour de Foxy et affichage du statut
              if (foxyInstance) {
                  const nightAI = getNightAI(night);
                  const foxyAlive = updateFoxy(nightAI.foxy);
                  displayFoxyStatus();
                  
                  if (!foxyAlive && !gameEnd) {
                      gameEnd = true;
                      transitionEndNightFreddy(); // Utilise la même transition que les autres animatroniques
                  }
              }
          }
        }

        // Vérifie si l'heure est 6AM
        if (endGameAt6AM() && !gameWin) {

            return; // Arrête la boucle si la partie est terminée
        }

        if(power < 1 && !gameEnd){
           gameEnd=true;
           transitionEndNightFreddy();
        }

        if (gameTime.minutes >= MINUTES_PER_HOUR) {
            gameTime.minutes = 0;
            gameTime.hours = (gameTime.hours + 1) % 24;
            console.log(`Il est maintenant ${formatGameTime(gameTime)}.`);
        }
    }

    drawGameTime(); // Affiche l'heure dans #time-status
    drawCurrentTurn(); // Affiche le tour actuel dans le debug panel


 
}



 
 /*
    * Gère les actions à effectuer à chaque nouveau tour
 * @param {number} turn - Numéro du tour actuel
 */
function onNewTurn(currentTurn) {
  if(isVocalEnd) {
    animatronics.forEach(animatronic => animatronic.move());
  }
}

// Formate l'heure en "HH:MM"
function formatGameTime(time) {
    const hoursStr = time.hours.toString().padStart(2, '0');
    const minutesStr = time.minutes.toString().padStart(2, '0');
    return `${hoursStr}:${minutesStr}`;
}


// Mettre à jour l'affichage de l'énergie
function updatePowerDisplay() {
  document.getElementById('powerUsage').textContent = `Puissance : ${Math.max(0, Math.floor(power))}%`;
  if (power <= 0) {

    clearInterval(gameLoopInterval);
  }
}

// Fonction pour redimensionner le canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
 
/**
 * Affiche l'heure actuelle dans le div #time-status
 */
function drawGameTime() {
  const el = document.getElementById('time-status');
  if (!el) return;
  const h = (gameTime.hours === 0) ? '12' : String(gameTime.hours).padStart(2, '0');
  const m = String(gameTime.minutes).padStart(2, '0');
  el.innerHTML =
    `<div class="clock-label">CAM / OFFICE</div>` +
    `<div class="clock-time"><span class="clock-digits">${h}</span><span class="clock-colon">:</span><span class="clock-digits">${m}</span></div>` +
    `<div class="clock-ampm">AM — NUIT ${night}</div>`;
}

/**
 * Affiche le tour actuel dans le debug panel
 */
function drawCurrentTurn() {
  const nuitEl = document.getElementById('debug-info-nuit');
  const tourEl = document.getElementById('debug-info-tour');
  if (nuitEl) nuitEl.textContent = `Nuit : ${night}`;
  if (tourEl) tourEl.textContent = `Tour : ${currentTurn}`;
}

function endGameAt6AM() {
  if (gameTime.hours >= 6) {
      gameWin = true;
      gameEnd = true;
      clearInterval(gameLoopInterval);
    console.log(`Fin de la nuit ${night} a 6AM.`);

      stopAllSounds();
    transitionEndNight(night);
  }
  return gameWin;
}