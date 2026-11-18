// Décor de page : texture tachée du papier (PNG, en fond CSS), rond de café et éclaboussures rouges (SVG),
// et le filtre qui use l'encre des titres. Tirages aléatoires à graine fixe :
// un même document donne toujours le même décor.
//
// La texture est un PNG calculé ici : un filtre SVG feTurbulence sur toute la page
// s'imprime en noir dans Chromium.
const { PNG } = require("pngjs");

function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Bruit lissé : une grille de valeurs aléatoires, interpolée en douceur.
function valueNoise(width, height, cell, random) {
  const cols = Math.ceil(width / cell) + 2, rows = Math.ceil(height / cell) + 2;
  const grid = Float32Array.from({ length: cols * rows }, random);
  const smooth = t => t * t * (3 - 2 * t);
  return (x, y) => {
    const gx = x / cell, gy = y / cell, i = Math.floor(gx), j = Math.floor(gy);
    const fx = smooth(gx - i), fy = smooth(gy - j);
    const at = (a, b) => grid[b * cols + a];
    const top = at(i, j) * (1 - fx) + at(i + 1, j) * fx;
    const bottom = at(i, j + 1) * (1 - fx) + at(i + 1, j + 1) * fx;
    return top * (1 - fy) + bottom * fy;
  };
}

// Texture d'une page A4 entière : grandes taches brunes, marbrure moyenne et grain fin, sur fond transparent.
function paperTexture(seed, width = 630, height = 891) {
  const random = seededRandom(seed);
  const octaves = [[160, 0.5], [60, 0.3], [18, 0.2]].map(([cell, weight]) => ({ noise: valueNoise(width, height, cell, random), weight }));
  const png = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let n = 0;
      for (const o of octaves) n += o.noise(x, y) * o.weight;
      const stain = Math.max(0, (n - 0.55) * 2);
      const grain = random() * 0.07;
      const p = (y * width + x) * 4;
      png.data[p] = 120; png.data[p + 1] = 78; png.data[p + 2] = 32;
      png.data[p + 3] = Math.round(Math.min(1, stain * 0.3 + grain) * 255);
    }
  }
  return "data:image/png;base64," + PNG.sync.write(png).toString("base64");
}

const round = n => Math.round(n * 100) / 100;

// Une éclaboussure : une goutte principale, des gouttelettes projetées dans une direction,
// quelques traînées allongées. Coordonnées en millimètres de page.
function splatter(cx, cy, size, angle, random) {
  const shapes = [`<circle cx="${cx}" cy="${cy}" r="${round(size)}"/>`];
  for (let i = 0; i < 4; i++) {
    const a = random() * Math.PI * 2;
    const d = size * (0.4 + random() * 0.5);
    shapes.push(`<circle cx="${round(cx + Math.cos(a) * d)}" cy="${round(cy + Math.sin(a) * d)}" r="${round(size * (0.4 + random() * 0.35))}"/>`);
  }
  for (let i = 0; i < 18; i++) {
    const a = angle + (random() - 0.5) * 2.2;
    const d = size * (1.4 + random() * 4.5);
    const r = size * (0.04 + random() * 0.16) * (1 - d / (size * 7));
    shapes.push(`<circle cx="${round(cx + Math.cos(a) * d)}" cy="${round(cy + Math.sin(a) * d)}" r="${round(Math.max(0.15, r))}"/>`);
  }
  for (let i = 0; i < 3; i++) {
    const a = angle + (random() - 0.5) * 1.4;
    const d = size * (1.1 + random() * 1.2);
    const deg = round((a * 180) / Math.PI);
    shapes.push(`<ellipse cx="${round(cx + Math.cos(a) * d)}" cy="${round(cy + Math.sin(a) * d)}" rx="${round(size * 0.9)}" ry="${round(size * 0.12)}" transform="rotate(${deg} ${round(cx + Math.cos(a) * d)} ${round(cy + Math.sin(a) * d)})"/>`);
  }
  return shapes.join("");
}

// Calque de fond de la zone imprimable (210 x 283 mm : A4 moins la bande du numéro de page).
function pageDecor(seed) {
  const random = seededRandom(seed);
  const blood = [
    splatter(196, 10, 4.5, Math.PI * 0.75, random),
    splatter(205, 70, 2.2, Math.PI, random),
    splatter(8, 272, 3.2, -Math.PI / 4, random),
    splatter(30, 280, 1.2, -Math.PI / 2, random),
  ].join("");

  return `<svg class="decor" viewBox="0 0 210 283" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="bavure">
      <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="${seed + 2}"/>
      <feDisplacementMap in="SourceGraphic" scale="1.2"/>
    </filter>
    <filter id="cafe">
      <feTurbulence type="fractalNoise" baseFrequency="0.25" numOctaves="3" seed="${seed + 3}"/>
      <feDisplacementMap in="SourceGraphic" scale="3"/>
    </filter>
  </defs>
  <g fill="none" stroke="#7a4a1c" filter="url(#cafe)" opacity="0.32">
    <circle cx="180" cy="238" r="20" stroke-width="1.6"/>
    <circle cx="180.6" cy="238.4" r="18.6" stroke-width="0.5" opacity="0.6"/>
    <path d="M 162 224 A 22 22 0 0 1 198 226" stroke-width="2.4" opacity="0.5"/>
  </g>
  <g fill="#9e1510" filter="url(#bavure)" opacity="0.88">${blood}</g>
</svg>`;
}

// Filtre appliqué aux titres : l'encre manque par endroits, comme un tampon usé.
const INK_FILTER = `<svg width="0" height="0" style="position:absolute">
  <filter id="encre-usee">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="bruit"/>
    <feColorMatrix in="bruit" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 2.3" result="masque"/>
    <feComposite in="SourceGraphic" in2="masque" operator="in"/>
  </filter>
</svg>`;

module.exports = { pageDecor, paperTexture, INK_FILTER };
