# Analyse des chances de trouver les secrets (random events)

Analyse du moteur d'événements aléatoires (`script/core/random_events_engine.js` +
`script/loaders/random_events_data.js`, données dans
`script/config/random_events_data.json`) : à quel point le champ `chance` de
chaque événement reflète-t-il réellement la difficulté de le trouver, et
quels événements sont en pratique impossibles à découvrir.

## Comment le moteur tire au sort

Le champ `chance` n'est pas une probabilité "à la découverte" : le moteur
retire une chance **chaque seconde** tant que l'événement reste éligible
(bonne caméra affichée + fenêtre horaire active), jusqu'à ce qu'il se
déclenche ou que la fenêtre se ferme. Le déclencheur (`triggerStr` dans le
JSON) change la fréquence des tirages :

- `observe` / `observeDuration` : un tirage par seconde passée sur la bonne
  caméra (après le délai minimum pour `observeDuration`).
- `cameraReturn` : un tirage à chaque bascule vers la caméra concernée.
- `silence` : un tirage par seconde d'inactivité continue (≥ 8 s), uniquement
  pour les événements sans caméra (vue bureau).

Une nuit dure ~720 s réelles (6h de jeu). Une fenêtre horaire de 1h ≈ 120 s
réelles ; "Toute nuit" couvre les 720 s.

## Ce que ça donne concrètement

118 événements au total (nuit 0 : 8 legacy, nuits 1-5 : 8/13/33/38/18).
`chance` va de 0.02 à 0.5, médiane 0.05. Répartition par déclencheur :
`observe` (66), `cameraReturn` (34), `observeDuration` (12), `silence` (6).

| chance | `observe`/`observeDuration` après 10s sur la caméra | après 30s | `cameraReturn` après 5 passages | après 10 passages |
| --- | --- | --- | --- | --- |
| 0.02 | 18% | 45% | 10% | 18% |
| 0.05 (médiane) | 40% | 79% | 23% | 40% |
| 0.10 | 65% | 96% | 41% | 65% |
| 0.15 | 80% | 99% | 56% | 80% |

**Conclusion** : un `chance` de 0.02-0.15 a l'air rare sur le papier, mais
avec un tirage par seconde, un joueur qui reste 30s sur la bonne caméra
pendant la bonne heure a de fortes chances (45-99%) de voir le secret — quasi
garanti (91-100%) s'il couvre toute la fenêtre horaire. La rareté ne vient
donc pas de `chance`, mais du fait qu'il faut être sur la bonne caméra
pendant la bonne tranche horaire : 45 des 118 événements (hors nuit 0) ont
une fenêtre ≤ 1h30 (~120-180 s réelles sur les ~720 s d'une nuit). C'est un
design cohérent (secrets à débusquer par exploration/timing plutôt que par
pure chance), mais `chance` seul ne donne pas une bonne intuition de la
difficulté réelle — c'est la largeur de la fenêtre horaire qui la détermine.

## Bugs trouvés (probabilité de 0%, quel que soit `chance`)

Ces événements ne se déclenchent jamais, dans l'état actuel du code :

1. **Les 8 événements `night: 0`** (`BONNIE-001`, `BONNIE-002`, `RESTO-001`,
   `CHICA-001/002/003`, `Animatronic-001`, `Freddy-001`, tous `chance: 0.5`)
   — `random_events_engine.js:151` :
   ```js
   if (event.night !== getCurrentNight() && event.night !== '0') return false;
   ```
   `event.night` vaut le nombre `0` dans le JSON, jamais la chaîne `'0'`,
   donc `event.night !== '0'` est toujours vrai et la fonction renvoie
   toujours `false`. Ces événements (ambiances de présence d'animatronic à
   forte probabilité, censées être communes à toute nuit) sont du contenu
   mort. Correctif : comparer `event.night !== 0` (nombre) ou normaliser les
   deux côtés en chaîne.

2. **`JER-006`, `SUS-025`, `SUS-029`** — déclencheur `"Silence"` mais
   rattachés à une salle avec caméra (`Supply Closet`/3, `Kitchen`/6,
   `Stage`/1a). `updateSilenceEvents()` n'évalue que les événements avec
   `cameraId === null` (vue bureau), donc ces trois ne peuvent jamais se
   déclencher. `JER-006` était déjà documenté comme tel dans
   `random_events_data.js:143-148`. `SUS-025` et `SUS-029` ont le même
   problème et n'étaient pas signalés. Correctif : soit changer leur
   déclencheur (`observe`/`cameraReturn` sur leur caméra), soit les
   déplacer en `roomLabel: "Bureau"` si le son doit rester indépendant de
   la caméra.

Au total, 11 des 118 événements (~9%) ont une probabilité de 0% en l'état,
indépendamment de leur `chance` configurée.

*Analyse réalisée le 2026-09-02. Aucun correctif appliqué à ce stade.*
