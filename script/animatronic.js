class Animatronic {
    constructor(name, startRoomId, aggression, path = null) {
        this.name = name;
        this.currentRoomId = startRoomId;
        this.startRoomId = startRoomId;
        this.aggression = aggression;
        this.path = path; // Chemin spécifique pour cet animatronic
        this.currentPathIndex = 0; // Index actuel dans le chemin
        this.moveCounter = 0;
        this.blockedCounter = 0;
    }

    move() {
        this.moveCounter++;
        const moveInterval = 60 - this.aggression * 2;
        if (this.moveCounter < moveInterval) return;
        this.moveCounter = 0;

        // Si un chemin est défini, utilise-le
        if (this.path) {
            this.moveAlongPath();
        } else {
            // Sinon, utilise l'ancienne logique de déplacement aléatoire
            this.moveRandomly();
        }
    }

    // Déplacement selon un chemin prédéfini
    moveAlongPath() {
        // Met à jour l'ancienne pièce
        const oldRoomKey = this.getRoomKey(this.currentRoomId);
        if (oldRoomKey) rooms[oldRoomKey][this.getKey()] = 0;

        // Passe à la pièce suivante dans le chemin
        this.currentPathIndex++;
        if (this.currentPathIndex >= this.path.length) {
            this.currentPathIndex = 0; // Recommence depuis le début du chemin
        }

        const nextRoomKey = this.path[this.currentPathIndex];
        this.currentRoomId = this.getRoomId(nextRoomKey);

        // Met à jour la nouvelle pièce
        if (this.currentRoomId !== null) {
            rooms[nextRoomKey][this.getKey()] = 1;
            rooms[nextRoomKey].occupy = 1;
        }
    }

    // Déplacement aléatoire (ancienne logique)
    moveRandomly() {
        // Met à jour l'ancienne pièce
        const oldRoomKey = this.getRoomKey(this.currentRoomId);
        if (oldRoomKey) rooms[oldRoomKey][this.getKey()] = 0;

        // Trouve une pièce accessible aléatoirement
        const newRoomKey = this.findAccessibleRoom();
        if (newRoomKey) {
            this.currentRoomId = this.getRoomId(newRoomKey);
            rooms[newRoomKey][this.getKey()] = 1;
            rooms[newRoomKey].occupy = 1;
        } else {
            // Si bloqué, retourne à la pièce de départ après un certain temps
            this.blockedCounter++;
            if (this.blockedCounter > 120) {
                this.currentRoomId = this.startRoomId;
                this.blockedCounter = 0;
                const startRoomKey = this.getRoomKey(this.startRoomId);
                if (startRoomKey) rooms[startRoomKey][this.getKey()] = 1;
            }
        }
    }

    // Retourne la clé de la pièce (ex: '1a')
    getRoomKey(roomId) {
        const room = roomsArray.find(r => r.id === roomId);
        return room ? room.cameraId : null;
    }

    // Retourne l'ID de la pièce (ex: 1)
    getRoomId(roomKey) {
        const room = roomsArray.find(r => r.cameraId === roomKey);
        return room ? room.id : null;
    }

    // Retourne la clé de l'animatronic (ex: 'b' pour Bonnie)
    getKey() {
        return this.name.charAt(0).toLowerCase();
    }

    // Trouve une pièce accessible aléatoirement (pour les animatronics sans chemin)
    findAccessibleRoom() {
        const currentRoom = roomsArray.find(r => r.id === this.currentRoomId);
        if (!currentRoom) return null;

        const possibleConnections = currentRoom.connectedTo.filter(connection => {
            if (connection.doorId === null) return true;
            const door = doors.find(d => d.id === connection.doorId);
            return door && !door.isClosed;
        });

        if (possibleConnections.length > 0) {
            const randomConnection = possibleConnections[Math.floor(Math.random() * possibleConnections.length)];
            const newRoom = roomsArray.find(r => r.id === randomConnection.roomId);
            return newRoom ? newRoom.cameraId : null;
        }
        return null;
    }

    // Dessine l'animatronic
    draw(ctx) {
        const currentRoom = roomsArray.find(room => room.id === this.currentRoomId);
        if (currentRoom) {
            ctx.fillStyle = this.name === 'Freddy' ? 'brown' :
                            this.name === 'Bonnie' ? 'blue' :
                            this.name === 'Chica' ? 'yellow' : 'purple';
            ctx.fillRect(currentRoom.x + 20, currentRoom.y + 20, 30, 30);
            ctx.fillStyle = 'white';
            ctx.fillText(this.name, currentRoom.x + 20, currentRoom.y + 15);
        }
    }
}



// Crée les animatronics
const freddy 	= new Animatronic('Freddy'	, '1a'	, 5, ['1a']);
const bonnie 	= new Animatronic('Bonnie'	, '1a'	, 7, ['1a', '1b', '3', '6', '5', '2b', 'safe']  );
const chica 	= new Animatronic('Chica'	, '1a'	, 6, ['1a', '1b', '7', '6', '4a', '4b', 'safe'] );
const foxy 		= new Animatronic('Foxy'	, '7'	, 9,  ['7']);

const animatronics = [freddy, bonnie, chica, foxy];

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