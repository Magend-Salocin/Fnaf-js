# Générateur de voix

Comment `tools/voix/generer_voix.js` transforme un fichier texte en fichier audio.

Ce document explique le fonctionnement interne. Pour écrire un texte, voir `ressources/voix/README.md`. Pour la procédure de génération, voir [Carnet_Developpeur.md](../04%20-%20Production/Carnet_Developpeur.md), section 1.

Fichiers concernés :

| Fichier | Rôle |
|---|---|
| `tools/voix/generer_voix.js` | Le générateur : lecture du texte, effets, bruitages, assemblage |
| `tools/voix/synthese_sapi.ps1` | Fait parler les anciennes voix Windows « Desktop » (Hortense) |
| `tools/voix/synthese_winrt.ps1` | Fait parler les voix Windows modernes (Julie, Paul) |
| `ressources/voix/config.json` | Tous les réglages : voix, effets, bruitages, pauses |
| `ressources/voix/textes/*.txt` | Les textes à générer |
| `ressources/voix/sorties/*.wav` | Les audios générés |

## En une phrase

Le script lit un fichier texte écrit comme un petit scénario. Il fait lire chaque réplique par une voix de synthèse de Windows, déforme cette voix pour lui donner un caractère, ajoute les bruitages, puis assemble le tout dans un fichier `.wav`.

## Étape 1 : lancer le script

```bash
node tools/voix/generer_voix.js                                           # tous les .txt de ressources/voix/textes/
node tools/voix/generer_voix.js ressources/voix/textes/tape_erreur_08.txt  # seulement ce fichier
```

Le script commence par lire `config.json`.

## Étape 2 : lire le texte, ligne par ligne

Fonction `parseScript`. Chaque ligne est classée selon une règle simple :

| Ligne | Ce qu'elle veut dire |
|---|---|
| (vide) | Ignorée |
| `!mode cassette` ou `!mode inverse` | Le type d'enregistrement (cassette par défaut) |
| `!voix gardien` | La voix utilisée quand une ligne n'en précise pas |
| `[STATIQUE FORTE]` | Un bruitage |
| `@machine Bonjour.` | Une réplique dite par la voix `machine` |
| `Bonjour.` | Une réplique dite par la voix par défaut |

Deux détails :

- Si plusieurs lignes à la suite ont la même voix, elles sont collées en une seule réplique.
- Si une ligne n'a pas de voix (ni `@...`, ni `!voix`), le script s'arrête avec une erreur.

On obtient une liste dans l'ordre, par exemple : bruitage, réplique, réplique, bruitage.

## Étape 3 : en mode inverse, repérer ce qui reste à l'endroit

Fonction `splitDirections`. En mode `inverse`, la voix sera jouée à l'envers, sauf le texte entre parenthèses, qu'on doit entendre normalement.

`(Allô ?) ... Allô ?` donne deux morceaux : « Allô ? » à l'endroit, puis « ... Allô ? » qui sera retourné. Un morceau réduit à `...` est ignoré.

## Étape 4 : faire parler Windows

Fonctions `buildSpeechSegments` et `synthesizeAll`. Pour chaque réplique, le script cherche la voix dans `config.json`, section `voix`. Par exemple, `machine` correspond à « Microsoft Paul », vitesse 0.9.

Windows propose deux familles de voix, d'où deux scripts PowerShell :

| Moteur | Script | Voix | Réglages acceptés |
|---|---|---|---|
| `sapi` | `synthese_sapi.ps1` | Anciennes voix « Desktop » (Hortense) | Vitesse en mot (`slow`, `medium`), hauteur (`hauteurSsml`, ex. `x-high`) |
| `winrt` | `synthese_winrt.ps1` | Voix modernes (Julie, Paul) | Vitesse en nombre (1 = normal) |

Déroulé :

1. Le script écrit la liste des répliques dans un fichier `segments.json`, dans un dossier temporaire.
2. Il lance le script PowerShell du moteur. Celui-ci fait lire chaque réplique à Windows et enregistre `seg_000.wav`, `seg_001.wav`, etc.
3. Dans le texte, `...` devient une vraie pause, de durée `pauseTexte` (800 ms).
4. Le script relit ces fichiers, les convertit tous au même format (`frequence` : 22 050 Hz, mono), puis supprime le dossier temporaire.

## Étape 5 : déformer chaque voix

Fonction `applyVoiceEffects`. Chaque voix a sa liste d'`effets` dans `config.json`. Seuls les effets présents sont appliqués, toujours dans cet ordre :

| Effet | Ce qu'on entend |
|---|---|
| `choeur` | Plusieurs copies de la voix, plus ou moins aiguës et légèrement décalées (effet de groupe, utilisé pour `enfants`) |
| `hauteur` | Voix plus grave (< 1) ou plus aiguë (> 1), sans changer la vitesse |
| `pleurage` | La vitesse ondule légèrement, comme une vieille cassette |
| `echantillonnage` | Qualité dégradée, son de vieux numérique |
| `anneau` | Son métallique, robotique |
| `passeHaut` | Retire les graves : son plus fin |
| `passeBas` | Retire les aigus : son étouffé, comme au téléphone |
| `glitch` | Toutes les 100 ms, une chance de petite coupure ou de bégaiement |
| `grain` | Léger bruit de fond sur la voix |

Ensuite, le volume de la voix est réglé sur son `niveau`. En mode inverse, les morceaux concernés sont retournés à ce moment.

Le hasard (glitch, grain, souffle) part d'une graine fixe : le même texte donne toujours exactement le même résultat. Changer `glitch.graine` déplace les accidents.

## Étape 6 : choisir les bruitages

Fonction `renderSoundEffect`. Pour un bruitage comme `[BRUIT DE STATIQUE FORTE]` :

1. Le texte est mis en majuscules.
2. Le script parcourt la liste `bruitages` de haut en bas et prend la première règle dont le `motif` apparaît dans le texte. Ici, `STATIQUE FORTE`.
3. La règle donne :
   - soit un silence : `"silence": 2` donne 2 secondes de vide ;
   - soit un extrait d'un fichier audio du jeu : on part de `debut` secondes, on garde `duree` secondes, au volume `niveau`, avec un fondu de 30 ms au début et à la fin.
4. Si aucun motif ne correspond, le script affiche un avertissement et met 0,5 s de silence.

L'ordre de la liste compte. `STATIQUE VIOLENTE` doit venir avant `STATIQUE`, sinon la règle générale gagne toujours. Même chose pour `LONG SILENCE` avant `SILENCE`.

La recherche se fait sur un morceau de texte, pas sur un mot entier : un motif court peut être trouvé à l'intérieur d'un mot plus long. En cas de bruitage inattendu, vérifier quelle règle a été retenue en premier.

## Étape 7 : tout assembler

Fonction `assemble`. Il faut imaginer une frise chronologique, avec un curseur qui avance, et deux pistes : une pour les voix, une pour les bruitages.

- Le curseur démarre à `silenceDebut` (0,8 s).
- Une réplique est posée au curseur. Le curseur avance de sa durée, plus `pauseEntreSegments` (0,5 s).
- Un bruitage de silence fait simplement avancer le curseur.
- Un bruitage sonore est posé au curseur, puis :
  - si une réplique suit, le curseur avance seulement de `avance` (0 par défaut). La voix démarre donc en même temps que le bruitage, par-dessus.
  - si un autre bruitage suit, le curseur avance de 85 % de la durée du bruitage (`enchainementBruitages`). Les bruitages se chevauchent un peu.

Ensuite :

1. Les bruitages sont baissés pendant que quelqu'un parle (fonction `duck`, réglage `attenuationBruitagesSousVoix` : 0.5 = moitié du volume), pour que la voix reste audible.
2. Les deux pistes sont mélangées, avec un souffle de fond dont le volume dépend du mode (`modes.<mode>.souffle`).
3. Le script ajoute `silenceFin` (1 s) de silence, puis règle le volume global à `niveauFinal` (90 %).

## Étape 8 : le résultat

Fonction `generate`. Les fichiers sont écrits dans `ressources/voix/sorties/` :

| Mode | Fichiers |
|---|---|
| `cassette` | `<nom>.wav` |
| `inverse` | `<nom>.wav`, la version du jeu, à l'envers, avec un souffle plus fort (`souffle`), et `<nom>_endroit.wav`, la même à l'endroit, pour vérifier ce qui est dit (`souffleEndroit`) |

La durée de chaque fichier s'affiche dans la console.

## Exemple complet

Fichier `ressources/voix/textes/exemple.txt` :

```text
!mode cassette
!voix gardien
[INSERTION DE LA CASSETTE]
Bonjour.
Ceci est un test.
@machine Erreur. ... Données perdues.
[STATIQUE FORTE]
```

1. Lecture : bruitage « insertion », réplique du gardien « Bonjour. Ceci est un test. » (les deux lignes sont fusionnées), réplique de la machine, bruitage « statique forte ».
2. Synthèse : Paul lit les deux répliques. Celle de la machine contient une pause de 800 ms à la place de `...`.
3. Effets : le gardien reçoit seulement un passe-haut, sa voix reste presque normale. La machine devient plus grave, dégradée et robotique, avec un son de téléphone.
4. Assemblage : à 0,8 s, le bruit d'insertion de cassette et la voix du gardien démarrent ensemble. Après sa réplique et 0,5 s de pause, la machine parle. 0,5 s plus tard, 1,5 s de statique.
5. Résultat : avec le souffle de fond et 1 s de silence final, on obtient `ressources/voix/sorties/exemple.wav`.
