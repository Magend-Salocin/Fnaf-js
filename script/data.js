// Salles (inspirées de FNAF 1)
const rooms = [
  { id: 0, name: "Bureau", x: 300, y: 100, width: 200, height: 200, isOffice: true },
  { id: 1, name: "Entrée", x: 50, y: 100, width: 150, height: 150, connectedTo: [{ roomId: 2, doorId: 0 }] },
  { id: 2, name: "Couloir Gauche", x: 200, y: 100, width: 100, height: 300, connectedTo: [{ roomId: 1, doorId: 0 }, { roomId: 3, doorId: null }, { roomId: 0, doorId: 1 }] },
  { id: 3, name: "Dining Area", x: 300, y: 300, width: 200, height: 100, connectedTo: [{ roomId: 2, doorId: null }, { roomId: 4, doorId: null }] },
  { id: 4, name: "Cuisine", x: 500, y: 100, width: 150, height: 150, connectedTo: [{ roomId: 3, doorId: null }] },
  { id: 5, name: "Stockage", x: 50, y: 300, width: 150, height: 100, connectedTo: [] },
  { id: 6, name: "Pirate Cove", x: 500, y: 300, width: 150, height: 100, connectedTo: [] },
];

// Portes
const doors = [
  { id: 0, name: "Porte Gauche", roomA: 1, roomB: 2, isClosed: false },
  { id: 1, name: "Porte Droite", roomA: 2, roomB: 0, isClosed: false },
];

// Caméras (inspirées de FNAF 1)
const cameras = [
  { id: 0, name: "Cam 1A", roomId: 1, maxUsageTime: 5, remainingTime: 0, isAvailable: true },
  { id: 1, name: "Cam 1B", roomId: 1, maxUsageTime: 5, remainingTime: 0, isAvailable: true },
  { id: 2, name: "Cam 1C", roomId: 1, maxUsageTime: 5, remainingTime: 0, isAvailable: true },
  { id: 3, name: "Cam 2A", roomId: 2, maxUsageTime: 5, remainingTime: 0, isAvailable: true },
  { id: 4, name: "Cam 2B", roomId: 2, maxUsageTime: 5, remainingTime: 0, isAvailable: true },
  { id: 5, name: "Cam 2B", roomId: 3, maxUsageTime: 5, remainingTime: 0, isAvailable: true },
  { id: 6, name: "Cam 4A", roomId: 4, maxUsageTime: 5, remainingTime: 0, isAvailable: true },
  { id: 7, name: "Cam 4B", roomId: 4, maxUsageTime: 5, remainingTime: 0, isAvailable: true },
  { id: 8, name: "Cam 5", roomId: 5, maxUsageTime: 5, remainingTime: 0, isAvailable: true },
  { id: 9, name: "Cam 6", roomId: 6, maxUsageTime: 5, remainingTime: 0, isAvailable: true },
  { id: 10, name: "Cam 7", roomId: 7, maxUsageTime: 5, remainingTime: 0, isAvailable: true },
];


