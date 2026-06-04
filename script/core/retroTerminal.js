class RetroTerminal {

    static show(text, options = {}) {

        const settings = {
            title: options.title || 'SYSTEM',
            speed: options.speed || 30,
            width: options.width || '800px'
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
                <pre class="retro-content"></pre>
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

        closeBtn.addEventListener('click', () => {
            overlay.remove();

             playSound("camera_toggle"); // Joue le son de basculement de caméra
             stopSound("terminal-keyboard-typing");
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        let index = 0;

        const typeWriter = () => {

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

    `;

    document.head.appendChild(style);

})();