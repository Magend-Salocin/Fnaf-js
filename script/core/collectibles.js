/**
 * Suivi persistant (localStorage) des cassettes, journaux et logs débloqués
 * par les anomalies (cf. script/core/rewards.js, appelé par triggerEvent()
 * dans script/core/random_events_engine.js).
 *
 * Contrairement à eventRuntimeState (réinitialisé à chaque nuit, cf.
 * resetRandomEventsForNewNight()), ce qui est débloqué ici reste acquis
 * pour toute la partie — une cassette ou un journal trouvé une fois
 * reste disponible les nuits suivantes.
 */
const Collectibles = (() => {
  const STORAGE_KEY = "fnaf_collectibles_v1";

  function defaultState() {
    return { tapes: [], journals: [], logs: [], listenedTapes: [] };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return Object.assign(defaultState(), JSON.parse(raw));
    } catch (err) {
      return defaultState();
    }
  }

  let state = loadState();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* stockage indisponible : on continue en mémoire seulement */
    }
  }

  function unlockTape(code) {
    if (!code || state.tapes.includes(code)) return;
    state.tapes.push(code);
    saveState();
  }

  function unlockJournal(code) {
    if (!code || state.journals.includes(code)) return;
    state.journals.push(code);
    saveState();
  }

  /** Ouvre un log de chaîne ou un log bonus (cf. Rewards.isLogLocked()). */
  function unlockLog(code) {
    if (!code || state.logs.includes(code)) return;
    state.logs.push(code);
    saveState();
  }

  function isLogUnlocked(code) {
    return state.logs.includes(code);
  }

  function isTapeUnlocked(code) {
    return state.tapes.includes(code);
  }

  /**
   * Marque une cassette comme écoutée jusqu'au bout (cf. onPlaybackEnded()
   * dans script/mechanics/tape.js). Distinct de `unlockTape()` : une
   * cassette peut être débloquée sans avoir été lue en entier. Utilisé par
   * la condition de bonne/mauvaise fin (script/mechanics/ending.js).
   */
  function markTapeListened(code) {
    if (!code || state.listenedTapes.includes(code)) return;
    state.listenedTapes.push(code);
    saveState();
  }

  function isTapeListened(code) {
    return state.listenedTapes.includes(code);
  }

  function isJournalUnlocked(code) {
    return state.journals.includes(code);
  }

  function getUnlockedTapes() {
    return state.tapes.slice();
  }

  function getUnlockedJournals() {
    return state.journals.slice();
  }

  return {
    unlockTape,
    unlockJournal,
    unlockLog,
    isLogUnlocked,
    isTapeUnlocked,
    isJournalUnlocked,
    getUnlockedTapes,
    getUnlockedJournals,
    markTapeListened,
    isTapeListened
  };
})();
