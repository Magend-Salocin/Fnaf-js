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

| ID      | Priorité | Type    | Salle       | Caméra | Nuit | Heure       | Chance | Déclencheur   | Description                               | Lore                            | Asset           | Son          | Script JS      | Terminal  | Journal | Cassette | Évolution            |
| ------- | -------- | ------- | ----------- | ------ | ---- | ----------- | ------ | ------------- | ----------------------------------------- | ------------------------------- | --------------- | ------------ | -------------- | --------- | ------- | -------- | -------------------- |
| FRT-001 | Critique | Objet   | Pirate Cove | CAM05  | 2    | 02h00-02h30 | 8%     | Observer 5 s  | Petite voiture rouge apparaît             | Jouet préféré de Fritz          | car_red.png     | toy_roll.wav | car_memory.js  | LOST031   | —       | —        | Revient ailleurs     |
| FRT-002 | Critique | IA      | Pirate Cove | CAM05  | 2    | 02h00       | 5%     | Retour caméra | Foxy pousse doucement la voiture          | Fritz continue de jouer         | foxy_car01.png  | wheel.wav    | foxy_car.js    | —         | —       | —        | Plusieurs animations |
| FRT-003 | Haute    | Overlay | Pirate Cove | CAM05  | 2    | Toute nuit  | 12%    | Retour caméra | La voiture change de position             | Souvenir vivant                 | overlay_car.png | —            | overlay_car.js | LOST032   | —       | —        | Persistant           |
| FRT-004 | Haute    | Objet   | Pirate Cove | CAM05  | 3    | 01h45       | 6%     | Observer      | Bateau pirate miniature                   | Jeu abandonné                   | boat.png        | wood.wav     | boat.js        | LOST033   | NEWS031 | —        | Vieillit             |
| FRT-005 | Haute    | Objet   | Pirate Cove | CAM05  | 3    | Toute nuit  | 9%     | Observer      | Coffre à trésor entrouvert                | Fritz jouait aux pirates        | chest.png       | creak.wav    | chest.js       | REPORT031 | —       | TAPE031  | Peut s'ouvrir        |
| FRT-006 | Haute    | Son     | Bureau      | —      | 2    | 02h20       | 7%     | Silence       | Petite voiture qui roule                  | Fritz traverse le couloir       | —               | toy_car.wav  | toy_audio.js   | —         | —       | —        | Plus proche          |
| FRT-007 | Haute    | IA      | Pirate Cove | CAM05  | 3    | 03h00       | 4%     | Observer 10 s | Foxy ramasse le bateau                    | Le souvenir évolue              | foxy_boat.png   | wood.wav     | foxy_boat.js   | —         | —       | —        | Animation longue     |
| FRT-008 | Haute    | Décor   | Pirate Cove | CAM05  | 3    | Toute nuit  | 6%     | Observer      | Trois cubes en bois apparaissent          | Jeu d'enfant                    | cubes.png       | block.wav    | cubes.js       | LOST034   | —       | —        | Déplacés             |
| FRT-009 | Haute    | Overlay | West Hall   | CAM02  | 4    | Toute nuit  | 5%     | Retour caméra | Petite voiture dans le couloir            | Le souvenir sort de Pirate Cove | hallway_car.png | wheel.wav    | hallway.js     | REPORT032 | NEWS032 | —        | Disparaît            |
| FRT-010 | Critique | IA      | Pirate Cove | CAM05  | 5    | 03h30       | 2%     | Retour caméra | Foxy aligne soigneusement tous les jouets | Fritz termine sa partie         | foxy_toys.png   | toys.wav     | final_play.js  | —         | —       | TAPE032  | Ne revient plus      |

Série "Les Jouets"
| ID      | Objet            | Lore                                  |
| ------- | ---------------- | ------------------------------------- |
| FRT-011 | Voiture rouge    | Jouet favori de Fritz                 |
| FRT-012 | Bateau pirate    | Pirate Cove devient un terrain de jeu |
| FRT-013 | Coffre miniature | Chasse au trésor imaginaire           |
| FRT-014 | Cube en bois     | Construction interrompue              |
| FRT-015 | Figurine pirate  | Le capitaine du jeu                   |

Série "Les Déplacements"

Le restaurant semble rejouer la scène.
| ID      | Description                                       |
| ------- | ------------------------------------------------- |
| FRT-016 | La voiture avance seule                           |
| FRT-017 | Le bateau change d'étagère                        |
| FRT-018 | Un cube disparaît                                 |
| FRT-019 | Le coffre est refermé                             |
| FRT-020 | Tous les objets reviennent à leur place avant 6 h |

Série "Foxy"

Foxy n'est jamais agressif dans ces anomalies.

Il joue.
| ID      | Description                   |
| ------- | ----------------------------- |
| FRT-021 | Foxy regarde la voiture       |
| FRT-022 | Foxy pousse le bateau         |
| FRT-023 | Foxy ramasse un cube          |
| FRT-024 | Foxy laisse tomber un jouet   |
| FRT-025 | Foxy regarde le coffre ouvert |

Série "Les Jeux"

Ces événements donnent vraiment l'impression qu'un enfant joue.
| ID      | Description                         |
| ------- | ----------------------------------- |
| FRT-026 | Tour de cubes construite            |
| FRT-027 | Tour écroulée au retour caméra      |
| FRT-028 | Voiture sous une table              |
| FRT-029 | Trésor sorti du coffre              |
| FRT-030 | Jouets parfaitement rangés à 5 h 55 |

Série "Terminal"
| ID      | Commande   | Contenu                         |
| ------- | ---------- | ------------------------------- |
| FRT-031 | TOYS.LOG   | Inventaire des jouets retrouvés |
| FRT-032 | PIRATE.LOG | Historique de Pirate Cove       |
| FRT-033 | LOST_TOYS  | Jouets jamais récupérés         |
| FRT-034 | MAINT_05   | Réparations de Pirate Cove      |
| FRT-035 | STAGE_PROP | Accessoires de spectacle        |

Assets Graphiques
Jouets
car_red.png
car_red_old.png
pirate_boat.png
pirate_chest.png
pirate_chest_open.png
pirate_figure.png
wooden_blocks.png
wooden_blocks_stack.png
toy_soldier.png
treasure_map.png
Foxy
foxy_car_push_01.png
foxy_car_push_02.png
foxy_boat_hold.png
foxy_blocks.png
foxy_look_toy.png
Overlays
toy_shadow.png
hallway_car.png
pirate_floor_toys.png
chest_open_overlay.png
block_tower_overlay.png

Sons à Produire
toy_car_roll.wav
wooden_block.wav
chest_creak.wav
pirate_flag.wav (tissu qui bouge légèrement)
toy_drop.wav
child_run_far.wav (extrêmement rare)
pirate_bell.wav
toy_slide.wav
wood_knock.wav
pirate_roomtone.wav

Terminal
TOYS.LOG

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