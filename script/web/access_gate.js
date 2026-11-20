/*
 * Écran « Test en cours » de la version web publiée.
 *
 * Affiche l'identifiant de l'appareil à envoyer à l'organisateur et demande
 * la clé qu'il renvoie (liée à cet appareil, cf. access_keys.js). La clé est
 * mémorisée et revérifiée à chaque lancement : un appareil révoqué est
 * bloqué après la mise à jour suivante du site.
 *
 * Pas d'écran :
 * - dans Electron (window.appInfo, exposé par preload.js) ;
 * - hors HTTPS (npm run web sur le réseau local, page locale) : Web Crypto
 *   n'existe que dans un contexte sécurisé, et ce serveur ne sert qu'au
 *   réseau de l'organisateur.
 *
 * L'écran recouvre la page tant que la clé n'est pas validée. Le jeu se
 * charge dessous mais ne démarre qu'au choix de la langue, inaccessible.
 */
(function () {
  const DEVICE_STORAGE_KEY = 'fnaf-device-id';
  const KEY_STORAGE_KEY = 'fnaf-access-key';

  const TEXTS = {
    fr: {
      status: 'Test en cours',
      step1: '1. Envoyez cet identifiant à l’organisateur du test :',
      step2: '2. Collez la clé reçue :',
      placeholder: 'Collez votre clé ici',
      label: 'Clé d’activation',
      copy: 'Copier',
      copied: 'Copié',
      submit: 'Valider',
      invalid: 'Clé invalide pour cet appareil.',
      revoked: 'Cette clé n’est plus valide.',
      notice: 'Projet personnel et non commercial, réalisé à des fins de découverte.',
    },
    en: {
      status: 'Testing in progress',
      step1: '1. Send this device ID to the test organizer:',
      step2: '2. Paste the key you received:',
      placeholder: 'Paste your key here',
      label: 'Activation key',
      copy: 'Copy',
      copied: 'Copied',
      submit: 'Confirm',
      invalid: 'Invalid key for this device.',
      revoked: 'This key is no longer valid.',
      notice: 'Personal, non-commercial project made for learning purposes.',
    },
  };

  function read(name) {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  }

  function write(name, value) {
    try {
      if (value === null) localStorage.removeItem(name);
      else localStorage.setItem(name, value);
    } catch {
      // Navigation privée : identifiant et clé ne seront pas mémorisés.
    }
  }

  function texts() {
    const language = read('fnaf-language') || (navigator.language || 'fr').slice(0, 2);
    return TEXTS[language] || TEXTS.en;
  }

  /** Identifiant de ce navigateur, créé à la première utilisation. */
  function deviceId() {
    let id = read(DEVICE_STORAGE_KEY);
    if (!id) {
      id = AccessKeys.createDeviceId();
      write(DEVICE_STORAGE_KEY, id);
    }
    return id;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function showGate(id, revoked) {
    const t = texts();
    const gate = element('form', 'access-gate');
    const shownId = AccessKeys.formatDeviceId(id);

    const copy = element('button', 'access-copy', t.copy);
    copy.type = 'button';
    copy.addEventListener('click', () => {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(shownId).then(() => { copy.textContent = t.copied; }, () => {});
    });

    const input = element('input', 'access-input');
    Object.assign(input, { type: 'text', placeholder: t.placeholder, autocomplete: 'off', spellcheck: false });
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('aria-label', t.label);

    const error = element('p', 'access-error', revoked ? t.revoked : '');
    const idRow = element('div', 'access-device');
    idRow.append(element('span', 'access-device-id', shownId), copy);

    gate.append(
      element('h1', 'access-title', 'FNAF JS'),
      element('p', 'access-status', t.status),
      element('p', 'access-text', t.step1),
      idRow,
      element('p', 'access-text', t.step2),
      input,
      element('button', 'access-button', t.submit),
      error,
      element('p', 'access-notice', t.notice),
    );

    gate.addEventListener('submit', async event => {
      event.preventDefault();
      const key = AccessKeys.normalizeKey(input.value);
      if (!(await AccessKeys.isValidDeviceKey(id, key))) {
        error.textContent = t.invalid;
        input.select();
        return;
      }
      write(KEY_STORAGE_KEY, key);
      input.blur();
      gate.remove();
      restoreViewport();
      setPending(false);
      window.scrollTo(0, 0);
    });

    useDeviceViewport();
    document.body.append(gate);
  }

  /** Masque tout sauf l'écran de clé (style/web.css, html.access-pending). */
  function setPending(pending) {
    document.documentElement.classList.toggle('access-pending', pending);
  }

  // Le jeu fixe la page à 1280 px de large : en portrait sur iPhone, l'écran
  // de clé serait minuscule. Le temps de la saisie, la page prend la largeur
  // réelle de l'écran ; le viewport du jeu revient une fois la clé validée.
  const viewport = document.querySelector('meta[name="viewport"]');
  const gameViewport = viewport && viewport.content;

  function useDeviceViewport() {
    if (viewport) viewport.content = 'width=device-width, initial-scale=1';
  }

  function restoreViewport() {
    if (viewport) viewport.content = gameViewport;
  }

  async function requireAccessKey() {
    if (window.appInfo || !window.isSecureContext || location.protocol !== 'https:' || !(window.crypto && crypto.subtle)) return;
    // Cache le jeu pendant la vérification (asynchrone) de la clé mémorisée.
    setPending(true);
    const id = deviceId();
    const stored = read(KEY_STORAGE_KEY);
    const valid = Boolean(stored) && (await AccessKeys.isValidDeviceKey(id, stored));
    if (valid) {
      setPending(false);
      return;
    }
    if (stored) write(KEY_STORAGE_KEY, null);
    showGate(id, Boolean(stored));
  }

  requireAccessKey();
})();
