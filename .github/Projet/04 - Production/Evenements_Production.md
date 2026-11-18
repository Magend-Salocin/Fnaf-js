# Événements : production

Images et sons qui restent à produire. Les prompts des images sont dans [Prompts_Images_Cachees.md](Prompts_Images_Cachees.md), la procédure dans le Carnet du développeur.

Vue générée le 18/11/2026 par `node tools/vues_evenements.js` à partir des JSON de `script/config/`. Ne pas éditer : modifier le JSON, puis relancer le script.

## Résumé

| Élément | Fait | À produire | Provisoire | À ranger | Sans objet |
| --- | --- | --- | --- | --- | --- |
| Images | 80 | 25 |  | 3 | 19 |
| Sons | 69 | 15 | 43 |  |  |

## Images à produire

| ID | Nuit | Salle | Description | Fichier | Dossier |
| --- | --- | --- | --- | --- | --- |
| GAB-004 | 2 | Stage | Freddy regarde une chaise vide | GAB-004.png | 1a_show_stage |
| SUS-011 | 2 | Dining Area | Gamelle déplacée | SUS-011.png | 1b_dining_area |
| SUS-012 | 2 | Dining Area | Laisse au sol | SUS-012.png | 1b_dining_area |
| SUS-006 | 3 | East Hall | ??? | SUS-006.png | 4a_east_hall |
| SUS-004 | 3 | Kitchen | Chica tourne la tête vers une porte | SUS-004.png | 6_kitchen |
| SUS-016 | 3 | Dining Area | Cupcake orienté vers la caméra | SUS-016.png | 1b_dining_area |
| FRT-013 | 3 | Dining Area | Coffre miniature | FRT-013.png | 1b_dining_area |
| GAB-021 | 3 | Dining Area | Horloge bloquée à 17h45 | GAB-021.png | 1b_dining_area |
| SUS-017 | 3 | Dining Area | Cupcake regarde la porte | SUS-017.png | 1b_dining_area |
| FRT-017 | 4 | Dining Area | Le bateau change d'étagère | FRT-017.png | 1b_dining_area |
| GAB-022 | 4 | Dining Area | Horloge repart quelques secondes | GAB-022.png | 1b_dining_area |
| SUS-018 | 4 | Dining Area | Cupcake disparaît une seconde | SUS-018.png | 1b_dining_area |
| SUS-019 | 4 | Dining Area | Cupcake revient à sa place | SUS-019.png | 1b_dining_area |
| FRT-015 | 4 | Dining Area | Figurine pirate | FRT-015.png | 1b_dining_area |
| GAB-023 | 4 | Dining Area | Une seconde horloge affiche une autre heure | GAB-023.png | 1b_dining_area |
| JER-011 | 4 | Backstage | Dessin d'un soleil | JER-011.png | 5_backstage |
| SUS-008 | 4 | Kitchen | Bruit de gamelle déplacée | SUS-008.png | 6_kitchen |
| SUS-015 | 4 | Dining Area | Petite balle jaune sous une chaise | SUS-015.png | 1b_dining_area |
| GAB-024 | 5 | Stage | Les aiguilles tournent à l'envers | GAB-024.png | 1a_show_stage |
| SUS-010 | 5 | Stage | Chica regarde le joueur sans bouger | SUS-010.png | 1a_show_stage |
| GAB-025 | 5 | Dining Area | L'horloge revient à 00:00 | GAB-025.png | 1b_dining_area |
| FRT-028 | 5 | Dining Area | Voiture sous une table | FRT-028.png | 1b_dining_area |
| SUS-009 | 5 | Dining Area | Ruban jaune au sol | SUS-009.png | 1b_dining_area |
| SUS-020 | 5 | Dining Area | Cupcake légèrement fissuré | SUS-020.png | 1b_dining_area |
| CASSIDY-09 | 4 | Pirate Cove | Cinq jouets alignés devant le rideau | CASSIDY-09.png | 1c_pirate_cove |

## Images mal rangées

Le fichier existe, mais pas dans le dossier de la salle de l'événement : il ne s'affiche pas.

| ID | Nuit | Salle | Description | Fichier | Où |
| --- | --- | --- | --- | --- | --- |
| JER-021 | 3 | West Hall | Crayon bleu au sol | JER-021.png | dans 3_supply_closet, attendue dans 2a_west_hall |
| JER-023 | 4 | West Hall | Le crayon vert disparaît | JER-023.png | dans 3_supply_closet, attendue dans 2a_west_hall |
| JER-025 | 5 | West Hall | Un seul crayon reste sur la table | JER-025.png | dans 3_supply_closet, attendue dans 2a_west_hall |

## Sons à produire

`laugh_girl1` est le son provisoire. Procédure : skill `/ajouter-son`.

| ID | Nuit | Type | Description | Son actuel | État |
| --- | --- | --- | --- | --- | --- |
| GAB-002 | 1 | Screen | Un ballon jaune apparaît | laugh_girl1 | provisoire |
| JER-003 | 1 | Screen | Une boîte de crayons apparaît | laugh_girl1 | provisoire |
| GAB-003 | 2 | Décor | Une cinquième assiette apparaît |  | aucun |
| GAB-004 | 2 | IA | Freddy regarde une chaise vide | laugh_girl1 | provisoire |
| JER-004 | 2 | IA | Bonnie tient un crayon | laugh_girl1 | provisoire |
| FRT-003 | 2 | Overlay | La voiture change de position |  | aucun |
| FRT-004 | 3 | Objet | Bateau pirate miniature | laugh_girl1 | provisoire |
| JER-026 | 3 | IA | Bonnie regarde un dessin | laugh_girl1 | provisoire |
| JER-027 | 3 | IA | Bonnie dessine | laugh_girl1 | provisoire |
| FRT-007 | 3 | IA | Foxy ramasse le bateau | laugh_girl1 | provisoire |
| FRT-022 | 3 | IA | Foxy pousse le bateau | laugh_girl1 | provisoire |
| SUS-004 | 3 | IA | Chica tourne la tête vers une porte | laugh_girl1 | provisoire |
| JER-005 | 3 | Overlay | Un dessin est accroché au mur |  | aucun |
| GAB-008 | 3 | Overlay | Le cadeau est ouvert |  | aucun |
| FRT-005 | 3 | Objet | Coffre à trésor entrouvert | laugh_girl1 | provisoire |
| FRT-012 | 3 | Objet | Bateau pirate | laugh_girl1 | provisoire |
| FRT-013 | 3 | Objet | Coffre miniature | laugh_girl1 | provisoire |
| JER-022 | 3 | Objet | Crayon rouge cassé | laugh_girl1 | provisoire |
| SUS-022 | 3 | Son | Placard ouvert | laugh_girl1 | provisoire |
| GAB-010 | 3 | Objet | Verre en carton renversé | laugh_girl1 | provisoire |
| GAB-011 | 3 | IA | Freddy regarde toujours la même chaise | laugh_girl1 | provisoire |
| JER-007 | 3 | Objet | Une gomme est posée sur le sol, un dessin d'anniversaire est effacé | laugh_girl1 | provisoire |
| SUS-014 | 3 | Décor | Empreintes de pattes poussiéreuses | laugh_girl1 | provisoire |
| JER-009 | 4 | IA | Bonnie tourne une feuille | laugh_girl1 | provisoire |
| SUS-027 | 4 | IA | Chica protège le Cupcake | laugh_girl1 | provisoire |
| SUS-007 | 4 | Son | Petit jappement très faible | laugh_girl1 | provisoire |
| FRT-024 | 4 | IA | Foxy laisse tomber un jouet | laugh_girl1 | provisoire |
| FRT-017 | 4 | Overlay | Le bateau change d'étagère | laugh_girl1 | provisoire |
| FRT-018 | 4 | Overlay | Un cube disparaît | laugh_girl1 | provisoire |
| JER-024 | 4 | Décor | Les crayons changent de place | laugh_girl1 | provisoire |
| FRT-015 | 4 | Objet | Figurine pirate | laugh_girl1 | provisoire |
| GAB-023 | 4 | Décor | Une seconde horloge affiche une autre heure | laugh_girl1 | provisoire |
| JER-011 | 4 | Objet | Dessin d'un soleil |  | aucun |
| JER-016 | 4 | Objet | Dessin de cinq enfants |  | aucun |
| JER-017 | 4 | Objet | Dessin barré |  | aucun |
| JER-018 | 4 | Objet | Dessin déchiré |  | aucun |
| JER-019 | 4 | Objet | Dessin inachevé |  | aucun |
| JER-020 | 4 | Objet | Feuille totalement blanche |  | aucun |
| SUS-015 | 4 | Objet | Petite balle jaune sous une chaise | laugh_girl1 | provisoire |
| GAB-014 | 4 | IA | Freddy semble regarder un ballon | laugh_girl1 | provisoire |
| JER-010 | 4 | Objet | Un dessin d'enfant est posé sur une table |  | aucun |
| JER-012 | 4 | Objet | Dessin de Freddy |  | aucun |
| JER-013 | 4 | Objet | Dessin de Bonnie |  | aucun |
| JER-014 | 4 | Objet | Dessin d'une maison |  | aucun |
| JER-015 | 4 | Objet | Dessin d'une famille |  | aucun |
| FRT-010 | 5 | IA | Foxy aligne soigneusement tous les jouets | laugh_girl1 | provisoire |
| FRT-025 | 5 | IA | Foxy regarde le coffre ouvert | laugh_girl1 | provisoire |
| GAB-024 | 5 | Overlay | Les aiguilles tournent à l'envers | laugh_girl1 | provisoire |
| JER-030 | 5 | IA | Bonnie repose doucement le crayon | laugh_girl1 | provisoire |
| SUS-010 | 5 | IA | Chica regarde le joueur sans bouger | laugh_girl1 | provisoire |
| GAB-015 | 5 | IA | Freddy fixe une boîte cadeau | laugh_girl1 | provisoire |
| FRT-020 | 5 | Overlay | Tous les objets reviennent à leur place | laugh_girl1 | provisoire |
| FRT-030 | 5 | Décor | Jouets parfaitement rangés | laugh_girl1 | provisoire |
| FRT-019 | 5 | Overlay | Le coffre est refermé | laugh_girl1 | provisoire |
| SUS-009 | 5 | Objet | Ruban jaune au sol | laugh_girl1 | provisoire |
| SUS-020 | 5 | Objet | Cupcake légèrement fissuré | laugh_girl1 | provisoire |
| CASSIDY-08 | 3 | Son | Cinq séries de petits pas dans la cuisine | laugh_girl1 | provisoire |
| CASSIDY-09 | 4 | Décor | Cinq jouets alignés devant le rideau | laugh_girl1 | provisoire |
