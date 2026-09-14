const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("logEditor", {
    loadLogs: () => ipcRenderer.invoke("logs:load"),
    saveLog: (name, data) => ipcRenderer.invoke("logs:save", name, data)
});