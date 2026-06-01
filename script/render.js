//render.js

// Fonction pour redimensionner le canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function cameraUp() {
    const img = document.querySelector('#camera-bg2 img');
    img.src = 'images/_cam/camera_mode_1.gif';
    img.classList.toggle('display-1');

    camTimeout = setTimeout(() => {
        console.log('Cam up!');
  

        img.classList.remove('display-0', 'display-1');
        img.classList.add('display-0');
            
        activateCamera(lastActiveCamera);
        // Démarrer les sons d'ambiance en boucle
        playSoundLoop(ambienceSound);
    }, 500);
}

function cameraDown() {
    const img = document.querySelector('#camera-bg2 img');
    img.classList.remove('display-0', 'display-1');
    img.classList.add('display-1');
    img.src = 'images/_cam/camera_mode_0.gif';



    camTimeout = setTimeout(() => {
        img.classList.remove('display-0', 'display-1');
        img.classList.add('display-0');
        console.log('Cam down!');
    }, 500);
}


// Dessine une salle
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

function drawWithCamera(ctx, camera) {
    const roomKey = camera.id;
    const roomData = rooms[roomKey];
    if (!roomData) return;

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

    // Charge l'image en fonction de l'état de la pièce
    const imageKey = `${roomKey}_b${roomData.b}_c${roomData.c}_f${roomData.f}`;
    const camPicture = loadedCameraImages[roomKey]?.[imageKey];

    if (camPicture && camPicture.complete) {
        const sourceX = Math.max(0, Math.min(room.cameraOffset, camPicture.width - room.width));
        ctx.drawImage(
            camPicture,
            sourceX, 0, room.width, camPicture.height,
            0, 0, room.width, room.height
        );

            
        // 2. Lignes horizontales (interférences)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let y = 0; y < canvas.height; y += 4) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // 3. Bruit blanc (parasites)
        for (let i = 0; i < 1500; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const alpha = Math.random() * 0.7;
            // Variation de couleur : parfois gris, parfois teinté de vert/bleu (effet "vieille caméra")
            const hue = 120 + Math.random() * 60; // Teinte verte/bleue
            ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${alpha})`;
            ctx.fillRect(x, y, 1.5, 1.5);
        }

        // 4. Ajout de lignes verticales aléatoires (parasites)
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * canvas.width;
            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
    }

    ctx.restore();


    // Affiche le nom de la caméra et le temps restant
    ctx.fillStyle = 'white';
    ctx.font = `${20 * scale}px Arial`;
    ctx.fillText(`Caméra : ${camera.name}`, 20, 30 * scale);
    ctx.fillStyle = 'red';
    ctx.font = `${24 * scale}px Arial`;
    ctx.fillText(`Temps restant : ${Math.ceil(cameraUsageTimer)}s`, 20, 60 * scale);
}


// Effet de statique pour les caméras en recharge
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
 * Affiche l'heure actuelle dans le jeu (format HH:MM)
 * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
 */
function drawGameTime(ctx) {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Heure : ${formatGameTime(gameTime)}`, canvas.width - 150, 30);
}

/**
 * Affiche le tour actuel dans le jeu
 * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
 */
function drawCurrentTurn(ctx) {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Tour : ${currentTurn}`, canvas.width - 150, 60);
}

/***** Office ****/

function drawJumpscare(ctx, jumpscareKey) {
    if (loadedTheOfficeImages.safe_room && loadedTheOfficeImages.safe_room[jumpscareKey] && loadedTheOfficeImages.safe_room[jumpscareKey].complete) {
        ctx.drawImage(loadedTheOfficeImages.safe_room[jumpscareKey], 0, 0, canvas.width, canvas.height);
    }
}

function getOfficeImageKey() {
    // Exemple : Choisir une image en fonction de l'état des lumières
    if (!leftLightOn && !rightLightOn) {
        return 'safe_room_left_light_0_right_light_0';
    } else if (leftLightOn && !rightLightOn) {
        return 'safe_room_left_light_1_right_light_0';
    } else if (!leftLightOn && rightLightOn) {
        return 'safe_room_left_light_0_right_light_1';
    } else {
        return 'safe_room_left_light_1_right_light_1'; // Les deux lumières sont allumées
    }
}

// Dessine la vue du bureau
function drawOfficeView(ctx) {

    ctx.fillStyle = 'darkgray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
 
     // Choisir l'image en fonction de l'état des lumières
    const officeImageKey = getOfficeImageKey();
    if (loadedTheOfficeImages[officeImageKey] && loadedTheOfficeImages[officeImageKey].complete) {
        ctx.drawImage(loadedTheOfficeImages[officeImageKey], 0, 0, canvas.width, canvas.height);
    }

    ctx.restore();

    // Utilise roomsArray pour trouver la pièce "The Office"
    const office = roomsArray.find(r => r.isOffice);
    if (office) {
        drawRoom(ctx, office, 0);
        ctx.fillStyle = 'white';
        ctx.fillText("Bureau - Appuie sur Espace pour les lumières", office.x + 10, office.y + 40);

        doors.forEach((door, index) => {
          ctx.fillStyle = door.isClosed ? 'red' : 'green';
          ctx.fillText(`${door.name} : ${door.isClosed ? 'Fermée' : 'Ouverte'}`, 20, 100 + index * 30);
        });

        ctx.fillStyle = leftLightOn ? 'yellow' : 'gray';
        ctx.fillText(`Lumière Gauche : ${leftLightOn ? 'ON' : 'OFF'}`, 20, 160);
        ctx.fillStyle = rightLightOn ? 'yellow' : 'gray';
        ctx.fillText(`Lumière Droite : ${rightLightOn ? 'ON' : 'OFF'}`, 20, 190);
    }
}
