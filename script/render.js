// Dessine une salle
function drawRoom(ctx, room) {
  ctx.strokeStyle = room.isOffice ? 'yellow' : 'white';
  ctx.strokeRect(room.x, room.y, room.width, room.height);
  ctx.fillStyle = 'white';
  ctx.fillText(room.name, room.x + 10, room.y + 20);
}

// Dessine les portes
function drawDoors(ctx) {
  doors.forEach(door => {
    const roomA = rooms.find(r => r.id === door.roomA);
    const roomB = rooms.find(r => r.id === door.roomB);
    if (roomA && roomB) {
      const x = Math.max(roomA.x, roomB.x) - 5;
      const y = Math.min(roomA.y, roomB.y) + 50;
      ctx.fillStyle = door.isClosed ? 'red' : 'green';
      ctx.fillRect(x, y, 10, 40);
    }
  });
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
    drawRoom(ctx, room);
    animatronics.forEach(animatronic => {
      if (animatronic.currentRoomId === room.id) {
        animatronic.draw(ctx);
      }
    });
    drawDoors(ctx);
    ctx.restore();


    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Caméra : ${camera.name}`, 20, 30);
    ctx.fillStyle = 'red';
    ctx.font = '24px Arial';
    ctx.fillText(`Temps restant : ${Math.ceil(cameraUsageTimer)}s`, 20, 60);
	
	// Dans drawRoom ou drawWithCamera
	animatronics.forEach(animatronic => {
	  if (animatronic.currentRoomId === room.id) {
		animatronic.draw(ctx);
		if (animatronic.blockedCounter > 0) {
		  ctx.fillStyle = 'orange';
		  ctx.fillText('BLOQUÉ !', room.x + 20, room.y + 60);
		}
	  }
	});
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
