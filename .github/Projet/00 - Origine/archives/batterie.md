Dans Five Nights at Freddy's, le système de batterie réel est plus complexe qu’une simple soustraction fixe.

Le jeu utilise un système appelé “Power Usage” (consommation d’énergie).
Chaque appareil actif ajoute un niveau de consommation.

Les niveaux de consommation réels

Le jeu affiche :

Usage: [ ]
Usage: [I]
Usage: [II]
Usage: [III]
Usage: [IIII]
Usage: [IIIII]

Chaque barre représente un coût supplémentaire.

Consommation des équipements
Consommation de base

Même sans rien faire :

1 barre

Le bureau consomme déjà de l’énergie.

Équipements
Action	Usage ajouté
Porte gauche fermée	+1
Porte droite fermée	+1
Lumière gauche	+1
Lumière droite	+1
Caméra ouverte	+1

Donc :

Rien actif → Usage I
Caméra + une porte → Usage III
Deux portes + caméra + lumières → Usage max
Le vrai fonctionnement interne

Le jeu NE retire PAS :

energie -= usage

directement.

À la place :

chaque niveau de “Usage” possède une vitesse de drain différente
le jeu utilise des ticks temporels
la batterie descend selon une table de consommation
Table approximative réelle de FNAF1

Les fans ont extrait des valeurs proches du jeu original :

Usage	Temps pour vider 100%
1	~9 minutes
2	~6 minutes
3	~4.5 minutes
4	~3 minutes
5	~2 minutes

C’est donc NON linéaire.

Le jeu accélère énormément quand plusieurs systèmes sont actifs.

Exemple JavaScript proche du vrai système
class PowerSystem {
    constructor() {
        this.power = 100;

        this.leftDoor = false;
        this.rightDoor = false;
        this.leftLight = false;
        this.rightLight = false;
        this.cameraUp = false;
    }

    getUsage() {
        let usage = 1;

        if (this.leftDoor) usage++;
        if (this.rightDoor) usage++;
        if (this.leftLight) usage++;
        if (this.rightLight) usage++;
        if (this.cameraUp) usage++;

        return Math.min(usage, 5);
    }

    update(deltaTime) {
        const usage = this.getUsage();

        // drain réel approximatif
        const drainRates = {
            1: 0.18,
            2: 0.27,
            3: 0.40,
            4: 0.65,
            5: 0.90
        };

        this.power -= drainRates[usage] * deltaTime;

        if (this.power < 0) {
            this.power = 0;
        }

        console.log(
            `Power: ${this.power.toFixed(2)}% | Usage: ${usage}`
        );

        if (this.power === 0) {
            this.powerOutage();
        }
    }

    powerOutage() {
        console.log("POWER OUT");

        // désactivation automatique
        this.leftDoor = false;
        this.rightDoor = false;
        this.leftLight = false;
        this.rightLight = false;
        this.cameraUp = false;
    }
}
Ce qui rend FNAF stressant

Le système est conçu pour :

punir les portes fermées longtemps
empêcher l’utilisation constante des caméras
forcer le joueur à gérer son énergie

Par exemple :

fermer les deux portes trop tôt = mort garantie
spam les lumières = énorme perte
garder la caméra ouverte = drain permanent