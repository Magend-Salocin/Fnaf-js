/* ============================================================
   LORE SECRETS — Configuration narrative cachée
   Arc : "Les enfants disparus"

   Principe : chaque commande a plusieurs PALIERS. Le palier
   affiché dépend de la nuit en cours et de certaines conditions
   (flags débloqués par d'autres commandes, nombre de tentatives).

   Ce fichier ne touche à rien d'autre : il expose juste
   `LoreSecrets.handleCommand(raw)` que le terminal shell appelle.
   ============================================================ */

const LoreSecrets = (() => {

    const STORAGE_KEY = "fnaf_lore_progress_v1";

    /* ---------------------------------------------------------
       ÉTAT / SAUVEGARDE
       --------------------------------------------------------- */

    const defaultState = () => ({
        found: [],              // ids de secrets déjà découverts au moins une fois
        lucasAttempts: 0,        // nombre de fois où "LUCAS" a été tapé
        employee17Stage: 0,      // 0..4, progression du dossier Antoine Mercier
        guestsStage: 0,          // 0..1
        reportStage: 0,          // 0..1
        pressStage: 0,           // 0..2
        rootUnlocked: false,
        rootSeen: false
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

    function resetProgress() {
        state = defaultState();
        saveState();
    }

    /* ---------------------------------------------------------
       NUIT ACTUELLE
       Adapte cette fonction à ta variable de nuit réelle.
       Essaie plusieurs sources connues, sinon nuit 1 par défaut.
       --------------------------------------------------------- */

    function getCurrentNight() {
        if (typeof currentNight !== "undefined" && currentNight) {
            if (typeof currentNight.number === "number") return currentNight.number;
            if (typeof currentNight.night === "number") return currentNight.night;
        }
        if (typeof gameTime !== "undefined" && gameTime) {
            if (typeof gameTime.night === "number") return gameTime.night;
        }
        if (typeof window !== "undefined" && typeof window.currentNightNumber === "number") {
            return window.currentNightNumber;
        }
        return 1;
    }

    /* ---------------------------------------------------------
       SEUIL DE DÉBLOCAGE DE ROOT
       Liste des ids "majeurs" requis avant que ROOT s'ouvre.
       --------------------------------------------------------- */

    const ROOT_REQUIRED = [
        "logs", "archive", "staff",
        "guests_2", "report_2",
        "lost", "lucas_full",
        "employee17_4",
        "drawings", "press_3"
    ];

    function isRootReady() {
        return ROOT_REQUIRED.every(id => state.found.includes(id));
    }

    /* ---------------------------------------------------------
       RÉPONSES — chaque commande renvoie { text, secretId, glitch, root }
       glitch = déclenche l'effet visuel/sonore "tu as touché un secret"
       root   = déclenche la séquence finale spéciale
       --------------------------------------------------------- */

    function handleCommand(rawInput) {

        const cmd = (rawInput || "").trim().toUpperCase();
        const night = getCurrentNight();

        if (cmd === "") return null;

        switch (cmd) {

            /* ===================== NUIT 1 ===================== */

            case "LOGS": {
                markFound("logs");
                return {
                    text:
`INCIDENT #03

Objet perdu :
Peluches

Réclamé :
NON

Dossier classé.`,
                    secretId: "logs",
                    glitch: false
                };
            }

            case "ARCHIVE": {
                markFound("archive");
                return {
                    text:
`FÊTE ANNIVERSAIRE
12 AVRIL

47 invités
47 départs enregistrés

Tout semble normal.`,
                    secretId: "archive",
                    glitch: false
                };
            }

            case "STAFF": {
                markFound("staff");
                return {
                    text:
`NOTE INTERNE :

Ne jamais discuter des événements
de l'été 1989 devant les clients.`,
                    secretId: "staff",
                    glitch: false
                };
            }

            /* ===================== NUIT 2 ===================== */

            case "GUESTS": {

                if (night < 2) {
                    return {
                        text:
`FÊTE ANNIVERSAIRE
17 JUIN

31 invités
31 départs enregistrés`,
                        secretId: "guests_1",
                        glitch: false
                    };
                }

                state.guestsStage = 1;
                saveState();
                markFound("guests_2");

                return {
                    text:
`FÊTE ANNIVERSAIRE
21 JUIN

26 invités
25 départs enregistrés

ERREUR DE COMPTAGE`,
                    secretId: "guests_2",
                    glitch: true
                };
            }

            case "REPORT": {

                if (night < 2) {
                    return {
                        text:
`Client recherché.

Dossier clos.

Enfant retrouvé.`,
                        secretId: "report_1",
                        glitch: false
                    };
                }

                markFound("report_2");

                return {
                    text:
`DOSSIER MODIFIÉ
IL Y A 4 ANS`,
                    secretId: "report_2",
                    glitch: true
                };
            }

            /* ===================== NUIT 3 ===================== */

            case "LOST": {

                if (night < 3) {
                    return { text: "ACCÈS REFUSÉ.", secretId: null, glitch: false };
                }

                markFound("lost");

                return {
                    text:
`OBJETS PERDUS

Casquette rouge
Ballon bleu

Dessins d'enfant

Nom inscrit :
LUCAS`,
                    secretId: "lost",
                    glitch: false
                };
            }

            case "LUCAS": {

                if (night < 3) {
                    return { text: "AUCUNE DONNÉE DISPONIBLE", secretId: null, glitch: false };
                }

                state.lucasAttempts += 1;
                saveState();

                if (state.lucasAttempts < 3) {
                    return {
                        text: "AUCUNE DONNÉE DISPONIBLE",
                        secretId: null,
                        glitch: false
                    };
                }

                /* Palier avancé débloqué seulement après EMPLOYEE_17 complet */
                if (state.employee17Stage >= 4) {

                    markFound("lucas_full");

                    return {
                        text:
`DOSSIER RETROUVÉ

Prénom :
Lucas

Âge :
7 ans

Dernière visite :
21 juin

DOSSIER LIÉ :
EMPLOYEE_17

----------------------------------------

RAPPORT PERSONNEL

L'enfant ne voulait pas partir.
Il répétait toujours :

"Papa va revenir."`,
                        secretId: "lucas_full",
                        glitch: true
                    };
                }

                markFound("lucas_base");

                return {
                    text:
`DOSSIER RETROUVÉ

Prénom :
Lucas

Âge :
7 ans

Dernière visite :
21 juin

Dossier interrompu.`,
                    secretId: "lucas_base",
                    glitch: true
                };
            }

            /* ================ NUIT 4-5 : LE GARDIEN ================ */

            case "EMPLOYEE_17": {

                if (night < 4) {
                    return { text: "ACCÈS REFUSÉ — NIVEAU INSUFFISANT", secretId: null, glitch: false };
                }

                state.employee17Stage = Math.min(state.employee17Stage + 1, 4);
                saveState();

                const stages = [
                    null,
`DOSSIER RETROUVÉ

Nom :
Antoine Mercier

Poste :
Gardien de nuit`,
`NOTES PERSONNELLES :

Je les entends.`,
`NOTES PERSONNELLES :

Je les entends
dans les conduits.`,
`NOTES PERSONNELLES :

Je crois qu'ils cherchent
leurs parents.`
                ];

                const stageIndex = state.employee17Stage;
                markFound(`employee17_${stageIndex}`);

                return {
                    text: stages[stageIndex],
                    secretId: `employee17_${stageIndex}`,
                    glitch: stageIndex >= 2
                };
            }

            /* ================ NUIT 6+ : LES ENFANTS ================ */

            case "DRAWINGS": {

                if (night < 6) {
                    return { text: "ACCÈS REFUSÉ", secretId: null, glitch: false };
                }

                markFound("drawings");

                return {
                    text:
`Lucas
Emma
Noah
Sophie

(tous barrés)

???
[IMPOSSIBLE À OUVRIR]`,
                    secretId: "drawings",
                    glitch: true
                };
            }

            case "PRESS": {

                if (night < 6) {
                    return { text: "ACCÈS REFUSÉ", secretId: null, glitch: false };
                }

                state.pressStage = Math.min(state.pressStage + 1, 3);
                saveState();

                const variants = [
                    null,
`ARTICLE DE JOURNAL

Aucune disparition signalée
dans l'établissement.`,
`VERSION MODIFIÉE.`,
`VERSION ORIGINALE RETROUVÉE.

Plusieurs familles
signalent des enfants manquants.`
                ];

                markFound(`press_${state.pressStage}`);

                return {
                    text: variants[state.pressStage],
                    secretId: `press_${state.pressStage}`,
                    glitch: state.pressStage === 3
                };
            }

            /* ===================== EASTER EGGS ===================== */

            case "WHOAMI": {
                return {
                    text:
`NOM : [EFFACÉ]
POSTE PRÉCÉDENT : VEILLEUR DE NUIT
DATE DE FIN DE CONTRAT : ...
RAISON : ABSENCE NON JUSTIFIÉE

----------------------------------------
Aucune nouvelle entrée depuis 4 ans.`,
                    secretId: "whoami",
                    glitch: false
                };
            }

            case "SUDO": {
                return {
                    text:
`REFUSÉ.
Niveau d'autorisation insuffisant.

Dernier utilisateur root : [INCONNU]
Dernière connexion : il y a 1247 jours`,
                    secretId: "sudo",
                    glitch: false
                };
            }

            case "AIDE_MOI":
            case "HELP_ME": {
                return {
                    text:
`Le système ne peut pas vous aider.
Le système ne vous a jamais aidé.`,
                    secretId: "aide_moi",
                    glitch: false
                };
            }

            case "GOLDEN": {
                /* Easter egg ultra-rare : message glitché puis fermeture forcée */
                return {
                    text: "I  L L   M       E\nS      O   N",
                    secretId: "golden",
                    glitch: true,
                    forceClose: true
                };
            }

            /* ===================== ROOT ===================== */

            case "ROOT": {

                if (!isRootReady()) {
                    return { text: "ACCÈS REFUSÉ — NIVEAU 5 REQUIS", secretId: null, glitch: false };
                }

                state.rootUnlocked = true;
                state.rootSeen = true;
                saveState();

                return { text: null, secretId: "root", glitch: false, root: true };
            }

            case "HELP": {
                return {
                    text:
`COMMANDES DISPONIBLES :
STATUS, CAMERAS, DOORS, POWER

Tapez une commande inconnue
à vos risques et périls.`,
                    secretId: null,
                    glitch: false
                };
            }

            default:
                return { text: "COMMANDE INCONNUE. Tapez HELP.", secretId: null, glitch: false };
        }
    }

    /* Les lignes jouées lors de la séquence ROOT finale */
    const ROOT_LINES = [
        "Bonjour.",
        "Vous cherchez les enfants.",
        "Vous cherchez le responsable.",
        "Vous cherchez la vérité.",
        "Vous êtes arrivé trop tard.",
        "",
        "Ils ne sont plus ici.",
        "",
        "Ils sont partis avant même",
        "que quelqu'un les cherche.",
        "Les dossiers ont disparu.",
        "Les preuves ont disparu.",
        "Les noms ont disparu.",
        "",
        "Même leurs parents",
        "ont cessé de venir.",
        "",
        "Il ne reste que les souvenirs.",
        "",
        "Nous les avons gardés.",
        "",
        "Lucas est encore ici.",
        "Emma aussi.",
        "Noah aussi.",
        "Sophie aussi.",
        "",
        "Et maintenant,",
        "ils connaissent votre nom."
    ];

    return {
        handleCommand,
        getCurrentNight,
        isRootReady,
        resetProgress,
        ROOT_LINES,
        get state() { return state; }
    };

})();
