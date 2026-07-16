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

| ID      | Priorité | Type    | Salle         | Caméra | Nuit | Heure         | Chance | Déclencheur   | Description                                                         | Lore                                  | Son             | JS               | Terminal | Journal | Cassette | RequiresEvent |
| ------- | -------- | ------- | ------------- | ------ | ---- | ------------- | ------ | ------------- | ------------------------------------------------------------------- | ------------------------------------- | --------------- | ---------------- | -------- | ------- | -------- | ------------- |
| X JER-001 | Haute    | Objet   | West Hall     | CAM07  | 1    | Toute nuit    | 18%    | Observer      | Une feuille blanche apparaît                                        | Jeremy préparait un dessin            | paper.wav       | paper.js         | LOST010  | —       | —        | —             |
| X JER-002 | Haute    | Overlay | West Hall     | CAM07  | 2    | Retour caméra | 12%    | Retour caméra | Un soleil est dessiné                                               | Dessin terminé                        | pencil.wav      | draw.js          | DRAW01   | —       | —        | **JER-001**   |
| X JER-003 | Haute    | Objet   | Supply Closet | CAM06  | 2    | Toute nuit    | 10%    | Observer      | Une boîte de crayons apparaît                                       | Crayons oubliés                       | crayons.wav     | crayons.js       | LOST011  | —       | —        | **JER-001**   |
| X JER-004 | Haute    | IA      | Backstage     | CAM07  | 2    | 02h00         | 7%     | Observer 8s   | Bonnie tient un crayon                                              | Bonnie continue le dessin             | scratch.wav     | bonnie_draw.js   | —        | —       | TAPE010  | **JER-003**   |
| X JER-005 | Haute    | Overlay | Dining Area   | CAM01  | 3    | 03h00         | 6%     | Retour caméra | Un dessin est accroché au mur                                       | Personne ne l'avait vu                | —               | drawing_wall.js  | DRAW02   | NEWS010 | —        | **JER-004**   |
| JER-006 | Moyenne  | Son     | Supply Closet | CAM07  | 2    | Toute nuit    | 9%     | Silence       | Bruit de crayon sur papier                                          | Jeremy dessine                        | pencil_loop.wav | audio_draw.js    | —        | —       | —        | **JER-003**   |
| X JER-007 | Haute    | Objet   | Supply Closet | CAM06  | 3    | Toute nuit    | 8%     | Observer      | Une gomme est posée sur le sol, un dessin d'anniversaire est effacé | Quelqu'un corrige                     | eraser.wav      | eraser.js        | LOST012  | —       | —        | **JER-002**   |
| JER-008 | Haute    | Décor   | Supply Closet | CAM07  | 3    | 01h00         | 6%     | Observer      | Deux feuilles sont au sol                                           | Dessins abandonnés                    | paper.wav       | papers.js        | DRAW03   | —       | —        | **JER-007**   |
| X JER-009 | Haute    | IA      | West Hall     | CAM07  | 4    | 02h30         | 4%     | Retour caméra | Bonnie tourne une feuille                                           | Le dessin continue                    | page.wav        | bonnie_page.js   | —        | —       | TAPE011  | **JER-008**   |
| X JER-010 | Haute    | Objet   | Backstage     | CAM01  | 4    | Toute nuit    | 5%     | Observer      | Un dessin d'enfant est posé sur une table                           | Aucun adulte ne l'a vu                | —               | drawing_table.js | LOST013  | NEWS011 | —        | **JER-009**   |
| JER-011 | Haute    | Objet   | Backstage     | CAM01  | 4    | Toute nuit    | 5%     | Observer      | Dessin d'un soleil                                                  | Un souvenir heureux avant le drame    | —               | —                | LOST000  | NEWS000 | —        | **JER-010**   |
| X JER-012 | Haute    | Objet   | Backstage     | CAM01  | 4    | Toute nuit    | 5%     | Observer      | Dessin de Freddy                                                    | Jeremy admirait les animatroniques    | —               | —                | LOST000  | NEWS000 | —        | **JER-011**   |
| X JER-013 | Haute    | Objet   | Backstage     | CAM01  | 4    | Toute nuit    | 5%     | Observer      | Dessin de Bonnie                                                    | Bonnie devient son refuge             | —               | —                | LOST000  | NEWS000 | —        | **JER-012**   |
| X JER-014 | Haute    | Objet   | Backstage     | CAM01  | 4    | Toute nuit    | 5%     | Observer      | Dessin d'une maison                                                 | Il voulait rentrer chez lui           | —               | —                | LOST000  | NEWS000 | —        | **JER-013**   |
| X JER-015 | Haute    | Objet   | Backstage     | CAM01  | 4    | Toute nuit    | 5%     | Observer      | Dessin d'une famille                                                | Les parents ne reviendront jamais     | —               | —                | LOST000  | NEWS000 | —        | **JER-014**   |
| JER-016 | Haute    | Objet   | Backstage     | CAM01  | 4    | Toute nuit    | 5%     | Observer      | Dessin de cinq enfants                                              | Première allusion aux victimes        | —               | —                | LOST000  | NEWS000 | —        | **JER-015**   |
| JER-017 | Haute    | Objet   | Backstage     | CAM01  | 4    | Toute nuit    | 5%     | Observer      | Dessin barré                                                        | Quelqu'un tente d'effacer le souvenir | —               | —                | LOST000  | NEWS000 | —        | **JER-016**   |
| JER-018 | Haute    | Objet   | Backstage     | CAM01  | 4    | Toute nuit    | 5%     | Observer      | Dessin déchiré                                                      | La mémoire se fragmente               | —               | —                | LOST000  | NEWS000 | —        | **JER-017**   |
| JER-019 | Haute    | Objet   | Backstage     | CAM01  | 4    | Toute nuit    | 5%     | Observer      | Dessin inachevé                                                     | Le souvenir reste bloqué              | —               | —                | LOST000  | NEWS000 | —        | **JER-018**   |
| JER-020 | Haute    | Objet   | Backstage     | CAM01  | 4    | Toute nuit    | 5%     | Observer      | Feuille totalement blanche                                          | Le souvenir s'efface                  | —               | —                | LOST000  | NEWS000 | —        | **JER-019**   |
| JER-021 | Moyenne  | Objet   | Supply Closet | CAM06  | 3    | Toute nuit    | 10%    | Observer      | Crayon bleu au sol                                                  | Jeremy a commencé son dessin          | paper.wav       | crayon_blue.js   | LOST014  | —       | —        | **JER-003**   |
| JER-022 | Moyenne  | Objet   | Supply Closet | CAM06  | 3    | Toute nuit    | 8%     | Observer      | Crayon rouge cassé                                                  | Quelqu'un s'est interrompu            | crack.wav       | crayon_red.js    | LOST015  | —       | —        | **JER-021**   |
| JER-023 | Moyenne  | Objet   | Supply Closet | CAM06  | 4    | Toute nuit    | 7%     | Retour caméra | Le crayon vert disparaît                                            | Le souvenir s'efface                  | whoosh.wav      | crayon_green.js  | LOST016  | —       | —        | **JER-022**   |
| JER-024 | Haute    | Décor   | Supply Closet | CAM06  | 4    | Retour caméra | 6%     | Retour caméra | Les crayons changent de place                                       | Une présence continue le dessin       | paper.wav       | crayons_move.js  | DRAW04   | —       | TAPE012  | **JER-023**   |
| JER-025 | Haute    | Objet   | Supply Closet | CAM06  | 5    | Toute nuit    | 5%     | Observer      | Un seul crayon reste sur la table                                   | Il ne reste qu'un souvenir            | pencil.wav      | last_crayon.js   | LOST017  | NEWS012 | —        | **JER-024**   |
| JER-026 | Haute    | IA      | Backstage     | CAM07  | 3    | 01h30         | 8%     | Observer 8s   | Bonnie regarde un dessin                                            | Il contemple l'œuvre de Jeremy        | breath.wav      | bonnie_look.js   | —        | —       | TAPE013  | **JER-005**   |
| JER-027 | Haute    | IA      | Backstage     | CAM07  | 3    | 02h30         | 7%     | Observer 8s   | Bonnie dessine                                                      | Le dessin continue sans personne      | scratch.wav     | bonnie_draw2.js  | —        | —       | TAPE014  | **JER-026**   |
| JER-028 | Haute    | IA      | Backstage     | CAM07  | 4    | 01h00         | 6%     | Retour caméra | Bonnie tient une feuille                                            | Il protège un souvenir                | paper.wav       | bonnie_sheet.js  | —        | —       | TAPE015  | **JER-027**   |
| JER-029 | Haute    | IA      | Backstage     | CAM07  | 4    | 03h00         | 5%     | Retour caméra | Bonnie baisse la tête devant un dessin                              | Comme un instant de recueillement     | servo.wav       | bonnie_head.js   | —        | NEWS013 | —        | **JER-028**   |
| JER-030 | Haute    | IA      | Backstage     | CAM07  | 5    | 04h00         | 4%     | Observer 10s  | Bonnie repose doucement le crayon                                   | Le dessin est enfin terminé           | drop.wav        | bonnie_finish.js | DRAW05   | NEWS014 | TAPE016  | **JER-029**   |



Série "Terminal"
| ID      | Commande     | Contenu                          |
| ------- | ------------ | -------------------------------- |
| JER-031 | DRAWINGS.LOG | Inventaire des dessins retrouvés |
| JER-032 | LOST_ART     | Matériel scolaire oublié         |
| JER-033 | CLEANING     | Dessins retirés des murs         |
| JER-034 | CHILDREN_ART | Exposition interne des dessins   |
| JER-035 | SCANNER      | Archives de dessins numérisés    |



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