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
 * Sur téléphone ou tablette dans le navigateur (pas depuis l'icône), un
 * écran « Installer l'application » passe d'abord : la clé est liée aux
 * données de l'application installée, séparées de celles du navigateur.
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
      installStatus: 'Installer l’application',
      installWhy: 'Le jeu se joue depuis son icône, en plein écran. La clé d’activation se saisit dans l’application installée : saisie ici, elle ne marcherait pas dans l’icône.',
      installIos: [
        '1. Touchez le bouton Partager (carré avec une flèche vers le haut).',
        '2. Choisissez « Sur l’écran d’accueil », puis Ajouter.',
        '3. Ouvrez FNAF JS depuis l’icône.',
      ],
      installAndroid: [
        '1. Ouvrez le menu ⋮ du navigateur.',
        '2. Choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil ».',
        '3. Ouvrez FNAF JS depuis l’icône.',
      ],
      installButton: 'Installer',
      installed: 'Application installée : ouvrez FNAF JS depuis l’écran d’accueil.',
      continueInBrowser: 'Continuer dans le navigateur',
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
      installStatus: 'Install the app',
      installWhy: 'The game is played from its home screen icon, in full screen. The activation key is entered in the installed app: entered here, it would not work in the icon.',
      installIos: [
        '1. Tap the Share button (square with an arrow pointing up).',
        '2. Choose “Add to Home Screen”, then Add.',
        '3. Open FNAF JS from the icon.',
      ],
      installAndroid: [
        '1. Open the browser menu ⋮.',
        '2. Choose “Install app” or “Add to Home screen”.',
        '3. Open FNAF JS from the icon.',
      ],
      installButton: 'Install',
      installed: 'App installed: open FNAF JS from the home screen.',
      continueInBrowser: 'Continue in the browser',
    },
  };

  // Android (Chrome, Edge, Samsung Internet) propose l'installation par cet
  // événement : on le garde pour le bouton Installer. Il peut arriver avant
  // ou après l'affichage de l'écran d'installation.
  let installPrompt = null;
  const installPromptListeners = [];
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    installPromptListeners.forEach(listener => listener());
  });

  /** Vrai dans l'application installée (icône de l'écran d'accueil). */
  function isInstalledApp() {
    return navigator.standalone === true
      || window.matchMedia('(display-mode: standalone)').matches
      || window.matchMedia('(display-mode: fullscreen)').matches;
  }

  const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;
  const isIos = () => /iPhone|iPad|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

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

  /**
   * Écran « Installer l'application », à la place de l'écran de clé, sur
   * téléphone ou tablette dans le navigateur : la clé est liée aux données
   * de l'application installée, séparées de celles du navigateur.
   */
  function showInstall(onContinue) {
    const t = texts();
    const screen = element('div', 'access-gate');
    const steps = element('div', 'access-steps');
    for (const line of isIos() ? t.installIos : t.installAndroid) steps.append(element('p', 'access-text', line));

    const installButton = element('button', 'access-button', t.installButton);
    installButton.type = 'button';
    installButton.hidden = true;
    const showInstallButton = () => {
      installButton.hidden = false;
      steps.hidden = true;
    };
    if (installPrompt) showInstallButton();
    else installPromptListeners.push(showInstallButton);
    installButton.addEventListener('click', async () => {
      if (!installPrompt) return;
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        installPrompt = null;
        installButton.hidden = true;
        status.textContent = t.installed;
      }
    });

    const status = element('p', 'access-status', t.installStatus);
    const continueLink = element('button', 'access-link', t.continueInBrowser);
    continueLink.type = 'button';
    continueLink.addEventListener('click', () => {
      screen.remove();
      onContinue();
    });

    screen.append(
      element('h1', 'access-title', 'FNAF JS'),
      status,
      element('p', 'access-text', t.installWhy),
      steps,
      installButton,
      continueLink,
      element('p', 'access-notice', t.notice),
    );
    useDeviceViewport();
    document.body.append(screen);
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
    const openGate = () => showGate(id, Boolean(stored));
    if (isTouchDevice() && !isInstalledApp()) showInstall(openGate);
    else openGate();
  }

  requireAccessKey();
})();
