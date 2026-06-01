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
                playFoxySound('foxy-retrait', "Foxy se retire dans Pirate Cove...");
            }
            return true; // Pas de Game Over
        }

        // Si le joueur vérifie Pirate Cove, réinitialiser partiellement l'agressivité
        if (playerCheckedPirateCove) {
            this.timeSinceLastCheck = 0;
            this.aggressivity = Math.max(0, this.aggressivity - 30);
            this.writeMessage(`Joueur vérifie Pirate Cove - Agressivité réduite à ${this.aggressivity}`);
        }

        // Logique de transition entre les phases
        if (this.phase === FoxyPhase.INACTIF) {
            // Probabilité de passer à Tête Sortie
            // Dépend de l'agressivité et du temps depuis la dernière vérification
            const transitionChance = (this.aggressivity / 100) * 0.02 * Math.sqrt(this.timeSinceLastCheck / 100);
            
            if (transitionChance > Math.random()) {
                this.phase = FoxyPhase.TETE_SORTIE;
                this.timeInCurrentPhase = 0;
                playFoxySound('foxy-curtain-open', "*Bruit de rideau qui s'ouvre* (Tête de Foxy sortie !)");
                this.writeMessage(`Phase TETE_SORTIE (Agressivité: ${this.aggressivity.toFixed(1)})`);
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
                    playFoxySound('foxy-running', "*Bruit de course rapide* (Foxy court dans le couloir Est !)");
                    this.writeMessage(`Phase COURSE (Agressivité: ${this.aggressivity.toFixed(1)})`);
                }
            }
        } 
        else if (this.phase === FoxyPhase.COURSE) {
            // Si la porte Est est fermée à temps, Foxy se retire
            if (doorEstClosed) {
                this.initiateRetrait();
                this.writeMessage("Foxy a été bloqué par la porte!");
                playFoxySound('foxy-blocked', "*Foxy a été bloqué par la porte!*");
            } else {
                // Game Over si la porte n'est pas fermée
               // playFoxySound('foxy-attack', "*CRASH* (Foxy vous a attrapé !)");
                playFoxySound('pirate_song', "*CRASH* (Foxy vous a attrapé !)");
                this.writeMessage("GAME OVER - Foxy a attaqué!");
                return false; // Game Over
            }
        }

        return true; // Pas de Game Over
    }

    /**
     * Affiche un message de log spécifique à Foxy
     * @param {string} message - Message à afficher
     */
    writeMessage(message) {
        console.log(`[Foxy] ${message}`);
    }

    /**
     * Initie la phase de retrait de Foxy
     */
    initiateRetrait() {
        this.phase = FoxyPhase.RETRAIT;
        this.inCooldown = true;
        this.cooldownTimer = this.cooldownDuration;
        this.timeInCurrentPhase = 0;
        this.writeMessage(`Phase RETRAIT - Cooldown: ${this.cooldownTimer} ticks`);
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
        this.writeMessage("Réinitialisé pour une nouvelle nuit");
    }
}
