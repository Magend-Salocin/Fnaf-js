// rooms_config.js
// Charge la source unique de verite pour les salles/cameras/parasites
// depuis rooms_config.json. Pour ajouter/modifier une salle, edite le
// JSON — pas ce fichier.

/**
 * Charge rooms_config.json de facon SYNCHRONE. Necessaire car ce
 * script s'execute en <script> classique et que data.js, charge
 * juste apres, utilise ROOMS des son propre chargement (pas d'await
 * top-level possible ici). Fonctionne avec Electron (nodeIntegration
 * desactive, page servie en file://) : XMLHttpRequest synchrone reste
 * gere pour ce protocole, contrairement a fetch().
 */
function loadRoomsConfigSync() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "script/config/rooms_config.json", false);
    xhr.send(null);
    // En file://, un chargement reussi renvoie status 0 (pas de vrai code HTTP).
    if (xhr.status !== 0 && xhr.status !== 200) {
      console.error(`[RoomsConfig] rooms_config.json : statut HTTP ${xhr.status}`);
      return { roomIdsOrder: [], rooms: {} };
    }
    return JSON.parse(xhr.responseText);
  } catch (err) {
    console.error("[RoomsConfig] Impossible de charger rooms_config.json", err);
    return { roomIdsOrder: [], rooms: {} };
  }
}

const _roomsConfigData = loadRoomsConfigSync();
const ROOM_IDS_ORDER = _roomsConfigData.roomIdsOrder;
const ROOMS = _roomsConfigData.rooms;

function getOrderedRoomEntries(config) {
  const source = config || ROOMS;
  return ROOM_IDS_ORDER
    .map((roomKey) => [roomKey, source[roomKey]])
    .filter(([, room]) => Boolean(room));
}

function buildRoomsStateFromConfig(config) {
  const source = config || ROOMS;
  const state = {};

  getOrderedRoomEntries(source).forEach(([roomKey, room]) => {
    const g = room.gameplay || {};
    state[roomKey] = {
      f: g.f || 0,
      c: g.c || 0,
      b: g.b || 0,
      occupy: g.occupy || 0
    };
  });

  return state;
}

function buildRoomsArrayFromConfig(config) {
  const source = config || ROOMS;

  return getOrderedRoomEntries(source).map(([roomKey, room]) => {
    const item = {
      id: room.id,
      name: room.roomName,
      cameraId: roomKey,
      x: 0,
      y: 0,
      width: room.width,
      height: room.height,
      connectedTo: (room.connectedTo || []).map((connection) => ({
        roomId: connection.roomId,
        doorId: connection.doorId
      })),
      cameraOffset: room.cameraOffset || 0,
      maxCameraOffset: room.maxCameraOffset
    };

    if (room.isOffice) {
      item.isOffice = true;
    }

    return item;
  });
}

function buildCamerasFromConfig(config) {
  const source = config || ROOMS;

  return getOrderedRoomEntries(source).map(([roomKey, room]) => ({
    id: roomKey,
    name: room.cameraName,
    roomId: room.id,
    maxUsageTime: room.camera?.maxUsageTime ?? 15,
    remainingTime: 0,
    isAvailable: room.camera?.available ?? true,
    image: room.image
  }));
}

function buildParasitesConfigFromRooms(config) {
  const source = config || ROOMS;
  const parasites = {};

  getOrderedRoomEntries(source).forEach(([roomKey, room]) => {
    parasites[roomKey] = room.video || {};
  });

  // Compat legacy code qui pouvait viser "office".
  if (!parasites.office && parasites.safe) {
    parasites.office = parasites.safe;
  }

  return parasites;
}

function getRoomVideoConfig(roomKey) {
  if (ROOMS[roomKey]?.video) {
    return ROOMS[roomKey].video;
  }

  if (roomKey === 'office' && ROOMS.safe?.video) {
    return ROOMS.safe.video;
  }

  return ROOMS['1a']?.video;
}
