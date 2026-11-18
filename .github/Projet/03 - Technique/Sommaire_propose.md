# 03 - Technique : sommaire proposé

Proposition du 18/11/2026, à valider. Ce dossier décrit le code tel qu'il marche aujourd'hui, pas ce qui reste à construire (ça reste dans `Next/`). Existant : `son.md`, `voix.md`, neuf schémas `diagram_*`.

| # | Document | Contenu | Schéma ciblé |
| --- | --- | --- | --- |
| 1 | `architecture.md` | Scripts classiques sans modules, globales partagées, ordre de chargement dans `index.html` (loaders, state, core, lore, render, mechanics, game_loop, main, debug), processus Electron et IPC de l'éditeur de logs | Couches et dépendances entre dossiers de `script/` |
| 2 | `donnees.md` | Les JSON de `script/config/`, leur loader, chargement synchrone en `file://`, `config_validator.js` et ses avertissements | Carte JSON vers loader vers module qui les consomme |
| 3 | `boucle_de_jeu.md` | Accueil, transition, `startNight`, `gameLoop` (énergie, caméra, horloge, déplacements, attaques), 6 h, game over | Séquence d'une nuit, puis d'une frame de la boucle |
| 4 | `animatroniques.md` | Niveaux d'IA par nuit, tirages de déplacement, attaque, cas de Foxy (renvoi vers `00 - Origine/Origine.md` pour FNAF 1) | Machine à états d'un animatronique (reprend `diagram_animatronic.png`) |
| 5 | `bureau_et_cameras.md` | Rendu du bureau, portes, lumières, tablette, caméras, parasites, énergie | Flux énergie (reprend `diagram_batterie.png`) et pile de rendu d'une caméra |
| 6 | `evenements_aleatoires.md` | `random_events_engine.js` : conditions (nuit, heure, caméra), probabilité, couches d'image et son, `requiresEvent`, maillons de chaînes | Arbre de décision d'un tirage d'anomalie |
| 7 | `collectibles.md` | Cassettes, journaux, récompenses et fin actuelle (`ending.js`) tels que codés aujourd'hui | Ce qu'une anomalie vue déclenche aujourd'hui |
| 8 | `terminal.md` | Terminal rétro, commandes pilotées par `ressources/logs/*.json`, `logs_database.json`, éditeur de logs, `check_logs.js` | Commande tapée vers JSON vers affichage |
| 9 | `son.md` | Existant | `diagram_audio.jpg` |
| 10 | `voix.md` | Existant | Chaîne texte vers synthèse vers effets vers mixage |
| 11 | `localisation.md` | `translations.json`, `applyLanguage()`, règle des deux langues | Aucun |
| 12 | `outils.md` | Scripts de `tools/` : voix, vues des événements, `check_assets.js`, impression PDF, build Electron | Aucun |

Priorité proposée : 1, 3, 6 et 7. Les fins, l'écran de 6 h et le Director y entreront une fois codés.

Format des schémas : Mermaid dans le Markdown (lisible dans VS Code et sur GitHub, modifiable comme du texte), plutôt que de nouvelles images.
