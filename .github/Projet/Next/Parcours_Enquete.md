# Parcours d'enquête

Ce que le joueur trouve, nuit par nuit, et ce qu'il doit avoir compris en se levant. Découle de [Bible.md](Bible.md), qui fait foi en cas de désaccord.

Statut : chaînes validées (section 4). Le reste est une proposition à valider.

---

## 1. Deux couches

| Couche | Contenu | Garanti ? | Rôle |
| --- | --- | --- | --- |
| Révélation | Affiche de l'East Hall Corner (CAM 4B), logs du terminal ouverts par nuit, appel téléphonique | Oui | Porte l'histoire principale. Un joueur qui ne voit aucune anomalie comprend quand même |
| Complément | Journaux (un enfant chacun, sous-entendus) | Oui, au moins N à la fin de la nuit N | Relie l'histoire publique des affiches aux quatre enfants, sans jamais l'énoncer |
| Enquête | Anomalies aléatoires, logs qu'elles débloquent, cassettes, chaînes | Non | Approfondit, compte pour la fin, nourrit la méfiance de Cassidy |

### Ce qui existe déjà dans le moteur

- Affiches : `camera.js` affiche en CAM 4B l'affiche de la nuit en cours (`images/rooms/4b_east_hall_corner/hidden/{fr,en}/4b_b0_c0_f0_dN`) quand la pièce est vide. C'est le canal de l'histoire publique, celle des coupures de presse de FNAF 1.
- Journaux : `ensureNightJournals()` (`script/mechanics/journal.js`) garantit au moins N journaux à la fin de la nuit N.
- Logs : un log cité dans le champ `terminal` d'un événement reste verrouillé tant que l'événement n'a pas été vu. Les autres sont ouverts dès la nuit 1. Le champ `minHour` verrouille un log jusqu'à une heure donnée.
- Cassettes : débloquées uniquement par les événements (champ `tape`).

### Ce qu'il faut ajouter

- Un champ `minNight` dans les logs, sur le modèle de `minHour`, pour ouvrir les logs de révélation nuit par nuit.
- Un prérequis « log lu » pour les chaînes, en plus de `requiresEvent` (le moteur sait déjà marquer un log comme lu avec `markFound`).

## 2. Répartition des 34 logs

### Logs de révélation (23), ouverts par nuit

| Nuit | Logs | Ce qu'ils montrent |
| --- | --- | --- |
| 1 | LOGS, ARCHIVE, STAFF, LOST_OBJECTS, CAMLOG | Objets d'enfants jamais réclamés, archives de 1985 « intègres » alors que juin et juillet sont indisponibles, personnel : `A-003` archivé, `003` encore actif avec un dernier accès antérieur à la nuit 1 |
| 2 | GUESTS, PARTY, TABLES, DRAWINGS, PETS, TOYS | Les fêtes, les tables, les dessins, le chien, les jouets : quatre enfants, quatre ancrages |
| 3 | CLOSED, KITCHEN, REPORT_89, LOST001, LOST | 26/06/1985 : fermeture qui échoue avec un enfant présent, 4 secondes absentes de l'enregistrement, dernier rapport du veilleur, chaise d'enfant |
| 4 | CLEANING, ROOT, SUDO, DELETE, USER | Dessins retirés et repeints, suppression d'`enfant_05`, session sans compte, compte administrateur inutilisé, nom d'utilisateur qu'on n'arrive pas à effacer |
| 5 | WHOAMI, RECOVER | Le système cherche qui est connecté. RECOVER tente de restaurer ce qui a été supprimé |

Un log ouvert une nuit le reste les nuits suivantes. `REPORT_89` sera renommé lors du passage des dates à 1985.

### Logs d'enquête (11), débloqués par une anomalie

| Log | Débloqué par | Usage |
| --- | --- | --- |
| BALLOON | Chaîne Gabriel | Maillon 2 |
| LOST_ART | Chaîne Jeremy | Maillon 2 |
| LOST_PETS | Chaîne Susie | Maillon 2 |
| LOST_TOYS | Chaîne Fritz | Maillon 2 |
| MEMORY | Chaîne Cassidy | Maillon 2 |
| PIRATE, MAINT_05, STAGE_PROP | Anomalies de Fritz | Bonus |
| CHILDREN_ART, SCANNER | Anomalies de Jeremy | Bonus |
| COOKING | Anomalie de Susie | Bonus |

Changement par rapport à aujourd'hui : DRAWINGS, PETS, TOYS, PARTY, TABLES, GUESTS, CLEANING, KITCHEN, LOST et REPORT_89 ne sont plus débloqués par une anomalie mais par la nuit. Les événements qui les citent dans `terminal` doivent pointer vers un log d'enquête ou n'en citer aucun.

## 3. Les cinq nuits

### Nuit 1 — lundi 08/11/1993 : il se passe quelque chose

| Élément | Contenu |
| --- | --- |
| Appel | FNAF 1, message 1 |
| Affiche CAM 4B | Règles de sécurité (« Quitte les lieux avant la nuit ») |
| Logs ouverts | LOGS, ARCHIVE, STAFF, LOST_OBJECTS, CAMLOG |
| Cassidy | Palier 1 au maximum : CASSIDY-01 (souffle dans le poste radio) |
| Écran de 6 h | Première correction |

Le joueur se lève en sachant : des affaires d'enfants dorment ici depuis 1985, les archives de l'été 1985 manquent, et le système tient encore pour actif un veilleur qui ne se connecte plus.

### Nuit 2 — mardi 09/11/1993 : ce sont des enfants

| Élément | Contenu |
| --- | --- |
| Appel | FNAF 1, message 2 |
| Affiche CAM 4B | Deux enfants disparus un vendredi soir, aucun corps retrouvé |
| Logs ouverts | GUESTS, PARTY, TABLES, DRAWINGS, PETS, TOYS |
| Cassidy | Palier 1 : CASSIDY-02 (une petite voix demande si quelqu'un l'entend) |

Le joueur se lève en sachant : la presse a parlé d'enfants disparus ici, et quatre enfants reviennent dans les registres, chacun avec son univers (anniversaire, dessins, chien, jouets), avec une réservation pour quatre enfants le 26/06/1985 et six couverts dressés.

### Nuit 3 — mercredi 10/11/1993 : ils ont disparu ici, en 1985

| Élément | Contenu |
| --- | --- |
| Appel | FNAF 1, message 3 |
| Affiche CAM 4B | Cinq enfants portés disparus, suspect condamné |
| Logs ouverts | CLOSED, KITCHEN, REPORT_89, LOST001, LOST |
| Cassidy | Palier 2 possible : « IT'S ME » une frame, visage d'enfant |

Le joueur se lève en sachant : le 26/06/1985, la fermeture a échoué avec un enfant encore présent, l'enregistrement a un trou de 4 secondes, le veilleur de l'époque a cessé de faire des rapports, et il y avait cinq enfants, pas deux. Les logs, eux, ne prononcent jamais le mot « disparition » : seule l'affiche le fait.

### Nuit 4 — jeudi 11/11/1993 : quelqu'un a effacé les traces

| Élément | Contenu |
| --- | --- |
| Appel | FNAF 1, message 4 : le Phone Guy meurt pendant l'enregistrement |
| Affiche CAM 4B | La pizzeria ferme définitivement, les recherches sont abandonnées |
| Logs ouverts | CLEANING, ROOT, SUDO, DELETE, USER |
| Cassidy | Palier 2. Palier 3 (Golden Freddy) seulement si la jauge est haute |

Le joueur se lève en sachant : les dessins ont été retirés, la salle repeinte, un cinquième dossier d'enfant supprimé par une session sans compte, et quelqu'un a essayé d'effacer un nom d'utilisateur. Le joueur qui compare l'appel de cette nuit au dernier accès de `003` dans STAFF comprend qu'il écoute un mort depuis lundi.

### Nuit 5 — vendredi 12/11/1993 : le gardien est lié à tout cela

| Élément | Contenu |
| --- | --- |
| Appel | Voix de Cassidy, à l'envers (remplace le message 5 de FNAF 1) |
| Affiche CAM 4B | Contrainte de fermer, « Ces personnages vivront dans le cœur des enfants » |
| Logs ouverts | WHOAMI, RECOVER |
| Cassidy | Palier 3 possible. CASSIDY-05, 06 et 07. « YOU ARE NOT HIM » si la fin Reconnaissance est atteinte |
| Après 6 h | Chèque de paie au nom de Mike Schmidt, puis la fin |

Le joueur se lève en sachant : le système ne sait pas qui il est, quelqu'un de l'autre côté croit le reconnaître, et le nom imprimé sur le chèque ne règle rien.

## 4. Les chaînes

Validé le 17/11/2026.

Chaque chaîne a quatre maillons : une anomalie, un log d'enquête qu'elle débloque, une seconde anomalie qui n'apparaît qu'une fois le log lu, puis la cassette que cette seconde anomalie débloque.

| Chaîne | Maillon 1 (anomalie) | Maillon 2 (log) | Maillon 3 (anomalie) | Maillon 4 (cassette) |
| --- | --- | --- | --- | --- |
| Gabriel | GAB-001 Une chaise est reculée (n1) | BALLOON | GAB-014 Freddy semble regarder un ballon (n4) | TAPE_GAB_03 |
| Jeremy | JER-001 Une feuille blanche apparaît (n1) | LOST_ART | JER-015 Dessin d'une famille (n4) | TAPE_JER_03 |
| Susie | SUS-001 Gamelle métallique sous une table (n1) | LOST_PETS | SUS-027 Chica protège le Cupcake (n4) | TAPE_SUS_03 |
| Fritz | FRT-001 Petite voiture rouge apparaît (n1) | LOST_TOYS | FRT-026 Tour de cubes construite (n4) | TAPE_FRT_03 |
| Cassidy | Trace du cinquième enfant (n3-4) | MEMORY | « IT'S ME » ou visage d'enfant (n4-5) | TAPE_ERREUR_07 |

- 5 chaînes de 4 maillons : 20 maillons. La fin Reconnaissance demande la chaîne de Cassidy complète et au moins 15 maillons au total.
- Grâce à la persistance, une chaîne commencée dans une partie se poursuit dans la suivante.
- Les autres cassettes restent débloquées par leurs anomalies, en bonus.
- Trace du cinquième enfant : une des quatre anomalies de la table Cassidy fusionnée (cinquième place à table, cinquième enfant dessiné, cinquième bruit de pas, cinq jouets alignés), au hasard.

## 5. Affiches et journaux

Les deux canaux sont complémentaires.

- Les affiches de la CAM 4B racontent l'histoire publique : deux enfants, puis cinq, un suspect condamné, la fermeture. Ce sont elles qui disent « disparus ».
- Les 12 journaux (`ressources/journaux/*.txt` et leurs images) ne le disent jamais. Chacun parle d'un enfant par la bande, son code le désigne (`NEWS_GAB`, `NEWS_JER`, `NEWS_SUS`, `NEWS_FRT`) : une fête qui tourne court, des dessins remplacés, un animal démenti, des jouets réclamés. Le joueur relie lui-même un fait divers à un enfant.

Aucun journal à créer. `ensureNightJournals()` reste tel quel.

### Corrections à prévoir

- Corrigé le 17/11/2026 : l'affiche française de la nuit 5 (`d5.png`) est déclarée dans `assets.json`, le doublon `d5.jpg` est supprimé.
- L'affiche de la nuit 2 situe la disparition des deux premiers enfants « vendredi soir ». L'affiche ne donne aucune date : c'est la chronologie qui s'adapte, pas l'image. Lors du passage des dates à 1985, placer cette disparition un vendredi distinct du 26/06/1985 (un mercredi). Le vendredi 21/06/1985 est libre dans la chronologie actuelle. L'affiche de la nuit 3 (cinq enfants) vient ensuite.
- Les affiches ne datent rien : elles restent compatibles avec 1985.

## 6. Écran de 6 h

Après chaque nuit de 1 à 4, et avant la fin en nuit 5.

- Liste jusqu'à trois anomalies vues pendant la nuit. Aucune si le joueur n'en a vu aucune : l'écran affiche alors « Aucune anomalie détectée. » et passe.
- Pour chacune : `CORRIGER` (« Archive stabilisée. ») ou `CONSERVER`.
- Le choix est sauvegardé. Il compte pour la fin et pour la jauge de Cassidy.

## 7. Travail technique

| Sujet | Fichiers |
| --- | --- |
| Champ `minNight` des logs | `script/lore/lore_core.js`, `ressources/logs/*.json`, `_editor_log/README.md` |
| Prérequis « log lu » | `script/core/random_events_engine.js` (ou équivalent), `random_events_data.json` |
| Champs `terminal` à réaffecter | `random_events_data.json` |
| `secretPool` des nuits 1 à 5 | `script/lore/lore_night1.js` à `lore_night5.js` |
