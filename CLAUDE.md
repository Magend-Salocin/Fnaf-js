# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Remake de Five Nights at Freddy's 1 en JavaScript, empaqueté avec Electron. Code, commentaires et documentation sont en français.

## Commandes

- `npm start` : lance le jeu dans Electron. Les DevTools s'ouvrent automatiquement et les `console.*` du renderer sont recopiés dans le terminal avec le préfixe `[Renderer]`.
- `npm run build` : installeur Windows (NSIS) dans `dist/`.
- `node ".github/Projet/_editor_log/check_logs.js"` : valide `ressources/logs/*.json` contre le canon. À lancer après toute modification d'un log.

Il n'y a ni tests, ni lint, ni bundler.

## Architecture

Scripts classiques chargés par des balises `<script>` dans `index.html`, sans modules ES ni `import`. Tout passe par des globales partagées (`rooms`, `roomsArray`, `cameras`, `power`, `activeView`, `gameTime`, `animatronics`...). L'ordre des balises dans `index.html` est donc une dépendance : un nouveau fichier doit y être ajouté au bon endroit, après ce qu'il utilise.

Ordre des couches : `loaders` → `state` → `core` → `lore` → `app/render.js` → `mechanics` → `app/game_loop.js` → `app/main.js` → `debug`.

- `script/config/*.json` : toutes les données de jeu (salles, sons, événements aléatoires, cassettes, journaux, traductions...). Pour modifier un contenu, éditer le JSON, pas le loader.
- `script/loaders/` : un loader par JSON, en `XMLHttpRequest` synchrone. C'est voulu : `fetch()` ne marche pas en `file://` sous Electron, et les scripts suivants utilisent les données dès leur exécution. En `file://`, un chargement réussi renvoie le statut 0.
- `script/loaders/rooms_config.js` : source unique des salles, caméras et parasites. `data.js` en dérive les API historiques `rooms`, `roomsArray` et `cameras`.
- `script/state/game_config.json` : niveaux d'IA par nuit (`nightAiLevels`).
- `script/core/config_validator.js` : audite les JSON au démarrage (ids dupliqués, références audio, caméra, terminal invalides) et signale les problèmes avec `console.warn` sans bloquer le jeu. Lire ces avertissements après une modification de données.
- `script/core/unused/` : fonctionnalités complètes mais non chargées.
- Boucle : `Start` → transition → `startNight` → `setInterval(gameLoop)`, qui appelle énergie, caméra (rendu, événements aléatoires, parasites), horloge, puis `animatronic.move()` et `attack()`.
- Terminal de lore (`script/lore/`) : chaque commande est pilotée par `ressources/logs/<CMD>.json`, déclarée dans `script/config/logs_database.json`.
- `main.js` et `preload.js` (processus Electron) n'exposent que l'IPC de l'éditeur de logs (`window.logEditor`, `logs:load` et `logs:save`). L'éditeur est `.github/Projet/_editor_log/editor.html`, accessible depuis l'écran d'accueil.
- Localisation FR/EN : `script/config/translations.json`, appliquée par `applyLanguage()` dans `script/core/language.js`. Tout nouveau texte affiché doit avoir ses deux traductions.
- `script/debug/` et les boutons debug de `index.html` (forcer une phase de Foxy, gagner la nuit, game over) servent aux tests manuels.

## Règles du projet

Le jeu de base (mécaniques, sons, animatronics) reste fidèle à FNAF 1. Le contenu original (événements cachés, cassettes, terminal, ligne Cassidy) est une couche ajoutée par-dessus et n'est pas soumis à cette règle.

Les règles détaillées sont dans `.claude/rules/` et se chargent selon les fichiers touchés : logs du terminal, audio, animatronics, données de config, documentation.

Outils du projet :

- Skills : `/ajouter-son`, `/ecrire-log`, `/evenement-cache`.
- Agents (lecture seule) : `auditeur-fnaf1` pour comparer au jeu d'origine, `gardien-lore` pour vérifier ou collecter le canon narratif.

## Documentation

La documentation de référence vit dans `.github/Projet/`, en dossiers numérotés (Game Design, Lore, Technique, Production). L'index est `.github/Projet/README.md`. Avant d'écrire un document, vérifier s'il y en a déjà un sur le sujet et le compléter plutôt que de créer un fichier à la racine. Les Tomes de lore sont longs : ne lire que celui qui concerne la tâche.

À la racine, `todolist.md` (tâches cochables) et `reste_a_faire` (détail et procédures) servent au suivi. `markdone` est un rapport d'architecture et `scratch_tables.md` contient des notes de travail. Cocher dans `todolist.md` les tâches terminées.
