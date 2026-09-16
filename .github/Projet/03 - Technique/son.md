# Son

Référence de l'audio du jeu, en deux parties :

1. Ce que le jeu fait aujourd'hui : quels sons tournent en fond, lesquels se
   déclenchent sur un événement, à quelles conditions.
2. Le rôle de référence de chaque son dans FNAF 1, qui sert de cible quand un
   son est à brancher ou à rééquilibrer.

Fichiers concernés :

- `script/config/game_sounds.json` : le catalogue, 106 entrées.
- `script/core/sounds.js` : le moteur de lecture et le mixer.
- `index.html` : les balises `<audio>`, une par entrée du catalogue.

## 1. Chaîne de lecture

Chaque entrée du catalogue associe un `id` logique à un `selector` CSS qui
pointe vers une balise `<audio>` de `index.html`. Le code n'utilise jamais que
l'`id`. La correspondance entre les deux n'est pas mécanique : `power_out`
pointe sur `.powerout-sound`, `buzz_fan` sur `.Buzz-fan`. Il faut la lire dans
le catalogue, ne pas la déduire.

Deux fonctions de lecture :

- `playSound(id)` joue le son une fois, en le coupant s'il était déjà en cours.
- `playSoundLoop(id)` le joue en continu, avec un fondu croisé entre deux
  copies de l'élément audio. La boucle native de `<audio>` redémarre le fichier
  net, ce qui s'entend sur les ambiances longues qui finissent en fondu.

Volume final d'un son :

```
globalVolume × volumeDuGroupe × mixVolume × dynamicGain
```

- `globalVolume` : réglage joueur, 0.4 par défaut.
- `volumeDuGroupe` : `voice`, `ambient`, `metallic` ou `abnormal`, tous à 1 par
  défaut. Le groupe est déduit de la `category` du son par
  `getAudioGroupForSound()`.
- `mixVolume` : équilibre entre les sons, calé sur le tableau de référence
  FNAF 1. C'est le seul niveau à toucher pour corriger un mixage.
- `dynamicGain` : piloté par le jeu, vaut 1 pour tout son que le jeu ne module
  pas. Seuls `ambience1` et `buzz_fan` l'utilisent.

## 2. Ce qui tourne en fond pendant une nuit

`startNight()` appelle `stopAllSounds()` puis `startAmbientSounds()`, qui lance
trois boucles pour toute la nuit :

| Son | Rôle | mixVolume |
|-----|------|-----------|
| `buzz_fan` | Ventilateur du bureau, volume dérivé en permanence | 0.15 |
| `cold_presc` | Ambiance de fond de la nuit, sous le ventilateur | 0.95 |
| `ambience1` | Nappe de menace, gain piloté par la position des animatronics | 1 |

Deux boucles s'ajoutent selon l'état du bureau :

| Son | Démarre | S'arrête |
|-----|---------|----------|
| `camera_static` | Tablette levée (`showCloseCamera`) | Tablette baissée |
| `light_on` | Bouton lumière maintenu | Bouton relâché, ou panne de courant |

Hors partie :

| Son | Contexte |
|-----|----------|
| `menu_start` | Écran d'accueil, en boucle (`startMenuSounds`, appelé par `language.js`) |
| `menu_start2` | Écran des journaux de fin de nuit, en boucle (`JournalViewer`) |

## 3. Sons modulés en continu

### Nappe de menace (`ambience1`)

`updateThreatAmbience()` tourne à chaque frame. Le gain cible dépend du nombre
d'animatronics en position d'attaque, renvoyé par `getOfficeThreatState()` :
Bonnie, Chica ou Freddy dans la safe room, Foxy en phase `PRET_A_SORTIR` ou
`COURSE`.

| Menaces | Gain |
|---------|------|
| 0 | 0 |
| 1 | 0.30 |
| 2 | 0.50 |
| 3 | 0.75 |
| 4 et plus | 1 |

Freddy devant le bureau force le gain à 1, quel que soit le compte. La
transition entre deux paliers se fait à 0.5 de gain par seconde, donc sans
palier audible. `resetThreatAmbience()` remet à 0 au début de chaque nuit.

### Dérive du ventilateur (`buzz_fan`)

`updateFanFlutter()` tourne à chaque frame et fait osciller le niveau visé
entre 0.02 et 0.06 (échelle des `mixVolume`). Deux sinusoïdes de périodes 7 s
et 11 s se superposent : leur somme ne se répète qu'au bout de 77 s, donc la
dérive ne s'entend pas comme un cycle. Le but est d'empêcher l'oreille de
gommer une boucle rigoureusement constante.

### Son d'ambiance rare (`circus`)

Tiré une fois par minute de jeu, 0.1 % de chance, une seule fois par nuit. Une
nuit dure 360 minutes de jeu, ce qui donne environ une nuit sur trois.
`resetRareAmbientSound()` réarme le tirage au début de chaque nuit.

## 4. Déclenchements ponctuels

### Caméras

| Action | Son |
|--------|-----|
| Lever la tablette | `camera_toggle` |
| Baisser la tablette | `camera_put_down` |
| Changer de caméra | `camera_cycle` |

`CameraPlaysound()` joue en plus un son d'ambiance sur la pièce observée, mais
seulement quand l'identifiant de caméra change réellement. Ordre de priorité :

1. Cuisine avec un animatronic présent : un son parmi `kitchen_b`,
   `kitchen_c`, `kitchen_f`, `kitchen_drawer`. Toujours joué, sans tirage.
2. Pirate Cove tant que Foxy n'a pas commencé sa course : `pirate_song`,
   20 % de chance. Le joueur surveille cette caméra en permanence, la jouer à
   chaque coup d'œil userait le son.
3. Sinon, 20 % de chance :
   - animatronic présent : `breath_1` à `breath_4`, `whispering`,
     `robot_voice`, `garble_1` à `garble_3`
   - pièce vide : `laugh_girl1`, `laugh_girl1d`, `laugh_girl2d`, `laugh_girl8d`

Le seuil de 20 % est `CAMERA_DEBUG_CONSTANTS.EMPTY_ROOM_SOUND_CHANCE`
(`camera.js`).

### Portes et lumières

| Action | Son |
|--------|-----|
| Ouvrir ou fermer une porte | `door_sound` |
| Porte ou lumière actionnée sans courant | `door_light_disabled` |
| Allumer la lumière sur un animatronic présent derrière la vitre | `window_scare` |

### Animatronics

| Situation | Son |
|-----------|-----|
| Déplacement de Bonnie ou Chica | `move_sound` (3 chances sur 6), `run_sound` (2/6), `run_fast` (1/6) |
| Déplacement de Freddy | `laugh_girl1`, `laugh_girl1d`, `laugh_girl2d` ou `laugh_girl8d` |
| Attente derrière la porte, avant le seuil d'attaque | `knock`, 30 % de chance par tour |

Freddy se déplace sans bruit de pas : son rire est le seul indice sonore de sa
progression, comme dans le jeu d'origine.

### Foxy

| Phase | Son |
|-------|-----|
| Passage en `TETE_SORTIE` | `foxy-curtain-open` |
| Passage en `PRET_A_SORTIR` | `foxy-curtain-open` |
| Passage en `COURSE` | `foxy-running` |
| Course bloquée par la porte Est | `foxy-blocked` |
| Retour dans Pirate Cove après cooldown | aucun, volontairement |
| Attaque réussie | `foxy-attack`, joué par `foxyJumpScare()` |

### Fin de nuit et game over

Victoire à 6 AM (`transitionEndNight`) :

| Délai | Son |
|-------|-----|
| 0 s | `win_sound` |
| 3 s | `win_cheer` |
| 5 s | `menu_start2` en boucle, écran des journaux |

Jumpscare d'un animatronic (`animatronicJumpScare`) :

| Délai | Son |
|-------|-----|
| 2 s | `scare_1`, ou `foxy-attack` pour Foxy |
| 4 s | `gameover_static2` |

Panne de courant (`transitionEndNightFreddy`) :

| Délai | Son |
|-------|-----|
| 0 s | `power_out` |
| 14 s | `power_jingle` |
| 32 s | arrêt de `power_jingle` |
| 34 s | `scare_1` |
| 35,3 s | `gameover_static` |

Tous les animatronics partagent le même cri `scare_1` (XSCREAM), conformément à
FNAF 1.

### Appel téléphonique

`playPhoneCall()` construit l'identifiant `call_${numéroDeNuit}` et le joue au
démarrage de la nuit. La durée est codée en dur par nuit dans
`getPhoneCallDuration()` : 206 s, 103 s, 75 s, 65 s, 37 s. Le téléphone du
bureau (`hangupPhoneFromPanel`) permet de raccrocher avant la fin.

### Terminal

Les sons du terminal sont déclarés dans une seule table, `TERMINAL_CUES`
(`script/lore/retro_terminal.js`). Chaque entrée porte la durée de l'extrait
joué et un drapeau `owned` qui dit si le son appartient au terminal.

| Contexte | Son | `owned` |
|----------|-----|---------|
| Ouverture du terminal | `terminal-start`, 2,6 s | oui |
| Frappe au clavier | `terminal-keyboard-typing`, 150 ms | oui |
| Glitch du terminal | `terminal-glitch`, 420 ms | oui |
| Parasite idle | `terminal-static`, 520 ms | oui |
| Ouverture / fermeture d'une fenêtre | `camera_toggle`, 500 ms | non |

Les clips du catalogue sont des ambiances longues, 8 s pour la frappe, 27 s
pour le démarrage, 34 s pour le parasite. `TerminalAudio` n'en joue qu'un
extrait de la durée de l'effet visuel, sinon ils se superposeraient et
continueraient après la fermeture de la fenêtre.

`TerminalAudio.stopAll()` coupe les sons marqués `owned`. Il est appelé sur les
trois chemins de fermeture : la fenêtre principale, la `rootSequence` et la
`endOfNightGlitch`. Un extrait entamé juste avant la fermeture est donc coupé
au lieu de continuer dans le bureau.

`camera_toggle` est exclu du groupe pour deux raisons : c'est un son du jeu
partagé avec la tablette des caméras, et c'est celui du clic de fermeture, il
doit pouvoir finir.

Ajouter un son au terminal se fait en une ligne dans `TERMINAL_CUES`. Avec
`owned: true`, il rejoint le groupe coupé à la fermeture sans autre
modification.

### Cassettes et divers

| Contexte | Son |
|----------|-----|
| Lecture d'une cassette | `tape_*`, id pris dans `tapes_data.json` |
| Éjection d'une cassette | `tape_eject` |
| Clic sur le nez de Freddy | `party_favor` |
| Écran de nuit, avant l'apparition du numéro | `camera_cycle` |

Le lecteur de cassettes est une scène à part, `TapeScene`, avec son propre
arrêt : `stopCurrentAudio()` à la fermeture, `reset()` au début de chaque nuit.
Fermer le terminal n'arrête pas une cassette en cours.

### Événements aléatoires

Chaque entrée de `random_events_data.json` porte un champ `sound` avec un id du
catalogue. Le son est joué quand l'image cachée est dessinée, une seule fois
par visite de caméra : `_lastSoundCameraVisitByEvent` empêche de le rejouer à
chaque frame tant que le joueur reste sur la même caméra.

38 ids du catalogue servent aux événements. 41 événements pointent encore sur
`laugh_girl1`, faute de fichier dédié (cf. `todolist.md` à la racine du dépôt).

## 5. Sons du catalogue jamais joués

| Son | Raison |
|-----|--------|
| `ambience2` | Aucun appel, nulle part |
| `scare_2` | XSCREAM2, réservé à Golden Freddy, non implémenté |
| `door_pounding` | Son présent, mais c'est `foxy-curtain-open` qui utilise le fichier DOOR_POUNDING |
| `foxy-retrait` | Écarté : il joue knock2.wav, soit un coup à la porte, pour un retour hors champ silencieux dans FNAF 1 |

## 6. Pièges connus

- `startAmbientSounds()` et `startMenuSounds()` sont gardés par
  `if (!gameStarted)`, or `gameStarted` est un `const` à `false`
  (`script/state/game_state.js`). La garde ne fait rien.
- `run_fast` et `foxy-running` pointent sur le même fichier
  `running fast3.wav`.
- La description de `buzz_fan` dans le catalogue annonce une modulation entre
  0.10 et 0.15, alors que `updateFanFlutter()` vise 0.02 à 0.06.
- `playSound()` coupe le son avant de le relancer. Deux occurrences du même id
  ne peuvent donc pas se superposer, ce qui compte pour les sons de
  déplacement quand plusieurs animatronics bougent au même tour.
- `stopAllSounds()` est appelé au début de chaque nuit, sur le jumpscare et à
  6 AM. Tout son lancé juste avant est perdu.
- Les appels téléphoniques anglais (`voiceover1_en.wav` à `voiceover4_en.wav`)
  existent dans `audio/` mais n'ont aucune balise `<audio>` et ne sont cités
  nulle part, alors que `language.js` gère les deux langues.

## 7. Rôle de référence dans FNAF 1

Table d'origine, conservée comme cible de conception. Les noms de colonne
« Classe » sont les sélecteurs CSS, pas les `id` du catalogue. La colonne
« Écart » signale les cas où l'implémentation actuelle s'éloigne de cette
intention.

### Musique et ambiance

| Classe | Rôle de référence | Écart |
|--------|-------------------|-------|
| `menu-start` | Boucle du menu principal | Conforme |
| `ambience1` | Ambiance alternative pour varier l'atmosphère | Sert de nappe de menace, pilotée par le nombre d'animatronics |
| `ambience2` | Ambiance principale du bureau, en boucle toute la nuit | Jamais jouée ; c'est `cold_presc` qui tient ce rôle |
| `Buzz-fan` | Ventilateur ou néon du bureau, en boucle | Conforme, avec une dérive de volume ajoutée |
| `circus` | Musique de cirque pour les séquences spéciales | Devenu un son d'ambiance rare, une nuit sur trois |
| `pirate-song` | Chanson liée à Foxy et au Pirate Cove | Conforme, sur la Cam 1C, 20 % de chance |
| `cold-presc` | Ambiance froide pour les nuits avancées | Jouée à toutes les nuits, sans distinction |

### Caméras

| Classe | Rôle de référence | Écart |
|--------|-------------------|-------|
| `camera-toggle` | Ouverture et fermeture du mode caméra | Conforme |
| `camera-put-down` | Rangement de la tablette | Conforme |
| `camera-cycle` | Blip de changement de caméra | Conforme |
| `camera-static` | Statique quand les caméras buguent | Boucle continue tant que la tablette est levée |

### Portes

| Classe | Rôle de référence | Écart |
|--------|-------------------|-------|
| `light-on` | Allumage de la lumière d'un couloir | Conforme |
| `door-sound` | Ouverture et fermeture d'une porte | Conforme |
| `door-light-disabled` | Erreur, plus assez d'électricité | Conforme |
| `door-pounding` | Coup d'un animatronic sur la porte | Jamais joué ; le fichier sert à `foxy-curtain-open` |

### Victoire

| Classe | Rôle de référence | Écart |
|--------|-------------------|-------|
| `win-sound` | Cloche de 6 h du matin | Conforme |
| `win-cheer` | Acclamations après la nuit survécue | Conforme |

### Game over et jumpscares

| Classe | Rôle de référence | Écart |
|--------|-------------------|-------|
| `powerout-sound` | Coupure d'électricité | Conforme |
| `powerout-jingle` | Boîte à musique pendant la coupure | Conforme |
| `scare-1` | Cri de jumpscare | Conforme, partagé par tous les animatronics sauf Foxy |
| `scare-2` | Variante du cri | Jamais joué, réservé à Golden Freddy |
| `window-scare` | Animatronic découvert derrière la vitre | Conforme |
| `gameover-static` | Statique de l'écran de game over | Conforme, après la panne de courant |
| `gameover-static2` | Variante de la statique | Conforme, après un jumpscare |

### Cuisine

| Classe | Rôle de référence | Écart |
|--------|-------------------|-------|
| `kitchen-b`, `kitchen-c`, `kitchen-f`, `kitchen-drawer` | Bruitages de Chica en cuisine | Conforme, tirés au hasard quand un animatronic est en cuisine |

### Pas et mouvements

| Classe | Rôle de référence | Écart |
|--------|-------------------|-------|
| `move-sound` | Pas d'un animatronic dans les couloirs | Conforme |
| `run-sound` | Déplacement rapide | Conforme |
| `run-fast` | Mouvement urgent | Conforme, mais partage son fichier avec `foxy-running` |

### Voix et appels

| Classe | Rôle de référence | Écart |
|--------|-------------------|-------|
| `call1` à `call5` | Appels du Phone Guy au début de chaque nuit | Conforme en français ; les versions anglaises ne sont pas branchées |
| `robot-voice` | Voix robotique | Joué comme son d'ambiance de caméra |
| `garble1` à `garble3` | Voix brouillées | Joué comme son d'ambiance de caméra |
| `whispering` | Chuchotements | Joué comme son d'ambiance de caméra |

### Respiration

| Classe | Rôle de référence | Écart |
|--------|-------------------|-------|
| `breath1` à `breath4` | Immersion | Joué sur une caméra où un animatronic est présent |

### Divers

| Classe | Rôle de référence | Écart |
|--------|-------------------|-------|
| `laugh-girl1` et variantes | Rires glaçants | Rire de Freddy à chaque déplacement, et son de caméra sur pièce vide |
| `tape-eject` | Éjection de cassette | Conforme |
| `party-favor` | Son de fête | Clic sur le nez de Freddy |
| `knock` | Coup à une porte ou un mur | Conforme, 30 % par tour d'attente derrière la porte |
