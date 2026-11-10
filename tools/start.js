/*
 * Lance le jeu dans Electron (npm start).
 *
 * Le terminal intégré de VS Code définit ELECTRON_RUN_AS_NODE=1 : Electron
 * démarre alors comme un simple Node, sans ipcMain ni fenêtre, et main.js
 * plante. On retire la variable avant de lancer Electron.
 */
const { spawn } = require('child_process');
const electronPath = require('electron'); // en Node, renvoie le chemin de l'exécutable

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(electronPath, ['.', ...process.argv.slice(2)], { stdio: 'inherit', env });
child.on('close', code => process.exit(code ?? 0));
