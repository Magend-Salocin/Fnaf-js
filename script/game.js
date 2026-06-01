



_loadAudioMixerState();
_syncMixerUI();



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

    if (!gameEnd) {
      drainPowerByUsage(1 / 60);
      updatePowerDisplay();
    }

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
    DebugDrawCurrentTurn(); // Affiche le tour actuel dans le debug panel


 
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

// Fonction pour redimensionner le canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function Start(){
    document.getElementById('start-screen').classList.add('display-0');
    document.querySelector('.preloader').classList.remove('display-0', 'display-1')
    document.querySelector('.transition').classList.remove('display-0', 'display-1')
    night=1;
    transitionScreen(1);
}

function gamestart(){
    // Appelle la fonction au chargement et au redimensionnement de la fenêtre
    window.addEventListener('load', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);

    setupEventListeners();

    // Démarre la nuit courante avec une réinitialisation complète
    startNight(night);

    resizeCanvas();

    // Démarre le compteur d'heures (1 tick = 1/60s)
    hourInterval = setInterval(() => {
        // La gestion des heures est déjà dans gameLoop, donc cet intervalle n'est pas nécessaire.
        // On peut le supprimer ou l'utiliser pour d'autres mises à jour moins fréquentes.
    }, 1000/60);
}