DOSSIER 05 — CASSIDY
Victime

| Élément          | Valeur                                                               |
| ---------------- | -------------------------------------------------------------------- |
| Nom              | Cassidy *(jamais affiché au joueur)*                                 |
| Animatronique    | Golden Freddy                                                        |
| Thème            | L'erreur d'identité                                                  |
| Émotion          | Colère, confusion, obsession                                         |
| Couleur          | Jaune fané / Noir                                                    |
| Salle principale | Aucune                                                               |
| Apparition       | Toutes les caméras, le bureau, le terminal, les écrans de transition |

Philosophie Narrative

Contrairement aux autres enfants :

Gabriel laisse des objets.
Jeremy laisse des dessins.
Susie laisse des traces.
Fritz laisse des jeux.

Cassidy laisse des erreurs.

Elle ne crée pas des souvenirs.

Elle corrompt les souvenirs des autres.

Le joueur ne découvre jamais Cassidy en cherchant.

C'est Cassidy qui découvre le joueur.

Le principe fondamental

Dans ton histoire :

Michael Afton devient gardien de nuit.

Cassidy ne sait pas que c'est Michael.

Elle voit :

les yeux ;
la silhouette ;
l'uniforme.

Elle pense :

William est revenu.

Toutes ses anomalies découlent de cette erreur.

Le joueur peut finir le jeu sans jamais comprendre cela.

Tableau de Production
| ID      | Priorité | Type          | Zone     | Nuit | Heure      | Chance     | Déclencheur          | Description                             | Lore                         | Asset               | Son               | Script JS         | Terminal  | Cassette | Évolution             |
| ------- | -------- | ------------- | -------- | ---- | ---------- | ---------- | -------------------- | --------------------------------------- | ---------------------------- | ------------------- | ----------------- | ----------------- | --------- | -------- | --------------------- |
| CAS-001 | Critique | Glitch        | Toutes   | 1-5  | Toute nuit | Variable   | Aucune               | Écran CRT parasite                      | Cassidy tente de communiquer | crt_noise.png       | crt.wav           | cassidy_glitch.js | —         | —        | Plus fréquent         |
| CAS-002 | Critique | Texte         | Toutes   | 2-5  | Toute nuit | 1%         | Retour caméra        | "IT'S ME" pendant 1 frame               | Confusion avec William       | itsme_overlay.png   | whisper.wav       | itsme.js          | —         | —        | Variable              |
| CAS-003 | Critique | Hallucination | Bureau   | 3-5  | Toute nuit | 0,5%       | Retour bureau        | Golden Freddy assis                     | Cassidy observe Michael      | golden_sit.png      | hum.wav           | golden_visit.js   | SYS_ERR   | —        | Persistant            |
| CAS-004 | Haute    | Audio         | Bureau   | 2-5  | 02h00      | 2%         | Silence              | Murmure incompréhensible                | Tentative de dialogue        | —                   | whisper01.wav     | whisper.js        | —         | —        | Plus clair            |
| CAS-005 | Haute    | Terminal      | Terminal | 2-5  | Toute nuit | Variable   | Suppression anomalie | Le terminal écrit seul                  | Quelqu'un répond             | terminal_corrupt.js | type.wav          | terminal.js       | ROOT.LOG  | —        | Revient               |
| CAS-006 | Critique | Système       | Toutes   | 5    | Toute nuit | Script     | Conditions secrètes  | Faux reboot                             | Cassidy prend le contrôle    | reboot.png          | reboot.wav        | reboot.js         | —         | —        | Fin alternative       |
| CAS-007 | Haute    | Overlay       | Toutes   | 3-5  | Toute nuit | 2%         | Observer             | Visage d'enfant pendant un glitch       | Mémoire fragmentée           | face_flash.png      | static.wav        | face.js           | —         | —        | 1 frame               |
| CAS-008 | Haute    | Texte         | Terminal | 4-5  | Variable   | 1%         | Lecture log          | Mot remplacé par "ME"                   | Cassidy interrompt           | corrupt_font.png    | glitch.wav        | corrupt.js        | ADMIN.LOG | —        | Persistant            |
| CAS-009 | Haute    | Audio         | Bureau   | 5    | 04h00      | 2%         | Silence              | Respiration proche                      | Cassidy est dans le bureau   | —                   | breathe_child.wav | breathe.js        | —         | TAPE050  | Très rare             |
| CAS-010 | Critique | Hallucination | Toutes   | 5    | Toute nuit | Conditions | Fin lore             | Golden Freddy disparaît avant d'être vu | Elle hésite                  | golden_shadow.png   | fade.wav          | vanish.js         | —         | —        | Bonne ou mauvaise fin |

Série "Les Erreurs"

Cassidy ne produit jamais une anomalie complète.

Elle casse celles des autres.
| ID      | Description                     |
| ------- | ------------------------------- |
| CAS-011 | Une ligne du terminal disparaît |
| CAS-012 | Une image saute une frame       |
| CAS-013 | Un son s'arrête brutalement     |
| CAS-014 | Le curseur change de place      |
| CAS-015 | Une caméra revient en arrière   |

Série "Les Faux Souvenirs"

Ce sont les anomalies les plus dangereuses.

Le joueur pense revoir un souvenir.

En réalité...

Cassidy le modifie.
| ID      | Description                                   |
| ------- | --------------------------------------------- |
| CAS-016 | Freddy regarde le joueur au lieu de la chaise |
| CAS-017 | Foxy cesse de jouer et fixe la caméra         |
| CAS-018 | Chica semble regarder le bureau               |
| CAS-019 | Bonnie abandonne son dessin                   |
| CAS-020 | Tous les souvenirs se figent                  |


Série "Michael"

C'est le cœur du jeu.

Cassidy croit voir William.

Le joueur ne comprend pas pourquoi.
| ID      | Description               |
| ------- | ------------------------- |
| CAS-021 | "YOU CAME BACK" (1 frame) |
| CAS-022 | "WHY"                     |
| CAS-023 | "LOOK AT ME"              |
| CAS-024 | "DON'T LEAVE"             |
| CAS-025 | "IT'S YOU"                |


Série "Terminal"

Le terminal devient vivant.
| ID      | Commande | Contenu                                     |
| ------- | -------- | ------------------------------------------- |
| CAS-026 | ROOT.LOG | Logs supprimés automatiquement              |
| CAS-027 | MEMORY   | Segments mémoire corrompus                  |
| CAS-028 | USER     | Nom de l'utilisateur remplacé par `UNKNOWN` |
| CAS-029 | DELETE   | Liste des anomalies "corrigées"             |
| CAS-030 | RECOVER  | Fichiers impossibles à restaurer            |

Série "Le Reboot"

C'est la mécanique entre les nuits.

Quand le joueur supprime les anomalies...

Le système répond.
| ID      | Description  |
| ------- | ------------ |
| CAS-031 | Scan mémoire |
| CAS-032 | Suppression  |
| CAS-033 | Vérification |
| CAS-034 | Reboot       |
| CAS-035 | **IT'S ME**  |

Série "Golden Freddy"

Ces événements sont les plus rares.
| ID      | Description                             |
| ------- | --------------------------------------- |
| CAS-036 | Golden Freddy dans une caméra (1 frame) |
| CAS-037 | Golden Freddy dans le bureau            |
| CAS-038 | Tête de Golden Freddy sur une affiche   |
| CAS-039 | Costume vide dans Backstage             |
| CAS-040 | Ombre jaune dans le couloir             |

Assets Graphiques
Golden Freddy
golden_idle.png
golden_shadow.png
golden_sit.png
golden_vanish.png
golden_head.png
CRT
crt_noise01.png
crt_noise02.png
crt_vertical.png
crt_horizontal.png
crt_burn.png
Overlays
itsme_overlay.png
face_flash.png
eye_closeup.png
static_noise.png
unknown_user.png
Sons
whisper01.wav
whisper02.wav
reversed_voice.wav
static_burst.wav
crt_pop.wav
child_breath.wav
reboot_click.wav
memory_fail.wav
distant_hum.wav
golden_presence.wav
Terminal
ROOT.LOG

Historique des suppressions automatiques.

MEMORY.LOG

Secteurs mémoire impossibles à corriger.

DELETE.LOG

Liste des anomalies supprimées…

…qui réapparaissent malgré tout la nuit suivante.

USER.LOG
Utilisateur actuel :

Michael

...

ERREUR

William

Puis l'écran se réinitialise immédiatement.

Le joueur n'a parfois pas le temps de lire.

RECOVER.LOG
1 fichier restauré

...

Suppression impossible
Journaux

Contrairement aux autres enfants...

Cassidy n'a aucun journal.

La presse n'a jamais parlé d'elle.

C'est une absence volontaire.

Le joueur peut même remarquer qu'il manque une victime dans les archives.

Cassettes
| ID          | Contenu                                                                                |
| ----------- | -------------------------------------------------------------------------------------- |
| TAPE_CAS_01 | Bande vide, seulement du souffle.                                                      |
| TAPE_CAS_02 | Un "Hello?" très faible, presque effacé.                                               |
| TAPE_CAS_03 | Un enregistrement se coupe au moment où une voix d'enfant semble répondre à un adulte. |

Premier glitch CRT
        │
        ▼
Premier "IT'S ME"
        │
        ▼
ROOT.LOG
        │
        ▼
DELETE.LOG
        │
        ▼
Le terminal écrit seul
        │
        ▼
Golden Freddy (1 frame)
        │
        ▼
Le joueur comprend que quelqu'un
essaie d'arrêter l'enquête.

⭐ Ce que je changerais encore (et qui, à mon avis, ferait de Les Mensonges une expérience unique)

Je ferais de Cassidy une présence adaptative, pas un simple ensemble d'événements aléatoires.

Au lieu d'une probabilité fixe, Cassidy aurait une "Jauge de Méfiance" invisible.

Chaque action du joueur la fait évoluer :

consulter souvent les terminaux : + Méfiance ;
écouter les vieilles cassettes : + Méfiance ;
corriger les anomalies entre les nuits : + Méfiance ;
simplement survivre sans enquêter : − Méfiance.

Quand cette jauge augmente, Cassidy ne devient pas plus agressive… elle devient plus personnelle. Les messages passent de « IT'S ME » à « WHY », puis à « YOU CAME BACK ». Elle est convaincue que William est revenu. Ce n'est que dans la bonne fin, lorsque le joueur a découvert suffisamment d'indices sur les quatre autres enfants, que cette confusion peut commencer à se dissiper. Sans jamais prononcer explicitement les mots « tu n'es pas William », le jeu laisse comprendre que Cassidy finit par voir Michael Afton comme quelqu'un qui cherche la vérité plutôt que quelqu'un qui revient pour faire du mal.

À mon sens, cette progression est plus fidèle à l'esprit de FNAF : le mystère reste intact, mais chaque partie raconte une histoire légèrement différente selon la façon dont le joueur choisit… ou non… d'enquêter.