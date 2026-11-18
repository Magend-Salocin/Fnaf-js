/*
 * Génère les vues Markdown des événements cachés à partir des JSON du jeu.
 *
 * Usage : node tools/vues_evenements.js
 *
 * Sources (les seules à éditer) :
 *   script/config/random_events_data.json   les événements
 *   script/config/rewards_data.json         réserves de récompenses et chaînes
 *   script/config/tapes_data.json, journals_data.json, logs_database.json
 *
 * Vues écrites dans .github/Projet/04 - Production/ (ne pas les éditer à la main) :
 *   Evenements_Production.md     images et sons à produire
 *   Evenements_Declenchement.md  quand et avec quelle probabilité chaque événement sort
 *   Evenements_Recompenses.md    ce que rapportent les anomalies
 *   Evenements_Controle.md       incohérences à corriger ou à trancher
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, '.github', 'Projet', '04 - Production');
const ROOMS_DIR = path.join(ROOT, 'images', 'rooms');

const readJson = file => JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
const events = readJson('script/config/random_events_data.json');
const rewards = readJson('script/config/rewards_data.json');
const tapes = readJson('script/config/tapes_data.json');
const journals = readJson('script/config/journals_data.json');
const logFiles = readJson('script/config/logs_database.json').logFiles;
const soundIds = new Set(readJson('script/config/game_sounds.json').map(s => s.id));

// Une heure de jeu = 60 minutes de 120 ticks à 60 images/s = 120 s réelles.
const SECONDS_PER_HOUR = 120;
const SILENCE_THRESHOLD_SECONDS = 8;
const PLACEHOLDER_SOUND = 'laugh_girl1';
const CHILD_NAMES = { GAB: 'Gabriel', JER: 'Jeremy', SUS: 'Susie', FRT: 'Fritz', CASSIDY: 'Cassidy' };
const KIND_LABELS = { tape: 'Cassette', journal: 'Journal', log: 'Log' };

/* ---------- Lecture du moteur ---------- */

// EVENT_ROOM_MAP est défini en JS dans le loader : on en extrait les dossiers et caméras.
function readEventRoomMap() {
  const source = fs.readFileSync(path.join(ROOT, 'script/loaders/random_events_data.js'), 'utf8');
  const map = {};
  for (const m of source.matchAll(/"([^"]+)":\s*\{\s*cameraId:\s*(null|"[^"]*"),\s*folder:\s*(null|"[^"]*")/g)) {
    map[m[1]] = { cameraId: JSON.parse(m[2]), folder: JSON.parse(m[3]) };
  }
  return map;
}
const ROOM_MAP = readEventRoomMap();

// Copies de parseTrigger() et parseHourRange() (script/loaders/random_events_data.js).
function parseTrigger(str) {
  const s = (str || '').toLowerCase();
  if (s.includes('retour')) return { type: 'cameraReturn', duration: 0 };
  if (s.includes('silence')) return { type: 'silence', duration: 0 };
  if (s.includes('heure')) return { type: 'time', duration: 0 };
  const m = s.match(/(?:observer|écoute|ecoute)\s+(\d+)\s*s/);
  if (m) return { type: 'observeDuration', duration: parseInt(m[1], 10) };
  return { type: 'observe', duration: 0 };
}

function parseHourRange(str) {
  if (!str || /toute nuit/i.test(str)) return { start: 0, end: 6 };
  const toDecimal = h => {
    const m = h.match(/(\d{1,2})h(\d{2})?/i);
    return m ? parseInt(m[1], 10) + (m[2] ? parseInt(m[2], 10) : 0) / 60 : null;
  };
  const parts = str.split(/[-–]/).map(s => s.trim());
  const start = toDecimal(parts[0]);
  const end = parts.length > 1 ? toDecimal(parts[1]) : (start !== null ? start + 1 : 6);
  return { start: start ?? 0, end: end ?? 6 };
}

/* ---------- Analyse ---------- */

const childOf = event => {
  const prefix = event.id.split('-')[0];
  return CHILD_NAMES[prefix] ? prefix : null;
};

function imageStatus(event) {
  if (!event.image) return { state: 'aucune' };
  const room = ROOM_MAP[event.roomLabel];
  if (!room) return { state: 'salle inconnue' };
  if (!room.folder) return { state: 'non affichable', detail: 'vue bureau, aucune caméra' };
  if (fs.existsSync(path.join(ROOMS_DIR, room.folder, 'hidden', event.image))) return { state: 'présente' };
  const elsewhere = fs.readdirSync(ROOMS_DIR).find(dir =>
    fs.existsSync(path.join(ROOMS_DIR, dir, 'hidden', event.image)));
  if (elsewhere) return { state: 'mal rangée', detail: `dans ${elsewhere}, attendue dans ${room.folder}` };
  return { state: 'à produire', detail: room.folder };
}

function soundStatus(event) {
  if (!event.sound) return 'aucun';
  if (!soundIds.has(event.sound)) return 'inconnu';
  if (event.sound === PLACEHOLDER_SOUND) return 'provisoire';
  return 'fait';
}

const atLeastOnce = (chance, draws) => 1 - Math.pow(1 - chance, Math.max(0, draws));
const percent = p => `${Math.round(p * 100)} %`;

// Probabilité de voir l'événement : effort court, puis fenêtre horaire entière.
function probabilities(event) {
  const trigger = parseTrigger(event.triggerStr);
  const range = parseHourRange(event.hourStr);
  const windowSeconds = Math.round((Math.min(range.end, 6) - range.start) * SECONDS_PER_HOUR);
  const c = event.chance;
  switch (trigger.type) {
    case 'observe':
      return { trigger, windowSeconds, short: percent(atLeastOnce(c, 10)), shortLabel: '10 s sur la caméra', full: percent(atLeastOnce(c, windowSeconds)) };
    case 'observeDuration':
      return { trigger, windowSeconds, short: percent(atLeastOnce(c, 10)), shortLabel: `${trigger.duration + 10} s d'affilée`, full: percent(atLeastOnce(c, windowSeconds - trigger.duration)) };
    case 'cameraReturn':
      return { trigger, windowSeconds, short: percent(atLeastOnce(c, 5)), shortLabel: '5 passages', full: `${percent(atLeastOnce(c, 20))} (20 passages)` };
    case 'silence':
      return { trigger, windowSeconds, short: percent(atLeastOnce(c, 10)), shortLabel: `${SILENCE_THRESHOLD_SECONDS + 10} s sans agir`, full: percent(atLeastOnce(c, windowSeconds - SILENCE_THRESHOLD_SECONDS)) };
    default:
      return { trigger, windowSeconds, short: 'automatique', shortLabel: '', full: percent(atLeastOnce(c, windowSeconds)) };
  }
}

const chainByFinalEvent = Object.fromEntries(rewards.chains.filter(c => c.finalEvent).map(c => [c.finalEvent, c]));
const nights = [...new Set(events.map(e => e.night))].sort((a, b) => a - b);
const nightTitle = n => (n === 0 ? 'Nuit 0 (legacy, toutes les nuits)' : `Nuit ${n}`);

/* ---------- Écriture ---------- */

const cell = v => (v === null || v === undefined ? '' : String(v).replace(/\|/g, '/').replace(/\n/g, ' '));
const row = values => `| ${values.map(cell).join(' | ')} |`;
const table = (headers, rows) => [row(headers), row(headers.map(() => '---')), ...rows.map(row)].join('\n');

function header(title, purpose) {
  return [
    `# ${title}`,
    '',
    `${purpose}`,
    '',
    `Vue générée le ${new Date().toLocaleDateString('fr-FR')} par \`node tools/vues_evenements.js\` à partir des JSON de \`script/config/\`. Ne pas éditer : modifier le JSON, puis relancer le script.`,
    '',
  ].join('\n');
}

function write(fileName, content) {
  fs.writeFileSync(path.join(OUT_DIR, fileName), content.trimEnd() + '\n');
  console.log(`Écrit : ${fileName}`);
}

/* ---------- Vue 1 : production ---------- */

function productionView() {
  const analysed = events.map(e => ({ e, image: imageStatus(e), sound: soundStatus(e) }));
  const count = (pred) => analysed.filter(pred).length;
  const out = [header('Événements : production', 'Images et sons qui restent à produire. Les prompts des images sont dans [Prompts_Images_Cachees.md](Prompts_Images_Cachees.md), la procédure dans le Carnet du développeur.')];

  out.push('## Résumé', '', table(['Élément', 'Fait', 'À produire', 'Provisoire', 'À ranger', 'Sans objet'], [
    ['Images', count(a => a.image.state === 'présente'), count(a => a.image.state === 'à produire'), '', count(a => a.image.state === 'mal rangée'), count(a => ['aucune', 'non affichable'].includes(a.image.state))],
    ['Sons', count(a => a.sound === 'fait'), count(a => a.sound === 'aucun'), count(a => a.sound === 'provisoire'), '', ''],
  ]), '');

  const imageRows = state => analysed.filter(a => a.image.state === state)
    .map(({ e, image }) => [e.id, e.night, e.roomLabel, e.description, e.image, image.detail]);
  out.push('## Images à produire', '', table(['ID', 'Nuit', 'Salle', 'Description', 'Fichier', 'Dossier'], imageRows('à produire')), '');
  out.push('## Images mal rangées', '', 'Le fichier existe, mais pas dans le dossier de la salle de l\'événement : il ne s\'affiche pas.', '', table(['ID', 'Nuit', 'Salle', 'Description', 'Fichier', 'Où'], imageRows('mal rangée')), '');
  const offCamera = imageRows('non affichable');
  if (offCamera.length) out.push('## Images jamais affichées', '', 'Événements du bureau, sans caméra : leur image n\'apparaît nulle part.', '', table(['ID', 'Nuit', 'Salle', 'Description', 'Fichier', 'Raison'], offCamera), '');

  const soundRows = analysed.filter(a => a.sound !== 'fait')
    .map(({ e, sound }) => [e.id, e.night, e.type, e.description, e.sound, sound]);
  out.push('## Sons à produire', '', `\`${PLACEHOLDER_SOUND}\` est le son provisoire. Procédure : skill \`/ajouter-son\`.`, '', table(['ID', 'Nuit', 'Type', 'Description', 'Son actuel', 'État'], soundRows), '');
  return out.join('\n');
}

/* ---------- Vue 2 : déclenchement ---------- */

function triggerView() {
  const out = [header('Événements : déclenchement', 'Quand chaque événement peut sortir et avec quelle probabilité.')];
  out.push(
    '## Comment le moteur tire au sort',
    '',
    'Le moteur tente sa chance une fois par seconde tant que l\'événement est éligible : bonne nuit, bonne heure, bonne caméra affichée. Une heure de jeu dure 120 s réelles, une nuit 720 s. La difficulté vient donc surtout de la fenêtre horaire et de la caméra, moins de `chance`.',
    '',
    table(['Déclencheur', 'Ce que le joueur doit faire', 'Effort court mesuré'], [
      ['Observer', 'Rester sur la caméra', '10 s sur la caméra'],
      ['Observer N s', 'Rester N s d\'affilée sur la caméra, puis une tentative par seconde', 'N + 10 s d\'affilée'],
      ['Retour caméra', 'Revenir sur la caméra : une tentative par passage', '5 passages'],
      ['Silence', 'Ne rien faire pendant 8 s, puis une tentative par seconde. Caméra de la salle affichée, sauf pour le bureau', '18 s sans agir'],
      ['Heure', 'Rien : une tentative par seconde pendant la fenêtre', 'automatique'],
    ]),
    '',
    'La colonne « Fenêtre entière » suppose que le joueur remplit la condition pendant toute la fenêtre horaire (20 passages pour « Retour caméra »). Un événement ne sort qu\'une fois par nuit.',
    '',
  );

  const hard = events.filter(e => e.night >= 1 && e.night <= 5 && parseFloat(probabilities(e).full) < 50);
  out.push('## Événements difficiles', '', 'Moins de 50 % de chances même en couvrant toute la fenêtre.', '',
    table(['ID', 'Nuit', 'Salle', 'Heure', 'Déclencheur', 'Chance', 'Fenêtre entière'],
      hard.map(e => [e.id, e.night, e.roomLabel, e.hourStr, e.triggerStr, e.chance, probabilities(e).full])), '');

  for (const n of nights) {
    out.push(`## ${nightTitle(n)}`, '');
    out.push(table(['ID', 'Salle', 'Caméra', 'Heure', 'Fenêtre', 'Déclencheur', 'Chance', 'Effort court', 'Fenêtre entière', 'Condition'],
      events.filter(e => e.night === n).map(e => {
        const p = probabilities(e);
        const room = ROOM_MAP[e.roomLabel];
        const conditions = [];
        if (e.requiresEvent) conditions.push(`après ${e.requiresEvent}`);
        if (chainByFinalEvent[e.id]) conditions.push(`log ${chainByFinalEvent[e.id].log} lu (à coder)`);
        return [e.id, e.roomLabel, room?.cameraId ? `CAM ${room.cameraId.toUpperCase()}` : 'bureau', e.hourStr, `${p.windowSeconds} s`, e.triggerStr, e.chance,
          p.shortLabel ? `${p.short} (${p.shortLabel})` : p.short, p.full, conditions.join(', ')];
      })), '');
  }
  return out.join('\n');
}

/* ---------- Vue 3 : récompenses ---------- */

function describeReward(code, kind) {
  if (kind === 'tape') return tapes.find(t => t.code === code)?.description;
  if (kind === 'journal') return journals.find(j => j.code === code)?.title;
  return 'Log du terminal';
}

function rewardsView() {
  const out = [header('Événements : récompenses', 'Ce que le joueur gagne en voyant une anomalie. Le principe et les règles sont dans [Parcours_Enquete.md](../Next/Parcours_Enquete.md), section 2. Données : `script/config/rewards_data.json`.')];
  out.push(
    '## En bref',
    '',
    table(['Ce que le joueur gagne', 'Comment'], [
      ['Cassette, journal, log bonus', 'Chaque anomalie vue d\'un enfant donne la prochaine récompense de sa réserve, si sa nuit minimale est atteinte'],
      ['Log de chaîne', 'Première anomalie vue de l\'enfant. Cassidy : une des traces du cinquième enfant (`openEvents`)'],
      ['Cassette de fin de chaîne', 'L\'événement de fin de chaîne, une fois le log de chaîne lu'],
      ['Log de révélation', 'Ouvert par la nuit (champ `minNight` des logs, à coder)'],
      ['Journal garanti', '`ensureNightJournals()`, qui pioche dans les réserves'],
    ]),
    '',
  );

  const childIds = Object.keys(rewards.pools);
  out.push('## Anomalies et récompenses par nuit', '', 'Pour chaque enfant : anomalies possibles / récompenses qui deviennent disponibles cette nuit-là.', '');
  out.push(table(['Nuit', ...childIds.map(c => CHILD_NAMES[c])], [1, 2, 3, 4, 5].map(n => [n, ...childIds.map(c => {
    const anomalies = events.filter(e => e.night === n && childOf(e) === c).length;
    const available = rewards.pools[c].filter(r => r.minNight === n).length;
    return `${anomalies} / ${available}`;
  })])), '');

  for (const c of childIds) {
    const chain = rewards.chains.find(ch => ch.child === c);
    out.push(`## ${CHILD_NAMES[c]}`, '');
    out.push(table(['Ordre', 'Récompense', 'Type', 'Nuit min.', 'Contenu'],
      rewards.pools[c].map((r, i) => [i + 1, r.code, KIND_LABELS[r.kind], r.minNight, describeReward(r.code, r.kind)])), '');
    if (chain) {
      const opener = chain.openEvents ? `une trace parmi ${chain.openEvents.join(', ')}` : `première anomalie de ${CHILD_NAMES[c]}`;
      out.push(`Chaîne : ${opener} → log ${chain.log} lu → ${chain.finalEvent ?? 'événement à créer'} → ${chain.finalTape}.`, '');
    }
  }
  return out.join('\n');
}

/* ---------- Vue 4 : contrôle ---------- */

function controlView() {
  const issues = [];
  const add = (severity, subject, ids, action) => { if (ids.length) issues.push([severity, subject, ids.join(', '), action]); };

  add('Critique', 'Événements hors des nuits 1 à 5', events.filter(e => e.night > 5).map(e => `${e.id} (n${e.night})`), 'Ramener en nuit 5 : inatteignables sans nuit 6');
  for (const chain of rewards.chains) {
    if (!chain.finalEvent) add('Critique', `Chaîne ${chain.name} : événement de fin absent`, [chain.log], 'Créer les événements de la chaîne');
    else if (!events.some(e => e.id === chain.finalEvent)) add('Critique', `Chaîne ${chain.name} : ${chain.finalEvent} introuvable`, [chain.finalEvent], 'Corriger rewards_data.json');
    else if (events.find(e => e.id === chain.finalEvent).tape !== chain.finalTape) add('Critique', `Chaîne ${chain.name} : cassette de fin mal placée`, [chain.finalEvent], `Mettre ${chain.finalTape} dans son champ tape`);
    if (!logFiles.includes(chain.log)) add('Critique', `Log de chaîne inconnu`, [chain.log], 'Corriger rewards_data.json');
    add('Critique', `Chaîne ${chain.name} : porte introuvable`, (chain.openEvents || []).filter(id => !events.some(e => e.id === id)), 'Corriger openEvents dans rewards_data.json');
  }
  const known = { tape: tapes.map(t => t.code), journal: journals.map(j => j.code), log: logFiles };
  const pooled = Object.values(rewards.pools).flat();
  add('Critique', 'Récompenses inconnues', pooled.filter(r => !known[r.kind].includes(r.code)).map(r => r.code), 'Corriger rewards_data.json');
  const given = new Set([...pooled.map(r => r.code), ...rewards.chains.map(c => c.finalTape)]);
  add('Critique', 'Cassettes que rien ne donne', known.tape.filter(c => !given.has(c)), 'Ajouter à une réserve ou à une chaîne');
  add('Critique', 'Journaux que rien ne donne', known.journal.filter(c => !given.has(c)), 'Ajouter à une réserve');

  add('À décider', 'Événements legacy (toutes les nuits) à chance élevée', events.filter(e => e.night === 0 && e.chance > 0.1).map(e => e.id), 'Sortent presque à coup sûr dès qu\'on regarde la caméra');
  add('Problème', 'Images dans le dossier d\'une autre salle', events.filter(e => imageStatus(e).state === 'mal rangée').map(e => e.id), 'Refaire l\'image dans la salle de l\'événement (voir Evenements_Production.md)');

  const chainLogs = rewards.chains.map(c => c.log);
  add('Migration', 'Anciens champs de récompense à vider', events.filter(e => !chainByFinalEvent[e.id] && (e.terminal || e.tape || e.journal)).map(e => e.id),
    'Modèle des réserves : seuls les événements de fin de chaîne gardent tape. À faire avec le code des réserves');
  add('Migration', 'Logs de révélation sans minNight', logFiles.filter(l => !chainLogs.includes(l) && !pooled.some(r => r.code === l)), 'Ajouter minNight (nuit indiquée dans Parcours_Enquete.md, section 3)');
  add('Problème', 'Événements sans description', events.filter(e => !e.description).map(e => e.id), 'Décrire l\'image dans description et lore');
  add('Problème', 'Image déclarée réalisée mais absente', events.filter(e => e.realised && imageStatus(e).state === 'à produire').map(e => e.id), 'Produire l\'image ou repasser realised à false');
  add('Problème', 'Son inconnu de game_sounds.json', events.filter(e => soundStatus(e) === 'inconnu').map(e => e.id), 'Déclarer le son');

  const out = [header('Événements : contrôle', 'Incohérences entre les données et le plan. Gravités : Critique (ne peut pas marcher), À décider (arbitrage nécessaire), Migration (passage au modèle des réserves), Problème (donnée à corriger).')];
  out.push(table(['Gravité', 'Sujet', 'Éléments', 'Action'], issues), '');
  out.push(`Images et sons à produire : voir [Evenements_Production.md](Evenements_Production.md).`, '');
  return out.join('\n');
}

write('Evenements_Production.md', productionView());
write('Evenements_Declenchement.md', triggerView());
write('Evenements_Recompenses.md', rewardsView());
write('Evenements_Controle.md', controlView());
