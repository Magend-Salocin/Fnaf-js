// foxy.js - Mécanisme complet de Foxy pour FNAF 1

/**
 * Énumération pour les phases de Foxy
 * INACTIF: Foxy est dans Pirate Cove, inactif
 * TETE_SORTIE: Foxy sort partiellement la tête
 * PRET_A_SORTIR: Foxy est prêt à sortir (phase de tension)
 * COURSE: Foxy court dans le couloir Est (Cam 1B)
 * RETRAIT: Foxy se retire (en cooldown)
 */
const FoxyPhase = {
    INACTIF: "INACTIF",
    TETE_SORTIE: "TETE_SORTIE",
    PRET_A_SORTIR: "PRET_A_SORTIR",
    COURSE: "COURSE",
    RETRAIT: "RETRAIT"
};

/**
 * Classe Foxy - Gestion du comportement et des phases de Foxy
 */
class Foxy {
    constructor() {
        this.phase = FoxyPhase.INACTIF;
        this.timeSinceLastCheck = 0;      // Temps écoulé depuis la dernière vérification de Pirate Cove
        this.aggressivity = 0;            // Niveau d'agressivité (0-100)
        this.inCooldown = false;          // En cooldown après une attaque ratée
        this.cooldownTimer = 0;           // Compteur du cooldown
        this.cooldownDuration = 60;       // Durée du cooldown en ticks
        this.timeInCurrentPhase = 0;      // Temps passé dans la phase actuelle
        this.lastPhaseTransitionTime = 0; // Temps de la dernière transition de phase
        this.soundsPlayed = {};           // Historique des sons joués pour éviter les répétitions
    }

    /**
     * Met à jour l'état de Foxy en fonction des actions du joueur et du temps
     * @param {boolean} playerCheckedPirateCove - Le joueur a-t-il vérifié Pirate Cove ce tick?
     * @param {boolean} doorEstClosed - La porte Est est-elle fermée?
     * @param {number} aiLevel - Niveau d'IA pour cette nuit (0-20)
     * @returns {boolean} true si le joueur survit, false si Game Over
     */
    update(playerCheckedPirateCove, doorEstClosed, aiLevel = 0) {
        this.timeSinceLastCheck += 1;
        this.timeInCurrentPhase += 1;

        // Augmentation de l'agressivité basée sur le niveau d'IA et le temps
        const aggressivityGain = 0.3 + (aiLevel * 0.05);
        this.aggressivity = Math.min(100, this.aggressivity + aggressivityGain);

        // Gestion du cooldown
        if (this.inCooldown) {
            this.cooldownTimer -= 1;
            this.aggressivity = Math.max(0, this.aggressivity - 1.5);
            
            if (this.cooldownTimer <= 0) {
                this.inCooldown = false;
                this.phase = FoxyPhase.INACTIF;
                this.timeInCurrentPhase = 0;
                this.playSound('foxy-retrait', "Foxy se retire dans Pirate Cove...");
            }
            return true; // Pas de Game Over
        }

        // Si le joueur vérifie Pirate Cove, réinitialiser partiellement l'agressivité
        if (playerCheckedPirateCove) {
            this.timeSinceLastCheck = 0;
            this.aggressivity = Math.max(0, this.aggressivity - 30);
            console.log("[Foxy] Joueur vérifie Pirate Cove - Agressivité réduite à", this.aggressivity);
        }

        // Logique de transition entre les phases
        if (this.phase === FoxyPhase.INACTIF) {
            // Probabilité de passer à Tête Sortie
            // Dépend de l'agressivité et du temps depuis la dernière vérification
            const transitionChance = (this.aggressivity / 100) * 0.02 * Math.sqrt(this.timeSinceLastCheck / 100);
            
            if (transitionChance > Math.random()) {
                this.phase = FoxyPhase.TETE_SORTIE;
                this.timeInCurrentPhase = 0;
                this.playSound('foxy-curtain-open', "*Bruit de rideau qui s'ouvre* (Tête de Foxy sortie !)");
                console.log(`[Foxy] Phase TETE_SORTIE (Agressivité: ${this.aggressivity.toFixed(1)})`);
            }
        } 
        else if (this.phase === FoxyPhase.TETE_SORTIE) {
            // Si la porte Est est fermée, Foxy se retire
            if (doorEstClosed) {
                this.initiateRetrait();
            }
            // Sinon, il peut passer en phase de course
            else if (this.timeInCurrentPhase > 20) { // Minimum 20 ticks avant de passer à la course
                const runChance = (this.aggressivity / 100) * 0.08;
                if (runChance > Math.random()) {
                    this.phase = FoxyPhase.COURSE;
                    this.timeInCurrentPhase = 0;
                    this.playSound('foxy-running', "*Bruit de course rapide* (Foxy court dans le couloir Est !)");
                    console.log(`[Foxy] Phase COURSE (Agressivité: ${this.aggressivity.toFixed(1)})`);
                }
            }
        } 
        else if (this.phase === FoxyPhase.COURSE) {
            // Si la porte Est est fermée à temps, Foxy se retire
            if (doorEstClosed) {
                this.initiateRetrait();
                console.log("[Foxy] Foxy a été bloqué par la porte!");
                this.playSound('foxy-blocked', "*Foxy a été bloqué par la porte!*");
            } else {
                // Game Over si la porte n'est pas fermée
               // this.playSound('foxy-attack', "*CRASH* (Foxy vous a attrapé !)");
               this.playSound('pirate_song', "*CRASH* (Foxy vous a attrapé !)");
                console.log("[Foxy] GAME OVER - Foxy a attaqué!");
                return false; // Game Over
            }
        }

        return true; // Pas de Game Over
    }

    /**
     * Initie la phase de retrait de Foxy
     */
    initiateRetrait() {
        this.phase = FoxyPhase.RETRAIT;
        this.inCooldown = true;
        this.cooldownTimer = this.cooldownDuration;
        this.timeInCurrentPhase = 0;
        console.log(`[Foxy] Phase RETRAIT - Cooldown: ${this.cooldownTimer} ticks`);
    }

    /**
     * Joue un son de Foxy (avec limitation pour éviter les répétitions)
     * @param {string} soundId - ID du son à jouer
     * @param {string} message - Message de log
     */
    playSound(soundId, message) {
        // Éviter les répétitions trop rapides du même son
        if (this.soundsPlayed[soundId] && Date.now() - this.soundsPlayed[soundId] < 1000) {
            return;
        }
        
        this.soundsPlayed[soundId] = Date.now();
        console.log(`[Foxy] ${message}`);
        
        // Jouer le son si disponible
        const audioElement = document.querySelector(`.${soundId}`);
        if (audioElement) {
            audioElement.currentTime = 0;
            audioElement.play().catch(err => console.log("Son non disponible:", soundId));
        }
    }

    /**
     * Obtient le statut actuel de Foxy
     * @returns {object} Objet contenant les informations de statut
     */
    getStatus() {
        return {
            phase: this.phase,
            aggressivity: Math.round(this.aggressivity),
            timeSinceLastCheck: this.timeSinceLastCheck,
            inCooldown: this.inCooldown,
            cooldownTimer: this.cooldownTimer,
            timeInCurrentPhase: this.timeInCurrentPhase
        };
    }

    /**
     * Retourne une description texte de la phase actuelle
     */
    getPhaseDescription() {
        switch(this.phase) {
            case FoxyPhase.INACTIF:
                return "Inactif dans Pirate Cove";
            case FoxyPhase.TETE_SORTIE:
                return "Tête sortie (Surveillance requise!)";
            case FoxyPhase.COURSE:
                return "EN COURSE! (FERME LA PORTE!)";
            case FoxyPhase.RETRAIT:
                return "Retrait en cooldown...";
            default:
                return "État inconnu";
        }
    }

    /**
     * Réinitialise Foxy pour une nouvelle nuit
     */
    reset() {
        this.phase = FoxyPhase.INACTIF;
        this.timeSinceLastCheck = 0;
        this.aggressivity = 0;
        this.inCooldown = false;
        this.cooldownTimer = 0;
        this.timeInCurrentPhase = 0;
        this.soundsPlayed = {};
        console.log("[Foxy] Réinitialisé pour une nouvelle nuit");
    }
}

/**
 * Classe Player - Gestion des actions du joueur avec Foxy
 */
class Player {
    constructor() {
        this.doorEstClosed = false;
        this.checkingPirateCove = false;
    }

    /**
     * Le joueur vérifie Pirate Cove via la caméra
     */
    checkPirateCove() {
        this.checkingPirateCove = true;
        console.log("[Joueur] Vérifie Pirate Cove...");
        return this.checkingPirateCove;
    }

    /**
     * Le joueur ferme la porte Est
     */
    closeDoorEst() {
        this.doorEstClosed = true;
        console.log("[Joueur] Ferme la porte Est.");
    }

    /**
     * Le joueur ouvre la porte Est
     */
    openDoorEst() {
        this.doorEstClosed = false;
        console.log("[Joueur] Ouvre la porte Est.");
    }

    /**
     * Réinitialise l'état de la vérification de Pirate Cove
     */
    resetCheck() {
        this.checkingPirateCove = false;
    }
}

// Création d'une instance globale de Foxy
let foxyInstance = null;

/**
 * Initialise Foxy au démarrage du jeu
 */
function initializeFoxy() {
    if (!foxyInstance) {
        foxyInstance = new Foxy();
        console.log("[Foxy] Foxy initialisé");
    }
    return foxyInstance;
}

/**
 * Met à jour Foxy avec le contexte du jeu
 */
function updateFoxy(aiLevel = 0) {
    if (!foxyInstance) {
        foxyInstance = initializeFoxy();
    }

    // Vérifier si le joueur surveille Pirate Cove via la caméra (Cam 1C)
    const playerCheckedPirateCove = (typeof activeCamera !== 'undefined' && activeCamera === '1c');

    // Vérifier si la porte Est est fermée
    const doorEstClosed = (typeof doors !== 'undefined' && doors.right && doors.right.isClosed) || false;

    // Mettre à jour Foxy
    const foxyAlive = foxyInstance.update(playerCheckedPirateCove, doorEstClosed, aiLevel);
    
    return foxyAlive;
}

/**
 * Affiche le statut de Foxy dans l'interface
 */
function displayFoxyStatus() {
    if (!foxyInstance) return;

    const status = foxyInstance.getStatus();
    const statusDiv = document.getElementById('foxy-status');
    
    if (statusDiv) {
        const phaseColor = {
            'INACTIF': '#00ff00',
            'TETE_SORTIE': '#ffff00',
            'COURSE': '#ff0000',
            'RETRAIT': '#0088ff'
        };

        const color = phaseColor[status.phase] || '#ffffff';

        statusDiv.innerHTML = `
            <div style="color: ${color}; font-weight: bold;">
                FOXY: ${foxyInstance.getPhaseDescription()}
                <br/>Agressivité: ${status.aggressivity}%
                <br/>Dernier scan: ${status.timeSinceLastCheck}s
            </div>
        `;
        
        // Afficher le div pendant le jeu
        if (!statusDiv.style.display || statusDiv.style.display === 'none') {
            statusDiv.style.display = 'block';
        }
    }
}

/**
 * Réinitialise Foxy pour une nouvelle nuit
 */
function resetFoxyForNewNight() {
    if (foxyInstance) {
        foxyInstance.reset();
    }
}
