class Animatronic {
    constructor(name, scareDoor, startRoomId, aggression, path = null, scareFunction = null) {
        this.name = name;
        this.scareDoor = scareDoor;
        this.currentRoomId = startRoomId;
        this.startRoomId = startRoomId;
        this.aggression = aggression;
        this.path = path;
        this.currentPathIndex = 0;
        this.moveCounter = 0;
        this.blockedCounter = 0;
        this.attackCounter = 0; // Nouveau : compteur pour l'attaque
        this.attackThreshold = 99; // Seuil aléatoire entre 30 et 90
        this.attackReady = false; // Nouveau : état d'attaque
        this.scareFunction = scareFunction; 
        this.nextAttackThreshold();
    }

    nextAttackThreshold() {
        // Seuil aléatoire entre 10 et 20
        this.attackThreshold = Math.floor(Math.random() * 11) + 10;
        this.attackReady = false;
        console.log(`[${this.name}] Nouveau seuil d'attaque : ${this.attackThreshold}`);
    }

    move() {
        this.moveCounter++;
        const moveInterval = 20 - this.aggression * 2;

        if (this.moveCounter < moveInterval) return;
        this.moveCounter = 0;

        
        this.moveAlongPath();
      

        // Incrémente attackCounter si dans la saferoom
        if (this.isInSafeRoom()) {
            this.attackCounter++;
        } else {
            this.attackCounter = 0; // Réinitialise si hors de la saferoom
            this.attackReady = false;
        }

       // this.attack(); // Vérifie si une attaque doit être déclenchée
        this.draw();
        
    }

    // Déplacement selon un chemin prédéfini
    moveAlongPath() {
        // Met à jour l'ancienne pièce
        const oldRoomKey = this.getRoomKey(this.currentRoomId);
        if (oldRoomKey) {
            rooms[oldRoomKey][this.getKey()] = 0;
            if (rooms[oldRoomKey].b === 0 && rooms[oldRoomKey].c === 0 && rooms[oldRoomKey].f === 0) {
                rooms[oldRoomKey].occupy = 0;
            }
            document.getElementById('cam'+oldRoomKey).style.background='#555';
        }

        // Passe à la pièce suivante dans le chemin
        this.currentPathIndex++;
        if (this.currentPathIndex >= this.path.length) {
            this.currentPathIndex = 0; // Recommence depuis le début du chemin
        }

        let nextRoomKey = this.path[this.currentPathIndex];

        if(rooms[nextRoomKey].occupy == 1){

            nextRoomKey = oldRoomKey;
        }else{
            this.currentRoomId = this.getRoomId(nextRoomKey);

            // Met à jour la nouvelle pièce
            if (this.currentRoomId !== null) {
                rooms[nextRoomKey][this.getKey()] = 1;
                rooms[nextRoomKey].occupy = 1;
            }
        }

        // Sons de pas et mouvements
        const possibleSounds = [
            "move_sound", "move_sound", "move_sound", "run_sound", "run_sound", "run_fast"
        ];
        const randomSound = possibleSounds[Math.floor(Math.random() * possibleSounds.length)];
        playSound(randomSound);
        
    }

    setAggression(value) {
        this.aggression = Math.max(0, Math.min(20, value));
    }

    resetForNight() {
        this.currentRoomId = this.startRoomId;
        this.currentPathIndex = 0;
        this.moveCounter = 0;
        this.blockedCounter = 0;
        this.attackCounter = 0;
        this.attackReady = false;
        this.nextAttackThreshold();
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
            return true;
            /*const door = doors.find(d => d.id === connection.doorId);
            return door && !door.isClosed;*/
        });

        if (possibleConnections.length > 0) {
            const randomConnection = possibleConnections[Math.floor(Math.random() * possibleConnections.length)];
            const newRoom = roomsArray.find(r => r.id === randomConnection.roomId);
            return newRoom ? newRoom.cameraId : null;
        }
        return null;
    }

     // Ajoute cette méthode dans ta classe Animatronic
    isInSafeRoom() {
        const SAFEROOM_ID = 0; // Exemple : à adapter selon ton code

        return this.currentRoomId === SAFEROOM_ID;
    }


    attack() {
        if (this.isInSafeRoom() && !gameEnd){
             this.attackCounter++;
            // Log : État actuel de l'animatronic
            console.log(`[${this.name}] Attack check - Room: ${this.getRoomKey(this.currentRoomId)}, AttackCounter: ${this.attackCounter}, AttackThreshold: ${this.attackThreshold}, AttackReady: ${this.attackReady}`);

            // Vérifie si l'animatronic est dans la saferoom et pas encore prêt à attaquer
            if (this.isInSafeRoom() && !this.attackReady) {
                console.log(`[${this.name}] Dans la saferoom, incrémentation du compteur d'attaque...`);

                // Si le seuil est atteint, prépare l'attaque
                if (this.attackCounter >= this.attackThreshold) {
                    console.log(`[${this.name}] SEUIL ATTEINT ! Prêt à attaquer !`);
                    this.attackReady = true;
                    this.attackCounter = 0;
                }else{
                    // Déclenche le son "door_pounding" avec une probabilité de 30% 
                    if (Math.random() < 0.3) { // 30% de chance
                        playSound("door_pounding");
                        console.log(`[${this.name}] Door pounding sound joué !`);
                    }
                }
            }

            // Si prêt à attaquer
            if (this.attackReady) {
                console.log(`[${this.name}] Prêt à attaquer, vérification des portes...`);

                // Vérifie si la porte correspondante est FERMÉE (corrigé)
                if ((this.scareDoor === 'left' && !doors["left"].isClosed) ||
                    (this.scareDoor === 'right' && !doors["right"].isClosed)) {

                    if (this.scareFunction) {
                        this.scareFunction(); // Appelle la fonction personnalisée
                    } else {
                        transitionDefaultJumpScare(); // Fonction par défaut
                    }
               
                    gameEnd=true;

                } else {
                    console.log(`[${this.name}] Porte fermée... Annulation de l'attaque.`);
                    this.attackThreshold = this.nextAttackThreshold();   // Nouveau seuil aléatoire
               
                }
            } else if (!this.isInSafeRoom()) {
                console.log(`[${this.name}] Hors de la saferoom, réinitialisation.`);
                this.attackThreshold = this.nextAttackThreshold();   // Nouveau seuil aléatoire
            }
        }
    }

    // #region Debug
    // Ajoute cette méthode dans ta classe Animatronic
    forceMoveToRoom(roomKey) {
        // Met à jour l'ancienne pièce
        const oldRoomKey = this.getRoomKey(this.currentRoomId);
        if (oldRoomKey) {
            rooms[oldRoomKey][this.getKey()] = 0;
            document.getElementById('cam'+oldRoomKey).style.background='#555';
        }

        // Met à jour la pièce actuelle
        this.currentRoomId = this.getRoomId(roomKey);
        if (this.currentRoomId !== null) {
            rooms[roomKey][this.getKey()] = 1;
            rooms[roomKey].occupy = 1;
        }

        // Réinitialise les compteurs si nécessaire
        this.moveCounter = 0;
        this.blockedCounter = 0;

        this.draw();
    }

    // Dessine l'animatronic
    draw() {
        const Room = this.getRoomKey(this.currentRoomId);
        console.log("deplacement de "+this.name+" room : "+Room) ;

        const color = this.name === 'Freddy' ? 'brown' :
                        this.name === 'Bonnie' ? 'blue' :
                        this.name === 'Chica' ? 'yellow' : 'purple';
                        
        document.getElementById('cam'+ Room).style.background= color;
    }
    // #endregion
}

/***** Office ****/
function drawJumpscare(ctx, jumpscareKey) {
    if (loadedTheOfficeImages.safe_room && loadedTheOfficeImages.safe_room[jumpscareKey] && loadedTheOfficeImages.safe_room[jumpscareKey].complete) {
        ctx.drawImage(loadedTheOfficeImages.safe_room[jumpscareKey], 0, 0, canvas.width, canvas.height);
    }
}

// Crée les animatronics

//name, scareDoor, startRoomId, aggression, path = null, scareFunction = null

const freddy 	= new Animatronic('Freddy'	,'right', 1	, 0, ['1a']);
const bonnie 	= new Animatronic('Bonnie'	,'left', 1	, 6, ['1a', '1b', '3', '5', '2a', '2b', 'safe'] ,bonnieJumpScare );
const chica 	= new Animatronic('Chica'	,'right', 1	, 3, ['1a', '1b', '7', '6', '4a', '4b', 'safe'],chicaJumpScare );
const foxy 		= new Animatronic('Foxy'	,'left', 7	, 0,  ['1c']);

const animatronics = [freddy, bonnie, chica, foxy];