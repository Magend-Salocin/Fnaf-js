// Récupère le canvas et son contexte
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const rooms = [
  { id: 0, name: "Entrée", x: 0, y: 0, width: 200, height: 200, connectedTo: [{ roomId: 1, doorId: 0 }] },
  { id: 1, name: "Couloir", x: 200, y: 0, width: 200, height: 200, connectedTo: [{ roomId: 0, doorId: 0 }, { roomId: 2, doorId: 1 }] },
  { id: 2, name: "Cuisine", x: 400, y: 0, width: 200, height: 200, connectedTo: [{ roomId: 1, doorId: 1 }] },
  { id: 3, name: "Salle de jeu", x: 0, y: 200, width: 200, height: 200, connectedTo: [{ roomId: 4, doorId: null }] },
  { id: 4, name: "Scène", x: 200, y: 200, width: 200, height: 200, connectedTo: [{ roomId: 3, doorId: null }] },
];

const cameras = [
  { name: "Caméra 1", roomId: 0, maxUsageTime: 5, remainingTime: 0, isAvailable: true },
  { name: "Caméra 2", roomId: 1, maxUsageTime: 3, remainingTime: 0, isAvailable: true },
  { name: "Caméra 3", roomId: 3, maxUsageTime: 4, remainingTime: 0, isAvailable: true },
];

const doors = [
  { id: 0, name: "Porte 1", roomA: 0, roomB: 1, isClosed: false },
  { id: 1, name: "Porte 2", roomA: 1, roomB: 2, isClosed: false },
];

let activeView = 'office'; // 'office' ou 'camera'
let activeCamera = 0;

let cameraUsageTimer = 0;
let isUsingCamera = false;

function activateCamera(cameraIndex) {
  const camera = cameras[cameraIndex];
  if (camera.isAvailable) {
    activeCamera = cameraIndex;
    isUsingCamera = true;
    cameraUsageTimer = camera.maxUsageTime;
    camera.isAvailable = false;
  }
}

function drawStaticEffect(ctx, camera) {
  // Sauvegarde le contexte actuel
  ctx.save();

  // Applique la "vue" de la caméra
  ctx.beginPath();
  ctx.rect(camera.view.x, camera.view.y, camera.view.width, camera.view.height);
  ctx.clip();

  // Dessine un fond noir semi-transparent
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(camera.view.x, camera.view.y, camera.view.width, camera.view.height);

  // Dessine des lignes horizontales pour imiter un écran HS
  ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
  ctx.lineWidth = 1;
  const lineSpacing = 6; // Espacement entre les lignes
  for (let y = camera.view.y; y < camera.view.y + camera.view.height; y += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(camera.view.x, y);
    ctx.lineTo(camera.view.x + camera.view.width, y);
    ctx.stroke();
  }

  // Dessine des pixels aléatoires pour simuler la statique
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * camera.view.width + camera.view.x;
    const y = Math.random() * camera.view.height + camera.view.y;
    const size = Math.random() * 3;
    const opacity = Math.random() * 0.8;
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fillRect(x, y, size, size);
  }

  // Affiche un message "RECHARGE..."
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`RECHARGE... (${Math.ceil(camera.remainingTime)}s)`, camera.view.x + 20, camera.view.y + 30);

  // Restaure le contexte
  ctx.restore();
}

function toggleDoor(doorId) {
  const door = doors.find(d => d.id === doorId);
  if (door) {
    door.isClosed = !door.isClosed;
    // Met à jour le style du bouton
    const button = document.getElementById(`door${doorId + 1}`);
    if (button) {
      button.classList.toggle('closed', door.isClosed);
      button.textContent = `${door.name} (${door.isClosed ? 'Fermée' : 'Ouverte'})`;
    }
  }
}

function drawOfficeView(ctx) {
  ctx.fillStyle = 'darkgray';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dessine toutes les salles en miniature
  rooms.forEach(room => {
    ctx.strokeStyle = 'white';
    ctx.strokeRect(room.x / 2, room.y / 2, room.width / 2, room.height / 2);
    ctx.fillStyle = 'white';
    ctx.fillText(room.name, room.x / 2 + 10, room.y / 2 + 20);
  });

  // Dessine les portes
  drawDoors(ctx);

  // Dessine l'animatronic dans sa salle actuelle
  const currentRoom = rooms.find(room => room.id === freddy.currentRoomId);
  if (currentRoom) {
    ctx.fillStyle = 'red';
    ctx.fillRect(currentRoom.x / 2 + 25, currentRoom.y / 2 + 25, freddy.width / 2, freddy.height / 2);
  }
}

function drawWithCamera(ctx, camera) {
  const room = rooms.find(r => r.id === camera.roomId);
  if (room) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.clip();

    // Dessine la salle
    drawRoom(ctx, room);

    // Dessine l'animatronic s'il est dans cette salle
    if (freddy.currentRoomId === room.id) {
      freddy.draw(ctx);
    }

    ctx.restore();
  }
}

function drawDoors(ctx) {
  doors.forEach(door => {
    const roomA = rooms.find(room => room.id === door.roomA);
    const roomB = rooms.find(room => room.id === door.roomB);
    if (roomA && roomB) {
      // Position de la porte (au milieu entre les deux salles)
      const x = Math.max(roomA.x, roomB.x) - 5;
      const y = Math.min(roomA.y, roomB.y) + 100;
      const width = 10;
      const height = 40;

      // Dessine la porte
      ctx.fillStyle = door.isClosed ? 'red' : 'green';
      ctx.fillRect(x, y, width, height);
    }
  });
}

function drawRoom(ctx, room) {
  ctx.strokeStyle = 'white';
  ctx.strokeRect(room.x, room.y, room.width, room.height);
  ctx.fillStyle = 'white';
  ctx.fillText(room.name, room.x + 10, room.y + 20);
}

class Animatronic {
constructor(name, x, y, currentRoomId) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.currentRoomId = currentRoomId;
    this.startRoomId = currentRoomId;
    this.speed = 1;
    this.width = 30;
    this.height = 30;
    this.moveCounter = 0; // Compteur pour ralentir le déplacement
  }

  move() {
    this.moveCounter++;
    if (this.moveCounter < 60) return; // Déplace 1 fois toutes les 60 frames (~1 seconde)
    this.moveCounter = 0;

    const currentRoom = rooms.find(room => room.id === this.currentRoomId);
    if (currentRoom) {
      const possibleConnections = currentRoom.connectedTo.filter(connection => {
        const door = doors.find(d => d.id === connection.doorId);
        return !door || !door.isClosed;
      });

      if (possibleConnections.length > 0) {
        const randomConnection = possibleConnections[Math.floor(Math.random() * possibleConnections.length)];
        this.currentRoomId = randomConnection.roomId;
      } else {
        this.currentRoomId = this.startRoomId;
      }
    }
  }

  draw(ctx) {
    const currentRoom = rooms.find(room => room.id === this.currentRoomId);
    if (currentRoom) {
      ctx.fillStyle = 'red';
      ctx.fillRect(currentRoom.x + 50, currentRoom.y + 50, this.width, this.height);
      ctx.fillStyle = 'white';
      ctx.fillText(this.name, currentRoom.x + 50, currentRoom.y + 40);
    }
  }
}

// Crée un animatronic dans la salle d'entrée
const freddy = new Animatronic('Freddy', 0, 0, 0);


// Écoute l'appui sur la touche Espace
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    freddy.pushBack();
  }
});

function gameLoop() {
  // Efface le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Affiche/masque les boutons des portes
  document.getElementById('doorButtons').style.display = (activeView === 'office') ? 'block' : 'none';

  // Dessine selon la vue active
  if (activeView === 'office') {
    drawOfficeView(ctx);
  } else {
    const camera = cameras[activeCamera];
    if (camera.isAvailable) {
      drawWithCamera(ctx, camera);
    } else {
      drawStaticEffect(ctx, camera);
    }
  }

  // Met à jour l'animatronic
  freddy.move();

  // Relance la boucle
  requestAnimationFrame(gameLoop);
}

document.getElementById('cam1').addEventListener('click', () => {
  if (cameras[0].isAvailable) {
    activeView = 'camera';
    activeCamera = 0;
  }
});
document.getElementById('cam2').addEventListener('click', () => {
  if (cameras[1].isAvailable) {
    activeView = 'camera';
    activeCamera = 1;
  }
});
document.getElementById('cam3').addEventListener('click', () => {
  if (cameras[2].isAvailable) {
    activeView = 'camera';
    activeCamera = 2;
  }
});
document.getElementById('officeView').addEventListener('click', () => {
  activeView = 'office';
});


document.getElementById('door1').addEventListener('click', () => toggleDoor(0));
document.getElementById('door2').addEventListener('click', () => toggleDoor(1));

// Démarre la boucle de jeu
gameLoop();
