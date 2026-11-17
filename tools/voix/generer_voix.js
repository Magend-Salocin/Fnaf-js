// Génère les voix à partir des textes de ressources/voix_<personnage>/textes/.
//
// Convention des textes : un passage entre parenthèses reste à l'endroit,
// tout le reste est inversé. "..." marque une pause.
//
// Usage :
//   node tools/voix/generer_voix.js                       tous les textes de voix_cassidy
//   node tools/voix/generer_voix.js <fichier.txt> [...]   seulement ces textes
//
// Chaque texte produit dans sorties/ :
//   <nom>.wav          version de jeu (inversée, sauf les parenthèses)
//   <nom>_endroit.wav  version de contrôle, tout à l'endroit
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const DEFAULT_VOICE_DIR = path.join(__dirname, "..", "..", "ressources", "voix_cassidy");

/* ---------- Texte ---------- */

function parseSegments(text) {
  const flat = text.replace(/\s+/g, " ").trim();
  const segments = [];
  let last = 0;
  for (const match of flat.matchAll(/\(([^)]*)\)/g)) {
    pushSegment(segments, "inverse", flat.slice(last, match.index));
    pushSegment(segments, "endroit", match[1]);
    last = match.index + match[0].length;
  }
  pushSegment(segments, "inverse", flat.slice(last));
  return segments;
}

function pushSegment(segments, direction, text) {
  const trimmed = text.trim();
  if (trimmed && trimmed !== "...") segments.push({ direction, text: trimmed });
}

/* ---------- WAV ---------- */

function readPcm(file) {
  const buf = fs.readFileSync(file);
  let offset = 12;
  while (offset < buf.length) {
    const id = buf.toString("ascii", offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    if (id === "data") {
      const pcm = new Int16Array(buf.buffer.slice(buf.byteOffset + offset + 8, buf.byteOffset + offset + 8 + size));
      return Float32Array.from(pcm, v => v / 32768);
    }
    offset += 8 + size;
  }
  throw new Error(`Pas de bloc data : ${file}`);
}

function writeWav(file, rate, samples) {
  const pcm = Int16Array.from(samples, v => Math.max(-32768, Math.min(32767, Math.round(v * 32767))));
  const header = Buffer.alloc(44);
  header.write("RIFF", 0); header.writeUInt32LE(36 + pcm.length * 2, 4); header.write("WAVE", 8);
  header.write("fmt ", 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24); header.writeUInt32LE(rate * 2, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
  header.write("data", 36); header.writeUInt32LE(pcm.length * 2, 40);
  fs.writeFileSync(file, Buffer.concat([header, Buffer.from(pcm.buffer)]));
}

/* ---------- Traitement ---------- */

function assemble(chunks, rate, config, reverse, noiseLevel) {
  const silence = seconds => new Float32Array(Math.round(rate * seconds));
  const parts = [silence(config.silenceDebut)];
  for (const { direction, pcm } of chunks) {
    parts.push(reverse && direction === "inverse" ? pcm.slice().reverse() : pcm, silence(config.pauseEntreSegments));
  }
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Float32Array(total);
  let pos = 0;
  for (const p of parts) { out.set(p, pos); pos += p.length; }
  for (let i = 0; i < out.length; i++) {
    out[i] = out[i] * 0.85 + ((Math.random() * 2 - 1) * noiseLevel) / 32768;
  }
  return out;
}

// Allonge le signal d'un facteur k sans changer sa hauteur (WSOLA).
function timeStretch(x, k) {
  const N = 1024, Hs = N / 2, Ha = Hs / k, delta = 256;
  const win = Float32Array.from({ length: N }, (_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N));
  const outLen = Math.ceil(x.length * k) + N;
  const out = new Float32Array(outLen);
  const norm = new Float32Array(outLen);
  let prev = 0;
  for (let m = 0; m * Hs + N < outLen; m++) {
    const nominal = Math.round(m * Ha);
    let best = nominal;
    if (m > 0) {
      const target = prev + Hs;
      let bestScore = -Infinity;
      for (let d = -delta; d <= delta; d += 2) {
        const cand = nominal + d;
        if (cand < 0 || cand + N >= x.length || target + N >= x.length) continue;
        let score = 0;
        for (let i = 0; i < N; i += 4) score += x[cand + i] * x[target + i];
        if (score > bestScore) { bestScore = score; best = cand; }
      }
    }
    if (best + N >= x.length) break;
    const pos = m * Hs;
    for (let i = 0; i < N; i++) { out[pos + i] += x[best + i] * win[i]; norm[pos + i] += win[i]; }
    prev = best;
  }
  for (let i = 0; i < outLen; i++) if (norm[i] > 1e-3) out[i] /= norm[i];
  return out;
}

function resample(x, k) {
  const out = new Float32Array(Math.floor(x.length / k));
  for (let i = 0; i < out.length; i++) {
    const p = i * k, j = Math.floor(p), f = p - j;
    out[i] = (x[j] || 0) * (1 - f) + (x[j + 1] || 0) * f;
  }
  return out;
}

function highPass(x, rate, freq) {
  const w = (2 * Math.PI * freq) / rate, a = Math.sin(w) / (2 * Math.SQRT1_2), c = Math.cos(w);
  const b0 = (1 + c) / 2, b1 = -(1 + c), b2 = (1 + c) / 2, a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
}

function finalize(x, rate, config) {
  let y = resample(timeStretch(x, config.decalageHauteur), config.decalageHauteur);
  y = highPass(y, rate, config.passeHaut);
  let peak = 0;
  for (const v of y) peak = Math.max(peak, Math.abs(v));
  if (peak > 0) for (let i = 0; i < y.length; i++) y[i] *= config.niveauCrete / peak;
  return y;
}

/* ---------- Génération ---------- */

function synthesize(segments, config) {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "voix-"));
  fs.writeFileSync(path.join(workDir, "segments.json"), JSON.stringify(segments), "utf8");
  const result = spawnSync("powershell", [
    "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", path.join(__dirname, "synthese.ps1"),
    "-Dir", workDir, "-Voice", config.voix, "-Rate", config.vitesse,
    "-Pitch", config.hauteurSsml, "-Pause", config.pauseTexte, "-SampleRate", String(config.frequence)
  ], { stdio: "inherit" });
  if (result.status !== 0) throw new Error("Échec de la synthèse vocale");
  const chunks = segments.map((segment, i) => ({
    direction: segment.direction,
    pcm: readPcm(path.join(workDir, `seg_${String(i).padStart(2, "0")}.wav`))
  }));
  fs.rmSync(workDir, { recursive: true, force: true });
  return chunks;
}

function generate(textFile, voiceDir, config) {
  const name = path.basename(textFile, ".txt");
  const segments = parseSegments(fs.readFileSync(textFile, "utf8"));
  const chunks = synthesize(segments, config);
  const outDir = path.join(voiceDir, "sorties");
  fs.mkdirSync(outDir, { recursive: true });

  const rate = config.frequence;
  const game = finalize(assemble(chunks, rate, config, true, config.souffle.jeu), rate, config);
  const forward = finalize(assemble(chunks, rate, config, false, config.souffle.endroit), rate, config);
  writeWav(path.join(outDir, `${name}.wav`), rate, game);
  writeWav(path.join(outDir, `${name}_endroit.wav`), rate, forward);
  console.log(`${name} : ${segments.length} segments, ${(game.length / rate).toFixed(1)} s`);
}

function main() {
  const args = process.argv.slice(2);
  const textFiles = args.length > 0
    ? args.map(f => path.resolve(f))
    : fs.readdirSync(path.join(DEFAULT_VOICE_DIR, "textes"))
        .filter(f => f.endsWith(".txt"))
        .map(f => path.join(DEFAULT_VOICE_DIR, "textes", f));

  for (const textFile of textFiles) {
    const voiceDir = path.dirname(path.dirname(textFile));
    const config = JSON.parse(fs.readFileSync(path.join(voiceDir, "config.json"), "utf8"));
    generate(textFile, voiceDir, config);
  }
}

main();
