# Événements : contrôle

Incohérences entre les données et le plan. Gravités : Critique (ne peut pas marcher), À décider (arbitrage nécessaire), Migration (passage au modèle des réserves), Problème (donnée à corriger).

Vue générée le 18/11/2026 par `node tools/vues_evenements.js` à partir des JSON de `script/config/`. Ne pas éditer : modifier le JSON, puis relancer le script.

| Gravité | Sujet | Éléments | Action |
| --- | --- | --- | --- |
| Problème | Images dans le dossier d'une autre salle | JER-021, JER-023, JER-025 | Refaire l'image dans la salle de l'événement (voir Evenements_Production.md) |
| Migration | Anciens champs de récompense à vider | GAB-001, GAB-002, JER-001, JER-003, SUS-001, SUS-003, FRT-001, FRT-002, GAB-005, JER-002, SUS-012, FRT-011, JER-008, GAB-007, FRT-021, FRT-014, GAB-021, JER-007, SUS-014, GAB-012, SUS-024, GAB-024, FRT-028, JER-025, SUS-025, CASSIDY-01, CASSIDY-02, CASSIDY-03, CASSIDY-04, CASSIDY-05, CASSIDY-06 | Modèle des réserves : seuls les événements de fin de chaîne gardent tape. À faire avec le code des réserves |
| Migration | Logs de révélation sans minNight | ARCHIVE, CAMLOG, CLEANING, CLOSED, DELETE, DRAWINGS, GUESTS, KITCHEN, LOGS, LOST, LOST001, LOST_OBJECTS, PARTY, PETS, RECOVER, REPORT_89, ROOT, STAFF, SUDO, TABLES, TOYS, USER, WHOAMI | Ajouter minNight (nuit indiquée dans Parcours_Enquete.md, section 3) |
| Problème | Événements sans description | BONNIE-001, RESTO-001, CHICA-001, CHICA-002, Animatronic-001, Freddy-001, CHICA-003, BONNIE-002 | Décrire l'image dans description et lore |

Images et sons à produire : voir [Evenements_Production.md](Evenements_Production.md).
