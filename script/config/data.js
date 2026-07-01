//data.js

// Salles (inspirées de FNAF 1)
var rooms = {
    '1a': { f: 1, c: 1, b: 1, occupy: 1 }, // Freddy, Chica, Bonnie sont présents
    '1b': { f: 0, c: 0, b: 0, occupy: 0 },
    '1c': { f: 0, c: 0, b: 0, occupy: 0 },
    '2a': { f: 0, c: 0, b: 0, occupy: 0 },
    '2b': { f: 0, c: 0, b: 0, occupy: 0 },
    '4a': { f: 0, c: 0, b: 0, occupy: 0 },
    '4b': { f: 0, c: 0, b: 0, occupy: 0 },
    '3':  { f: 0, c: 0, b: 0, occupy: 0 },
    '5':  { f: 0, c: 0, b: 0, occupy: 0 },
    '6':  { f: 0, c: 0, b: 0, occupy: 0 },
    '7':  { f: 0, c: 0, b: 0, occupy: 0 },
    'safe': { f: 0, c: 0, b: 0, occupy: 0 }
};


const roomsArray = [
    // The Office (safe)
    { id: 0, name: "The Office", cameraId: 'safe', x: 0, y: 0, width: 1600, height: 720, isOffice: true, connectedTo: [], cameraOffset: 0, maxCameraOffset: 0 },

    // Show Stage (1a)
    { id: 1, name: "Show Stage", cameraId: '1a', x: 0, y: 0, width: 1200, height: 720, connectedTo: [
        { roomId: 3, doorId: null }
    ], cameraOffset: 0, maxCameraOffset: 800 }, // Connexion vers Dining Area (1b)

    // Dining Area (1b)
    // 1600 720
    { id: 3, name: "Dining Area", cameraId: '1b', x: 0, y: 0, width: 1200, height: 720, connectedTo: [
        { roomId: 1, doorId: null }, // Show Stage (1a)
        { roomId: 5, doorId: null }, // Restrooms (3)
        { roomId: 7, doorId: null }  // Pirate Cove (1c)
    ], cameraOffset: 0, maxCameraOffset: 800 },

    // Pirate Cove (1c)
    { id: 7, name: "Pirate Cove", cameraId: '1c', x: 0, y: 0, width: 1200, height: 720, connectedTo: [
        { roomId: 3, doorId: null }
    ] , cameraOffset: 0, maxCameraOffset: 800 }, // Connexion vers Dining Area (1b)

    // West Hall A (2a)
    { id: 2, name: "West Hall A", cameraId: '2a', x: 0, y: 0, width: 1200, height: 720, connectedTo: [
        { roomId: 1, doorId: 0 }, // Show Stage (1a)
        { roomId: 4, doorId: null } // West Hall B (2b)
    ], cameraOffset: 0, maxCameraOffset: 800  },

    // West Hall B (2b)
    { id: 4, name: "West Hall B", cameraId: '2b', x: 0, y: 0, width: 1200, height: 720, connectedTo: [
        { roomId: 3, doorId: null }, // Dining Area (1b)
        { roomId: 0, doorId: 1 }    // The Office (safe)
    ], cameraOffset: 0, maxCameraOffset: 800 },

    // Supply Closet (3)
    { id: 6, name: "Supply Closet", cameraId: '3', x: 0, y: 0, width: 1200, height: 720, connectedTo: [
        { roomId: 5, doorId: null }, // Restrooms (3)
        { roomId: 8, doorId: null }  // Backstage (5)
    ], cameraOffset: 0, maxCameraOffset: 800  },

    // East Hall A (4a)
    { id: 9, name: "East Hall A", cameraId: '4a', x: 0, y: 0, width: 1200, height: 720, connectedTo: [
        { roomId: 3, doorId: null }, // Dining Area (1b)
        { roomId: 10, doorId: null } // East Hall B (4b)
    ], cameraOffset: 0, maxCameraOffset: 800  },

    // East Hall B (4b)
    { id: 10, name: "East Hall B", cameraId: '4b', x: 0, y: 0, width: 1200, height: 720, connectedTo: [
        { roomId: 9, doorId: null }, // East Hall A (4a)
        { roomId: 0, doorId: null }  // The Office (safe)
    ], cameraOffset: 0, maxCameraOffset: 800  },

    // Backstage (5)
    { id: 8, name: "Backstage", cameraId: '5', x: 0, y: 0, width: 1200, height: 720, connectedTo: [
        { roomId: 6, doorId: null }, // Supply Closet (3)
        { roomId: 4, doorId: null }  // West Hall B (2b)
    ], cameraOffset: 0, maxCameraOffset: 800  },

    // Kitchen (6)
    { id: 11, name: "Kitchen", cameraId: '6', x: 0, y: 0, width: 1600, height: 720, connectedTo: [
        { roomId: 9, doorId: null }, // East Hall A (4a)
        { roomId: 0, doorId: null }  // The Office (safe)
    ], cameraOffset: 0, maxCameraOffset: -1  },

    // Restroom (7)
    { id: 12, name: "Restroom", cameraId: '7', x: 0, y: 0, width: 1200, height: 720, connectedTo: [
        { roomId: 3, doorId: null } // Dining Area (1b)
    ], cameraOffset: 0, maxCameraOffset: 800  }
];

// Caméras (inspirées de FNAF 1)
const cameras = [
    { id: "safe", name: "The Office",   roomId: 0,  maxUsageTime: 99, remainingTime: 0, isAvailable: true, image: 'images/rooms/the_office/default.png' },
    { id: "1a",   name: "Cam 1A",       roomId: 1,  maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/1a_show_stage/1a_b0_c0_f0.jpg' },
    { id: "1b",   name: "Cam 1B",       roomId: 3,  maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/1b_dining_area/1b_b0_c0_f0.jpg' },
    { id: "1c",   name: "Cam 1C", 	    roomId: 7,  maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/1c_pirate_cove/1c_b0_c0_f0_00.jpg' },
    { id: "2a",   name: "Cam 2A",       roomId: 2,  maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/2a_west_hall/2a_b0_c0_f0.jpg' },
    { id: "2b",   name: "Cam 2B",       roomId: 4,  maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/2b_west_hall_corner/2b_b0_c0_f0.jpg' },
    { id: "3",    name: "Cam 3",        roomId: 6,  maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/3_supply_closet/3_b0_c0_f0.jpg' },
    { id: "4a",   name: "Cam 4A",       roomId: 9,  maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/4a_east_hall/4a_b0_c0_f0.jpg' },
    { id: "4b",   name: "Cam 4B",       roomId: 10, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/4b_east_hall_corner/4b_b0_c0_f0.jpg' },
    { id: "5",    name: "Cam 5",        roomId: 8,  maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/5_backstage/5_b0_c0_f0.jpg' },
    { id: "6",    name: "Cam 6",        roomId: 11, maxUsageTime: 99, remainingTime: 0, isAvailable: true, image: 'images/rooms/6_kitchen/6_b0_c0_f0.png' },
    { id: "7",    name: "Cam 7",        roomId: 12, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/7_restroom/7_b0_c0_f0.jpg' },
];



/*
Exemple pour Bonnie ('1a', '1b', '3', '6', '5', '2b', 'safe')

	'1a' (Show Stage) → '1b' (Dining Area)
	'1b' (Dining Area) → '3' (Restrooms)
	'3' (Restrooms) → '6' (Supply Closet)
	'6' (Supply Closet) → '5' (Backstage)
	'5' (Backstage) → '2b' (West Hall B)
	'2b' (West Hall B) → 'safe' (The Office)


Exemple pour Chica ('1a', '1b', '7', '6', '4a', '4b', 'safe')

	'1a' (Show Stage) → '1b' (Dining Area)
	'1b' (Dining Area) → '7' (Pirate Cove)
	'7' (Pirate Cove) → '6' (Supply Closet)
	'6' (Supply Closet) → '4a' (East Hall A)
	'4a' (East Hall A) → '4b' (East Hall B)
	'4b' (East Hall B) → 'safe' (The Office)


*/

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