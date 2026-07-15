/* ============================================================
   LORE — NUIT 1 : "LES MENSONGES"

   Thème : la direction cache quelque chose, le joueur l'ignore
   encore. Aucune mention d'enfants disparus à ce stade — tout
   doit rester ambigu, administratif en apparence.

   Ce que le joueur doit ressentir à la fin de cette nuit :
     - il existe un été 1989 mystérieux
     - un ancien gardien a disparu
     - plusieurs objets d'enfants sont restés sur place
     - les archives semblent modifiées
     - (il ne sait PAS encore qu'il y a eu des disparitions)
   ============================================================ */

LoreCore.registerNight(1, {

    secretPool: ["LOGS", "ARCHIVE", "STAFF", "WHOAMI", "SUDO", "CAMLOG", "LOST","PARTY"],

    //appelé par handleCommand 
    commands: {

        /* ===================== LOGS ===================== */

        LOGS(state, ctx) {

            ctx.markFound("LOGS");

            return {
                text:
`RAPPORT D'INCIDENTS

--------------------------------

INCIDENT #03

Date :
12 avril 1989

Objet perdu :
Peluche ours

Réclamé :
NON

Le propriétaire n'est jamais revenu.

Dossier classé.

--------------------------------

INCIDENT #05

Date :
18 avril 1989

Objet perdu :
Chaussure enfant

Réclamé :
NON

Dossier classé.`,
                glitch: false
            };
        },

        /* ===================== ARCHIVE ===================== */

        ARCHIVE(state, ctx) {

            ctx.markFound("ARCHIVE");

            return {
                text:
`ARCHIVES FESTIVITÉS

--------------------------------

12 AVRIL 1989

Anniversaire privé

47 invités enregistrés
47 départs enregistrés

Aucune anomalie signalée.

--------------------------------

21 AVRIL 1989

Anniversaire privé

32 invités enregistrés
32 départs enregistrés

Aucune anomalie signalée.`,
                glitch: false
            };
        },

        /* ===================== STAFF ===================== */

        STAFF(state, ctx) {

            ctx.markFound("STAFF");

            return {
                text:
`PERSONNEL AUTORISÉ

--------------------------------

Pierre D.
Service

Marie L.
Cuisine

Antoine M.
Sécurité

--------------------------------

NOTE INTERNE

Ne jamais discuter des
événements de l'été 1989
devant les clients.

Direction.`,
                glitch: false
            };
        },

        /* ===================== WHOAMI ===================== */

        WHOAMI(state, ctx) {

            ctx.markFound("WHOAMI");

            return {
                text:
`UTILISATEUR ACTUEL

Nom :
[NON DISPONIBLE]

Poste :
Veilleur de nuit

--------------------------------

UTILISATEUR PRÉCÉDENT

Nom :
[NON DISPONIBLE]

Poste :
Veilleur de nuit

Date de départ :
Inconnue

Motif :
Absence non justifiée.`,
                glitch: false
            };
        },

        /* ===================== SUDO ===================== */

        SUDO(state, ctx) {

            ctx.markFound("SUDO");

            return {
                text:
`AUTORISATION REFUSÉE

Dernier administrateur :
[SUPPRIMÉ]

Dernière connexion :
1247 jours`,
                glitch: false
            };
        },

/* ===================== CLOSED (TRÈS RARE) ===================== */

CLOSED(state, ctx) {

    ctx.markFound("CLOSED");

    return {
        sequence: [

            {
                text:
`
╔══════════════════════════════════════════════════════════════╗
║             PROCÉDURE DE FERMETURE                          ║
╚══════════════════════════════════════════════════════════════╝

Nettoyage ............. OK

Extinction lumières ... OK

Cuisine ............... OK

Animatroniques ........ OK

Invités ............... OK

--------------------------------------------------------------

Analyse du bâtiment...
`,
                delay: 0
            },

            {
                text:
`
Analyse du bâtiment...

Vérification des accès...

`,
                delay: 2500
            },

            {
                text:
`
Analyse du bâtiment...

Vérification des accès...

Contrôle des salles...

`,
                delay: 2500
            },

            {
                text:
`
Analyse du bâtiment...

Vérification des accès...

Contrôle des salles...

Recherche des occupants...

`,
                delay: 3000
            },

            {
                text:
`
Analyse terminée.

...
`,
                delay: 3500
            },

            {
                text:
`
Analyse terminée.

ERREUR
`,
                delay: 2000,
                glitch: true
            },

            {
                text:
`
Analyse terminée.

ERREUR

1 enfant est toujours
présent dans le bâtiment.
`,
                delay: 2800,
                glitch: true,
                flash: true,
                flashDuration: 600
            },

            {
                text:
`
Impossible de fermer
le restaurant.

Nouvelle tentative...
`,
                delay: 3500,
                glitch: true
            },

            {
                text:
`
Impossible de fermer
le restaurant.

Nouvelle tentative...

Nouvelle tentative...
`,
                delay: 2500,
                glitch: true,
                flash: true,
                flashDuration: 800
            },

            {
                text:
`
Impossible de fermer
le restaurant.

Nouvelle tentative...

Nouvelle tentative...

Nouvelle tentative...
`,
                delay: 2500,
                glitch: true
            },

            {
                text:
`
Impossible de fermer
le restaurant.

Nouvelle tentative...

Nouvelle tentative...

Nouvelle tentative...

ÉCHEC.
`,
                delay: 2500,
                glitch: true,
                flash: true,
                flashDuration: 1200
            },

            {
                text:
`
Le restaurant reste ouvert.

En attente...

█
`,
                delay: 4000,
                glitch: true
            }

        ]
    };
},

/* ===================== LOST_OBJECTS (rare) ===================== */

        
        LOST_OBJECTS(state, ctx) {

            ctx.markFound("LOST_OBJECTS");

            return {
                sequence: [
                    {
                        text:
`
╔══════════════════════════════════════════════════════════════╗
║                OBJETS TROUVÉS                               ║
╚══════════════════════════════════════════════════════════════╝
N°      OBJET               STATUT

442     Veste bleue         RENDUE

443     Voiture             RENDUE

444     Sac à dos           RENDU

445     Casquette           EN ATTENTE

--------------------------------------------------------------

PROPRIÉTAIRE :      INCONNU
TEMPS D'ATTENTE :   4018 jours
Statut :            Personne n'est revenu.
--------------------------------------------------------------
`,
                        delay: 0
                    },
                    {
                        text: `PARTY`,
                        delay: 9200,
                        glitch: true,
                        flash: true,
                        flashDuration: 2000
                    },
                   
                ]
            };
        },

        /* ===================== BALLOON (rare) ===================== */

        
        BALLOON(state, ctx) {

            ctx.markFound("BALLOON");

            return {
                sequence: [
                    {
                        text:
`
╔══════════════════════════════════════════════════════════════╗
║               INVENTAIRE DÉCORATION                         ║
╚══════════════════════════════════════════════════════════════╝

ROUGE      ████████████████████ 37

BLEU       ███████████████████████ 42

VERT       █████████ 18

JAUNE      █ 1
`,
                        delay: 0
                    },
                    {
                        text: `
Objet détecté : BALLON JAUNE
Position :      SALLE PRINCIPALE
Aucune demandede décoration enregistrée.
 `,
                        delay: 9200,
                        glitch: true,
                        flash: true,
                        flashDuration: 2000
                    },
                   
                ]
            };
        },
                 /* ===================== TABLES (rare) ===================== */

        
        TABLES(state, ctx) {

            ctx.markFound("TABLES");

            return {
                sequence: [
                    {
                        text:
`
╔══════════════════════════════════════════════════════════════╗
║                PLAN DE LA SALLE                             ║
╚══════════════════════════════════════════════════════════════╝

            TABLE ANNIVERSAIRE

          ○────○────○

          │          │

          ○────○────○

                 ▲
             CHAISE DÉPLACÉE

--------------------------------------------------------------

Dernière vérification :     26/06

Signalement maintenance :   AUCUN


`,
                        delay: 0
                    },
                    {
                        text: `
Temps écoulé :  11 ans
 `,
                        delay: 9200,
                        glitch: true,
                        flash: true,
                        flashDuration: 2000
                    },
                   
                ]
            };
        },


         /* ===================== GUESTS (rare) ===================== */

        
        GUESTS(state, ctx) {

            ctx.markFound("GUESTS");

            return {
                sequence: [
                    {
                        text:
`

> OUVERTURE DU Réservation 26/06 GUESTS.LOG...

Analyse de la réservation...

✓ Jeremy

✓ Susie

✓ Fritz

✓ Gabriel
--------------------------------------------------------------
INVITÉS PRÉVUS ......... 4

INVITÉS PRÉSENTS ....... 4
--------------------------------------------------------------
`,
                        delay: 0
                    },
                    {
                        text: `
ERREUR

□ ???????? 

Une réservation est incomplète.

Le système attend toujours
le dernier invité.

 `,
                        delay: 9200,
                        glitch: true,
                        flash: true,
                        flashDuration: 2000
                    },
                   
                ]
            };
        },


        /* ===================== PARTY (rare) ===================== */

        
        PARTY(state, ctx) {

            ctx.markFound("PARTY");

            return {
                sequence: [
                    {
                        text:
`

> OUVERTURE DU FICHIER PARTY.LOG...

--------------------------------------------------------------

DATE      TYPE          INV.   Âge  STATUT
--------------------------------------------------------------

04/06     ANNIVERSAIRE   11    6 ANS  TERMINÉ

09/06     ANNIVERSAIRE   15    8 ANS  TERMINÉ

26/06     ANNIVERSAIRE    4    7 ANS  TERMINÉ

--------------------------------------------------------------
`,
                        delay: 0
                    },
                    {
                        text: `
ERREUR
26/06     ANNIVERSAIRE    5    7 ANS  INTERROMPU`,
                        delay: 9200,
                        glitch: true,
                        flash: true,
                        flashDuration: 2000
                    },
                   
                ]
            };
        },

        /* ===================== CAMLOG (rare) ===================== */

        
        CAMLOG(state, ctx) {

            ctx.markFound("CAMLOG");

            return {
                sequence: [
                    {
                        text:
`CAMÉRA 03

Archive disponible.

Date :
18 avril 1989

Heure :
18h41`,
                        delay: 0
                    },
                    {
                        text: "FICHIER CORROMPU",
                        delay: 1200,
                        glitch: true
                    },
                    {
                        text: "1 personne détectée",
                        delay: 900,
                        glitch: true,
                        flash: true,
                        flashDuration: 1000
                    }
                ]
            };
        },

        /* ===================== LOST001 (déverrouillé par event) ===================== */

        LOST001(state, ctx) {

            ctx.markFound("LOST001");

            return {
                text:
`DOSSIER OBJET PERDU : LOST001

--------------------------------

Objet :
Chaise enfant (zone repas)

Statut :
Déplacée puis retrouvée.

Réclamation :
Aucune

--------------------------------

Annotation sécurité :
"Mouvement non expliqué."
`,
                glitch: false
            };
        },

        /* ===================== LOST (fin de nuit seulement) ===================== */

        LOST(state, ctx) {

            const hour = ctx.getCurrentHour();

            if (hour < 5) {
                return {
                    text: "AUCUNE DONNÉE DISPONIBLE AVANT LA FERMETURE.",
                    glitch: false
                };
            }

            ctx.markFound("LOST");

            return {
                text:
`OBJETS TROUVÉS

--------------------------------

Ballon bleu

Peluche ours

Casquette rouge

Bracelet rose

--------------------------------

En attente de récupération.`,
                glitch: false
            };
        }
    },

    /* ---------------------------------------------------------
       ÉVÉNEMENT AMBIANT — 1% de chance par vérification
       Se déclenche seul, sans commande tapée, tant que le
       terminal est ouvert.
       --------------------------------------------------------- */

    idleEvent(state, ctx) {

        if (ctx.random() > 0.01) return null;

        return [
            { text: "Connexion perdue...", delay: 0, glitch: true },
            { text: "Recherche...", delay: 900 },
            { text: "Recherche...", delay: 900 },
            { text: "Recherche...", delay: 900 }
        ];
    }
});

/* ---------------------------------------------------------
   FIN DE NUIT 1 — à appeler depuis ton code de transition
   jour/nuit quand l'horloge atteint 6h00.

   Exemple d'utilisation dans ton jeu :

       if (gameTime.hours === 6 && gameTime.minutes === 0) {
           playNight1Ending(() => startDayTransition());
       }
   --------------------------------------------------------- */

function playNight1Ending(onComplete) {

    RetroTerminal.endOfNightGlitch({
        initialLines: [
            "FIN DE SERVICE",
            "Aucune anomalie détectée."
        ],
        holdBeforeMorph: 2500,
        morphLineIndex: 1,
        morphTo: "1 anomalie détectée.",
        holdAfterMorph: 1200,
        thenText: "ERREUR",
        holdThenText: 1500,
        holdBlack: 1000,
        onComplete
    });
}
