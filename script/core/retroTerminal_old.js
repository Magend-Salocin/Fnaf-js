class RetroTerminal {

    static show(text, options = {}) {

        const settings = {
            title: options.title || 'SYSTEM',
            speed: options.speed || 30,
            width: options.width || '800px',
            allowHtml: options.allowHtml || false,
            typewriter: options.typewriter !== false,
            onClose: typeof options.onClose === 'function' ? options.onClose : null
        };

        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'retro-terminal-overlay';

        // Fenêtre terminal
        const terminal = document.createElement('div');
        terminal.className = 'retro-terminal';
        terminal.style.width = settings.width;

        terminal.innerHTML = `
            <div class="retro-header">
                <span>${settings.title}</span>
                <button class="retro-close">✕</button>
            </div>

            <div class="retro-screen">
                <${settings.allowHtml ? 'div' : 'pre'} class="retro-content"></${settings.allowHtml ? 'div' : 'pre'}>
                <span class="retro-cursor">█</span>
            </div>
        `;

        overlay.appendChild(terminal);
        document.body.appendChild(overlay);

        playSound("terminal-start"); // Joue le son de descente de caméra

        playSoundLoop("terminal-keyboard-typing");

        const content = terminal.querySelector('.retro-content');
        const screen = terminal.querySelector('.retro-screen');
        const closeBtn = terminal.querySelector('.retro-close');

        let isClosed = false;

        const closeTerminal = () => {
            if (isClosed) {
                return;
            }

            isClosed = true;
            overlay.remove();
            stopSound("terminal-keyboard-typing");

            if (settings.onClose) {
                settings.onClose();
            }
        };

        closeBtn.addEventListener('click', () => {
            closeTerminal();
            playSound("camera_toggle"); // Joue le son de basculement de caméra
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeTerminal();
            }
        });

        if (settings.allowHtml || !settings.typewriter) {
            if (settings.allowHtml) {
                content.innerHTML = text;
            } else {
                content.textContent = text;
            }

            stopSound("terminal-keyboard-typing");

            return {
                overlay,
                terminal,
                screen,
                content,
                close: closeTerminal
            };
        }

        let index = 0;

        const typeWriter = () => {

            if (isClosed) {
                return;
            }

            if (index < text.length) {

                content.textContent += text.charAt(index);

                // Scroll automatique
                screen.scrollTop = screen.scrollHeight;

                index++;

                setTimeout(typeWriter, settings.speed);
            }else{
                stopSound("terminal-keyboard-typing");
            }
        };

        typeWriter();

        return {
            overlay,
            terminal,
            screen,
            content,
            close: closeTerminal
        };
    }
}
