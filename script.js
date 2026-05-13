// Récupère le canvas et son contexte
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const cameras = [
  { name: "Caméra 1", view: { x: 0, y: 0, width: 800, height: 400 }, maxUsageTime: 5, remainingTime: 0, isAvailable: true },
  { name: "Caméra 2", view: { x: 200, y: 0, width: 400, height: 200 }, maxUsageTime: 3, remainingTime: 0, isAvailable: true },
  { name: "Caméra 3", view: { x: 0, y: 100, width: 600, height: 300 }, maxUsageTime: 4, remainingTime: 0, isAvailable: true },
];

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

function drawWithCamera(ctx, camera) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(camera.view.x, camera.view.y, camera.view.width, camera.view.height);
  ctx.clip();

  // Dessine le fond
  ctx.fillStyle = 'darkgray';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dessine l'animatronic
  freddy.draw(ctx);

  ctx.restore();

  // Affiche le nom de la caméra active
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Caméra active : ${camera.name}`, 10, 30);
}

// Classe pour l'animatronic
class Animatronic {
  constructor(name, x, y) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.width = 50;
    this.height = 50;
  }

  // Méthode pour déplacer l'animatronic
  move() {
    this.x += this.speed;
  }

  // Méthode pour dessiner l'animatronic
  draw(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = 'white';
    ctx.fillText(this.name, this.x + 5, this.y + 20);
  }

  // Méthode pour repousser l'animatronic
  pushBack() {
    this.x = 0;
  }
}

// Crée un animatronic
const freddy = new Animatronic('Freddy', 0, 150);

// Écoute l'appui sur la touche Espace
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    freddy.pushBack();
  }
});
function gameLoop() {
  // Efface le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gestion du temps d'utilisation des caméras
  if (isUsingCamera) {
    cameraUsageTimer -= 1/60; // Décrémente le temps (60 FPS)
    if (cameraUsageTimer <= 0) {
      isUsingCamera = false;
      cameras[activeCamera].isAvailable = false;
      cameras[activeCamera].remainingTime = 5; // Temps de recharge (en secondes)
    }
  }

  // Recharge des caméras
  cameras.forEach(camera => {
    if (!camera.isAvailable && camera.remainingTime > 0) {
      camera.remainingTime -= 1/60;
      if (camera.remainingTime <= 0) {
        camera.isAvailable = true;
      }
    }
  });

  // Dessine selon la caméra active
  const currentCamera = cameras[activeCamera];
  if (currentCamera.isAvailable || isUsingCamera) {
    drawWithCamera(ctx, currentCamera);
  } else {
    // Si la caméra est en recharge, affiche l'effet de statique
    drawStaticEffect(ctx, currentCamera);
  }

  // Affiche le temps restant pour la caméra active
  if (isUsingCamera) {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Temps restant : ${Math.ceil(cameraUsageTimer)}s`, 10, 60);
  }

  // Affiche l'état des caméras (disponible ou en recharge)
  cameras.forEach((camera, index) => {
    ctx.fillStyle = camera.isAvailable ? 'green' : 'red';
    ctx.fillText(`${camera.name} : ${camera.isAvailable ? 'Disponible' : `Recharge (${Math.ceil(camera.remainingTime)}s)`}`, 10, 90 + index * 30);
  });

  // Met à jour l'animatronic
  freddy.move();

  // Vérifie si l'animatronic a atteint la fin
  if (freddy.x + freddy.width > canvas.width) {
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.fillText('GAME OVER', canvas.width / 2 - 120, canvas.height / 2);
    return;
  }

  // Relance la boucle
  requestAnimationFrame(gameLoop);
}
document.getElementById('cam1').addEventListener('click', () => activateCamera(0));
document.getElementById('cam2').addEventListener('click', () => activateCamera(1));
document.getElementById('cam3').addEventListener('click', () => activateCamera(2));

// Démarre la boucle de jeu
gameLoop();
