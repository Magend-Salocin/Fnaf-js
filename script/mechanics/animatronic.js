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
        this.night_ia_level =0;
        
        this.attackCounter = 0; // Nouveau : compteur pour l'attaque
        this.attackThreshold = 99; // Seuil aléatoire entre 30 et 90
        this.attackReady = false; // Nouveau : état d'attaque
        this.scareFunction = scareFunction; 
        //this.nextAttackThreshold();
        this.foxyInstance = null;

        if(this.name=='Foxy'){  
            this.foxyInstance = new Foxy();
        }
    }

    /**
     * Affiche un message de log spécifique à Foxy
     * @param {string} message - Message à afficher
     */
    writeMessage(message) {
        console.log(`[Foxy] ${message}`);
    }

    /**
     *  Génère un nouveau seuil d'attaque aléatoire pour l'animatronic
     * Le seuil est un nombre aléatoire entre 10 et 20. Lorsque le compteur d'attaque atteint ce seuil, l'animatronic est prêt à attaquer.
     * Cette fonction est appelée pour initialiser le seuil d'attaque au début de la partie et après chaque attaque réussie ou annulée. Elle permet de créer une dynamique d'attaque imprévisible pour le joueur, augmentant ainsi la tension et le défi du jeu.
     */ 
    nextAttackThreshold() {
        // Seuil aléatoire entre 10 et 20
        this.attackThreshold = Math.floor(Math.random() * 11) + 10;
        this.attackReady = false;
        this.writeMessage(`[${this.name}] Nouveau seuil d'attaque : ${this.attackThreshold}`);
    }

    /** 
     * Met à jour l'animatronic à chaque tick de jeu 
     * - Incrémente le compteur de mouvement et déplace l'animatronic selon son chemin prédéfini.
     * - Si l'animatronic est dans la saferoom, incrémente le compteur d'attaque. Si le seuil d'attaque est atteint, prépare l'attaque.
     * - Si l'animatronic est prêt à attaquer, vérifie si la porte correspondante est fermée pour déterminer si le joueur subit un Game Over ou si l'attaque est annulée.   
     * - Si l'animatronic n'est pas dans la saferoom, réinitialise le compteur d'attaque et l'état d'attaque.
     */
    move() {
        this.moveCounter++;
        const moveInterval = 20 - this.aggression * 2;

        if (this.moveCounter < moveInterval) return;
        
        if(this.foxyInstance) return; // Si c'est Foxy, on ne déplace pas Foxy pour éviter les conflits de logique
            
        this.moveCounter = 0;

        this.moveAlongPath();

        // Incrémente attackCounter si dans la saferoom
        if (this.isInSafeRoom()) {
            this.attackCounter++;
        } else {
            this.attackCounter = 0; // Réinitialise si hors de la saferoom
            this.attackReady = false;
        }

        this.draw();        
    }

   /**
     *  Gère le déplacement de l'animatronic le long de son chemin prédéfini. 
     * - Met à jour l'ancienne pièce en libérant la place occupée par l'animatronic.
     * - Passe à la pièce suivante dans le chemin. Si la pièce suivante est occupée, l'animatronic reste dans la pièce actuelle.
     * - Met à jour la nouvelle pièce en occupant la place de l'animatronic.
     * - Joue un son de déplacement aléatoire pour ajouter de l'ambiance.
     * Note : Cette fonction est appelée à chaque intervalle de mouvement défini par le compteur de mouvement. Elle gère la logique de déplacement de l'animatronic en fonction de son chemin prédéfini et de l'état des pièces.
     */
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

    /**
     *  Met à jour l'agressivité de l'animatronic en fonction du niveau d'IA de la nuit
     * @param {number} value - Niveau d'IA pour cette nuit (0-20)
     */
    setAggression(value) {
        this.resetForNight();
    
        this.night_ia_level = value;
        this.aggression = Math.max(0, Math.min(20, value));
        this.writeMessage(`IA => this.name: ${this.name}, Aggression: ${this.aggression}, Night IA Level: ${this.night_ia_level}`);
    }

    /** 
     * Réinitialise l'animatronic pour une nouvelle nuit
     */
    resetForNight() {
        if(this.name === 'Foxy' && this.foxyInstance){
            this.foxyInstance.reset();
        }
        this.aggression =0;
        this.attackCounter = 0;
        this.attackThreshold = 99;
        this.currentRoomId = this.startRoomId;
        this.currentPathIndex = 0;
        this.moveCounter = 0;
        this.blockedCounter = 0;
        this.attackCounter = 0;
        this.attackReady = false;
        this.nextAttackThreshold();
    }

    /**
     *  Retourne la clé de la pièce (ex: '1a') à partir de l'ID de la pièce
     * @param {number} roomId - ID de la pièce (ex: 1)
     * @return {string|null} Clé de la pièce (ex: '1a') ou null si non trouvée
     */
    getRoomKey(roomId) {
        const room = roomsArray.find(r => r.id === roomId);
        return room ? room.cameraId : null;
    }

    /**
     *  Retourne l'ID de la pièce (ex: 1) à partir de la clé de la pièce
     * @param {string} roomKey - Clé de la pièce (ex: '1a')
     * @return {number|null} ID de la pièce (ex: 1) ou null si non trouvée
     */
    getRoomId(roomKey) {
        const room = roomsArray.find(r => r.cameraId === roomKey);
        return room ? room.id : null;
    }

    /**
     * Retourne la clé de l'animatronic (ex: 'f' pour Freddy)
     * @return {string} Clé de l'animatronic
     * Exemple : 'f' pour Freddy, 'b' pour Bonnie, 'c' pour Chica, 'f' pour Foxy
     */
    getKey() {
        return this.name.charAt(0).toLowerCase();
    }

    /**
     * 
     * Trouve une pièce accessible à partir de la pièce actuelle en vérifiant les connexions et les portes
     * @return {string|null} Clé de la pièce accessible (ex: '1a') ou null si aucune pièce accessible n'est trouvée
     * Note : Cette fonction peut être utilisée pour les animatronics qui ont des chemins dynamiques ou pour ajouter de la variété dans leurs déplacements.
     */
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

    /**
     * Vérifie si l'animatronic est dans la saferoom (ex: pièce 0) et retourne true ou false
     * @return {boolean} true si l'animatronic est dans la saferoom, false sinon
     * Note : La saferoom est une pièce spéciale où les animatronics ne peuvent pas attaquer le joueur. Cette fonction est utilisée pour gérer les attaques et les comportements spécifiques lorsque l'animatronic est dans cette pièce.
     */
    isInSafeRoom() {
        const SAFEROOM_ID = 0; // Exemple : à adapter selon ton code

        return this.currentRoomId === SAFEROOM_ID;
    }

    /**
     * Gère l'attaque de l'animatronic en vérifiant s'il est dans la saferoom et si le seuil d'attaque est atteint. Si une attaque est déclenchée, vérifie si la porte correspondante est fermée pour déterminer si le joueur survit ou subit un Game Over.
     * Note : Cette fonction doit être appelée dans la boucle de jeu pour chaque animatronic afin de vérifier régulièrement les conditions d'attaque et de réagir en conséquence.
     * Si l'attaque est déclenchée et que la porte n'est pas fermée, le joueur subit un Game Over. Si la porte est fermée, l'attaque est annulée et un nouveau seuil d'attaque est généré pour la prochaine tentative.
     * Si l'animatronic n'est pas dans la saferoom, le compteur d'attaque est réinitialisé et l'état d'attaque est remis à false.
     * Si une fonction de jumpscare personnalisée est définie pour l'animatronic, elle est appelée lors de l'attaque. Sinon, une fonction de jumpscare par défaut est utilisée.
     * Exemple d'utilisation :
     * if (bonnie.isInSafeRoom() && !gameEnd) {
     *     bonnie.attack();
     * }    
     */
    attack() {

        if(this.aggression === 0) return; // Si l'agressivité est nulle, ne pas attaquer

        if(this.foxyInstance){
            this.updateFoxy();
        }else{
            if (this.isInSafeRoom() && !gameEnd){
                this.attackCounter++;
                // Log : État actuel de l'animatronic
                 this.writeMessage(`[${this.name}] Attack check - Room: ${this.getRoomKey(this.currentRoomId)}, AttackCounter: ${this.attackCounter}, AttackThreshold: ${this.attackThreshold}, AttackReady: ${this.attackReady}`);

                // Vérifie si l'animatronic est dans la saferoom et pas encore prêt à attaquer
                if (this.isInSafeRoom() && !this.attackReady) {
                     this.writeMessage(`[${this.name}] Dans la saferoom, incrémentation du compteur d'attaque...`);

                    // Si le seuil est atteint, prépare l'attaque
                    if (this.attackCounter >= this.attackThreshold) {
                        this.writeMessage(`[${this.name}] SEUIL ATTEINT ! Prêt à attaquer !`);
                        this.attackReady = true;
                        this.attackCounter = 0;
                    }else{
                        // Déclenche le son "door_pounding" avec une probabilité de 30% 
                        if (Math.random() < 0.3) { // 30% de chance
                            playSound("door_pounding");
                            this.writeMessage(`[${this.name}] Door pounding sound joué !`);
                        }
                    }
                }

                // Si prêt à attaquer
                if (this.attackReady) {
                    this.writeMessage(`[${this.name}] Prêt à attaquer, vérification des portes...`);

                    // Vérifie si la porte correspondante est FERMÉE 
                    if ((this.scareDoor === 'left' && !doors["left"].isClosed) ||
                        (this.scareDoor === 'right' && !doors["right"].isClosed)) {

                        this.transitionJumpScare();

                    } else {
                        this.writeMessage(`[${this.name}] Porte fermée... Annulation de l'attaque.`);
                        this.attackThreshold = this.nextAttackThreshold();   // Nouveau seuil aléatoire
                
                    }
                } else if (!this.isInSafeRoom()) {
                    this.writeMessage(`[${this.name}] Hors de la saferoom, réinitialisation.`);
                    this.attackThreshold = this.nextAttackThreshold();   // Nouveau seuil aléatoire
                }
            }
        }
    }

    /**
     * Transition vers le jumpscare de l'animatronic et fin de la nuit en cas d'attaque réussie. Si l'animatronic attaque avec succès (le joueur n'a pas fermé la porte), le jeu se termine avec un Game Over. Si une fonction de jumpscare personnalisée est définie pour l'animatronic, elle est appelée pour afficher le jumpscare spécifique à cet animatronic. Sinon, une fonction de jumpscare par défaut est utilisée pour afficher un jumpscare générique.
     * Si une fonction de jumpscare personnalisée est définie pour l'animatronic, elle est appelée. Sinon, une fonction de jumpscare par défaut est utilisée.
     */
    transitionJumpScare(){
        gameEnd=true;
        if (this.scareFunction) {
            this.scareFunction(); // Appelle la fonction personnalisée
        } else {
            transitionDefaultJumpScare(); // Fonction par défaut
        }
    }

    /**
     * Met à jour Foxy avec le contexte du jeu
     */
    updateFoxy() {

        // Vérifier si le joueur surveille Pirate Cove via la caméra (Cam 1C)
        const playerCheckedPirateCove = (typeof activeCamera !== 'undefined' && activeCamera === '1c');

        // Vérifier si la porte Est est fermée
        const doorEstClosed = (typeof doors !== 'undefined' && doors.right && doors.right.isClosed) || false;

        // Mettre à jour Foxy
        const foxyAlive = this.foxyInstance.update(playerCheckedPirateCove, doorEstClosed, this.night_ia_level);
        
        displayFoxyStatus();

        if (!foxyAlive && !gameEnd) {
          this.transitionJumpScare();
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
        this.writeMessage("deplacement de "+this.name+" room : "+Room) ;

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
const bonnie 	= new Animatronic('Bonnie'	,'left', 1	, 0, ['1a', '1b', '3', '5', '2a', '2b', 'safe'] , bonnieJumpScare );
const chica 	= new Animatronic('Chica'	,'right', 1	, 0, ['1a', '1b', '7', '6', '4a', '4b', 'safe'] , chicaJumpScare );
const foxy 		= new Animatronic('Foxy'	,'left', 7	, 0,  ['1c'],foxyJumpScare);

const animatronics = [freddy, bonnie, chica, foxy];