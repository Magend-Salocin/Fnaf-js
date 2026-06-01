//main.js

// Initialisation du canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameStarted = false;

// Écouteurs pour vérifier que les sons sont prêts
[cameraToggleSound, cameraPutDownSound, ambienceSound, buzzFanSound].forEach(audio => {
    audio.addEventListener('error', (e) => {
        console.error(`Erreur lors du chargement du son ${audio.className} :`, e);
    });
});

// Chargement des scripts dans l'ordre
document.addEventListener('DOMContentLoaded',async () => {
    transitionScreen(1);
    preloadImages(); // Précharge les images des salles  
    try {
        await waitForAllSoundsToLoad([cameraToggleSound, cameraPutDownSound, ambienceSound, buzzFanSound]);
                
    } catch (error) {
        console.error("Erreur lors du chargement des sons :", error);
    }

});

function gamestart(){
    // Appelle la fonction au chargement et au redimensionnement de la fenêtre
    window.addEventListener('load', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);

    initButtons();
    setupEventListeners();

    // Démarre la boucle de jeu (60 FPS)
    gameLoopInterval = setInterval(gameLoop, 1000/60);

    resizeCanvas();

    // Démarre le compteur d'heures (1 tick = 1/60s)
    hourInterval = setInterval(() => {
        // La gestion des heures est déjà dans gameLoop, donc cet intervalle n'est pas nécessaire.
        // On peut le supprimer ou l'utiliser pour d'autres mises à jour moins fréquentes.
    }, 1000/60);
}

/**
 * Gère la transition d'écran en fonction du nombre de nuits passées dans le jeu.
 *
 * @param {number} night - Le nombre de nuits écoulées dans le jeu.
 *                         Si `night` est inférieur à 2, une animation de transition est déclenchée.
 *                         Sinon, l'écran de transition est masqué directement et le jeu commence.
 *
 * @description
 * - Si `night < 2` :
 *   1. Après 5 secondes, l'animation de sortie du préchargeur est déclenchée,
 *      et l'animation d'entrée de la transition commence.
 *   2. Après 20 secondes, l'animation de sortie de la transition est retirée,
 *      l'image de transition est mise à jour avec un GIF de fondu,
 *      le titre (h2) est basculé en classe `display-1` (si présent),
 *      et le compteur de nuits est mis à jour avec la valeur de `night`.
 *   3. Après 24 secondes, le préchargeur est masqué et l'animation de sortie de la transition commence.
 *   4. Après 24,9 secondes, la transition est complètement masquée et la fonction `gamestart()` est appelée.
 *
 * - Si `night >= 2` :
 *   Le préchargeur et la transition sont masqués immédiatement,
 *   l'opacité des conteneurs (sauf `#start-screen`) est rétablie à 1,
 *   et la fonction `gamestart()` est appelée sans animation.
 */
function transitionScreen(night) {
    if (night < 2) {
        // Après 5 secondes : animation de sortie du préchargeur et entrée de la transition
        setTimeout(function() {
            document.querySelector('.preloader').classList.add('animate-out');
            document.querySelector('.transition').classList.add('animate-in');
        }, 1000);

        // Après 20 secondes : mise à jour de l'image, du titre et du compteur de nuits
        setTimeout(function() {
            document.querySelector('.transition').classList.remove('animate-out');
            const transitionImg = document.querySelector('.transition img');
            if (transitionImg) {
                transitionImg.src = 'images/game/transition-fade.gif';
            }
            
            document.getElementById('transition-start').classList.toggle('display-1');
            document.getElementById('transition-night').classList.toggle('display-1');
            document.getElementById('night-count').innerHTML = night;
     
       // }, 20000);
        }, 4000);

        // Après 24 secondes : masquage du préchargeur et animation de sortie de la transition
        setTimeout(function() {
            document.querySelector('.preloader').style.display = 'none';
            document.querySelector('.transition').classList.add('animate-out');
        //}, 24000);
        }, 7000);

        // Après 24,9 secondes : masquage complet de la transition et lancement du jeu
        setTimeout(function() {
            document.querySelector('.transition').style.display = 'none';
            document.getElementById('__game').classList.toggle('display-1');
            gamestart();
        //}, 24900);
        }, 9000);

    } else {
        // Si night >= 2 : masquage immédiat et lancement du jeu
        document.querySelector('.preloader').style.display = 'none';
        document.querySelector('.transition').style.display = 'none';
        const containers = document.querySelectorAll('.container:not(#start-screen)');
        containers.forEach(container => {
            container.style.opacity = '1';
        });
        document.querySelector('.transition').style.display = 'none';
        gamestart();
    }
}
