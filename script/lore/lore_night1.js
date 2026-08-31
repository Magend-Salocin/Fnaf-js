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

    secretPool: ["LOGS", "ARCHIVE", "STAFF", "WHOAMI", "SUDO", "CAMLOG", "LOST", "PARTY"],

    // Toutes les commandes de cette nuit (LOGS, ARCHIVE, STAFF, WHOAMI,
    // SUDO, CLOSED, LOST_OBJECTS, BALLOON, TABLES, GUESTS, PARTY, CAMLOG,
    // LOST001, LOST...) sont gérées génériquement par LoreCore à partir
    // de ressources/logs/<CMD>.json — voir runGenericLogCommand() dans
    // lore_core.js. Cette nuit n'a donc pas besoin de son propre bloc
    // `commands` ; seuls secretPool et idleEvent lui sont spécifiques.

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
