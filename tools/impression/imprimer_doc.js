// Imprime des documents Markdown en PDF, au style « carnet de bord ».
//
// Usage :
//   tools\impression\imprimer.cmd <fichier.md>        ou glisser des .md sur imprimer.cmd
//   npm run doc:pdf                                  tous les .md de .github/Projet/03 - Technique/
//   npm run doc:pdf -- <fichier.md|dossier> [...]    seulement ces fichiers ou dossiers
//   --ouvrir                                         ouvre chaque PDF une fois généré
//
// Les PDF sont écrits dans .github/Projet/_impression/.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { pathToFileURL } = require("url");
const { spawnSync } = require("child_process");
const electron = require("electron");
const { renderMarkdown, escapeHtml } = require("./markdown");
const { pageDecor, paperTexture, INK_FILTER } = require("./decor");

// Lancé par Node (ou par Electron avec ELECTRON_RUN_AS_NODE, que définit le terminal de VS Code),
// require("electron") renvoie le chemin de l'exécutable : on se relance dans un vrai Electron.
if (typeof electron === "string") {
  const env = { ...process.env };
  delete env.ELECTRON_RUN_AS_NODE;
  const result = spawnSync(electron, [__filename, ...process.argv.slice(2)], { stdio: "inherit", env });
  process.exit(result.status ?? 1);
}

const { app, BrowserWindow, shell } = electron;

const ROOT = path.join(__dirname, "..", "..");
const DEFAULT_SOURCE = path.join(ROOT, ".github", "Projet", "03 - Technique");
const OUTPUT_DIR = path.join(ROOT, ".github", "Projet", "_impression");
const STYLE = fs.readFileSync(path.join(__dirname, "carnet.css"), "utf8");
const MERMAID_SCRIPT = pathToFileURL(require.resolve("mermaid/dist/mermaid.min.js")).href;

// Schémas Mermaid aux couleurs du carnet : encre sur papier, écriture machine.
const MERMAID_CONFIG = {
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    fontFamily: '"Courier New", Courier, monospace',
    primaryColor: "#efe3cc",
    primaryBorderColor: "#2b2622",
    primaryTextColor: "#2b2622",
    lineColor: "#2b2622",
    secondaryColor: "#e2d0ad",
    tertiaryColor: "#f5ecd9",
    clusterBkg: "#f5ecd9",
    clusterBorder: "#5c534b",
    edgeLabelBackground: "#efe3cc",
  },
  flowchart: { htmlLabels: true, curve: "basis" },
};

function listMarkdownFiles(args) {
  const sources = args.length > 0 ? args.map(arg => path.resolve(arg)) : [DEFAULT_SOURCE];
  return sources.flatMap(source => {
    if (!fs.existsSync(source)) throw new Error(`Introuvable : ${source}`);
    if (!fs.statSync(source).isDirectory()) return [source];
    return fs.readdirSync(source).filter(f => f.endsWith(".md")).map(f => path.join(source, f));
  });
}

// Le premier titre de niveau 1 passe sur la couverture.
function buildPage(markdownFile) {
  const source = fs.readFileSync(markdownFile, "utf8");
  const titleMatch = source.match(/^#\s+(.*)$/m);
  const title = titleMatch ? titleMatch[1].trim() : path.basename(markdownFile, ".md");
  const body = titleMatch ? source.replace(titleMatch[0], "") : source;
  const relativePath = path.relative(ROOT, markdownFile).split(path.sep).join("/");
  const mermaidScript = /^```mermaid\s*$/m.test(body) ? `<script src="${MERMAID_SCRIPT}"></script>` : "";

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>:root { --texture-papier: url("${paperTexture(7)}"); }
${STYLE}</style>
${mermaidScript}
</head>
<body>
${INK_FILTER}
<div class="papier">${pageDecor(7)}</div>
<main class="feuillet">
<section class="couverture">
  <span class="etoile hg">★</span><span class="etoile hd">★</span><span class="etoile bg">★</span><span class="etoile bd">★</span>
  <div class="surtitre">Fazbear Entertainment</div>
  <div class="correction">technique</div>
  <div class="barre">MANUEL DU GARDIEN</div>
  <h1>${escapeHtml(title)}</h1>
  <div class="source">${escapeHtml(relativePath)}</div>
  <div class="tampon">CONFIDENTIEL</div>
</section>
${renderMarkdown(body, path.dirname(markdownFile))}
<section class="notes">
  <div class="consigne">Notes du gardien. Ce qui ne marche pas comme prévu, ce qui reste à vérifier.</div>
  <div class="lignes">${"<div></div>".repeat(24)}</div>
</section>
</main>
</body>
</html>`;
}

// Dessine les schémas Mermaid de la page avant l'impression. Un schéma invalide reste
// affiché sous forme de code et le problème est signalé, sans bloquer l'impression.
async function renderDiagrams(window) {
  const result = await window.webContents.executeJavaScript(`(async () => {
    if (!window.mermaid) return null;
    window.mermaid.initialize(${JSON.stringify(MERMAID_CONFIG)});
    try { await window.mermaid.run({ querySelector: ".mermaid" }); }
    catch (e) { return { error: String((e && e.message) || e) }; }
    return { drawn: document.querySelectorAll(".schema svg").length, total: document.querySelectorAll(".schema").length };
  })()`);
  if (!result) return;
  if (result.error) console.warn(`Schéma Mermaid non dessiné : ${result.error}`);
  else console.log(`Schémas dessinés : ${result.drawn} sur ${result.total}`);
}

async function printToPdf(markdownFile, window) {
  const htmlFile = path.join(os.tmpdir(), `impression-${process.pid}.html`);
  fs.writeFileSync(htmlFile, buildPage(markdownFile), "utf8");
  await window.loadFile(htmlFile);
  await renderDiagrams(window);
  const pdf = await window.webContents.printToPDF({
    pageSize: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  fs.rmSync(htmlFile, { force: true });

  const outputFile = path.join(OUTPUT_DIR, `${path.basename(markdownFile, ".md")}.pdf`);
  fs.writeFileSync(outputFile, pdf);
  console.log(path.relative(ROOT, outputFile));
  return outputFile;
}

async function main() {
  // argv : [electron, ce script, ...arguments]
  const args = process.argv.slice(2);
  const open = args.includes("--ouvrir");
  const files = listMarkdownFiles(args.filter(arg => arg !== "--ouvrir"));
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const window = new BrowserWindow({ show: false, webPreferences: { sandbox: true } });
  for (const file of files) {
    const pdf = await printToPdf(file, window);
    if (open) await shell.openPath(pdf);
  }
}

app.whenReady()
  .then(main)
  .catch(error => { console.error(error.message); process.exitCode = 1; })
  .finally(() => app.exit(process.exitCode ?? 0));
