/* ============================================================
   LORE CORE — Moteur partagé pour toutes les nuits

   Chaque nuit s'enregistre via LoreCore.registerNight(n, config)
   dans un fichier séparé (lore_night1.js, lore_night2.js, ...).

   config = {
       commands: {
           NOM_COMMANDE(state, ctx) { return resultat },
           ...
       },
       secretPool: ["LOGS", "ARCHIVE", ...],   // pour les indices de HELP
       idleEvent(state, ctx) { return sequence | null },  // 1% ambiant
   }

   ctx fournit : getCurrentHour(), markFound(id), isFound(id), random()
   ============================================================ */

const LoreCore = (() => {

    const STORAGE_KEY = "fnaf_lore_progress_v2";

    const nights = {};

    /* ---------------------------------------------------------
       ÉTAT / SAUVEGARDE
       --------------------------------------------------------- */

    const defaultState = () => ({
        found: [],
        attempts: {}
    });

    let state = loadState();

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultState();
            return Object.assign(defaultState(), JSON.parse(raw));
        } catch (e) {
            return defaultState();
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            /* stockage indisponible : on continue en mémoire seulement */
        }
    }

    function markFound(id) {
        if (!state.found.includes(id)) {
            state.found.push(id);
            saveState();
        }
    }

    function isFound(id) {
        return state.found.includes(id);
    }

    function bumpAttempts(id) {
        state.attempts[id] = (state.attempts[id] || 0) + 1;
        saveState();
        return state.attempts[id];
    }

    function getAttempts(id) {
        return state.attempts[id] || 0;
    }

    function resetProgress() {
        state = defaultState();
        saveState();
    }

    /* ---------------------------------------------------------
       NUIT / HEURE ACTUELLES
       Adapte ces deux fonctions à tes vraies variables de jeu.
       --------------------------------------------------------- */

    function getCurrentNight() {
        // _night (script/state/game_state.js) est la variable réellement
        // maintenue à jour par startNight()/endGameAt6AM() (cf. night.js).
        if (typeof _night === "number") return _night;
        if (typeof currentNight !== "undefined" && currentNight) {
            if (typeof currentNight.nightNumber === "number") return currentNight.nightNumber;
        }
        if (typeof gameTime !== "undefined" && gameTime && typeof gameTime.night === "number") {
            return gameTime.night;
        }
        if (typeof window !== "undefined" && typeof window.currentNightNumber === "number") {
            return window.currentNightNumber;
        }
        return 1;
    }

    function getCurrentHour() {
        if (typeof gameTime !== "undefined" && gameTime && typeof gameTime.hours === "number") {
            return gameTime.hours;
        }
        if (typeof window !== "undefined" && typeof window.currentGameHour === "number") {
            return window.currentGameHour;
        }
        return 0;
    }

    /* ---------------------------------------------------------
       ENREGISTREMENT DES NUITS
       --------------------------------------------------------- */

    function registerNight(number, config) {
        nights[number] = config;
    }

    const ctx = {
        getCurrentHour,
        getCurrentNight,
        markFound,
        isFound,
        bumpAttempts,
        getAttempts,
        random: () => Math.random()
    };

    /* ---------------------------------------------------------
       HELP — liste publique + indice aléatoire selon l'heure
       Plus la nuit avance, plus le système "laisse fuiter" un
       indice sur une commande cachée pas encore trouvée.
       --------------------------------------------------------- */

    function buildHelp() {

        const night = getCurrentNight();
        const hour = getCurrentHour();
        const config = nights[night];

        const baseLines = [
            "COMMANDES DISPONIBLES :",
            "STATUS, CAMERAS, DOORS, POWER"
        ];

        if (!config || !config.secretPool || config.secretPool.length === 0) {
            return { text: baseLines.join("\n"), glitch: false };
        }

        const candidates = config.secretPool.filter(c => !isFound(c));

        if (candidates.length === 0) {
            return { text: baseLines.join("\n"), glitch: false };
        }

        const chance = Math.min(0.12 + hour * 0.05, 0.85);

        if (Math.random() > chance) {
            return { text: baseLines.join("\n"), glitch: false };
        }

        const hint = candidates[Math.floor(Math.random() * candidates.length)];

        return {
            text:
                baseLines.join("\n") +
                `\n\n[SIGNAL RÉSIDUEL DÉTECTÉ]\n"${hint}" ?`,
            glitch: true
        };
    }

    /* ---------------------------------------------------------
       COMMANDE GÉNÉRIQUE — pilotée par ressources/logs/<CMD>.json
       ---------------------------------------------------------
       Toute commande présente dans LOG_FILES (script/config/
       logs_database.json) fonctionne de la même façon quelle que soit
       la nuit, sans avoir besoin d'un handler dédié par nuit : le
       fichier JSON porte lui-même son comportement (verrou horaire,
       nom de marquage, texte ou séquence animée), au même format que
       documenté dans .github/Projet/_editor_log/README.md.
       --------------------------------------------------------- */

    function runGenericLogCommand(cmd) {
        const data = getLog(cmd);

        if (!data) {
            return { text: "ERREUR : LOG NON TROUVÉ", glitch: true };
        }

        if (typeof data.minHour === "number" && getCurrentHour() < data.minHour) {
            return {
                text: data.beforeHour?.text || "AUCUNE DONNÉE DISPONIBLE POUR L'INSTANT.",
                glitch: data.beforeHour?.glitch ?? false
            };
        }

        if (data.markFound !== false) {
            markFound(typeof data.markFound === "string" ? data.markFound : cmd);
        }

        return {
            text: data.text,
            sequence: data.steps,
            glitch: data.glitch ?? false
        };
    }

    /* ---------------------------------------------------------
       DISPATCH
       --------------------------------------------------------- */

    function handleCommand(rawInput) {

        const cmd = (rawInput || "").trim().toUpperCase();

        if (cmd === "") return null;

        if (cmd === "HELP") {
            return buildHelp();
        }

        const randomEventTerminalCommand =
            typeof RANDOM_EVENTS !== "undefined" &&
            Object.values(RANDOM_EVENTS).some(event =>
                typeof event.terminal === "string" &&
                event.terminal.toUpperCase() === cmd
            );

        if (
            randomEventTerminalCommand &&
            typeof RandomEvents !== "undefined" &&
            typeof RandomEvents.isTerminalCommandUnlocked === "function" &&
            !RandomEvents.isTerminalCommandUnlocked(cmd)
        ) {
            return {
                text: "ACCES REFUSE. COMMANDE NON DEVERROUILLEE.",
                glitch: false
            };
        }

        const night = getCurrentNight();
        const config = nights[night];

        // 1. Comportement spécifique à cette nuit, s'il en existe un
        //    (ex: contenu narratif propre à une nuit donnée).
        if (config && config.commands && config.commands[cmd]) {
            return config.commands[cmd](state, ctx);
        }

        // 2. Repli générique : fonctionne pour n'importe quelle nuit,
        //    y compris celles qui n'ont pas (encore) de fichier
        //    lore_nightN.js dédié.
        if (typeof LOG_FILES !== "undefined" && LOG_FILES.includes(cmd)) {
            return runGenericLogCommand(cmd);
        }

        return { text: "COMMANDE INCONNUE. Tapez HELP.", glitch: false };
    }

    /* ---------------------------------------------------------
       ÉVÉNEMENT AMBIANT — branché sur RetroTerminal.shell({idleEvent})
       --------------------------------------------------------- */

    function idleEvent() {

        const night = getCurrentNight();
        const config = nights[night];

        if (!config || typeof config.idleEvent !== "function") {
            return null;
        }

        return config.idleEvent(state, ctx);
    }

    return {
        registerNight,
        handleCommand,
        idleEvent,
        getCurrentNight,
        getCurrentHour,
        resetProgress,
        markFound,
        isFound,
        get state() { return state; }
    };

})();
