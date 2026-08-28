/**
 * Scène "Journaux" — visionneuse des journaux débloqués.
 *
 * Affichée automatiquement en fin de nuit réussie (cf. transitionEndNight()
 * dans script/app/render.js), avant la séquence de victoire, si au moins
 * un journal a été débloqué par un événement aléatoire (champ `journal`,
 * cf. Collectibles.unlockJournal() dans random_events_engine.js). Les
 * journaux restent acquis pour toute la partie : on parcourt à chaque
 * fois l'ensemble de ceux trouvés jusqu'ici, pas seulement ceux de la nuit
 * qui vient de se terminer.
 */
const JournalViewer = (() => {

  let els = {};
  let items = [];
  let index = 0;
  let onDoneCallback = null;

  function cacheDom(){
    els = {
      scene:         document.getElementById("journal-scene"),
      imageWrap:     document.getElementById("journal-image-wrap"),
      image:         document.getElementById("journal-image"),
      title:         document.getElementById("journal-title"),
      date:          document.getElementById("journal-date"),
      article:       document.getElementById("journal-article"),
      caption:       document.getElementById("journal-caption"),
      source:        document.getElementById("journal-source"),
      pageIndicator: document.getElementById("journal-page-indicator"),
      btnPrev:       document.getElementById("journal-prev"),
      btnNext:       document.getElementById("journal-next"),
      btnContinue:   document.getElementById("journal-continue")
    };
  }

  function render(){
    const journal = items[index];

    els.title.textContent = journal.title || "";
    els.date.textContent = journal.date ? `Le ${journal.date}` : "";
    els.article.textContent = journal.article || "";
    els.caption.textContent = journal.caption || "";
    els.source.textContent = journal.source || "";

    if (journal.image) {
      els.image.src = journal.image;
      els.imageWrap.hidden = false;
    } else {
      els.imageWrap.hidden = true;
    }

    els.pageIndicator.textContent = `${index + 1} / ${items.length}`;
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

  function close(){
    if (els.scene) {
      els.scene.hidden = true;
      els.scene.setAttribute("aria-hidden", "true");
    }
  }

  function onContinue(){
    close();
    const callback = onDoneCallback;
    onDoneCallback = null;
    if (typeof callback === "function") callback();
  }

  /**
   * Ouvre la visionneuse sur tous les journaux débloqués à ce jour.
   * Si aucun journal n'a encore été trouvé, n'affiche rien et appelle
   * `onDone` immédiatement (la suite de la séquence de fin de nuit
   * continue sans interruption).
   * @param {Function} onDone - Appelé à la fermeture de la scène.
   */
  function open(onDone){
    if (!els.scene) cacheDom();

    const unlockedCodes = Collectibles.getUnlockedJournals();
    items = JOURNALS_LIBRARY.filter(journal => unlockedCodes.includes(journal.code));

    if (items.length === 0) {
      if (typeof onDone === "function") onDone();
      return;
    }

    index = items.length - 1; // ouvre sur le journal le plus récemment débloqué
    onDoneCallback = onDone;
    render();

    els.scene.hidden = false;
    els.scene.setAttribute("aria-hidden", "false");
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

  return { open };

})();
