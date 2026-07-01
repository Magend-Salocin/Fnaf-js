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
   // "foxy_run": 'images/rooms/2a_west_hall/foxy_run.gif'
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
  },
  "5": {
    "5_b0_c0_f0": 'images/rooms/5_backstage/5_b0_c0_f0.jpg',
    "5_b1_c0_f0": 'images/rooms/5_backstage/5_b1_c0_f0.jpg',
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

  safe_room_power_0: 'images/rooms/the_office/safe_room/safe_room_power_0.png',
  safe_room_powerdown_freddy: 'images/rooms/the_office/safe_room/safe_room_powerdown_freddy.gif',
  safe_room_powerdown_end: 'images/rooms/the_office/safe_room/safe_room_powerdown_end.gif',
  power_down_freddy_scare: 'images/rooms/the_office/safe_room/power_down_freddy_scare.gif',

  game_over_trans: 'images/rooms/the_office/safe_room/static.gif',
  game_over_end: 'images/rooms/the_office/safe_room/gameover.png',
  game_win: 'images/rooms/the_office/safe_room/5_to_6.gif',

  bonnie_jumpscare: 'images/rooms/the_office/safe_room/bonnie_jumpscare.gif',
  chika_jumpscare: 'images/rooms/the_office/safe_room/chika_jumpscare.gif',
  foxy_jumpscare: 'images/rooms/the_office/safe_room/left_door_foxy_scare.gif',

  

  rightside_freddy_scare: 'images/rooms/the_office/safe_room/rightside_freddy_scare.gif',

  safe_room_bonny_right_door_scare: 'images/rooms/the_office/safe_room/safe_room_bonny_right_door_scare.png',
  safe_room_chika_left_door_scare: 'images/rooms/the_office/safe_room/safe_room_chika_left_door_scare.png',
};

const loadedCameraImages = {};
const loadedTheOfficeImages = {}; // Objet pour stocker les images de the_office

// Fonction pour détecter les GIFs
function _isGif(path) {
  return path.toLowerCase().endsWith('.gif');
}

// Fonction pour précharger les images et GIFs
async function preloadImages() {
  // Charger les images des caméras
  for (const roomId in cameras_images) {
    loadedCameraImages[roomId] = {};
    for (const imageKey in cameras_images[roomId]) {
      const imagePath = cameras_images[roomId][imageKey];
      const img = new Image();
      img.src = imagePath;
      loadedCameraImages[roomId][imageKey] = img;

      // Si c'est un GIF, le charger dynamiquement
      if (_isGif(imagePath)) {
        const gifId = `${roomId}_${imageKey}`;
        await loadGif(gifId, imagePath, 0, 0, img.width, img.height, false);
      }
    }
  }

  // Charger les images de the_office
  for (const key in the_office) {
    const path = the_office[key];
    if (typeof path === 'string') {
      const img = new Image();
      img.src = path;
      loadedTheOfficeImages[key] = img;
    }
  }
}
