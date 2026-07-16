📁 DOSSIER 01 — GABRIEL (Freddy)
Victime

Nom : Gabriel

Animatronique : Freddy Fazbear

Thème émotionnel : L'anniversaire qui ne s'est jamais terminé.

Couleur dominante : Jaune / Orange chaud devenant brun avec le temps.

Salle principale :

Show Stage
Dining Area
East Hall
Backstage (très rarement)
Philosophie narrative

Contrairement à Fritz qui est "actif" (Foxy joue), Gabriel est passif.

Il attend.

Toutes ses anomalies parlent :

d'une fête interrompue ;
d'un anniversaire ;
d'une chaise vide ;
d'un enfant absent.

Freddy ne fait presque rien.

Il regarde.

Il attend quelqu'un.

Série "Le regard de Freddy"

Ces anomalies sont essentielles.

Freddy ne poursuit pas le joueur.

Il regarde.

Toujours.

Série "Le Temps"

Le restaurant essaye de refaire la fête.

Il échoue.


----

| ID      | Priorité | Type    | Salle       | Caméra | Nuit | Heure      | Chance | Déclencheur   | Description                                | Lore                        | Son          | Script JS         | Terminal  | Journal | Cassette | RequiresEvent |
| ------- | -------- | ------- | ----------- | ------ | ---- | ---------- | ------ | ------------- | ------------------------------------------ | --------------------------- | ------------ | ----------------- | --------- | ------- | -------- | ------------- |
| X GAB-001 | Haute    | Objet   | Dining Area | CAM01  | 1    | 00h-06h    | 20%    | Observer      | Une chaise est reculée                     | Quelqu'un était assis       | chair.wav    | chair.js          | LOST001   | —       | —        | —             |
| X GAB-002 | Haute    | Objet   | Dining Area | CAM01  | 1    | Toute nuit | 15%    | Retour caméra | Un ballon jaune apparaît                   | Décoration oubliée          | balloon.wav  | balloon.js        | LOST002   | NEWS001 | —        | **GAB-001**   |
| X GAB-003 | Haute    | Décor   | Stage       | CAM02  | 2    | 01h00      | 10%    | Observer 8 s  | Une cinquième assiette apparaît            | Cinquième enfant            | —            | plate.js          | —         | NEWS002 | —        | **GAB-002**   |
| GAB-004 | Haute    | IA      | Stage       | CAM02  | 2    | 03h00      | 6%     | Retour caméra | Freddy regarde une chaise vide             | Gabriel attend              | breathe.wav  | stare.js          | —         | —       | TAPE003  | **GAB-003**   |
| X GAB-005 | Moyenne  | Overlay | Dining Area | CAM01  | 2    | 02h00      | 12%    | Observer      | Une bougie est allumée                     | Anniversaire                | flame.wav    | candle.js         | REPORT005 | NEWS002 | —        | **GAB-002**   |
| GAB-006 | Haute    | Son     | Bureau      | —      | 2    | 02h15      | 7%     | Silence       | Applaudissements lointains                 | Souvenir d'une fête         | applause.wav | audio.js          | —         | —       | TAPE001  | **GAB-005**   |
| X GAB-007 | Haute    | Objet   | Dining Area | CAM01  | 3    | 00h00      | 9%     | Observer      | Boîte cadeau fermée                        | Cadeau jamais ouvert        | paper.wav    | gift.js           | LOST004   | —       | —        | **GAB-005**   |
| X GAB-008 | Moyenne  | Overlay | Dining Area | CAM01  | 3    | 04h00      | 5%     | Retour caméra | Le cadeau est ouvert                       | Souvenir évolutif           | —            | gift_open.js      | —         | —       | —        | **GAB-007**   |
| X GAB-009 | Haute    | Objet   | Dining Area | CAM01  | 3    | Toute nuit | 8%     | Observer      | Part de gâteau oubliée                     | Dernier anniversaire        | flies.wav    | cake.js           | LOST005   | NEWS003 | —        | **GAB-008**   |
| X GAB-010 | Haute    | Objet   | Dining Area | CAM01  | 3    | Toute nuit | 6%     | Observer      | Verre en carton renversé                   | Fête interrompue            | drip.wav     | cup.js            | CLEAN01   | —       | —        | **GAB-009**   |
| X GAB-011 | Haute    | IA      | Stage       | CAM02  | 3    | Toute nuit | 6%     | Retour caméra | Freddy regarde toujours la même chaise     | Gabriel attend son père     | breathe.wav  | freddy_chair.js   | —         | NEWS004 | —        | **GAB-004**   |
| X GAB-012 | Haute    | IA      | Stage       | CAM02  | 4    | 02h00      | 5%     | Retour caméra | Freddy regarde la caméra quelques secondes | Michael ressemble à William | servo.wav    | freddy_camera.js  | —         | NEWS005 | TAPE004  | **GAB-011**   |
| X GAB-013 | Haute    | IA      | Stage       | CAM02  | 4    | 03h00      | 5%     | Observer      | Freddy baisse légèrement la tête           | Résignation                 | servo.wav    | freddy_head.js    | —         | —       | —        | **GAB-012**   |
| X GAB-014 | Haute    | IA      | Dining Area | CAM01  | 4    | Toute nuit | 4%     | Observer      | Freddy semble regarder un ballon           | Dernier souvenir            | metal.wav    | freddy_balloon.js | —         | NEWS006 | —        | **GAB-002**   |
| X GAB-015 | Critique | IA      | Dining Area | CAM01  | 5    | 05h00      | 3%     | Retour caméra | Freddy fixe une boîte cadeau               | Cadeau jamais ouvert        | breathe.wav  | freddy_gift.js    | REPORT006 | NEWS007 | TAPE005  | **GAB-008**   |
| GAB-021 | Haute    | Décor   | Dining Area | CAM01  | 3    | Toute nuit    | 8%     | Observer      | Horloge bloquée à 17h45                     | L'heure de la fête         | clock.wav       | clock_stop.js    | REPORT007 | —       | —        | **GAB-005**   |
| GAB-022 | Haute    | Overlay | Dining Area | CAM01  | 4    | Retour caméra | 6%     | Retour caméra | Horloge repart quelques secondes            | Le temps refuse d'avancer  | tick.wav        | clock_restart.js | REPORT008 | —       | —        | **GAB-021**   |
| GAB-023 | Haute    | Décor   | Dining Area | CAM01  | 4    | Toute nuit    | 5%     | Observer      | Une seconde horloge affiche une autre heure | Deux réalités              | clock_error.wav | clock_double.js  | REPORT009 | NEWS008 | —        | **GAB-022**   |
| GAB-024 | Critique | Overlay | Stage       | CAM02  | 5    | 04h00         | 4%     | Retour caméra | Les aiguilles tournent à l'envers           | La fête revient en arrière | reverse.wav     | clock_reverse.js | REPORT010 | —       | TAPE006  | **GAB-023**   |
| GAB-025 | Critique | Glitch  | Dining Area | CAM01  | 5    | 05h55         | 2%     | Heure         | L'horloge revient à 00:00                   | Boucle éternelle           | glitch.wav      | clock_reset.js   | REPORT011 | NEWS009 | TAPE007  | **GAB-024**   |



Série "Les Sons"

| ID      | Son                            | Utilisation   |
| ------- | ------------------------------ | ------------- |
| GAB-026 | Enfants qui applaudissent      | Dining Area   |
| GAB-027 | "Happy Birthday" très lointain | Stage         |
| GAB-028 | Bougie soufflée                | Retour caméra |
| GAB-029 | Papier cadeau froissé          | Boîte cadeau  |
| GAB-030 | Ballon qui éclate              | Très rare     |


Série "Terminal"

| ID      | Commande  | Contenu                      |
| ------- | --------- | ---------------------------- |
| GAB-031 | PARTY.LOG | Liste des anniversaires      |
| GAB-032 | TABLES    | Nombre de couverts préparés  |
| GAB-033 | BALLOON   | Inventaire des ballons       |
| GAB-034 | LOST      | Casquette jamais récupérée   |
| GAB-035 | GUESTS    | Liste incomplète des invités |


🎨 Liste complète des assets à produire


PARTY.LOG
GUESTS.LOG
LOST_OBJECTS.LOG
TABLE_LAYOUT.LOG
EVENT_ARCHIVE.LOG

Journaux
NEWS_GAB_01 — « Une fête d'anniversaire tourne court »
NEWS_GAB_02 — « Les parents quittent précipitamment le restaurant »
NEWS_GAB_03 — « Des objets oubliés restent sans propriétaire »

Cassettes
TAPE_GAB_01 — Préparation d'un anniversaire
TAPE_GAB_02 — Consignes d'animation pour Freddy
TAPE_GAB_03 — Procédure de fermeture après une fête

⭐ Proposition d'amélioration : donner une "signature" à Gabriel

Je pousserais encore plus loin le concept en attribuant une identité sensorielle unique à chaque enfant. Pour Gabriel, chaque anomalie devrait évoquer une fête qui s'efface lentement :

Visuel : jaune fané, nappes, ballons, confettis, lumière chaude qui s'éteint.
Son : applaudissements lointains, musique d'anniversaire ralentie, chaises déplacées, papier cadeau.
Gameplay : anomalies lentes, discrètes, qui demandent de rester plusieurs secondes sur une caméra.
Émotion : aucune violence visible, uniquement le sentiment qu'un anniversaire attend toujours un enfant qui ne reviendra jamais.

Cela crée une identité immédiatement reconnaissable. Plus tard, sans même voir Freddy, le joueur pourra dire : « Cette anomalie... elle appartient à Gabriel. » C'est ce type de cohérence qui donnera une vraie profondeur narrative au projet.


# Prompt
GAB-001 :  Conserver exactement l'image d'origine, avec le même cadrage, la même perspective, les mêmes proportions (16:9), le même éclairage, les mêmes textures et tous les éléments du décor inchangés. Ne pas ajouter de texte, d'interface ou d'objets supplémentaires. Les tables, les chapeaux de fête, les nappes, le sol, les ombres et l'ambiance générale doivent rester strictement identiques.Modifier uniquement une seule chaise. Choisir une chaise située au premier plan, légèrement sur le côté d'une table afin que le changement soit perceptible mais discret. Cette chaise doit être reculée d'environ 25 à 40 centimètres par rapport à sa position d'origine, comme si une personne venait tout juste de se lever. La chaise conserve exactement la même orientation, le même modèle, la même taille et le même éclairage ; seule sa position est modifiée.Aucun autre objet ne doit être déplacé. Les autres chaises restent parfaitement alignées autour des tables. L'espace vide laissé entre la table et cette chaise doit donner l'impression qu'une place était occupée quelques instants auparavant, sans qu'aucune personne ne soit visible. L'effet recherché est subtil, crédible et inquiétant, laissant simplement entendre que quelqu'un était assis là avant de disparaître.