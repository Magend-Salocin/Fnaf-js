
// Récupérer les éléments audio
const cameraToggleSound = document.querySelector('.camera-toggle');
const cameraPutDownSound = document.querySelector('.camera-put-down');
const ambienceSound = document.querySelector('.ambience2');
const buzzFanSound = document.querySelector('.Buzz-fan');

// Fonction pour jouer un son en boucle
function playSoundLoop(audioElement) {
    audioElement.loop = true;
    audioElement.currentTime = 0;
    audioElement.play().catch(error => {
        console.error("Erreur lors de la lecture du son :", error);
    });
}

// Fonction pour arrêter un son
function stopSound(audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
}

// Fonction pour vérifier que tous les sons sont prêts
function waitForAllSoundsToLoad(audios) {
    const promises = audios.map(audio => {
        return new Promise((resolve) => {
            if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
                resolve();
            } else {
                audio.addEventListener('canplaythrough', resolve, { once: true });
            }
        });
    });

    return Promise.all(promises);
}

// Fonction pour démarrer les sons d'ambiance
function startAmbientSounds() {
    if (!gameStarted) {
        playSoundLoop(ambienceSound);
        playSoundLoop(buzzFanSound);
        //gameStarted = true;
        console.log("Sons d'ambiance démarrés.");
    }
}

/*
1. Audios liés aux caméras

camera-toggle : Son joué quand le joueur active/désactive la vue des caméras (bruit de clic ou de changement de canal).
camera-put-down : Son joué quand le joueur "pose" la tablette des caméras (bruit de tablette qui se range).
camera-cycle : Son de "blip" quand le joueur change de caméra dans le menu des caméras.

2. Ambiance et bruitages de fond

ambience2 : Ambiance sonore générale du bureau (bruit de fond constant, souvent un bourdonnement ou un ventilateur).
Buzz-fan : Bruit de ventilateur ou de bourdonnement électrique (typique de l'ambiance du bureau dans FNaF 1).
game-start : Bruit de fond au début du jeu (souvent le même que Buzz-fan).

3. Appels téléphoniques (Phone Guy)

call1 à call5 : Enregistrements des appels de Phone Guy, qui expliquent les règles et l'histoire du jeu au fil des nuits.

4. Sons d'effroi et de game over

window-scare : Son joué quand un animatronique apparaît à une fenêtre (ex. Freddy ou Bonnie).
scare : Cri strident joué quand un animatronique attaque le joueur (ex. le "jumpscare" de Freddy).
powerout-sound : Son joué quand l'électricité est coupée (bruit de panne).
powerout-jingle : Musique de la boîte à musique (jouée pendant la panne d'électricité, souvent associée à Golden Freddy).
gameover-static : Bruit de statique joué à l'écran de game over.

5. Sons de victoire

win-sound : Son de cloche ou de carillon joué quand le joueur survit jusqu'à 6h du matin.
win-cheer : Acclamations ou rires d'enfants (joué après avoir survécu à une nuit).

6. Bruitages de la cuisine et des portes

kitchen-b, kitchen-c, kitchen-f : Bruitages de la cuisine (ex. bruits de pas ou de grattement, souvent liés à Chica).
light-on : Son joué quand le joueur allume la lumière dans un couloir.
door-sound : Bruit de porte qui s'ouvre/ferme (ex. les portes du bureau).
door-light-disabled : Son d'erreur joué quand le joueur essaie d'utiliser une porte ou une lumière sans assez d'électricité.

7. Sons de déplacement des animatroniques

move-sound : Bruits de pas lourds (ex. Freddy ou Bonnie qui se déplacent dans les couloirs).

Pourquoi ces sons sont emblématiques de FNaF 1 ?

Atmosphère angoissante : Les bruits de fond (ventilateur, ambiance) créent une tension constante.
Feedback sonore : Chaque action du joueur (caméras, portes, lumières) a un son distinct, ce qui renforce l'immersion.
Jumpscares : Les sons aigus (scare, window-scare) sont conçus pour surprendre le joueur.

Conseil pour votre projet
Si vous recréez FNaF 1 ou un jeu inspiré, assurez-vous que :

Les sons sont déclenchés aux bons moments (ex. scare uniquement lors d'un jumpscare).
Les boucles (loop) comme ambience2 ou Buzz-fan ne sont pas trop fortes pour ne pas fatiguer l'auditeur.
Les volumes sont équilibrés (ex. volume="0.1" pour les bruits de fond).

*/