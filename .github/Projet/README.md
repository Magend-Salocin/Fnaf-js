# Documentation du projet

Point d'entrée de la documentation de FNAF-JS. Toute la doc de référence vit
ici, dans des dossiers numérotés par thème. Les fichiers à la racine du dépôt
(`todolist.md`, `reste_a_faire`, `markdone`, `scratch_tables.md`) sont du suivi
de tâches et des notes de travail, pas de la documentation.

## Où chercher quoi

| Je cherche | Fichier |
|------------|---------|
| Quel son est joué à quel moment, et pourquoi | [03 - Technique/son.md](03%20-%20Technique/son.md) |
| Comment se comportent les IA des animatronics | [01 - Game Design/ia.md](01%20-%20Game%20Design/ia.md) |
| Les phases de Foxy et leurs seuils | [01 - Game Design/Foxy/](01%20-%20Game%20Design/Foxy/) |
| Le système de consommation d'énergie | [01 - Game Design/batterie.md](01%20-%20Game%20Design/batterie.md) |
| Le rendu du bureau et le scroll des portes | [01 - Game Design/bureau.md](01%20-%20Game%20Design/bureau.md) |
| Qui est un enfant, à quel animatronic il est lié | [02 - Lore/Catalogue Fazbear/](02%20-%20Lore/Catalogue%20Fazbear/) |
| Les règles d'écriture des logs du terminal | [02 - Lore/CANON_LOGS.md](02%20-%20Lore/CANON_LOGS.md) |
| La liste complète des anomalies à produire | [04 - Production/Anomalie.md](04%20-%20Production/Anomalie.md) |
| Si un secret est trouvable en pratique | [04 - Production/Rapport_Probabilites_Secrets.md](04%20-%20Production/Rapport_Probabilites_Secrets.md) |
| Comment éditer les logs du terminal | [_editor_log/README.md](_editor_log/README.md) |
| Ce qui reste à faire | [todolist.md](../../todolist.md) (racine du dépôt) |

## Table des matières

### 00 - Vision

Vide. La vision du projet est pour l'instant dans
[02 - Lore/Tome 1 – Vision & Lore.md](02%20-%20Lore/Tome%201%20–%20Vision%20&%20Lore.md).

### 01 - Game Design

Mécaniques de jeu : ce que fait le jeu, et pourquoi.

| Fichier | Contenu |
|---------|---------|
| [game.md](01%20-%20Game%20Design/game.md) | Reconstruction du fonctionnement de FNAF 1 : machine à états, timers, probabilités |
| [ia.md](01%20-%20Game%20Design/ia.md) | Architecture commune aux IA d'animatronics, schémas de décision |
| [batterie.md](01%20-%20Game%20Design/batterie.md) | Système de consommation d'énergie de FNAF 1, niveaux d'usage |
| [bureau.md](01%20-%20Game%20Design/bureau.md) | Audit du rendu du bureau : synchronisation des overlays de portes, repères canvas et DOM |
| [new.md](01%20-%20Game%20Design/new.md) | Pistes de design : Golden Freddy comme indicateur psychologique |
| [Foxy/FOXY_DEBUG_GUIDE.md](01%20-%20Game%20Design/Foxy/FOXY_DEBUG_GUIDE.md) | Boutons de debug de Foxy, phases et agressivité |
| [Foxy/FOXY_INTEGRATION_SUMMARY.md](01%20-%20Game%20Design/Foxy/FOXY_INTEGRATION_SUMMARY.md) | Ce que l'intégration de Foxy a créé et modifié |

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
| `diagram_*.png`, `diagram_*.jpg` | Schémas : animatronic, audio, batterie, caméra, scène, IA de surveillance, cycles de peur |

### 04 - Production

Suivi de ce qui est à produire.

| Fichier | Contenu |
|---------|---------|
| [Anomalie.md](04%20-%20Production/Anomalie.md) | Tableau complet des anomalies : ID, salle, nuit, heure, chance, son, image |
| [Tableau_Production_Regroupe_Par_Nuit.md](04%20-%20Production/Tableau_Production_Regroupe_Par_Nuit.md) | Le même tableau, regroupé par nuit |
| `Tableau_Production_Regroupe_Par_Nuit.csv` / `.xls` | Sources éditables du tableau |
| [Rapport_Probabilites_Secrets.md](04%20-%20Production/Rapport_Probabilites_Secrets.md) | Analyse du moteur d'événements : quels secrets sont réellement trouvables |

### _editor_log

Outil, pas documentation. Éditeur HTML des logs du terminal, avec son
compilateur vers les `lore-nightX.js` chargés par le jeu.
Voir [_editor_log/README.md](_editor_log/README.md).

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
