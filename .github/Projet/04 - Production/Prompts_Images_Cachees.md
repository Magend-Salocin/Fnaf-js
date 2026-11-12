# Prompts des images cachées

Prompts pour produire les images cachées manquantes listées dans `todolist.md` (Priorité 1).

Deux méthodes coexistent pendant la migration : les atlas de sprites (méthode cible, section suivante) et l'édition d'image complète (ancienne méthode, sections « Méthode » et suivantes).

## Atlas de sprites (méthode cible)

Au lieu d'éditer toute l'image de la caméra, on génère en une fois tous les objets d'une série sur une planche à fond transparent. Le jeu les pose ensuite en calques sur l'image de base. Avantages : un style homogène dans la série, aucun décalage de cadrage, des objets réutilisables d'une caméra à l'autre, et la possibilité de les déplacer ou de les animer.

Les animatronics restent hors des atlas : les événements où ils agissent passeront par des découpes de leurs images existantes.

### Procédure

1. Coller le prompt de la série dans ChatGPT.
2. Vérifier : vrai fond transparent (sinon redemander avec le fond vert `#00FF00`), variantes d'un même objet identiques, aucun texte, objets bien séparés. Pour corriger une seule cellule : `Keep the image exactly identical. Only redo cell N so that ...`.
3. Déposer la planche dans `images/atlas/src/<serie>_props.png`, avec sa description `<serie>_props.sprites.json` (nom de l'atlas, grille, nom des sprites par cellule ; une cellule à plusieurs objets les nomme de gauche à droite).
4. Lancer `node tools/atlas/slice_atlas.js images/atlas/src/<serie>_props.png`. Le script retire le halo de détourage et les poussières, puis produit `images/atlas/<atlas>.png` et `<atlas>.json`.
5. Dans `random_events_data.json`, remplacer `image` par `layers` :
   `"layers": [{ "sprite": "foxy/car_front", "x": 1070, "y": 702, "scale": 0.36 }]`.
   `x`, `y` désignent le point de contact au sol (bas centre du sprite), en pixels de l'image de base (1600x719). Options : `"flip": true` (miroir), `"shadow": false` (pas d'ombre de contact).
6. Si la salle n'a pas encore d'étalonnage, ajouter `propGrade` dans `rooms_config.json` (luminosité, saturation, flou, teinte) pour que les sprites prennent la lumière de la scène.
7. Tester en jeu : DevTools, `RandomEvents.forceTrigger('<ID>')`, puis ouvrir la caméra.

### Série Fritz / Foxy

Planche : `images/atlas/src/foxy_props.png` (produite le 2026-11-10). Atlas : `foxy`.

```
Create a single sprite sheet image, 1536x1024, landscape, with a TRANSPARENT background (PNG with alpha). If transparency is not possible, use a perfectly flat pure green background (#00FF00) with no gradient, no texture and no shadow.

Layout: a 4-column by 3-row grid of 12 cells. One object (or group) per cell, centered, filling about 80% of its cell. Leave generous empty space between objects. No grid lines, no borders, no labels, no text, no numbers anywhere.

Subject: a set of old children's toys from a 1980s family pizzeria, all made by the same hand, as one coherent collection. Realistic 3D render, matte painted wood and slightly faded plastic, worn edges, chipped paint, a light layer of dust. Muted, slightly desaturated colors. No green on any object.

Camera: every object is seen from the same high angle, about 35 degrees from above, like a ceiling-mounted security camera. Same lens, no perspective distortion.

Lighting: identical for every object. Soft, neutral white light from the top left, gentle shading, no colored light, no rim light, no glow. No cast shadow on the background, no floor, no reflection.

Cells, left to right, top to bottom:
1. Small red toy car, die-cast metal, rounded 1960s style, seen from the side, facing left.
2. The same red toy car, three-quarter front view.
3. The same red toy car, three-quarter rear view, as if driving away.
4. Miniature wooden pirate ship, about 30 cm long, upright, dark brown hull, off-white cloth sails, small black flag with no symbol.
5. The same pirate ship lying on its side, as if dropped.
6. Small wooden toy treasure chest, painted brown with brass-colored corners and a latch, closed.
7. The same chest, lid slightly ajar.
8. The same chest, lid fully open, empty inside.
9. A small pile of toy treasure: plastic gold coins and a few colored plastic bead necklaces, as if spilled from the chest.
10. A small plastic pirate captain figurine, child's toy, standing, hat and coat, painted with simple worn colors, facing the camera.
11. Three separate wooden toy blocks, painted cubes: one red, one blue, one yellow, spaced apart, not touching.
12. A tower of five stacked wooden toy blocks in red, blue and yellow, slightly uneven.
```

| Sprite | Événements |
|---|---|
| `car_side`, `car_front`, `car_rear` | FRT-001, 003, 009, 011, 016, 028 |
| `boat`, `boat_fallen` | FRT-004, 012, 017, 024 |
| `chest_closed`, `chest_ajar`, `chest_open` | FRT-005, 013, 019, 025 |
| `treasure` | FRT-029 |
| `captain` | FRT-015 |
| `block_red`, `block_blue`, `block_yellow` | FRT-008, 014, 018, 027 (tour écroulée = cubes éparpillés) |
| `block_tower` | FRT-026 |

FRT-010, 020 et 030 (jouets alignés ou rangés) réutilisent les mêmes sprites avec d'autres placements. Les événements où Foxy agit (FRT-002, 007, 021 à 025) ne sont pas couverts par l'atlas.

Migré en calques : FRT-001.

### Choix communs aux séries suivantes

- Les horloges de Gabriel sont générées sans aiguilles : le jeu les dessine, ce qui permet de les bloquer à 17h45, de les faire repartir ou tourner à l'envers.
- La flamme de la bougie est un sprite séparé, pour la faire vaciller.
- Les objets du décor existant (chaise reculée de GAB-001) et les événements où un animatronic agit ne sont pas couverts : un sprite généré ne correspondrait pas aux meubles ou aux personnages de l'image de base. Ils passeront par des découpes de l'image de base.
- Jeremy a deux planches : une pour les dessins, une pour le matériel.
- Le fond de secours est magenta (`#FF00FF`) pour Jeremy, parce que ses crayons comprennent un vert.

### Série Gabriel / Freddy

Planche : `images/atlas/src/gabriel_props.png`. Atlas : `gabriel`.

```
Create a single sprite sheet image, 1536x1024, landscape, with a TRANSPARENT background (PNG with alpha). If transparency is not possible, use a perfectly flat pure green background (#00FF00) with no gradient, no texture and no shadow.

Layout: a 4-column by 3-row grid of 12 cells. One object per cell, centered, filling about 80% of its cell. Leave generous empty space between objects. No grid lines, no borders, no labels, no text, no numbers anywhere.

Subject: leftovers of a child's birthday party in a 1980s family pizzeria, all from the same party, as one coherent collection. Realistic 3D render, paper, cardboard and plastic party supplies, slightly aged, a light layer of dust. Palette of faded yellow and warm orange, slightly desaturated. No green on any object.

Camera: every object is seen from the same high angle, about 35 degrees from above, like a ceiling-mounted security camera, except the two clocks, seen straight on as if hanging on a wall. Same lens, no perspective distortion.

Lighting: identical for every object. Soft, neutral white light from the top left, gentle shading, no colored light, no rim light. No cast shadow on the background, no floor, no reflection.

Cells, left to right, top to bottom:
1. A yellow helium party balloon, slightly faded, with its thin white string hanging straight down.
2. The same yellow balloon, burst: a small shriveled piece of rubber on its string, lying flat.
3. An empty round paper party plate, white with a thin yellow and orange border.
4. A single thin birthday candle, white with an orange spiral stripe, standing in a small plastic holder, unlit, wick slightly blackened.
5. A small candle flame alone, warm orange and yellow, teardrop shaped, about the size that would sit on the candle of cell 4. No glow around it.
6. A wrapped gift box, yellow paper with orange polka dots, orange ribbon and bow, closed.
7. The same gift box, opened: lid off and leaning against it, torn wrapping paper, the box empty.
8. A slice of birthday cake on a paper plate like cell 3, yellow sponge, pale frosting, a little dry, a bite missing.
9. A paper party cup knocked over on its side, with a small dried puddle of orange juice.
10. Round analog wall clock, white face, black numbers 1 to 12, thin dark frame, NO hands at all.
11. A second, different wall clock: square, wooden frame, cream face, black numbers 1 to 12, NO hands at all.
12. A crumpled ball of the yellow and orange polka dot wrapping paper from cell 6.
```

| Sprite | Événements |
|---|---|
| `balloon`, `balloon_burst` | GAB-002, 014 (GAB-030 du dossier) |
| `plate` | GAB-003 |
| `candle`, `flame` | GAB-005 (GAB-028 du dossier) |
| `gift_closed`, `gift_open`, `wrapping_paper` | GAB-007, 008, 015 (GAB-029 du dossier) |
| `cake_slice` | GAB-009 |
| `cup_spilled` | GAB-010 |
| `clock`, `clock_alt` | GAB-021 à 025 |

Non couverts : GAB-001 (chaise reculée, découpe), GAB-004, 011 à 015 (Freddy), GAB-006 (son).

### Série Jeremy / Bonnie : dessins

Planche : `images/atlas/src/jeremy_drawings.png`. Atlas : `jeremy_drawings`.

```
Create a single sprite sheet image, 1536x1024, landscape, with a TRANSPARENT background (PNG with alpha). If transparency is not possible, use a perfectly flat pure magenta background (#FF00FF) with no gradient, no texture and no shadow.

Layout: a 4-column by 3-row grid of 12 cells. One sheet of paper per cell, centered, filling about 80% of its cell. Leave generous empty space between sheets. No grid lines, no borders, no labels. No written words or letters anywhere, including on the drawings.

Subject: drawings by the same 7-year-old boy, on the same off-white letter-size paper, slightly yellowed and creased. Wax crayon drawings with thick, simple, wobbly strokes and bold colors, so each drawing stays recognizable when seen very small. Realistic photo-like render of the paper sheets.

Camera: every sheet lies flat and is seen from the same high angle, about 35 degrees from above, like a ceiling-mounted security camera, except cell 12. Same lens.

Lighting: identical for every sheet. Soft, neutral white light from the top left, no colored light. No cast shadow on the background, no table, no reflection.

Cells, left to right, top to bottom:
1. A blank sheet, nothing drawn on it.
2. A big smiling yellow sun with rays, over a strip of green grass.
3. A big brown bear standing, with a small black top hat and a black bow tie, smiling.
4. A big blue-purple rabbit standing, with long ears and a red bow tie, holding a guitar.
5. A simple house with a red roof, a door, two windows and a smoking chimney.
6. A family holding hands: a tall man, a woman and a small boy, all smiling.
7. Five small children standing in a row, holding hands, no faces drawn.
8. A drawing of a smiling sun and a house, crossed out with large angry black scribbles.
9. A sheet torn in two halves, the halves still touching, with half a smiling bear drawing on it.
10. An unfinished drawing: only the outline of a rabbit's head, one ear missing, no color.
11. A birthday cake drawing, half rubbed out with an eraser, gray smudges where the crayon was erased.
12. The yellow sun drawing of cell 2, seen straight on and taped to a wall with two pieces of clear tape at the top corners.
```

### Série Jeremy / Bonnie : matériel

Planche : `images/atlas/src/jeremy_props.png`. Atlas : `jeremy_props`.

```
Create a single sprite sheet image, 1536x1024, landscape, with a TRANSPARENT background (PNG with alpha). If transparency is not possible, use a perfectly flat pure magenta background (#FF00FF) with no gradient, no texture and no shadow.

Layout: a 3-column by 2-row grid of 6 cells. One object per cell, centered, filling about 70% of its cell. Leave generous empty space between objects. No grid lines, no borders, no labels, no text, no numbers anywhere, including on the crayon box.

Subject: a child's drawing supplies from the 1980s, all from the same set, as one coherent collection. Realistic 3D render, wax crayons with paper wrappers, worn and used, a light layer of dust. Slightly desaturated colors.

Camera: every object lies flat and is seen from the same high angle, about 35 degrees from above, like a ceiling-mounted security camera. Same lens, no perspective distortion.

Lighting: identical for every object. Soft, neutral white light from the top left, gentle shading, no colored light, no rim light. No cast shadow on the background, no floor, no reflection.

Cells, left to right, top to bottom:
1. An open cardboard box of wax crayons, plain yellow box with no writing, about ten used crayons of mixed colors inside.
2. A worn pink rubber eraser, rounded corners, gray crayon smudges on one end.
3. A single blue wax crayon lying on its side, tip worn down.
4. A single red wax crayon snapped in two, the two pieces lying side by side and touching.
5. A single green wax crayon lying on its side.
6. A single yellow wax crayon lying on its side, worn very short.
```

| Sprite | Événements |
|---|---|
| `sheet_blank` | JER-001, 008, 020 |
| `drawing_sun`, `drawing_sun_wall` | JER-002, 011, 005 |
| `drawing_bear`, `drawing_rabbit`, `drawing_house`, `drawing_family`, `drawing_five_children` | JER-012, 013, 014, 015, 016 (et JER-010) |
| `drawing_crossed`, `drawing_torn`, `drawing_unfinished`, `drawing_erased` | JER-017, 018, 019, 007 |
| `crayon_box`, `eraser` | JER-003, 007 |
| `crayon_blue`, `crayon_red_broken`, `crayon_green`, `crayon_yellow` | JER-021 à 025 |

Non couverts : JER-004, 009, 026 à 030 (Bonnie), JER-006 (son).

### Série Susie / Chica

Planche : `images/atlas/src/susie_props.png`. Atlas : `susie`.

```
Create a single sprite sheet image, 1536x1024, landscape, with a TRANSPARENT background (PNG with alpha). If transparency is not possible, use a perfectly flat pure green background (#00FF00) with no gradient, no texture and no shadow.

Layout: a 4-column by 3-row grid of 12 cells. One object per cell, centered, filling about 80% of its cell. Leave generous empty space between objects. No grid lines, no borders, no labels, no text, no numbers anywhere, including on the dog bowl and collar.

Subject: belongings of a little girl and her small dog, lost in a 1980s family pizzeria, as one coherent collection. Realistic 3D render, worn and slightly aged, a light layer of dust. Muted colors, pale yellow tones. No green on any object.

Camera: every object is seen from the same high angle, about 35 degrees from above, like a ceiling-mounted security camera. Same lens, no perspective distortion.

Lighting: identical for every object. Soft, neutral white light from the top left, gentle shading, no colored light, no rim light. No cast shadow on the background, no floor, no reflection.

Cells, left to right, top to bottom:
1. A small dented stainless steel dog bowl, empty, upright.
2. The same dog bowl tipped over on its side.
3. A red nylon dog leash with a metal clasp, loosely coiled.
4. The same red leash stretched out loosely on the ground, slightly curved, clasp at one end.
5. A worn red dog collar with a small brass bell, buckle closed, lying in a loop.
6. A short trail of five dusty paw prints of a small dog, gray dust only, walking diagonally away. No dog.
7. A small yellow rubber ball, scuffed, a few bite marks.
8. A pale yellow satin hair ribbon tied in a bow, a little frayed.
9. A ceramic cupcake figurine, about 15 cm tall: pink frosting, pale yellow paper cup, two round black eyes and a small smile on the frosting, a single unlit candle on top. Three-quarter view.
10. The same cupcake figurine facing the camera directly, looking straight at the viewer.
11. The same cupcake figurine in profile, facing left.
12. The same cupcake figurine in three-quarter view like cell 9, with a thin crack running down through the frosting and the paper cup.
```

| Sprite | Événements |
|---|---|
| `bowl`, `bowl_tipped` | SUS-001, 011 |
| `leash_coiled`, `leash_floor` | SUS-002, 012 |
| `collar` | SUS-013 |
| `pawprints` | SUS-014 |
| `ball` | SUS-015 |
| `ribbon` | SUS-009 |
| `cupcake`, `cupcake_front`, `cupcake_side`, `cupcake_cracked` | SUS-005, 016 à 020 (SUS-018 : le cupcake disparaît, aucun sprite) |

Non couverts : SUS-004, 010, 026 à 030 (Chica), SUS-006 (description à écrire), SUS-008 et les sons de la cuisine (caméra audio uniquement, voir « Questions ouvertes »).

### Série Cassidy

Source : tableau « Série Event — CASSIDY / GOLDEN FREDDY » du `Dossier 05 - Cassidy.md`. Ces événements CAS-xxx n'existent pas encore dans `random_events_data.json`, qui ne contient que les sons CASSIDY-01 à 07 : la planche les prépare.

Planche : `images/atlas/src/cassidy_props.png`. Atlas : `cassidy`.

```
Create a single sprite sheet image, 1536x1024, landscape, with a TRANSPARENT background (PNG with alpha). If transparency is not possible, use a perfectly flat pure green background (#00FF00) with no gradient, no texture and no shadow.

Layout: a 2-column by 2-row grid of 4 cells. One element per cell, centered, filling about 70% of its cell. Leave generous empty space between elements. No grid lines, no borders, no labels, no text, no numbers anywhere.

Subject: fragments of a forgotten memory in a 1980s family pizzeria. Realistic, slightly aged, muted colors, faded golden-yellow tones. No green on any element.

Lighting: soft, neutral white light from the top left, no colored light. No cast shadow on the background, no floor, no reflection.

Cells, left to right, top to bottom:
1. The pale face of a little girl, about 8 years old, seen straight on, eyes closed, calm expression, short hair. The face fades softly into transparency at its edges, like a memory. Desaturated, almost gray, slightly blurred, faint horizontal video scan lines across it. Not gory, not monstrous.
2. The same face, broken by a video glitch: cut into horizontal slices shifted left and right, some slices missing.
3. A small worn plush teddy bear, faded golden yellow, about 20 cm tall, sitting upright, button eyes, a few loose threads. Seen from a high angle, about 35 degrees from above, like a ceiling-mounted security camera.
4. The same golden plush bear lying on its side, seen from the same high angle.
```

| Sprite | Événements |
|---|---|
| `face_flash`, `face_glitch` | CAS-007 (visage d'enfant pendant une frame) |
| `plush_golden`, `plush_golden_fallen` | CAS-014 (Foxy place cinq jouets au lieu de quatre : les quatre jouets de l'atlas `foxy` plus celui-ci) |

L'ours doré est une proposition, le dossier ne précise pas le cinquième jouet. Il rappelle Golden Freddy sans le montrer. À valider avec le lore.

Non couverts : CAS-006, 010, 016 (Golden Freddy, découpe des images `_GF` existantes), CAS-011 (cinquième chaise, découpe comme GAB-001), CAS-012 (Bonnie, avec le sprite `drawing_five_children` de Jeremy), CAS-001, 002, 005 et les événements terminal ou audio (effets en code).

### Restaurant

Source : section « Les Anomalies » du `Dossier 06 - Le Restaurant.md` (« Une photo apparaît », « Une cassette ressurgit »). Le dossier ne définit aucun événement : ces sprites serviront aux anomalies transversales à créer.

Planche : `images/atlas/src/restaurant_props.png`. Atlas : `restaurant`.

```
Create a single sprite sheet image, 1536x1024, landscape, with a TRANSPARENT background (PNG with alpha). If transparency is not possible, use a perfectly flat pure green background (#00FF00) with no gradient, no texture and no shadow.

Layout: a 3-column by 2-row grid of 6 cells. One object per cell, centered, filling about 70% of its cell. Leave generous empty space between objects. No grid lines, no borders, no labels, no text, no numbers anywhere, including on the cassette labels.

Subject: forgotten archives of a 1980s family pizzeria, as one coherent collection. Realistic 3D render, worn, slightly yellowed, a light layer of dust. Muted, slightly desaturated colors. No green on any object.

Camera: every object lies flat and is seen from the same high angle, about 35 degrees from above, like a ceiling-mounted security camera, except cell 3, seen straight on as if hanging on a wall. Same lens, no perspective distortion.

Lighting: identical for every object. Soft, neutral white light from the top left, gentle shading, no colored light, no rim light. No cast shadow on the background, no floor, no reflection.

Cells, left to right, top to bottom:
1. A faded instant photo with a white border, showing a blurry children's birthday party in a pizzeria, warm colors, no recognizable faces.
2. The same instant photo lying face down, plain white back, a corner slightly bent.
3. A small wooden picture frame, hanging straight, holding the same faded party photo, glass slightly dusty.
4. An audio cassette tape, black plastic, blank white label with no writing.
5. The same cassette with its brown magnetic tape pulled out and tangled in loose loops.
6. A black VHS videotape in a plain cardboard sleeve, blank white label with no writing.
```

| Sprite | Usage |
|---|---|
| `photo`, `photo_back`, `photo_framed` | « Une photo apparaît » |
| `cassette`, `cassette_unspooled` | « Une cassette ressurgit » ; la bande sortie illustre une archive effacée par le système |
| `vhs` | Archives vidéo (`CAM03_1989.DAT` du mini-jeu de maintenance) |

## Méthode (ancienne : édition d'image complète)

Chaque image cachée est une variante de l'image de base de la caméra : même cadrage, même éclairage, un seul détail changé. Il faut donc faire de l'édition d'image, pas de la génération libre.

1. Ouvrir l'outil d'image (ChatGPT ou API OpenAI) et joindre l'image de base indiquée.
2. Coller le bloc « Style commun » suivi du prompt de l'image.
3. Vérifier que le cadrage n'a pas bougé (superposer avec la base dans un éditeur). Sinon, recommencer ou recoller le détail sur la base.
4. Redimensionner à la taille exacte de la base, exporter en `<ID>.png` dans `images/rooms/<salle>/hidden/`, passer `realised` à `true`.

Les prompts sont en anglais : les modèles d'image les suivent mieux.

Pour les séries (cupcake, horloge), produire d'abord l'image de référence, puis éditer cette référence pour les variantes. Sinon l'objet change de forme d'une image à l'autre.

## Style commun

À coller avant chaque prompt.

```
Edit the attached image. Keep the exact same camera angle, framing, resolution, lighting, colors and every existing object unchanged. This is a dark, grainy 3D render from a 1990s pizzeria security camera at night, in the style of Five Nights at Freddy's 1: low-key lighting, deep shadows, slightly desaturated, subtle noise. Only make the following change, and keep it subtle and realistic, as if it had always been there:
```

## Dining Area (CAM 1B)

Base : `images/rooms/1b_dining_area/1b_b0_c0_f0.jpg`. Dossier : `images/rooms/1b_dining_area/hidden/`.

La base ne contient ni cupcake, ni horloge, ni étagère. Les séries ci-dessous créent ces éléments ; voir « Questions ouvertes ».

### Objets isolés

| ID | Prompt |
|---|---|
| SUS-011 | `A small dented metal dog bowl on the checkered floor between two chairs of the front table, slightly turned, as if someone just pushed it. Base: SUS-001.png (bowl already present) if it exists, otherwise 1b_b0_c0_f0.jpg.` |
| SUS-012 | `A worn red dog leash lying loosely on the floor under the front table, partly in shadow, the clasp catching a little light.` |
| FRT-013 | `A tiny wooden pirate treasure chest, toy-sized, with a brass latch, placed on the front table among the party hats. Lid slightly open.` |
| FRT-015 | `A small plastic pirate captain figurine, child's toy, standing on the front table next to a party hat, facing the camera.` |
| SUS-015 | `A small yellow rubber ball under a chair of the front-left table, half in shadow, barely visible.` |
| FRT-028 | `A small red toy car under the front table, half hidden by the tablecloth, only the front and one wheel visible.` |
| SUS-009 | `A thin yellow satin ribbon lying on the floor in the central aisle between the tables, slightly curled, faintly lit.` |

Noter que l'ajout ne se voit bien que s'il est dans une zone éclairée (tables centrales). Sous les tables, il faut accepter qu'il soit presque invisible ou l'éclairer légèrement.

### Série cupcake

Référence : produire d'abord `_CUPCAKE_REF.png` depuis la base, puis éditer cette référence pour chaque ID.

| ID | Base | Prompt |
|---|---|---|
| _CUPCAKE_REF | `1b_b0_c0_f0.jpg` | `Chica's pink cupcake toy (pink frosting, two large cartoon eyes, single candle, on a small white plate) placed on the front table near the black party hat, facing left toward the empty stage area.` |
| SUS-016 | `_CUPCAKE_REF.png` | `Rotate the cupcake on its plate so its eyes now look directly at the camera. Nothing else changes.` |
| SUS-017 | `_CUPCAKE_REF.png` | `Rotate the cupcake on its plate so its eyes look toward the far right of the room, toward the dark doorway.` |
| SUS-018 | `_CUPCAKE_REF.png` | `Remove the cupcake entirely. The empty plate stays exactly where it was.` |
| SUS-019 | `_CUPCAKE_REF.png` | Pas de prompt : copier la référence telle quelle (le cupcake est revenu). Si l'événement doit montrer une différence, la préciser. |
| SUS-020 | `_CUPCAKE_REF.png` | `Add a thin crack running across the cupcake's frosting and one of its eyes, as if the plastic was aging. Very subtle.` |

### Série horloge

Référence : produire d'abord `GAB-021.png`, puis éditer ce résultat pour les autres.

| ID | Base | Prompt |
|---|---|---|
| GAB-021 | `1b_b0_c0_f0.jpg` | `Add a round analog wall clock with a white face and black hands, hanging on the dark back wall above the tables, faintly lit. It reads 5:45.` |
| GAB-022 | `GAB-021.png` | `Move the minute hand of the clock forward by one minute: it now reads 5:46.` (l'effet « repart quelques secondes » sera animé en code) |
| GAB-023 | `GAB-021.png` | `Add a second, identical wall clock a little to the right of the first one. The first reads 5:45, the second reads 3:10.` |
| GAB-025 | `GAB-021.png` | `The clock now reads exactly 12:00, both hands pointing straight up. Add a faint horizontal video glitch line across the clock.` |

### Bateau

| ID | Base | Prompt |
|---|---|---|
| FRT-017 | `1b_b0_c0_f0.jpg` | `A small wooden toy pirate ship (same toy as in Pirate Cove) sitting on a wall shelf at the back of the room, faintly lit.` |

Le titre dit « change d'étagère » : il faut une image A (bateau sur une étagère) et une image B (autre étagère), ou l'image A existe déjà ailleurs. À trancher.

## Backstage (CAM 5)

Base : `images/rooms/5_backstage/5_b0_c0_f0.jpg`. Dossier : `images/rooms/5_backstage/hidden/`.

| ID | Prompt |
|---|---|
| JER-011 | `A child's crayon drawing of a smiling yellow sun on white paper, taped to the back wall under the hanging animatronic heads. Slightly crumpled, one corner peeling off.` |

## Show Stage (CAM 1A)

Dossier : `images/rooms/1a_show_stage/hidden/`.

| ID | Base | Prompt |
|---|---|---|
| GAB-004 | `1a_b1_c1_f1.jpg` | `Freddy's head is turned down and to the right, looking at a small empty child's chair placed at the front right edge of the stage. Bonnie and Chica unchanged.` |
| SUS-010 | `1a_b1_c1_f1.jpg` | `Chica's head is turned to face the camera directly, eyes looking straight into the lens. Her body does not move. Bonnie and Freddy unchanged.` |
| GAB-024 | `1a_b1_c1_f1.jpg` | `Add a round analog wall clock on the left wall among the cloud decorations, white face, reading 4:00.` (la rotation à l'envers sera animée en code) |

## Questions ouvertes

- Kitchen (SUS-004, SUS-008) : dans FNAF 1, la caméra 6 est « CAMERA DISABLED - AUDIO ONLY ». Une image contredirait le jeu d'origine. Options : pas d'image (événement purement sonore), ou une coupure d'une fraction de seconde où l'image revient, ce qui serait du contenu ajouté. À décider avant de produire.
- SUS-006 (East Hall) : la description est `???`. À écrire avant le prompt.
- Dining Area : cupcake, horloge et étagère n'existent pas dans la base. Les ajouter seulement dans les images cachées est cohérent avec le principe des anomalies, mais une horloge qui apparaît d'un coup est plus visible qu'une horloge bloquée. Alternative : ajouter l'horloge à toutes les variantes de base de 1B.
