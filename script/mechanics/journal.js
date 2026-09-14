/**
 * Scène "Journaux" — coupures de presse en plein écran.
 *
 * Affichée à la fin de chaque nuit réussie, après l'écran de victoire et
 * avant le fondu vers la nuit suivante (cf. transitionEndNight() dans
 * script/app/render.js) : l'image du journal occupe tout l'écran, les
 * flèches latérales parcourent les journaux déjà trouvés, et le bouton
 * lance la nuit suivante (ou la séquence de fin après la dernière nuit).
 *
 * Le bouton ne referme pas la scène : il masque seulement les commandes et
 * laisse le journal à l'écran, le fondu de la nuit suivante venant le
 * recouvrir. C'est runNightTransition() qui appelle close() à la fin du
 * fondu, en même temps qu'il coupe la musique du menu principal jouée en
 * fond pendant toute la scène.
 *
 * Les journaux sont débloqués par les événements aléatoires (champ
 * `journal`, cf. Collectibles.unlockJournal() dans random_events_engine.js)
 * et restent acquis pour toute la partie : la scène s'ouvre sur le dernier
 * trouvé, les précédents restent consultables avec les flèches.
 * ensureNightJournals() garantit qu'aucune nuit ne se termine sans au moins
 * une nouvelle lecture.
 */
const JournalViewer = (() => {

  const MUSIC_ID = "menu_start2";

  let els = {};
  let items = [];
  let index = 0;
  let onDoneCallback = null;

  function cacheDom(){
    els = {
      scene:       document.getElementById("journal-scene"),
      image:       document.getElementById("journal-image"),
      btnPrev:     document.getElementById("journal-prev"),
      btnNext:     document.getElementById("journal-next"),
      btnContinue: document.getElementById("journal-continue")
    };
  }

  /**
   * Garantit au moins un journal par nuit : à la fin de la nuit N, le joueur
   * doit posséder au moins N journaux. Si les événements aléatoires n'en ont
   * pas assez donné, on complète avec les journaux rattachés à la nuit en
   * cours ou aux nuits précédentes (champ `night` de journals_data.json),
   * puis avec ceux des nuits suivantes une fois cette réserve épuisée — le
   * cas des nuits 5 et 6, auxquelles aucun journal n'est rattaché.
   * @param {number} night - Nuit qui vient de se terminer.
   */
  function ensureNightJournals(night){
    const unlockedCodes = Collectibles.getUnlockedJournals();
    const missing = night - unlockedCodes.length;
    if (missing <= 0) return;

    JOURNALS_LIBRARY
      .filter(journal => !unlockedCodes.includes(journal.code))
      .sort((a, b) => unlockPriority(a, night) - unlockPriority(b, night))
      .slice(0, missing)
      .forEach(journal => Collectibles.unlockJournal(journal.code));
  }

  function unlockPriority(journal, night){
    const journalNight = journal.night || MAX_NIGHT;
    // Les journaux déjà "d'actualité" d'abord, du plus ancien au plus récent ;
    // ceux des nuits à venir seulement en dernier recours.
    return journalNight <= night ? journalNight : 100 + journalNight;
  }

  function continueLabel(night){
    if (!Number.isFinite(night)) return "CONTINUER";
    if (night >= MAX_NIGHT) return "VOIR LA FIN ▶";
    return `LANCER LA NUIT ${night + 1} ▶`;
  }

  function render(){
    const journal = items[index];

    els.image.src = journal.image || "";
    els.image.alt = journal.title || "";
    els.image.hidden = !journal.image;

    els.btnPrev.disabled = index === 0;
    els.btnNext.disabled = index === items.length - 1;
  }

  function onPrev(){
    if (index > 0) {
      index--;
      render();
    }
  }

  function onNext(){
    if (index < items.length - 1) {
      index++;
      render();
    }
  }

  /**
   * Referme la scène. Appelé par runNightTransition() une fois le fondu
   * terminé, pas au clic sur le bouton : le journal doit rester visible
   * jusqu'à ce que le fondu l'ait recouvert.
   */
  function close(){
    if (!els.scene) return;
    els.scene.hidden = true;
    els.scene.setAttribute("aria-hidden", "true");
    els.scene.classList.remove("is-leaving");
  }

  function onContinue(){
    els.scene.classList.add("is-leaving"); // masque flèches et bouton
    const callback = onDoneCallback;
    onDoneCallback = null;
    if (typeof callback === "function") callback();
  }

  /**
   * Affiche les journaux en plein écran, en commençant par le dernier trouvé.
   * @param {number} night - Nuit qui vient de se terminer. Détermine le
   *   libellé du bouton et le complément de journaux garanti. Omettre pour
   *   une simple consultation (cf. debugShowJournals()).
   * @param {Function} onDone - Appelé à la fermeture de la scène.
   */
  function open(night, onDone){
    if (!els.scene) cacheDom();

    if (Number.isFinite(night)) ensureNightJournals(night);

    // getUnlockedJournals() renvoie les codes dans l'ordre de découverte :
    // le dernier élément est donc le journal trouvé le plus récemment.
    items = Collectibles.getUnlockedJournals()
      .map(code => JOURNALS_LIBRARY.find(journal => journal.code === code))
      .filter(Boolean);

    if (items.length === 0) {
      if (typeof onDone === "function") onDone();
      return;
    }

    index = items.length - 1;
    onDoneCallback = onDone;
    els.btnContinue.textContent = continueLabel(night);
    render();

    els.scene.hidden = false;
    els.scene.setAttribute("aria-hidden", "false");
    els.scene.classList.remove("is-leaving");
    playSoundLoop(MUSIC_ID);
  }

  function init(){
    cacheDom();
    els.btnPrev.addEventListener("click", onPrev);
    els.btnNext.addEventListener("click", onNext);
    els.btnContinue.addEventListener("click", onContinue);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return { open, close, MUSIC_ID };

})();
