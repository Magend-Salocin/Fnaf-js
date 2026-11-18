# Événements : récompenses

Ce que le joueur gagne en voyant une anomalie. Le principe et les règles sont dans [Parcours_Enquete.md](../Next/Parcours_Enquete.md), section 2. Données : `script/config/rewards_data.json`.

Vue générée le 18/11/2026 par `node tools/vues_evenements.js` à partir des JSON de `script/config/`. Ne pas éditer : modifier le JSON, puis relancer le script.

## En bref

| Ce que le joueur gagne | Comment |
| --- | --- |
| Cassette, journal, log bonus | Chaque anomalie vue d'un enfant donne la prochaine récompense de sa réserve, si sa nuit minimale est atteinte |
| Log de chaîne | Première anomalie vue de l'enfant. Cassidy : une des traces du cinquième enfant (`openEvents`) |
| Cassette de fin de chaîne | L'événement de fin de chaîne, une fois le log de chaîne lu |
| Log de révélation | Ouvert par la nuit : champ `minNight` du log |
| Journal garanti | `ensureNightJournals()`. Les réserves sautent ensuite les journaux déjà donnés |

## Logs de révélation par nuit

| Nuit | Logs ouverts |
| --- | --- |
| 1 | ARCHIVE, CAMLOG, LOGS, LOST_OBJECTS, STAFF |
| 2 | DRAWINGS, GUESTS, PARTY, PETS, TABLES, TOYS |
| 3 | CLOSED, KITCHEN, LOST, LOST001, REPORT_89 |
| 4 | CLEANING, DELETE, ROOT, SUDO, USER |
| 5 | RECOVER, WHOAMI |

## Anomalies et récompenses par nuit

Pour chaque enfant : anomalies possibles / récompenses qui deviennent disponibles cette nuit-là.

| Nuit | Gabriel | Jeremy | Susie | Fritz | Cassidy |
| --- | --- | --- | --- | --- | --- |
| 1 | 2 / 2 | 2 / 2 | 2 / 2 | 2 / 2 | 1 / 1 |
| 2 | 4 / 1 | 3 / 2 | 3 / 2 | 3 / 1 | 1 / 1 |
| 3 | 6 / 1 | 7 / 1 | 10 / 1 | 10 / 2 | 2 / 1 |
| 4 | 5 / 1 | 16 / 1 | 9 / 1 | 8 / 2 | 2 / 1 |
| 5 | 3 / 0 | 2 / 1 | 6 / 0 | 7 / 1 | 3 / 2 |

## Gabriel

| Ordre | Récompense | Type | Nuit min. | Contenu |
| --- | --- | --- | --- | --- |
| 1 | TAPE_GAB_01 | Cassette | 1 | Préparation des anniversaires privés |
| 2 | NEWS_GAB_01 | Journal | 1 | Une fête d'anniversaire tourne court au Freddy Fazbear's Pizza |
| 3 | TAPE_GAB_02 | Cassette | 2 | Consignes d'animation — Freddy |
| 4 | NEWS_GAB_02 | Journal | 3 | Plusieurs familles quittent rapidement le restaurant après une interruption inattendue |
| 5 | NEWS_GAB_03 | Journal | 4 | Des objets personnels oubliés restent non réclamés au restaurant |

Chaîne : première anomalie de Gabriel → log BALLOON lu → GAB-014 → TAPE_GAB_03.

## Jeremy

| Ordre | Récompense | Type | Nuit min. | Contenu |
| --- | --- | --- | --- | --- |
| 1 | TAPE_JER_01 | Cassette | 1 | Installation du concours de dessin |
| 2 | NEWS_JER_01 | Journal | 1 | Fazbear Entertainment présente une nouvelle décoration pour son restaurant familial |
| 3 | TAPE_JER_02 | Cassette | 2 | Rappel de rangement — équipe de nuit |
| 4 | NEWS_JER_02 | Journal | 2 | Les anciens dessins d'enfants remplacés par une nouvelle collection artistique |
| 5 | NEWS_JER_03 | Journal | 3 | Le restaurant Fazbear rénové après plusieurs dégradations intérieures |
| 6 | CHILDREN_ART | Log | 4 | Log du terminal |
| 7 | SCANNER | Log | 5 | Log du terminal |

Chaîne : première anomalie de Jeremy → log LOST_ART lu → JER-015 → TAPE_JER_03.

## Susie

| Ordre | Récompense | Type | Nuit min. | Contenu |
| --- | --- | --- | --- | --- |
| 1 | TAPE_SUS_01 | Cassette | 1 | Protocole de fermeture — cuisines |
| 2 | NEWS_SUS_01 | Journal | 1 | Des employés signalent des bruits étranges provenant des cuisines du Freddy Fazbear's Pizza |
| 3 | TAPE_SUS_02 | Cassette | 2 | Gamelle déplacée durant la nuit |
| 4 | NEWS_SUS_02 | Journal | 2 | Fazbear Entertainment dément les rumeurs concernant un animal présent dans le restaurant |
| 5 | NEWS_SUS_03 | Journal | 3 | Les inspections sanitaires confirment la conformité des cuisines Fazbear |
| 6 | COOKING | Log | 4 | Log du terminal |

Chaîne : première anomalie de Susie → log LOST_PETS lu → SUS-027 → TAPE_SUS_03.

## Fritz

| Ordre | Récompense | Type | Nuit min. | Contenu |
| --- | --- | --- | --- | --- |
| 1 | TAPE_FRT_01 | Cassette | 1 | Protocole de fermeture — Pirate Cove |
| 2 | NEWS_FRT_01 | Journal | 1 | Des familles demandent le retour de jouets oubliés au Freddy Fazbear's Pizza |
| 3 | PIRATE | Log | 2 | Log du terminal |
| 4 | TAPE_FRT_02 | Cassette | 3 | Jouets sortis pendant la nuit |
| 5 | NEWS_FRT_02 | Journal | 3 | Des employés signalent des changements inhabituels dans les décorations du restaurant |
| 6 | NEWS_FRT_03 | Journal | 4 | Pirate Cove fermé temporairement pour inspection technique |
| 7 | MAINT_05 | Log | 4 | Log du terminal |
| 8 | STAGE_PROP | Log | 5 | Log du terminal |

Chaîne : première anomalie de Fritz → log LOST_TOYS lu → FRT-026 → TAPE_FRT_03.

## Cassidy

| Ordre | Récompense | Type | Nuit min. | Contenu |
| --- | --- | --- | --- | --- |
| 1 | TAPE_ERREUR_01 | Cassette | 1 | Fréquence non identifiée |
| 2 | TAPE_ERREUR_02 | Cassette | 2 | Une voix d'enfant demande de l'aide |
| 3 | TAPE_ERREUR_03 | Cassette | 3 | Dialogue impossible entre deux voix |
| 4 | TAPE_ERREUR_04 | Cassette | 4 | Recherche d'un dossier victime manquant |
| 5 | TAPE_ERREUR_05 | Cassette | 5 | Analyse des profils émotionnels — anomalie détectée |
| 6 | TAPE_ERREUR_06 | Cassette | 5 | Reconstruction des souvenirs — un profil résiste |

Chaîne : une trace parmi CASSIDY-08, JER-016, CASSIDY-09 → log MEMORY lu → CASSIDY-07 → TAPE_ERREUR_07.
