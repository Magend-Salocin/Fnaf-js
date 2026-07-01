/* ============================================================
   LORE CORE — Moteur partagé pour toutes les nuits

   Chaque nuit s'enregistre via LoreCore.registerNight(n, config)
   dans un fichier séparé (lore-night1.js, lore-night2.js, ...).

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
        if (typeof currentNight !== "undefined" && currentNight) {
            if (typeof currentNight.number === "number") return currentNight.number;
            if (typeof currentNight.night === "number") return currentNight.night;
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

        if (!config || !config.commands || !config.commands[cmd]) {
            return { text: "COMMANDE INCONNUE. Tapez HELP.", glitch: false };
        }

        return config.commands[cmd](state, ctx);
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
