//render.js

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

  // Calcule la portion de l'image à afficher (découpage horizontal)
  const sourceX = Math.min(cameraOffset, camPicture.width - room.width);
  const sourceWidth = room.width; // Largeur de la portion à afficher

  // Dessine l'image avec le découpage
  ctx.drawImage(
    camPicture,
    sourceX, 0, sourceWidth, camPicture.height, // Source (x, y, width, height)
    room.x, room.y, room.width, room.height      // Destination (x, y, width, height)
  );
}

// Dessine la vue d'une caméra
function drawWithCamera(ctx, camera) {
  const room = rooms.find(r => r.id === camera.roomId);
  if (room) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = 1.5;
    const offsetX = (canvas.width - room.width * scale) / 2;
    const offsetY = (canvas.height - room.height * scale) / 2;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Passe l'offset de caméra pour le panoramique
    drawRoom(ctx, room, room.cameraOffset);

    //drawDoors(ctx);
    ctx.restore();

    // Affiche le nom de la caméra et le temps restant
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Caméra : ${camera.name}`, 20, 30);
    ctx.fillStyle = 'red';
    ctx.font = '24px Arial';
    ctx.fillText(`Temps restant : ${Math.ceil(cameraUsageTimer)}s`, 20, 60);
  }
} 


// Effet de statique pour les caméras en recharge
function drawStaticEffect(ctx, camera) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`RECHARGE... (${Math.ceil(cameras[activeCamera].remainingTime)}s)`, 50, 50);
  ctx.fillStyle = 'yellow';
  ctx.fillText(`Caméra ${camera.name} en recharge`, 50, 80);
}

// Dessine la vue du bureau
function drawOfficeView(ctx) {
  ctx.fillStyle = 'darkgray';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const office = rooms.find(r => r.isOffice);
  if (office) {
	activeCamera = 0;
    drawRoom(ctx, office ,0);
    ctx.fillStyle = 'white';
    ctx.fillText("Bureau - Appuie sur Espace pour les lumières", office.x + 10, office.y + 40);
  }

  doors.forEach((door, index) => {
    ctx.fillStyle = door.isClosed ? 'red' : 'green';
    ctx.fillText(`${door.name} : ${door.isClosed ? 'Fermée' : 'Ouverte'}`, 20, 100 + index * 30);
  });

  ctx.fillStyle = leftLightOn ? 'yellow' : 'gray';
  ctx.fillText(`Lumière Gauche : ${leftLightOn ? 'ON' : 'OFF'}`, 20, 160);
  ctx.fillStyle = rightLightOn ? 'yellow' : 'gray';
  ctx.fillText(`Lumière Droite : ${rightLightOn ? 'ON' : 'OFF'}`, 20, 190);
}
