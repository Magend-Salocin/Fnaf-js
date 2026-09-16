# Todolist — FNAF-JS

Tâches cochables tirées de `reste_a_faire`, qui reste la référence pour le
détail (procédures, chemins de fichiers, justifications).

## Priorité 1 — Sons manquants (23 fichiers, 41 événements)

Procédure pour chaque son : fichier dans `audio/hidden/`, entrée dans
`script/config/game_sounds.json`, balise `<audio preload="metadata">` dans
le bloc `<!-- Hidden -->` de `index.html`, puis remplacer `laugh_girl1` par
le nouvel id dans `script/config/random_events_data.json`.

Les 41 occurrences de `laugh_girl1` sont toujours en place dans
`random_events_data.json` : aucun de ces sons n'a encore été produit.

- [ ] `wood` — FRT-004, FRT-007, FRT-012, FRT-017, FRT-022
- [ ] `breathe` — GAB-004, GAB-011, GAB-015, SUS-010, SUS-027
- [ ] `creak` — FRT-005, FRT-013, FRT-019, FRT-025
- [ ] `scratch` — JER-004, JER-027
- [ ] `drop` — FRT-024, JER-030
- [ ] `crack` — JER-022, SUS-020
- [ ] `metal` — SUS-004, GAB-014
- [ ] `toys` — FRT-010, FRT-030
- [ ] `breath` — JER-026
- [ ] `figurine` — FRT-015
- [ ] `puppy` — SUS-007
- [ ] `step` — SUS-014
- [ ] `cupboard` — SUS-022
- [ ] `reverse` — GAB-024
- [ ] `reset` — FRT-020
- [ ] `clock_error` — GAB-023
- [ ] `eraser` — JER-007
- [ ] `balloon` — GAB-002
- [ ] `crayons` — JER-003
- [ ] `drip` — GAB-010
- [ ] `page` — JER-009
- [ ] `ball` — SUS-015
- [ ] `cloth` — SUS-009
- [ ] Trancher FRT-018 (réutiliser `block` ?) et JER-024 (réutiliser `paper` ?)
- [ ] Réécouter en jeu et réajuster les `mixVolume` des 25 sons déjà en place

## Priorité 2 — Câblage audio à finir

Les `mixVolume` du catalogue suivent le tableau de référence FNAF 1. Aucun son
du tableau ne manque au dossier `audio/`.

- [ ] `scare_2` (XSCREAM2) n'est plus joué : il est réservé à Golden Freddy,
      qui n'est pas implémenté.
- [ ] `ambience2` (ambience2.wav) figure au catalogue mais n'est déclenché
      nulle part.
- [ ] Appels téléphoniques anglais : `voiceover1_en.wav` à `voiceover4_en.wav`
      n'ont aucune balise `<audio>` et ne sont cités nulle part, alors que
      `language.js` gère les deux langues. `voiceover5_en.wav` n'existe pas.
- [ ] `foxy-curtain-open` joue DOOR_POUNDING, soit un coup violent sur une
      porte, pour l'ouverture du rideau de Pirate Cove. Il lui faut son propre
      fichier. Tant qu'il n'existe pas, DOOR_POUNDING ne peut pas retrouver
      son rôle de coup de Foxy sur la porte, qui serait sinon en double.
- [ ] `foxy-retrait` n'est plus joué : il utilisait knock2.wav pour un retour
      hors champ et silencieux dans le jeu d'origine.
- [ ] `run_fast` et `foxy-running` pointent sur le même running fast3.wav.

## Priorité 1 — Images cachées (26 à produire)

Format `<ID>.png` dans `images/rooms/<salle>/hidden/`. Le dossier est déduit du
`roomLabel` par `EVENT_ROOM_MAP` (`script/loaders/random_events_data.js`).
Passer `realised` à `true` dans `random_events_data.json` au fur et à mesure.

### Dining Area — 17 images
- [ ] SUS-011 (n2) Gamelle déplacée
- [ ] SUS-012 (n2) Laisse au sol
- [ ] FRT-013 (n3) Coffre miniature
- [ ] GAB-021 (n3) Horloge bloquée à 17h45
- [ ] SUS-016 (n3) Cupcake orienté vers la caméra
- [ ] SUS-017 (n3) Cupcake regarde la porte
- [ ] FRT-015 (n4) Figurine pirate
- [ ] FRT-017 (n4) Le bateau change d'étagère
- [ ] GAB-022 (n4) Horloge repart quelques secondes
- [ ] GAB-023 (n4) Une seconde horloge affiche une autre heure
- [ ] SUS-015 (n4) Petite balle jaune sous une chaise
- [ ] SUS-018 (n4) Cupcake disparaît une seconde
- [ ] SUS-019 (n4) Cupcake revient à sa place
- [ ] FRT-028 (n5) Voiture sous une table
- [ ] GAB-025 (n5) L'horloge revient à 00:00
- [ ] SUS-009 (n5) Ruban jaune au sol
- [ ] SUS-020 (n5) Cupcake légèrement fissuré

### Backstage — 1 image
- [ ] JER-011 (n4) Dessin d'un soleil

### Stage — 3 images
- [ ] GAB-004 (n2) Freddy regarde une chaise vide
- [ ] GAB-024 (n5) Les aiguilles tournent à l'envers
- [ ] SUS-010 (n5) Chica regarde le joueur sans bouger

### Kitchen — 2 images
- [ ] SUS-004 (n3) Chica tourne la tête vers une porte
- [ ] SUS-008 (n4) Bruit de gamelle déplacée

### East Hall — 1 image
- [ ] SUS-006 (n3) — écrire la description avant de produire l'image

### Correctifs sur les images déjà produites
- [ ] 47 événements ont leur image mais restent à `"realised": false` dans
      `random_events_data.json` (tous les FRT produits, JER-016 à JER-030, les
      visuels d'animatroniques). Le champ ne sert qu'au suivi de production,
      mais il est devenu faux : le resynchroniser.

## Priorité 1 — Contenu narratif

- [ ] Écrire `lore_night2.js` (thème, `secretPool`, `idleEvent`)
- [ ] Écrire `lore_night3.js`
- [ ] Écrire `lore_night4.js`
- [ ] Écrire `lore_night5.js`
- [ ] Écrire `lore_night6.js`
- [ ] Tester les 7 événements `CASSIDY-*` en conditions réelles
- [ ] Ajuster nuits / heures / `chance` des `CASSIDY-*` après ce test
- [ ] Décider si les 7 cassettes Cassidy reçoivent une illustration

## Priorité 2 — Décisions à prendre

- [ ] `script/core/unused/analog_video_engine.js` et
      `script/core/unused/psychological_director.js` sont parqués hors du
      chargement : les brancher dans `index.html` ou les supprimer.
- [ ] Custom Night : construire un vrai mode (écran de difficulté par
      animatronic, nuit 7) ou retirer le libellé « Nuit Personnalisée Terminée »
      (`script/config/translations.json`)

## Priorité 2 — Vérifications en jeu

- [ ] Vérifier la zone cliquable du nez de Freddy (`freddy_nose`,
      `script/config/office_hotspots.json`) et la recalibrer si le survol ne
      tombe pas sur le nez
- [ ] Vérifier les 12 événements dont le `roomLabel` a été corrigé
      (JER-004, JER-005, JER-012, GAB-011, GAB-012, GAB-013, SUS-013,
      SUS-014, SUS-027, SUS-028, SUS-029, SUS-030)
- [ ] Vérifier le nouveau souffle statique de la tablette et les sons
      ambiants aléatoires des caméras (20 %) à l'oreille

## Priorité 3 — Nettoyage avant diffusion

- [ ] Gater ou retirer le panneau de debug (`index.html`, `script/debug/`)
- [ ] `transitionEndNight()` (`script/app/render.js`) : construire l'écran de
      chèque de paie ou corriger le commentaire qui le décrit

## Priorité 4 — Dette technique

Moyen terme :
- [ ] Store `GameState` unique à la place des variables globales
- [ ] Séparer logique de jeu et rendu (DOM / Canvas / Audio)
- [ ] Event bus léger (`camera:switched`, `power:changed`, `night:ended`)

Long terme :
- [ ] Migration vers les modules ES natifs
- [ ] Tests unitaires (builders de salles, états de Foxy, déclenchement des
      événements aléatoires)
- [ ] Réduire le coût par frame (cache des sélecteurs DOM, logs coupés en
      production)
