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

*/const roomImages = {
  0: { default: 'images/rooms/the_office/default.png' },
  1: {
    default: 'images/rooms/show_stage/default.png',
    events: [
      'images/rooms/show_stage/event1.png',
      'images/rooms/show_stage/event2.png',
      'images/rooms/show_stage/event3.png'
    ]
  },
  2: { default: 'images/rooms/west_hall/default.png' },
  3: { default: 'images/rooms/dining_area/default.png' },
  4: {
    default: 'images/rooms/restrooms/default.png',
    withAnimatronics: [
      'images/rooms/restrooms/with_animatronic1.png',
      'images/rooms/restrooms/with_animatronic2.png',
      'images/rooms/restrooms/with_animatronic3.png',
      'images/rooms/restrooms/with_animatronic4.png',
      'images/rooms/restrooms/with_animatronic5.png'
    ]
  },
  5: { default: 'images/rooms/backstage/default.png' },
  6: { default: 'images/rooms/supply_closet/default.png' },
  7: { default: 'images/rooms/pirate_cove/default.png' }
};

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

