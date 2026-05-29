//data.js
// Salles (inspirées de FNAF 1)
var rooms = {
    '1a': { f: 1, c: 1, b: 1, occupy: 1 }, // Freddy, Chica, Bonnie sont présents
    '1b': { f: 0, c: 0, b: 0, occupy: 0 },
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
/*
const roomsArray = [
    { id: 0,  name: "The Office", cameraId: 'safe', x: 0, y: 0, width: 800, height: 600, isOffice: true, connectedTo: [] },
    { id: 1,  name: "Show Stage", cameraId: '1a', x: 0, y: 0, width: 800, height: 600, connectedTo: [{ roomId: 3, doorId: null }] }, // Connexion vers Dining Area (1b)
    { id: 3,  name: "Dining Area", cameraId: '1b', x: 0, y: 0, width: 800, height: 600, connectedTo: [{ roomId: 1, doorId: null }, { roomId: 5, doorId: null }, { roomId: 7, doorId: null }] }, // Connexion vers Show Stage (1a), Restrooms (3), Pirate Cove (7)
    { id: 7,  name: "Pirate Cove", cameraId: '1c', x: 0, y: 0, width: 800, height: 600, connectedTo: [{ roomId: 3, doorId: null }] }, // Connexion vers Dining Area (1b)
    { id: 2,  name: "West Hall A", cameraId: '2a', x: 0, y: 0, width: 800, height: 600, connectedTo: [{ roomId: 1, doorId: 0 }, { roomId: 4, doorId: null }] }, // Connexion vers Show Stage (1a) et West Hall B (2b)
    { id: 4,  name: "West Hall B", cameraId: '2b', x: 0, y: 0, width: 800, height: 600, connectedTo: [{ roomId: 3, doorId: null }, { roomId: 0, doorId: 1 }] }, // Connexion vers Dining Area (1b) et The Office (safe)
    { id: 5,  name: "Restrooms", cameraId: '3', x: 0, y: 0, width: 800, height: 600, connectedTo: [{ roomId: 3, doorId: null }, { roomId: 6, doorId: null }] }, // Connexion vers Dining Area (1b) et Supply Closet (6)
    { id: 6,  name: "Supply Closet", cameraId: '3', x: 0, y: 0, width: 800, height: 600, connectedTo: [{ roomId: 5, doorId: null }, { roomId: 8, doorId: null }] }, // Connexion vers Restrooms (3) et Backstage (5)
    { id: 9,  name: "East Hall A", cameraId: '4a', x: 0, y: 0, width: 800, height: 600, connectedTo: [{ roomId: 3, doorId: null }, { roomId: 10, doorId: null }] }, // Connexion vers Dining Area (1b) et East Hall B (4b)
    { id: 11, name: "East Hall B", cameraId: '4b', x: 0, y: 0, width: 800, height: 600, connectedTo: [{ roomId: 9, doorId: null }, { roomId: 0, doorId: null }] }, // Connexion vers East Hall A (4a) et The Office (safe)
    { id: 10, name: "Kitchen", cameraId: '6', x: 0, y: 0, width: 800, height: 600, connectedTo: [{ roomId: 9, doorId: null }, { roomId: 0, doorId: null }] }, // Connexion vers East Hall A (4a) et The Office (safe)
    { id: 8,  name: "Backstage", cameraId: '5', x: 0, y: 0, width: 800, height: 600, connectedTo: [{ roomId: 6, doorId: null }, { roomId: 4, doorId: null }] }, // Connexion vers Supply Closet (6) et West Hall B (2b)
    { id: 8,  name: "Restroom", cameraId: '7', x: 0, y: 0, width: 800, height: 600, connectedTo: [{ roomId: 6, doorId: null }, { roomId: 4, doorId: null }] }, // Connexion vers Supply Closet (6) et West Hall B (2b)
];*/

const roomsArray = [
    // The Office (safe)
    { id: 0, name: "The Office", cameraId: 'safe', x: 0, y: 0, width: 800, height: 600, isOffice: true, connectedTo: [] },

    // Show Stage (1a)
    { id: 1, name: "Show Stage", cameraId: '1a', x: 0, y: 0, width: 800, height: 600, connectedTo: [{ roomId: 3, doorId: null }] }, // Connexion vers Dining Area (1b)

    // Dining Area (1b)
    { id: 3, name: "Dining Area", cameraId: '1b', x: 0, y: 0, width: 800, height: 600, connectedTo: [
        { roomId: 1, doorId: null }, // Show Stage (1a)
        { roomId: 5, doorId: null }, // Restrooms (3)
        { roomId: 7, doorId: null }  // Pirate Cove (1c)
    ]},

    // Pirate Cove (1c)
    { id: 7, name: "Pirate Cove", cameraId: '1c', x: 0, y: 0, width: 800, height: 600, connectedTo: [{ roomId: 3, doorId: null }] }, // Connexion vers Dining Area (1b)

    // West Hall A (2a)
    { id: 2, name: "West Hall A", cameraId: '2a', x: 0, y: 0, width: 800, height: 600, connectedTo: [
        { roomId: 1, doorId: 0 }, // Show Stage (1a)
        { roomId: 4, doorId: null } // West Hall B (2b)
    ]},

    // West Hall B (2b)
    { id: 4, name: "West Hall B", cameraId: '2b', x: 0, y: 0, width: 800, height: 600, connectedTo: [
        { roomId: 3, doorId: null }, // Dining Area (1b)
        { roomId: 0, doorId: 1 }    // The Office (safe)
    ]},

    // Restrooms (3)
    { id: 5, name: "Restrooms", cameraId: '3', x: 0, y: 0, width: 800, height: 600, connectedTo: [
        { roomId: 3, doorId: null }, // Dining Area (1b)
        { roomId: 6, doorId: null }  // Supply Closet (6)
    ]},

    // Supply Closet (6)
    { id: 6, name: "Supply Closet", cameraId: '6', x: 0, y: 0, width: 800, height: 600, connectedTo: [
        { roomId: 5, doorId: null }, // Restrooms (3)
        { roomId: 8, doorId: null }  // Backstage (5)
    ]},

    // East Hall A (4a)
    { id: 9, name: "East Hall A", cameraId: '4a', x: 0, y: 0, width: 800, height: 600, connectedTo: [
        { roomId: 3, doorId: null }, // Dining Area (1b)
        { roomId: 10, doorId: null } // East Hall B (4b)
    ]},

    // East Hall B (4b)
    { id: 10, name: "East Hall B", cameraId: '4b', x: 0, y: 0, width: 800, height: 600, connectedTo: [
        { roomId: 9, doorId: null }, // East Hall A (4a)
        { roomId: 0, doorId: null }  // The Office (safe)
    ]},

    // Backstage (5)
    { id: 8, name: "Backstage", cameraId: '5', x: 0, y: 0, width: 800, height: 600, connectedTo: [
        { roomId: 6, doorId: null }, // Supply Closet (6)
        { roomId: 4, doorId: null }  // West Hall B (2b)
    ]},

    // Kitchen (6)
    { id: 11, name: "Kitchen", cameraId: '6', x: 0, y: 0, width: 800, height: 600, connectedTo: [
        { roomId: 9, doorId: null }, // East Hall A (4a)
        { roomId: 0, doorId: null }  // The Office (safe)
    ]},

    // Restroom (7)
    { id: 12, name: "Restroom", cameraId: '7', x: 0, y: 0, width: 800, height: 600, connectedTo: [
        { roomId: 3, doorId: null } // Dining Area (1b)
    ]}
];

// Portes
const doors = [
  { id: 0, name: "Left Door", roomA: 1, roomB: 2, isClosed: true },
  { id: 1, name: "Right Door", roomA: 2, roomB: 0, isClosed: true },
];

// Caméras (inspirées de FNAF 1)
const cameras = [
    { id: "safe", name: "The Office", roomId: 0, maxUsageTime: 99, remainingTime: 0, isAvailable: true, image: 'images/rooms/the_office/default.png' },
    { id: "1a", name: "Cam 1A", roomId: 1, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/1a_show_stage/1a_b0_c0_f0.jpg' },
    { id: "1b", name: "Cam 1B", roomId: 3, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/1b_dining_area/1b_b0_c0_f0.jpg' },
    { id: "1c", name: "Cam 1C", 	roomId: 7, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/1c_pirate_cove/1c_b0_c0_f0_00.jpg' },
    { id: "2a", name: "Cam 2A", roomId: 2, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/2a_west_hall/2a_b0_c0_f0.jpg' },
    { id: "2b", name: "Cam 2B", roomId: 4, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/2b_west_hall_corner/2b_b0_c0_f0.jpg' },
    { id: "3", name: "Cam 3", roomId: 6, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/3_supply_closet/3_b0_c0_f0.jpg' },
    { id: "4a", name: "Cam 4A", roomId: 9, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/4a_east_hall/4a_b0_c0_f0.jpg' },
    { id: "4b", name: "Cam 4B", roomId: 10, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/4b_east_hall_corner/4b_b0_c0_f0.jpg' },
    { id: "5", name: "Cam 5", roomId: 8, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/5_backstage/5_b0_c0_f0.jpg' },
    { id: "6", name: "Cam 6", roomId: 6, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/6_kitchen/6_b0_c0_f0.png' },
    { id: "7", name: "Cam 7", roomId: 5, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/7_restroom/7_b0_c0_f0.jpg' },
];
