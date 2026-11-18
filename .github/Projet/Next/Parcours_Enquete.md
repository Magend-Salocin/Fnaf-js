# Parcours d'enquête

Ce que le joueur trouve, nuit par nuit, et ce qu'il doit avoir compris en se levant. Découle de [Bible.md](Bible.md), qui fait foi en cas de désaccord.

Statut : chaînes validées le 17/11/2026, modèle des récompenses (section 2) validé le 18/11/2026. Le reste est une proposition à valider.

---

## 1. Trois couches

| Couche | Contenu | Garanti ? | Rôle |
| --- | --- | --- | --- |
| Révélation | Affiche de l'East Hall Corner (CAM 4B), logs du terminal ouverts par nuit, appel téléphonique | Oui | Porte l'histoire principale. Un joueur qui ne voit aucune anomalie comprend quand même |
| Complément | Journaux (un enfant chacun, sous-entendus) | Oui, au moins N à la fin de la nuit N | Relie l'histoire publique des affiches aux quatre enfants, sans jamais l'énoncer |
| Enquête | Anomalies aléatoires, récompenses qu'elles donnent, chaînes | Non | Approfondit, compte pour la fin, nourrit la méfiance de Cassidy |

### Ce qui existe déjà dans le moteur

- Affiches : `camera.js` affiche en CAM 4B l'affiche de la nuit en cours (`images/rooms/4b_east_hall_corner/hidden/{fr,en}/4b_b0_c0_f0_dN`) quand la pièce est vide. C'est le canal de l'histoire publique, celle des coupures de presse de FNAF 1.
- Journaux : `ensureNightJournals()` (`script/mechanics/journal.js`) garantit au moins N journaux à la fin de la nuit N.
- Logs : un log cité dans le champ `terminal` d'un événement reste verrouillé tant que l'événement n'a pas été vu. Les autres sont ouverts dès la nuit 1. Le champ `minHour` verrouille un log jusqu'à une heure donnée.
- Cassettes et journaux : donnés par l'événement qui les cite dans `tape` ou `journal`.

## 2. Événements et récompenses

### Principe

L'événement et ce qu'il rapporte sont séparés. Un événement ne dit plus quelle cassette, quel journal ou quel log il donne : il dit seulement à quel enfant il appartient, par le préfixe de son identifiant (`GAB`, `JER`, `SUS`, `FRT`, `CASSIDY`). Quand le joueur voit une anomalie, il reçoit la prochaine récompense de la réserve de cet enfant.

| Ce que le joueur gagne | Comment il le gagne |
| --- | --- |
| Cassette, journal, log bonus | Réserve de l'enfant : une récompense par anomalie vue, dans l'ordre de la réserve |
| Log de révélation (23) | La nuit : ouvert au début de sa nuit, que le joueur ait vu des anomalies ou non |
| Log de chaîne (5) | La première anomalie vue de l'enfant, quelle qu'elle soit |
| Cassette de fin de chaîne (5) | Le maillon 3 de la chaîne, un événement précis (section 5) |
| Journal garanti | `ensureNightJournals()`, qui pioche dans les mêmes réserves |

### Avant et après

| Sujet | Avant | Après |
| --- | --- | --- |
| Où est écrite la récompense | Dans chaque événement (`terminal`, `tape`, `journal`) | Dans la réserve de l'enfant. Les champs de l'événement ne servent plus qu'aux maillons 3 |
| Plusieurs événements pour une même récompense | Doublons à maintenir à la main (TAPE_JER_02 sur JER-002 et JER-008) | Naturel : toute anomalie de l'enfant y mène |
| Anomalie ratée | La récompense qu'elle portait est perdue pour la partie | Une autre anomalie du même enfant la donne |
| Ordre de l'histoire | Dépend des événements vus | Fixé par la réserve |
| Ajouter un événement | Choisir sa récompense, vérifier les doublons | Choisir son enfant, rien d'autre |
| Logs de révélation | Verrouillés si un événement les cite, sinon ouverts dès la nuit 1 | Ouverts par la nuit (`minNight`) |

### Règles

1. Ordre fixe. La réserve se vide dans l'ordre du tableau ci-dessous.
2. Contrainte de nuit. Chaque récompense a une nuit minimale. Si la prochaine récompense n'est pas encore disponible, l'anomalie ne donne rien et la récompense attend.
3. Une récompense par anomalie vue, jusqu'à épuisement de la réserve. Ensuite, l'anomalie ne donne plus rien, mais elle compte toujours pour l'écran de 6 h et la jauge de Cassidy.
4. La réserve saute ce que le joueur possède déjà, qu'il l'ait obtenu par un journal garanti ou dans une partie précédente.
5. Le maillon 3 d'une chaîne donne sa cassette de fin, et rien de la réserve.
6. Un événement sans enfant (les événements legacy `BONNIE-001`, `CHICA-001`...) ne donne rien.

Exemple : en nuit 1, le joueur voit JER-001 puis JER-002. JER-001 ouvre LOST_ART (première anomalie de Jeremy) et donne TAPE_JER_01. JER-002 donne NEWS_JER_01. Une troisième anomalie de Jeremy cette nuit-là ne donne rien : TAPE_JER_02 attend la nuit 2.

### Réserves

Le contenu des réserves est dans `script/config/rewards_data.json`, et sa vue lisible dans [Evenements_Recompenses.md](../04%20-%20Production/Evenements_Recompenses.md). En résumé : 5 à 8 récompenses par enfant, plus sa cassette de fin de chaîne. La nuit minimale d'un journal vient de `journals_data.json`. Celle d'une cassette ou d'un log bonus reprend la nuit de l'événement qui le donnait avant le 18/11/2026.

Les anomalies de Cassidy restent pilotées par le Director : la réserve fixe seulement ce qu'elles donnent. TAPE_ERREUR_06 passe en nuit 5, puisqu'il n'y a plus de nuit 6.

## 3. Répartition des 34 logs

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
| BALLOON | Première anomalie de Gabriel | Chaîne, maillon 2 |
| LOST_ART | Première anomalie de Jeremy | Chaîne, maillon 2 |
| LOST_PETS | Première anomalie de Susie | Chaîne, maillon 2 |
| LOST_TOYS | Première anomalie de Fritz | Chaîne, maillon 2 |
| MEMORY | Trace du cinquième enfant | Chaîne de Cassidy, maillon 2 |
| PIRATE, MAINT_05, STAGE_PROP | Réserve de Fritz | Bonus |
| CHILDREN_ART, SCANNER | Réserve de Jeremy | Bonus |
| COOKING | Réserve de Susie | Bonus |

Aucun événement ne cite plus un log de révélation. DRAWINGS, PETS, TOYS, PARTY, TABLES, GUESTS, CLEANING, KITCHEN, LOST et REPORT_89, autrefois débloqués par une anomalie, s'ouvrent par la nuit.

## 4. Les cinq nuits

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

## 5. Les chaînes

Validé le 17/11/2026.

Chaque chaîne a quatre maillons : une anomalie de l'enfant, le log de chaîne qu'elle ouvre, une anomalie précise qui n'apparaît qu'une fois le log lu, puis la cassette de fin que cette anomalie donne.

Depuis le 18/11/2026, le maillon 1 n'est plus un événement précis : toute anomalie de l'enfant le valide et ouvre le log. L'événement indiqué ci-dessous est la porte la plus probable, en nuit 1. Le maillon 3 reste un événement précis.

| Chaîne | Maillon 1 (anomalie) | Maillon 2 (log) | Maillon 3 (anomalie) | Maillon 4 (cassette) |
| --- | --- | --- | --- | --- |
| Gabriel | Toute anomalie GAB, par exemple GAB-001 Une chaise est reculée (n1) | BALLOON | GAB-014 Freddy semble regarder un ballon (n4) | TAPE_GAB_03 |
| Jeremy | Toute anomalie JER, par exemple JER-001 Une feuille blanche apparaît (n1) | LOST_ART | JER-015 Dessin d'une famille (n4) | TAPE_JER_03 |
| Susie | Toute anomalie SUS, par exemple SUS-001 Gamelle métallique sous une table (n1) | LOST_PETS | SUS-027 Chica protège le Cupcake (n4) | TAPE_SUS_03 |
| Fritz | Toute anomalie FRT, par exemple FRT-001 Petite voiture rouge apparaît (n1) | LOST_TOYS | FRT-026 Tour de cubes construite (n4) | TAPE_FRT_03 |
| Cassidy | Une trace du cinquième enfant : CASSIDY-08 Cinq séries de petits pas (n3), JER-016 Dessin de cinq enfants (n4), CASSIDY-09 Cinq jouets alignés (n4) | MEMORY | CASSIDY-07 Une présence familière se manifeste (n5) | TAPE_ERREUR_07 |

- 5 chaînes de 4 maillons : 20 maillons. La fin Reconnaissance demande la chaîne de Cassidy complète et au moins 15 maillons au total.
- Grâce à la persistance, une chaîne commencée dans une partie se poursuit dans la suivante.
- Les autres cassettes viennent des réserves (section 2).

Chaîne de Cassidy, décidée le 18/11/2026 :

- Contrairement aux quatre autres chaînes, MEMORY ne s'ouvre pas à la première anomalie de Cassidy, mais seulement par une trace du cinquième enfant (`openEvents` dans `rewards_data.json`). Sinon CASSIDY-01 l'ouvrirait dès la nuit 1, avant que l'affiche de la nuit 3 parle de cinq enfants.
- Les traces sont trois des quatre traces de la Bible (section 5). JER-016 existait déjà. CASSIDY-08 et CASSIDY-09 sont créés : son et image à produire. La quatrième trace, la cinquième place à table, est GAB-003 (cinquième assiette). Elle reste une anomalie de Gabriel sans ouvrir MEMORY, parce qu'elle sort en nuit 2.
- Une trace vue donne aussi la récompense de son enfant : JER-016 avance la réserve de Jeremy, CASSIDY-08 et 09 celle de Cassidy.
- Le maillon 3 est CASSIDY-07, ramené en nuit 5 avec CASSIDY-06. Il portait déjà TAPE_ERREUR_07 et le handler `cassidy_finale`. « IT'S ME » et le visage d'enfant restent des manifestations du palier 2 du Director, hors chaîne.

## 6. Affiches et journaux

Les deux canaux sont complémentaires.

- Les affiches de la CAM 4B racontent l'histoire publique : deux enfants, puis cinq, un suspect condamné, la fermeture. Ce sont elles qui disent « disparus ».
- Les 12 journaux (`ressources/journaux/*.txt` et leurs images) ne le disent jamais. Chacun parle d'un enfant par la bande, son code le désigne (`NEWS_GAB`, `NEWS_JER`, `NEWS_SUS`, `NEWS_FRT`) : une fête qui tourne court, des dessins remplacés, un animal démenti, des jouets réclamés. Le joueur relie lui-même un fait divers à un enfant.

Aucun journal à créer. `ensureNightJournals()` garde sa garantie (au moins N journaux à la fin de la nuit N), mais pioche dans les réserves des enfants (section 2) pour ne jamais donner un journal que la réserve donnerait ensuite.

### Corrections à prévoir

- Corrigé le 17/11/2026 : l'affiche française de la nuit 5 (`d5.png`) est déclarée dans `assets.json`, le doublon `d5.jpg` est supprimé.
- L'affiche de la nuit 2 situe la disparition des deux premiers enfants « vendredi soir ». L'affiche ne donne aucune date : c'est la chronologie qui s'adapte, pas l'image. Lors du passage des dates à 1985, placer cette disparition un vendredi distinct du 26/06/1985 (un mercredi). Le vendredi 21/06/1985 est libre dans la chronologie actuelle. L'affiche de la nuit 3 (cinq enfants) vient ensuite.
- Les affiches ne datent rien : elles restent compatibles avec 1985.

## 7. Écran de 6 h

Après chaque nuit de 1 à 4, et avant la fin en nuit 5.

- Liste jusqu'à trois anomalies vues pendant la nuit. Aucune si le joueur n'en a vu aucune : l'écran affiche alors « Aucune anomalie détectée. » et passe.
- Pour chacune : `CORRIGER` (« Archive stabilisée. ») ou `CONSERVER`.
- Le choix est sauvegardé. Il compte pour la fin et pour la jauge de Cassidy.

## 8. Travail technique

| Sujet | Fichiers |
| --- | --- |
| Champ `minNight` des logs | `script/lore/lore_core.js`, `ressources/logs/*.json`, `_editor_log/README.md` |
| Réserves de récompenses : données (enfant, ordre, nuit minimale) et distribution à chaque anomalie vue | Nouveau fichier `script/config/rewards_data.json`, `script/core/random_events_engine.js` |
| Ouverture du log de chaîne à la première anomalie de l'enfant | `script/core/random_events_engine.js`, `script/lore/lore_core.js` |
| Journaux garantis : passer par les réserves | `script/mechanics/journal.js` |
| Prérequis « log lu » des maillons 3 | `script/core/random_events_engine.js`, `random_events_data.json` |
| Vider `terminal`, `tape` et `journal` des événements, sauf les maillons 3 | `random_events_data.json`, `config_validator.js` |
| Événements de la chaîne de Cassidy à créer, CASSIDY-06 et 07 en nuit 5 | `random_events_data.json` |
| `secretPool` des nuits 1 à 5 | `script/lore/lore_night1.js` à `lore_night5.js` |
