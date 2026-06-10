class TerminalScreens {

    static async load(file) {

        const response = await fetch(
            `templates/retro-terminal/${file}`
        );

        return await response.text();
    }
}


/*
    TerminalScreens.load("security-terminal.html")
    .then(html => {

    terminalUI = RetroTerminal.show(html, {
        title: 'FAZBEAR SECURITY TERMINAL v1.0.2',
        speed: 20,
        allowHtml: true,
        typewriter: true,
        width: '980px',
        onClose: cleanup
    });
});
*/