//main.js

// Initialisation du canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Chargement des scripts dans l'ordre
document.addEventListener('DOMContentLoaded', () => {
  preloadImages(); // Précharge les images des salles
  initButtons();
  setupEventListeners();
  gameLoopInterval = setInterval(gameLoop, 1000/60);
});