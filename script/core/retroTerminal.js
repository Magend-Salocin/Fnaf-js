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