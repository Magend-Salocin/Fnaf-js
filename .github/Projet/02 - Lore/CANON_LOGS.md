# Canon des logs du terminal

Référentiel unique pour tout ce qui est écrit dans `ressources/logs/*.json`.
Toute nouvelle entrée de terminal doit s'y conformer, et toute modification du
canon doit être répercutée dans les logs concernés.

Sources qui font autorité, par ordre de priorité :

1. `script/config/rooms_config.json` — noms de salles et de caméras
2. `script/config/journals_data.json` — dates des coupures de presse
3. `script/config/random_events_data.json` — objets et anomalies visibles en jeu
4. `02 - Lore/Catalogue Fazbear/` — enfants, animatroniques, ancrages
5. `02 - Lore/Tome 4 – Le terminal DOS.md` — ton et règles d'écriture du terminal

`02 - Lore/lore.md` est un document de brainstorming antérieur. Les prénoms
qu'il utilise (Lucas, Sophie, Emma, Noah) ne sont **pas** canon et ne doivent
apparaître dans aucun log.

---

## 1. Cadre temporel

Le jeu se déroule en **juillet 1989**, peu après les événements de l'été.

| Repère | Date |
| --- | --- |
| Période archivée « propre » | avril 1989 |
| Période de crise | 11/06/1989 → 06/07/1989 |
| Gel des archives par Fazbear Entertainment | 03/07/1989 |
| Nuit 1 du joueur | lundi 10/07/1989 |
| Nuit 5 du joueur | vendredi 14/07/1989 |

Horaires : ouverture au public jusqu'à **18:00**, service de nuit **00:00 → 06:00**.

Les logs n'affichent jamais la date du jour de la partie. Quand un événement
est en cours, ils écrivent « cette nuit ». C'est le seul moyen pour le joueur de
distinguer une archive d'une trace fraîche.

---

## 2. Chronologie

### Avril 1989 — la période « conforme »

| Date | Fait | Logs |
| --- | --- | --- |
| 12/04 | Anniversaire privé, 47 invités, 47 départs, 48 noms sur la liste jointe | ARCHIVE |
| 12/04 | Peluche ours retrouvée en Dining Area (OBJ-446) | LOGS |
| 18/04 | Chaussure enfant retrouvée en Supply Closet (OBJ-448) | LOGS |
| 18/04 | 18:41, une personne détectée en Supply Closet après la fermeture | CAMLOG |
| 21/04 | Anniversaire privé, 32 invités, 32 départs | ARCHIVE |
| 21/04 | Casquette rouge (OBJ-445) et petite voiture rouge (OBJ-443) entrent au registre | LOST_OBJECTS |

C'est la seule période qu'ARCHIVE accepte encore d'ouvrir. Elle affiche une
intégrité de 100 % alors que juin et juillet sont déclarés non disponibles :
c'est le mensonge central du sous-système EVENTS.

### Juin 1989 — la période effacée

| Date | Fait | Logs |
| --- | --- | --- |
| 03/06 | 17:52, signalement d'un chien sur le parking | PETS |
| 04/06 | Anniversaire, 11 invités, 6 ans, terminé | PARTY |
| 11/06 | Anniversaire, 15 invités, 8 ans, **interrompu** | PARTY, NEWS_GAB_01 (12/06), NEWS_GAB_02 (13/06) |
| 12/06 | 08 dessins enregistrés ; rideau de Pirate Cove replacé | DRAWINGS, PIRATE |
| 15/06 | 02:34, signalement d'un chien en East Hall A ; début de la campagne de remplacement des décorations (08 dessins retirés) | PETS, CLEANING, NEWS_JER_01 |
| 18/06 | 11 dessins enregistrés ; accessoires déplacés à Pirate Cove | DRAWINGS, PIRATE |
| 21/06 | 11 dessins retirés | CLEANING, NEWS_JER_02 |
| 24/06 | 02:54, gamelle déplacée en Kitchen | COOKING |
| 25/06 | 03:02, gamelle déplacée ; son de scène détecté à Pirate Cove | COOKING, PIRATE |
| 26/06 | **Journée pivot**, voir ci-dessous | |
| 27/06 | 07 dessins retirés ; la boîte de crayons commence à se déplacer chaque nuit | CLEANING, LOST_ART |
| 28/06 | Laisse rouge photographiée en Dining Area | LOST_PETS, NEWS_FRT_01 |
| 29/06 | Dernier dessin retiré, Backstage repeint | CLEANING, NEWS_JER_03 |
| 30/06 | 08:12, ce dessin est de nouveau accroché | CLEANING, CHILDREN_ART, NEWS_SUS_01 |

### 26/06/1989 — la journée pivot

Tous les logs qui portent cette date décrivent la même journée, dans cet ordre :

| Heure | Fait | Logs |
| --- | --- | --- |
| 03:07:42 | Objet métallique déplacé en Kitchen | KITCHEN, COOKING |
| 03:07:49 | Tintement léger | KITCHEN |
| 03:08:01 | Son non identifié (aboiement selon le veilleur) | KITCHEN, REPORT_89, PETS |
| 03:08:03 → 03:08:07 | **4 secondes absentes de l'enregistrement** | KITCHEN, REPORT_89 |
| 03:08:12 | Ouverture de la porte de la cuisine | KITCHEN |
| 03:12 | Dernier accès du veilleur Antoine M. au système | WHOAMI |
| 16:00 | Réservation privée, 4 enfants, 7 ans | GUESTS, PARTY, TABLES |
| 18:00 | La procédure de fermeture échoue : 1 enfant toujours présent | CLOSED |
| — | 07 dessins enregistrés | DRAWINGS |

Le rapport d'incident **FE-89-143** est le dernier document transmis par
Antoine M. Aucun rapport ne suit.

### Juillet 1989 — l'effacement

| Date | Fait | Logs |
| --- | --- | --- |
| 02/07 | Communiqué : aucune présence animale dans l'établissement | PETS, NEWS_SUS_02 |
| 03/07 | 23:41 → 23:44, suppression de `enfant_05`, de son archive mémoire, et tentative de suppression du nom utilisateur (échec) | ROOT |
| 03/07 | Note interne 89-14 : consigne de silence. Dernière synchronisation et dernière vérification des archives | STAFF, LOGS, ARCHIVE |
| 03/07 → 05/07 | Le mécanisme de rideau de Pirate Cove s'active seul, 3 fois | MAINT_05 |
| 05/07 | Pirate Cove fermée au public. Inventaire des accessoires : drapeau rouge manquant | PIRATE, STAGE_PROP, NEWS_FRT_03 |
| 06/07 | 07:12, le drapeau rouge est retrouvé au centre du décor. Rapport MAINT-05 | STAGE_PROP, MAINT_05 |
| 06/07 | Inspection sanitaire : conforme, aucune présence animale | NEWS_SUS_03 |

La session qui a effectué les suppressions du 03/07 n'est rattachée à aucun
compte. Le seul compte administrateur du système n'a plus été utilisé depuis le
**09/02/1986**, soit 1247 jours avant la nuit 1. SUDO et ROOT portent chacun la
moitié de cette contradiction ; aucun des deux ne la commente.

---

## 3. Personnages

### Les cinq enfants

| Segment | Prénom | Animatronique | Ancrage | Log de référence |
| --- | --- | --- | --- | --- |
| 01 | Gabriel | Freddy | ANNIVERSAIRE | TABLES |
| 02 | Jeremy | Bonnie | DESSINS | DRAWINGS |
| 03 | Susie | Chica | ANIMAL | LOST_PETS |
| 04 | Fritz | Foxy | JEU | LOST_TOYS |
| 05 | *(aucun nom)* | Golden Freddy | AUCUN | *(aucun)* |

Les quatre premiers prénoms peuvent être affichés. Le cinquième ne l'est jamais.
Le système ne le désigne que par `CHILD_05`, `enfant_05` ou `SEGMENT 05`, et ces
trois formes doivent rester interchangeables d'un log à l'autre.

Le nom « Cassidy » n'apparaît dans aucun log, jamais.

### Le personnel

| ID | Nom | Poste | Statut |
| --- | --- | --- | --- |
| 001 | Pierre D. | Service | ACTIF |
| 002 | Marie L. | Cuisine | ACTIF |
| 003 | Antoine M. | Veilleur de nuit | ARCHIVÉ |
| 004 | *(non disponible)* | Veilleur de nuit | ACTIF |

`004` est le joueur. `003` est le veilleur précédent : STAFF conserve encore son
nom, le système de sécurité ne l'a plus. REPORT_89 affiche `[SUPPRIMÉ]` mais
laisse la référence RH `003` en clair : c'est au joueur de faire le
rapprochement, aucun log ne le fait pour lui.

Le compte administrateur est `[SUPPRIMÉ]`, statut ARCHIVÉ.

---

## 4. Salles

Les logs n'emploient que les noms de `rooms_config.json`, jamais leur traduction
française. Le code caméra est ajouté quand la ligne s'y prête.

| Salle | Caméra |
| --- | --- |
| Show Stage | CAM 1A |
| Dining Area | CAM 1B |
| Pirate Cove | CAM 1C |
| West Hall A / West Hall B | CAM 2A / CAM 2B |
| Supply Closet | CAM 3 |
| East Hall A / East Hall B | CAM 4A / CAM 4B |
| Backstage | CAM 5 |
| Kitchen | CAM 6 |
| Restroom | CAM 7 |

Le parking est hors couverture caméra et se note `Parking (hors caméra)`.

---

## 5. Registre des objets

Référence unique `OBJ-xxx`, continue sur tout le registre historique. Les
numéros courts (`001`, `003`…) sont des numéros de fiche internes à un log et
n'ont de sens que dans ce log.

| Réf. | Objet | Entrée | Statut affiché | Logs |
| --- | --- | --- | --- | --- |
| OBJ-442 | Veste bleue | avril 1989 | RENDUE | LOST_OBJECTS |
| OBJ-443 | Petite voiture rouge | 21/04/1989 | RENDUE | LOST_OBJECTS, TOYS, LOST_TOYS |
| OBJ-444 | Sac à dos | avril 1989 | RENDU | LOST_OBJECTS |
| OBJ-445 | Casquette rouge | 21/04/1989 | EN ATTENTE | LOST_OBJECTS, LOST |
| OBJ-446 | Peluche ours | 12/04/1989 | NON RÉCLAMÉ | LOGS |
| OBJ-448 | Chaussure enfant | 18/04/1989 | NON RÉCLAMÉ | LOGS |
| OBJ-451 | Ballon bleu | juin 1989 | EN ATTENTE | LOST |
| OBJ-452 | Bracelet rose | juin 1989 | EN ATTENTE | LOST |
| OBJ-453 | Chaise enfant | 26/06/1989 | EN ATTENTE | LOST, LOST001 |

`OBJ-447`, `OBJ-449` et `OBJ-450` n'existent pas et ne doivent jamais être
comblés : le registre a des trous.

### Contradictions volontaires du registre

Trois seulement, et elles sont toutes exploitables par le joueur :

1. **OBJ-443** est marqué RENDUE au registre historique depuis le 21/04/1989, et
   PRÉSENTE dans l'inventaire courant. La petite voiture rouge est l'anomalie
   signature de Fritz (`FRT-001`, `FRT-011`, `FRT-021`, `FRT-028`).
2. **OBJ-445** attend depuis 4018 jours alors que le système est daté de 1989.
   Le contrôle de cohérence échoue et le log l'affiche sans l'expliquer.
3. **Deux objets** (bateau pirate miniature, petite voiture rouge) figurent en
   même temps dans TOYS comme archivés et dans LOST_TOYS comme non récupérés.
   LOST_TOYS signale l'incohérence, ne la résout pas.

### Objets

Vocabulaire figé, à réutiliser tel quel :

- Décorations : ballon rouge, ballon bleu, ballon vert, **ballon jaune** (hors inventaire)
- Jouets : bateau pirate miniature, petite voiture rouge, figurine pirate,
  figurine renard, cubes en bois, dés en plastique, yo-yo rouge
- Accessoires de scène : chapeau pirate, carte au trésor, épée plastique,
  coffre miniature, drapeau rouge
- Cuisine : gamelle inox
- Susie : collier rouge, médaille métallique, laisse en nylon
- Dessin : boîte de crayons, feutres, cahier de dessin, feuille blanche

---

## 6. Comptages

Chaque total affiché doit être vérifiable par addition des lignes au-dessus.

| Ensemble | Détail | Total |
| --- | --- | --- |
| Dessins | 08 (12/06) + 11 (18/06) + 07 (26/06) + 01 (sans date) | 27 |
| Dessins archivés et numérisés | 27 − 01 sans origine | 26 |
| Dessins retirés | 08 + 11 + 07 + 01 | 27 |
| Dessins accrochés | 09 Est + 08 Nord + 09 Ouest + 01 Sud | 27 |
| Ballons commandés | 37 rouges + 42 bleus + 18 verts | 97 |
| Ballons comptés | 97 + 01 jaune | 98 |
| Accessoires de scène | 03 + 02 + 04 + 01 + 01 | 11 |
| Objets scolaires | 02 + 01 + 01 + 14 | 18 |
| Couverts de la table du 26/06 | 06 dressés, 05 utilisés, 04 invités | — |

Le dessin sans origine, le ballon jaune, le couvert supplémentaire et le
cinquième invité sont la même anomalie déclinée quatre fois. Aucun log ne le
dit.

Les durées de stockage sont calculées jusqu'au **03/07/1989**, date de la
dernière synchronisation :

- OBJ-446, entré le 12/04/1989 → 82 jours, retrait réglementaire le 11/07/1989
- OBJ-448, entré le 18/04/1989 → 76 jours, retrait réglementaire le 17/07/1989

Le retrait d'OBJ-446 tombe pendant la nuit 2 du joueur.

---

## 7. Sous-systèmes et versions

Deux logs qui affichent le même numéro de version viennent du même sous-système.
Le joueur peut s'en servir pour regrouper les fichiers.

| Sous-système | Version | Logs |
| --- | --- | --- |
| EVENTS | v2.1 | ARCHIVE, GUESTS, PARTY |
| ROOM MAP | v1.4 | TABLES |
| INVENTORY | v3.2 | BALLOON, STAGE_PROP, TOYS |
| LOST & FOUND | v1.2 | LOST, LOST001, LOST_ART, LOST_OBJECTS, LOST_PETS, LOST_TOYS |
| INCIDENTS | v1.2 | CLOSED, LOGS, PETS, REPORT_89 |
| MAINTENANCE | v1.5 | CLEANING, COOKING, KITCHEN, MAINT_05, PIRATE |
| ARCHIVE ART | v2.4 | CHILDREN_ART, DRAWINGS, SCANNER |
| CCTV | v1.7 | CAMLOG |
| RH | v1.4 | STAFF |
| SECURITY SYS | v1.8 | ROOT, SUDO, USER, WHOAMI |
| RECOVERY | v0.9 | DELETE, MEMORY, RECOVER |

RECOVERY est en v0.9 : c'est le seul sous-système qui n'a jamais atteint une
version stable, et le seul qui produise des entrées non sollicitées.

---


## 8. Maquette du document

Tous les logs sont des documents Fazbear Entertainment et se présentent de la
même façon. Un log qui s'écarte de cette maquette est refusé par le validateur.

### 8.1 Structure

```
╔══════════════════════════════════════════════════════════════╗
║                    FAZBEAR ENTERTAINMENT                     ║
║               REGISTRE DES OBJETS NON RÉCLAMÉS               ║
╚══════════════════════════════════════════════════════════════╝

DOCUMENT .................... INCIDENTS.LOG
RÉFÉRENCE ................... FE-89-156
SERVICE ÉMETTEUR ............ INCIDENTS v1.2
CLASSIFICATION .............. INTERNE
DERNIÈRE MISE À JOUR ........ 03/07/1989

════════════════════════════════════════════════════════════════
  1. OBJETS ENREGISTRÉS
════════════════════════════════════════════════════════════════

 N°    RÉF.       DATE         OBJET
 ──────────────────────────────────────────────────────────────
 003   OBJ-446    12/04/1989   Peluche ours

════════════════════════════════════════════════════════════════
  2. FICHE OBJET N°003
════════════════════════════════════════════════════════════════

OBJET ....................... Peluche ours
DURÉE DE STOCKAGE ........... 82 JOURS

════════════════════════════════════════════════════════════════
  FIN DU DOCUMENT
  FAZBEAR ENTERTAINMENT - DIFFUSION INTERNE
════════════════════════════════════════════════════════════════

█
```

**En-tête société.** Cadre de 64 colonnes, contenu centré sur 62. La ligne 2
porte toujours `FAZBEAR ENTERTAINMENT`, sans exception et sans variante : c'est
l'en-tête imprimé de la société. La ligne 3 porte le titre du document.

**Bloc d'identification.** Toujours ces cinq champs, dans cet ordre, sans titre
de section au-dessus. Il joue le rôle du cartouche de référence d'un formulaire.

**Sections.** Numérotées à partir de 1, sans trou, titre en majuscules indenté
de deux espaces, encadré par un filet `═` au-dessus et en dessous.

**Pied de page.** `FIN DU DOCUMENT` si le document se clôt normalement,
`DOCUMENT NON CLÔTURÉ` sinon, puis `█` seul sur la dernière ligne.

### 8.2 Champs

Un seul format, jamais de libellé sur une ligne et de valeur sur la suivante :

```
LIBELLÉ EN MAJUSCULES ....... valeur
```

La valeur commence toujours en **colonne 31**. Le libellé est en majuscules et
fait au plus 28 caractères. Les valeurs de statut sont en majuscules
(`ARCHIVÉ`, `AUCUNE`, `INCONNU`) ; les noms propres et les libellés d'objet
gardent leur casse naturelle (`Peluche ours`, `Dining Area (CAM 1B)`).

Les champs d'un même bloc se suivent sans ligne vide. Une ligne vide sépare deux
blocs.

### 8.3 Tableaux

Indentés d'un espace, en-tête de colonnes puis filet `─` de 62 caractères, lignes
collées. Un filet de clôture précède une ligne `TOTAL` quand il y en a une.

```
 OBJET                QUANTITÉ
 ──────────────────────────────────────────────────────────────
 Chapeau pirate           03
 Carte au trésor          02
 ──────────────────────────────────────────────────────────────
 TOTAL ENREGISTRÉ         11
```

### 8.4 Lignes de trace

Une ligne préfixée `>` n'appartient pas au document : c'est le système qui parle
pendant l'affichage. Toujours en majuscules. Réservées aux sous-systèmes
SECURITY SYS et RECOVERY, et à la procédure de fermeture. Un document EVENTS,
INVENTORY, LOST & FOUND, INCIDENTS, MAINTENANCE, ARCHIVE ART, CCTV ou RH n'en
contient aucune : il constate, il ne commente pas.

### 8.5 Documents interrompus

Les logs de type `sequence` n'affichent jamais de pied de page : l'anomalie les
coupe avant la clôture. Les logs qui se terminent sur un échec du système
(ROOT, USER, DELETE, MEMORY, RECOVER) portent `DOCUMENT NON CLÔTURÉ`.

C'est le seul signal de mise en page qui porte du sens : un document qui ne se
ferme pas est un document que le système n'a pas réussi à archiver.

### 8.6 Références

`FE-89-NNN` pour un document produit par un service de l'entreprise,
`SYS-89-NNN` pour une sortie machine (SECURITY SYS, RECOVERY). Le numéro suit
l'ordre chronologique de la dernière mise à jour. `REPORT_89` porte `FE-89-143`,
daté du 26/06/1989 : c'est le point fixe qui cale toute la numérotation.

`CLASSIFICATION` prend une seule de ces valeurs : `INTERNE`, `CONFIDENTIEL`
(ARCHIVE, CLOSED, REPORT_89, STAFF), `RESTREINT` (ROOT, SUDO, USER, WHOAMI),
`SYSTÈME` (DELETE, MEMORY, RECOVER).

### 8.7 Typographie

- Dates en `JJ/MM/AAAA`, heures en `HH:MM`, relevés audio en `HH:MM:SS`.
- Quantités sur deux chiffres dans les tableaux (`03`, `11`).
- Tiret simple `-` partout, jamais de tiret cadratin : un terminal DOS de 1989
  ne l'afficherait pas.
- Valeurs absentes : `AUCUN`, `AUCUNE`, `INCONNU`, `INCONNUE`, `[ABSENT]`,
  `[SUPPRIMÉ]`, `[ARCHIVÉ]`, `[NON DISPONIBLE]`. Pas d'autre formulation.

### 8.8 Règles de fond

Reprises du Tome IV :

- Le terminal constate, il n'interprète pas. Pas de phrase qui explique une
  anomalie.
- Chaque fichier doit ouvrir au moins une question de plus qu'il n'en ferme.
- Le terminal n'emploie jamais « supprimer » pour parler de ses propres
  corrections : `corriger`, `stabiliser`, `archiver`, `réindexer`. Il emploie
  `SUPPRIMÉ` uniquement pour ce qu'un humain a effacé.
- Aucun log ne nomme un coupable, ne décrit un meurtre, ni ne prononce le mot
  « disparition ».

---

## 9. Vérification

```bash
node ".github/Projet/_editor_log/check_logs.js"
```

Le script contrôle la présence et la validité JSON de chaque fichier déclaré
dans `script/config/logs_database.json`, la correspondance entre `command` et
nom de fichier, puis toute la maquette de la section 8 : en-tête société, bloc
d'identification, colonne des valeurs, numérotation des sections, filets, pied
de page. Il signale aussi les dates hors période et les prénoms hors canon.

Il sort en code 1 dès qu'une erreur est trouvée.
