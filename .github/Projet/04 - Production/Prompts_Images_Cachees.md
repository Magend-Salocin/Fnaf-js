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
