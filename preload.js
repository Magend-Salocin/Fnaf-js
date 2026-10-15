const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("appInfo", {
    devToolsEnabled: ipcRenderer.sendSync("app:dev-tools-enabled")
});

contextBridge.exposeInMainWorld("logEditor", {
    loadLogs: () => ipcRenderer.invoke("logs:load"),
    saveLog: (name, data) => ipcRenderer.invoke("logs:save", name, data)
});