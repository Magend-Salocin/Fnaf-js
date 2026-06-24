//render.js


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
            stopAllSounds();
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
        document.getElementById('__game').classList.toggle('display-1');
        gamestart();
    }
}


/**
 * Gère la séquence de fin de nuit en cas de victoire (survie jusqu'à 6h du matin).
 * Cette fonction déclenche l'animation de victoire, le son de félicitations,
 * l'affichage du chèque de paie, puis la transition vers la nuit suivante ou l'écran de fin.
 *
 * @param {number} night - Le nombre de nuits écoulées dans le jeu.
 *                         Influence l'affichage de la transition ou le passage direct à la nuit suivante.
 *
 * @description
 * - 0 ms :
 *   Désactive les portes et affiche l'écran de victoire ("6 AM").
 *   Joue le son de victoire (alarm clock + ambiance matinale).
 *
 * - 3 000 ms (3 s) :
 *   Joue le son de félicitations (applaudissements ou rires).
 *
 * - 5 000 ms (5 s) :
 *   Affiche le chèque de paie avec le salaire de la nuit.
 *
 * - 8 000 ms (8 s) :
 *   Si `night < 6` :
 *     Transition vers l'écran de sélection de la nuit suivante.
 *   Si `night = 6` :
 *     Transition vers l'écran de fin de jeu (crédits ou "Game Complete").
 *
 * - 10 000 ms (10 s) :
 *   Réinitialise l'opacité des éléments et prépare le jeu pour la nuit suivante
 *   ou affiche les crédits si le jeu est terminé.
 */
function transitionEndNight(night) {
    nightEndGame(); // Bloque le jeu et désactive les portes

    drawOfficeViewByPicture("game_win");
    playSound("win_sound");

    // Joue le son de félicitations après 3 secondes
    setTimeout(function() {
        playSound("win_cheer");
    }, 3000);

    setTimeout(function() {
        const transition = document.querySelector('.transition');
        const transitionImg = document.querySelector('.transition img');
        const startLabel = document.getElementById('transition-start');
        const nightLabel = document.getElementById('transition-night');
        const nightCount = document.getElementById('night-count');

        if (transitionImg) {
            transitionImg.src = 'images/game/transition_screen.png';
        }

        transition.style.display = 'block';
        transition.classList.remove('display-0', 'animate-out');
        transition.classList.add('display-1', 'animate-in');

        startLabel.classList.remove('display-0');
        startLabel.classList.add('display-1');

        nightLabel.classList.remove('display-0');
        nightLabel.classList.add('display-1');


        if (night < MAX_NIGHT) {
            nightCount.innerHTML = night + 1;
            startLabel.innerHTML = '12:00 AM';
            nightLabel.innerHTML = `Night <span id="night-count">${night + 1}</span>`;
        } else {
            startLabel.innerHTML = '6:00 AM';
            nightLabel.innerHTML = 'Custom Night Complete';
        }
    }, 4500);

    setTimeout(function() {
        const transition = document.querySelector('.transition');
        transition.classList.remove('animate-in');
        transition.classList.add('animate-out');

        if (night < MAX_NIGHT) {
            startNight(night + 1);
            transition.style.display = 'none';
        } else {
            transition.style.display = 'none';
            drawOfficeViewByPicture('game_over_end');
        }
    }, 8000);
}



/**
 * Gère la séquence de jump scare pour un animatronic donné, en jouant le son et en affichant l'image correspondante.
 * Cette fonction est utilisée pour les jump scares spécifiques à Bonnie, Chica et Foxy, en centralisant la logique de déclenchement du jump scare.
 * @param {string} scareSound - Le nom du son à jouer pour le jump scare (ex: "scare_1", "pirate_song").
 * @param {string} jumpScarePicture - Le nom de l'image à afficher pour le jump scare (ex: "chika_jumpscare", "foxy_jumpscare").
 * 
 * Note : Cette fonction peut être appelée depuis les méthodes de jump scare spécifiques à chaque animatronic (ex: bonnieJumpScare, chicaJumpScare, foxyJumpScare) pour éviter la duplication de code et centraliser la gestion des jump scares.
 * 
 */
function animatronicJumpScare(scareSound, jumpScarePicture) {

    nightEndGame(); // Bloque le jeu et désactive les portes

    // Lance le son + l'image du jump scare
    setTimeout(function() {
        playSound(scareSound);
        drawOfficeViewByPicture(jumpScarePicture);
    }, 2000);

    // Affiche l'écran de transition game over
    setTimeout(function() {
        stopSound(scareSound);
        playSound("gameover_static2");
        drawOfficeViewByPicture("game_over_trans");
    }, 4000);

    // Écran final game over
    setTimeout(function() {
        drawOfficeViewByPicture("game_over_end");
    }, 5300);
}

// Fonctions personnalisées pour chaque animatronic
function bonnieJumpScare() {
    animatronicJumpScare("scare_2", "bonnie_jumpscare");
}

function foxyJumpScare() {
    animatronicJumpScare("pirate_song", "foxy_jumpscare");
}

function chicaJumpScare() {
    animatronicJumpScare("scare_1", "chika_jumpscare");
}


/**
 * Gère la séquence de fin de nuit lorsque le joueur n'a plus d'énergie (power = 0).
 * Cette fonction déclenche le jump scare de Freddy et la fin de partie.
 *
 * @description
 * - 0 ms : Le jeu est bloqué et les portes sont désactivées.
 * - 0 ms : L'écran du bureau est plongé dans le noir et le son de coupure de courant est joué.
 *
 * - 14 000 ms (14 s) :
 *   Le GIF de Freddy clignotant est affiché avec sa musique caractéristique.
 *
 * - 32 000 ms (32 s) :
 *   La musique de Freddy s'arrête, l'écran passe à un fond noir pour indiquer la défaite.
 *
 * - 34 000 ms (34 s) :
 *   Le jump scare de Freddy est déclenché (image + son effrayant).
 *
 * - 35 300 ms (35,3 s) :
 *   Transition vers l'écran de fin de partie (son de fin joué).
 *
 * - 37 000 ms (37 s) :
 *   Affichage de l'écran final de "Game Over".
 */
function transitionEndNightFreddy() {
    nightEndGame(); // Bloque le jeu et désactive les portes

    // Plonge le bureau dans le noir et joue le son de coupure de courant
    playSound("power_out");
    drawOfficeViewByPicture("safe_room_power_0");

    // Affiche Freddy clignotant avec sa musique après 14 secondes
    setTimeout(function() {
        playSound("power_jingle");
        drawOfficeViewByPicture("safe_room_powerdown_freddy");
    }, 14000);

    // Transition vers le fond noir (défaite) après 32 secondes
    setTimeout(function() {
        if(!gameWin){
            stopSound("power_jingle");
            drawOfficeViewByPicture("safe_room_powerdown_end");
        }
    }, 32000);

    // Déclenche le jump scare de Freddy après 34 secondes
    setTimeout(function() {
        if(!gameWin){
            playSound("scare2");
            drawOfficeViewByPicture("power_down_freddy_scare");
        }
    }, 34000);

    // Transition vers l'écran de fin après 35,3 secondes
    setTimeout(function() {
        if(!gameWin){
            stopSound("scare2");
            playSound("game_over_static");
            drawOfficeViewByPicture("game_over_trans");
        }
    }, 35300);

    // Affiche l'écran final de "Game Over" après 37 secondes
    setTimeout(function() {
        if(!gameWin){
            drawOfficeViewByPicture("game_over_end");
        }
    }, 37000);
}