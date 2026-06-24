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
var securityTerminalHtml = `
------------------------------------------------<br>
SYSTÈME : OPÉRATIONNEL<br>
ALIMENTATION : 83%<br>
CAMÉRAS : HORS LIGNE<br>
LIGNE TÉLÉPHONIQUE : CONNECTÉE<br>
------------------------------------------------
`;

const actions =[
    {
        label: "CAMÉRAS",
        icon: "📹",
        status: "HORS LIGNE",
        statusClass: "danger",
        hint: "ENTER POUR ACTIVER",

        onSelect() {

            playSound("camera_toggle");

            activateCameraSystem();
        }
    },

    {
        label: "TÉLÉPHONE",
        icon: "☎",
        status: "ACTIF",
        statusClass: "warning",
        hint: "ENTER POUR RACCROCHER",

        onSelect() {

            playSound("camera_toggle");

            currentNight.stopPhoneCall();
        }
    },

    {
        label: "ALIMENTATION",
        icon: "⚡",
        status: "83%",
        statusClass: "success",
        hint: "CONSOMMATION",

        onSelect() {

            console.log(
                "Power Menu"
            );
        }
    },

    {
        label: "PORTES",
        icon: "🚪",
        status: "OUVERTES",
        statusClass: "success",
        hint: "CONTRÔLE D'ACCÈS",

        onSelect() {

            console.log(
                "Doors Menu"
            );
        }
    },
        {
        label: "Debug Endnight",
        icon: "🚪",
        status: "OUVERTES",
        statusClass: "success",
        hint: "CONTRÔLE D'ACCÈS",

        onSelect() {
            gameTime.hours = 6;
            gameTime.minutes = 0;
        }
    },
    {
        label: "Debug show",
        icon: "🚪",
        status: "OUVERTES",
        statusClass: "success",
        hint: "CONTRÔLE D'ACCÈS",

        onSelect() {
            toggleDebugPanel();
        }
    },
];
_showTerminalIntro(securityTerminalHtml, actions);
}

function _showTerminalIntro(securityTerminalHtml, actions) {

    RetroTerminal.menu({

        title:"FAZBEAR SECURITY TERMINAL v1.0.2",

        width: "980px",

        columns: 4,

        header: securityTerminalHtml,

        items: actions
    });       
}