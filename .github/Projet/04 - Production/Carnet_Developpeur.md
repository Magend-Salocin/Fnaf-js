# Carnet du développeur

Comment produire et brancher chaque type de contenu : voix, images, sons, logs, événements. Chaque section donne la procédure courte et renvoie vers le document détaillé quand il existe.

---

## 0. Lancer et tester

```bash
npm start        # le jeu dans Electron, DevTools ouverts, console recopiée dans le terminal
npm run build    # installeur Windows dans dist/
```

- Au lancement, lire la sortie `[ConfigValidator]` : elle signale les ids en double, les références audio, caméra ou terminal invalides. Après toute modification d'un JSON de `script/config/`, la relire.
- Forcer un événement caché : dans les DevTools, `RandomEvents.forceTrigger('FRT-001')`, puis ouvrir la caméra concernée.
- Boutons de debug sur l'écran d'accueil : phase de Foxy, gagner la nuit, game over.

## 1. Voix

Outil : `tools/voix/generer_voix.js`. Textes, réglages et audios : `ressources/voix/`. Détail du format : `ressources/voix/README.md`. Qui parle où : [Next/Casting_Voix.md](../Next/Casting_Voix.md). Pourquoi ces réglages : [Next/Journal_Voix_Son.md](../Next/Journal_Voix_Son.md).

### Générer

```bash
node tools/voix/generer_voix.js                                            # tout
node tools/voix/generer_voix.js ressources/voix/textes/tape_sus_02.txt     # un seul
```

Windows uniquement (voix du système). Résultat dans `ressources/voix/sorties/`.

### Écrire ou corriger un texte

1. Ouvrir ou créer `ressources/voix/textes/<nom>.txt`.
2. En tête : `!mode cassette` (tout à l'endroit) ou `!mode inverse` (appels : tout inversé sauf les parenthèses), et `!voix <profil>` pour la voix par défaut.
3. Une réplique par ligne. `@<profil> texte` pour changer de voix sur une ligne. `[BRUITAGE]` seul sur sa ligne. `...` pour une pause.
4. Écrire les mots en minuscules : certaines voix épellent les majuscules.
5. Régénérer ce seul fichier, écouter, ajuster.

```text
!mode cassette
!voix pierre

[BRUIT DE PAPIERS]
Procédure de fermeture après une réservation anniversaire.
[PAUSE]
@responsable Fermez la salle.
```

### Profils existants

`cassidy`, `enfants`, `fritz_echo`, `gardien`, `pierre`, `marie`, `responsable`, `inconnu`, `machine`, `memoire`. Réglages dans `ressources/voix/config.json`, section `voix`.

### Ajouter un personnage

1. Choisir sa famille de son (Casting, section 1) : archives 1985 (bande magnétique), système (numérique), présent (voix nette).
2. Copier un profil proche dans `config.json` et l'ajuster : `moteur` (`sapi` pour Hortense, `winrt` pour Julie et Paul), `vitesse` (`medium` en sapi, nombre en winrt), `effets`.
3. Faire un essai de quelques répliques dans un texte temporaire, hors de `textes/`.
4. Ajouter le personnage au Casting.

### Ajouter un bruitage

Les indications `[...]` sont reconnues par mot-clé dans `config.json`, section `bruitages`, dans l'ordre de la liste : mettre le motif le plus précis en premier. Un bruitage inconnu devient un silence et le générateur l'affiche. Les sons viennent de `audio/` et `audio/hidden/` (WAV 16 ou 24 bits ; les MP3 ne sont pas lus).

### Pièges

- Ne jamais écrire une vitesse en pourcentage (`0%`) : Windows ralentit fortement.
- Pas d'écho, pas de ralenti : la dégradation passe par le numérique.
- Une même génération donne toujours le même résultat (graines fixes). Changer `glitch.graine` pour déplacer les accidents de la voix `memoire`.

## 2. Images

### Images des caméras

- Dossier : `images/rooms/<caméra>_<salle>/`, par exemple `1b_dining_area/`.
- Nom : `<caméra>_b<0|1>_c<0|1>_f<0|1>.jpg`, présence de Bonnie, Chica et Freddy. Exemple : `1b_b0_c1_f0.jpg` = Chica seule en Dining Area.
- Chaque image est déclarée dans `script/config/assets.json`, sous la clé de la caméra. Une image absente du fichier n'est jamais affichée, même si elle est sur le disque.
- Après tout ajout, déplacement ou renommage d'image, lancer le vérificateur :
  ```bash
  node tools/check_assets.js
  ```
  `ERREUR` : une déclaration pointe sur un fichier absent (bloquant). `À PRODUIRE` : image d'un événement pas encore réalisé. `NON UTILISÉ` : image référencée nulle part, à déclarer, à déplacer ou à supprimer. Une image d'événement doit être dans le dossier `hidden/` de la salle de son `roomLabel` : changer le `roomLabel` d'un événement oblige à déplacer son image.

### Images cachées : atlas de sprites (méthode actuelle)

Détail et prompts : [Prompts_Images_Cachees.md](Prompts_Images_Cachees.md).

1. Générer la planche de la série dans ChatGPT avec le prompt du document (fond transparent, grille fixe).
2. Vérifier : vrai fond transparent, objets séparés, aucun texte.
3. Déposer `images/atlas/src/<serie>_props.png` à côté de son `<serie>_props.sprites.json` (grille et nom de chaque sprite).
4. Découper :
   ```bash
   node tools/atlas/slice_atlas.js images/atlas/src/<serie>_props.png
   ```
   Produit `images/atlas/<atlas>.png` et `<atlas>.json`.
5. Dans `random_events_data.json`, poser le sprite sur l'événement :
   `"layers": [{ "sprite": "foxy/car_front", "x": 1070, "y": 702, "scale": 0.36 }]`
   (`x`, `y` = point de contact au sol, en pixels de l'image 1600x719).
6. Tester avec `RandomEvents.forceTrigger('<ID>')`.

État au 17/11/2026 : atlas découpés `foxy`, `gabriel`, `jeremy_props`, `susie`, `cassidy`, `restaurant`. Seul `foxy` est déjà posé sur des événements (`layers`) ; les autres attendent leur placement. Il manque la planche `jeremy_drawings.png` (prompt dans Prompts_Images_Cachees.md, découpe déjà décrite dans `jeremy_drawings.sprites.json`).

### Images cachées : image complète (ancienne méthode)

`images/rooms/<salle>/hidden/<ID>.png`, le dossier étant déduit du `roomLabel` par `EVENT_ROOM_MAP` (`script/loaders/random_events_data.js`). Passer `realised` à `true` dans `random_events_data.json`.

### Affiches de l'East Hall Corner (CAM 4B)

- Une affiche par nuit et par langue : `images/rooms/4b_east_hall_corner/hidden/{fr,en}/4b_b0_c0_f0_d<nuit>.<png|jpg>`.
- Déclarée dans `assets.json` sous la clé `4b_b0_c0_f0_d<nuit>_<langue>`. Une affiche non déclarée retombe sur l'image par défaut (bug corrigé pour la nuit 5 en français le 17/11/2026).
- Affichée par `camera.js` quand la pièce est vide.

### Journaux

1. Texte : `ressources/journaux/<CODE>.txt` (titre, date, article, description de la photo).
2. Image : générer la page avec le modèle de `ressources/journaux/prompt.txt` (page de journal des années 1980, article entouré au marqueur, le reste flou), y coller le texte. Déposer `ressources/journaux/<CODE>.png`.
3. Déclarer dans `script/config/journals_data.json` : `code`, `title`, `date`, `night`, `article`, `photoDescription`, `image`.
4. Un journal ne dit jamais « disparition » : c'est le rôle des affiches de la CAM 4B.

## 3. Sons

### Règle commune

Un son est déclaré à deux endroits qui doivent rester cohérents :

1. `index.html` : `<audio preload="metadata" class="mon-son" src="audio/mon_son.wav"></audio>`
2. `script/config/game_sounds.json` : `{ "id": "mon_son", "selector": ".mon-son", "category": "...", "description": "...", "mixVolume": 0.8 }`

`mixVolume` entre 0 et 1,5, calé sur le tableau de référence de FNAF 1 (`03 - Technique/son.md`, section 7).

### Son d'un événement caché

Utiliser le skill `/ajouter-son <id>`. À la main :

1. Déposer le fichier dans `audio/hidden/`.
2. Déclarer le son (règle commune), dans le bloc `<!-- Hidden -->` de `index.html`.
3. Dans `random_events_data.json`, remplacer `"sound": "laugh_girl1"` (son provisoire) par le nouvel id, événement par événement d'après `todolist.md`.
4. Cocher dans `todolist.md`.

### Cassettes

- Texte affiché : `ressources/Tape/<CODE>.txt`. Audio : `ressources/voix/sorties/tape_<code>.wav`, généré (section 1). Les anciens MP3 de `ressources/Tape/` ne sont plus lus.
- Déclarées dans `script/config/tapes_data.json` (`code`, `title`, `description`, `soundId`), dans `game_sounds.json` (`tape_frt_01`...) et par une balise `<audio>` dans `index.html`.
- Modifier une cassette : corriger son texte dans `ressources/voix/textes/`, régénérer. Le chemin ne change pas.
- TAPE_ERREUR_08 et 09 (fins) sont générées mais pas déclarées : elles attendent le système de fins.

### Appels téléphoniques

`audio/voiceover1.wav` à `voiceover5.wav`, plus les variantes `_en`. Les appels 1 à 4 restent ceux de FNAF 1.

En français, l'appel 5 est remplacé par l'appel de Cassidy (`call_5_cassidy_a`, `_b`, `_c`). La version est choisie par `getNight5CallVersion()` (`script/mechanics/night.js`) : provisoirement d'après la part des cassettes débloquées, en attendant les chaînes de découverte. Pour tester une version : `window.FORCE_NIGHT5_CALL = 'c'` dans les DevTools avant la nuit 5. En anglais, l'appel 5 de FNAF 1 reste joué.

## 4. Logs du terminal

Utiliser le skill `/ecrire-log <COMMANDE>`. Référence : `02 - Lore/CANON_LOGS.md`.

1. Écrire `ressources/logs/<COMMANDE>.json`, en partant d'un log de la même catégorie. Ou passer par l'éditeur graphique (`_editor_log/editor.html`, accessible depuis l'écran d'accueil).
2. Pour une nouvelle commande, l'ajouter à `logFiles` dans `script/config/logs_database.json`.
3. Valider, jusqu'à zéro erreur :
   ```bash
   node ".github/Projet/_editor_log/check_logs.js"
   ```
4. Si un événement débloque la commande, renseigner son champ `terminal`.

## 5. Événements cachés

Utiliser le skill `/evenement-cache <ID>`. Les champs et leurs valeurs sont décrits dans le skill. Garder `random_events_data.json` synchronisé avec le tableau de production (`Tableau_Production_Regroupe_Par_Nuit.*`).

## 6. Aide de Claude Code

| Outil | Usage |
| --- | --- |
| `/ajouter-son` | Brancher un son d'événement caché |
| `/ecrire-log` | Écrire ou modifier un log du terminal |
| `/evenement-cache` | Créer ou modifier un événement caché |
| Agent `auditeur-fnaf1` | Comparer une mécanique au jeu d'origine |
| Agent `gardien-lore` | Vérifier ou collecter le canon narratif |

Les règles par type de fichier sont dans `.claude/rules/` et se chargent seules.

## 7. Où en est le projet

[Next/En_Cours.md](../Next/En_Cours.md) : fait, à valider, à faire.
