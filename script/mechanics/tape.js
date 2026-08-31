/**
 * Scène "Lecteur de cassettes" (adaptée de .github/Projet/_poc_tape).
 *
 * Ouverture/fermeture pilotées comme les autres panneaux du HUD
 * (cf. showCloseCamera() dans camera.js) via le bouton #tape-panel.
 *
 * L'audio d'une cassette insérée passe par le système de sons du jeu
 * (playSound/stopSound/gameSounds) au lieu d'instances Audio() isolées,
 * pour respecter le mixeur de volume et stopAllSounds(). Fermer la scène
 * ne coupe volontairement PAS l'audio : la cassette continue de jouer en
 * arrière-plan, exactement comme l'appel du Phone Guy en début de nuit.
 */
const TapeScene = (() => {

  /* -------------------------------------------------------------------
   * 1. Données des cassettes
   *    -> Le catalogue complet vient de TAPES_LIBRARY (script/config/
   *       tapes_data.json, chargé par script/loaders/tapes_data.js).
   *       Seules les cassettes débloquées par un événement aléatoire
   *       (champ `tape`, cf. Collectibles.unlockTape() dans
   *       random_events_engine.js) apparaissent sur l'étagère.
   * ------------------------------------------------------------------- */
  function getAvailableTapes(){
    return TAPES_LIBRARY
      .filter(tape => Collectibles.isTapeUnlocked(tape.code))
      .map(tape => ({
        id: tape.code,
        title: tape.title,
        soundId: tape.soundId,
        description: tape.description,
        condition: tape.condition
      }));
  }

  /* -------------------------------------------------------------------
   * 2. Machine à états du lecteur
   * ------------------------------------------------------------------- */
  const STATE = {
    EMPTY:     "EMPTY",
    INSERTING: "INSERTING",
    READY:     "READY",
    PLAYING:   "PLAYING",
    STOPPED:   "STOPPED"
  };

  let currentState = STATE.EMPTY;
  let currentTape   = null;   // données de la cassette actuellement insérée

  /* -------------------------------------------------------------------
   * 3. Références DOM (résolues à l'initialisation)
   * ------------------------------------------------------------------- */
  let els = {};

  function cacheDom(){
    els = {
      scene:            document.getElementById("tape-scene"),
      rack:             document.getElementById("tape-rack"),
      player:           document.getElementById("tape-player"),
      slot:             document.getElementById("player-slot"),
      slotHint:         document.getElementById("slot-empty-hint"),
      cassetteVisual:   document.getElementById("cassette-visual"),
      cassetteTitle:    document.getElementById("cassette-title"),
      cassetteSubtitle: document.getElementById("cassette-subtitle"),
      statusMedia:      document.getElementById("cassette-status-media"),
      statusCondition:  document.getElementById("cassette-status-condition"),
      reelLeft:         document.getElementById("reel-left"),
      reelRight:        document.getElementById("reel-right"),
      ledRed:           document.getElementById("led-red"),
      ledGreen:         document.getElementById("led-green"),
      btnPlay:          document.getElementById("btn-play"),
      btnStop:          document.getElementById("btn-stop"),
      closeBtn:         document.getElementById("scene-close"),
      counter:          document.getElementById("tape-counter"),
      progressFill:     document.getElementById("tape-progress-fill")
    };
  }

  /* -------------------------------------------------------------------
   * 4. Rendu de l'étagère de cassettes
   * ------------------------------------------------------------------- */
  function renderRack(){
    els.rack.innerHTML = "";

    // Exclut la cassette actuellement dans le lecteur : rappeler cette
    // fonction pendant une lecture (ex: à la réouverture de la scène)
    // ne doit pas la faire apparaître en double sur l'étagère.
    const availableTapes = getAvailableTapes()
      .filter(tape => !currentTape || tape.id !== currentTape.id);

    availableTapes.forEach(tape => {
      const card = document.createElement("div");
      card.className = "tape-card";
      card.dataset.tapeId = tape.id;
      card.draggable = true;
      card.title = tape.description || tape.title;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Insérer ${tape.title}`);

      card.innerHTML = `
        <div class="tape-window">
          <span class="tape-hole"></span>
          <span class="tape-hole"></span>
        </div>
        <div class="tape-label">${tape.title}</div>
      `;

      card.addEventListener("dragstart", onDragStart);
      card.addEventListener("dragend", onDragEnd);

      els.rack.appendChild(card);
    });
  }

  /* -------------------------------------------------------------------
   * 5. Drag & Drop — événements sur la cassette source
   * ------------------------------------------------------------------- */
  function onDragStart(e){
    if (currentState !== STATE.EMPTY){
      // Lecteur déjà occupé : on empêche le drag (verrouillage de l'étagère)
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", e.currentTarget.dataset.tapeId);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("dragging");
  }

  function onDragEnd(e){
    e.currentTarget.classList.remove("dragging");
  }

  /* -------------------------------------------------------------------
   * 6. Drag & Drop — événements sur la fente du lecteur (seule dropzone)
   * ------------------------------------------------------------------- */
  function bindSlotEvents(){
    els.slot.addEventListener("dragenter", onSlotDragEnter);
    els.slot.addEventListener("dragover", onSlotDragOver);
    els.slot.addEventListener("dragleave", onSlotDragLeave);
    els.slot.addEventListener("drop", onSlotDrop);
  }

  function onSlotDragEnter(e){
    if (currentState !== STATE.EMPTY) return;
    e.preventDefault();
    els.slot.classList.add("slot-hover");
  }

  function onSlotDragOver(e){
    if (currentState !== STATE.EMPTY) return;
    e.preventDefault(); // nécessaire pour autoriser le drop
    e.dataTransfer.dropEffect = "move";
  }

  function onSlotDragLeave(){
    els.slot.classList.remove("slot-hover");
  }

  function onSlotDrop(e){
    e.preventDefault();
    els.slot.classList.remove("slot-hover");

    if (currentState !== STATE.EMPTY) return; // lecteur occupé : dépôt ignoré

    const tapeId = e.dataTransfer.getData("text/plain");
    const tape = getAvailableTapes().find(t => t.id === tapeId);
    if (!tape) return;

    const cardEl = els.rack.querySelector(`.tape-card[data-tape-id="${tapeId}"]`);
    if (!cardEl) return;

    insertTape(tape, cardEl);
  }

  /* -------------------------------------------------------------------
   * 7. Insertion de la cassette
   *    La petite carte de l'étagère disparaît (fondu) pendant que le
   *    grand visuel de cassette apparaît dans la zone de dépôt.
   * ------------------------------------------------------------------- */
  function insertTape(tape, cardEl){
    currentTape = tape;
    setState(STATE.INSERTING);
    lockRack(true);
    shakePlayer();

    cardEl.classList.add("dragging"); // réutilise le fondu existant (opacity .35)

    // Fin de l'animation de retrait -> la carte disparaît, la cassette apparaît
    window.setTimeout(() => {
      cardEl.remove();
      showCassetteVisual(tape);
      setState(STATE.READY);

      // Lecture automatique après un court délai
      window.setTimeout(() => {
        startPlayback();
      }, 500);
    }, 450);
  }

  /**
   * Affiche le grand visuel de cassette dans la zone de dépôt, avec le
   * titre/la description de la cassette insérée.
   */
  function showCassetteVisual(tape){
    els.slotHint.hidden = true;
    els.cassetteTitle.textContent = tape.title;
    els.cassetteSubtitle.textContent = tape.description || "";
    els.cassetteVisual.hidden = false;
    els.statusMedia.textContent = tape.title;
    els.statusCondition.textContent = tape.condition || "INCONNU";
  }

  function hideCassetteVisual(){
    els.cassetteVisual.hidden = true;
    els.slotHint.hidden = false;
    els.statusMedia.textContent = "—";
    els.statusCondition.textContent = "—";
  }

  /* -------------------------------------------------------------------
   * 8. Lecture audio (passe par le système de sons du jeu)
   * ------------------------------------------------------------------- */
  function startPlayback(){
    if (!currentTape) return;

    const audioElement = getSoundById(currentTape.soundId);
    if (audioElement) {
      audioElement.removeEventListener("ended", onPlaybackEnded);
      audioElement.addEventListener("ended", onPlaybackEnded);
      audioElement.removeEventListener("timeupdate", onPlaybackTimeUpdate);
      audioElement.addEventListener("timeupdate", onPlaybackTimeUpdate);
    }

    playSound(currentTape.soundId);
    setState(STATE.PLAYING);
  }

  function onPlaybackEnded(){
    setState(STATE.STOPPED);
  }

  /**
   * Met à jour le compteur de position et la barre de progression du
   * bandeau de contrôle à partir du temps réel de lecture audio.
   */
  function onPlaybackTimeUpdate(e){
    const audioElement = e.currentTarget;
    els.counter.textContent = formatCounterTime(audioElement.currentTime);
    els.progressFill.style.width = audioElement.duration
      ? `${(audioElement.currentTime / audioElement.duration) * 100}%`
      : "0%";
  }

  function formatCounterTime(seconds){
    const total = Math.floor(seconds || 0);
    const mm = String(Math.floor(total / 60)).padStart(2, "0");
    const ss = String(total % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function resetCounter(){
    els.counter.textContent = "00:00";
    els.progressFill.style.width = "0%";
  }

  function stopCurrentAudio(){
    if (!currentTape) return;

    const audioElement = getSoundById(currentTape.soundId);
    if (audioElement) {
      audioElement.removeEventListener("ended", onPlaybackEnded);
      audioElement.removeEventListener("timeupdate", onPlaybackTimeUpdate);
    }
    stopSound(currentTape.soundId);
    resetCounter();
  }

  /* -------------------------------------------------------------------
   * 9. Contrôles Play / Stop
   * ------------------------------------------------------------------- */
  function onPlayClick(){
    if (currentState === STATE.READY || currentState === STATE.STOPPED){
      startPlayback();
    }
  }

  function onStopClick(){
    if (currentState === STATE.PLAYING){
      // Premier appui : on arrête la lecture et on rembobine
      stopCurrentAudio();
      setState(STATE.STOPPED);
    } else if (currentState === STATE.STOPPED || currentState === STATE.READY){
      // Second appui : on éjecte la cassette
      ejectTape();
    }
  }

  /* -------------------------------------------------------------------
   * 10. Éjection de la cassette
   * ------------------------------------------------------------------- */
  function ejectTape(){
    stopCurrentAudio();
    playSound("tape_eject");

    hideCassetteVisual();
    currentTape = null;
    renderRack(); // reconstruit l'étagère (la cassette éjectée y réapparaît)
    lockRack(false);
    setState(STATE.EMPTY);
  }

  /* -------------------------------------------------------------------
   * 11. Verrouillage de l'étagère pendant qu'une cassette est en place
   * ------------------------------------------------------------------- */
  function lockRack(locked){
    const cards = els.rack.querySelectorAll(".tape-card");
    cards.forEach(card => {
      card.draggable = !locked;
      card.classList.toggle("locked", locked);
    });
  }

  /* -------------------------------------------------------------------
   * 12. Vibration du lecteur au moment du dépôt
   * ------------------------------------------------------------------- */
  function shakePlayer(){
    els.player.classList.add("shaking");
    window.setTimeout(() => els.player.classList.remove("shaking"), 400);
  }

  /* -------------------------------------------------------------------
   * 13. Centralisation des changements d'état -> mise à jour de l'UI
   * ------------------------------------------------------------------- */
  function setState(newState){
    currentState = newState;
    els.player.dataset.state = newState;

    switch(newState){

      case STATE.EMPTY:
        els.ledRed.classList.add("on");
        els.ledGreen.classList.remove("on");
        els.btnPlay.disabled = true;
        els.btnStop.disabled = true;
        els.btnPlay.classList.remove("lit");
        setReelsSpinning(false);
        break;

      case STATE.INSERTING:
        els.btnPlay.disabled = true;
        els.btnStop.disabled = true;
        break;

      case STATE.READY:
        els.ledRed.classList.remove("on");
        els.ledGreen.classList.add("on");
        els.btnPlay.disabled = false;
        els.btnStop.disabled = false;
        setReelsSpinning(false);
        break;

      case STATE.PLAYING:
        els.ledGreen.classList.add("on");
        els.ledRed.classList.remove("on");
        els.btnPlay.disabled = false;
        els.btnStop.disabled = false;
        els.btnPlay.classList.add("lit");
        setReelsSpinning(true);
        break;

      case STATE.STOPPED:
        els.btnPlay.classList.remove("lit");
        setReelsSpinning(false);
        break;
    }

    updateTapePanelState(newState === STATE.PLAYING);
  }

  function setReelsSpinning(spinning){
    const playState = spinning ? "running" : "paused";
    els.reelLeft.style.animationPlayState = playState;
    els.reelRight.style.animationPlayState = playState;
  }

  /* -------------------------------------------------------------------
   * 14. API publique
   * ------------------------------------------------------------------- */
  /**
   * Résout un libellé de panneau ("tape.*") dans la langue active, avec
   * repli sur l'anglais si la traduction est absente (même logique que
   * setPhonePanelState() dans night.js).
   */
  function getPanelLabel(key, fallback){
    const lang = window.selectedLanguage || window.FNAF_DEFAULT_LANGUAGE || 'fr';
    const allTranslations = window.FNAF_TRANSLATIONS || {};
    const t = allTranslations[lang] || allTranslations[window.FNAF_DEFAULT_LANGUAGE] || {};
    return t.panels?.[key] || fallback;
  }

  function setTapePanelFooter(text){
    const footerEl = document.getElementById('tape-panel-footer');
    if (footerEl) footerEl.textContent = text;
  }

  function open(){
    if (!els.scene) cacheDom();
    renderRack(); // reflète les cassettes débloquées depuis la dernière ouverture
    lockRack(currentState !== STATE.EMPTY);
    els.scene.hidden = false;
    els.scene.setAttribute("aria-hidden", "false");
    setTapePanelFooter(getPanelLabel('tapeFooterClose', 'CLICK TO CLOSE'));
  }

  function close(){
    // Volontairement pas de stopCurrentAudio() ici : la cassette continue
    // de jouer en arrière-plan une fois la scène refermée.
    if (els.scene){
      els.scene.hidden = true;
      els.scene.setAttribute("aria-hidden", "true");
    }
    setTapePanelFooter(getPanelLabel('tapeFooter', 'CLICK TO OPEN'));
  }

  function isOpen(){
    return !!(els.scene && !els.scene.hidden);
  }

  /**
   * Éjecte la cassette en cours (le cas échéant) et remet le lecteur à
   * zéro. Appelé au début de chaque nuit (cf. startNight() dans night.js)
   * pour que le lecteur reparte propre, comme le panneau du téléphone.
   */
  function reset(){
    stopCurrentAudio();

    currentTape = null;
    if (els.cassetteVisual) hideCassetteVisual();

    if (els.rack) {
      renderRack();
      lockRack(false);
    }
    if (els.player) {
      setState(STATE.EMPTY);
    }
  }

  /* -------------------------------------------------------------------
   * 15. Initialisation (une seule fois, au chargement du script)
   * ------------------------------------------------------------------- */
  function init(){
    cacheDom();
    renderRack();
    bindSlotEvents();
    setState(STATE.EMPTY);

    els.btnPlay.addEventListener("click", onPlayClick);
    els.btnStop.addEventListener("click", onStopClick);
    els.closeBtn.addEventListener("click", close);
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return { open, close, isOpen, reset };

})();

/**
 * Ouvre/ferme la scène du lecteur de cassettes depuis le bouton HUD
 * #tape-panel (même logique que showCloseCamera() pour #camera-panel).
 */
function showCloseTapeScene(){
  if (gameEnd) return;

  if (TapeScene.isOpen()){
    TapeScene.close();
  } else {
    TapeScene.open();
  }
}

/**
 * Met à jour le statut affiché sur le bouton HUD #tape-panel.
 * @param {boolean} isPlaying
 */
function updateTapePanelState(isPlaying){
  const panel = document.getElementById('tape-panel');
  const statusEl = document.getElementById('tape-panel-status');
  if (!panel || !statusEl) return;

  const lang = window.selectedLanguage || window.FNAF_DEFAULT_LANGUAGE || 'fr';
  const allTranslations = window.FNAF_TRANSLATIONS || {};
  const t = allTranslations[lang] || allTranslations[window.FNAF_DEFAULT_LANGUAGE] || {};
  const playingLabel = t.panels?.tapePlaying || 'PLAYING';
  const readyLabel = t.panels?.tapeStatus || 'READY';

  panel.classList.toggle('tape-playing', isPlaying);
  statusEl.textContent = isPlaying ? playingLabel : readyLabel;
}
