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
         - { text, glitch, root, forceClose }

       text   : texte affiché en réponse (string ou null)
       glitch : déclenche un effet visuel + sonore de "secret trouvé"
       root   : déclenche RetroTerminal.rootSequence() à la place
       forceClose : ferme le terminal juste après affichage
       ========================================================= */

    static shell(options = {}) {

        const history = [];
        let historyIndex = -1;

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
        };

        if (options.intro) {
            options.intro.split("\n").forEach(l => printLine(l));
        }

        input.focus();

        const handleSubmit = () => {

            const raw = input.value;

            if (raw.trim() === "") return;

            printLine(`> ${raw}`, "retro-shell-echo");

            history.push(raw);
            historyIndex = history.length;

            input.value = "";

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

            if (result.glitch) {
                RetroTerminal.glitchPulse(terminal.terminal);
                if (typeof playSound === "function") {
                    playSound("terminal-keyboard-typing");
                }
            }

            if (result.text) {
                result.text.split("\n").forEach(l =>
                    printLine(l, result.glitch ? "retro-shell-secret" : "")
                );
            }

            if (result.forceClose) {
                setTimeout(() => terminal.close(), 900);
            }
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