# Casting des voix

Qui parle dans le jeu, avec quelle voix, dans quels enregistrements. Sert de référence pour la génération (`ressources/voix/`) et pour d'éventuelles séances avec des comédiens.

Découle de [Bible.md](Bible.md) et de `02 - Lore/CANON_LOGS.md` (personnel, sous-systèmes). Statut : proposition du 17/11/2026, à valider.

---

## 1. Trois familles de son

Le traitement dit d'où vient la voix, avant même ce qu'elle dit.

| Famille | Époque | Traitement | Personnages |
| --- | --- | --- | --- |
| Archives Fazbear | 1985 | Bande magnétique : pleurage, aigus étouffés, souffle | Pierre D., Marie L., le responsable |
| Système | Hors du temps | Numérique dégradé | Machine Fazbear, Mémoire du bâtiment |
| Présent | 1993 | Voix nette | Michael (le gardien), Cassidy |

Cassidy est la seule voix qui traverse les trois : elle surgit dans les bandes de 1985, dans les fichiers du système et au téléphone en 1993.

## 2. Les personnages

| Personnage | Canon | Jeu d'acteur | Profil de génération | Enregistrements |
| --- | --- | --- | --- | --- |
| Cassidy | `enfant_05`, jamais nommée | Fillette de 7 à 9 ans. Calme, lente, jamais criarde. Elle cherche à être reconnue avant d'accuser | `cassidy` : Hortense, +20 % | Appels nuit 5 (A, B, C), ERREUR 02, 03, 05, 07, fins A, B, C |
| Les quatre enfants | Gabriel, Jeremy, Susie, Fritz | Ensemble, à l'unisson approximatif. Ils ne savent plus pour qui ils parlent | `enfants` : chœur de quatre hauteurs | ERREUR 06 (« Il manque quelqu'un »), fin C. Seuls : `gabriel`, `jeremy`, `susie`, `fritz` (Hortense, hauteurs du chœur), fins A, B, C |
| Fritz, écho | `enfant_04`, Foxy | Une seule syllabe, très basse, comme un jouet qui ralentit | `fritz_echo` : Hortense très grave, étouffée | FRT 03 (« Encore... ») |
| Michael Afton | Veilleur `004`, embauché sous le nom de Mike Schmidt. Jamais nommé | Homme de 20 à 30 ans. Fatigué, sincère, dépassé. Il ne comprend pas ce qu'on lui reproche | `gardien` : Paul, sans effet | ERREUR 03, 07, fins B, C |
| Pierre D. | Employé `001`, service | Homme de 30 à 40 ans. Pédagogue dans les formations, puis de plus en plus inquiet | `pierre` : Paul, bande magnétique | FRT 01, 02, GAB 01, 03, JER 01, 03, ERREUR 04, fins A, C |
| Marie L. | Employée `002`, cuisine | Femme de 30 à 50 ans. Pratique, puis troublée, puis prudente face au responsable | `marie` : Julie, bande magnétique | SUS 01, 02, 03 |
| Le responsable | Superviseur Fazbear, jamais nommé | Homme de 45 à 60 ans. Courtois dans les notes, sec dès qu'il faut faire taire | `responsable` : Paul grave, bande magnétique | GAB 02, 03, JER 02, 03, SUS 03 |
| La voix inconnue | Jamais identifiée | Grave, posée, presque aimable. Elle ne hausse jamais le ton | `inconnu` : Paul très grave, étouffée | ERREUR 04 |
| Machine Fazbear | Sous-système de nettoyage | Neutre, administrative. Elle corrige, classe, supprime | `machine` : Paul, numérique 8 kHz, modulation | ERREUR 05, 06 (corrections), fins A, B, C |
| Mémoire du bâtiment | Sous-système RECOVERY | Neutre, mais elle se casse en parlant | `memoire` : Julie, numérique 7 kHz, coupures | ERREUR 06 (reconstruction), fins B, C |
| Phone Guy | Veilleur `003` en 1993 | Enregistrements d'origine de FNAF 1, non regénérés | Aucun | Appels nuits 1 à 4 |

Antoine M. (`A-003`, veilleur de 1985) n'a aucun enregistrement : il n'existe que par son rapport et sa fiche archivée.

### Choix d'harmonisation

- Les employés anonymes des cassettes (« Voix d'un employé », « Employé - fatigué », « Employé - confus ») deviennent Pierre D. et Marie L., les deux employés de CANON_LOGS, toujours `ACTIF` dans STAFF. Les cassettes de Susie se passent en cuisine : elles reviennent à Marie L. Les étiquettes « Employé » des cassettes SUS passent au féminin.
- L'employé administratif de ERREUR_04, qui cherche les dossiers des victimes, est Pierre D. : le même homme qui a vu les jouets bouger et les dessins revenir.
- Le superviseur est un seul personnage dans toutes les cassettes. C'est lui qui dit « Coupez l'enregistrement », « Effacez cette bande », « Cette bande n'existe pas » : la face humaine de l'Oubli.
- La voix inconnue de ERREUR_04 (« Supprimez cette entrée », « Elle n'était jamais censée être retrouvée ») n'est jamais attribuée. Le joueur peut la rapprocher de la session sans compte du 03/07 (ROOT) ou du responsable. Aucun enregistrement ne tranche.
- Le « Encore... » de FRT_03 est Fritz, pas un adulte : il suit le rire d'enfant et les petites roues, et Fritz est l'enfant qui refuse que le jeu se termine.
- L'adulte de ERREUR_03 (« Tu peux m'entendre ? Je veux seulement comprendre ») est Michael : Cassidy lui répond « Tu es revenu ».
- ERREUR_06 fait dialoguer les deux systèmes : la Mémoire reconstruit les profils, la Machine coupe (« Correction. Phrase invalide. Suppression. »), la Mémoire conclut (« Le souvenir refuse de disparaître. »).
- Les voix sans paroles (ERREUR_01 « voix impossible à identifier », ERREUR_02 « voix d'adulte incompréhensible ») sont traitées en bruitage, pas en rôle.

## 3. Répartition par enregistrement

| Enregistrement | Voix |
| --- | --- |
| Appels nuit 5 A, B, C | Cassidy |
| TAPE_ERREUR_01 | Aucune voix, bruitages seuls |
| TAPE_ERREUR_02 | Cassidy, bruitage de voix d'adulte inintelligible |
| TAPE_ERREUR_03 | Michael, Cassidy |
| TAPE_ERREUR_04 | Pierre D., voix inconnue |
| TAPE_ERREUR_05 | Machine Fazbear, Cassidy |
| TAPE_ERREUR_06 | Mémoire du bâtiment, Machine Fazbear, les quatre enfants |
| TAPE_ERREUR_07 | Michael, Cassidy |
| Fin A | Machine Fazbear, les quatre enfants, Cassidy, Pierre D. |
| Fin B | Mémoire du bâtiment, Michael, les quatre enfants, Cassidy, Machine Fazbear |
| Fin C | Mémoire du bâtiment, Pierre D., Machine Fazbear, Michael, Cassidy, les quatre enfants seuls et en chœur |
| TAPE_FRT_01 | Pierre D. |
| TAPE_FRT_02 | Pierre D. |
| TAPE_FRT_03 | Fritz (écho) |
| TAPE_GAB_01 | Pierre D. |
| TAPE_GAB_02 | Le responsable |
| TAPE_GAB_03 | Pierre D., le responsable |
| TAPE_JER_01 | Pierre D. |
| TAPE_JER_02 | Le responsable |
| TAPE_JER_03 | Pierre D., le responsable (au loin) |
| TAPE_SUS_01 | Marie L. |
| TAPE_SUS_02 | Marie L. |
| TAPE_SUS_03 | Marie L., le responsable |

## 4. Séances d'enregistrement

Six comédiens suffisent. Les voix du système sont des voix humaines traitées : elles peuvent être doublées par un comédien qui a déjà un rôle.

| Comédien | Rôles | Remarque |
| --- | --- | --- |
| Fillette (7 à 9 ans) ou comédienne qui joue l'enfant | Cassidy, les quatre enfants, Fritz (écho) | Le chœur : quatre prises de la même réplique, avec quatre intentions, superposées au montage. Fritz : une prise basse, ralentie au montage |
| Homme, 20 à 30 ans | Michael | Le rôle le plus court, mais celui que Cassidy confond avec son père : timbre proche d'un homme plus âgé |
| Homme, 30 à 40 ans | Pierre D. | Le plus de texte (7 cassettes) |
| Femme, 30 à 50 ans | Marie L., Mémoire du bâtiment | La Mémoire est traitée au point d'être méconnaissable |
| Homme, 45 à 60 ans | Le responsable, Machine Fazbear | Même logique : celui qui fait effacer prête sa voix à la machine qui efface |
| Homme, voix grave | Voix inconnue | Ne pas la confier au comédien du responsable : un auditeur attentif reconnaîtrait le timbre, et la voix inconnue ne doit jamais être identifiée |

Ordre conseillé : Cassidy en premier (elle est partout et fixe le ton), puis Pierre D. et Marie L. ensemble (leurs cassettes se répondent), puis le responsable, Michael et la voix inconnue.

Pour chaque séance : enregistrer les répliques sèches, sans effet, une ligne par fichier. Les traitements (bande, numérique, hauteur) se font au montage avec les réglages de `ressources/voix/config.json`.

## 5. Points ouverts

- Bruitages absents de `audio/` : petites roues, vaisselle, tables déplacées, jouets qui bougent, porte de cuisine, mécanisme d'animatronique, pas rapides, musique d'anniversaire lointaine, interrupteur. À se procurer (banque de sons libres) ou à remplacer par un silence.
- Bruitages à fabriquer : clic, tic-tac d'horloge, papier.
- Soupir et petit rire nerveux (JER_02, SUS_02) : impossibles en synthèse vocale, remplacés par une pause tant qu'il n'y a pas de comédien.
- En synthèse, Paul porte cinq rôles (Michael, Pierre D., le responsable, la voix inconnue, la Machine). Ils se distinguent par le traitement. Avec de vrais comédiens, le problème disparaît.
