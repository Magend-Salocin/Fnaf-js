---
name: ajouter-son
description: Câble un nouveau son d'événement caché dans le jeu (fichier dans audio/hidden/, catalogue game_sounds.json, balise audio dans index.html, remplacement du laugh_girl1 provisoire dans random_events_data.json). À utiliser quand un fichier son arrive ou quand l'utilisateur demande d'ajouter ou de brancher un son de la todolist.
argument-hint: "<id du son> [fichier]"
---

# Ajouter un son d'événement caché

Argument : l'id du son tel qu'il apparaît dans `todolist.md` (par exemple `wood`), et éventuellement le nom du fichier.

## Étapes

1. Trouver le fichier dans `audio/hidden/`. S'il est absent, s'arrêter et demander à l'utilisateur de le déposer : ne jamais câbler un son sans fichier. Si le nom diffère de l'id, faire le rapprochement (voir la rule `audio`).
2. Vérifier que l'id n'existe pas déjà dans `script/config/game_sounds.json`. S'il existe, le réutiliser au lieu d'en créer un second.
3. Ajouter l'entrée au catalogue, à la suite des autres sons `misc` :
   ```json
   {
     "id": "wood",
     "selector": ".wood",
     "category": "misc",
     "description": "Craquement de bois",
     "mixVolume": 0.8
   }
   ```
   `selector` est l'id en kebab-case précédé d'un point (`clock_error` donne `.clock-error`). Partir de 0.8 pour `mixVolume`, comme les autres bruitages cachés, et signaler que le niveau est à valider à l'oreille.
4. Ajouter la balise dans le bloc `<!-- Hidden -->` de `index.html` :
   ```html
   <audio preload="metadata" class="wood" src="audio/hidden/wood.wav"></audio>
   ```
5. Dans `script/config/random_events_data.json`, remplacer `"sound": "laugh_girl1"` par le nouvel id pour chaque événement listé en face du son dans `todolist.md`, et seulement ceux-là. Vérifier chaque id d'événement plutôt que de remplacer en masse.
6. Pour un événement purement sonore (`"image": null`), passer `realised` à `true`.
7. Lancer le jeu (`npm start`) et vérifier que `[ConfigValidator]` ne signale rien.
8. Cocher le son dans `todolist.md` et mettre à jour le décompte en tête de section. Mettre à jour `.github/Projet/03 - Technique/son.md` si le décompte des sons provisoires y figure.

## Résultat attendu

Indiquer les événements modifiés, le `mixVolume` choisi et ce qui reste à écouter en jeu.
