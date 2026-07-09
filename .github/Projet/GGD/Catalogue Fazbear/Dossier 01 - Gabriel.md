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

| ID      | Priorité | Type    | Salle       | Caméra | Nuit | Heure      | Chance | Déclencheur   | Description                     | Lore                  | Image              | Son          | JS           | Terminal | Journal | Cassette | Evolution         |
| ------- | -------- | ------- | ----------- | ------ | ---- | ---------- | ------ | ------------- | ------------------------------- | --------------------- | ------------------ | ------------ | ------------ | -------- | ------- | -------- | ----------------- |
| X GAB-001 | Haute    | Objet   | Dining Area | CAM01  | 1    | 00h-06h    | 20%    | Observer      | Une chaise est reculée          | Quelqu'un était assis | chair01.png        | chair.wav    | chair.js     | LOST001  | —       | —        | Revient           |
| X GAB-002 | Haute    | Objet   | Dining Area | CAM01  | 1    | Toute nuit | 15%    | Retour caméra | Un ballon jaune apparaît        | Décoration oubliée    | balloon_yellow.png | balloon.wav  | balloon.js   | LOST002  | NEWS001 | —        | Persistant        |
| X GAB-003 | Haute    | Décor   | Stage       | CAM01  | 2    | 01h        | 10%    | Observer 8 s  | Une cinquième assiette apparaît | Cinquième enfant      | plate05.png        | —            | plate.js     | —        | NEWS002 | —        | Persistant        |
|  GAB-004 | Haute    | IA      | Stage       | CAM01  | 2    | 03h        | 6%     | Retour caméra | Freddy regarde une chaise vide  | Gabriel attend        | freddy_stare.png   | breathe.wav  | stare.js     | —        | —       | TAPE003  | 3 états           |
| X GAB-005 | Moyenne  | Overlay | Dining      | CAM01  | 2    | 02h        | 12%    | Observer      | Une bougie est allumée          | Anniversaire          | candle.png         | flame.wav    | candle.js    | REPORT05 | NEWS002 | —        | Devient éteinte   |
| GAB-006 | Haute    | Son     | Bureau      | —      | 2    | 02h15      | 7%     | Silence       | Applaudissements lointains      | Souvenir d'une fête   | —                  | applause.wav | audio.js     | —        | —       | TAPE001  | Variable          |
| X GAB-007 | Haute    | Objet   | Dining      | CAM01  | 3    | 00h        | 9%     | Observer      | Boîte cadeau fermée             | Cadeau jamais ouvert  | gift_closed.png    | paper.wav    | gift.js      | LOST004  | —       | —        | Peut s'ouvrir     |
| X GAB-008 | Moyenne  | Overlay | Dining      | CAM01  | 3    | 04h        | 5%     | Retour caméra | Le cadeau est ouvert            | Souvenir évolutif     | gift_open.png      | —            | gift_open.js | —        | —       | —        | Persistant        |
| X GAB-009 | Haute    | Objet   | Dining      | CAM01  | 3    | Toute nuit | 8%     | Observer      | Part de gâteau oubliée          | Dernier anniversaire  | cake_slice.png     | flies.wav    | cake.js      | LOST005  | NEWS003 | —        | Pourrit           |
| X GAB-010 | Haute    | Objet   | Dining      | CAM01  | 3    | Toute nuit | 6%     | Observer      | Verre en carton renversé        | Fête interrompue      | cup.png            | drip.wav     | cup.js       | CLEAN01  | —       | —        | Liquide disparaît |



Série "Le regard de Freddy"

Ces anomalies sont essentielles.

Freddy ne poursuit pas le joueur.

Il regarde.

Toujours.

Série "Anniversaire
| ID      | Description                                | Lore                        |
| ------- | ------------------------------------------ | --------------------------- |
| X GAB-011 | Freddy regarde toujours la même chaise     | Gabriel attend son père     |
| GAB-012 | Freddy regarde la caméra quelques secondes | Michael ressemble à William |
| X GAB-013 | Freddy baisse légèrement la tête           | Résignation                 |
| X GAB-014 | Freddy semble regarder un ballon           | Dernier souvenir            |
| X GAB-015 | Freddy fixe une boîte cadeau               | Cadeau jamais ouvert        |

Série "Le Temps"

Le restaurant essaye de refaire la fête.

Il échoue.

| ID      | Description                                     |
| ------- | ----------------------------------------------- |
| GAB-021 | Horloge bloquée à 17h45                         |
| GAB-022 | Horloge repart quelques secondes                |
| GAB-023 | Une seconde horloge n'affiche pas la même heure |
| GAB-024 | Les aiguilles tournent à l'envers               |
| GAB-025 | L'horloge revient à 00:00 pendant un glitch     |


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