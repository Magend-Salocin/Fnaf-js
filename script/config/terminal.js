function showTerminalIntro2() {
RetroTerminal.show(`
FAZBEAR ENTERTAINMENT
SECURITY TERMINAL v1.0

----------------------------------------
NOUVEL EMPLOYE DETECTE
----------------------------------------

Bienvenue au poste de surveillance nocturne.

Votre mission est simple :

- Surveiller les caméras.
- Signaler toute anomalie.
- Assurer la sécurité des locaux.

Les systèmes automatiques du bâtiment
sont actuellement opérationnels.

Aucune intervention n'est prévue cette nuit.

Les mascottes animatroniques ont été
placées en mode libre circulation
afin de préserver leurs mécanismes.

Tout comportement inhabituel doit être
considéré comme normal dans le cadre
de leur fonctionnement.

----------------------------------------

CONSEIL :

Conservez votre calme.
Économisez l'énergie disponible.
Observez avant d'agir.

----------------------------------------

Début du service : 00:00
Fin du service : 06:00

Bonne chance.

Vous allez en avoir besoin.
`, {
    title: 'FAZBEAR ENTERTAINMENT',
    speed: 20
});
}

function showTerminalIntro() {

    let selected = 0;
    let terminalUI;

    const cleanup = () => {
        document.removeEventListener("keydown", keyHandler);
    };

    const updateSelection = (withSound = true) => {

        const cameraChoice = document.getElementById("choice-camera");
        const phoneChoice = document.getElementById("choice-phone");

        if (!cameraChoice || !phoneChoice) {
            return;
        }

        cameraChoice.classList.toggle("selected", selected === 0);
        phoneChoice.classList.toggle("selected", selected === 1);

        if (withSound) {
            playSound("ui_move");
        }
    };

    const actions = [
        () => {
            console.log("Activation des caméras");
            playSound("camera_toggle");

            // Ouvrir les caméras
            activateCameraSystem();
        },
        () => {
            console.log("Raccrocher");
            playSound("camera_toggle");

            // Stopper Phone Guy
            currentNight.stopPhoneCall();
        }
    ];

    const selectOption = (value) => {
        if (selected === value) {
            return;
        }

        selected = value;
        updateSelection();
    };

    const validateSelection = () => {
        cleanup();
        terminalUI.close();
        actions[selected]();
    };

    const keyHandler = (e) => {

        if (e.key === "ArrowLeft") {
            selectOption(0);
        }

        if (e.key === "ArrowRight") {
            selectOption(1);
        }

        if (e.key === "Enter") {
            validateSelection();
        }
    };

    terminalUI = RetroTerminal.show(`
<div>
    

    ------------------------------------------------

    SYSTÈME : OPÉRATIONNEL
    ALIMENTATION : 83%
    CAMÉRAS : HORS LIGNE
    LIGNE TÉLÉPHONIQUE : CONNECTÉE

    ------------------------------------------------

    <div class="terminal-status-grid">
        <div class="terminal-choice-card selected" id="choice-camera">
            <div class="terminal-choice-label">[ ACTIVER LES CAMÉRAS ]</div>
            <div class="terminal-choice-title">📹</div>
            <div class="terminal-choice-status">STATUT : <span class="danger">HORS LIGNE</span></div>
            <div class="terminal-choice-hint">&gt;&gt; APPUYER SUR ENTER &lt;&lt;<br>POUR ACTIVER</div>
        </div>

        <div class="terminal-choice-card" id="choice-phone">
            <div class="terminal-choice-label">[ RACCROCHER L'APPEL ]</div>
            <div class="terminal-choice-title">☎</div>
            <div class="terminal-choice-status">STATUT : <span class="warning">EN COURS</span></div>
            <div class="terminal-choice-hint">&gt;&gt; APPUYER SUR ENTER &lt;&lt;<br>POUR RACCROCHER</div>
        </div>
    </div>

    <div class="terminal-footer-help">UTILISEZ ← → POUR NAVIGUER</div>
    <div>APPUYER SUR ENTER POUR SÉLECTIONNER</div>
</div>
`, {
        title: 'FAZBEAR SECURITY TERMINAL v1.0.2',
        speed: 20,
        allowHtml: true,
        typewriter: true,
        width: '980px',
        onClose: cleanup
    });

    document.addEventListener("keydown", keyHandler);

    const cameraChoice = document.getElementById("choice-camera");
    const phoneChoice = document.getElementById("choice-phone");

    if (cameraChoice) {
        cameraChoice.addEventListener("click", () => {
            if (selected === 0) {
                validateSelection();
                return;
            }

            selectOption(0);
        });
    }

    if (phoneChoice) {
        phoneChoice.addEventListener("click", () => {
            if (selected === 1) {
                validateSelection();
                return;
            }

            selectOption(1);
        });
    }

    updateSelection(false);
}

