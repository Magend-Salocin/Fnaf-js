/**
 * Scène "Lecteur de cassettes" (adaptée de .github/Projet/_poc_tape).
 *
 * Ouverture/fermeture déclenchées par le poste de radio du bureau
 * (cf. OFFICE_HOTSPOT_ACTIONS dans office_hotspot.js).
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
      progressFill:     document.getElementById("tape-progress-fill"),

      // Instruments alimentes par TapeAnalyser
      scope:            document.getElementById("tape-scope"),
      scopePeak:        document.getElementById("tape-scope-peak"),
      scopeFrequency:   document.getElementById("tape-scope-frequency"),
      scopeNoise:       document.getElementById("tape-scope-noise"),
      spectrum:         document.getElementById("tape-spectrum"),
      vuLeft:           document.getElementById("tape-vu-left"),
      vuRight:          document.getElementById("tape-vu-right"),
      vuLeftDb:         document.getElementById("tape-vu-left-db"),
      vuRightDb:        document.getElementById("tape-vu-right-db"),
      diagSignal:       document.getElementById("tape-diag-signal"),
      diagPeak:         document.getElementById("tape-diag-peak"),
      diagPosition:     document.getElementById("tape-diag-position"),
      diagCondition:    document.getElementById("tape-diag-condition"),
      anomaly:          document.getElementById("tape-anomaly"),
      anomalyText:      document.getElementById("tape-anomaly-text")
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
    renderTapeCondition();
  }

  function hideCassetteVisual(){
    els.cassetteVisual.hidden = true;
    els.slotHint.hidden = false;
    els.statusMedia.textContent = "—";
    els.statusCondition.textContent = "—";
    renderTapeCondition();
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

    if (audioElement) TapeAnalyser.attach(audioElement);

    playSound(currentTape.soundId);
    setState(STATE.PLAYING);
  }

  function onPlaybackEnded(){
    if (currentTape) Collectibles.markTapeListened(currentTape.id);
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
   * 8 bis. Instruments (oscilloscope, spectre, VU-mètres, diagnostic)
   *
   *    Tout ce que ces cadrans affichent vient de TapeAnalyser, donc du son
   *    réellement joué — à l'exception de l'état de la bande, qui vient de
   *    son champ `condition` dans tapes_data.json. La boucle tourne tant
   *    que la scène est ouverte : à l'arrêt, les cadrans retombent au repos
   *    au lieu de rester figés sur la dernière mesure.
   * ------------------------------------------------------------------- */
  const SPECTRUM_BANDS = 24;
  const NOMINAL_CONDITION = "STABLE";
  let instrumentsFrameId = null;

  /** Construit les barres du spectre, une fois pour toutes. */
  function buildSpectrumBars(){
    if (!els.spectrum || els.spectrum.childElementCount === SPECTRUM_BANDS) return;

    els.spectrum.innerHTML = "";
    for (let i = 0; i < SPECTRUM_BANDS; i++){
      const bar = document.createElement("i");
      bar.style.setProperty("--h", "0%");
      els.spectrum.appendChild(bar);
    }
  }

  /** Convertit un niveau en dB en remplissage de VU-mètre. */
  function levelToPercent(db){
    const ratio = (db - TapeAnalyser.SILENCE_DB) / (0 - TapeAnalyser.SILENCE_DB);
    return Math.max(0, Math.min(1, ratio)) * 100;
  }

  function formatDb(db){
    return db <= TapeAnalyser.SILENCE_DB ? "-INF" : `${db.toFixed(0)}`;
  }

  function formatFrequency(hz){
    return hz >= 1000 ? `${(hz / 1000).toFixed(1)} KHZ` : `${Math.round(hz)} HZ`;
  }

  /** Trace la forme d'onde sur l'oscilloscope. */
  function drawScope(waveform){
    if (!els.scope) return;

    const ctx = els.scope.getContext("2d");
    const width = els.scope.width;
    const height = els.scope.height;
    ctx.clearRect(0, 0, width, height);

    if (!waveform){
      // Pas de signal : une ligne plate, comme un appareil sous tension mais
      // sans bande.
      ctx.strokeStyle = "rgba(255, 173, 50, 0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      return;
    }

    ctx.strokeStyle = "#ffad32";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(255, 173, 50, 0.55)";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    for (let x = 0; x < width; x++){
      const sample = waveform[Math.floor((x / width) * waveform.length)];
      const y = height / 2 + ((sample - 128) / 128) * (height / 2) * 0.9;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  /** Etat de la bande et encart d'anomalie : données de la cassette. */
  function renderTapeCondition(){
    const condition = currentTape?.condition || "—";
    if (els.diagCondition){
      els.diagCondition.textContent = condition;
      els.diagCondition.className = condition === NOMINAL_CONDITION ? "ok" : "warning";
    }

    if (els.anomaly){
      const isAnomalous = Boolean(currentTape) && condition !== NOMINAL_CONDITION;
      els.anomaly.hidden = !isAnomalous;
      if (isAnomalous && els.anomalyText) els.anomalyText.textContent = `BANDE ${condition}`;
    }
  }

  /** Repose tous les cadrans : aucun signal à afficher. */
  function renderInstrumentsIdle(){
    drawScope(null);
    if (els.spectrum){
      for (const bar of els.spectrum.children) bar.style.setProperty("--h", "0%");
    }
    if (els.vuLeft) els.vuLeft.style.width = "0%";
    if (els.vuRight) els.vuRight.style.width = "0%";
    if (els.vuLeftDb) els.vuLeftDb.textContent = "-INF";
    if (els.vuRightDb) els.vuRightDb.textContent = "-INF";
    if (els.scopePeak) els.scopePeak.textContent = "0.00V";
    if (els.scopeFrequency) els.scopeFrequency.textContent = "—";
    if (els.scopeNoise) els.scopeNoise.textContent = "—";
    if (els.diagSignal){
      els.diagSignal.textContent = "ABSENT";
      els.diagSignal.className = "warning";
    }
    if (els.diagPeak) els.diagPeak.textContent = "-INF";
  }

  /** Reporte une mesure sur tous les cadrans. */
  function renderInstruments(reading){
    drawScope(reading.waveform);

    if (els.spectrum){
      const bars = els.spectrum.children;
      for (let i = 0; i < bars.length; i++){
        bars[i].style.setProperty("--h", `${Math.round((reading.bands[i] || 0) * 100)}%`);
      }
    }

    if (els.vuLeft) els.vuLeft.style.width = `${levelToPercent(reading.left)}%`;
    if (els.vuRight) els.vuRight.style.width = `${levelToPercent(reading.right)}%`;
    if (els.vuLeftDb) els.vuLeftDb.textContent = formatDb(reading.left);
    if (els.vuRightDb) els.vuRightDb.textContent = formatDb(reading.right);

    if (els.scopePeak) els.scopePeak.textContent = `${reading.peak.toFixed(2)}V`;
    if (els.scopeFrequency) els.scopeFrequency.textContent = formatFrequency(reading.dominantHz);
    if (els.scopeNoise) els.scopeNoise.textContent = `${Math.round(reading.noiseRatio * 100)}%`;

    if (els.diagSignal){
      els.diagSignal.textContent = "PRESENT";
      els.diagSignal.className = "ok";
    }
    if (els.diagPeak) els.diagPeak.textContent = `${formatDb(Math.max(reading.left, reading.right))} DB`;
  }

  /** Avancement de la bande, indépendant du signal. */
  function renderPosition(){
    if (!els.diagPosition) return;

    const audioElement = currentTape ? getSoundById(currentTape.soundId) : null;
    const ratio = audioElement && audioElement.duration
      ? audioElement.currentTime / audioElement.duration
      : 0;
    els.diagPosition.textContent = currentTape ? `${Math.round(ratio * 100)}%` : "—";
  }

  function updateInstruments(){
    const reading = currentState === STATE.PLAYING ? TapeAnalyser.read(SPECTRUM_BANDS) : null;

    if (reading && reading.active) renderInstruments(reading);
    else renderInstrumentsIdle();

    renderPosition();
    instrumentsFrameId = window.requestAnimationFrame(updateInstruments);
  }

  function startInstruments(){
    if (instrumentsFrameId !== null) return;
    buildSpectrumBars();
    instrumentsFrameId = window.requestAnimationFrame(updateInstruments);
  }

  function stopInstruments(){
    if (instrumentsFrameId === null) return;
    window.cancelAnimationFrame(instrumentsFrameId);
    instrumentsFrameId = null;
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
  }

  function setReelsSpinning(spinning){
    const playState = spinning ? "running" : "paused";
    els.reelLeft.style.animationPlayState = playState;
    els.reelRight.style.animationPlayState = playState;
  }

  /* -------------------------------------------------------------------
   * 14. API publique
   * ------------------------------------------------------------------- */
  function open(){
    if (!els.scene) cacheDom();
    renderRack(); // reflète les cassettes débloquées depuis la dernière ouverture
    lockRack(currentState !== STATE.EMPTY);
    els.scene.hidden = false;
    els.scene.setAttribute("aria-hidden", "false");
    renderTapeCondition();
    startInstruments();
  }

  function close(){
    // Volontairement pas de stopCurrentAudio() ici : la cassette continue
    // de jouer en arrière-plan une fois la scène refermée.
    if (els.scene){
      els.scene.hidden = true;
      els.scene.setAttribute("aria-hidden", "true");
    }
    stopInstruments();
  }

  function isOpen(){
    return !!(els.scene && !els.scene.hidden);
  }

  /**
   * Indique si une cassette est en cours de lecture. Le poste de radio du
   * bureau s'en sert pour se signaler tant que la bande tourne, y compris
   * quand la scène est refermée.
   */
  function isPlaying(){
    return currentState === STATE.PLAYING;
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

  return { open, close, isOpen, isPlaying, reset };

})();

/**
 * Ouvre/ferme la scène du lecteur de cassettes, déclenchée par le poste de
 * radio du bureau.
 */
function showCloseTapeScene(){
  if (gameEnd) return;

  if (TapeScene.isOpen()){
    TapeScene.close();
  } else {
    TapeScene.open();
  }
}
