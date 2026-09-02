# Résumé de l'Intégration du Mécanisme de Foxy

## Fichiers Créés/Modifiés

### 1. ✅ Créé: `script/foxy.js`
**Contenu**: Système complet de gestion de Foxy avec:
- Classe `Foxy` avec gestion des phases
- Énumération `FoxyPhase`
- Classe `Player` pour les actions du joueur
- Fonctions globales: `initializeFoxy()`, `updateFoxy()`, `displayFoxyStatus()`, `resetFoxyForNewNight()`
- Gestion des sons avec cache pour éviter les répétitions

**Phases implémentées**:
1. **INACTIF**: Foxy dans Pirate Cove, inactif
2. **TETE_SORTIE**: Tête sortie, menace moyenne
3. **COURSE**: En attaque dans le couloir Est
4. **RETRAIT**: Retour à Pirate Cove (cooldown)

### 2. ✅ Modifié: `index.html`
**Modifications**:
- Ajout des sons Foxy (5 nouveaux sons audio)
- Import du script `foxy.js` dans l'ordre correct
- Correction de la typo: `</did>` → `</div>`
- Ajout du canvas et powerUsage (éléments manquants)
- Ajout du div d'affichage du statut Foxy
- Ajout de 7 boutons de debug Foxy avec styles colorés

### 3. ✅ Modifié: `script/main.js`
**Modifications**:
- Ajout de 7 écouteurs d'événements pour les boutons Foxy
- Implémentation de 7 fonctions de debug:
  - `debugFoxyPhase1()`: Force Phase 1 (Inactif)
  - `debugFoxyPhase2()`: Force Phase 2 (Tête Sortie)
  - `debugFoxyPhase3()`: Force Phase 3 (Course)
  - `debugFoxyCheckCove()`: Simule vérification de Pirate Cove
  - `debugFoxyCloseDoor()`: Ferme la porte Est
  - `debugFoxyOpenDoor()`: Ouvre la porte Est
  - `debugFoxyReset()`: Réinitialise Foxy

### 4. ✅ Modifié: `script/game.js`
**Modifications**:
- `startNight()`: Ajout initialisation de Foxy
- `gameLoop()`: Ajout mise à jour de Foxy et affichage du statut
- Gestion du Game Over si Foxy tue le joueur

## Architecture d'Intégration

```
Boucle de Jeu (gameLoop)
│
├─ updateFoxy(aiLevel) 
│  └─ foxyInstance.update(playerCheckedPirateCove, doorEstClosed, aiLevel)
│     ├─ Transitions de phase basées sur:
│     │  ├─ Temps depuis dernière vérification
│     │  ├─ Agressivité (0-100%)
│     │  ├─ État de la porte Est
│     │  └─ Niveau d'IA de la nuit
│     └─ Retourne: foxyAlive (boolean)
│
├─ displayFoxyStatus()
│  └─ Met à jour le div #foxy-status avec:
│     ├─ Phase actuelle (avec couleur)
│     ├─ Agressivité
│     └─ Temps depuis dernier scan
│
└─ Game Over si foxyAlive === false
```

## Variables Globales Utilisées

```javascript
foxyInstance       // Instance de la classe Foxy
activeCamera       // Caméra actuelle ('1a', '1b', '1c', etc.)
doors              // Objet contenant l'état des portes (doors.right.isClosed)
night              // Nuit actuelle
gameEnd            // Flag indiquant la fin du jeu
```

## Sons Intégrés

| ID | Son | Utilisation |
|----|----|-------------|
| `foxy-curtain-open` | DOOR_POUNDING | Phase 1→2 (rideau qui s'ouvre) |
| `foxy-running` | running fast3 | Phase 2→3 (course rapide) |
| `foxy-blocked` | door-sound | Phase 3→4 (bloqué par porte) |
| `foxy-attack` | XSCREAM | Game Over (attaque) |
| `foxy-retrait` | door-sound | Phase 4→1 (retrait) |

## Niveaux d'IA par Nuit

Le niveau d'IA (`nightAiLevels[nuit].foxy` dans `script/state/game_config.json`) va de 0 à 5, un cran par nuit. Chaque niveau a son propre réglage dans `FOXY_LEVEL_TUNING` (`script/mechanics/foxy.js`) : vitesse d'accumulation de l'agressivité et temps minimum passé dans chaque phase avant de pouvoir passer à la suivante. Ces réglages ont été calibrés par simulation (5000 nuits simulées par niveau) pour que Foxy atteigne sa première course environ au temps ci-dessous après le début de la nuit :

| Nuit | IA (`foxy`) | Temps moyen avant la 1ère course |
| --- | --- | --- |
| 1 | 0 | Foxy inactif (aucune course possible) |
| 2 | 1 | ~6 min |
| 3 | 2 | ~5 min |
| 4 | 3 | ~4 min |
| 5 | 4 | ~3 min |
| 6 | 5 | ~2 min |

**Bug corrigé (2026-09)** : `Foxy.reset()` remettait `aggressivity` à `150`, une valeur qui se plafonnait immédiatement à `100` (le maximum) dès le premier tick de la nuit — Foxy démarrait donc chaque nuit à son agressivité maximale, quel que soit le niveau d'IA configuré. Nuit 1 et nuit 6 se comportaient de façon quasi identique. `reset()` remet maintenant `aggressivity` à `0`, et c'est la progression définie dans `FOXY_LEVEL_TUNING` qui fait la différence entre les nuits.

## Points d'Entrée pour Déboguer

1. **Console du navigateur (F12)**:
   ```javascript
   // Afficher l'état de Foxy
   foxyInstance.getStatus()
   
   // Forcer une phase
   foxyInstance.phase = FoxyPhase.TETE_SORTIE
   
   // Afficher le descriptif
   foxyInstance.getPhaseDescription()
   ```

2. **Boutons dans l'interface**:
   - 7 boutons colorés en bas de l'écran
   - Chaque bouton test une action spécifique

3. **Affichage du statut**:
   - Coin supérieur droit de l'écran
   - Mise à jour en temps réel
   - Code couleur par phase

## Formules et Probabilités

Le mécanisme a 4 phases actives (`INACTIF → TETE_SORTIE → PRET_A_SORTIR → COURSE`), chacune avec sa propre chance de transition par tick. `tuning` désigne l'entrée de `FOXY_LEVEL_TUNING` correspondant au niveau d'IA de la nuit (cf. section précédente).

### Transition INACTIF → TETE_SORTIE

```javascript
const transitionChance = (aggressivity / 100) * 0.2 * sqrt(timeSinceLastCheck / 100)
```

- Augmente avec l'agressivité
- Augmente avec le temps depuis la dernière vérification de Pirate Cove
- Basée sur probabilité aléatoire

### Transition TETE_SORTIE → PRET_A_SORTIR

```javascript
const prepChance = (aggressivity / 100) * 0.08
// Après un minimum de tuning.minTeteSortieTicks ticks dans cette phase
```

### Transition PRET_A_SORTIR → COURSE

```javascript
const runChance = (aggressivity / 100) * 0.12
// Après un minimum de tuning.minPretASortirTicks ticks dans cette phase
```

### Augmentation d'Agressivité

```javascript
aggressivity += tuning.aggressivityGain // Par tick, plafonné à 100
```

`tuning.aggressivityGain` et les deux minimums de phase ci-dessus viennent de `FOXY_LEVEL_TUNING` (`script/mechanics/foxy.js`) — c'est ce tableau qui contrôle la vitesse à laquelle Foxy devient dangereux, nuit après nuit.

### Réduction d'Agressivité
- Vérification de Pirate Cove: -30%
- Cooldown après retrait: -1.5% par tick

## Dépannage

### Erreurs Courantes

**Erreur**: "foxyInstance is not defined"
- Solution: `initializeFoxy()` n'a pas été appelé
- Vérifier que `startNight()` initialise Foxy

**Erreur**: "doors is not defined"
- Solution: door.js n'est pas chargé avant foxy.js
- Vérifier l'ordre des imports

**Erreur**: "activeCamera is not defined"
- Solution: game.js n'est pas chargé
- Vérifier l'ordre des imports

## Tests Recommandés

1. **Phase 1 → 2**: 
   - Laisser passer du temps sans vérifier
   - Observer la transition après augmentation d'agressivité

2. **Phase 2 Blocking**:
   - Forcer Phase 2
   - Fermer la porte
   - Vérifier que Foxy revient à Phase 1

3. **Phase 3 Attack**:
   - Forcer Phase 3
   - Vérifier qu'il y a Game Over
   - Tester la fermeture de porte à temps

4. **Vérification Pirate Cove**:
   - Vérifier que l'agressivité diminue
   - Vérifier que le compteur de temps remet à zéro

5. **Niveaux d'IA**:
   - Tester chaque nuit (1-6)
   - Vérifier que Foxy s'active plus vite aux nuits supérieures

## Améliorations Futures Possibles

1. **Visuels**:
   - Animer Foxy dans la caméra 1B
   - Afficher différents états dans Pirate Cove (1C)
   - Animation de course dans le couloir

2. **Son**:
   - Grattements occasionnels quand agressivité > 50%
   - Respiration quand en Phase 2
   - Bruits de course en Phase 3

3. **Gameplay**:
   - Brutaliser les portes (dommages visuels)
   - Alarmes de porte qui clignotent en Phase 3
   - Notifications de statut Foxy en UI principale

4. **Stats**:
   - Tracker les tentatives d'attaque par nuit
   - Tracker les blocages réussis
   - Statistiques pour chaque nuit

## Fichier de Configuration Potentiel

Pour faire Foxy plus customizable, créer un `config/foxy-config.js`:
```javascript
const FOXY_CONFIG = {
    aggressivityGain: 0.3,
    checkCovePenalty: 30,
    cooldownDuration: 60,
    phase2MinTicks: 20,
    transitionBaseChance: 0.02,
    runBaseChance: 0.08,
    sounds: {
        curtainOpen: 'foxy-curtain-open',
        running: 'foxy-running',
        // ...
    }
};
```

---

