# Documentation du projet

Point d'entrée de la documentation de FNAF-JS. Toute la doc de référence vit
ici, dans des dossiers numérotés par thème. Les fichiers à la racine du dépôt
(`todolist.md`, `reste_a_faire`, `markdone`, `scratch_tables.md`) sont du suivi
de tâches et des notes de travail, pas de la documentation.

## Où chercher quoi

| Je cherche | Fichier |
|------------|---------|
| Quel son est joué à quel moment, et pourquoi | [03 - Technique/son.md](03%20-%20Technique/son.md) |
| Comment marche FNAF 1, et ce que le remake en a fait | [00 - Origine/Origine.md](00%20-%20Origine/Origine.md) |
| Les phases de Foxy et leurs seuils | [01 - Game Design/Foxy/](01%20-%20Game%20Design/Foxy/) |
| Le rendu du bureau et le scroll des portes | [01 - Game Design/bureau.md](01%20-%20Game%20Design/bureau.md) |
| Qui est un enfant, à quel animatronic il est lié | [02 - Lore/Catalogue Fazbear/](02%20-%20Lore/Catalogue%20Fazbear/) |
| Les règles d'écriture des logs du terminal | [02 - Lore/CANON_LOGS.md](02%20-%20Lore/CANON_LOGS.md) |
| Les images et sons d'événements à produire | [04 - Production/Evenements_Production.md](04%20-%20Production/Evenements_Production.md) |
| Si un secret est trouvable en pratique | [04 - Production/Evenements_Declenchement.md](04%20-%20Production/Evenements_Declenchement.md) |
| Ce que rapporte une anomalie | [04 - Production/Evenements_Recompenses.md](04%20-%20Production/Evenements_Recompenses.md) |
| Comment éditer les logs du terminal | [_editor_log/README.md](_editor_log/README.md) |
| Comment le générateur transforme un texte en voix | [03 - Technique/voix.md](03%20-%20Technique/voix.md) |
| Comment produire et brancher voix, images, sons, logs | [04 - Production/Carnet_Developpeur.md](04%20-%20Production/Carnet_Developpeur.md) |
| Où en est le projet | [Next/En_Cours.md](Next/En_Cours.md) |
| Ce qui reste à faire | [todolist.md](../../todolist.md) (racine du dépôt) |

## Table des matières

### 00 - Origine

Le point de départ : comment marche FNAF 1, et comment le remake le reprend et le réinterprète.

| Fichier | Contenu |
|---------|---------|
| [Origine.md](00%20-%20Origine/Origine.md) | FNAF 1 côté code (tirages, niveaux d'IA, Freddy, Foxy, énergie), boucles de gameplay, correspondance avec le code du remake, couches ajoutées |
| `archives/` | Anciennes notes de reconstruction (`game.md`, `ia.md`, `batterie.md`), valeurs non fiables |

### 01 - Game Design

Mécaniques de jeu : ce que fait le jeu, et pourquoi.

| Fichier | Contenu |
|---------|---------|
| [bureau.md](01%20-%20Game%20Design/bureau.md) | Audit du rendu du bureau : synchronisation des overlays de portes, repères canvas et DOM |
| [new.md](01%20-%20Game%20Design/new.md) | Pistes de design : Golden Freddy comme indicateur psychologique |
| [Foxy/FOXY_DEBUG_GUIDE.md](01%20-%20Game%20Design/Foxy/FOXY_DEBUG_GUIDE.md) | Boutons de debug de Foxy, phases et agressivité |
| [Foxy/FOXY_INTEGRATION_SUMMARY.md](01%20-%20Game%20Design/Foxy/FOXY_INTEGRATION_SUMMARY.md) | Ce que l'intégration de Foxy a créé et modifié |

### Next

Refonte du lore en cours. [Next/Bible.md](Next/Bible.md) fait foi sur tout le
reste du lore, CANON_LOGS compris en cas de contradiction.
[Next/Parcours_Enquete.md](Next/Parcours_Enquete.md) détaille, nuit par nuit,
ce que le joueur trouve et comprend. [Next/Appel_Nuit5.md](Next/Appel_Nuit5.md)
contient les textes de l'appel de Cassidy, [Next/Fins.md](Next/Fins.md) ceux des trois fins. [Next/Casting_Voix.md](Next/Casting_Voix.md)
dit qui parle, avec quelle voix, dans quel enregistrement.
[Next/Journal_Voix_Son.md](Next/Journal_Voix_Son.md) garde la trace des choix
faits sur les voix et le son. [Next/En_Cours.md](Next/En_Cours.md) donne l'état
d'avancement et la suite, à relire en reprenant le projet. Fichier prévu : Mécaniques du lore.

### 02 - Lore

Contenu narratif : l'histoire, les personnages, les règles d'écriture.

| Fichier | Contenu |
|---------|---------|
| [Tome 1 – Vision & Lore.md](02%20-%20Lore/Tome%201%20–%20Vision%20&%20Lore.md) | Pourquoi ce fangame existe, l'univers des Mensonges |
| [Tome 2 – Les 5 nuits.md](02%20-%20Lore/Tome%202%20–%20Les%205%20nuits.md) | Gameplay de l'enquête, les deux couches de jeu |
| [Tome 3 – Les caméras,.md](02%20-%20Lore/Tome%203%20–%20Les%20caméras,.md) | Rôle narratif des caméras |
| [Tome 4 – Le terminal DOS.md](02%20-%20Lore/Tome%204%20–%20Le%20terminal%20DOS.md) | Rôle narratif du terminal |
| [Tome 5 – Les animatroniques et Cassidy.md](02%20-%20Lore/Tome%205%20–%20Les%20animatroniques%20et%20Cassidy.md) | Ce que raconte le comportement de chaque animatronic |
| [CANON_LOGS.md](02%20-%20Lore/CANON_LOGS.md) | Référentiel des logs du terminal, sources qui font autorité |
| [lore_goldenfeddy.md](02%20-%20Lore/lore_goldenfeddy.md) | Golden Freddy, Cassidy et l'erreur d'identité |
| [Catalogue Fazbear/](02%20-%20Lore/Catalogue%20Fazbear/) | Un dossier par enfant : Gabriel, Jeremy, Susie, Fritz, Cassidy, plus le Restaurant |

### 03 - Technique

Comment le jeu est fait.

| Fichier | Contenu |
|---------|---------|
| [son.md](03%20-%20Technique/son.md) | Catalogue audio, règles de déclenchement, mixer, sons orphelins |
| [voix.md](03%20-%20Technique/voix.md) | Fonctionnement du générateur de voix : du texte au fichier audio, étape par étape |
| `diagram_*.png`, `diagram_*.jpg` | Schémas : animatronic, audio, batterie, caméra, scène, IA de surveillance, cycles de peur |

### 04 - Production

Suivi de ce qui est à produire.

Les quatre fichiers `Evenements_*.md` sont générés par `node tools/vues_evenements.js` à partir des JSON de `script/config/` (`random_events_data.json`, `rewards_data.json`). Ils ne s'éditent pas : on modifie le JSON, puis on relance le script.

| Fichier | Contenu |
|---------|---------|
| [Evenements_Production.md](04%20-%20Production/Evenements_Production.md) | Images et sons d'événements à produire, provisoires ou mal rangés |
| [Evenements_Declenchement.md](04%20-%20Production/Evenements_Declenchement.md) | Nuit, heure, caméra, déclencheur et probabilité réelle de chaque événement |
| [Evenements_Recompenses.md](04%20-%20Production/Evenements_Recompenses.md) | Réserves de récompenses par enfant et chaînes |
| [Evenements_Controle.md](04%20-%20Production/Evenements_Controle.md) | Incohérences entre les données et le plan |
| [Prompts_Images_Cachees.md](04%20-%20Production/Prompts_Images_Cachees.md) | Prompts d'édition d'image pour les images cachées manquantes |
| [Carnet_Developpeur.md](04%20-%20Production/Carnet_Developpeur.md) | Procédures : générer les voix, produire les images et atlas, brancher sons, journaux, logs et événements |

### _editor_log

Outil, pas documentation. Éditeur HTML des logs du terminal, avec son
compilateur vers les `lore-nightX.js` chargés par le jeu.
Voir [_editor_log/README.md](_editor_log/README.md).

### _impression

PDF générés, ne pas éditer. `npm run doc:pdf` imprime les documents de
`03 - Technique/` au style carnet de bord ; `npm run doc:pdf -- <fichier.md>`
imprime un document précis. Plus simple : glisser un ou plusieurs `.md` sur
`tools/impression/imprimer.cmd`, le PDF s'ouvre une fois créé. Outil :
`tools/impression/`.

### projet.md

[projet.md](projet.md) est un carnet de liens et de notes libres (références
FNAF, ressources graphiques, pistes techniques). Pas une source de vérité : la
description d'architecture qu'il contient date d'avant la réorganisation de
`script/`.

## Sources de vérité côté code

Quand la doc et le code divergent, le code fait foi. Les fichiers de référence :

| Sujet | Fichier |
|-------|---------|
| Salles et caméras | `script/config/rooms_config.json` |
| Catalogue audio | `script/config/game_sounds.json` |
| Événements aléatoires | `script/config/random_events_data.json` |
| Cassettes | `script/config/tapes_data.json` |
| Journaux | `script/config/journals_data.json` |
| Logs du terminal | `ressources/logs/*.json` |
