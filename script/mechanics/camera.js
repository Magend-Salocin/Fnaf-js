

/* ------------------------------------------------------------------ */
/*  Animated GIF layer — drawn directly on the canvas (no DOM hacks)   */
/* ------------------------------------------------------------------ */

/**
 * Registry of active GIF players: { id → { player: GifPlayer, x, y, w, h, visible } }
 * Use the helpers below to load / show / hide / remove them.
 */
const gifRegistry = {};

const CAMERA_DEBUG_CONSTANTS = Object.freeze({
  RECHARGE_SECONDS: 5,
  AUTO_PAN_STEP: 1,
  EMPTY_ROOM_SOUND_CHANCE: 0.2
});

let lastActiveCameraId = null;

let currentSoundCamera = null;

var _pictureGif=null;

function resolveOfficeLookDirectionFromOffset(offset) {
  if (offset <= -0.33) return 'left';
  if (offset >= 0.33) return 'right';
  return 'center';
}

function setOfficeLookTargetOffset(offset) {
  if (activeView !== 'office' || gameEnd) return;

  officeLookTargetOffset = Math.max(-1, Math.min(1, offset));
  officeLookTargetDirection = resolveOfficeLookDirectionFromOffset(officeLookTargetOffset);
}

function updateOfficeLookControls() {
  const controls = document.getElementById('office-look-controls');
  if (!controls) return;

  const shouldShow = activeView === 'office' && !gameEnd;
  controls.classList.toggle('hidden', !shouldShow);
}

function setOfficeLookDirection(direction) {
  if (!OFFICE_LOOK_POSITIONS.hasOwnProperty(direction)) return;
  setOfficeLookTargetOffset(OFFICE_LOOK_POSITIONS[direction]);
}

function shiftOfficeLook(step) {
  if (activeView !== 'office' || gameEnd || officeLookIsMoving) return;

  const directionOrder = ['left', 'center', 'right'];
  const currentIndex = directionOrder.indexOf(officeLookDirection);
  if (currentIndex < 0) return;

  const nextIndex = Math.max(0, Math.min(directionOrder.length - 1, currentIndex + step));
  setOfficeLookDirection(directionOrder[nextIndex]);
}

function updateOfficeLookAnimation() {
  const previousDirection = officeLookDirection;
  const previousMoving = officeLookIsMoving;
  const delta = officeLookTargetOffset - officeLookCurrentOffset;
  const isMovingNow = Math.abs(delta) > 0.004;

  if (isMovingNow) {
    officeLookCurrentOffset += delta * 0.12;
  } else {
    officeLookCurrentOffset = officeLookTargetOffset;
  }

  officeLookDirection = resolveOfficeLookDirectionFromOffset(officeLookCurrentOffset);
  officeLookIsMoving = isMovingNow;

  syncOfficeDoorAnchors();

  if (previousDirection !== officeLookDirection || previousMoving !== officeLookIsMoving) {
    updateOfficeDoorVisibility();
    updateOfficeLookControls();
  }
}

function updateCameraPanelState(isOpen) {
  const panel = document.getElementById('camera-panel');
  const statusEl = document.getElementById('camera-panel-status');
  const footerEl = document.getElementById('camera-panel-footer');

  if (!panel || !statusEl || !footerEl) {
    return;
  }

  const lang = window.selectedLanguage || window.FNAF_DEFAULT_LANGUAGE || 'fr';
  const allTranslations = window.FNAF_TRANSLATIONS || {};
  const t = allTranslations[lang] || allTranslations[window.FNAF_DEFAULT_LANGUAGE] || {};
  const onlineLabel = t.panels?.cameraOnline || 'ONLINE';
  const closeLabel = t.panels?.cameraFooterClose || 'CLICK TO CLOSE';
  const readyLabel = t.panels?.cameraStatus || 'READY';
  const openLabel = t.panels?.cameraFooter || 'CLICK TO OPEN';

  if (isOpen) {
    panel.classList.remove('camera-closing');
    panel.classList.add('camera-open');
    statusEl.textContent = onlineLabel;
    footerEl.textContent = closeLabel;
    return;
  }

  panel.classList.remove('camera-open');
  panel.classList.add('camera-closing');
  statusEl.textContent = readyLabel;
  footerEl.textContent = openLabel;

  setTimeout(() => {
    panel.classList.remove('camera-closing');
  }, 350);
}

/**
 * Basculer l'affichage de la caméra (ouvrir/fermer)
 */
function showCloseCamera(){
  if (gameEnd) return;

  const cameraLayout = document.getElementById('cameraLayout');
  // Inverse l'affichage de la caméra
  const willOpen = cameraLayout.style.display !== 'block';
  cameraLayout.style.display = willOpen ? 'block' : 'none';

  if (!willOpen) {
    activeView = 'office'; // Retour à la vue du bureau
    cameraDown(); // Animation de descente de la caméra
    lastActiveCamera = activeCamera; // Sauvegarde la dernière caméra active
    activeCamera = 0; // Désactive la caméra
    playSound("camera_put_down"); // Joue le son de descente de caméra
    updateCameraPanelState(false);
  } else {
    hideDoors();
    updateOfficeLookControls();
    playSound("camera_toggle"); // Joue le son de basculement de caméra
    cameraUp(); // Animation de montée de la caméra
    updateCameraPanelState(true);
  }
}

/**
 * Activer une caméra spécifique
 * @param {string} cameraId - L'identifiant de la caméra à activer
 */
function activateCamera(cameraId) {
  const camera = cameras.find(c => c.id === cameraId);
  if (camera && camera.isAvailable && power > 0) {
      activeView = 'camera'; // Passe en vue caméra
    updateOfficeDoorVisibility();
    updateOfficeLookControls();
    activeCamera = cameraId; // Définit la caméra active
    if (typeof RandomEvents !== 'undefined') {
      RandomEvents.notifyCameraSwitch(cameraId); // Notifie du changement de caméra
    }
    
    // Si la caméra change, joue un son ambiant
    if (lastActiveCameraId !== cameraId) {
      CameraPlaysound(cameraId);
      lastActiveCameraId = activeCamera;
    }

    cameraUsageTimer = camera.maxUsageTime; // Réinitialise le timer d'utilisation
    updatePowerDisplay(); // Met à jour l'affichage de l'énergie
    playSound("camera_cycle"); // Joue le son de changement de caméra
    isUsingCamera = true; // Indique que la caméra est en cours d'utilisation
  }
}


/**
 * Gère les actions à effectuer à chaque nouveau tour (frame)
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

      const camera = cameras.find(c => c.id === activeCamera);
      if (!camera) return;

      // Utilise roomsArray pour trouver la pièce associée à la caméra
      const room = roomsArray.find(r => r.id === camera.roomId);
      if (!room) return;

      // Met à jour les événements aléatoires
      if (typeof RandomEvents !== 'undefined') {
        RandomEvents.update(1/60, camera, room);
      }

        // Mise à jour de room.cameraOffset en fonction des touches
        if (isPanningLeft && room.cameraOffset > 0) {
            room.cameraOffset -= panSpeed;
        }
        if (isPanningRight && room.cameraOffset < room.maxCameraOffset) {
            room.cameraOffset += panSpeed;
        }

        room.cameraOffset = Math.max(0, Math.min(room.cameraOffset, room.maxCameraOffset));

        // Panoramique automatique (va-et-vient)
        const nextOffset = room.cameraOffset + (autoPanDirection * CAMERA_DEBUG_CONSTANTS.AUTO_PAN_STEP);
        if (nextOffset <= 0) {
          room.cameraOffset = 0;
          autoPanDirection = 1;
        } else if (nextOffset >= room.maxCameraOffset) {
          room.cameraOffset = room.maxCameraOffset;
          autoPanDirection = -1;
        } else {
          room.cameraOffset = nextOffset;
        }

      if (isUsingCamera) {
        cameraUsageTimer -= 1/60;
        if (cameraUsageTimer <= 0) {
          camera.isAvailable = false;// Désactive la caméra
          camera.remainingTime = CAMERA_DEBUG_CONSTANTS.RECHARGE_SECONDS;// Temps de recharge
          isUsingCamera = false;
        }
      } else {
        camera.remainingTime -= 1/60;
        if (camera.remainingTime <= 0) {
          camera.isAvailable = true;// Réactive la caméra
          cameraUsageTimer = camera.maxUsageTime;
          isUsingCamera = true;
        }
      }
       // Affiche la caméra ou l'effet de statique selon l'état
      if (isUsingCamera) {
        drawWithCamera(ctx, camera); 
      } else {
        drawStaticEffect(ctx, camera); 
      }

    }
  }

  displayCameraStatus();
}

function displayCameraStatus() {
  const statusDiv = document.getElementById('camera-status');
  if (!statusDiv) return;

  const activeCameraData = cameras.find(c => c.id === activeCamera) || null;
  const camerasSummary = cameras
    .map(camera => {
      const availability = camera.isAvailable ? 'UP' : 'DOWN';
      return `${camera.id}:${availability} use=${camera.maxUsageTime}s reload=${camera.remainingTime.toFixed(1)}s`;
    })
    .join('<br/>');

  statusDiv.innerHTML = `
    <div style="font-weight:bold; color:#66ccff; margin-bottom:4px;">CAMERA DEBUG</div>
    <div>
      <span style="color:#bbb;">activeView:</span> ${activeView}<br/><br/>
      <span style="color:#bbb;">activeCamera:</span> ${activeCamera}<br/><br/>
      <span style="color:#bbb;">lastActiveCamera:</span> ${lastActiveCamera}<br/><br/>
      <span style="color:#bbb;">lastActiveCameraId:</span> ${lastActiveCameraId || 'none'}<br/><br/>
      <span style="color:#bbb;">isUsingCamera:</span> ${isUsingCamera}<br/><br/>
      <span style="color:#bbb;">cameraUsageTimer:</span> ${cameraUsageTimer.toFixed(2)}s<br/><br/>
      <span style="color:#bbb;">currentSoundCamera:</span> ${currentSoundCamera || 'none'}<br/><br/>
      <span style="color:#bbb;">power:</span> ${Math.max(0, power).toFixed(2)}%<br/><br/>
      <span style="color:#bbb;">panSpeed:</span> ${panSpeed}<br/><br/>
      <span style="color:#bbb;">autoPanDirection:</span> ${autoPanDirection}<br/><br/>
      <span style="color:#bbb;">roomOffset/max:</span> ${activeCameraData ? (() => {
        const room = roomsArray.find(r => r.id === activeCameraData.roomId);
        if (!room) return 'n/a';
        return `${room.cameraOffset}/${room.maxCameraOffset}<br/>`;
      })() : 'n/a'}
    </div>
    <hr style="border-color:#444; margin:6px 0;"/>
    <div style="color:#ffaa66; font-weight:bold; margin-bottom:3px;">CONSTANTS</div>
    <div>
      <span style="color:#bbb;">RECHARGE_SECONDS:</span> ${CAMERA_DEBUG_CONSTANTS.RECHARGE_SECONDS}<br/><br/>
      <span style="color:#bbb;">AUTO_PAN_STEP:</span> ${CAMERA_DEBUG_CONSTANTS.AUTO_PAN_STEP}<br/><br/>
      <span style="color:#bbb;">EMPTY_ROOM_SOUND_CHANCE:</span> ${CAMERA_DEBUG_CONSTANTS.EMPTY_ROOM_SOUND_CHANCE}<br/><br/>
      <span style="color:#bbb;">CAMERAS_TOTAL:</span> ${cameras.length}<br/>
    </div>
    <hr style="border-color:#444; margin:6px 0;"/>
    <div style="color:#a0ffa0; font-weight:bold; margin-bottom:3px;">CAMERAS</div>
    <div>${camerasSummary}</div>
  `;

  if (!statusDiv.style.display || statusDiv.style.display === 'none') {
    statusDiv.style.display = 'block';
  }
}

/**
 * Animation de montée de la caméra
 */
function cameraUp() {
    const img = document.querySelector('#camera-bg2 img');
    img.src = 'images/_cam/camera_mode_1.gif';
    img.classList.toggle('display-1');

    camTimeout = setTimeout(() => {
        hideDoors();
      updateOfficeLookControls();
        img.classList.remove('display-0', 'display-1');
        img.classList.add('display-0');
         
        // Active la dernière caméra utilisée            
        activateCamera(lastActiveCamera);
        
        // Joue le son de basculement
        playSound("camera_toggle"); 
    }, 500);
}

/**
 * Animation de descente de la caméra
 */
function cameraDown() {
    const img = document.querySelector('#camera-bg2 img');
    img.classList.remove('display-0', 'display-1');
    img.classList.add('display-1');
    img.src = 'images/_cam/camera_mode_0.gif';
    showDoors();
    updateOfficeLookControls();
    
    // Arrête le son en cours
    stopSound(currentSoundCamera);
    camTimeout = setTimeout(() => {
        img.classList.remove('display-0', 'display-1');
        img.classList.add('display-0');
    }, 500);
}

/**
 * Dessine une salle sur le canvas
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {Object} room - Objet représentant la salle
 * @param {number} cameraOffset - Décalage de la caméra pour le panoramique
 */
function drawRoom(ctx, room, cameraOffset = 0) {
    // Récupère l'image active pour la caméra actuelle
    const camera = cameras.find(c => c.id === activeCamera);
    if (!camera) return;

    // Clé de l'image par défaut (ex. "b0_c0_f0")
    const defaultImageKey = activeCamera+"_b0_c0_f0";

    const camPicture = loadedCameraImages[activeCamera]?.[defaultImageKey];

    // Vérifie que l'image est chargée
    if (!camPicture || !camPicture.complete) {
        console.warn(`Image non chargée pour la caméra ${activeCamera} _ ${defaultImageKey}`);
        return;
    }

    // Utilise room.cameraOffset pour le panoramique
    const sourceX = Math.max(0, Math.min(room.cameraOffset, camPicture.width - room.width));
    const sourceWidth = room.width;

    ctx.drawImage(
        camPicture,
        sourceX, 0, sourceWidth, camPicture.height,
        room.x, room.y, room.width, room.height
    );
}

/**
 * Résolveurs de clé d'image spécifiques à certaines caméras, pour les
 * cas où la simple combinaison `{roomKey}_b{b}_c{c}_f{f}` ne suffit pas
 * (état scripté d'un animatronic, décor qui change avec la nuit...).
 * Chaque résolveur reçoit l'état de la pièce (`rooms[roomKey]`) et
 * retourne soit une clé d'image de substitution, soit `null` pour
 * garder la clé par défaut. Pour ajouter un cas particulier sur une
 * nouvelle caméra : une entrée ici, pas une branche de plus dans
 * drawWithCamera().
 */
const ROOM_IMAGE_KEY_RESOLVERS = {
  // Pirate Cove : l'image suit la phase de Foxy plutôt que la simple
  // présence b/c/f.
  '1c': () => {
    if (typeof foxy === 'undefined' || !foxy.foxyInstance) return null;

    switch (foxy.foxyInstance.getStatus().phase) {
      case FoxyPhase.INACTIF:       return '1c_b0_c0_f0_00';
      case FoxyPhase.TETE_SORTIE:   return '1c_b0_c0_f0_01';
      case FoxyPhase.PRET_A_SORTIR: return '1c_b0_c0_f0_02';
      case FoxyPhase.COURSE:        return '1c_b0_c0_f0_03';
      case FoxyPhase.RETRAIT:       return '1c_b0_c0_f0_00';
      default:                      return null;
    }
  },

  // East Hall Corner : l'affiche au mur change chaque nuit et dépend de
  // la langue choisie (cf. images/rooms/4b_east_hall_corner/hidden/
  // {fr,en}/4b_b0_c0_f0_dN.*), uniquement quand la pièce est vide.
  // Si la variante nuit/langue n'existe pas encore, drawWithCamera()
  // retombe normalement sur l'image par défaut.
  '4b': (roomData) => {
    if (roomData.b !== 0 || roomData.c !== 0 || roomData.f !== 0) return null;

    const posterNight = Math.min((typeof _night !== 'undefined' ? _night : 1), 5);
    const posterLang = window.selectedLanguage || window.FNAF_DEFAULT_LANGUAGE || 'fr';
    return `4b_b0_c0_f0_d${posterNight}_${posterLang}`;
  }
};

/**
 * Dessine la vue de la caméra avec effets visuels
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {Object} camera - Objet représentant la caméra
 */
function drawWithCamera(ctx, camera) {
    const roomKey = camera.id;

    const roomData = rooms[roomKey];
    if (!roomData) return;
    const animatronicsInRoom = getAnimatronicsInRoom(roomKey);
    const eventAnimatronic = (typeof RandomEvents !== 'undefined' && typeof RandomEvents.getAnimatronicForCamera === 'function')
      ? RandomEvents.getAnimatronicForCamera(roomKey)
      : null;
    const detectedAnimatronicLabel = eventAnimatronic || (animatronicsInRoom.length ? animatronicsInRoom.join(', ') : 'Aucun');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const room = roomsArray.find(r => r.cameraId === roomKey);
    if (!room) return;

    // Calcule l'échelle pour adapter la salle à la taille du canvas
    const scaleX = canvas.width / room.width;
    const scaleY = canvas.height / room.height;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (canvas.width - room.width * scale) / 2;
    const offsetY = (canvas.height - room.height * scale) / 2;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Clé d'image par défaut, dérivée de l'état de la pièce (présence des
    // animatronics). Certaines caméras ont besoin d'un état supplémentaire
    // (phase de Foxy, décor qui change par nuit) : voir
    // ROOM_IMAGE_KEY_RESOLVERS, pour ne pas avoir à ajouter une branche
    // ici à chaque nouveau cas particulier.
    let imageKey = `${roomKey}_b${roomData.b}_c${roomData.c}_f${roomData.f}`;
    const customImageKey = ROOM_IMAGE_KEY_RESOLVERS[roomKey]?.(roomData);
    if (customImageKey) imageKey = customImageKey;

    const cameraImages = loadedCameraImages[roomKey] || {};
    const fallbackImageKey = `${roomKey}_b0_c0_f0`;
    const resolvedImageKey = cameraImages[imageKey] ? imageKey : fallbackImageKey;
    const camPicture = cameraImages[resolvedImageKey];

    if (camPicture && camPicture.complete) {

        const sourceX = Math.max(0, Math.min(room.cameraOffset, camPicture.width - room.width));
   
        ctx.drawImage(
            camPicture,
            sourceX, 0, room.width, camPicture.height,
            0, 0, room.width, room.height
        );


      // Dessine les overlays d'événements aléatoires
      RandomEvents.drawActiveOverlay(ctx, camera, room);

      // Dessine les parasites selon la configuration de la caméra
      const parasiteConfig = getParasiteConfigByRoom(roomKey);
      const viewWidth = room.width;
      const viewHeight = room.height;
      drawParasites(ctx, parasiteConfig, viewWidth, viewHeight, scale);
    }

    // Un seul restore ici, pour le save() plus haut — qu'il y ait eu une
    // image à dessiner ou non (auparavant un restore() supplémentaire
    // s'exécutait dans le bloc ci-dessus, dépilant un état qui ne lui
    // appartenait pas).
    ctx.restore();
    // Affiche le nom de la caméra et le temps restant
    ctx.fillStyle = 'white';
    ctx.font = `${20 * scale}px Arial`;
    ctx.fillText(`Caméra : ${camera.name}`, 20, 30 * scale);
    ctx.fillStyle = 'red';


    // Render any registered animated GIFs on top of the camera view
    drawGifs(ctx);
}

/**
 * Joue un son aléatoire en fonction de la présence ou non d'un animatronic dans la pièce.
 * @param {string} cameraId - L'identifiant de la caméra associée à la pièce.
 */
function CameraPlaysound(cameraId) {

    stopSound(currentSoundCamera);

    // Vérifie la présence d'un animatronic dans la pièce
    const isAnimatronicPresent = isAnimatronicInRoom(cameraId);
    const room = roomsArray.find(r => r.cameraId === cameraId);
    let randomSound = null;

    if(isAnimatronicPresent && room.name === "Kitchen"){
      const possibleSoundsWithAnimatronic = ["kitchen_b", "kitchen_c", "kitchen_f", "kitchen_drawer"];
      randomSound = possibleSoundsWithAnimatronic[Math.floor(Math.random() * possibleSoundsWithAnimatronic.length)];
    }

/*
    if(Math.random() < CAMERA_DEBUG_CONSTANTS.EMPTY_ROOM_SOUND_CHANCE){ // 20% de chance de jouer un son même si la pièce est vide
      // Tableau des sons possibles si aucun animatronic n'est présent
      let possibleSoundsEmpty = ["laugh_girl1", "laugh_girl1d", "laugh_girl2d", "laugh_girl8d"];
      if (isAnimatronicPresent) {
        possibleSoundsEmpty = ["breath_1", "breath_2", "breath_3", "breath_4", "whispering", "robot_voice", "garble_1", "garble_2"];
      }
      randomSound = possibleSoundsEmpty[Math.floor(Math.random() * possibleSoundsEmpty.length)];
    }
*/
    if(randomSound){
      currentSoundCamera = randomSound;
      
      playSound(randomSound);
      console.log(`Son joué (animatronic présent) : ${randomSound}` );
    }
  }

/**
 * Effet de statique pour les caméras en recharge
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {Object} camera - Objet représentant la caméra
 */
function drawStaticEffect(ctx, camera) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 1200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.6})`;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`RECHARGE... (${Math.ceil(camera.remainingTime)}s)`, 50, 50);
  ctx.fillStyle = 'yellow';
  ctx.fillText(`Caméra ${camera.name} en recharge`, 50, 80);
}



/**
 * Dessine la vue du bureau en utilisant une clé d'image spécifique
 * @param {string} officeImageKey - Clé de l'image du bureau à afficher
 */
function drawOfficeViewByPicture(officeImageKey){
  if (loadedTheOfficeImages[officeImageKey] && loadedTheOfficeImages[officeImageKey].complete) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);	
    activeView = 'office';
    updateOfficeDoorVisibility();
    updateOfficeLookControls();
    drawOfficeView(ctx,officeImageKey);
  }
}

/**
 * Dessine la vue du bureau
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {string} officeImageKey - Clé de l'image du bureau à afficher (optionnel)
 */
function drawOfficeView(ctx,officeImageKey=null) {

  updateOfficeLookAnimation();

    ctx.fillStyle = 'darkgray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Choisir l'image en fonction de l'état des lumières
    if(officeImageKey == null){
      officeImageKey = getOfficeImageKey();
    }

    if (loadedTheOfficeImages[officeImageKey] && loadedTheOfficeImages[officeImageKey].complete) {
        const picture = loadedTheOfficeImages[officeImageKey];

        // Vérifie si l'image est un GIF
        if (isGif(picture)) {

            if(_pictureGif != picture){
            // Affiche le GIF (il sera dessiné par drawGifs)
            showGif(picture);
            _pictureGif = picture;
            }
        } else {
            // Si ce n'est pas un GIF, dessine l'image normalement
          const drawWidth = canvas.width * (1 + OFFICE_LOOK_PAN_INTENSITY);
          const drawHeight = canvas.height * 1.02;
          const maxHorizontalShift = (drawWidth - canvas.width) / 2;
          const drawX = ((canvas.width - drawWidth) / 2) - (officeLookCurrentOffset * maxHorizontalShift);
          const drawY = (canvas.height - drawHeight) / 2;

          ctx.drawImage(picture, drawX, drawY, drawWidth, drawHeight);
            hideGif();
        }
    }
}

/**
 * Vérifie si un animatronic est présent dans une pièce
 * @param {string} roomKey - Clé de la pièce
 * @returns {boolean} - Vrai si un animatronic est présent
 */
function isAnimatronicInRoom(roomKey) {
    const roomData = rooms[roomKey];

    if (!roomData) return false;

    // Vérifie si au moins un animatronic est présent dans la pièce
    return roomData.b === 1 || roomData.c === 1 || roomData.f === 1 || roomData.foxy === 1;
}

/**
 * Retourne la liste des animatronics présents selon les flags roomData.
 * b -> Bonnie, c -> Chica, f -> Freddy.
 * @param {string} roomKey - Clé de la pièce
 * @returns {string[]} - Noms des animatronics présents
 */
function getAnimatronicsInRoom(roomKey) {
  const roomData = rooms[roomKey];
  if (!roomData) return [];

  const present = [];
  if (roomData.b === 1) present.push('Bonnie');
  if (roomData.c === 1) present.push('Chica');
  if (roomData.f === 1) present.push('Freddy');
  if (roomData.foxy === 1) present.push('Foxy');
  return present;
}