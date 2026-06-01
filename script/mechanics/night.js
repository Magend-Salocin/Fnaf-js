
class Night {

  constructor(nightNumber) {
    this.nightNumber = nightNumber;
  }

  VocalFinishCallback() {
    console.log(`Le vocal de la nuit ${this.nightNumber} est terminé.`);
    resetAnimatronicsForNight();
    applyNightDifficulty(this.nightNumber);
    isVocalEnd = true;
  }

  VocalIsFinish() {
    return isVocalEnd;
  }

}

function getNightAI(nightNumber) {
  const fallbackNight = Math.max(1, Math.min(MAX_NIGHT, nightNumber));
  return NIGHT_AI_LEVELS[fallbackNight];
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
  currentPowerUsageLevel = POWER_SYSTEM.BASE_USAGE;
  POWER_DISPLAY_CACHE.value = null;
  POWER_DISPLAY_CACHE.usage = null;
  POWER_DISPLAY_CACHE.lang = null;

  resetTimeState();
  resetOfficeState();
  resetCameraState();

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

function nightEndGame() {
    // Désactive les portes et bloque le jeu
    hideDoors();
    stopAllSounds();
}

function endGameAt6AM() {
  if (gameTime.hours >= 6) {
    gameWin = true;
    gameEnd = true;
    clearInterval(gameLoopInterval);
    console.log(`Fin de la nuit ${night} a 6AM.`);

    stopAllSounds();
    resetAnimatronicsForNight();
    transitionEndNight(night);
  }
  return gameWin;
}