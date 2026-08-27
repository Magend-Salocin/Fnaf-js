//data.js

// Salles/cameras construites automatiquement depuis ROOMS_CONFIG.js
var rooms = buildRoomsStateFromConfig(ROOMS);
const roomsArray = buildRoomsArrayFromConfig(ROOMS);
const cameras = buildCamerasFromConfig(ROOMS);

// ---------------------------------------------
// 1. TABLEAU CENTRALISÉ DES SONS AVEC IDENTIFIANTS
// ---------------------------------------------
/**
 * Tableau associant chaque son à un identifiant unique, avec un égaliseur individuel.
 * @type {Array<{id: string, element: HTMLAudioElement, category: string, description: string, mixVolume: number}>}
 */
const gameSounds = [
    // Ambiance et bruitages de fond
    { id: "menu_start", element: document.querySelector('.menu-start'), category: "ambiance", description: "Musique du menu principal", mixVolume: 1.0 },
    { id: "ambience1", element: document.querySelector('.ambience1'), category: "ambiance", description: "Ambiance alternative", mixVolume: 0.8 },
    { id: "ambience2", element: document.querySelector('.ambience2'), category: "ambiance", description: "Ambiance générale", mixVolume: 0.9 },
    { id: "buzz_fan", element: document.querySelector('.Buzz-fan'), category: "ambiance", description: "Bruit du ventilateur", mixVolume: 0.5 }, // Exemple : ventilateur moins fort
    { id: "circus", element: document.querySelector('.circus'), category: "ambiance", description: "Musique de cirque", mixVolume: 0.7 },
    { id: "pirate_song", element: document.querySelector('.pirate-song'), category: "ambiance", description: "Chanson pirate", mixVolume: 0.6 },
    { id: "cold_presc", element: document.querySelector('.cold-presc'), category: "ambiance", description: "Ambiance froide", mixVolume: 0.8 },

    { id: "menu_start2", element: document.querySelector('.menu-start2'), category: "ambiance", description: "Musique du menu principal 2", mixVolume: 0.5 },

    // Audios liés aux caméras
    { id: "camera_toggle", element: document.querySelector('.camera-toggle'), category: "camera", description: "Son de bascule des caméras", mixVolume: 1.0 },
    { id: "camera_put_down", element: document.querySelector('.camera-put-down'), category: "camera", description: "Son de dépôt des caméras", mixVolume: 0.9 },
    { id: "camera_cycle", element: document.querySelector('.camera-cycle'), category: "camera", description: "Son de cycle des caméras", mixVolume: 0.7 },
    { id: "camera_static", element: document.querySelector('.camera-static'), category: "camera", description: "Son statique des caméras", mixVolume: 0.5 },

    // Sons des portes
    { id: "light_on", element: document.querySelector('.light-on'), category: "door", description: "Allumage de la lumière", mixVolume: 1.0 },
    { id: "door_sound", element: document.querySelector('.door-sound'), category: "door", description: "Ouverture/fermeture de porte", mixVolume: 1.2 }, // Exemple : son de porte plus fort
    { id: "door_light_disabled", element: document.querySelector('.door-light-disabled'), category: "door", description: "Erreur de porte", mixVolume: 1.0 },
    { id: "door_pounding", element: document.querySelector('.door-pounding'), category: "door", description: "Coup sur la porte", mixVolume: 1.5 }, // Exemple : coup sur la porte très audible

    // Sons de victoire
    { id: "win_sound", element: document.querySelector('.win-sound'), category: "victory", description: "Son de victoire", mixVolume: 1.0 },
    { id: "win_cheer", element: document.querySelector('.win-cheer'), category: "victory", description: "Applaudissements", mixVolume: 0.8 },

    // Sons de game over et jump scares
    { id: "power_out", element: document.querySelector('.powerout-sound'), category: "gameover", description: "Coupure de courant", mixVolume: 1.0 },
    { id: "power_jingle", element: document.querySelector('.powerout-jingle'), category: "gameover", description: "Jingle de Freddy", mixVolume: 1.2 },
    { id: "scare_1", element: document.querySelector('.scare-1'), category: "gameover", description: "Jump scare 1", mixVolume: 1.5 }, // Exemple : jumpscare très fort
    { id: "scare_2", element: document.querySelector('.scare-2'), category: "gameover", description: "Jump scare 2", mixVolume: 1.5 },
    { id: "window_scare", element: document.querySelector('.window-scare'), category: "gameover", description: "Jump scare de la fenêtre", mixVolume: 1.4 },
    { id: "gameover_static", element: document.querySelector('.gameover-static'), category: "gameover", description: "Son statique de game over", mixVolume: 0.7 },
    { id: "gameover_static2", element: document.querySelector('.gameover-static2'), category: "gameover", description: "Son statique alternatif", mixVolume: 0.7 },

    // Bruitages de la cuisine
    { id: "kitchen_b", element: document.querySelector('.kitchen-b'), category: "kitchen", description: "Son de cuisine 1", mixVolume: 0.9 },
    { id: "kitchen_c", element: document.querySelector('.kitchen-c'), category: "kitchen", description: "Son de cuisine 2", mixVolume: 0.9 },
    { id: "kitchen_f", element: document.querySelector('.kitchen-f'), category: "kitchen", description: "Son de cuisine 3", mixVolume: 1.0 },
    { id: "kitchen_drawer", element: document.querySelector('.kitchen-drawer'), category: "kitchen", description: "Son de tiroir", mixVolume: 1.1 },

    // Sons de pas et mouvements
    { id: "move_sound", element: document.querySelector('.move-sound'), category: "movement", description: "Pas normaux", mixVolume: 1.0 },
    { id: "run_sound", element: document.querySelector('.run-sound'), category: "movement", description: "Course normale", mixVolume: 1.2 },
    { id: "run_fast", element: document.querySelector('.run-fast'), category: "movement", description: "Course rapide", mixVolume: 1.3 },

    // Cassettes (lecteur audio du bureau)
    { id: "tape_frt_01", element: document.querySelector('.tape-frt-01'), category: "call", description: "Cassette FRT-01 — Protocole de fermeture Pirate Cove", mixVolume: 1.0 },

    // Appels téléphoniques
    { id: "call_1", element: document.querySelector('.call1'), category: "call", description: "Appel 1", mixVolume: 1.0 },
    { id: "call_2", element: document.querySelector('.call2'), category: "call", description: "Appel 2", mixVolume: 1.0 },
    { id: "call_3", element: document.querySelector('.call3'), category: "call", description: "Appel 3", mixVolume: 1.0 },
    { id: "call_4", element: document.querySelector('.call4'), category: "call", description: "Appel 4", mixVolume: 1.0 },
    { id: "call_5", element: document.querySelector('.call5'), category: "call", description: "Appel 5", mixVolume: 1.0 },

    // Sons de voix et appels
    { id: "robot_voice", element: document.querySelector('.robot-voice'), category: "voice", description: "Voix robotique", mixVolume: 0.9 },
    { id: "garble_1", element: document.querySelector('.garble1'), category: "voice", description: "Voix brouillée 1", mixVolume: 0.8 },
    { id: "garble_2", element: document.querySelector('.garble2'), category: "voice", description: "Voix brouillée 2", mixVolume: 0.8 },
    { id: "garble_2", element: document.querySelector('.garble3'), category: "voice", description: "Voix brouillée 3", mixVolume: 0.8 },
    { id: "whispering", element: document.querySelector('.whispering'), category: "voice", description: "Chuchotements", mixVolume: 0.6 }, // Exemple : chuchotements discrets

    // Sons de respiration
    { id: "breath_1", element: document.querySelector('.breath1'), category: "breath", description: "Respiration 1", mixVolume: 0.5 },
    { id: "breath_2", element: document.querySelector('.breath2'), category: "breath", description: "Respiration 2", mixVolume: 0.5 },
    { id: "breath_3", element: document.querySelector('.breath3'), category: "breath", description: "Respiration 3", mixVolume: 0.5 },
    { id: "breath_4", element: document.querySelector('.breath4'), category: "breath", description: "Respiration 4", mixVolume: 0.5 },

    // Sons divers
    { id: "laugh_girl1", element: document.querySelector('.laugh-girl1'), category: "misc", description: "Rire de fille 1", mixVolume: 0.9 },
    { id: "laugh_girl1d", element: document.querySelector('.laugh-girl1d'), category: "misc", description: "Rire de fille 1 (version différente)", mixVolume: 0.9 },
    { id: "laugh_girl2d", element: document.querySelector('.laugh-girl2d'), category: "misc", description: "Rire de fille 2 (version différente)", mixVolume: 0.9 },
    { id: "laugh_girl8d", element: document.querySelector('.laugh-girl8d'), category: "misc", description: "Rire de fille 8 (version différente)", mixVolume: 0.9 },
    { id: "tape_eject", element: document.querySelector('.tape-eject'), category: "misc", description: "Éjection de cassette", mixVolume: 1.0 },
    { id: "party_favor", element: document.querySelector('.party-favor'), category: "misc", description: "Son de fête", mixVolume: 1.0 },
    { id: "knock", element: document.querySelector('.knock'), category: "misc", description: "Coup frappé", mixVolume: 1.3 },

    // Terminal sounds
    { id: "terminal-keyboard-typing", element: document.querySelector('.terminal-keyboard-typing'), category: "misc", description: "Sons de frappe au clavier du terminal", mixVolume: 0.8 },
    { id: "terminal-start", element: document.querySelector('.terminal-start'), category: "misc", description: "Son de démarrage du terminal", mixVolume: 1.0 },

    //Hidden
    { id: "chair", element: document.querySelector('.chair'), category: "misc", description: "Chaise", mixVolume: 0.8 },
];