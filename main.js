const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,

        minWidth: 960,
        minHeight: 540,

        backgroundColor: "#000000",

        autoHideMenuBar: true,

        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile(path.join(__dirname, "index.html"));

    // DEBUG
    win.webContents.openDevTools();

    // Affiche les erreurs JavaScript dans le terminal
    win.webContents.on("console-message", (event, level, message, line, sourceId) => {
        console.log(`[Renderer] ${message}`);
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});