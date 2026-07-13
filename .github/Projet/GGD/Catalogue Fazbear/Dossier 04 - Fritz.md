DOSSIER 04 — FRITZ
Victime

| Élément            | Valeur                             |
| ------------------ | ---------------------------------- |
| Nom                | Fritz                              |
| Animatronique      | Foxy                               |
| Thème              | Les jeux interrompus               |
| Émotion            | L'énergie, l'impatience, l'enfance |
| Couleur            | Rouge / Bois / Métal               |
| Salle principale   | Pirate Cove                        |
| Salles secondaires | West Hall, Dining Area             |

Philosophie Narrative

Fritz est le seul enfant dont les souvenirs bougent.

Le restaurant ne montre jamais Fritz.

Il montre seulement les jouets qu'il continue de déplacer.

Plus les nuits avancent, plus Foxy semble interagir avec ces objets.

Le joueur finit par ne plus savoir :

Est-ce Foxy ?

Est-ce un souvenir ?

Ou est-ce le restaurant qui se souvient ?

# Tableau de Production

| ID      | Priorité | Type    | Salle           | Caméra    | Nuit | Heure         | Chance | Déclencheur   | Description                               | Lore                                  | Son          | Script JS          | Terminal  | Journal | Cassette | RequiresEvent |
| ------- | -------- | ------- | --------------- | --------- | ---- | ------------- | ------ | ------------- | ----------------------------------------- | ------------------------------------- | ------------ | ------------------ | --------- | ------- | -------- | ------------- |
| FRT-001 | Critique | Objet   | Pirate Cove     | CAM05     | 2    | 02h00–02h30   | 8%     | Observer 5 s  | Petite voiture rouge apparaît             | Jouet préféré de Fritz                | toy_roll.wav | car_memory.js      | LOST031   | —       | —        | —             |
| FRT-002 | Critique | IA      | Pirate Cove     | CAM05     | 2    | 02h00         | 5%     | Retour caméra | Foxy pousse doucement la voiture          | Fritz continue de jouer               | wheel.wav    | foxy_car.js        | —         | —       | —        | **FRT-001**   |
| FRT-003 | Haute    | Overlay | Pirate Cove     | CAM05     | 2    | Toute nuit    | 12%    | Retour caméra | La voiture change de position             | Souvenir vivant                       | —            | overlay_car.js     | LOST032   | —       | —        | **FRT-002**   |
| FRT-004 | Haute    | Objet   | Pirate Cove     | CAM05     | 3    | 01h45         | 6%     | Observer      | Bateau pirate miniature                   | Jeu abandonné                         | wood.wav     | boat.js            | LOST033   | NEWS031 | —        | **FRT-003**   |
| FRT-005 | Haute    | Objet   | Pirate Cove     | CAM05     | 3    | Toute nuit    | 9%     | Observer      | Coffre à trésor entrouvert                | Fritz jouait aux pirates              | creak.wav    | chest.js           | REPORT031 | —       | TAPE031  | **FRT-004**   |
| FRT-006 | Haute    | Son     | Bureau          | —         | 2    | 02h20         | 7%     | Silence       | Petite voiture qui roule                  | Fritz traverse le couloir             | toy_car.wav  | toy_audio.js       | —         | —       | —        | **FRT-001**   |
| FRT-007 | Haute    | IA      | Pirate Cove     | CAM05     | 3    | 03h00         | 4%     | Observer 10 s | Foxy ramasse le bateau                    | Le souvenir évolue                    | wood.wav     | foxy_boat.js       | —         | —       | —        | **FRT-004**   |
| FRT-008 | Haute    | Décor   | Pirate Cove     | CAM05     | 3    | Toute nuit    | 6%     | Observer      | Trois cubes en bois apparaissent          | Jeu d'enfant                          | block.wav    | cubes.js           | LOST034   | —       | —        | **FRT-007**   |
| FRT-009 | Haute    | Overlay | West Hall       | CAM02     | 4    | Toute nuit    | 5%     | Retour caméra | Petite voiture dans le couloir            | Le souvenir sort de Pirate Cove       | wheel.wav    | hallway.js         | REPORT032 | NEWS032 | —        | **FRT-006**   |
| FRT-010 | Critique | IA      | Pirate Cove     | CAM05     | 5    | 03h30         | 2%     | Retour caméra | Foxy aligne soigneusement tous les jouets | Fritz termine sa partie               | toys.wav     | final_play.js      | —         | —       | TAPE032  | **FRT-029**   |
| FRT-011 | Moyenne  | Objet   | **West Hall**   | **CAM02** | 2    | Toute nuit    | 8%     | Observer      | Voiture rouge                             | Jouet favori de Fritz                 | toy_roll.wav | red_car.js         | LOST035   | —       | —        | **FRT-001**   |
| FRT-012 | Moyenne  | Objet   | Pirate Cove     | CAM05     | 3    | Toute nuit    | 7%     | Observer      | Bateau pirate                             | Pirate Cove devient un terrain de jeu | wood.wav     | pirate_boat.js     | LOST036   | —       | —        | **FRT-004**   |
| FRT-013 | Moyenne  | Objet   | **Dining Area** | **CAM01** | 3    | Toute nuit    | 6%     | Observer      | Coffre miniature                          | Chasse au trésor imaginaire           | creak.wav    | mini_chest.js      | LOST037   | —       | —        | **FRT-005**   |
| FRT-014 | Moyenne  | Objet   | **West Hall**   | **CAM02** | 3    | Toute nuit    | 5%     | Observer      | Cube en bois                              | Construction interrompue              | block.wav    | cube.js            | LOST038   | —       | —        | **FRT-008**   |
| FRT-015 | Moyenne  | Objet   | **Dining Area** | **CAM01** | 4    | Toute nuit    | 4%     | Observer      | Figurine pirate                           | Le capitaine du jeu                   | figurine.wav | pirate_figure.js   | LOST039   | NEWS033 | —        | **FRT-013**   |
| FRT-016 | Haute    | Overlay | **West Hall**   | **CAM02** | 3    | Retour caméra | 6%     | Retour caméra | La voiture avance seule                   | Le jeu continue                       | wheel.wav    | car_move.js        | REPORT033 | —       | —        | **FRT-003**   |
| FRT-017 | Haute    | Overlay | **Dining Area** | **CAM01** | 4    | Retour caméra | 5%     | Retour caméra | Le bateau change d'étagère                | Quelqu'un joue encore                 | wood.wav     | boat_move.js       | REPORT034 | —       | —        | **FRT-012**   |
| FRT-018 | Haute    | Overlay | **West Hall**   | **CAM02** | 4    | Retour caméra | 5%     | Retour caméra | Un cube disparaît                         | La construction change                | block.wav    | cube_disappear.js  | REPORT035 | —       | —        | **FRT-014**   |
| FRT-019 | Haute    | Overlay | Pirate Cove     | CAM05     | 5    | Retour caméra | 4%     | Retour caméra | Le coffre est refermé                     | La partie est terminée                | creak.wav    | chest_close.js     | REPORT036 | —       | —        | **FRT-013**   |
| FRT-020 | Haute    | Overlay | Pirate Cove     | CAM05     | 5    | 05h55         | 3%     | Heure         | Tous les objets reviennent à leur place   | Comme si rien ne s'était passé        | reset.wav    | toys_reset.js      | REPORT037 | —       | TAPE033  | **FRT-019**   |
| FRT-021 | Haute    | IA      | Pirate Cove     | CAM05     | 3    | 02h30         | 6%     | Observer 8 s  | Foxy regarde la voiture                   | Il surveille le jouet                 | servo.wav    | foxy_watch_car.js  | —         | —       | —        | **FRT-002**   |
| FRT-022 | Haute    | IA      | Pirate Cove     | CAM05     | 3    | 03h00         | 5%     | Observer 8 s  | Foxy pousse le bateau                     | Le jeu continue                       | wood.wav     | foxy_push_boat.js  | —         | —       | —        | **FRT-007**   |
| FRT-023 | Haute    | IA      | Pirate Cove     | CAM05     | 4    | 02h30         | 5%     | Observer 8 s  | Foxy ramasse un cube                      | Il construit quelque chose            | block.wav    | foxy_cube.js       | —         | —       | —        | **FRT-014**   |
| FRT-024 | Haute    | IA      | Pirate Cove     | CAM05     | 4    | 03h30         | 4%     | Retour caméra | Foxy laisse tomber un jouet               | Comme un enfant distrait              | drop.wav     | foxy_drop.js       | —         | NEWS034 | —        | **FRT-023**   |
| FRT-025 | Haute    | IA      | Pirate Cove     | CAM05     | 5    | 03h45         | 3%     | Observer 10 s | Foxy regarde le coffre ouvert             | Il cherche un trésor                  | creak.wav    | foxy_chest.js      | —         | —       | TAPE034  | **FRT-019**   |
| FRT-026 | Haute    | Décor   | Pirate Cove     | CAM05     | 4    | Toute nuit    | 5%     | Retour caméra | Tour de cubes construite                  | Un enfant est passé par là            | block.wav    | tower_build.js     | REPORT038 | —       | —        | **FRT-023**   |
| FRT-027 | Haute    | Overlay | Pirate Cove     | CAM05     | 4    | Retour caméra | 5%     | Retour caméra | Tour écroulée                             | Personne ne l'a vue tomber            | crash.wav    | tower_fall.js      | REPORT039 | —       | —        | **FRT-026**   |
| FRT-028 | Haute    | Objet   | **Dining Area** | **CAM01** | 5    | Toute nuit    | 4%     | Observer      | Voiture sous une table                    | Fritz s'est caché en jouant           | wheel.wav    | car_under_table.js | LOST040   | —       | —        | **FRT-016**   |
| FRT-029 | Haute    | Objet   | Pirate Cove     | CAM05     | 5    | Toute nuit    | 3%     | Observer      | Trésor sorti du coffre                    | Le jeu touche à sa fin                | coins.wav    | treasure.js        | REPORT040 | NEWS035 | TAPE035  | **FRT-019**   |
| FRT-030 | Critique | Décor   | Pirate Cove     | CAM05     | 5    | 05h55         | 2%     | Heure         | Jouets parfaitement rangés                | Fritz a terminé de jouer              | toys.wav     | toys_sorted.js     | REPORT041 | NEWS036 | TAPE036  | **FRT-020**   |



Série "Terminal"
| ID      | Commande   | Contenu                         |
| ------- | ---------- | ------------------------------- |
| FRT-031 | TOYS.LOG   | Inventaire des jouets retrouvés |
| FRT-032 | PIRATE.LOG | Historique de Pirate Cove       |
| FRT-033 | LOST_TOYS  | Jouets jamais récupérés         |
| FRT-034 | MAINT_05   | Réparations de Pirate Cove      |
| FRT-035 | STAGE_PROP | Accessoires de spectacle        |


Inventaire des jouets retrouvés après fermeture.

LOST_TOYS.LOG

Liste des objets jamais récupérés :

Voiture rouge
Bateau pirate
Coffre miniature
Cubes en bois
PIRATE.LOG

Rapport de maintenance :

« Les jouets changent régulièrement de place pendant la nuit. »

Observation classée comme erreur de rangement.

MAINT_05.LOG

Plusieurs employés affirment que Pirate Cove est parfaitement rangé le soir, mais en désordre chaque matin.

STAGE_PROP.LOG

Accessoires utilisés pour les spectacles de Foxy.

Un coffre miniature est signalé comme disparu.

Journaux

| ID          | Titre                                                           |
| ----------- | --------------------------------------------------------------- |
| NEWS_FRT_01 | « Les parents réclament plusieurs jouets oubliés »              |
| NEWS_FRT_02 | « Les employés découvrent des objets déplacés pendant la nuit » |
| NEWS_FRT_03 | « Pirate Cove fermé temporairement pour inspection »            |

Cassettes
| ID          | Contenu                                                                      |
| ----------- | ---------------------------------------------------------------------------- |
| TAPE_FRT_01 | Consignes de rangement des jouets après chaque représentation.               |
| TAPE_FRT_02 | Employé : *« Qui a sorti tous les jouets ? On avait tout rangé hier soir… »* |
| TAPE_FRT_03 | Bruits de petites roues, un rire d'enfant très bref, puis une coupure nette. |


Voiture rouge (FRT-001)
        │
        ▼
Foxy pousse la voiture (FRT-002)
        │
        ▼
TOYS.LOG
        │
        ▼
Bateau pirate (FRT-004)
        │
        ▼
Coffre entrouvert (FRT-005)
        │
        ▼
Cassette : "Tout était rangé hier soir..."
        │
        ▼
Jouets alignés à 5 h 55 (FRT-030)

💡 Proposition d'amélioration : les "Souvenirs Vivants"

Je pense que Fritz devrait introduire une mécanique unique dans Les Mensonges : les Souvenirs Vivants.

Contrairement aux autres anomalies qui apparaissent simplement, certaines anomalies de Fritz seraient de véritables micro-scènes. Par exemple, entre 2 h 00 et 2 h 30, si le joueur observe suffisamment longtemps Pirate Cove, Foxy pousse lentement la voiture rouge jusqu'au coffre. Lors d'une autre partie, le joueur peut revenir à 2 h 12 et voir directement la voiture déjà déplacée, suivie d'un bref glitch qui remet instantanément la scène dans son état normal.

Ainsi, les souvenirs semblent continuer d'exister même lorsque le joueur ne regarde pas. Le restaurant devient un personnage à part entière, avec une mémoire qui fonctionne indépendamment du joueur. C'est une mécanique qui colle parfaitement à la vision de Les Mensonges et qui donnera envie aux joueurs de revisiter les nuits pour découvrir toutes les variantes cachées.