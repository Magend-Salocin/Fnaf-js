//asset.js

/*
Backstage		Cam 5
Dining Area		Cam 1A, 1B, 1C
East Hall		Cam 4A, 4B
Pirates Cove	Cam 7
Restrooms		Cam 3
Show Stage		Cam 1A, 1B, 1C
Supply Closet	Cam 6
The Office		(Pas de caméra)
West Hall		Cam 2A, 2B

*/
const cameras_images = {
  "1a": {
    "1a_b0_c0_f0": 'images/rooms/1a_show_stage/1a_b0_c0_f0.jpg',
    "1a_b0_c0_f1": 'images/rooms/1a_show_stage/1a_b0_c0_f1.jpg',
    "1a_b0_c0_f1_event": 'images/rooms/1a_show_stage/1a_b0_c0_f1_event.jpg',
    "1a_b0_c1_f1": 'images/rooms/1a_show_stage/1a_b0_c1_f1.jpg',
    "1a_b1_c0_f1": 'images/rooms/1a_show_stage/1a_b1_c0_f1.jpg',
    "1a_b1_c1_f1": 'images/rooms/1a_show_stage/1a_b1_c1_f1.jpg',
    "1a_b1_c1_f1_event": 'images/rooms/1a_show_stage/1a_b1_c1_f1_event.jpg'
  },
  "1b": {
    "1b_b0_c0_f0": 'images/rooms/1b_dining_area/1b_b0_c0_f0.jpg',
    "1b_b0_c0_f0_event": 'images/rooms/1b_dining_area/1b_b0_c0_f0_event.jpg',
    "1b_b0_c0_f1": 'images/rooms/1b_dining_area/1b_b0_c0_f1.jpg',
    "1b_b0_c1_f0": 'images/rooms/1b_dining_area/1b_b0_c1_f0.jpg',
    "1b_b0_c1_f0_event": 'images/rooms/1b_dining_area/1b_b0_c1_f0_event.jpg',
    "1b_b1_c0_f0": 'images/rooms/1b_dining_area/1b_b1_c0_f0.jpg'
  },
  "1c": {
    "1c_b0_c0_f0": 'images/rooms/1c_pirate_cove/1c_b0_c0_f0_00.jpg',
    "1c_b0_c0_f0_00": 'images/rooms/1c_pirate_cove/1c_b0_c0_f0_00.jpg',
    "1c_b0_c0_f0_01": 'images/rooms/1c_pirate_cove/1c_b0_c0_f0_01.jpg',
    "1c_b0_c0_f0_02": 'images/rooms/1c_pirate_cove/1c_b0_c0_f0_02.jpg',
    "1c_b0_c0_f0_03": 'images/rooms/1c_pirate_cove/1c_b0_c0_f0_03.jpg',
    "1c_b0_c0_f0_event": 'images/rooms/1c_pirate_cove/1c_b0_c0_f0_event.jpg'
  },
  "2a": {
    "2a_b0_c0_f0": 'images/rooms/2a_west_hall/2a_b0_c0_f0.jpg',
    "2a_b1_c0_f0": 'images/rooms/2a_west_hall/2a_b1_c0_f0.jpg',
    "foxy_run": 'images/rooms/2a_west_hall/foxy_run.gif'
  },
  "2b": {
    "2b_b0_c0_f0": 'images/rooms/2b_west_hall_corner/2b_b0_c0_f0.jpg',
    "2b_b0_c0_f0_event": 'images/rooms/2b_west_hall_corner/2b_b0_c0_f0_event.jpg',
    "2b_b0_c0_f0_GF": 'images/rooms/2b_west_hall_corner/2b_b0_c0_f0_GF.jpg',
    "2b_b1_c0_f0": 'images/rooms/2b_west_hall_corner/2b_b1_c0_f0.jpg',
    "2b_b1_c0_f0_event": 'images/rooms/2b_west_hall_corner/2b_b1_c0_f0_event.jpg'
  },
  "3": {
    "3_b0_c0_f0": 'images/rooms/3_supply_closet/3_b0_c0_f0.jpg',
    "3_b1_c0_f0": 'images/rooms/3_supply_closet/3_b1_c0_f0.jpg'
  },
  "4a": {
    "4a_b0_c0_f0": 'images/rooms/4a_east_hall/4a_b0_c0_f0.jpg',
    "4a_b0_c0_f0_event": 'images/rooms/4a_east_hall/4a_b0_c0_f0_event.jpg',
    "4a_b0_c0_f0_GF": 'images/rooms/4a_east_hall/4a_b0_c0_f0_GF.jpg',
    "4a_b0_c0_f1": 'images/rooms/4a_east_hall/4a_b0_c0_f1.jpg',
    "4a_b0_c1_f0": 'images/rooms/4a_east_hall/4a_b0_c1_f0.jpg',
    "4a_b0_c1_f0_event": 'images/rooms/4a_east_hall/4a_b0_c1_f0_event.jpg'
  },
  "4b": {
    "4b_b0_c0_f0": 'images/rooms/4b_east_hall_corner/4b_b0_c0_f0_d1.jpg',
    "4b_b0_c0_f0_d1": 'images/rooms/4b_east_hall_corner/4b_b0_c0_f0_d1.jpg',
    "4b_b0_c0_f0_d2": 'images/rooms/4b_east_hall_corner/4b_b0_c0_f0_d2.jpg',
    "4b_b0_c0_f0_d3": 'images/rooms/4b_east_hall_corner/4b_b0_c0_f0_d3.jpg',
    "4b_b0_c0_f0_d4": 'images/rooms/4b_east_hall_corner/4b_b0_c0_f0_d4.jpg',
    "4b_b0_c0_f0_d5": 'images/rooms/4b_east_hall_corner/4b_b0_c0_f0_d5.jpg',
    "4b_b0_c0_f1": 'images/rooms/4b_east_hall_corner/4b_b0_c0_f1.jpg',
    "4b_b0_c1_f0": 'images/rooms/4b_east_hall_corner/4b_b0_c1_f0.jpg',
    "4b_b0_c1_f0_event": 'images/rooms/4b_east_hall_corner/4b_b0_c1_f0_event.jpg',
    "4b_b0_c1_f0_event2": 'images/rooms/4b_east_hall_corner/4b_b0_c1_f0_event2.jpg'
  },
  "5": {
    "5_b0_c0_f0": 'images/rooms/5_backstage/5_b0_c0_f0.jpg',
    "5_b0_c0_f0_event": 'images/rooms/5_backstage/5_b0_c0_f0_event.jpg',
    "5_b1_c0_f0": 'images/rooms/5_backstage/5_b1_c0_f0.jpg',
    "5_b1_c0_f0_event": 'images/rooms/5_backstage/5_b1_c0_f0_event.jpg'
  },
  "6": {
    "6_b0_c0_f0": 'images/rooms/6_kitchen/6_b0_c0_f0.png'
  },
  "7": {
    "7_b0_c0_f0": 'images/rooms/7_restroom/7_b0_c0_f0.jpg',
    "7_b0_c0_f1": 'images/rooms/7_restroom/7_b0_c0_f1.jpg',
    "7_b0_c1_f0": 'images/rooms/7_restroom/7_b0_c1_f0.jpg',
    "7_b0_c1_f0_event": 'images/rooms/7_restroom/7_b0_c1_f0_event.jpg'
  }
};


  const the_office = {

    safe_room_left_light_0_right_light_0: 'images/rooms/the_office/safe_room_left_light_0_right_light_0.png',
    safe_room_left_light_0_right_light_1: 'images/rooms/the_office/safe_room_left_light_0_right_light_1.png',
    safe_room_left_light_1_right_light_0: 'images/rooms/the_office/safe_room_left_light_1_right_light_0.png',
    safe_room_left_light_1_right_light_1: 'images/rooms/the_office/safe_room_left_light_1_right_light_1.png',
/*
    default_01: 'images/rooms/the_office/default_01.jpg',
    default_02: 'images/rooms/the_office/default_02.jpg',
    default_03: 'images/rooms/the_office/default_03.jpg',
    default_b0: 'images/rooms/the_office/default_b0.jpg',
    default_b1: 'images/rooms/the_office/default_b1.jpg',
    default_c0: 'images/rooms/the_office/default_c0.jpg',
    default_c0_1: 'images/rooms/the_office/default_c0_1.jpg',
    default_c1: 'images/rooms/the_office/default_c1.jpg',
    default_f0: 'images/rooms/the_office/default_f0.jpg',
    default_f1: 'images/rooms/the_office/default_f1.jpg',*/
    safe_room: {
      bonnie_jumpscare: 'images/rooms/the_office/safe_room/bonnie_jumpscare.gif',
      chika_jumpscare: 'images/rooms/the_office/safe_room/chika_jumpscare.gif',
      left_door_foxy_scare: 'images/rooms/the_office/safe_room/left_door_foxy_scare.gif',
      power_down_freddy_scare: 'images/rooms/the_office/safe_room/power_down_freddy_scare.gif',
      rightside_freddy_scare: 'images/rooms/the_office/safe_room/rightside_freddy_scare.gif',
      right_door_cika_scare: 'images/rooms/the_office/safe_room/right_door_cika_scare.png',
      safe_room_bonny_right_door_scare: 'images/rooms/the_office/safe_room/safe_room_bonny_right_door_scare.png',
      safe_room_chika_left_door_scare: 'images/rooms/the_office/safe_room/safe_room_chika_left_door_scare.png',

      safe_room_powerdown_end: 'images/rooms/the_office/safe_room/safe_room_powerdown_end.gif',
      safe_room_powerdown_foxy: 'images/rooms/the_office/safe_room/safe_room_powerdown_foxy.gif',
      safe_room_power_0: 'images/rooms/the_office/safe_room/safe_room_power_0.png'
    }
};

const loadedCameraImages = {};
const loadedTheOfficeImages = {}; // Objet pour stocker les images de the_office

function preloadImages() {
  for (const roomId in cameras_images) {
    loadedCameraImages[roomId] = {};

    // Charger chaque image dans le répertoire actuel
    for (const imageKey in cameras_images[roomId]) {
      const imagePath = cameras_images[roomId][imageKey];
      loadedCameraImages[roomId][imageKey] = new Image();
      loadedCameraImages[roomId][imageKey].src = imagePath;
    }
  }
  // Précharger les images de the_office
    for (const key in the_office) {
        if (typeof the_office[key] === 'string') {
            loadedTheOfficeImages[key] = new Image();
            loadedTheOfficeImages[key].src = the_office[key];
        } else if (typeof the_office[key] === 'object') {
            loadedTheOfficeImages[key] = {};
            for (const subKey in the_office[key]) {
                loadedTheOfficeImages[key][subKey] = new Image();
                loadedTheOfficeImages[key][subKey].src = the_office[key][subKey];
            }
        }
    }
}

/*
const loadedRoomImages = {};

function preloadImages() {
  for (const roomId in roomImages) {
    loadedRoomImages[roomId] = { default: new Image() };
    loadedRoomImages[roomId].default.src = roomImages[roomId].default;

    if (roomImages[roomId].events) {
      loadedRoomImages[roomId].events = roomImages[roomId].events.map(path => {
        const img = new Image();
        img.src = path;
        return img;
      });
    }

    if (roomImages[roomId].withAnimatronics) {
      loadedRoomImages[roomId].withAnimatronics = roomImages[roomId].withAnimatronics.map(path => {
        const img = new Image();
        img.src = path;
        return img;
      });
    }
  }
}
*/
