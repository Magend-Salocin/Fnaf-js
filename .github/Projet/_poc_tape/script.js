/**
 * ============================================================================
 * Scène "Lecteur de cassettes" — sceneTapePlayer
 * ============================================================================
 * Scène 100% autonome basée sur l'API HTML5 Drag & Drop native.
 * Aucune dépendance externe, aucun framework.
 *
 * Intégration dans le moteur principal du fangame :
 *
 *   loadTapeScene()   -> affiche et initialise la scène
 *   closeTapeScene()  -> stoppe tout (audio, animations) et masque la scène
 *
 * Tout le reste (TapeScene) est encapsulé et ne pollue pas le scope global.
 * ============================================================================
 */

const TapeScene = (() => {

  /* -------------------------------------------------------------------
   * 1. Données des cassettes
   *    -> Pour ajouter une cassette, il suffit d'ajouter une entrée ici.
   * ------------------------------------------------------------------- */
  const TAPES = [
    {
      id: "tape_01",
      title: "Cassette 01",
      image: "assets/tapes/tape01.png",       // optionnelle, non bloquant si absente
      audio: "assets/audio/tape01.mp3",
      description: "Message du gérant — nuit 1"
    },
    {
      id: "tape_02",
      title: "Cassette 02",
      image: "assets/tapes/tape02.png",
      audio: "assets/audio/tape02.mp3",
      description: "Message du gérant — nuit 2"
    },
    {
      id: "tape_03",
      title: "Cassette 03",
      image: "assets/tapes/tape03.png",
      audio: "assets/audio/tape03.mp3",
      description: "Enregistrement inconnu"
    },
    {
      id: "tape_04",
      title: "Cassette 04",
      image: "assets/tapes/tape04.png",
      audio: "assets/audio/tape04.mp3",
      description: "Enregistrement corrompu"
    }
  ];

  /* -------------------------------------------------------------------
   * 2. Machine à états du lecteur
   * ------------------------------------------------------------------- */
  const STATE = {
    EMPTY:     "EMPTY",
    HOVER:     "HOVER",
    INSERTING: "INSERTING",
    READY:     "READY",
    PLAYING:   "PLAYING",
    STOPPED:   "STOPPED"
  };

  let currentState = STATE.EMPTY;
  let currentTape   = null;   // données de la cassette actuellement insérée
  let currentAudio  = null;   // instance Audio en cours
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
   * 4. Effets sonores
   *    Chaque effet est chargé de façon défensive : si le fichier n'existe
   *    pas encore (assets à fournir par le développeur), on log un simple
   *    avertissement au lieu de casser la scène.
   * ------------------------------------------------------------------- */
  const SFX = {
    click:     "assets/audio/sfx_tape_click.mp3",
    mechanism: "assets/audio/sfx_mechanism.mp3",
    hiss:      "assets/audio/sfx_tape_hiss.mp3"
  };

  function playSfx(key){
    const src = SFX[key];
    if (!src) return;
    try{
      const sfx = new Audio(src);
      sfx.volume = 0.7;
      const p = sfx.play();
      if (p && typeof p.catch === "function"){
        p.catch(() => console.warn(`[TapeScene] SFX introuvable ou bloqué : ${src}`));
      }
    }catch(err){
      console.warn(`[TapeScene] Impossible de jouer le SFX "${key}"`, err);
    }
  }

  /* -------------------------------------------------------------------
   * 5. Rendu de l'étagère de cassettes
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

      // Support pour une vraie miniature si l'asset existe
      if (tape.image){
        const probe = new Image();
        probe.onload = () => {
          card.style.backgroundImage = `url("${tape.image}")`;
          card.style.backgroundSize = "cover";
          card.style.backgroundPosition = "center";
        };
        probe.onerror = () => { /* pas d'image -> rendu CSS par défaut, silencieux */ };
        probe.src = tape.image;
      }

      card.addEventListener("dragstart", onDragStart);
      card.addEventListener("dragend", onDragEnd);
      card.addEventListener("click", () => playSfx("click"));

      els.rack.appendChild(card);
    });
  }

  /* -------------------------------------------------------------------
   * 6. Drag & Drop — événements sur la cassette source
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
    // Si le drop n'a pas été accepté par la fente, la cassette n'a jamais
    // quitté le DOM de l'étagère : elle est donc déjà "revenue" à sa position.
  }

  /* -------------------------------------------------------------------
   * 7. Drag & Drop — événements sur la fente du lecteur (seule dropzone)
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
   * 8. Insertion de la cassette
   * ------------------------------------------------------------------- */
  function insertTape(tape, cardEl){
    currentTape = tape;
    setState(STATE.INSERTING);
    lockRack(true);

    playSfx("mechanism");
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

      // Lecture automatique après un court délai, comme demandé dans le brief
      window.setTimeout(() => {
        startPlayback();
      }, 500);
    }, 450);
  }

  /* -------------------------------------------------------------------
   * 9. Lecture audio
   * ------------------------------------------------------------------- */
  function startPlayback(){
    if (!currentTape) return;

    stopCurrentAudioInstance(); // sécurité : une seule cassette lue à la fois

    try{
      currentAudio = new Audio(currentTape.audio);
      currentAudio.addEventListener("ended", onPlaybackEnded);
      const p = currentAudio.play();
      if (p && typeof p.catch === "function"){
        p.catch(() => console.warn(`[TapeScene] Audio introuvable : ${currentTape.audio}`));
      }
    }catch(err){
      console.warn("[TapeScene] Erreur de lecture audio", err);
    }

    setState(STATE.PLAYING);
  }

  function onPlaybackEnded(){
    setState(STATE.STOPPED);
  }

  function stopCurrentAudioInstance(){
    if (currentAudio){
      currentAudio.pause();
      currentAudio.removeEventListener("ended", onPlaybackEnded);
      currentAudio = null;
    }
  }

  /* -------------------------------------------------------------------
   * 10. Contrôles Play / Stop
   * ------------------------------------------------------------------- */
  function onPlayClick(){
    if (currentState === STATE.READY || currentState === STATE.STOPPED){
      startPlayback();
    }
  }

  function onStopClick(){
    if (currentState === STATE.PLAYING){
      // Premier appui : on arrête la lecture et on rembobine
      if (currentAudio) currentAudio.currentTime = 0;
      stopCurrentAudioInstance();
      setState(STATE.STOPPED);
    } else if (currentState === STATE.STOPPED || currentState === STATE.READY){
      // Second appui : on éjecte la cassette
      ejectTape();
    }
  }

  /* -------------------------------------------------------------------
   * 11. Éjection de la cassette
   * ------------------------------------------------------------------- */
  function ejectTape(){
    stopCurrentAudioInstance();

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
   * 12. Verrouillage de l'étagère pendant qu'une cassette est en place
   * ------------------------------------------------------------------- */
  function lockRack(locked){
    const cards = els.rack.querySelectorAll(".tape-card");
    cards.forEach(card => {
      card.draggable = !locked;
      card.classList.toggle("locked", locked);
    });
  }

  /* -------------------------------------------------------------------
   * 13. Vibration du lecteur au moment du dépôt
   * ------------------------------------------------------------------- */
  function shakePlayer(){
    els.player.classList.add("shaking");
    window.setTimeout(() => els.player.classList.remove("shaking"), 400);
  }

  /* -------------------------------------------------------------------
   * 14. Centralisation des changements d'état -> mise à jour de l'UI
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
   * 15. API publique : intégration avec le moteur principal du fangame
   * ------------------------------------------------------------------- */
  function open(){
    if (!els.scene) cacheDom();
    els.scene.hidden = false;
    els.scene.setAttribute("aria-hidden", "false");
    els.scene.focus?.();
  }

  function close(){
    stopCurrentAudioInstance();
    if (els.scene){
      els.scene.hidden = true;
      els.scene.setAttribute("aria-hidden", "true");
    }
  }

  /* -------------------------------------------------------------------
   * 16. Initialisation (une seule fois, au chargement du script)
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

  return { open, close };

})();

/* ---------------------------------------------------------------------
 * Fonctions publiques exposées au moteur principal du fangame
 * ------------------------------------------------------------------- */
function loadTapeScene(){
  TapeScene.open();
}

function closeTapeScene(){
  TapeScene.close();
}
