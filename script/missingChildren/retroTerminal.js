class RetroTerminal {

    static show(content, options = {}) {

        const settings = {
            title: options.title || "SYSTEM",
            width: options.width || "800px",
            allowHtml: options.allowHtml || false,
            onClose:
                typeof options.onClose === "function"
                    ? options.onClose
                    : null
        };

        const overlay = document.createElement("div");
        overlay.className = "retro-terminal-overlay";

        const terminal = document.createElement("div");
        terminal.className = "retro-terminal";
        terminal.style.width = settings.width;

        terminal.innerHTML = `
            <div class="retro-header">
                <span>${settings.title}</span>
                <button class="retro-close">✕</button>
            </div>

            <div class="retro-screen">
                <div class="retro-content"></div>
                <span class="retro-cursor">█</span>
            </div>
        `;

        overlay.appendChild(terminal);
        document.body.appendChild(overlay);

        playSound("terminal-start");

        const contentNode =
            terminal.querySelector(".retro-content");

        const closeButton =
            terminal.querySelector(".retro-close");

        let isClosed = false;

        const close = () => {

            if (isClosed) {
                return;
            }

            isClosed = true;

            overlay.remove();

            settings.onClose?.();
        };

        closeButton.addEventListener(
            "click",
            () => {

                playSound("camera_toggle");

                close();
            }
        );

        overlay.addEventListener(
            "click",
            e => {

                if (e.target === overlay) {
                    close();
                }
            }
        );

        if (settings.allowHtml) {
            contentNode.innerHTML = content;
        } else {
            contentNode.textContent = content;
        }

        return {
            overlay,
            terminal,
            content: contentNode,
            close
        };
    }

    static menu(options = {}) {

        let selected = 0;

        const items =
            options.items || [];

        const columns =
            options.columns || items.length;

        const html =
            RetroTerminal.buildMenu(
                items,
                options.header
            );

        let terminal;

        const cleanup = () => {

            document.removeEventListener(
                "keydown",
                keyHandler
            );
        };

        terminal = RetroTerminal.show(
            html,
            {
                title:
                    options.title || "SYSTEM",

                width:
                    options.width || "980px",

                allowHtml: true,

                onClose: cleanup
            }
        );

        const choices = [
            ...terminal.content.querySelectorAll(
                ".terminal-choice-card"
            )
        ];

        const updateSelection = (
            withSound = true
        ) => {

            choices.forEach(
                (choice, index) => {

                    choice.classList.toggle(
                        "selected",
                        index === selected
                    );

                }
            );

            if (withSound) {
                playSound("terminal-keyboard-typing");
            }
        };

        const select = index => {

            if (
                index < 0 ||
                index >= choices.length
            ) {
                return;
            }

            selected = index;

            updateSelection();
        };

        const validate = () => {

            cleanup();

            terminal.close();

            items[selected]
                ?.onSelect?.();
        };

        const keyHandler = e => {

            switch (e.key) {

                case "ArrowLeft":

                    select(selected - 1);

                    break;

                case "ArrowRight":

                    select(selected + 1);

                    break;

                case "ArrowUp":

                    select(selected - columns);

                    break;

                case "ArrowDown":

                    select(selected + columns);

                    break;

                case "Enter":

                    validate();

                    break;
            }
        };

        document.addEventListener(
            "keydown",
            keyHandler
        );

        choices.forEach(
            (choice, index) => {

                choice.addEventListener(
                    "click",
                    () => {

                        if (
                            selected === index
                        ) {

                            validate();

                            return;
                        }

                        select(index);
                    }
                );
            }
        );

        updateSelection(false);

        return terminal;
    }

    /* =========================================================
       SHELL — mode commande texte libre

       options.onCommand(rawInput) doit renvoyer soit :
         - null / undefined            -> rien ne s'affiche
         - { text, glitch, root, sequence, forceClose }

       text       : texte affiché en réponse (string ou null)
       glitch     : déclenche un effet visuel + sonore de "secret trouvé"
       root       : déclenche RetroTerminal.rootSequence() à la place
       sequence   : étapes temporisées (voir playSequence)
       forceClose : ferme le terminal juste après affichage

       options.typewriter      : true/false (défaut true)
       options.typewriterSpeed : ms entre chaque caractère (défaut 16)
       options.ambientGlitch   : true/false (défaut true) perturbations
                                  aléatoires (visuel + son + corruption
                                  de texte) tant que le terminal est ouvert
       ========================================================= */

    static shell(options = {}) {

        const history = [];
        let historyIndex = -1;

        const typewriterEnabled = options.typewriter !== false;
        const typewriterSpeed = options.typewriterSpeed || 16;

        const html = `
            <div class="retro-shell-log"></div>
            <div class="retro-shell-inputline">
                <span class="retro-shell-prompt">&gt;</span>
                <input
                    type="text"
                    class="retro-shell-input"
                    autocomplete="off"
                    spellcheck="false"
                />
            </div>
        `;

        const terminal = RetroTerminal.show(html, {
            title: options.title || "SYSTEM",
            width: options.width || "900px",
            allowHtml: true,
            onClose: options.onClose || null
        });

        const log = terminal.content.querySelector(".retro-shell-log");
        const input = terminal.content.querySelector(".retro-shell-input");

        const printLine = (text, lineClass = "") => {
            const line = document.createElement("div");
            line.className = `retro-shell-line ${lineClass}`.trim();
            line.textContent = text;
            log.appendChild(line);
            log.scrollTop = log.scrollHeight;
            return line;
        };

        /* -----------------------------------------------------
           Affichage lettre par lettre. Les retours à la ligne
           du texte source deviennent des <br> dans un même bloc,
           pour un rendu "machine à écrire" continu.
           ----------------------------------------------------- */
        const typeOut = (text, lineClass = "", onDone = null) => {

            const wrapper = document.createElement("div");
            wrapper.className = `retro-shell-line ${lineClass}`.trim();
            log.appendChild(wrapper);

            if (!typewriterEnabled) {
                wrapper.textContent = text;
                log.scrollTop = log.scrollHeight;
                onDone?.();
                return wrapper;
            }

            const chars = text.split("");
            let i = 0;

            const tick = () => {

                if (i >= chars.length) {
                    onDone?.();
                    return;
                }

                const ch = chars[i];

                if (ch === "\n") {
                    wrapper.appendChild(document.createElement("br"));
                } else {
                    wrapper.appendChild(document.createTextNode(ch));
                }

                i += 1;

                log.scrollTop = log.scrollHeight;

                if (i % 2 === 0 && typeof playSound === "function") {
                    playSound("terminal-keyboard-typing");
                }

                setTimeout(tick, typewriterSpeed);
            };

            tick();

            return wrapper;
        };

        if (options.intro) {
            typeOut(options.intro);
        }

        input.focus();

        /* -----------------------------------------------------
           Joue une séquence temporisée dans le log : chaque étape
           apparaît après un délai, lettre par lettre (sauf les
           étapes "flash" qui apparaissent instantanément puis
           disparaissent seules après flashDuration).
           ----------------------------------------------------- */
        const playSequence = (sequence = []) => {

            let elapsed = 0;

            sequence.forEach(step => {

                elapsed += step.delay || 0;

                setTimeout(() => {

                    if (step.glitch) {
                        RetroTerminal.glitchPulse(terminal.terminal);
                        if (typeof playSound === "function") {
                            playSound("terminal-glitch");
                        }
                    }

                    const cls =
                        `${step.glitch ? "retro-shell-secret" : ""} ${step.flash ? "retro-shell-flash" : ""}`.trim();

                    if (step.flash) {

                        const node = printLine(step.text || "", cls);

                        setTimeout(() => {
                            node.remove();
                        }, step.flashDuration || 1000);

                    } else {
                        typeOut(step.text || "", cls);
                    }

                }, elapsed);
            });
        };

        /* -----------------------------------------------------
           CLEAR / CLS — efface tout l'écran du terminal
           ----------------------------------------------------- */
        const handleClear = () => {

            log.innerHTML = "";

            if (typeof playSound === "function") {
                playSound("camera_toggle");
            }
        };

        const handleSubmit = () => {

            const raw = input.value;

            if (raw.trim() === "") return;

            const cmdUpper = raw.trim().toUpperCase();

            history.push(raw);
            historyIndex = history.length;
            input.value = "";

            if (cmdUpper === "CLEAR" || cmdUpper === "CLS") {
                handleClear();
                return;
            }

            printLine(`> ${raw}`, "retro-shell-echo");

            const result =
                typeof options.onCommand === "function"
                    ? options.onCommand(raw)
                    : null;

            if (!result) return;

            if (result.root) {
                terminal.close();
                RetroTerminal.rootSequence(
                    options.rootLines || [],
                    options.rootOptions || {}
                );
                return;
            }

            if (result.sequence) {
                playSequence(result.sequence);
            }

            if (result.glitch) {
                RetroTerminal.glitchPulse(terminal.terminal);
                if (typeof playSound === "function") {
                    playSound("terminal-glitch");
                }
            }

            if (result.text) {
                typeOut(result.text, result.glitch ? "retro-shell-secret" : "");
            }

            if (result.forceClose) {
                setTimeout(() => terminal.close(), 900);
            }
        };

        /* -----------------------------------------------------
           ÉVÉNEMENT ALÉATOIRE SPONTANÉ (narratif)
           Tant que le terminal est ouvert, on vérifie périodiquement
           si un événement ambiant doit se déclencher seul, sans
           qu'aucune commande n'ait été tapée (ex : 1% de chance
           "Connexion perdue...").
           ----------------------------------------------------- */
        let idleTimer = null;

        if (typeof options.idleEvent === "function") {

            idleTimer = setInterval(() => {

                const sequence = options.idleEvent();

                if (sequence) {
                    playSequence(sequence);
                }

            }, options.idleIntervalMs || 20000);
        }

        /* -----------------------------------------------------
           PERTURBATIONS AMBIANTES (purement cosmétiques)
           Flicker visuel + son + corruption temporaire de quelques
           caractères déjà affichés, à intervalle aléatoire. Ne
           dépend d'aucune logique de lore : c'est de l'ambiance.
           ----------------------------------------------------- */
        const ambientEnabled = options.ambientGlitch !== false;
        let ambientTimer = null;

        const corruptVisibleText = (durationMs = 150) => {

            const walker = document.createTreeWalker(log, NodeFilter.SHOW_TEXT);
            const nodes = [];
            let n;

            while ((n = walker.nextNode())) {
                if (n.textContent.trim().length > 1) {
                    nodes.push(n);
                }
            }

            if (nodes.length === 0) return;

            const glitchChars = "#%$▓▒░@&*";
            const affected = [];
            const count = Math.min(nodes.length, 3);

            for (let i = 0; i < count; i += 1) {

                const node = nodes[Math.floor(Math.random() * nodes.length)];
                const original = node.textContent;
                const arr = original.split("");
                const pos = Math.floor(Math.random() * arr.length);

                arr[pos] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                node.textContent = arr.join("");

                affected.push({ node, original });
            }

            setTimeout(() => {
                affected.forEach(({ node, original }) => {
                    node.textContent = original;
                });
            }, durationMs);
        };

        const triggerAmbientGlitch = () => {

            const roll = Math.random();

            terminal.terminal.classList.add("retro-static-flicker");
            setTimeout(() => {
                terminal.terminal.classList.remove("retro-static-flicker");
            }, 220);

            if (typeof playSound === "function") {
                playSound(roll < 0.5 ? "terminal-glitch" : "terminal-static");
            }

            if (roll < 0.6) {
                corruptVisibleText(150 + Math.random() * 150);
            }
        };

        const scheduleAmbient = () => {

            const delay = 7000 + Math.random() * 16000;

            ambientTimer = setTimeout(() => {
                triggerAmbientGlitch();
                scheduleAmbient();
            }, delay);
        };

        if (ambientEnabled) {
            scheduleAmbient();
        }

        const originalClose = terminal.close;
        terminal.close = () => {
            if (idleTimer) clearInterval(idleTimer);
            if (ambientTimer) clearTimeout(ambientTimer);
            originalClose();
        };

        input.addEventListener("keydown", e => {

            if (e.key === "Enter") {
                handleSubmit();
                return;
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex -= 1;
                    input.value = history[historyIndex] || "";
                }
                return;
            }

            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (historyIndex < history.length) {
                    historyIndex += 1;
                    input.value = history[historyIndex] || "";
                }
                return;
            }
        });

        terminal.terminal.addEventListener("click", () => input.focus());

        return terminal;
    }

    /* =========================================================
       GLITCH PULSE — petit effet visuel quand un secret est trouvé
       ========================================================= */

    static glitchPulse(terminalNode) {

        terminalNode.classList.add("retro-glitch-pulse");

        setTimeout(() => {
            terminalNode.classList.remove("retro-glitch-pulse");
        }, 350);
    }

    /* =========================================================
       ROOT SEQUENCE — séquence finale dépouillée
       Aucun chrome, aucun curseur, juste du texte qui apparaît
       ligne par ligne sur fond noir, fermeture au clic/touche
       à la fin uniquement.
       ========================================================= */

    static rootSequence(lines = [], options = {}) {

        const overlay = document.createElement("div");
        overlay.className = "retro-root-overlay";

        const screen = document.createElement("div");
        screen.className = "retro-root-screen";

        overlay.appendChild(screen);
        document.body.appendChild(overlay);

        if (typeof playSound === "function") {
            playSound("terminal-start");
        }

        let finished = false;
        const lineDelay = options.lineDelay || 1400;

        const close = () => {
            if (!finished) return;
            overlay.remove();
            options.onClose?.();
        };

        overlay.addEventListener("click", close);
        document.addEventListener("keydown", function escClose(e) {
            if (finished && e.key === "Enter") {
                close();
                document.removeEventListener("keydown", escClose);
            }
        });

        lines.forEach((line, index) => {

            setTimeout(() => {

                const p = document.createElement("div");
                p.className = "retro-root-line";
                p.textContent = line;
                screen.appendChild(p);

                requestAnimationFrame(() => {
                    p.classList.add("visible");
                });

                screen.scrollTop = screen.scrollHeight;

                if (index === lines.length - 1) {
                    finished = true;
                }

            }, index * lineDelay);
        });
    }

    /* =========================================================
       END OF NIGHT GLITCH — séquence plein écran de fin de nuit
       Affiche des lignes, puis fait MUTER une ligne en place
       (ex: "Aucune anomalie détectée." -> "1 anomalie détectée.")
       puis bascule sur un texte court ("ERREUR"), puis noir total.
       Se résout automatiquement, aucune interaction requise.
       ========================================================= */

    static endOfNightGlitch(options = {}) {

        const {
            initialLines = [],
            holdBeforeMorph = 2500,
            morphLineIndex = initialLines.length - 1,
            morphTo = "",
            holdAfterMorph = 1200,
            thenText = "",
            holdThenText = 1500,
            holdBlack = 1000,
            onComplete = null
        } = options;

        const overlay = document.createElement("div");
        overlay.className = "retro-root-overlay";

        const screen = document.createElement("div");
        screen.className = "retro-root-screen";

        overlay.appendChild(screen);
        document.body.appendChild(overlay);

        const lineNodes = initialLines.map(text => {
            const p = document.createElement("div");
            p.className = "retro-root-line";
            p.textContent = text;
            screen.appendChild(p);
            requestAnimationFrame(() => p.classList.add("visible"));
            return p;
        });

        setTimeout(() => {

            const target = lineNodes[morphLineIndex];

            if (target) {
                target.classList.add("retro-glitch-pulse");
                if (typeof playSound === "function") {
                    playSound("terminal-keyboard-typing");
                }
                setTimeout(() => {
                    target.textContent = morphTo;
                }, 120);
            }

            setTimeout(() => {

                screen.innerHTML = "";

                const errorLine = document.createElement("div");
                errorLine.className = "retro-root-line retro-root-error";
                errorLine.textContent = thenText;
                screen.appendChild(errorLine);
                requestAnimationFrame(() => errorLine.classList.add("visible"));

                setTimeout(() => {

                    screen.innerHTML = "";

                    setTimeout(() => {
                        overlay.remove();
                        onComplete?.();
                    }, holdBlack);

                }, holdThenText);

            }, holdAfterMorph);

        }, holdBeforeMorph);

        return { overlay, screen };
    }

    static buildMenu(
        items = [],
        header = ""
    ) {

        return `

            ${header}

            <div class="terminal-status-grid">

                ${items.map(item => `

                    <div class="terminal-choice-card">

                        <div class="terminal-choice-label">
                            ${item.label || ""}
                        </div>

                        <div class="terminal-choice-title">
                            ${item.icon || ""}
                        </div>

                        <div class="terminal-choice-status">

                            <span class="${item.statusClass || ""}">
                                ${item.status || ""}
                            </span>

                        </div>

                        <div class="terminal-choice-hint">
                            ${item.hint || ""}
                        </div>

                    </div>

                `).join("")}

            </div>

        `;
    }
}