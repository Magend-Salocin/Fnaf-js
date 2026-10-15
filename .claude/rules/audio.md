---
paths:
  - "audio/**"
  - "script/config/game_sounds.json"
  - "script/core/sounds.js"
---

# Audio

- Les fichiers de `audio/` ont été renommés et souvent réencodés par rapport aux ressources de FNAF 1 (`XSCREAM.ogg` est `XSCREAM.wav`, `Put_down.ogg` est `put down.wav`). Une différence de nom, d'extension ou de séparateur n'est pas une preuve d'absence : faire le rapprochement avant de déclarer un son manquant.
- Rapprocher aussi par rôle : le rire de Freddy (`Fredlaugh1` à `5` dans les docs externes) correspond à `laugh_girl1`, `laugh_girl1d`, `laugh_girl2d` et `laugh_girl8d`.
- Un son est déclaré à deux endroits qui doivent rester cohérents : une balise `<audio>` dans `index.html` (classe en kebab-case) et une entrée dans `game_sounds.json` dont le `selector` pointe sur cette classe.
- `mixVolume` est calé sur le tableau de référence de FNAF 1 (`.github/Projet/03 - Technique/son.md`, section 7). Le validateur refuse les valeurs hors de 0 à 1,5.
- `playSound()` coupe le son avant de le relancer : deux lectures du même id ne se superposent pas.
- Tenir `.github/Projet/03 - Technique/son.md` à jour quand un déclenchement change.

Pour ajouter un son d'événement caché, utiliser le skill `ajouter-son`.
