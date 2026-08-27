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
   *    -> Pour ajouter une cassette : une entrée ici + son entrée dans
   *       gameSounds (script/config/data.js) référençant le fichier audio.
   * ------------------------------------------------------------------- */
  const TAPES = [
    {
      id: "tape_frt_01",
      title: "FRT-01",
      soundId: "tape_frt_01",
      description: "Protocole de fermeture — Pirate Cove"
    }
  ];

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
  let insertedCardEl = null;  // élément DOM de la cassette dans la fente

  /* -------------------------------------------------------------------
   * 3. Références DOM (résolues à l'initialisation)
   * ------------------------------------------------------------------- */
  let els = {};

  function cacheDom(){
    els = {
      scene:      document.getElementById("tape-scene"),
      rack:       document.getElementById("tape-rack"),
      player:     document.getElementById("tape-player"),
      slot:       document.getElementById("player-slot"),
      reelLeft:   document.getElementById("reel-left"),
      reelRight:  document.getElementById("reel-right"),
      ledRed:     document.getElementById("led-red"),
      ledGreen:   document.getElementById("led-green"),
      btnPlay:    document.getElementById("btn-play"),
      btnStop:    document.getElementById("btn-stop"),
      closeBtn:   document.getElementById("scene-close")
    };
  }

  /* -------------------------------------------------------------------
   * 4. Rendu de l'étagère de cassettes
   * ------------------------------------------------------------------- */
  function renderRack(){
    els.rack.innerHTML = "";

    TAPES.forEach(tape => {
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
    const tape = TAPES.find(t => t.id === tapeId);
    if (!tape) return;

    const cardEl = els.rack.querySelector(`.tape-card[data-tape-id="${tapeId}"]`);
    if (!cardEl) return;

    insertTape(tape, cardEl);
  }

  /* -------------------------------------------------------------------
   * 7. Insertion de la cassette
   * ------------------------------------------------------------------- */
  function insertTape(tape, cardEl){
    currentTape = tape;
    setState(STATE.INSERTING);
    lockRack(true);
    shakePlayer();

    // On retire la carte de l'étagère et on la place visuellement dans la fente
    cardEl.remove();
    insertedCardEl = cardEl;
    insertedCardEl.classList.add("tape-inserted");
    insertedCardEl.draggable = false;
    els.slot.appendChild(insertedCardEl);

    // Animation d'insertion : glisse dans la fente
    requestAnimationFrame(() => {
      insertedCardEl.style.transform = "translateY(-34px)";
      insertedCardEl.style.opacity = "0.95";
    });

    // Fin de l'animation d'insertion -> lecteur prêt
    window.setTimeout(() => {
      setState(STATE.READY);

      // Lecture automatique après un court délai
      window.setTimeout(() => {
        startPlayback();
      }, 500);
    }, 450);
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
    }

    playSound(currentTape.soundId);
    setState(STATE.PLAYING);
  }

  function onPlaybackEnded(){
    setState(STATE.STOPPED);
  }

  function stopCurrentAudio(){
    if (!currentTape) return;

    const audioElement = getSoundById(currentTape.soundId);
    if (audioElement) {
      audioElement.removeEventListener("ended", onPlaybackEnded);
    }
    stopSound(currentTape.soundId);
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

    if (insertedCardEl){
      insertedCardEl.style.transform = "translateY(0)";
      insertedCardEl.style.opacity = "0";

      window.setTimeout(() => {
        insertedCardEl.classList.remove("tape-inserted");
        insertedCardEl.style.transform = "";
        insertedCardEl.style.opacity = "";
        insertedCardEl.draggable = true;
        insertedCardEl.addEventListener("dragstart", onDragStart);
        insertedCardEl.addEventListener("dragend", onDragEnd);
        els.rack.appendChild(insertedCardEl);
        insertedCardEl = null;
      }, 300);
    }

    currentTape = null;
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
  function setTapePanelFooter(text){
    const footerEl = document.getElementById('tape-panel-footer');
    if (footerEl) footerEl.textContent = text;
  }

  function open(){
    if (!els.scene) cacheDom();
    els.scene.hidden = false;
    els.scene.setAttribute("aria-hidden", "false");
    setTapePanelFooter('CLICK TO CLOSE');
  }

  function close(){
    // Volontairement pas de stopCurrentAudio() ici : la cassette continue
    // de jouer en arrière-plan une fois la scène refermée.
    if (els.scene){
      els.scene.hidden = true;
      els.scene.setAttribute("aria-hidden", "true");
    }
    setTapePanelFooter('CLICK TO OPEN');
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

    if (insertedCardEl) {
      insertedCardEl.remove();
      insertedCardEl = null;
    }
    currentTape = null;

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

  panel.classList.toggle('tape-playing', isPlaying);
  statusEl.textContent = isPlaying ? 'PLAYING' : 'READY';
}
