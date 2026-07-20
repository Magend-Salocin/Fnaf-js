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

// Utilitaire pour charger les logs depuis la base de données
function loadLogFile(filename) {
    const data = getLog(filename);
    if (!data) {
        console.error(`Log non trouvé: ${filename}`);
        return { text: "ERREUR : LOG NON TROUVÉ", glitch: true };
    }
    return data;
}

LoreCore.registerNight(1, {

    secretPool: ["LOGS", "ARCHIVE", "STAFF", "WHOAMI", "SUDO", "CAMLOG", "LOST","PARTY"],

    //appelé par handleCommand 
    commands: {

        /* ===================== LOGS ===================== */

        LOGS(state, ctx) {
            const data = loadLogFile("LOGS");
            ctx.markFound("LOGS");
            return {
                text: data.text,
                sequence: data.sequence,
                glitch: data.glitch ?? false
            };
        },

        /* ===================== ARCHIVE ===================== */

        ARCHIVE(state, ctx) {
            const data = loadLogFile("ARCHIVE");
            ctx.markFound("ARCHIVE");
            return {
                text: data.text,
                sequence: data.sequence,
                glitch: data.glitch ?? false
            };
        },

        /* ===================== STAFF ===================== */

        STAFF(state, ctx) {
            const data = loadLogFile("STAFF");
            ctx.markFound("STAFF");
            return {
                text: data.text,
                sequence: data.sequence,
                glitch: data.glitch ?? false
            };
        },

        /* ===================== WHOAMI ===================== */

        WHOAMI(state, ctx) {
            const data = loadLogFile("WHOAMI");
            ctx.markFound("WHOAMI");
            return {
                text: data.text,
                sequence: data.sequence,
                glitch: data.glitch ?? false
            };
        },

        /* ===================== SUDO ===================== */

        SUDO(state, ctx) {
            const data = loadLogFile("SUDO");
            ctx.markFound("SUDO");
            return {
                text: data.text,
                sequence: data.sequence,
                glitch: data.glitch ?? false
            };
        },

        /* ===================== CLOSED (TRÈS RARE) ===================== */

        CLOSED(state, ctx) {
            const data = loadLogFile("CLOSED");
            ctx.markFound("CLOSED");
            return {
                sequence: data.sequence,
                glitch: data.glitch ?? false
            };
        },

        /* ===================== LOST_OBJECTS (rare) ===================== */

        LOST_OBJECTS(state, ctx) {
            const data = loadLogFile("LOST_OBJECTS");
            ctx.markFound("LOST_OBJECTS");
            return {
                sequence: data.sequence,
                glitch: data.glitch ?? false
            };
        },

        /* ===================== BALLOON (rare) ===================== */

        BALLOON(state, ctx) {
            const data = loadLogFile("BALLOON");
            ctx.markFound("BALLOON");
            return {
                sequence: data.sequence,
                glitch: data.glitch ?? false
            };
        },
        /* ===================== TABLES (rare) ===================== */

        TABLES(state, ctx) {
            const data = loadLogFile("TABLES");
            ctx.markFound("TABLES");
            return {
                sequence: data.sequence,
                glitch: data.glitch ?? false
            };
        },


        /* ===================== GUESTS (rare) ===================== */

        GUESTS(state, ctx) {
            const data = loadLogFile("GUESTS");
            ctx.markFound("GUESTS");
            return {
                sequence: data.sequence,
                glitch: data.glitch ?? false
            };
        },


        /* ===================== PARTY (rare) ===================== */

        PARTY(state, ctx) {
            const data = loadLogFile("PARTY");
            ctx.markFound("PARTY");
            return {
                sequence: data.sequence,
                glitch: data.glitch ?? false
            };
        },

        /* ===================== CAMLOG (rare) ===================== */

        CAMLOG(state, ctx) {
            const data = loadLogFile("CAMLOG");
            ctx.markFound("CAMLOG");
            return {
                sequence: data.sequence,
                glitch: data.glitch ?? false
            };
        },

        /* ===================== LOST001 (déverrouillé par event) ===================== */

        LOST001(state, ctx) {
            const data = loadLogFile("LOST001");
            ctx.markFound("LOST001");
            return {
                text: data.text,
                sequence: data.sequence,
                glitch: data.glitch ?? false
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

            const data = loadLogFile("LOST");
            ctx.markFound("LOST");
            return {
                text: data.text,
                sequence: data.sequence,
                glitch: data.glitch ?? false
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
