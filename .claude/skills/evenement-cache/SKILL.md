---
name: evenement-cache
description: Ajoute ou modifie un événement aléatoire caché (GAB, JER, SUS, FRT, CASSIDY) dans random_events_data.json, avec son image, son son, son journal, sa cassette ou sa commande terminal. À utiliser pour créer un événement, brancher l'image d'un événement existant ou écrire sa fiche de production.
argument-hint: "<ID> [description]"
---

# Événement caché

Argument : l'id de l'événement (par exemple `SUS-006`). Le préfixe désigne l'enfant et l'animatronic associé : `GAB` Gabriel (Freddy), `JER` Jeremy (Bonnie), `SUS` Susie (Chica), `FRT` Fritz (Foxy), `CASSIDY` la ligne secrète.

## Champs d'un événement

Copier la structure d'un événement existant de la même série. Valeurs reconnues :

- `type` : `Screen`, `Son`, `Animation`, `Décor`, `IA`, `Overlay`, `Objet`, `Glitch`.
- `roomLabel` : une clé de `EVENT_ROOM_MAP` (`script/loaders/random_events_data.js`). Elle donne la caméra et le dossier de l'image. Un label absent de la table rend l'événement non restreint à une caméra.
- `triggerStr` : `Observer`, `Observer 8 s`, `Écoute`, `Écoute 10 s`, `Retour caméra`, `Retour écoute`, `Silence`, `Heure` (voir `parseTrigger()`).
- `hourStr` : `Toute nuit`, `02h00–03h00`, `04h`... (voir `parseHourRange()`).
- `sound` : un id de `game_sounds.json`. `laugh_girl1` signale un son provisoire.
- `journal`, `tape`, `terminal` : un code de `journals_data.json`, de `tapes_data.json`, ou une commande de `logs_database.json`. Sinon `null`.
- `realised` : `true` quand l'image existe (ou, sans image, quand le son n'est plus provisoire).

## Étapes

1. Vérifier si l'id existe déjà dans `random_events_data.json` et dans `.github/Projet/04 - Production/Tableau_Production_Regroupe_Par_Nuit.md`. Un id en double écrase silencieusement l'entrée précédente.
2. Pour le lore (champ `lore`, description), vérifier la cohérence avec le dossier de l'enfant dans `.github/Projet/02 - Lore/Catalogue Fazbear/`. En cas de doute, déléguer à l'agent `gardien-lore`.
3. Image : `images/rooms/<dossier>/hidden/<ID>.png`, où le dossier vient de `EVENT_ROOM_MAP`. Si l'image n'existe pas encore, rédiger une fiche de production : salle et caméra, élément ajouté ou modifié, ce que le joueur doit remarquer, niveau de discrétion.
4. Si l'événement a besoin d'un son absent, laisser `laugh_girl1`, ajouter le son à la section « Sons manquants » de `todolist.md`, et utiliser le skill `ajouter-son` quand le fichier arrive.
5. Si l'événement débloque un log, utiliser le skill `ecrire-log`.
6. Mettre à jour le tableau de production et `.github/Projet/04 - Production/Anomalie.md` si l'événement y est listé.
7. Lancer le jeu et vérifier la sortie `[ConfigValidator]`. Cocher ou ajouter la tâche correspondante dans `todolist.md`.
