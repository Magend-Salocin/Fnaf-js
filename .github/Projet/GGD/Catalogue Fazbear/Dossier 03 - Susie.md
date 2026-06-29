DOSSIER 03 — SUSIE

| Élément            | Valeur                                          |
| ------------------ | ----------------------------------------------- |
| Nom                | Susie                                           |
| Animatronique      | Chica                                           |
| Thème              | L'espoir manipulé                               |
| Émotion            | Innocence, confiance, perte                     |
| Couleur            | Jaune pâle → blanc                              |
| Salle principale   | Kitchen (CAM06 - audio uniquement), Dining Area |
| Salles secondaires | East Hall, Restrooms, Show Stage                |

Philosophie Narrative
Contrairement :

Gabriel attend.
Jeremy dessine.
Fritz joue.

Susie cherche.

Jamais le joueur ne voit son chien.

Mais tout le restaurant semble lui faire croire qu'il est tout proche.

Le joueur doute.

Susie doute.

C'est exactement ce qu'Afton voulait.

Tableau de Production
| ID      | Priorité | Type    | Salle       | Caméra | Nuit | Heure      | Chance | Déclencheur   | Description                         | Lore                              | Image            | Son           | Script JS     | Terminal  | Journal | Cassette | Evolution     |
| ------- | -------- | ------- | ----------- | ------ | ---- | ---------- | ------ | ------------- | ----------------------------------- | --------------------------------- | ---------------- | ------------- | ------------- | --------- | ------- | -------- | ------------- |
| SUS-001 | Haute    | Objet   | Dining Area | CAM01  | 1    | Toute nuit | 18%    | Observer      | Gamelle métallique sous une table   | Appartient au chien               | bowl.png         | bowl.wav      | bowl.js       | LOST021   | —       | —        | Se déplace    |
| SUS-002 | Haute    | Objet   | Dining Area | CAM01  | 2    | 01h00      | 10%    | Retour caméra | Laisse rouge oubliée                | Dernière promenade                | leash.png        | chain.wav     | leash.js      | LOST022   | NEWS021 | —        | Devient usée  |
| SUS-003 | Haute    | Son     | Kitchen     | Audio  | 2    | 02h15      | 5%     | Écoute CAM06  | Aboiement très lointain             | Faux espoir                       | —                | dog_far.wav   | audioDog.js   | —         | —       | TAPE021  | Plus proche   |
| SUS-004 | Haute    | IA      | Kitchen     | Audio  | 3    | 03h00      | 4%     | Écoute 10 s   | Chica tourne la tête vers une porte | Elle "entend" quelque chose       | chica_turn.png   | metal.wav     | chicaTurn.js  | —         | —       | —        | Persistant    |
| SUS-005 | Haute    | Overlay | Dining Area | CAM01  | 3    | Toute nuit | 7%     | Observer      | Cupcake légèrement déplacé          | Chica protège un souvenir         | cupcake_move.png | ceramic.wav   | cupcake.js    | REPORT021 | —       | —        | Revient       |
| SUS-006 | Haute    | Objet   | East Hall   | CAM04  | 3    | 01h30      | 6%     | Observer      | Petit collier pour chien            | Objet perdu                       | collar.png       | bell.wav      | collar.js     | LOST023   | NEWS022 | —        | Devient cassé |
| SUS-007 | Moyenne  | Son     | Bureau      | —      | 4    | 02h45      | 3%     | Silence       | Petit jappement très faible         | Souvenir                          | —                | puppy.wav     | puppy.js      | —         | —       | —        | Rare          |
| SUS-008 | Haute    | Overlay | Kitchen     | Audio  | 4    | Toute nuit | 5%     | Retour écoute | Bruit de gamelle déplacée           | Quelqu'un nourrit encore le chien | —                | bowl_move.wav | bowlMove.js   | CLEAN021  | —       | —        | Persistant    |
| SUS-009 | Haute    | Objet   | Dining Area | CAM01  | 5    | Toute nuit | 4%     | Observer      | Ruban jaune au sol                  | Susie                             | ribbon.png       | cloth.wav     | ribbon.js     | LOST024   | —       | TAPE022  | Vieillit      |
| SUS-010 | Haute    | IA      | Stage       | CAM01  | 5    | 04h00      | 2%     | Retour caméra | Chica regarde le joueur sans bouger | Confusion avec Michael            | chica_stare.png  | breathe.wav   | chicaStare.js | —         | —       | —        | Très rare     |


Série "Le Chien"

Le chien n'apparaît jamais.

Seulement des traces.
| ID      | Description                        | Lore                  |
| ------- | ---------------------------------- | --------------------- |
| SUS-011 | Gamelle déplacée                   | Quelqu'un est revenu  |
| SUS-012 | Laisse au sol                      | Dernière promenade    |
| SUS-013 | Collier usé                        | Objet jamais récupéré |
| SUS-014 | Empreintes de pattes poussiéreuses | Vieilles traces       |
| SUS-015 | Petite balle jaune sous une chaise | Jouet oublié          |

Série "Le Cupcake"
Le Cupcake devient le symbole de Chica protégeant Susie.
| ID      | Description                    |
| ------- | ------------------------------ |
| SUS-016 | Cupcake orienté vers la caméra |
| SUS-017 | Cupcake regarde la porte       |
| SUS-018 | Cupcake disparaît une seconde  |
| SUS-019 | Cupcake revient à sa place     |
| SUS-020 | Cupcake légèrement fissuré     |

Série "La Cuisine"

La cuisine est particulière : dans FNAF 1, on ne la voit jamais.

Seulement le son.

On exploite ce principe.
| ID      | Description                   |
| ------- | ----------------------------- |
| SUS-021 | Gamelle métallique déplacée   |
| SUS-022 | Placard ouvert                |
| SUS-023 | Couverts qui tombent          |
| SUS-024 | Eau qui coule                 |
| SUS-025 | Petit halètement très discret |

Série "Chica"
| ID      | Description                            |
| ------- | -------------------------------------- |
| SUS-026 | Chica regarde la cuisine               |
| SUS-027 | Chica protège le Cupcake               |
| SUS-028 | Chica baisse la tête                   |
| SUS-029 | Chica semble écouter                   |
| SUS-030 | Chica s'arrête devant une porte fermée |

Série "Terminal"
| ID      | Commande    | Contenu                                                     |
| ------- | ----------- | ----------------------------------------------------------- |
| SUS-031 | PETS.LOG    | Signalements d'animaux dans le restaurant                   |
| SUS-032 | LOST_PETS   | Objet trouvé : collier rouge                                |
| SUS-033 | KITCHEN.LOG | Bruits nocturnes signalés par les employés                  |
| SUS-034 | CLEANING    | Gamelle retrouvée plusieurs matins de suite                 |
| SUS-035 | REPORT_87   | Employé affirmant avoir entendu un chien après la fermeture |


Assets Graphiques
Objets
bowl.png
bowl_old.png
leash_red.png
leash_broken.png
collar_red.png
collar_old.png
yellow_ball.png
ribbon_yellow.png
cupcake_normal.png
cupcake_turn.png
Chica
chica_listening.png
chica_turn_left.png
chica_protect.png
chica_stare.png
chica_head_down.png
Overlays
footprints_small.png
dust_trail.png
bowl_shadow.png
kitchen_door_open.png
kitchen_door_closed.png
Sons à Produire
bowl_slide.wav
leash_chain.wav
puppy_bark_far.wav
puppy_whine.wav
collar_bell.wav
ceramic_hit.wav
breathing_child.wav
cupboard_open.wav
water_drip.wav
kitchen_roomtone.wav
Terminal
PETS.LOG

Historique de plaintes concernant un animal aperçu dans le restaurant après la fermeture.

LOST_PETS.LOG

Inventaire :

Collier rouge
Gamelle
Laisse

Aucun propriétaire revenu.

KITCHEN.LOG

Signalements de bruits nocturnes provenant de la cuisine alors qu'elle est vide.

CLEANING.LOG

Rapports des agents de nettoyage :

« La gamelle revient toujours au même endroit. »

REPORT_87

Déclaration d'un employé :

« J'aurais juré avoir entendu un chien cette nuit... mais les portes étaient verrouillées. »

Journaux
| ID          | Titre                                                              |
| ----------- | ------------------------------------------------------------------ |
| NEWS_SUS_01 | « Les employés évoquent des bruits inexpliqués dans les cuisines » |
| NEWS_SUS_02 | « La direction dément toute présence d'animaux »                   |
| NEWS_SUS_03 | « Les inspections sanitaires ne révèlent aucune anomalie »         |


Cassettes
| ID          | Contenu                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| TAPE_SUS_01 | Consignes : ne jamais laisser de nourriture après la fermeture.                                                                       |
| TAPE_SUS_02 | Employé : *« La gamelle était encore déplacée ce matin. »*                                                                            |
| TAPE_SUS_03 | Enregistrement interrompu : un aboiement lointain suivi d'un grésillement, puis la voix d'un superviseur : *« Effacez cette bande. »* |

Chaîne de Découverte (Lore Flow)
Gamelle (SUS-001)
        │
        ▼
Laisse rouge (SUS-002)
        │
        ▼
Premier aboiement (SUS-003)
        │
        ▼
Chica écoute la cuisine (SUS-004)
        │
        ▼
PETS.LOG
        │
        ▼
Journal : "Aucun animal retrouvé"
        │
        ▼
Cassette : "Effacez cette bande."
        │
        ▼
Le joueur comprend que Fazbear a volontairement supprimé tous les rapports liés aux événements qui ont servi à manipuler Susie.

💡 Proposition d'amélioration : faire de la cuisine un "espace de doute"

Je pense qu'on peut transformer la Kitchen en l'une des salles les plus mémorables du jeu.

Dans FNAF 1, on n'a jamais d'image, uniquement de l'audio. Conservons cette règle. Toutes les anomalies de Susie dans cette salle passent par le son : un collier qui tinte, une gamelle qui glisse, un léger aboiement, Chica qui semble réagir à quelque chose que le joueur ne verra jamais.

Ainsi, la cuisine devient un espace où l'imagination complète ce que les caméras refusent de montrer. C'est fidèle au gameplay de FNAF 1, respecte le lore officiel et renforce le thème de Susie : croire qu'il reste encore quelque chose à retrouver, sans jamais pouvoir le voir.