// Convertisseur Markdown vers HTML, limité à ce qu'utilise la documentation du projet :
// titres, paragraphes, listes (imbriquées), tableaux, blocs de code, schémas Mermaid, citations, séparateurs,
// et en ligne : code, gras, italique (*texte*), liens, images.
const path = require("path");
const { pathToFileURL } = require("url");

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// baseDir : dossier du fichier Markdown, pour résoudre les images relatives.
function renderInline(text, baseDir) {
  const codes = [];
  let html = escapeHtml(text).replace(/`([^`]+)`/g, (_, code) => {
    codes.push(`<code>${code}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  html = html
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => `<img alt="${alt}" src="${resolveAsset(src, baseDir)}">`)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="lien">$1</span>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  return html.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[i]);
}

function resolveAsset(src, baseDir) {
  if (/^[a-z]+:/i.test(src)) return src;
  return pathToFileURL(path.resolve(baseDir, decodeURIComponent(src))).href;
}

const LIST_ITEM = /^(\s*)([-*]|\d+\.)\s+(.*)$/;
const splitRow = line => line.trim().replace(/^\||\|$/g, "").split("|").map(cell => cell.trim());

function renderList(lines, start, baseDir) {
  const indent = lines[start].match(LIST_ITEM)[1].length;
  const ordered = /\d/.test(lines[start].match(LIST_ITEM)[2]);
  const items = [];
  let i = start;
  while (i < lines.length) {
    const match = lines[i].match(LIST_ITEM);
    if (!match || match[1].length < indent) break;
    if (match[1].length > indent) {
      const nested = renderList(lines, i, baseDir);
      items[items.length - 1] += nested.html;
      i = nested.end;
      continue;
    }
    items.push(renderInline(match[3], baseDir));
    i++;
    // Ligne de continuation d'un élément (texte indenté sans puce).
    while (i < lines.length && /^\s+\S/.test(lines[i]) && !LIST_ITEM.test(lines[i])) {
      items[items.length - 1] += " " + renderInline(lines[i].trim(), baseDir);
      i++;
    }
  }
  const tag = ordered ? "ol" : "ul";
  return { html: `<${tag}>${items.map(item => `<li>${item}</li>`).join("")}</${tag}>`, end: i };
}

function renderMarkdown(source, baseDir) {
  const lines = source.split(/\r?\n/);
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    if (line.startsWith("```")) {
      const isMermaid = line.slice(3).trim() === "mermaid";
      const code = [];
      for (i++; i < lines.length && !lines[i].startsWith("```"); i++) code.push(lines[i]);
      // Un schéma Mermaid est dessiné à l'impression (voir imprimer_doc.js).
      out.push(isMermaid
        ? `<div class="schema"><pre class="mermaid">${escapeHtml(code.join("\n"))}</pre></div>`
        : `<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      i++;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${renderInline(heading[2], baseDir)}</h${level}>`);
      i++;
      continue;
    }

    if (/^(-{3,}|\*{3,})\s*$/.test(line)) { out.push("<hr>"); i++; continue; }

    if (line.trim().startsWith("|") && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1] || "")) {
      const header = splitRow(line);
      const rows = [];
      for (i += 2; i < lines.length && lines[i].trim().startsWith("|"); i++) rows.push(splitRow(lines[i]));
      const cells = (row, tag) => row.map(cell => `<${tag}>${renderInline(cell, baseDir)}</${tag}>`).join("");
      // Tableau court (peu de lignes, peu de texte) : imprimé d'un bloc, pour ne pas laisser
      // un en-tête seul en bas de page. Un tableau plus lourd se coupe entre deux lignes.
      const textLength = rows.flat().join("").length;
      const tableClass = rows.length <= 8 && textLength <= 500 ? ' class="courte"' : "";
      out.push(`<table${tableClass}><thead><tr>${cells(header, "th")}</tr></thead><tbody>${rows.map(row => `<tr>${cells(row, "td")}</tr>`).join("")}</tbody></table>`);
      continue;
    }

    if (LIST_ITEM.test(line)) {
      const list = renderList(lines, i, baseDir);
      out.push(list.html);
      i = list.end;
      continue;
    }

    if (line.startsWith(">")) {
      const quote = [];
      for (; i < lines.length && lines[i].startsWith(">"); i++) quote.push(lines[i].replace(/^>\s?/, ""));
      out.push(`<blockquote>${renderMarkdown(quote.join("\n"), baseDir)}</blockquote>`);
      continue;
    }

    const paragraph = [];
    for (; i < lines.length && lines[i].trim() && !/^(#{1,6}\s|```|>|\s*\||(-{3,}|\*{3,})\s*$)/.test(lines[i]) && !LIST_ITEM.test(lines[i]); i++) {
      paragraph.push(lines[i].trim());
    }
    out.push(`<p>${renderInline(paragraph.join(" "), baseDir)}</p>`);
  }
  return out.join("\n");
}

module.exports = { renderMarkdown, escapeHtml };
