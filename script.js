const rooms = [
  { id: 0, name: "Bureau", x: 300, y: 100, width: 200, height: 200, isOffice: true },
  { id: 1, name: "Entrée", x: 50, y: 100, width: 150, height: 150, connectedTo: [{ roomId: 2, doorId: 0 }] },
  { id: 2, name: "Couloir", x: 200, y: 100, width: 100, height: 300, connectedTo: [{ roomId: 1, doorId: 0 }, { roomId: 3, doorId: 1 }, { roomId: 4, doorId: null }] },
  { id: 3, name: "Cuisine", x: 350, y: 100, width: 150, height: 150, connectedTo: [{ roomId: 2, doorId: 1 }] },
  { id: 4, name: "Scène", x: 200, y: 400, width: 200, height: 100, connectedTo: [{ roomId: 2, doorId: null }] },
];
const doors = [
  { id: 0, name: "Porte Gauche", roomA: 1, roomB: 2, isClosed: false },
  { id: 1, name: "Porte Droite", roomA: 2, roomB: 3, isClosed: false },
];
const cameras = [
  { id: 0, name: "Caméra 1", roomId: 1, maxUsageTime: 5, remainingTime: 0, isAvailable: true },
  { id: 1, name: "Caméra 2", roomId: 2, maxUsageTime: 3, remainingTime: 0, isAvailable: true },
  { id: 2, name: "Caméra 3", roomId: 4, maxUsageTime: 4, remainingTime: 0, isAvailable: true },
  { id: 3, name: "Caméra 4", roomId: 3, maxUsageTime: 4, remainingTime: 0, isAvailable: true },
];

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
/**************************************************/
/*******            Animatronic             *******/
/**************************************************/

class Animatronic {
  constructor(name, startRoomId) {
    this.name = name;
    this.currentRoomId = startRoomId;
    this.startRoomId = startRoomId;
    this.moveCounter = 0;
    this.isMoving = false;
  }

  move() {
    this.moveCounter++;
    if (this.moveCounter < 60) return;
    this.moveCounter = 0;

    const currentRoom = rooms.find(room => room.id === this.currentRoomId);
    if (currentRoom && !currentRoom.isOffice) {
      const possibleConnections = currentRoom.connectedTo.filter(connection => {
        const door = connection.doorId !== null ? doors.find(d => d.id === connection.doorId) : null;
        return !door || !door.isClosed;
      });

      if (possibleConnections.length > 0) {
        const randomConnection = possibleConnections[Math.floor(Math.random() * possibleConnections.length)];
        this.currentRoomId = randomConnection.roomId;
      } else {
        // Retour à la salle de départ si bloqué
        this.currentRoomId = this.startRoomId;
      }
    }
  }

  draw(ctx) {
    const currentRoom = rooms.find(room => room.id === this.currentRoomId);
    if (currentRoom) {
      ctx.fillStyle = this.name === 'Freddy' ? 'red' :
                      this.name === 'Bonnie' ? 'blue' : 'yellow';
      ctx.fillRect(currentRoom.x + 20, currentRoom.y + 20, 30, 30);
      ctx.fillStyle = 'white';
      ctx.fillText(this.name, currentRoom.x + 20, currentRoom.y + 15);
    }
  }
}

// Crée des animatronics
const freddy = new Animatronic('Freddy', 4);
const bonnie = new Animatronic('Bonnie', 1);
const chica = new Animatronic('Chica', 3);

const animatronics = [freddy, bonnie, chica];

/**************************************************/
/*******dessiner la map et les interactions *******/
/**************************************************/

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

function drawWithCamera(ctx, camera) {
  const room = rooms.find(r => r.id === camera.roomId);
  if (room) {
    // Efface le canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessine la salle surveillée par la caméra
    const scale = 1.5;
    const offsetX = (canvas.width - room.width * scale) / 2;
    const offsetY = (canvas.height - room.height * scale) / 2;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(room.x, room.y, room.width, room.height);
    ctx.fillStyle = 'white';
    ctx.fillText(room.name, room.x + 10, room.y + 20);

    // Dessine les animatronics présents dans cette salle
    animatronics.forEach(animatronic => {
      if (animatronic.currentRoomId === room.id) {
        animatronic.draw(ctx);
      }
    });

    // Dessine les portes connectées à cette salle
    drawDoors(ctx);
    ctx.restore();

    // Affiche le nom de la caméra et le temps restant
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Caméra : ${camera.name}`, 20, 30);

    // Affiche le compte à rebours
    if (activeView === 'camera') {
      ctx.fillStyle = 'red';
      ctx.font = '24px Arial';
      ctx.fillText(`Temps restant : ${Math.ceil(cameraUsageTimer)}s`, 20, 60);
    }
  }
}

// Effet de statique pour les caméras en recharge
function drawStaticEffect(ctx, camera) {
  ctx.save();
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
  ctx.fillText(`RECHARGE... (${Math.ceil(camera.remainingTime)}s)`, 50, 50);
  ctx.restore();
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
  // Dessine les boutons des portes
  document.getElementById('doorButtons').style.display = 'block';
}


/*************************************************************/
/*******Fonctions pour gérer les portes et les caméras *******/
/*************************************************************/
// Basculer l'état d'une porte
function toggleDoor(doorId) {
  const door = doors.find(d => d.id === doorId);
  if (door) {
    door.isClosed = !door.isClosed;
    const button = document.getElementById(`door${doorId + 1}`);
    if (button) {
      button.classList.toggle('closed', door.isClosed);
      button.textContent = `${door.name} (${door.isClosed ? 'Fermée' : 'Ouverte'})`;
    }
  }
}

// Activer une caméra
function activateCamera(cameraId) {
  const camera = cameras.find(c => c.id === cameraId);
  if (camera && camera.isAvailable) {
    activeView = 'camera';
    activeCamera = cameraId;
    cameraUsageTimer = camera.maxUsageTime;
    //camera.isAvailable = false; // Erreur de camera
  }
}

// Gestion du temps des caméras
let cameraUsageTimer = 0;
let isUsingCamera = false;


/*************************************************************/
/*******             Écouteurs d'événements             *******/
/*************************************************************/
// Boutons des caméras
document.getElementById('cam1').addEventListener('click', () => activateCamera(0));
document.getElementById('cam2').addEventListener('click', () => activateCamera(1));
document.getElementById('cam3').addEventListener('click', () => activateCamera(2));
document.getElementById('cam4').addEventListener('click', () => activateCamera(3));

// Boutons des portes
document.getElementById('door1').addEventListener('click', () => toggleDoor(0));
document.getElementById('door2').addEventListener('click', () => toggleDoor(1));

// Bouton pour revenir au bureau
document.getElementById('officeView').addEventListener('click', () => {
  activeView = 'office';
});

// Activation des lumières avec la touche Espace
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && activeView === 'office') {
    alert("Lumières activées ! Les animatronics reculent.");
    animatronics.forEach(animatronic => {
      animatronic.currentRoomId = animatronic.startRoomId;
    });
  }
});

/*************************************************************/
/*******             Boucle de jeu            *******/
/*************************************************************/
let activeView = 'office'; // 'office' ou 'camera'
let activeCamera = 0;

// Initialisation des boutons des portes
doors.forEach((door, index) => {
  document.getElementById(`door${index + 1}`).textContent = `${door.name} (Ouverte)`;
});

function gameLoop() {
   // Efface le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gestion du temps d'utilisation des caméras
  if (activeView === 'camera') {
    cameraUsageTimer -= 1/60; // Décrémente le temps (60 FPS)
    if (cameraUsageTimer <= 0) {
      cameras[activeCamera].isAvailable = false; // Désactive la caméra après utilisation
      cameras[activeCamera].remainingTime = 5; // Temps de recharge
      activeView = 'office'; // Retour au bureau
    }
  }

  // Recharge des caméras indisponibles
  cameras.forEach(camera => {
    if (!camera.isAvailable && camera.remainingTime > 0) {
      camera.remainingTime -= 1/60;
      if (camera.remainingTime <= 0) {
        camera.isAvailable = true; // Réactive la caméra après recharge
      }
    }
  });

  // Dessine selon la vue active
  if (activeView === 'office') {
    drawOfficeView(ctx);
  } else {
    const camera = cameras[activeCamera];
    drawWithCamera(ctx, camera);
  }

  // Met à jour les animatronics
  animatronics.forEach(animatronic => animatronic.move());

  // Relance la boucle
  requestAnimationFrame(gameLoop);
}

// Démarre la boucle de jeu
gameLoop();
