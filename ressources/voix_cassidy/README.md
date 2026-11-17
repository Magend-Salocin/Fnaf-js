# Voix de Cassidy

Textes, réglages et audios générés de la voix de Cassidy. Le générateur est `tools/voix/generer_voix.js`.

## Générer

```bash
node tools/voix/generer_voix.js                                         # tous les textes
node tools/voix/generer_voix.js ressources/voix_cassidy/textes/appel_nuit5_C.txt   # un seul
```

Windows uniquement : la synthèse passe par les voix Windows (System.Speech). Aucune dépendance npm.

## Écrire un texte

Un fichier `.txt` par audio dans `textes/`.

- `(texte)` : passage à l'endroit, compris sans rien faire.
- Tout le reste est inversé dans la version de jeu.
- `...` : pause (durée `pauseTexte`).

Exemple :

```text
(Allô ?) ... Allô ?
L'homme du téléphone ne t'appellera plus.
(C'est moi.)
```

## Sorties

Dans `sorties/`, pour chaque texte :

| Fichier | Contenu |
| --- | --- |
| `<nom>.wav` | Version de jeu : inversée sauf les parenthèses, souffle de ligne |
| `<nom>_endroit.wav` | Version de contrôle, tout à l'endroit |

## Réglages (`config.json`)

| Clé | Valeur | Effet |
| --- | --- | --- |
| `voix` | Microsoft Hortense Desktop | Voix Windows française |
| `vitesse` | medium | Débit normal. Une valeur en pourcentage comme `0%` est mal interprétée par Windows et ralentit fortement |
| `hauteurSsml` | x-high | Demandé à la synthèse, sans effet audible avec Hortense |
| `decalageHauteur` | 1.2 | Voix 20 % plus aiguë, durée inchangée : c'est ce réglage qui rajeunit la voix |
| `passeHaut` | 150 | Coupe les graves sous 150 Hz |
| `souffle.jeu` / `souffle.endroit` | 900 / 300 | Niveau du souffle de ligne |
| `pauseTexte` | 800ms | Durée d'un `...` |
| `pauseEntreSegments` | 0.5 | Silence entre deux segments, en secondes |

Réglage validé le 17/11/2026 sur l'appel de la nuit 5. Pour une autre voix, créer `ressources/voix_<personnage>/` avec son propre `config.json` et ses `textes/`.

## Textes actuels

| Fichier | Usage |
| --- | --- |
| `appel_nuit5_A.txt` | Appel de la nuit 5, version Conviction |
| `appel_nuit5_B.txt` | Appel de la nuit 5, version Doute |
| `appel_nuit5_C.txt` | Appel de la nuit 5, version Reconnaissance |

Les textes de référence et la règle de choix de version sont dans `.github/Projet/Next/Appel_Nuit5.md`. Les audios ne sont pas encore branchés dans le jeu.
