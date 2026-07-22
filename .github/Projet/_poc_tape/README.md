# Scène — Lecteur de cassettes

Scène autonome (HTML/CSS/JS natifs, sans dépendance) à intégrer dans le
système de scènes existant du fangame.

## Intégration

```html
<!-- dans la page du jeu -->
<link rel="stylesheet" href="sceneTapePlayer/style.css">
<script src="sceneTapePlayer/script.js"></script>
```

Le HTML de `index.html` (la balise `<section id="tape-scene">` et son
contenu) doit être injecté dans la page du jeu — soit copié directement,
soit chargé dynamiquement par le moteur principal.

Puis, depuis le moteur du jeu :

```javascript
loadTapeScene();   // ouvre la scène
closeTapeScene();  // la ferme et coupe l'audio en cours
```

## Ajouter une cassette

Dans `script.js`, ajouter une entrée dans le tableau `TAPES` :

```javascript
{
  id: "tape_05",
  title: "Cassette 05",
  image: "assets/tapes/tape05.png", // optionnelle
  audio: "assets/audio/tape05.mp3",
  description: "Description libre"
}
```

Aucune autre modification n'est nécessaire : l'étagère, le Drag & Drop et
la machine à états s'adaptent automatiquement au tableau.

## Assets attendus (non fournis)

Le code est écrit pour fonctionner **avec ou sans** ces fichiers (une
miniature manquante retombe sur un rendu CSS, un son manquant est
simplement ignoré avec un avertissement en console) :

```
assets/audio/tape01.mp3 ... tape04.mp3   (bandes des cassettes)
assets/audio/sfx_tape_click.mp3          (clic sur une cassette)
assets/audio/sfx_mechanism.mp3           (insertion mécanique)
assets/audio/sfx_tape_hiss.mp3           (souffle de bande, à déclencher si besoin)
assets/tapes/tape01.png ... tape04.png   (miniatures optionnelles)
```

## États du lecteur

```
EMPTY → INSERTING → READY → PLAYING ⇄ STOPPED → (éjection) → EMPTY
```

- Le dépôt d'une cassette hors de la fente ne fait rien : la cassette
  reste simplement sur l'étagère (comportement natif du Drag & Drop).
- Pendant qu'une cassette est en place, les autres deviennent
  non-déplaçables (`.locked`).
- **Stop** : premier appui = arrêt + retour à zéro ; second appui =
  éjection de la cassette (elle redevient disponible sur l'étagère).
