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

/**
 * Injection CSS automatique
 */
(() => {

    if (document.getElementById('retro-terminal-style')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'retro-terminal-style';

    style.innerHTML = `

    .retro-terminal-overlay{
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.88);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:999999;
        animation:retroFadeIn .25s ease;
    }

    .retro-terminal{
        background:#050505;
        border:2px solid #00ff66;
        box-shadow:
            0 0 15px #00ff66,
            0 0 40px rgba(0,255,102,.3),
            inset 0 0 25px rgba(0,255,102,.15);
        color:#00ff66;
        font-family:Consolas, "Courier New", monospace;
        overflow:hidden;
        position:relative;
        max-width:95vw;
    }

    /* Scanlines CRT */
    .retro-terminal::before{
        content:'';
        position:absolute;
        inset:0;
        background:
            repeating-linear-gradient(
                to bottom,
                rgba(255,255,255,.03) 0px,
                rgba(255,255,255,.03) 1px,
                transparent 2px,
                transparent 4px
            );
        pointer-events:none;
        z-index:2;
    }

    /* Léger scintillement */
    .retro-terminal::after{
        content:'';
        position:absolute;
        inset:0;
        background:rgba(255,255,255,.01);
        pointer-events:none;
        animation:crtFlicker .12s infinite;
        z-index:1;
    }

    .retro-header{
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:10px 15px;
        border-bottom:1px solid #00ff66;
        background:#00180a;
        font-size:14px;
        text-transform:uppercase;
        letter-spacing:1px;
    }

    .retro-close{
        background:none;
        border:none;
        color:#00ff66;
        cursor:pointer;
        font-size:18px;
        padding:0;
    }

    .retro-close:hover{
        text-shadow:0 0 8px #00ff66;
    }

    .retro-screen{
        padding:20px;
        min-height:300px;
        max-height:70vh;
        overflow-y:auto;
        position:relative;
        z-index:3;

        scrollbar-width:none;
        -ms-overflow-style:none;
    }

    .retro-screen::-webkit-scrollbar{
        display:none;
    }

    .retro-content{
        margin:0;
        white-space:pre-wrap;
        word-break:break-word;
        font-size:16px;
        line-height:1.6;
        text-shadow:0 0 5px rgba(0,255,102,.7);
    }

    .retro-content .terminal-status-grid{
        display:grid;
        grid-template-columns:repeat(2, minmax(260px, 1fr));
        gap:22px;
        margin:16px 0 18px;
    }

    .retro-content .terminal-choice-card{
        border:2px solid rgba(0,255,102,.6);
        padding:18px 16px;
        min-height:240px;
        text-align:center;
        transition:transform .16s ease, box-shadow .16s ease, border-color .16s ease, background .16s ease;
        background:rgba(0,25,10,.35);
    }

    .retro-content .terminal-choice-title{
        font-size:34px;
        line-height:1;
        margin:16px 0;
        text-shadow:0 0 12px rgba(0,255,102,.6);
    }

    .retro-content .terminal-choice-label{
        font-size:30px;
        margin-bottom:8px;
    }

    .retro-content .terminal-choice-status{
        margin:8px 0 12px;
    }

    .retro-content .terminal-choice-status .danger{
        color:#ff5757;
    }

    .retro-content .terminal-choice-status .warning{
        color:#ffd24d;
    }

    .retro-content .terminal-choice-hint{
        opacity:.9;
    }

    .retro-content .terminal-choice-card.selected{
        border-color:#00ff66;
        background:rgba(0,45,18,.7);
        box-shadow:0 0 0 1px rgba(0,255,102,.7), 0 0 18px rgba(0,255,102,.5), inset 0 0 18px rgba(0,255,102,.15);
        transform:translateY(-3px) scale(1.01);
        animation:choicePulse .8s ease;
    }

    .retro-content .terminal-choice-card.selected .terminal-choice-hint{
        text-shadow:0 0 10px rgba(0,255,102,.8);
    }

    .retro-content .terminal-footer-help{
        margin-top:10px;
    }

    @media (max-width: 820px){
        .retro-content .terminal-status-grid{
            grid-template-columns:1fr;
        }
    }

    .retro-cursor{
        display:inline-block;
        margin-left:2px;
        animation:retroBlink 1s infinite;
        text-shadow:0 0 10px #00ff66;
    }

    @keyframes retroBlink{
        50%{
            opacity:0;
        }
    }

    @keyframes retroFadeIn{
        from{
            opacity:0;
        }
        to{
            opacity:1;
        }
    }

    @keyframes crtFlicker{
        0%{opacity:.96;}
        50%{opacity:1;}
        100%{opacity:.97;}
    }

    @keyframes choicePulse{
        0%{
            box-shadow:0 0 0 0 rgba(0,255,102,.1);
        }
        50%{
            box-shadow:0 0 0 1px rgba(0,255,102,.7), 0 0 24px rgba(0,255,102,.65), inset 0 0 18px rgba(0,255,102,.15);
        }
        100%{
            box-shadow:0 0 0 1px rgba(0,255,102,.7), 0 0 18px rgba(0,255,102,.5), inset 0 0 18px rgba(0,255,102,.15);
        }
    }

    `;

    document.head.appendChild(style);

})();