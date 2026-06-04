/**
 * Représente une nuit de jeu.
 */
class Night {

    /**
     * @param {number} nightNumber Numéro de la nuit (1 à MAX_NIGHT)
     */
    constructor(nightNumber) {
        this.nightNumber = Math.max(1, Math.min(MAX_NIGHT, nightNumber));
    }

    /**
     * private
     * 
     * Retourne la configuration d'agressivité
     * des animatroniques pour cette nuit.
     *
     * @returns {Object}
     */
    getDifficultyConfig() {
        return NIGHT_AI_LEVELS[this.nightNumber];
    }

    /**
     * private
     *   
     * Applique les niveaux d'agressivité
     * aux animatroniques.
     */
    applyAnimatronicDifficulty() {
        const difficultyConfig = this.getDifficultyConfig();

        freddy.setAggression(difficultyConfig.freddy);
        bonnie.setAggression(difficultyConfig.bonnie);
        chica.setAggression(difficultyConfig.chica);
        foxy.setAggression(difficultyConfig.foxy);
    }

    /**
     * private
     * 
     * Réinitialise tous les animatroniques
     * dans leur salle de départ.
     */
    resetAnimatronics() {
        clearRoomsState();

        animatronics.forEach(animatronic => {

            animatronic.resetForNight();

            const startRoomKey =
                animatronic.getRoomKey(animatronic.startRoomId);

            if (!startRoomKey || !rooms[startRoomKey]) {
                return;
            }

            rooms[startRoomKey][animatronic.getKey()] = 1;
            rooms[startRoomKey].occupy = 1;
        });

        animatronics.forEach(animatronic => {
            animatronic.draw();
        });
    }

    /**
     * private  
     * 
     * Callback appelée lorsque le message du Phone Guy est terminé.
     */
    onPhoneCallFinished() {
        console.log(
            `Phone call finished for night ${this.nightNumber}.`
        );

        this.resetAnimatronics();
        this.applyAnimatronicDifficulty();

        isVocalEnd = true;
    }

    /**
     * ND
     * 
     * Indique si le message vocal est terminé.
     *
     * @returns {boolean}
     */
    isPhoneCallFinished() {
        return isVocalEnd;
    }

    /**
     * private
     * 
     * Retourne la durée du message vocal
     * associée à la nuit.
     *
     * @returns {number}
     */
    getPhoneCallDuration() {

        switch (this.nightNumber) {
            case 1: return 206000;
            case 2: return 103000;
            case 3: return 75000;
            case 4: return 65000;
            case 5: return 37000;
            default: return 0;
        }
    }

    /**
     * Joue le message du Phone Guy associé à la nuit courante.
     */
    playPhoneCall() {

        const phoneCallNumber =
            Math.min(5, Math.max(1, this.nightNumber));

        const soundId = `call_${phoneCallNumber}`;

        if (getSoundById(soundId)) {
            playSound(soundId);
        }

        setTimeout(() => {
            this.onPhoneCallFinished();
        }, this.getPhoneCallDuration());
    }
}

function startNight(nightNumber) {
  night = Math.max(1, Math.min(MAX_NIGHT, nightNumber));

  currentNight = new Night(night);

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
  currentNight.playPhoneCall();

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
    currentNight.resetAnimatronicsForNight();
    transitionEndNight(night);
  }
  return gameWin;
}