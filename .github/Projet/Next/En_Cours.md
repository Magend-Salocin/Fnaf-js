# En cours

État de la refonte du lore et des voix au 17/11/2026. À relire en reprenant le projet ; à mettre à jour à la fin de chaque séance.

---

## 1. Fait

| Sujet | Où |
| --- | --- |
| Bible : 14 décisions de lore, personnages, nuits, fins | [Bible.md](Bible.md) |
| Parcours d'enquête nuit par nuit, chaînes validées | [Parcours_Enquete.md](Parcours_Enquete.md) |
| Textes de l'appel de Cassidy (A, B, C) | [Appel_Nuit5.md](Appel_Nuit5.md) |
| Casting des voix | [Casting_Voix.md](Casting_Voix.md) |
| Générateur de voix, 3 appels et 21 cassettes générés | `tools/voix/`, `ressources/voix/`, [Journal_Voix_Son.md](Journal_Voix_Son.md) |
| Affiche française de la nuit 5 déclarée dans `assets.json` | Non commité |
| Carnet du développeur : procédures voix, images, sons, logs, événements | `04 - Production/Carnet_Developpeur.md` |
| Atlas découpés : gabriel, jeremy_props, susie, cassidy, restaurant (en plus de foxy) | `images/atlas/` |
| Cassettes générées branchées dans le jeu, appel de Cassidy en nuit 5 (choix de version provisoire) | `index.html`, `game_sounds.json`, `night.js` |
| Vérificateur d'images `tools/check_assets.js` | Carnet, section 2 |

## 2. À valider

- Écoute des 21 cassettes, en particulier les bruitages approximatifs (porte, tables, interrupteur, musique d'anniversaire) et les profils encore jamais écoutés seuls (`fritz_echo`).
- Parcours d'enquête, hors chaînes : répartition des 34 logs par nuit, écran de 6 h.
- Paliers du Director de Cassidy, libellé `CONSERVER`.
- Niveaux d'IA réduits pour la nuit 5 en version B.

## 3. À faire, par ordre proposé

1. Commiter `.github/Projet/Next/`, l'index de la doc, la todolist et le correctif de l'affiche de la nuit 5 (toujours en attente).
2. Brancher les nouveaux audios dans le jeu : chemins de `game_sounds.json`, balises de `index.html`. Les cassettes 08 et 09 attendent le système de fins.
3. Versions anglaises : textes des appels, puis des cassettes, puis génération avec une voix anglaise.
4. Passage des dates à 1985 et 1993 : CANON_LOGS, les 34 logs, `check_logs.js`. Y intégrer `A-003` (Antoine M.), le Phone Guy en `003` (dernier accès le 04/11/1993), et la disparition des deux premiers enfants un vendredi avant le 26/06/1985.
5. Moteur : champ `minNight` des logs, prérequis « log lu » des chaînes, réaffectation des champs `terminal`.
6. Écran de 6 h (corriger ou conserver), sauvegarde de l'enquête, Director de Cassidy, Golden Freddy.
7. Nuit 5 selon la version (A, B, C) et ses images de salles.
8. Chèque de paie au nom de Mike Schmidt, retrait du libellé Custom Night.

## 4. Questions ouvertes

- JER-021, JER-023, JER-025 : images dessinées sur le Supply Closet (`3_supply_closet/hidden/`), mais événements rattachés au West Hall depuis septembre. Elles ne s'affichent pas. Remettre le `roomLabel` à « Supply Closet », ou refaire les images sur le West Hall ?
- `rooms_config.json` déclare `images/rooms/the_office/default.png`, absent du disque.
- 22 images de `images/rooms/` ne sont utilisées nulle part (anciennes images remplacées par l'atlas de Foxy, essais `_event`, `_GF`...) : liste par `node tools/check_assets.js`. À trier : supprimer ou rebrancher.
- Placement des sprites des nouveaux atlas sur leurs événements (`layers`) : coordonnées à caler salle par salle.
- Planche `jeremy_drawings.png` à générer.

- Qui sont les deux premiers enfants disparus un vendredi soir (affiche de la nuit 2) ?
- Les transcriptions de `ressources/Tape/*.txt` servent-elles encore à l'affichage ? Si oui, y reporter les changements (étiquettes SUS au féminin, attributions du casting).
- Encodage des audios en MP3 pour alléger le dépôt (83 Mo de WAV) : nécessite ffmpeg.
- Ajouter à `CLAUDE.md` l'exception à la fidélité FNAF 1 pour la nuit 5 en version B et C.
