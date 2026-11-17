// Génère les audios parlés à partir des textes de ressources/voix/textes/.
// Format des textes et réglages : voir ressources/voix/README.md.
//
// Usage :
//   node tools/voix/generer_voix.js                       tous les textes
//   node tools/voix/generer_voix.js <fichier.txt> [...]   seulement ces textes
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const VOICE_DIR = path.join(ROOT, "ressources", "voix");

/* ---------- Lecture des textes ---------- */

function parseScript(raw) {
  const script = { mode: "cassette", defaultVoice: null, items: [] };
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("!mode ")) { script.mode = line.slice(6).trim(); continue; }
    if (line.startsWith("!voix ")) { script.defaultVoice = line.slice(6).trim(); continue; }
    if (/^\[[^\]]+\]$/.test(line)) { script.items.push({ type: "bruit", tag: line.slice(1, -1).trim() }); continue; }

    const speaker = line.match(/^@(\S+)\s+(.*)$/);
    const voice = speaker ? speaker[1] : script.defaultVoice;
    const text = speaker ? speaker[2] : line;
    if (!voice) throw new Error(`Ligne sans voix : ${line}`);

    const last = script.items[script.items.length - 1];
    if (last && last.type === "voix" && last.voice === voice) last.text += " " + text;
    else script.items.push({ type: "voix", voice, text });
  }
  return script;
}

// En mode inverse, un passage entre parenthèses reste à l'endroit.
function splitDirections(text) {
  const parts = [];
  let last = 0;
  const push = (reversed, chunk) => {
    const t = chunk.trim();
    if (t && t !== "...") parts.push({ reversed, text: t });
  };
  for (const match of text.matchAll(/\(([^)]*)\)/g)) {
    push(true, text.slice(last, match.index));
    push(false, match[1]);
    last = match.index + match[0].length;
  }
  push(true, text.slice(last));
  return parts;
}

/* ---------- WAV ---------- */

function readWav(file) {
  const buf = fs.readFileSync(file);
  let offset = 12, rate = 0, channels = 1;
  while (offset + 8 <= buf.length) {
    const id = buf.toString("ascii", offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    if (id === "fmt ") { channels = buf.readUInt16LE(offset + 10); rate = buf.readUInt32LE(offset + 12); }
    if (id === "data") {
      const frames = Math.floor(size / 2 / channels);
      const samples = new Float32Array(frames);
      for (let i = 0; i < frames; i++) samples[i] = buf.readInt16LE(offset + 8 + i * channels * 2) / 32768;
      return { rate, samples };
    }
    offset += 8 + size + (size % 2);
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

/* ---------- Traitement du signal ---------- */

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

function resample(x, ratio) {
  const out = new Float32Array(Math.floor(x.length / ratio));
  for (let i = 0; i < out.length; i++) {
    const p = i * ratio, j = Math.floor(p), f = p - j;
    out[i] = (x[j] || 0) * (1 - f) + (x[j + 1] || 0) * f;
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

function biquad(x, rate, type, freq) {
  const w = (2 * Math.PI * freq) / rate, a = Math.sin(w) / (2 * Math.SQRT1_2), c = Math.cos(w);
  const [b0, b1, b2] = type === "hp" ? [(1 + c) / 2, -(1 + c), (1 + c) / 2] : [(1 - c) / 2, 1 - c, (1 - c) / 2];
  const a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
}

function normalize(x, peakTarget) {
  let peak = 0;
  for (const v of x) peak = Math.max(peak, Math.abs(v));
  if (peak > 0) for (let i = 0; i < x.length; i++) x[i] *= peakTarget / peak;
  return x;
}

function applyVoiceEffects(x, rate, fx, random) {
  if (fx.hauteur && fx.hauteur !== 1) x = resample(timeStretch(x, fx.hauteur), fx.hauteur);
  if (fx.echantillonnage) {
    const step = Math.max(1, Math.round(rate / fx.echantillonnage.frequence));
    const levels = 2 ** (fx.echantillonnage.bits - 1);
    for (let i = 0; i < x.length; i++) x[i] = Math.round(x[i - (i % step)] * levels) / levels;
  }
  if (fx.anneau) {
    const { frequence, melange } = fx.anneau;
    for (let i = 0; i < x.length; i++) {
      x[i] = x[i] * (1 - melange) + x[i] * Math.sin((2 * Math.PI * frequence * i) / rate) * melange;
    }
  }
  if (fx.passeHaut) x = biquad(x, rate, "hp", fx.passeHaut);
  if (fx.passeBas) x = biquad(x, rate, "lp", fx.passeBas);
  if (fx.glitch) x = applyGlitch(x, rate, fx.glitch, random);
  if (fx.grain) for (let i = 0; i < x.length; i++) x[i] += (random() * 2 - 1) * fx.grain;
  return x;
}

// Toutes les 100 ms, une chance de couper un instant ou de répéter un court fragment.
function applyGlitch(x, rate, glitch, random) {
  const block = Math.round(rate * 0.1);
  for (let start = block; start + 3 * block < x.length; start += block) {
    const roll = random();
    if (roll < glitch.coupure) {
      x.fill(0, start, start + Math.round(rate * (0.02 + random() * 0.05)));
    } else if (roll < glitch.coupure + glitch.repetition) {
      const len = Math.round(rate * (0.03 + random() * 0.04));
      const grain = x.slice(start, start + len);
      for (let r = 1; r <= 2; r++) x.set(grain, start + r * len);
      start += 2 * len;
    }
  }
  return x;
}

/* ---------- Synthèse ---------- */

function synthesizeAll(requests, config) {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "voix-"));
  for (const engine of ["sapi", "winrt"]) {
    const batch = requests.filter(r => r.engine === engine);
    if (batch.length === 0) continue;
    fs.writeFileSync(path.join(workDir, "segments.json"), JSON.stringify(batch), "utf8");
    const args = ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", path.join(__dirname, `synthese_${engine}.ps1`),
      "-Dir", workDir, "-Pause", config.pauseTexte];
    if (engine === "sapi") args.push("-SampleRate", String(config.frequence));
    const result = spawnSync("powershell", args, { stdio: "inherit" });
    if (result.status !== 0) throw new Error(`Échec de la synthèse (${engine})`);
  }
  const audio = new Map();
  for (const r of requests) {
    const { rate, samples } = readWav(path.join(workDir, r.fichier));
    audio.set(r.fichier, rate === config.frequence ? samples : resample(samples, rate / config.frequence));
  }
  fs.rmSync(workDir, { recursive: true, force: true });
  return audio;
}

function buildSpeechSegments(script, config) {
  const segments = [];
  for (const item of script.items) {
    if (item.type !== "voix") { segments.push(item); continue; }
    const parts = script.mode === "inverse" ? splitDirections(item.text) : [{ reversed: false, text: item.text }];
    for (const part of parts) segments.push({ type: "voix", voice: item.voice, ...part });
  }
  const requests = segments
    .filter(s => s.type === "voix")
    .map((s, i) => {
      const profile = config.voix[s.voice];
      if (!profile) throw new Error(`Voix inconnue : ${s.voice}`);
      s.fichier = `seg_${String(i).padStart(3, "0")}.wav`;
      return { fichier: s.fichier, engine: profile.moteur, voix: profile.nom, vitesse: profile.vitesse,
        hauteur: profile.hauteurSsml || "medium", texte: s.text };
    });
  return { segments, requests };
}

/* ---------- Bruitages ---------- */

const soundCache = new Map();

function loadSound(file, rate) {
  if (!soundCache.has(file)) {
    const { rate: srcRate, samples } = readWav(path.join(ROOT, file));
    soundCache.set(file, srcRate === rate ? samples : resample(samples, srcRate / rate));
  }
  return soundCache.get(file);
}

function renderSoundEffect(tag, config) {
  const rate = config.frequence;
  const upper = tag.toUpperCase();
  const rule = config.bruitages.find(b => upper.includes(b.motif));
  if (!rule) {
    console.warn(`  bruitage non associé, remplacé par un silence : [${tag}]`);
    return new Float32Array(Math.round(rate * 0.5));
  }
  if (rule.silence) return new Float32Array(Math.round(rate * rule.silence));

  const source = loadSound(rule.fichier, rate);
  const start = Math.round((rule.debut || 0) * rate);
  const clip = normalize(source.slice(start, start + Math.round(rule.duree * rate)), rule.niveau);
  const fade = Math.min(Math.round(rate * 0.03), Math.floor(clip.length / 2));
  for (let i = 0; i < fade; i++) { clip[i] *= i / fade; clip[clip.length - 1 - i] *= i / fade; }
  return clip;
}

/* ---------- Assemblage ---------- */

function assemble(segments, audio, config, reverse, breath) {
  const rate = config.frequence;
  const parts = [new Float32Array(Math.round(rate * config.silenceDebut))];
  const gap = new Float32Array(Math.round(rate * config.pauseEntreSegments));
  segments.forEach((s, i) => {
    if (s.type === "bruit") { parts.push(renderSoundEffect(s.tag, config)); return; }
    const profile = config.voix[s.voice];
    const random = seededRandom((profile.effets.glitch?.graine || 1) + i);
    let x = applyVoiceEffects(Float32Array.from(audio.get(s.fichier)), rate, profile.effets, random);
    x = normalize(x, profile.niveau);
    if (reverse && s.reversed) x.reverse();
    parts.push(x, gap);
  });
  parts.push(new Float32Array(Math.round(rate * config.silenceFin)));

  const out = new Float32Array(parts.reduce((n, p) => n + p.length, 0));
  let pos = 0;
  for (const p of parts) { out.set(p, pos); pos += p.length; }
  const random = seededRandom(7);
  for (let i = 0; i < out.length; i++) out[i] += (random() * 2 - 1) * breath;
  return normalize(out, config.niveauFinal);
}

function generate(textFile, config) {
  const name = path.basename(textFile, ".txt");
  const script = parseScript(fs.readFileSync(textFile, "utf8"));
  const { segments, requests } = buildSpeechSegments(script, config);
  const audio = synthesizeAll(requests, config);
  const outDir = path.join(VOICE_DIR, "sorties");
  fs.mkdirSync(outDir, { recursive: true });
  const rate = config.frequence;
  const mode = config.modes[script.mode];
  if (!mode) throw new Error(`Mode inconnu : ${script.mode}`);

  if (script.mode === "inverse") {
    const game = assemble(segments, audio, config, true, mode.souffle);
    writeWav(path.join(outDir, `${name}.wav`), rate, game);
    writeWav(path.join(outDir, `${name}_endroit.wav`), rate, assemble(segments, audio, config, false, mode.souffleEndroit));
    console.log(`${name} : ${(game.length / rate).toFixed(1)} s`);
  } else {
    const tape = assemble(segments, audio, config, false, mode.souffle);
    writeWav(path.join(outDir, `${name}.wav`), rate, tape);
    console.log(`${name} : ${(tape.length / rate).toFixed(1)} s`);
  }
}

function main() {
  const config = JSON.parse(fs.readFileSync(path.join(VOICE_DIR, "config.json"), "utf8"));
  const args = process.argv.slice(2);
  const textFiles = args.length > 0
    ? args.map(f => path.resolve(f))
    : fs.readdirSync(path.join(VOICE_DIR, "textes")).filter(f => f.endsWith(".txt")).map(f => path.join(VOICE_DIR, "textes", f));
  for (const textFile of textFiles) generate(textFile, config);
}

main();
