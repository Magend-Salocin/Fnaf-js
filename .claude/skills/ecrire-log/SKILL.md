---
name: ecrire-log
description: Écrit ou modifie un log du terminal DOS (ressources/logs/<CMD>.json) conforme au canon CANON_LOGS et validé par check_logs.js. À utiliser pour toute nouvelle commande terminal, toute réécriture de log ou tout événement caché qui référence une commande terminal.
argument-hint: "<COMMANDE> [intention]"
---

# Écrire un log du terminal

Argument : le nom de la commande en majuscules (par exemple `LOST_PETS`), et l'intention narrative si l'utilisateur l'a donnée.

## Étapes

1. Lire `.github/Projet/02 - Lore/CANON_LOGS.md` en entier. Il fixe les dates, les personnages, les salles, les objets, les comptages et la maquette (section 8).
2. Si le log touche aux enfants, au personnel ou à la chronologie, déléguer à l'agent `gardien-lore` la collecte des faits nécessaires dans les Tomes et le Catalogue Fazbear, plutôt que de lire tous les Tomes ici.
3. Prendre comme modèle un log existant de la même catégorie (rapport, archive, personnel, objets perdus, caméras, maintenance ; voir le Tome 4). Garder exactement sa structure JSON et sa maquette.
4. Rédiger le texte. Appliquer la « règle du doute » du Tome 4 : le document administratif ne dit jamais tout, il laisse le joueur conclure.
5. Pour une nouvelle commande, ajouter son nom dans `logFiles` de `script/config/logs_database.json`. Le nom respecte `^[A-Z0-9_]+$`.
6. Lancer `node ".github/Projet/_editor_log/check_logs.js"` et corriger jusqu'à zéro erreur. Ne jamais contourner le validateur : si une règle semble fausse, la signaler à l'utilisateur.
7. Si un événement de `random_events_data.json` doit débloquer cette commande, renseigner son champ `terminal`, puis vérifier la sortie `[ConfigValidator]` au lancement.

## Résultat attendu

Indiquer le fichier créé ou modifié, le résultat du validateur et les faits de lore utilisés, avec leur source, pour que l'utilisateur puisse relire.
