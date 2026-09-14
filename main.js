const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs").promises;

const logsDirectory = path.join(__dirname, "ressources", "logs");

ipcMain.handle("logs:load", async () => {
    const names = (await fs.readdir(logsDirectory))
        .filter(name => name.endsWith(".json"))
        .sort();
    const logs = [];
    for (const filename of names) {
        try {
            const data = JSON.parse(await fs.readFile(path.join(logsDirectory, filename), "utf8"));
            if (typeof data.text === "string") logs.push({ name: filename.replace(/\.json$/, ""), data });
        } catch (error) {
            console.error(`Log ignoré (${filename}) : ${error.message}`);
        }
    }
    return logs;
});

ipcMain.handle("logs:save", async (_event, name, data) => {
    if (typeof name !== "string" || !/^[A-Z0-9_]+$/.test(name)) {
        throw new Error("Nom de log invalide");
    }
    const filename = `${name}.json`;
    const filePath = path.join(logsDirectory, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 4) + "\n", "utf8");
    return filename;
});

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
            nodeIntegration: false,
            preload: path.join(__dirname, "preload.js")
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