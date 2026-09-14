/* ============================================================
   Vérification des logs du terminal

   Contrôle ce que le canon impose à ressources/logs/*.json :
   présence, validité JSON, maquette du document, et vocabulaire.
   Voir .github/Projet/02 - Lore/CANON_LOGS.md.

       node ".github/Projet/_editor_log/check_logs.js"
       node ".github/Projet/_editor_log/check_logs.js <dossier logs>"
   ============================================================ */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..", "..");
const LOGS_DIR = process.argv[2] || path.join(ROOT, "ressources", "logs");
const MANIFEST = path.join(ROOT, "script", "config", "logs_database.json");

const BOX = 62;          // largeur intérieure des cadres ╔ ╗
const SECTION = 64;      // longueur des filets ═
const TABLE = 62;        // longueur des filets ─
const LEADER = 30;       // colonne de départ des valeurs d'un champ

const COMPANY = "FAZBEAR ENTERTAINMENT";
const IDENTITY_FIELDS = [
    "DOCUMENT",
    "RÉFÉRENCE",
    "SERVICE ÉMETTEUR",
    "CLASSIFICATION",
    "DERNIÈRE MISE À JOUR"
];
const FOOTER_TITLES = ["FIN DU DOCUMENT", "DOCUMENT NON CLÔTURÉ"];

// Prénoms du brainstorming lore.md, hors canon.
const FORBIDDEN = ["Lucas", "Sophie", "Emma", "Noah", "Cassidy", "Mercier"];

const errors = [];
const warnings = [];

const fail = (file, msg) => errors.push(`${file} : ${msg}`);
const warn = (file, msg) => warnings.push(`${file} : ${msg}`);
const len = s => [...s].length;

/** Toutes les chaînes affichables d'une entrée de log. */
function collectText(entry) {
    const out = [];
    if (typeof entry.text === "string") out.push(entry.text);
    if (entry.beforeHour && typeof entry.beforeHour.text === "string") {
        out.push(entry.beforeHour.text);
    }
    if (Array.isArray(entry.steps)) {
        entry.steps.forEach(s => {
            if (typeof s.text === "string") out.push(s.text);
        });
    }
    return out;
}

/* ---------------------------------------------------------
   Largeurs
   --------------------------------------------------------- */

function checkWidths(file, body) {
    body.split("\n").forEach((line, i) => {
        const at = `ligne ${i + 1}`;
        const w = len(line);

        if (/^[╔╚]═+[╗╝]$/.test(line) && w !== BOX + 2) {
            fail(file, `${at} : bord de cadre de ${w} caractères, attendu ${BOX + 2}`);
        }
        if (/^║.*║$/.test(line) && w !== BOX + 2) {
            fail(file, `${at} : contenu de cadre de ${w} caractères, attendu ${BOX + 2}`);
        }
        if (/^═+$/.test(line) && w !== SECTION) {
            fail(file, `${at} : filet de section de ${w} caractères, attendu ${SECTION}`);
        }
        if (/^ ─+$/.test(line) && w !== TABLE + 1) {
            fail(file, `${at} : filet de tableau de ${w - 1} caractères, attendu ${TABLE}`);
        }
        if (line.includes("—")) {
            warn(file, `${at} : tiret cadratin, utiliser un tiret simple`);
        }
    });
}

/* ---------------------------------------------------------
   Maquette : en-tête, bloc d'identification, sections, pied
   --------------------------------------------------------- */

/** Un corps de document commence par le cadre société. */
function isDocument(body) {
    return body.startsWith("╔");
}

function checkLetterhead(file, lines) {
    const company = (lines[1] || "").replace(/^║|║$/g, "").trim();
    if (company !== COMPANY) {
        fail(file, `en-tête : ligne 2 vaut « ${company} », attendu « ${COMPANY} »`);
    }
    const title = (lines[2] || "").replace(/^║|║$/g, "").trim();
    if (!title) {
        fail(file, "en-tête : titre du document manquant en ligne 3");
    }
}

function checkIdentity(file, lines) {
    IDENTITY_FIELDS.forEach((label, i) => {
        const line = lines[5 + i] || "";
        if (!line.startsWith(label + " ")) {
            fail(file, `bloc d'identification : ligne ${6 + i} devrait porter « ${label} »`);
        }
    });
}

/** Champ de formulaire : LIBELLÉ ....... valeur, valeur en colonne 31. */
function checkFields(file, lines) {
    lines.forEach((line, i) => {
        const m = /^(\S[^.]*?) (\.{3,}) (\S.*)$/.exec(line);
        if (!m) return;
        const [, label, dots] = m;
        if (/[a-zà-ÿ]/.test(label)) return;   // paragraphe, pas un champ

        const col = len(label) + 1 + len(dots) + 1;
        if (col !== LEADER) {
            fail(
                file,
                `ligne ${i + 1} : valeur en colonne ${col + 1}, attendu ${LEADER + 1} ` +
                `(champ « ${label} »)`
            );
        }
    });
}

function checkSections(file, lines) {
    let expected = 1;
    lines.forEach((line, i) => {
        const m = /^ {2}(\d+)\. \S/.exec(line);
        if (!m) return;

        if (!/^═+$/.test(lines[i - 1] || "") || !/^═+$/.test(lines[i + 1] || "")) {
            fail(file, `ligne ${i + 1} : titre de section sans filet au-dessus et en dessous`);
        }
        if (Number(m[1]) !== expected) {
            fail(file, `ligne ${i + 1} : section numérotée ${m[1]}, attendu ${expected}`);
        }
        expected += 1;
    });
    if (expected === 1) {
        fail(file, "aucune section numérotée");
    }
}

function checkFooter(file, lines) {
    const tail = lines.slice(-6);
    const title = (tail[1] || "").trim();

    if (tail[tail.length - 1] !== "█") {
        fail(file, "le document ne se termine pas par █");
    }
    if (!FOOTER_TITLES.includes(title)) {
        fail(file, `pied de page absent ou inconnu : « ${title} »`);
    }
    if (!(tail[2] || "").includes(COMPANY)) {
        fail(file, "pied de page sans mention Fazbear Entertainment");
    }
}

/* ---------------------------------------------------------
   Contenu
   --------------------------------------------------------- */

function checkDates(file, body) {
    const re = /\b(\d{2})\/(\d{2})\/(\d{4})\b/g;
    let m;
    while ((m = re.exec(body)) !== null) {
        const year = Number(m[3]);
        if (year !== 1989 && year !== 1986 && year !== 2000) {
            warn(file, `date hors canon : ${m[0]}`);
        }
    }
}

function checkVocabulary(file, body) {
    FORBIDDEN.forEach(word => {
        if (new RegExp(`\\b${word}\\b`, "i").test(body)) {
            fail(file, `prénom hors canon : ${word}`);
        }
    });
    [
        ["Salle principale", "Dining Area"],
        ["Zone repas", "Dining Area"],
        ["Salle d'anniversaire", "Dining Area"]
    ].forEach(([wrong, right]) => {
        if (body.includes(wrong)) {
            warn(file, `salle francisée « ${wrong} », utiliser « ${right} »`);
        }
    });
}

/* ---------------------------------------------------------
   Parcours
   --------------------------------------------------------- */

function main() {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8")).logFiles;
    const onDisk = fs.readdirSync(LOGS_DIR)
        .filter(f => f.endsWith(".json"))
        .map(f => f.replace(/\.json$/, ""));

    manifest.filter(n => !onDisk.includes(n)).forEach(n => {
        fail(`${n}.json`, "déclaré dans logs_database.json mais absent du disque");
    });
    onDisk.filter(n => !manifest.includes(n)).forEach(n => {
        warn(`${n}.json`, "présent sur le disque mais absent de logs_database.json");
    });

    onDisk.forEach(name => {
        const file = `${name}.json`;
        let entry;

        try {
            entry = JSON.parse(fs.readFileSync(path.join(LOGS_DIR, file), "utf8"));
        } catch (err) {
            fail(file, `JSON invalide : ${err.message}`);
            return;
        }

        if (entry.command !== name) {
            fail(file, `command « ${entry.command} » ne correspond pas au nom de fichier`);
        }
        if (entry.type !== "text" && entry.type !== "sequence") {
            fail(file, `type « ${entry.type} » inconnu`);
        }
        if (entry.type === "text" && typeof entry.text !== "string") {
            fail(file, "type text sans champ text");
        }
        if (entry.type === "sequence" && !Array.isArray(entry.steps)) {
            fail(file, "type sequence sans champ steps");
        }
        if (typeof entry.minHour === "number" && !entry.beforeHour) {
            warn(file, "minHour sans beforeHour : le joueur n'aura aucun retour");
        }

        collectText(entry).forEach(body => {
            checkWidths(file, body);
            checkDates(file, body);
            checkVocabulary(file, body);

            if (!isDocument(body)) return;

            const lines = body.split("\n");
            checkLetterhead(file, lines);
            checkIdentity(file, lines);
            checkFields(file, lines);
            checkSections(file, lines);

            // Une séquence est un document interrompu : pas de pied de page.
            if (entry.type === "text") checkFooter(file, lines);
        });
    });

    warnings.forEach(w => console.log(`AVERTISSEMENT  ${w}`));
    errors.forEach(e => console.log(`ERREUR         ${e}`));

    console.log(
        `\n${onDisk.length} logs contrôlés, ` +
        `${errors.length} erreur(s), ${warnings.length} avertissement(s).`
    );
    process.exit(errors.length > 0 ? 1 : 0);
}

main();
