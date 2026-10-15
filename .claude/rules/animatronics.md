---
paths:
  - "script/mechanics/animatronic.js"
  - "script/mechanics/foxy.js"
  - "script/mechanics/night.js"
  - "script/mechanics/door.js"
  - "script/mechanics/power.js"
  - "script/state/game_config.json"
---

# Animatronics et mécaniques de base

- Le jeu de base reproduit FNAF 1 : déplacements, attaques, sons de déplacement, énergie, appels. Comparer au jeu d'origine plutôt qu'inventer. En cas de doute sur le comportement original, déléguer à l'agent `auditeur-fnaf1`.
- Un niveau d'IA à 0 (`nightAiLevels` dans `game_config.json`, appliqué par `setAggression()`) signifie que l'animatronic ne bouge ni n'attaque de la nuit. Toute méthode liée à l'agressivité commence par `if (this.aggression === 0) return;`, comme `move()` et `attack()`. La formule `moveInterval = 20 - aggression * 2` donne 20 à 0 et ne suffit pas à bloquer.
- Foxy est une machine à états (`FoxyPhase` dans `foxy.js`). Les seuils et phases sont documentés dans `.github/Projet/01 - Game Design/Foxy/`.
- Le contenu original (événements cachés, cassettes, terminal, ligne Cassidy) n'est pas soumis à cette contrainte de fidélité.
