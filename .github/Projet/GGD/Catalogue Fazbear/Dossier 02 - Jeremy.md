DOSSIER 02 — JEREMY

| Élément            | Valeur                                |
| ------------------ | ------------------------------------- |
| Nom                | Jeremy                                |
| Animatronique      | Bonnie                                |
| Thème              | Les dessins inachevés                 |
| Émotion            | La créativité interrompue             |
| Couleur            | Bleu clair → gris                     |
| Salle principale   | Backstage                             |
| Salles secondaires | Supply Closet, West Hall, Dining Area |


Philosophie

Contrairement à Gabriel qui attend...

Jeremy crée encore.

Il termine des dessins.

Il replace des feuilles.

Il cherche ses crayons.

Le restaurant essaye de terminer ses dessins.

Mais il n'y arrive jamais.

Tableau de Production
| ID      | Priorité | Type    | Salle         | Caméra | Nuit | Heure         | Chance | Déclencheur   | Description                               | Lore                       | Image               | Son             | JS               | Terminal | Journal | Cassette | Évolution             |
| ------- | -------- | ------- | ------------- | ------ | ---- | ------------- | ------ | ------------- | ----------------------------------------- | -------------------------- | ------------------- | --------------- | ---------------- | -------- | ------- | -------- | --------------------- |
| JER-001 | Haute    | Objet   | Backstage     | CAM07  | 1    | Toute nuit    | 18%    | Observer      | Une feuille blanche apparaît              | Jeremy préparait un dessin | paper_blank.png     | paper.wav       | paper.js         | LOST010  | —       | —        | Peut être dessinée    |
| JER-002 | Haute    | Overlay | Backstage     | CAM07  | 2    | Retour caméra | 12%    | Retour caméra | Un soleil est dessiné                     | Dessin terminé             | drawing_sun.png     | pencil.wav      | draw.js          | DRAW01   | —       | —        | Devient complet       |
| JER-003 | Haute    | Objet   | Supply Closet | CAM06  | 2    | Toute nuit    | 10%    | Observer      | Une boîte de crayons apparaît             | Crayons oubliés            | crayons_box.png     | crayons.wav     | crayons.js       | LOST011  | —       | —        | Couleurs changent     |
| JER-004 | Haute    | IA      | Backstage     | CAM07  | 2    | 02h00         | 7%     | Observer 8s   | Bonnie tient un crayon                    | Bonnie continue le dessin  | bonnie_pencil.png   | scratch.wav     | bonnie_draw.js   | —        | —       | TAPE010  | Plusieurs états       |
| JER-005 | Haute    | Overlay | Dining Area   | CAM01  | 3    | 03h00         | 6%     | Retour caméra | Un dessin est accroché au mur             | Personne ne l'avait vu     | child_drawing01.png | —               | drawing_wall.js  | DRAW02   | NEWS010 | —        | Vieillit              |
| JER-006 | Moyenne  | Son     | Backstage     | CAM07  | 2    | Toute nuit    | 9%     | Silence       | Bruit de crayon sur papier                | Jeremy dessine             | —                   | pencil_loop.wav | audio_draw.js    | —        | —       | —        | Devient plus long     |
| JER-007 | Haute    | Objet   | Supply Closet | CAM06  | 3    | Toute nuit    | 8%     | Observer      | Une gomme est posée sur une table         | Quelqu'un corrige          | eraser.png          | eraser.wav      | eraser.js        | LOST012  | —       | —        | Disparaît             |
| JER-008 | Haute    | Décor   | Backstage     | CAM07  | 3    | 01h00         | 6%     | Observer      | Deux feuilles sont au sol                 | Dessins abandonnés         | papers_floor.png    | paper.wav       | papers.js        | DRAW03   | —       | —        | Une feuille disparaît |
| JER-009 | Haute    | IA      | Backstage     | CAM07  | 4    | 02h30         | 4%     | Retour caméra | Bonnie tourne une feuille                 | Le dessin continue         | bonnie_turn.png     | page.wav        | bonnie_page.js   | —        | —       | TAPE011  | Persistant            |
| JER-010 | Haute    | Objet   | Dining Area   | CAM01  | 4    | Toute nuit    | 5%     | Observer      | Un dessin d'enfant est posé sur une table | Aucun adulte ne l'a vu     | drawing_table.png   | —               | drawing_table.js | LOST013  | NEWS011 | —        | Jaunit                |

Série "Les Dessins"
| ID      | Description                | Lore                                  |
| ------- | -------------------------- | ------------------------------------- |
| JER-011 | Dessin d'un soleil         | Un souvenir heureux avant le drame    |
| JER-012 | Dessin de Freddy           | Jeremy admirait les animatroniques    |
| JER-013 | Dessin de Bonnie           | Bonnie devient son refuge             |
| JER-014 | Dessin d'une maison        | Il voulait rentrer chez lui           |
| JER-015 | Dessin d'une famille       | Les parents ne reviendront jamais     |
| JER-016 | Dessin de cinq enfants     | Première allusion aux victimes        |
| JER-017 | Dessin barré               | Quelqu'un tente d'effacer le souvenir |
| JER-018 | Dessin déchiré             | La mémoire se fragmente               |
| JER-019 | Dessin inachevé            | Le souvenir reste bloqué              |
| JER-020 | Feuille totalement blanche | Le souvenir s'efface                  |


Série "Les Crayons"
| ID      | Description                       |
| ------- | --------------------------------- |
| JER-021 | Crayon bleu au sol                |
| JER-022 | Crayon rouge cassé                |
| JER-023 | Crayon vert disparaît             |
| JER-024 | Les crayons changent de place     |
| JER-025 | Un seul crayon reste sur la table |

Série "Bonnie"
| ID      | Description                            |
| ------- | -------------------------------------- |
| JER-026 | Bonnie regarde un dessin               |
| JER-027 | Bonnie dessine                         |
| JER-028 | Bonnie tient une feuille               |
| JER-029 | Bonnie baisse la tête devant un dessin |
| JER-030 | Bonnie repose doucement le crayon      |

Série "Terminal"
| ID      | Commande     | Contenu                          |
| ------- | ------------ | -------------------------------- |
| JER-031 | DRAWINGS.LOG | Inventaire des dessins retrouvés |
| JER-032 | LOST_ART     | Matériel scolaire oublié         |
| JER-033 | CLEANING     | Dessins retirés des murs         |
| JER-034 | CHILDREN_ART | Exposition interne des dessins   |
| JER-035 | SCANNER      | Archives de dessins numérisés    |

Assets Graphiques
Dessins
drawing_sun.png
drawing_house.png
drawing_family.png
drawing_freddy.png
drawing_bonnie.png
drawing_children.png
drawing_crossed.png
drawing_torn.png
drawing_blank.png
drawing_table.png
Objets
crayons_box.png
crayon_blue.png
crayon_red.png
crayon_green.png
eraser.png
paper_blank.png
paper_half.png
paper_complete.png
papers_floor.png
clipboard.png
Bonnie
bonnie_draw_01.png
bonnie_draw_02.png
bonnie_turn_page.png
bonnie_holding_pencil.png
bonnie_looking_picture.png
Sons à Produire
pencil_draw.wav
paper_slide.wav
page_turn.wav
crayon_drop.wav
eraser_move.wav
child_humming.wav (très rare, presque inaudible)
tape_measure.wav (maintenance en arrière-plan)
paper_rip.wav
chair_creak.wav
ventilation_backstage.wav

Terminal
DRAWINGS.LOG

Inventaire des dessins retirés des murs.

LOST_ART.LOG

Liste des cahiers, feuilles et crayons jamais réclamés.

SCANNER.LOG

Archives de dessins d'enfants numérisés avant rénovation.

CHILDREN_ART.LOG

Planning d'une exposition jamais réalisée.

CLEANING.LOG

Ordres internes : retirer les dessins après "l'incident".

Journaux
| ID          | Titre                                                         |
| ----------- | ------------------------------------------------------------- |
| NEWS_JER_01 | « Les décorations du restaurant sont renouvelées »            |
| NEWS_JER_02 | « Les dessins des enfants remplacés par de nouveaux modèles » |
| NEWS_JER_03 | « Les murs repeints après plusieurs dégradations »            |

Cassettes
| ID          | Contenu                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| TAPE_JER_01 | Consignes pour installer un concours de dessin                                                                                  |
| TAPE_JER_02 | Rappel de retirer les feuilles laissées sur les tables après fermeture                                                          |
| TAPE_JER_03 | Enregistrement interrompu d'un employé disant : *« Il y a encore des dessins ce matin... pourtant on les avait tous retirés. »* |


Feuille blanche (JER-001)
        │
        ▼
Soleil dessiné (JER-002)
        │
        ▼
Boîte de crayons (JER-003)
        │
        ▼
Bonnie dessine (JER-004)
        │
        ▼
DRAWINGS.LOG
        │
        ▼
Journal sur les murs repeints
        │
        ▼
Cassette : "Retirez les dessins."
        │
        ▼
Dessin de cinq enfants (JER-016)