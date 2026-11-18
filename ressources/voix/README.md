# Voix

Textes, réglages et audios générés des voix du jeu. Le générateur est `tools/voix/generer_voix.js`. Son fonctionnement, étape par étape : `.github/Projet/03 - Technique/voix.md`.

## Générer

```bash
node tools/voix/generer_voix.js                                           # tous les textes
node tools/voix/generer_voix.js ressources/voix/textes/tape_erreur_08.txt  # un seul
```

Windows uniquement : la synthèse passe par les voix Windows. Aucune dépendance npm. Les audios générés vont dans `sorties/`.

## Les voix

| Profil | Rôle | Voix Windows | Traitement |
| --- | --- | --- | --- |
| `cassidy` | Cassidy | Hortense | +20 % de hauteur, graves coupés |
| `machine` | Machine Fazbear : le système de nettoyage, qui corrige et supprime | Paul | Plus grave, numérique dégradé (8 kHz, 8 bits), modulation métallique, bande étroite |
| `memoire` | Mémoire du bâtiment : le système qui restaure | Julie | Légèrement plus grave, numérique très dégradé (7 kHz, 7 bits), coupures et répétitions |
| `gardien` | Michael, le gardien (cassettes 03, 07) | Paul | Aucun |
| `pierre` | Pierre D., employé de service | Paul | Bande magnétique |
| `marie` | Marie L., employée de cuisine | Julie | Bande magnétique |
| `responsable` | Le superviseur Fazbear | Paul | Plus grave, bande magnétique |
| `inconnu` | La voix inconnue (cassette 04) | Paul | Très grave, étouffée |
| `enfants` | Les quatre enfants ensemble (cassette 06) | Hortense | Chœur de quatre hauteurs |
| `fritz_echo` | Le « Encore... » de FRT_03 | Hortense | Très grave, étouffée |

Réglages dans `config.json`, section `voix`. `cassidy`, `machine`, `memoire` et `gardien` sont validés (17/11/2026), les autres sont à l'essai. Qui parle dans quel enregistrement : `.github/Projet/Next/Casting_Voix.md`.

Les coupures et répétitions de `memoire` dépendent d'une graine (`glitch.graine`) : une même génération donne toujours le même résultat. Changer la graine déplace les accidents.

## Écrire un texte

Un fichier `.txt` par audio dans `textes/`.

| Syntaxe | Effet |
| --- | --- |
| `!mode cassette` | Tout est à l'endroit (par défaut) |
| `!mode inverse` | Tout est inversé, sauf les passages entre parenthèses |
| `!voix <profil>` | Voix des lignes sans `@` |
| `@<profil> texte` | Cette ligne est dite par ce profil |
| `[BRUITAGE]` | Seul sur sa ligne : silence ou son, d'après `config.json`, section `bruitages` |
| `...` | Pause dans une réplique (durée `pauseTexte`) |
| `(texte)` | En mode inverse : passage à l'endroit |

Exemple de cassette :

```text
!mode cassette
!voix memoire

[BRUIT DE SERVEUR]
Cinquième profil. ... Recherche. ... Erreur.
@cassidy Pourquoi ?
[PAUSE]
Parce que tu étais là.
```

### Mixage

Deux pistes :

- La voix avance dans le temps, réplique après réplique.
- Un bruitage sonore (statique, pas, serveur...) se pose sur une piste à part, à l'instant où il apparaît dans le texte.
  - Suivi d'une réplique, il ne la retarde pas : la voix démarre en même temps que lui. Pour qu'il passe avant la voix, lui donner une `avance` en secondes dans `config.json`.
  - Suivi d'un autre bruitage ou d'un silence, il se joue avant lui, avec un léger chevauchement (`enchainementBruitages` : 0.85 = le suivant démarre à 85 % du précédent).
- Un bruitage de silence (`PAUSE`, `LONG SILENCE`, `COUPURE`...) fait avancer le temps : la voix attend.
- Les bruitages baissent automatiquement pendant que quelqu'un parle (`attenuationBruitagesSousVoix`, 0.5 = moitié du volume).

Les bruitages sont reconnus par mot-clé (`STATIQUE`, `PAUSE`, `GOLDEN FREDDY`, `PAS LENTS`...), dans l'ordre de la liste : mettre les motifs les plus précis en premier (`STATIQUE FORTE` avant `STATIQUE`). Ils réutilisent les sons de `audio/`. Un bruitage sans correspondance devient un silence d'une demi-seconde et le générateur le signale.

Écrire les mots en minuscules : certaines voix épellent les mots en majuscules.

## Sorties

| Mode | Fichiers |
| --- | --- |
| `inverse` | `<nom>.wav` (version de jeu) et `<nom>_endroit.wav` (contrôle) |
| `cassette` | `<nom>.wav` |

## Textes actuels

| Fichier | Usage |
| --- | --- |
| `appel_nuit5_A.txt`, `_B`, `_C` | Appel de la nuit 5, versions Conviction, Doute, Reconnaissance |
| `tape_*.txt` | Les 21 cassettes (ERREUR 01 à 09, FRT, GAB, JER, SUS 01 à 03) |

Sources : `.github/Projet/Next/Appel_Nuit5.md` pour les appels, `ressources/Tape/TAPE_*.txt` pour les cassettes. Qui parle dans quelle cassette : `.github/Projet/Next/Casting_Voix.md`.

Les textes `tape_*.txt` font désormais foi pour l'audio. Une correction de réplique se fait ici, puis on régénère ; la transcription de `ressources/Tape/` est à reporter si elle sert encore à l'affichage.

Branchement dans le jeu (17/11/2026) : les 19 cassettes déclarées (`index.html`, `game_sounds.json`) lisent `sorties/tape_*.wav`, et l'appel de la nuit 5 en français lit `sorties/appel_nuit5_{A,B,C}.wav` (`call_5_cassidy_*`). TAPE_ERREUR_08 et 09 attendent le système de fins.
