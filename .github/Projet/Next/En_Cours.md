# En cours

État de la refonte du lore et des voix au 18/11/2026. À relire en reprenant le projet ; à mettre à jour à la fin de chaque séance.

---

## 1. Fait

| Sujet | Où |
| --- | --- |
| Bible : 14 décisions de lore, personnages, nuits, fins | [Bible.md](Bible.md) |
| Parcours d'enquête nuit par nuit, chaînes validées | [Parcours_Enquete.md](Parcours_Enquete.md) |
| Textes de l'appel de Cassidy (A, B, C) | [Appel_Nuit5.md](Appel_Nuit5.md) |
| Trois fins A, B, C écrites et générées, à la place de TAPE_ERREUR_08 et 09 ; voix seules des quatre enfants | [Fins.md](Fins.md), `ressources/voix/textes/fin_*.txt` |
| Casting des voix | [Casting_Voix.md](Casting_Voix.md) |
| Générateur de voix, 3 appels, 19 cassettes et 3 fins générés | `tools/voix/`, `ressources/voix/`, [Journal_Voix_Son.md](Journal_Voix_Son.md) |
| Affiche française de la nuit 5 déclarée dans `assets.json` | Non commité |
| Carnet du développeur : procédures voix, images, sons, logs, événements | `04 - Production/Carnet_Developpeur.md` |
| Atlas découpés : gabriel, jeremy_props, susie, cassidy, restaurant (en plus de foxy) | `images/atlas/` |
| Cassettes générées branchées dans le jeu, appel de Cassidy en nuit 5 (choix de version provisoire) | `index.html`, `game_sounds.json`, `night.js` |
| Vérificateur d'images `tools/check_assets.js` | Carnet, section 2 |
| Modèle des récompenses, codé : l'anomalie donne la prochaine récompense de la réserve de son enfant, ouvre le log de sa chaîne ; la fin de chaîne attend le log lu ; les logs de révélation s'ouvrent par la nuit (`minNight`). Testé par simulation, jeu lancé sans erreur | [Parcours_Enquete.md](Parcours_Enquete.md), sections 2 et 8 ; `script/core/rewards.js`, `script/config/rewards_data.json` |
| Maillons des chaînes repointés : GAB-001, JER-001, SUS-001, FRT-001 ouvrent leur log de chaîne ; TAPE_*_03 sur GAB-014, JER-015, SUS-027 | `random_events_data.json` |
| JSON source unique des événements. Ancien tableau de production (.md, .csv, .xls), Anomalie.md et rapport de probabilités supprimés, remplacés par quatre vues générées | `node tools/vues_evenements.js` → `04 - Production/Evenements_*.md` |
| Chaîne de Cassidy : traces CASSIDY-08 (créé), JER-016, CASSIDY-09 (créé) ouvrent MEMORY ; CASSIDY-07 en fin de chaîne ; CASSIDY-06 et 07 en nuit 5 | Parcours_Enquete.md, section 5 ; `rewards_data.json` |
| JER-021, 023, 025 restent au West Hall avec JER-022 et 024, déjà dessinés là, pour garder la série des crayons dans une seule salle. Images à refaire, `realised` repassé à `false` | `Evenements_Production.md` |
| 8 événements legacy gardés (variantes rares, affichées seulement si l'animatronique est dans la salle), `chance` de 0.5 à 0.05 | `random_events_data.json` |

## 2. À valider

- Textes des fins A, B, C, condition de la fin A (joueur qui n'a rien trouvé ni corrigé), écoute de `fin_*.wav` et des voix seules des enfants.
- Écoute des 19 cassettes, en particulier les bruitages approximatifs (porte, tables, interrupteur, musique d'anniversaire) et les profils encore jamais écoutés seuls (`fritz_echo`).
- Écran de 6 h : sélection des anomalies montrées, lien avec les chaînes (corriger un maillon le casse-t-il ?), calcul des fins, anomalie déjà jugée, ordre en nuit 5.
- Nuits minimales des cassettes et logs bonus dans les réserves (reprises des anciens événements).
- Paliers du Director de Cassidy, libellé `CONSERVER`.
- Niveaux d'IA réduits pour la nuit 5 en version B.

## 3. À faire, par ordre proposé

1. Produire : images de JER-021, 023, 025 au West Hall et de CASSIDY-09, son de CASSIDY-08, descriptions des 8 événements legacy (`Evenements_Production.md`, `Evenements_Controle.md`).
2. Fins : brancher `fin_{A,B,C}.wav` dans `ending.js` (qui attend encore deux vidéos absentes), après l'écran de correction de la nuit 5.
3. Versions anglaises : textes des appels, puis des cassettes, puis génération avec une voix anglaise.
4. Passage des dates à 1985 et 1993 : CANON_LOGS, les 34 logs, `check_logs.js`. Y intégrer `A-003` (Antoine M.), le Phone Guy en `003` (dernier accès le 04/11/1993), et la disparition des deux premiers enfants un vendredi avant le 26/06/1985.
5. Moteur : appel de la nuit 5 d'après les maillons de chaîne au lieu des cassettes, `secretPool` des nuits 2 à 5. Tester en jeu une partie complète avec le nouveau modèle de récompenses.
6. Écran de 6 h (corriger ou conserver), sauvegarde de l'enquête, Director de Cassidy, Golden Freddy.
7. Nuit 5 selon la version (A, B, C) et ses images de salles.
8. Chèque de paie au nom de Mike Schmidt, retrait du libellé Custom Night.

## 4. Questions ouvertes

- `rooms_config.json` déclare `images/rooms/the_office/default.png`, absent du disque.
- 22 images de `images/rooms/` ne sont utilisées nulle part (anciennes images remplacées par l'atlas de Foxy, essais `_event`, `_GF`...) : liste par `node tools/check_assets.js`. À trier : supprimer ou rebrancher.
- Placement des sprites des nouveaux atlas sur leurs événements (`layers`) : coordonnées à caler salle par salle.
- Planche `jeremy_drawings.png` à générer.

- Qui sont les deux premiers enfants disparus un vendredi soir (affiche de la nuit 2) ?
- Les transcriptions de `ressources/Tape/*.txt` servent-elles encore à l'affichage ? Si oui, y reporter les changements (étiquettes SUS au féminin, attributions du casting).
- Encodage des audios en MP3 pour alléger le dépôt (83 Mo de WAV) : nécessite ffmpeg.
- Ajouter à `CLAUDE.md` l'exception à la fidélité FNAF 1 pour la nuit 5 en version B et C.
