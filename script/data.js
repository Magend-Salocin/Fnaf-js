//data.js
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
  { id: 0, name: "Left Door", roomA: 1, roomB: 2, isClosed: true },
  { id: 1, name: "Right Door", roomA: 2, roomB: 0, isClosed: true },
];

// Caméras (inspirées de FNAF 1)
const cameras = [
  { id: "0",  name: "the_office", roomId: 0, maxUsageTime: 99, remainingTime: 0, isAvailable: true, image: 'images/rooms/the_office/default.png' },
  { id: "1a", name: "Cam 1A", 	roomId: 1, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/1a_show_stage/cam_1a_b1_c1_f1.jpg' },
  { id: "1b", name: "Cam 1B", 	roomId: 1, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/1b_dining_area/1b_b0_c0_f0.jpg' },
  { id: "1c", name: "Cam 1C", 	roomId: 1, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/1c_pirate_cove/1c_b0_c0_f0_00.jpg' },
  { id: "2a", name: "Cam 2A", 	roomId: 2, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/2a_west_hall/2a_b0_c0_f0.jpg' },
  { id: "2b", name: "Cam 2B", 	roomId: 2, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/2b_west_hall_corner/2b_b0_c0_f0.jpg' },
  { id: "3",  name: "Cam 3", 		roomId: 3, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/3_supply_closet/3_b0_c0_f0.jpg' },
  { id: "4a", name: "Cam 4A", 	roomId: 4, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/4a_east_hall/4a_b0_c0_f0.jpg' },
  { id: "4b", name: "Cam 4B", 	roomId: 4, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/4b_east_hall_corner/4b_b0_c0_f0_d1.jpg' },
  { id: "5",  name: "Cam 5", 		roomId: 5, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/5_backstage/5_b0_c0_f0.jpg' },
  { id: "6",  name: "Cam 6", 		roomId: 6, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/6_kitchen/6_b0_c0_f0.png' },
  { id: "7",  name: "Cam 7", 		roomId: 7, maxUsageTime: 15, remainingTime: 0, isAvailable: true, image: 'images/rooms/7_restroom/7_b0_c0_f0.jpg' },
];
