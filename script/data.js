// Salles (inspirées de FNAF 1)
const rooms = [
  { id: 0, name: "The Office", x: 0, y: 0, width: 800, height: 600, imageWidth: 1600, imageHeight: 720, cameraOffset: 0, maxCameraOffset: 800, isOffice: true },
  { id: 1, name: "Show Stage", x: 0, y: 0, width: 800, height: 600, imageWidth: 1600, imageHeight: 720, cameraOffset: 0, maxCameraOffset: 800, connectedTo: [{ roomId: 2, doorId: 0 }] },
  { id: 2, name: "West Hall", x: 0, y: 0, width: 800, height: 600, imageWidth: 1600, imageHeight: 720, cameraOffset: 0, maxCameraOffset: 800, connectedTo: [{ roomId: 1, doorId: 0 }, { roomId: 3, doorId: null }, { roomId: 0, doorId: 1 }] },
  { id: 3, name: "Dining Area", x: 0, y: 0, width: 800, height: 600, imageWidth: 1600, imageHeight: 720, cameraOffset: 0, maxCameraOffset: 800, connectedTo: [{ roomId: 2, doorId: null }, { roomId: 4, doorId: null }] },
  { id: 4, name: "Restrooms", x: 0, y: 0, width: 800, height: 600, imageWidth: 1600, imageHeight: 720, cameraOffset: 0, maxCameraOffset: 800, connectedTo: [{ roomId: 3, doorId: null }] },
  { id: 5, name: "Backstage", x: 0, y: 0, width: 800, height: 600, imageWidth: 1600, imageHeight: 720, cameraOffset: 0, maxCameraOffset: 800, connectedTo: [] },
  { id: 6, name: "Supply Closet", x: 0, y: 0, width: 800, height: 600, imageWidth: 1600, imageHeight: 720, cameraOffset: 0, maxCameraOffset: 800, connectedTo: [] },
  { id: 7, name: "Pirate Cove", x: 0, y: 0, width: 800, height: 600, imageWidth: 1600, imageHeight: 720, cameraOffset: 0, maxCameraOffset: 800, connectedTo: [] },
];

// Portes
const doors = [
  { id: 0, name: "Left Door", roomA: 1, roomB: 2, isClosed: false },
  { id: 1, name: "Right Door", roomA: 2, roomB: 0, isClosed: false },
];

// Caméras (inspirées de FNAF 1)
const cameras = [
  { id: 0, name: "Cam 1A", roomId: 1, maxUsageTime: 15, remainingTime: 0, isAvailable: true },
  { id: 1, name: "Cam 1B", roomId: 1, maxUsageTime: 15, remainingTime: 0, isAvailable: true },
  { id: 2, name: "Cam 1C", roomId: 1, maxUsageTime: 15, remainingTime: 0, isAvailable: true },
  { id: 3, name: "Cam 2A", roomId: 2, maxUsageTime: 15, remainingTime: 0, isAvailable: true },
  { id: 4, name: "Cam 2B", roomId: 2, maxUsageTime: 15, remainingTime: 0, isAvailable: true },
  { id: 5, name: "Cam 3", roomId: 3, maxUsageTime: 15, remainingTime: 0, isAvailable: true },
  { id: 6, name: "Cam 4A", roomId: 4, maxUsageTime: 15, remainingTime: 0, isAvailable: true },
  { id: 7, name: "Cam 4B", roomId: 4, maxUsageTime: 15, remainingTime: 0, isAvailable: true },
  { id: 8, name: "Cam 5", roomId: 5, maxUsageTime: 15, remainingTime: 0, isAvailable: true },
  { id: 9, name: "Cam 6", roomId: 6, maxUsageTime: 15, remainingTime: 0, isAvailable: true },
  { id: 10, name: "Cam 7", roomId: 7, maxUsageTime: 15, remainingTime: 0, isAvailable: true },
];
