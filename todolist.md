# Todolist — FNAF-JS

Tâches cochables tirées de `reste_a_faire`, qui reste la référence pour le
détail (procédures, chemins de fichiers, justifications).

## Priorité 1 — Sons manquants (23 fichiers, 41 événements)

Procédure pour chaque son : fichier dans `audio/hidden/`, entrée dans
`script/config/game_sounds.json`, balise `<audio preload="metadata">` dans
le bloc `<!-- Hidden -->` de `index.html`, puis remplacer `laugh_girl1` par
le nouvel id dans `script/config/random_events_data.json`.

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

Les `mixVolume` du catalogue suivent désormais le tableau de référence FNAF 1.
Aucun son du tableau ne manque au dossier `audio/` : le rire de Freddy est le
giggle repitché `Laugh_Giggle_Girl_*`, la chanson de Pirate Cove est
`pirate song2.wav` pour les deux variantes, et le 6 AM est `chimes 2.wav`.

- [x] `night_start` : écarté. Le tableau prévoit `chimes 2.wav` à 0.50 au début
      de chaque nuit, mais FNAF 1 n'a pas de carillon systématique à 12 AM.
      Le brancher ajouterait un élément sonore absent du jeu d'origine.
- [ ] `scare_2` (XSCREAM2) n'est plus joué : il est réservé à Golden Freddy,
      qui n'est pas implémenté.
- [ ] `ambience2` figure au catalogue mais n'est joué nulle part.
- [ ] Appels téléphoniques anglais : `voiceover1_en.wav` à `voiceover4_en.wav`
      n'ont aucune balise `<audio>` et ne sont cités nulle part, alors que
      `language.js` gère les deux langues. `voiceover5_en.wav` n'existe pas.
- [ ] `menu_start` (darkness_music.wav) reste débranché : le menu joue
      `menu_start2`, un thème ajouté. Trancher entre la fidélité FNAF 1 et le
      thème actuel.
- [ ] Trois sons de Foxy partagent des fichiers approximatifs :
      `foxy-curtain-open` pointe sur DOOR_POUNDING (le coup sur la porte),
      `foxy-blocked` et `foxy-retrait` sur le même knock2.wav, `run_fast` et
      `foxy-running` sur le même running fast3.wav.

## Priorité 1 — Images cachées (43 à produire)

Format `<ID>.png` dans `images/rooms/<salle>/hidden/`. Passer `realised` à
`true` dans `random_events_data.json` au fur et à mesure.

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

### Backstage — 11 images
- [ ] JER-026 (n3) Bonnie regarde un dessin
- [ ] JER-027 (n3) Bonnie dessine
- [ ] JER-011 (n4) Dessin d'un soleil
- [ ] JER-016 (n4) Dessin de cinq enfants
- [ ] JER-017 (n4) Dessin barré
- [ ] JER-018 (n4) Dessin déchiré
- [ ] JER-019 (n4) Dessin inachevé
- [ ] JER-020 (n4) Feuille totalement blanche
- [ ] JER-028 (n4) Bonnie tient une feuille
- [ ] JER-029 (n4) Bonnie baisse la tête devant un dessin
- [ ] JER-030 (n5) Bonnie repose doucement le crayon

### Supply Closet — 5 images
- [ ] JER-021 (n3) Crayon bleu au sol
- [ ] JER-022 (n3) Crayon rouge cassé
- [ ] JER-023 (n4) Le crayon vert disparaît
- [ ] JER-024 (n4) Les crayons changent de place
- [ ] JER-025 (n5) Un seul crayon reste sur la table

### West Hall — 4 images
- [ ] FRT-014 (n3) Cube en bois
- [ ] FRT-016 (n3) La voiture avance seule
- [ ] FRT-009 (n4) Petite voiture dans le couloir
- [ ] FRT-018 (n4) Un cube disparaît

### Stage — 3 images
- [ ] GAB-004 (n2) Freddy regarde une chaise vide
- [ ] GAB-024 (n5) Les aiguilles tournent à l'envers
- [ ] SUS-010 (n5) Chica regarde le joueur sans bouger

### Kitchen — 2 images
- [ ] SUS-004 (n3) Chica tourne la tête vers une porte
- [ ] SUS-008 (n4) Bruit de gamelle déplacée

### East Hall — 1 image
- [ ] SUS-006 (n3) — écrire la description avant de produire l'image

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

- [ ] `analog_video_engine.js` : brancher dans `index.html` ou supprimer
- [ ] `psychological_director.js` : brancher dans `index.html` ou supprimer
- [x] `cold_presc` branché comme ambiance de fond de la nuit. Reste
      `menu_start`, cf. « Câblage audio à finir »
- [ ] Custom Night : construire un vrai mode (écran de difficulté par
      animatronic, nuit 7) ou retirer le libellé « Nuit Personnalisée Terminée »
- [x] Jumpscare de Foxy : bascule sur `foxy-attack` faite

## Priorité 2 — Vérifications en jeu

- [ ] Vérifier la zone cliquable du nez de Freddy (`freddy_nose`) et la
      recalibrer si le survol ne tombe pas sur le nez
- [ ] Vérifier les 12 événements dont le `roomLabel` a été corrigé
      (JER-004, JER-005, JER-012, GAB-011, GAB-012, GAB-013, SUS-013,
      SUS-014, SUS-027, SUS-028, SUS-029, SUS-030)
- [ ] Vérifier le nouveau souffle statique de la tablette et les sons
      ambiants aléatoires des caméras (20 %) à l'oreille

## Priorité 3 — Nettoyage avant diffusion

- [ ] Gater ou retirer le panneau de debug (`index.html`, `script/debug/`)
- [ ] `transitionEndNight()` : construire l'écran de chèque de paie ou
      corriger le commentaire qui le décrit

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
