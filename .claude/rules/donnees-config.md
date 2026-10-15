---
paths:
  - "script/config/**"
  - "script/loaders/**"
  - "script/core/config_validator.js"
---

# Données de configuration

- Le contenu se modifie dans `script/config/*.json`. Les loaders ne contiennent que le chargement et la transformation.
- Les loaders utilisent `XMLHttpRequest` synchrone, volontairement : `fetch()` échoue en `file://` sous Electron et les scripts suivants lisent les données dès leur exécution. Ne pas les rendre asynchrones.
- Les JSON sont indentés à 2 espaces, avec un saut de ligne final. Une réécriture par `JSON.stringify(data, null, 2) + "\n"` conserve la mise en forme.
- Après une modification, lancer le jeu et lire la sortie `[ConfigValidator]` dans le terminal. Une nouvelle catégorie d'incohérence possible mérite un contrôle dans `config_validator.js`.
- Tout texte affiché au joueur a ses deux traductions, `fr` et `en`, dans `translations.json`.
- `random_events_data.json` dérive du tableau de production (`.github/Projet/04 - Production/Tableau_Production_Regroupe_Par_Nuit.*`) : garder les deux synchronisés.
- `realised` vaut `true` quand l'image de l'événement existe, ou, pour un événement purement sonore, quand son son n'est plus le provisoire `laugh_girl1`.
