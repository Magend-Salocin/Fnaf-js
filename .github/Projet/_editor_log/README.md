# Terminal — lore en JSON

Chaque commande de terminal (LOGS, ARCHIVE, CLOSED, PARTY, ...) vit maintenant
dans son propre fichier JSON, rangé par nuit. Un compilateur régénère ensuite
le fichier `lore-nightX.js` que le jeu charge réellement — tu n'édites plus
jamais ce `.js` à la main.

```
Terminal/
  night1.meta.json       <- thème, secretPool, idleEvent, fin de nuit
  night1/
    LOGS.json
    ARCHIVE.json
    STAFF.json
    ...
  compiler.js             <- moteur de compilation (Node + navigateur)
  build.js                <- CLI Node pour compiler en ligne de commande
  editor.html              <- éditeur visuel dans le navigateur
```

Le contenu de `lore-night1.js` d'origine a été extrait automatiquement
(pas retapé à la main) pour garantir un texte identique au caractère près —
seule la mise en forme change un peu (les commentaires de section sont
reconstruits depuis le champ `label`).

## 1. Format d'une entrée (`Terminal/night1/NOM.json`)

```json
{
    "command": "LOST",
    "label": "fin de nuit seulement",
    "markFound": "LOST",
    "minHour": 5,
    "beforeHour": {
        "text": "AUCUNE DONNÉE DISPONIBLE AVANT LA FERMETURE.",
        "glitch": false
    },
    "type": "text",
    "text": "OBJETS TROUVÉS\n\n--------------------------------\n\n...",
    "glitch": false
}
```

Champs :

- `command` — nom de la commande tapée par le joueur (majuscules).
- `label` — optionnel, redevient le commentaire `/* ===== NOM (label) ===== */`.
- `markFound` — `false` pour ne pas appeler `ctx.markFound`, sinon omis (utilise `command`).
- `minHour` / `beforeHour` — optionnel : verrouille la commande avant une heure donnée
  (comme `LOST`, qui n'affiche rien avant la fermeture).
- `type` — `"text"` ou `"sequence"`.
  - `type: "text"` → `text` (string, `\n` pour les sauts de ligne) + `glitch` (bool).
  - `type: "sequence"` → `steps`: tableau de `{ text, delay, glitch?, flash?, flashDuration? }`.

## 2. Métadonnées de nuit (`Terminal/night1.meta.json`)

- `title`, `headerComment` → l'en-tête commentée en haut du fichier compilé.
- `order` → ordre des commandes dans le fichier généré (sinon ordre de lecture disque).
- `secretPool` → indices que `HELP` peut faire fuiter.
- `idleEvent` → `{ chance, steps[] }`, l'événement ambiant à ~1%.
- `ending` → paramètres de `playNightXEnding(onComplete)`.

## 3. Compiler en ligne de commande

```bash
node build.js 1                 # compile night1 -> ../lore-night1.js
node build.js all                # compile toutes les nuits trouvées
node build.js 1 --out ./dist     # choisit un dossier de sortie
```

Aucune dépendance npm requise (Node natif suffit).

## 4. L'éditeur visuel (`editor.html`)

Ouvre `editor.html` dans **Chrome ou Edge, servi en `http://localhost`**
(le File System Access API n'est pas autorisé sur `file://`). Par exemple :

```bash
npx serve .        # ou: python3 -m http.server
```

puis ouvre `http://localhost:3000/Terminal/editor.html` (adapte le port).

- **« Ouvrir le dossier du projet »** → choisis le dossier qui contient le
  sous-dossier `Terminal/` (celui où vivent `lore-core.js`, `lore-night1.js`...).
  L'éditeur lit/écrit alors directement sur le disque, sans export manuel.
- Choisis une nuit à gauche, puis une commande : formulaire à droite pour le
  texte ou la séquence, aperçu terminal en direct à droite.
- **« Compiler lore-night{N}.js »** régénère le fichier directement à la
  racine du projet, prêt à être rechargé par le jeu.
- **« + Nouvelle nuit »** / **« + Nouvelle commande »** créent de nouvelles
  entrées vides à remplir.
- **« Importer (lecture seule) »** est un secours pour Firefox/Safari (pas de
  File System Access API) : les modifications se téléchargent fichier par
  fichier au lieu d'être écrites sur place.
- **« Charger des JSON… »** ouvre un sélecteur multi-fichiers : choisis
  plusieurs `.json` d'un coup (entrées de commande et/ou fichiers
  `nightX.meta.json` mélangés). Chaque fichier est reconnu automatiquement
  (présence de `command` → entrée, présence de `night` → métadonnées) et
  ajouté/écrasé dans la nuit courante. En mode dossier ouvert, tout est
  réécrit sur disque immédiatement ; sinon, chargé en mémoire seulement.
- **« ▶ Visualiser »** (au-dessus de l'aperçu) rejoue l'entrée sélectionnée en
  plein écran exactement comme le ferait le jeu : machine à écrire caractère
  par caractère, délais cumulés entre étapes, pulse "glitch", et lignes
  "flash" qui apparaissent puis disparaissent seules. Clique n'importe où
  (ou Échap) pour fermer.

## 5. Ajouter une nuit 2, 3, ...

Duplique le schéma : crée `Terminal/night2.meta.json` + `Terminal/night2/*.json`
(à la main, ou via l'éditeur avec « + Nouvelle nuit »), puis
`node build.js 2` ou le bouton Compiler.
