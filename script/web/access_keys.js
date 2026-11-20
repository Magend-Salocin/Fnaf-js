/*
 * Clés d'activation de la version web, liées à un appareil (Web Crypto).
 *
 * Le jeu crée un identifiant d'appareil au hasard ; l'organisateur le signe
 * avec une clé privée qui ne quitte pas son ordinateur (`npm run key`,
 * tools/access-key.js). Le jeu ne détient que la clé publique : il vérifie
 * une clé, personne ne peut en fabriquer. Signature ECDSA P-256 / SHA-256,
 * 64 octets, écrite en base64url (86 caractères, à copier-coller).
 *
 * Script classique (window.AccessKeys) et module CommonJS pour
 * tools/access-key.js : l'outil et le jeu construisent le texte signé de la
 * même façon.
 */
(function (root) {
  const DEVICE_ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // ni 0/O ni 1/I
  const DEVICE_ID_LENGTH = 8;
  const SIGNATURE_BYTES = 64;
  const ALGORITHM = { name: 'ECDSA', namedCurve: 'P-256' };

  const normalizeDeviceId = id => String(id).toUpperCase().replace(/[^A-Z0-9]/g, '');

  /** "K7QM2XRA" -> "K7QM-2XRA" (forme affichée et saisie). */
  const formatDeviceId = id => normalizeDeviceId(id).replace(/(.{4})(?=.)/g, '$1-');

  /** Texte signé pour un appareil. Propre à ce jeu : une clé d'un autre jeu n'y marche pas. */
  const signedMessage = deviceId => `fnaf-js:device:${normalizeDeviceId(deviceId)}`;

  /** Une clé collée peut contenir des espaces ou des retours à la ligne. */
  const normalizeKey = key => String(key).replace(/[^A-Za-z0-9_-]/g, '');

  function createDeviceId() {
    const bytes = root.crypto.getRandomValues(new Uint8Array(DEVICE_ID_LENGTH));
    return Array.from(bytes, byte => DEVICE_ID_ALPHABET[byte % DEVICE_ID_ALPHABET.length]).join('');
  }

  function base64UrlToBytes(text) {
    try {
      const binary = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
      return Uint8Array.from(binary, character => character.charCodeAt(0));
    } catch {
      return null;
    }
  }

  /** Vrai si `key` est la signature de cet identifiant par l'organisateur et que l'appareil n'est pas révoqué. */
  async function isValidDeviceKey(deviceId, key) {
    const publicKey = root.ACCESS_PUBLIC_KEY;
    const revoked = root.REVOKED_DEVICES || [];
    const subtle = root.crypto && root.crypto.subtle;
    if (!publicKey || !subtle || revoked.includes(normalizeDeviceId(deviceId))) return false;
    const signature = base64UrlToBytes(normalizeKey(key));
    if (!signature || signature.length !== SIGNATURE_BYTES) return false;
    try {
      const verifier = await subtle.importKey('jwk', publicKey, ALGORITHM, false, ['verify']);
      const message = new TextEncoder().encode(signedMessage(deviceId));
      return await subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, verifier, signature, message);
    } catch {
      return false;
    }
  }

  const api = {
    DEVICE_ID_LENGTH, normalizeDeviceId, formatDeviceId, signedMessage, normalizeKey, createDeviceId, isValidDeviceKey,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AccessKeys = api;
})(typeof window !== 'undefined' ? window : globalThis);
