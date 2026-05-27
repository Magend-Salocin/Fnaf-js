//render.js

// Dessine une salle
function drawRoom(ctx, room) {
  // Dessine l'image par défaut de la salle
  if (loadedRoomImages[room.id]?.default?.complete) {
    ctx.drawImage(loadedRoomImages[room.id].default, room.x, room.y, room.width, room.height);
  } else {
    // Dessin par défaut si l'image n'est pas chargée
    ctx.strokeStyle = room.isOffice ? 'yellow' : 'white';
    ctx.strokeRect(room.x, room.y, room.width, room.height);
    ctx.fillStyle = 'white';
    ctx.fillText(room.name, room.x + 10, room.y + 20);
  }

  // Logique pour afficher les événements ou animatronics en mouvement
  if (room.id === 1 && loadedRoomImages[room.id]?.events) {
    // Exemple : Afficher un événement aléatoire dans l'entrée
    const eventIndex = Math.floor(Math.random() * loadedRoomImages[room.id].events.length);
    ctx.drawImage(
      loadedRoomImages[room.id].events[eventIndex],
      room.x, room.y, room.width, room.height
    );
  }

  if (room.id === 4 && loadedRoomImages[room.id]?.withAnimatronics) {
    // Exemple : Afficher une séquence d'images pour les animatronics dans la cuisine
    const animatronicsInRoom = animatronics.filter(a => a.currentRoomId === room.id);
    if (animatronicsInRoom.length > 0) {
      const frameIndex = Math.floor(Date.now() / 200) % loadedRoomImages[room.id].withAnimatronics.length;
      ctx.drawImage(
        loadedRoomImages[room.id].withAnimatronics[frameIndex],
        room.x, room.y, room.width, room.height
      );
    }
  }
}

// Dessine les portes
/*
function drawRoom(ctx, room) {
  // Dessine l'image par défaut de la salle
  if (loadedRoomImages[room.id]?.default?.complete) {
    ctx.drawImage(loadedRoomImages[room.id].default, room.x, room.y, room.width, room.height);
  } else {
    ctx.strokeStyle = room.isOffice ? 'yellow' : 'white';
    ctx.strokeRect(room.x, room.y, room.width, room.height);
    ctx.fillStyle = 'white';
    ctx.fillText(room.name, room.x + 10, room.y + 20);
  }

  // Affiche les événements actifs
  if (activeEvents[room.id]) {
    const event = activeEvents[room.id];
    if (event.type === 'event' && loadedRoomImages[room.id]?.events?.[event.imageIndex]?.complete) {
      ctx.drawImage(
        loadedRoomImages[room.id].events[event.imageIndex],
        room.x, room.y, room.width, room.height
      );
    }
  }

  // Affiche les animatronics en mouvement dans la cuisine
  if (room.id === 4 && loadedRoomImages[room.id]?.withAnimatronics) {
    const animatronicsInRoom = animatronics.filter(a => a.currentRoomId === room.id);
    if (animatronicsInRoom.length > 0) {
      const frameIndex = Math.floor(Date.now() / 200) % loadedRoomImages[room.id].withAnimatronics.length;
      ctx.drawImage(
        loadedRoomImages[room.id].withAnimatronics[frameIndex],
        room.x, room.y, room.width, room.height
      );
    }
  }
}*/
function drawRoom(ctx, room, cameraOffset = 0) {
  // Dessine l'image de la salle avec un offset pour le panoramique
  if (loadedRoomImages[room.id]?.default?.complete) {
    // Calcule la portion de l'image à afficher (découpage)
    const sourceX = cameraOffset; // Position X de départ dans l'image source
    const sourceWidth = room.width; // Largeur de la portion à afficher
    ctx.drawImage(
      loadedRoomImages[room.id].default,
      sourceX, 0, sourceWidth, room.imageHeight, // Source (x, y, width, height)
      room.x, room.y, room.width, room.height // Destination (x, y, width, height)
    );
  } else {
    // Dessin par défaut si l'image n'est pas chargée
    ctx.strokeStyle = room.isOffice ? 'yellow' : 'white';
    ctx.strokeRect(room.x, room.y, room.width, room.height);
    ctx.fillStyle = 'white';
    ctx.fillText(room.name, room.x + 10, room.y + 20);
  }
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
/*
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

    drawRoom(ctx, room); // Utilise la fonction mise à jour


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
*/

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
    drawRoom(ctx, office);
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
