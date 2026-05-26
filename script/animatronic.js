class Animatronic {
	// Dans la classe Animatronic
	constructor(name, startRoomId, aggression) {
	  this.name = name;
	  this.currentRoomId = startRoomId;
	  this.startRoomId = startRoomId;
	  this.aggression = aggression;
	  this.moveCounter = 0;
	  this.blockedCounter = 0; // Compteur de blocage
	}

	move() {
	  this.moveCounter++;
	  const moveInterval = 60 - this.aggression * 2;
	  if (this.moveCounter < moveInterval) return;
	  this.moveCounter = 0;

	  const currentRoom = rooms.find(room => room.id === this.currentRoomId);
	  if (currentRoom && !currentRoom.isOffice) {
		// Filtrer les connexions accessibles (portes ouvertes uniquement)
		const possibleConnections = currentRoom.connectedTo.filter(connection => {
		  if (connection.doorId === null) return true; // Pas de porte = accessible

		  const door = doors.find(d => d.id === connection.doorId);
		  return door && !door.isClosed; // Porte existe et est ouverte
		});

// Dans la méthode move
		if (possibleConnections.length === 0) {
		  this.blockedCounter++;
		  if (this.blockedCounter > 120) { // Après 2 secondes (120 frames à 60 FPS)
			this.currentRoomId = this.startRoomId;
			this.blockedCounter = 0;
		  }
		} else {
		  this.blockedCounter = 0; // Réinitialise si non bloqué
		}
		if (possibleConnections.length > 0) {
		  // Choisir une salle accessible aléatoirement
		  const randomConnection = possibleConnections[Math.floor(Math.random() * possibleConnections.length)];
		  this.currentRoomId = randomConnection.roomId;
		}
		// Si aucune connexion accessible, reste dans la salle actuelle
	  } else if (currentRoom && currentRoom.isOffice) {
		// Game Over uniquement si l'animatronic est dans le bureau
		document.getElementById('gameOver').style.display = 'block';
		clearInterval(gameLoopInterval);
		}
		
		
	}

  draw(ctx) {
    const currentRoom = rooms.find(room => room.id === this.currentRoomId);
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
const freddy = new Animatronic('Freddy', 3, 5);
const bonnie = new Animatronic('Bonnie', 1, 7);
const chica = new Animatronic('Chica', 4, 6);
const foxy = new Animatronic('Foxy', 6, 9);

const animatronics = [freddy, bonnie, chica, foxy];
