/**
 * Scène "Fin de partie" — lecteur plein écran des cinématiques de fin
 * (ressources/Tape/TAPE_ERREUR_08.mp4 / TAPE_ERREUR_09.mp4).
 *
 * Appelée depuis runNightEndSequence() dans script/app/render.js, à la
 * place de l'écran statique "game_over_end", une fois la nuit 6 terminée.
 * La bonne ou la mauvaise fin dépend de la ligne narrative secrète des
 * cassettes Cassidy (TAPE_ERREUR_01 à 07, débloquées par les événements
 * cachés CASSIDY-01 à 07 — cf. script/config/random_events_data.json) :
 * il faut avoir écouté les 7 jusqu'au bout (Collectibles.isTapeListened(),
 * mis à jour par onPlaybackEnded() dans script/mechanics/tape.js) pour
 * déclencher la bonne fin.
 */
const EndingScene = (() => {

  const CASSIDY_TAPE_CODES = [
    "TAPE_ERREUR_01", "TAPE_ERREUR_02", "TAPE_ERREUR_03", "TAPE_ERREUR_04",
    "TAPE_ERREUR_05", "TAPE_ERREUR_06", "TAPE_ERREUR_07"
  ];

  const GOOD_ENDING_VIDEO = "ressources/Tape/TAPE_ERREUR_08.mp4";
  const BAD_ENDING_VIDEO = "ressources/Tape/TAPE_ERREUR_09.mp4";

  let els = {};

  function cacheDom(){
    els = {
      scene:   document.getElementById("ending-scene"),
      video:   document.getElementById("ending-video"),
      skipBtn: document.getElementById("ending-skip")
    };
  }

  function hasGoodEnding(){
    return CASSIDY_TAPE_CODES.every(code => Collectibles.isTapeListened(code));
  }

  function close(){
    if (!els.scene) return;
    els.video.pause();
    els.video.removeAttribute("src");
    els.video.load();
    els.scene.hidden = true;
    els.scene.setAttribute("aria-hidden", "true");
  }

  /**
   * Joue la cinématique de fin correspondante (bonne ou mauvaise fin selon
   * hasGoodEnding()). Se ferme d'elle-même à la fin de la vidéo, ou via le
   * bouton "Passer".
   */
  function playEnding(){
    if (!els.scene) cacheDom();
    if (!els.scene || !els.video) return;

    els.video.src = hasGoodEnding() ? GOOD_ENDING_VIDEO : BAD_ENDING_VIDEO;
    els.scene.hidden = false;
    els.scene.setAttribute("aria-hidden", "false");
    els.video.currentTime = 0;
    els.video.play().catch(() => {}); // autoplay bloqué par le navigateur : le joueur reste sur l'écran, bouton "Passer" toujours disponible
  }

  function init(){
    cacheDom();
    if (!els.scene) return;
    els.video.addEventListener("ended", close);
    els.skipBtn.addEventListener("click", close);
    // Filet de sécurité si l'autoplay a été bloqué par le navigateur
    // (play() rejeté silencieusement dans playEnding()) : un clic sur la
    // vidéo relance la lecture.
    els.video.addEventListener("click", () => {
      if (els.video.paused) els.video.play().catch(() => {});
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return { playEnding };

})();
