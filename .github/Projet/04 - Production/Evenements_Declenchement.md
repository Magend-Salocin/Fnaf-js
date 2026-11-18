# Événements : déclenchement

Quand chaque événement peut sortir et avec quelle probabilité.

Vue générée le 18/11/2026 par `node tools/vues_evenements.js` à partir des JSON de `script/config/`. Ne pas éditer : modifier le JSON, puis relancer le script.

## Comment le moteur tire au sort

Le moteur tente sa chance une fois par seconde tant que l'événement est éligible : bonne nuit, bonne heure, bonne caméra affichée. Une heure de jeu dure 120 s réelles, une nuit 720 s. La difficulté vient donc surtout de la fenêtre horaire et de la caméra, moins de `chance`.

| Déclencheur | Ce que le joueur doit faire | Effort court mesuré |
| --- | --- | --- |
| Observer | Rester sur la caméra | 10 s sur la caméra |
| Observer N s | Rester N s d'affilée sur la caméra, puis une tentative par seconde | N + 10 s d'affilée |
| Retour caméra | Revenir sur la caméra : une tentative par passage | 5 passages |
| Silence | Ne rien faire pendant 8 s, puis une tentative par seconde. Caméra de la salle affichée, sauf pour le bureau | 18 s sans agir |
| Heure | Rien : une tentative par seconde pendant la fenêtre | automatique |

La colonne « Fenêtre entière » suppose que le joueur remplit la condition pendant toute la fenêtre horaire (20 passages pour « Retour caméra »). Un événement ne sort qu'une fois par nuit.

## Événements difficiles

Moins de 50 % de chances même en couvrant toute la fenêtre.

| ID | Nuit | Salle | Heure | Déclencheur | Chance | Fenêtre entière |
| --- | --- | --- | --- | --- | --- | --- |
| FRT-010 | 5 | Pirate Cove | 03h30 | Retour caméra | 0.02 | 33 % (20 passages) |
| SUS-010 | 5 | Stage | 04h00 | Retour caméra | 0.02 | 33 % (20 passages) |
| SUS-030 | 5 | Restroom | 04h30 | Retour caméra | 0.02 | 33 % (20 passages) |
| GAB-015 | 5 | Dining Area | 05h00 | Retour caméra | 0.03 | 46 % (20 passages) |

## Nuit 0 (legacy, toutes les nuits)

| ID | Salle | Caméra | Heure | Fenêtre | Déclencheur | Chance | Effort court | Fenêtre entière | Condition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BONNIE-001 | Backstage | CAM 5 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| RESTO-001 | Backstage | CAM 5 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| CHICA-001 | Restroom | CAM 7 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| CHICA-002 | East Hall Corner | CAM 4B | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| Animatronic-001 | Stage | CAM 1A | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| Freddy-001 | Stage | CAM 1A | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| CHICA-003 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| BONNIE-002 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |

## Nuit 1

| ID | Salle | Caméra | Heure | Fenêtre | Déclencheur | Chance | Effort court | Fenêtre entière | Condition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAB-001 | Dining Area | CAM 1B | 02h00–03h00 | 120 s | Observer | 0.1 | 65 % (10 s sur la caméra) | 100 % |  |
| GAB-002 | Dining Area | CAM 1B | Toute nuit | 720 s | Retour caméra | 0.15 | 56 % (5 passages) | 96 % (20 passages) |  |
| JER-001 | West Hall | CAM 2A | Toute nuit | 720 s | Observer | 0.15 | 80 % (10 s sur la caméra) | 100 % |  |
| JER-003 | Supply Closet | CAM 3 | 03h00–04h00 | 120 s | Observer | 0.1 | 65 % (10 s sur la caméra) | 100 % |  |
| SUS-001 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.15 | 80 % (10 s sur la caméra) | 100 % |  |
| SUS-003 | Kitchen | CAM 6 | 04h00–05h00 | 120 s | Écoute CAM06 | 0.1 | 65 % (10 s sur la caméra) | 100 % |  |
| FRT-001 | Pirate Cove | CAM 1C | Toute nuit | 720 s | Observer 5 s | 0.15 | 80 % (15 s d'affilée) | 100 % |  |
| FRT-002 | Pirate Cove | CAM 1C | 05h00–06h00 | 120 s | Retour caméra | 0.05 | 23 % (5 passages) | 64 % (20 passages) |  |
| CASSIDY-01 | Bureau | bureau | 01h45 | 120 s | Silence | 0.05 | 40 % (18 s sans agir) | 100 % |  |

## Nuit 2

| ID | Salle | Caméra | Heure | Fenêtre | Déclencheur | Chance | Effort court | Fenêtre entière | Condition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAB-003 | Dining Area | CAM 1B | 01h00 | 120 s | Observer 8 s | 0.1 | 65 % (18 s d'affilée) | 100 % |  |
| GAB-004 | Stage | CAM 1A | 03h00 | 120 s | Retour caméra | 0.06 | 27 % (5 passages) | 71 % (20 passages) |  |
| GAB-005 | Dining Area | CAM 1B | 02h00 | 120 s | Observer | 0.12 | 72 % (10 s sur la caméra) | 100 % |  |
| GAB-006 | Bureau | bureau | 02h15 | 120 s | Silence | 0.07 | 52 % (18 s sans agir) | 100 % |  |
| JER-002 | West Hall | CAM 2A | Retour caméra | 720 s | Retour caméra | 0.12 | 47 % (5 passages) | 92 % (20 passages) |  |
| JER-004 | Stage | CAM 1A | 02h00 | 120 s | Observer 8s | 0.07 | 52 % (18 s d'affilée) | 100 % |  |
| JER-006 | Supply Closet | CAM 3 | Toute nuit | 720 s | Silence | 0.09 | 61 % (18 s sans agir) | 100 % |  |
| SUS-002 | Dining Area | CAM 1B | 01h00 | 120 s | Retour caméra | 0.1 | 41 % (5 passages) | 88 % (20 passages) |  |
| SUS-011 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.08 | 57 % (10 s sur la caméra) | 100 % |  |
| SUS-012 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.07 | 52 % (10 s sur la caméra) | 100 % |  |
| FRT-003 | Pirate Cove | CAM 1C | Toute nuit | 720 s | Retour caméra | 0.12 | 47 % (5 passages) | 92 % (20 passages) |  |
| FRT-006 | Bureau | bureau | 02h20 | 120 s | Silence | 0.07 | 52 % (18 s sans agir) | 100 % |  |
| FRT-011 | West Hall | CAM 2A | Toute nuit | 720 s | Observer | 0.08 | 57 % (10 s sur la caméra) | 100 % |  |
| CASSIDY-02 | Bureau | bureau | 04h30 | 120 s | Silence | 0.05 | 40 % (18 s sans agir) | 100 % |  |

## Nuit 3

| ID | Salle | Caméra | Heure | Fenêtre | Déclencheur | Chance | Effort court | Fenêtre entière | Condition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| JER-008 | Supply Closet | CAM 3 | 01h00 | 120 s | Observer | 0.06 | 46 % (10 s sur la caméra) | 100 % |  |
| SUS-006 | East Hall | CAM 4A | 01h30 | 120 s | Observer | 0.06 | 46 % (10 s sur la caméra) | 100 % |  |
| FRT-004 | Pirate Cove | CAM 1C | 01h45 | 120 s | Observer | 0.06 | 46 % (10 s sur la caméra) | 100 % |  |
| GAB-007 | Dining Area | CAM 1B | 00h00 | 120 s | Observer | 0.09 | 61 % (10 s sur la caméra) | 100 % |  |
| JER-026 | Backstage | CAM 5 | 01h30 | 120 s | Observer 8s | 0.08 | 57 % (18 s d'affilée) | 100 % |  |
| SUS-026 | Restroom | CAM 7 | 02h00 | 120 s | Retour caméra | 0.06 | 27 % (5 passages) | 71 % (20 passages) |  |
| FRT-021 | Pirate Cove | CAM 1C | 02h30 | 120 s | Observer 8 s | 0.06 | 46 % (18 s d'affilée) | 100 % |  |
| JER-027 | Backstage | CAM 5 | 02h30 | 120 s | Observer 8s | 0.07 | 52 % (18 s d'affilée) | 100 % |  |
| FRT-007 | Pirate Cove | CAM 1C | 03h00 | 120 s | Observer 10 s | 0.04 | 34 % (20 s d'affilée) | 99 % |  |
| FRT-022 | Pirate Cove | CAM 1C | 03h00 | 120 s | Observer 8 s | 0.05 | 40 % (18 s d'affilée) | 100 % |  |
| SUS-004 | Kitchen | CAM 6 | 03h00 | 120 s | Écoute 10 s | 0.04 | 34 % (20 s d'affilée) | 99 % |  |
| JER-005 | West Hall | CAM 2A | 03h00 | 120 s | Retour caméra | 0.06 | 27 % (5 passages) | 71 % (20 passages) |  |
| GAB-008 | Dining Area | CAM 1B | 04h00 | 120 s | Retour caméra | 0.05 | 23 % (5 passages) | 64 % (20 passages) | après GAB-007 |
| FRT-016 | West Hall | CAM 2A | Retour caméra | 720 s | Retour caméra | 0.06 | 27 % (5 passages) | 71 % (20 passages) |  |
| SUS-016 | Dining Area | CAM 1B | Retour caméra | 720 s | Retour caméra | 0.06 | 27 % (5 passages) | 71 % (20 passages) |  |
| FRT-005 | Pirate Cove | CAM 1C | Toute nuit | 720 s | Observer | 0.09 | 61 % (10 s sur la caméra) | 100 % |  |
| FRT-008 | Pirate Cove | CAM 1C | Toute nuit | 720 s | Observer | 0.06 | 46 % (10 s sur la caméra) | 100 % |  |
| FRT-012 | Pirate Cove | CAM 1C | Toute nuit | 720 s | Observer | 0.07 | 52 % (10 s sur la caméra) | 100 % |  |
| FRT-013 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.06 | 46 % (10 s sur la caméra) | 100 % |  |
| FRT-014 | West Hall | CAM 2A | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| GAB-021 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.08 | 57 % (10 s sur la caméra) | 100 % |  |
| JER-021 | West Hall | CAM 2A | Toute nuit | 720 s | Observer | 0.1 | 65 % (10 s sur la caméra) | 100 % |  |
| JER-022 | West Hall | CAM 2A | Toute nuit | 720 s | Observer | 0.08 | 57 % (10 s sur la caméra) | 100 % |  |
| SUS-017 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| SUS-021 | Kitchen | CAM 6 | Toute nuit | 720 s | Écoute | 0.06 | 46 % (10 s sur la caméra) | 100 % |  |
| SUS-022 | Kitchen | CAM 6 | Toute nuit | 720 s | Écoute | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| GAB-009 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.08 | 57 % (10 s sur la caméra) | 100 % |  |
| GAB-010 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.06 | 46 % (10 s sur la caméra) | 100 % |  |
| GAB-011 | Dining Area | CAM 1B | Toute nuit | 720 s | Retour caméra | 0.06 | 27 % (5 passages) | 71 % (20 passages) |  |
| JER-007 | Supply Closet | CAM 3 | Toute nuit | 720 s | Observer | 0.08 | 57 % (10 s sur la caméra) | 100 % |  |
| SUS-005 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.07 | 52 % (10 s sur la caméra) | 100 % |  |
| SUS-013 | Restroom | CAM 7 | Toute nuit | 720 s | Observer | 0.06 | 46 % (10 s sur la caméra) | 100 % |  |
| SUS-014 | Restroom | CAM 7 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| CASSIDY-03 | Bureau | bureau | 02h00 | 120 s | Silence | 0.05 | 40 % (18 s sans agir) | 100 % |  |
| CASSIDY-08 | Kitchen | CAM 6 | Toute nuit | 720 s | Écoute | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |

## Nuit 4

| ID | Salle | Caméra | Heure | Fenêtre | Déclencheur | Chance | Effort court | Fenêtre entière | Condition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| JER-028 | Backstage | CAM 5 | 01h00 | 120 s | Retour caméra | 0.06 | 27 % (5 passages) | 71 % (20 passages) |  |
| GAB-012 | Dining Area | CAM 1B | 02h00 | 120 s | Retour caméra | 0.05 | 23 % (5 passages) | 64 % (20 passages) |  |
| FRT-023 | Pirate Cove | CAM 1C | 02h30 | 120 s | Observer 8 s | 0.05 | 40 % (18 s d'affilée) | 100 % |  |
| JER-009 | West Hall | CAM 2A | 02h30 | 120 s | Retour caméra | 0.04 | 18 % (5 passages) | 56 % (20 passages) |  |
| SUS-027 | Restroom | CAM 7 | 02h30 | 120 s | Retour caméra | 0.05 | 23 % (5 passages) | 64 % (20 passages) | log LOST_PETS lu (à coder) |
| SUS-007 | Bureau | bureau | 02h45 | 120 s | Silence | 0.03 | 26 % (18 s sans agir) | 97 % |  |
| JER-029 | Backstage | CAM 5 | 03h00 | 120 s | Retour caméra | 0.05 | 23 % (5 passages) | 64 % (20 passages) |  |
| GAB-013 | Dining Area | CAM 1B | 03h00 | 120 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| SUS-028 | Restroom | CAM 7 | 03h00 | 120 s | Observer 10 s | 0.04 | 34 % (20 s d'affilée) | 99 % |  |
| FRT-024 | Pirate Cove | CAM 1C | 03h30 | 120 s | Retour caméra | 0.04 | 18 % (5 passages) | 56 % (20 passages) |  |
| FRT-017 | Dining Area | CAM 1B | Retour caméra | 720 s | Retour caméra | 0.05 | 23 % (5 passages) | 64 % (20 passages) |  |
| FRT-018 | West Hall | CAM 2A | Retour caméra | 720 s | Retour caméra | 0.05 | 23 % (5 passages) | 64 % (20 passages) |  |
| FRT-027 | Pirate Cove | CAM 1C | Retour caméra | 720 s | Retour caméra | 0.05 | 23 % (5 passages) | 64 % (20 passages) |  |
| GAB-022 | Dining Area | CAM 1B | Retour caméra | 720 s | Retour caméra | 0.06 | 27 % (5 passages) | 71 % (20 passages) |  |
| JER-024 | West Hall | CAM 2A | Retour caméra | 720 s | Retour caméra | 0.06 | 27 % (5 passages) | 71 % (20 passages) |  |
| SUS-018 | Dining Area | CAM 1B | Retour caméra | 720 s | Retour caméra | 0.04 | 18 % (5 passages) | 56 % (20 passages) |  |
| SUS-019 | Dining Area | CAM 1B | Retour caméra | 720 s | Retour caméra | 0.04 | 18 % (5 passages) | 56 % (20 passages) |  |
| FRT-009 | West Hall | CAM 2A | Toute nuit | 720 s | Retour caméra | 0.05 | 23 % (5 passages) | 64 % (20 passages) |  |
| FRT-015 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.04 | 34 % (10 s sur la caméra) | 100 % |  |
| FRT-026 | Pirate Cove | CAM 1C | Toute nuit | 720 s | Retour caméra | 0.05 | 23 % (5 passages) | 64 % (20 passages) | log LOST_TOYS lu (à coder) |
| GAB-023 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| JER-011 | Backstage | CAM 5 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| JER-016 | Backstage | CAM 5 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| JER-017 | Backstage | CAM 5 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| JER-018 | Backstage | CAM 5 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| JER-019 | Backstage | CAM 5 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| JER-020 | Backstage | CAM 5 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| JER-023 | West Hall | CAM 2A | Toute nuit | 720 s | Retour caméra | 0.07 | 30 % (5 passages) | 77 % (20 passages) |  |
| SUS-008 | Kitchen | CAM 6 | Toute nuit | 720 s | Retour écoute | 0.05 | 23 % (5 passages) | 64 % (20 passages) |  |
| SUS-015 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| SUS-023 | Kitchen | CAM 6 | Toute nuit | 720 s | Écoute | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| SUS-024 | Kitchen | CAM 6 | Toute nuit | 720 s | Écoute | 0.04 | 34 % (10 s sur la caméra) | 100 % |  |
| GAB-014 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.04 | 34 % (10 s sur la caméra) | 100 % | log BALLOON lu (à coder) |
| JER-010 | Backstage | CAM 5 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| JER-012 | Supply Closet | CAM 3 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| JER-013 | Backstage | CAM 5 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| JER-014 | Backstage | CAM 5 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| JER-015 | Backstage | CAM 5 | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % | log LOST_ART lu (à coder) |
| CASSIDY-04 | Bureau | bureau | 01h15 | 120 s | Silence | 0.05 | 40 % (18 s sans agir) | 100 % |  |
| CASSIDY-09 | Pirate Cove | CAM 1C | Toute nuit | 720 s | Retour caméra | 0.05 | 23 % (5 passages) | 64 % (20 passages) |  |

## Nuit 5

| ID | Salle | Caméra | Heure | Fenêtre | Déclencheur | Chance | Effort court | Fenêtre entière | Condition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FRT-010 | Pirate Cove | CAM 1C | 03h30 | 120 s | Retour caméra | 0.02 | 10 % (5 passages) | 33 % (20 passages) |  |
| SUS-029 | Restroom | CAM 7 | 03h30 | 120 s | Silence | 0.03 | 26 % (18 s sans agir) | 97 % |  |
| FRT-025 | Pirate Cove | CAM 1C | 03h45 | 120 s | Observer 10 s | 0.03 | 26 % (20 s d'affilée) | 96 % |  |
| GAB-024 | Stage | CAM 1A | 04h00 | 120 s | Retour caméra | 0.04 | 18 % (5 passages) | 56 % (20 passages) |  |
| JER-030 | Backstage | CAM 5 | 04h00 | 120 s | Observer 10s | 0.04 | 34 % (20 s d'affilée) | 99 % |  |
| SUS-010 | Stage | CAM 1A | 04h00 | 120 s | Retour caméra | 0.02 | 10 % (5 passages) | 33 % (20 passages) |  |
| SUS-030 | Restroom | CAM 7 | 04h30 | 120 s | Retour caméra | 0.02 | 10 % (5 passages) | 33 % (20 passages) |  |
| GAB-015 | Dining Area | CAM 1B | 05h00 | 120 s | Retour caméra | 0.03 | 14 % (5 passages) | 46 % (20 passages) |  |
| FRT-020 | Pirate Cove | CAM 1C | 05h05–06h00 | 110 s | Heure | 0.03 | automatique | 96 % |  |
| FRT-030 | Pirate Cove | CAM 1C | 05h05–06h00 | 110 s | Heure | 0.02 | automatique | 89 % |  |
| GAB-025 | Dining Area | CAM 1B | 05h05–06h00 | 110 s | Heure | 0.02 | automatique | 89 % |  |
| FRT-019 | Pirate Cove | CAM 1C | Retour caméra | 720 s | Retour caméra | 0.04 | 18 % (5 passages) | 56 % (20 passages) |  |
| FRT-028 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.04 | 34 % (10 s sur la caméra) | 100 % |  |
| FRT-029 | Pirate Cove | CAM 1C | Toute nuit | 720 s | Observer | 0.03 | 26 % (10 s sur la caméra) | 100 % |  |
| JER-025 | West Hall | CAM 2A | Toute nuit | 720 s | Observer | 0.05 | 40 % (10 s sur la caméra) | 100 % |  |
| SUS-009 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.04 | 34 % (10 s sur la caméra) | 100 % |  |
| SUS-020 | Dining Area | CAM 1B | Toute nuit | 720 s | Observer | 0.03 | 26 % (10 s sur la caméra) | 100 % |  |
| SUS-025 | Kitchen | CAM 6 | Toute nuit | 720 s | Silence | 0.03 | 26 % (18 s sans agir) | 100 % |  |
| CASSIDY-05 | Bureau | bureau | 03h15 | 120 s | Silence | 0.05 | 40 % (18 s sans agir) | 100 % |  |
| CASSIDY-06 | Bureau | bureau | 02h30 | 120 s | Silence | 0.05 | 40 % (18 s sans agir) | 100 % |  |
| CASSIDY-07 | Bureau | bureau | Toute nuit | 720 s | Silence | 0.08 | 57 % (18 s sans agir) | 100 % | log MEMORY lu (à coder) |
