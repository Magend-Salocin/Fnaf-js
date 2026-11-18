---
name: imprimer-doc
description: Imprime un ou plusieurs documents Markdown du projet en PDF, au style carnet de bord (papier vieilli, couverture « Manuel du gardien », sections encadrées, page de notes). À utiliser quand l'utilisateur demande d'imprimer, d'exporter ou de passer un document en PDF.
argument-hint: "<fichier.md | nom approché | dossier> [...]"
---

# Imprimer un document en PDF

Argument : un ou plusieurs chemins de fichiers `.md` ou de dossiers, ou un nom approché (`voix`, `son`, `Bible`). Sans argument : tous les documents de `.github/Projet/03 - Technique/`.

## Étapes

1. Résoudre chaque argument en chemin de fichier :
   - un chemin existant (fichier ou dossier) est pris tel quel ;
   - un nom approché est cherché parmi les `.md` du dépôt, `node_modules/` et `dist/` exclus, en priorité dans `.github/Projet/`. S'il correspond à plusieurs fichiers, demander lequel au lieu de choisir.
2. Lancer depuis la racine du dépôt, chemins entre guillemets (ils contiennent souvent des espaces) :
   ```bash
   node tools/impression/imprimer_doc.js --ouvrir "<chemin>" ["<chemin>" ...]
   ```
   Le script se relance lui-même dans Electron, même quand `ELECTRON_RUN_AS_NODE` est défini. `--ouvrir` affiche chaque PDF une fois créé : le retirer si l'utilisateur demande seulement de générer.
3. Le script affiche le chemin de chaque PDF créé, dans `.github/Projet/_impression/`, sous le nom du fichier source. Un code de sortie non nul signale une erreur (fichier introuvable le plus souvent) : la rapporter telle quelle.
4. Si le document utilise une syntaxe Markdown nouvelle (notes de bas de page, cases à cocher, HTML brut), prévenir qu'elle sortira en texte brut : le convertisseur `tools/impression/markdown.js` ne gère que titres, paragraphes, listes, tableaux, code, citations, liens et images.

## Personnaliser

- Style (couleurs, polices, encadrés, page de notes) : `tools/impression/carnet.css`.
- Textes de la couverture (« Fazbear Entertainment », « MANUEL DU GARDIEN », « technique », tampon) : fonction `buildPage` de `tools/impression/imprimer_doc.js`.
- Le premier titre `#` du document devient le titre de la couverture.

## Résultat attendu

Donner le chemin de chaque PDF créé, et signaler tout fichier non trouvé ou toute syntaxe non prise en charge.
