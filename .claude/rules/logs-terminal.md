---
paths:
  - "ressources/logs/**"
  - "script/config/logs_database.json"
---

# Logs du terminal

Chaque `ressources/logs/<CMD>.json` est un document interne de Fazbear Entertainment affiché par le terminal DOS. Tous suivent la même maquette, sans variation d'un fichier à l'autre : même en-tête, même bloc d'identification, sections numérotées, champs alignés à conducteur de points, même pied de page. Une différence de mise en page casse l'illusion d'une administration unique.

- Lire `.github/Projet/02 - Lore/CANON_LOGS.md` avant d'écrire : dates (section 1 et 2), personnages (3), salles (4), objets (5), comptages (6), maquette (8).
- Après toute modification, lancer `node ".github/Projet/_editor_log/check_logs.js"` et corriger jusqu'à zéro erreur. Le validateur contrôle largeurs, colonne des valeurs, numérotation et vocabulaire.
- Une nouvelle commande doit aussi être déclarée dans `logFiles` de `script/config/logs_database.json`, sinon le terminal ne la charge pas.
- Le nom de fichier respecte `^[A-Z0-9_]+$` (contrainte de l'IPC `logs:save` dans `main.js`).
- Pour harmoniser, faire évoluer le canon et le validateur, pas retoucher les fichiers un par un.

Pour écrire un log de bout en bout, utiliser le skill `ecrire-log`.
