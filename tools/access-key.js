/*
 * npm run key : clés d'activation de la version web, liées à un appareil.
 *   npm run key -- init                        une fois : crée la paire de clés (la clé privée reste ici)
 *   npm run key -- new K7QM-2XRA "Prénom"      clé pour l'identifiant affiché sur l'écran du testeur
 *   npm run key -- list                        clés créées sur cet ordinateur
 *   npm run key -- revoke "Prénom"             révoque un appareil (par nom ou identifiant) : push nécessaire
 *
 * Une nouvelle clé ne demande pas de commit : le jeu vérifie la signature
 * avec la clé publique qu'il a déjà. access-private-key.local.pem et
 * access-devices.local.json restent sur cet ordinateur (non versionnés) :
 * les sauvegarder. Sans la clé privée, plus de nouvelle clé possible
 * (refaire init change toutes les clés).
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { DEVICE_ID_LENGTH, formatDeviceId, normalizeDeviceId, signedMessage } = require('../script/web/access_keys.js');

const ROOT = path.resolve(__dirname, '..');
const PRIVATE_KEY_FILE = path.join(ROOT, 'access-private-key.local.pem');
const LOCAL_FILE = path.join(ROOT, 'access-devices.local.json');
const PUBLIC_KEY_FILE = path.join(ROOT, 'script', 'web', 'access_public_key.js');
const REVOKED_FILE = path.join(ROOT, 'script', 'web', 'revoked_devices.js');

/** Signature ECDSA P-256 de l'identifiant, en base64url (ce que colle le testeur). */
function signDevice(privateKey, deviceId) {
  return crypto.sign('sha256', Buffer.from(signedMessage(deviceId)), { key: privateKey, dsaEncoding: 'ieee-p1363' }).toString('base64url');
}

/** Partie publique au format JWK, celui qu'importe le jeu. */
function publicJwk(privateKey) {
  const { kty, crv, x, y } = crypto.createPublicKey(privateKey).export({ format: 'jwk' });
  return { kty, crv, x, y };
}

const readLocal = () => (fs.existsSync(LOCAL_FILE) ? JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf8')) : []);
const writeLocal = entries => fs.writeFileSync(LOCAL_FILE, `${JSON.stringify(entries, null, 2)}\n`);

function readPrivateKey() {
  if (!fs.existsSync(PRIVATE_KEY_FILE)) throw new Error('Pas de clé privée : lancer d\'abord npm run key -- init');
  return fs.readFileSync(PRIVATE_KEY_FILE, 'utf8');
}

function readRevoked() {
  return [...fs.readFileSync(REVOKED_FILE, 'utf8').matchAll(/'([A-Z0-9]+)'/g)].map(match => match[1]);
}

function writeRevoked(devices) {
  const lines = devices.map(device => `  '${device}',`).join('\n');
  fs.writeFileSync(REVOKED_FILE, [
    '// Généré par `npm run key -- revoke` (tools/access-key.js) : ne pas éditer à la main.',
    '// Identifiants d\'appareils dont la clé d\'activation ne marche plus.',
    `window.REVOKED_DEVICES = [${lines ? `\n${lines}\n` : ''}];`,
    '',
  ].join('\n'));
}

function init() {
  if (fs.existsSync(PRIVATE_KEY_FILE)) throw new Error('La clé privée existe déjà : init invaliderait toutes les clés données.');
  const { privateKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const pem = privateKey.export({ format: 'pem', type: 'pkcs8' });
  fs.writeFileSync(PRIVATE_KEY_FILE, pem);
  fs.writeFileSync(PUBLIC_KEY_FILE, [
    '// Généré par `npm run key -- init` (tools/access-key.js) : ne pas éditer à la main.',
    '// Clé publique qui vérifie les clés d\'activation ; la clé privée reste chez l\'organisateur.',
    `window.ACCESS_PUBLIC_KEY = ${JSON.stringify(publicJwk(pem))};`,
    '',
  ].join('\n'));
  process.stdout.write(`Clés créées. Sauvegarder ${path.basename(PRIVATE_KEY_FILE)} en lieu sûr, puis commit et push (clé publique).\n`);
}

function create(device, name) {
  const id = normalizeDeviceId(device);
  if (id.length !== DEVICE_ID_LENGTH) throw new Error(`Identifiant d'appareil invalide : « ${device} » (${DEVICE_ID_LENGTH} caractères attendus)`);
  const key = signDevice(readPrivateKey(), id);
  const entries = readLocal();
  entries.push({ name, device: formatDeviceId(id), key, created: new Date().toISOString().slice(0, 10), revoked: false });
  writeLocal(entries);
  process.stdout.write(`Clé pour ${name} (appareil ${formatDeviceId(id)}) :\n${key}\n`);
}

function list() {
  const entries = readLocal();
  if (entries.length === 0) process.stdout.write('Aucune clé.\n');
  for (const entry of entries) {
    process.stdout.write(`${entry.device}  ${entry.name} (${entry.created})${entry.revoked ? '  RÉVOQUÉE' : ''}\n  ${entry.key}\n`);
  }
}

function revoke(target) {
  const entries = readLocal();
  const wanted = normalizeDeviceId(target);
  const matches = entries.filter(entry => entry.name === target || normalizeDeviceId(entry.device) === wanted);
  const devices = matches.length > 0
    ? matches.map(entry => normalizeDeviceId(entry.device))
    : wanted.length === DEVICE_ID_LENGTH ? [wanted] : [];
  if (devices.length === 0) throw new Error(`Aucun appareil pour « ${target} »`);
  for (const entry of matches) entry.revoked = true;
  writeLocal(entries);
  writeRevoked([...new Set([...readRevoked(), ...devices])].sort());
  process.stdout.write(`Révoqué : ${devices.map(formatDeviceId).join(', ')}. Commit et push pour l'appliquer.\n`);
}

function main([command, ...args]) {
  try {
    if (command === 'init') init();
    else if (command === 'new' && args.length === 2) create(args[0], args[1]);
    else if (command === 'list') list();
    else if (command === 'revoke' && args[0]) revoke(args[0]);
    else process.stdout.write('Usage : npm run key -- init | new <appareil> "Prénom" | list | revoke <"Prénom"|appareil>\n');
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

main(process.argv.slice(2));
