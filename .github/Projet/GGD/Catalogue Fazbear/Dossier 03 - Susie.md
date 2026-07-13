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




# Proposition d'amélioration : faire de la cuisine un **espace de doute**

Je pense qu'on peut transformer la **Kitchen** en l'une des salles les plus mémorables du jeu.

Dans **FNAF 1**, aucune image n'est disponible pour cette caméra : le joueur ne reçoit que de l'audio. Conservons cette règle.

Toutes les anomalies liées à **Susie** dans cette salle passent uniquement par le son :

- Un collier qui tinte.
- Une gamelle qui glisse sur le sol.
- Un léger aboiement au loin.
- Chica qui semble réagir à quelque chose que le joueur ne verra jamais.

La cuisine devient ainsi un espace où **l'imagination complète ce que les caméras refusent de montrer**.

Cette approche est fidèle au gameplay original de **FNAF 1**, respecte le lore officiel et renforce le thème de Susie : croire qu'il reste encore quelque chose à retrouver, sans jamais pouvoir le voir.

---

# Philosophie narrative

Contrairement aux autres enfants :

- **Gabriel** attend.
- **Jeremy** dessine.
- **Fritz** joue.
- **Susie** cherche.

Jamais le joueur ne voit son chien.

Pourtant, tout le restaurant semble lui faire croire qu'il est tout proche.

Le joueur doute.

Susie doute.

Et c'est précisément ce qu'Afton voulait.


# Tableau de Production

| ID      | Priorité | Type    | Salle       | Caméra | Nuit | Heure         | Chance | Déclencheur   | Description                            | Lore                                    | Son           | Script JS        | Terminal  | Journal | Cassette | RequiresEvent |
| ------- | -------- | ------- | ----------- | ------ | ---- | ------------- | ------ | ------------- | -------------------------------------- | --------------------------------------- | ------------- | ---------------- | --------- | ------- | -------- | ------------- |
| SUS-001 | Haute    | Objet   | Dining Area | CAM01  | 1    | Toute nuit    | 18%    | Observer      | Gamelle métallique sous une table      | Appartient au chien                     | bowl.wav      | bowl.js          | LOST021   | —       | —        | —             |
| SUS-002 | Haute    | Objet   | Dining Area | CAM01  | 2    | 01h00         | 10%    | Retour caméra | Laisse rouge oubliée                   | Dernière promenade                      | chain.wav     | leash.js         | LOST022   | NEWS021 | —        | **SUS-001**   |
| SUS-003 | Haute    | Son     | Kitchen     | Audio  | 2    | 02h15         | 5%     | Écoute CAM06  | Aboiement très lointain                | Faux espoir                             | dog_far.wav   | audioDog.js      | —         | —       | TAPE021  | **SUS-002**   |
| SUS-004 | Haute    | IA      | Kitchen     | Audio  | 3    | 03h00         | 4%     | Écoute 10 s   | Chica tourne la tête vers une porte    | Elle « entend » quelque chose           | metal.wav     | chicaTurn.js     | —         | —       | —        | **SUS-003**   |
| SUS-005 | Haute    | Overlay | Dining Area | CAM01  | 3    | Toute nuit    | 7%     | Observer      | Cupcake légèrement déplacé             | Chica protège un souvenir               | ceramic.wav   | cupcake.js       | REPORT021 | —       | —        | **SUS-004**   |
| SUS-006 | Haute    | Objet   | East Hall   | CAM04  | 3    | 01h30         | 6%     | Observer      | Petit collier pour chien               | Objet perdu                             | bell.wav      | collar.js        | LOST023   | NEWS022 | —        | **SUS-002**   |
| SUS-007 | Moyenne  | Son     | Bureau      | —      | 4    | 02h45         | 3%     | Silence       | Petit jappement très faible            | Souvenir                                | puppy.wav     | puppy.js         | —         | —       | —        | **SUS-003**   |
| SUS-008 | Haute    | Overlay | Kitchen     | Audio  | 4    | Toute nuit    | 5%     | Retour écoute | Bruit de gamelle déplacée              | Quelqu'un nourrit encore le chien       | bowl_move.wav | bowlMove.js      | CLEAN021  | —       | —        | **SUS-006**   |
| SUS-009 | Haute    | Objet   | Dining Area | CAM01  | 5    | Toute nuit    | 4%     | Observer      | Ruban jaune au sol                     | Susie                                   | cloth.wav     | ribbon.js        | LOST024   | —       | TAPE022  | **SUS-008**   |
| SUS-010 | Haute    | IA      | Stage       | CAM01  | 5    | 04h00         | 2%     | Retour caméra | Chica regarde le joueur sans bouger    | Confusion avec Michael                  | breathe.wav   | chicaStare.js    | —         | —       | —        | **SUS-009**   |
| SUS-011 | Moyenne  | Objet   | Dining Area | CAM01  | 2    | Toute nuit    | 8%     | Observer      | Gamelle déplacée                       | Quelqu'un est revenu                    | bowl.wav      | bowlMoved.js     | LOST025   | —       | —        | **SUS-001**   |
| SUS-012 | Moyenne  | Objet   | Dining Area | CAM01  | 2    | Toute nuit    | 7%     | Observer      | Laisse au sol                          | Dernière promenade                      | chain.wav     | leashFloor.js    | LOST026   | —       | —        | **SUS-002**   |
| SUS-013 | Moyenne  | Objet   | East Hall   | CAM04  | 3    | Toute nuit    | 6%     | Observer      | Collier usé                            | Objet jamais récupéré                   | bell.wav      | collarOld.js     | LOST027   | —       | —        | **SUS-006**   |
| SUS-014 | Moyenne  | Décor   | East Hall   | CAM04  | 3    | Toute nuit    | 5%     | Observer      | Empreintes de pattes poussiéreuses     | Vieilles traces                         | step.wav      | pawprints.js     | REPORT022 | —       | —        | **SUS-013**   |
| SUS-015 | Moyenne  | Objet   | Dining Area | CAM01  | 4    | Toute nuit    | 5%     | Observer      | Petite balle jaune sous une chaise     | Jouet oublié                            | ball.wav      | ball.js          | LOST028   | NEWS023 | —        | **SUS-014**   |
| SUS-016 | Haute    | Overlay | Dining Area | CAM01  | 3    | Retour caméra | 6%     | Retour caméra | Cupcake orienté vers la caméra         | Il semble observer                      | ceramic.wav   | cupcakeLook.js   | REPORT023 | —       | —        | **SUS-005**   |
| SUS-017 | Haute    | Overlay | Dining Area | CAM01  | 3    | Toute nuit    | 5%     | Observer      | Cupcake regarde la porte               | Il attend quelqu'un                     | ceramic.wav   | cupcakeDoor.js   | REPORT024 | —       | —        | **SUS-016**   |
| SUS-018 | Haute    | Overlay | Dining Area | CAM01  | 4    | Retour caméra | 4%     | Retour caméra | Cupcake disparaît une seconde          | Impossible à expliquer                  | whoosh.wav    | cupcakeGone.js   | REPORT025 | —       | —        | **SUS-017**   |
| SUS-019 | Haute    | Overlay | Dining Area | CAM01  | 4    | Retour caméra | 4%     | Retour caméra | Cupcake revient à sa place             | Rien n'a changé...                      | ceramic.wav   | cupcakeBack.js   | REPORT026 | —       | —        | **SUS-018**   |
| SUS-020 | Haute    | Objet   | Dining Area | CAM01  | 5    | Toute nuit    | 3%     | Observer      | Cupcake légèrement fissuré             | Même lui se détériore                   | crack.wav     | cupcakeCrack.js  | REPORT027 | NEWS024 | —        | **SUS-019**   |
| SUS-021 | Moyenne  | Son     | Kitchen     | Audio  | 3    | Toute nuit    | 6%     | Écoute        | Gamelle métallique déplacée            | Quelqu'un est dans la cuisine           | bowl_move.wav | kitchenBowl.js   | CLEAN022  | —       | —        | **SUS-008**   |
| SUS-022 | Moyenne  | Son     | Kitchen     | Audio  | 3    | Toute nuit    | 5%     | Écoute        | Placard ouvert                         | Une recherche silencieuse               | cupboard.wav  | cupboard.js      | CLEAN023  | —       | —        | **SUS-021**   |
| SUS-023 | Moyenne  | Son     | Kitchen     | Audio  | 4    | Toute nuit    | 5%     | Écoute        | Couverts qui tombent                   | Bruit métallique inquiétant             | cutlery.wav   | cutlery.js       | CLEAN024  | —       | —        | **SUS-022**   |
| SUS-024 | Moyenne  | Son     | Kitchen     | Audio  | 4    | Toute nuit    | 4%     | Écoute        | Eau qui coule                          | Quelqu'un utilise l'évier               | water.wav     | water.js         | CLEAN025  | —       | —        | **SUS-023**   |
| SUS-025 | Haute    | Son     | Kitchen     | Audio  | 5    | Toute nuit    | 3%     | Silence       | Petit halètement très discret          | Comme un chien fatigué                  | pant.wav      | pant.js          | CLEAN026  | —       | TAPE023  | **SUS-024**   |
| X SUS-026 | Haute    | IA      | Restroom       | CAM01  | 3    | 02h00         | 6%     | Retour caméra | Chica regarde la cuisine               | Elle cherche quelque chose              | servo.wav     | chicaKitchen.js  | —         | —       | —        | **SUS-004**   |
| X SUS-027 | Haute    | IA      | Stage       | CAM01  | 4    | 02h30         | 5%     | Retour caméra | Chica protège le Cupcake               | Elle garde un souvenir                  | breathe.wav   | chicaCupcake.js  | —         | NEWS025 | —        | **SUS-016**   |
| SUS-028 | Haute    | IA      | Stage       | CAM01  | 4    | 03h00         | 4%     | Observer 10 s | Chica baisse la tête                   | Comme si elle pleurait                  | servo.wav     | chicaHeadDown.js | —         | —       | TAPE024  | **SUS-027**   |
| SUS-029 | Haute    | IA      | Stage       | CAM01  | 5    | 03h30         | 3%     | Silence       | Chica semble écouter                   | Elle entend encore le chien             | static.wav    | chicaListen.js   | —         | —       | —        | **SUS-028**   |
| SUS-030 | Haute    | IA      | Stage       | CAM01  | 5    | 04h30         | 2%     | Retour caméra | Chica s'arrête devant une porte fermée | Elle attend toujours le retour de Susie | door.wav      | chicaDoor.js     | REPORT028 | NEWS026 | TAPE025  | **SUS-029**   |



Série "Terminal"
| ID      | Commande    | Contenu                                                     |
| ------- | ----------- | ----------------------------------------------------------- |
| SUS-031 | PETS.LOG    | Signalements d'animaux dans le restaurant                   |
| SUS-032 | LOST_PETS   | Objet trouvé : collier rouge                                |
| SUS-033 | KITCHEN.LOG | Bruits nocturnes signalés par les employés                  |
| SUS-034 | CLEANING    | Gamelle retrouvée plusieurs matins de suite                 |
| SUS-035 | REPORT_87   | Employé affirmant avoir entendu un chien après la fermeture |


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


# Prompt

SUS-026 : Conserver exactement l'image d'origine, avec le même cadrage, la même perspective, les mêmes proportions (16:9), le même éclairage, les mêmes textures et tous les éléments du décor inchangés. Ne pas ajouter de texte, d'interface ou d'objets supplémentaires. La cuisine doit rester entièrement hors champ, invisible au bout du couloir. Ajouter uniquement Chica, un animatronique jaune de style années 80, placée tout au fond du couloir, dans l'angle supérieur droit de l'image. Elle est de dos ou en trois-quarts dos, tournée vers la droite, comme si elle regardait dans une pièce située hors champ (la cuisine). Son attitude suggère qu'elle cherche quelque chose. Chica doit être immobile, légèrement penchée vers la droite, sans regarder la caméra. Elle doit apparaître plus petite en raison de la distance, parfaitement intégrée à la perspective et à l'éclairage de la scène. Aucun autre élément de l'image ne doit être modifié.