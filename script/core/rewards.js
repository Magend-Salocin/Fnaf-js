/**
 * Récompenses des anomalies (cf. .github/Projet/Next/Parcours_Enquete.md,
 * section 2). Données : REWARDS_DATA (script/config/rewards_data.json).
 *
 * Un événement ne porte plus sa récompense. Son enfant se déduit du préfixe
 * de son id (GAB-001 -> GAB). Quand une anomalie est vue :
 *  - si elle termine une chaîne, elle donne la cassette de fin, et rien d'autre ;
 *  - sinon, elle ouvre le log des chaînes dont elle est une porte (première
 *    anomalie de l'enfant, ou liste `openEvents` pour Cassidy) ;
 *  - et elle donne la prochaine récompense non possédée de la réserve de son
 *    enfant, si la nuit minimale de celle-ci est atteinte. Sinon rien : la
 *    récompense attend.
 *
 * Ce qui est donné reste acquis d'une partie à l'autre (Collectibles).
 */
const Rewards = (() => {
  const POOLS = REWARDS_DATA.pools;
  const CHAINS = REWARDS_DATA.chains;

  const chainByFinalEvent = new Map(
    CHAINS.filter(chain => chain.finalEvent).map(chain => [chain.finalEvent, chain])
  );

  // Logs ouverts par une anomalie : tous les autres s'ouvrent par la nuit
  // (champ minNight du log, cf. lore_core.js).
  const REWARD_LOGS = new Set([
    ...CHAINS.map(chain => chain.log),
    ...Object.values(POOLS).flat().filter(reward => reward.kind === "log").map(reward => reward.code)
  ]);

  function childOf(event) {
    const prefix = event.id.split("-")[0];
    return POOLS[prefix] ? prefix : null;
  }

  function isOwned(reward) {
    if (reward.kind === "tape") return Collectibles.isTapeUnlocked(reward.code);
    if (reward.kind === "journal") return Collectibles.isJournalUnlocked(reward.code);
    return Collectibles.isLogUnlocked(reward.code);
  }

  function grant(reward) {
    if (reward.kind === "tape") Collectibles.unlockTape(reward.code);
    else if (reward.kind === "journal") Collectibles.unlockJournal(reward.code);
    else Collectibles.unlockLog(reward.code);
  }

  function isChainDoor(chain, event) {
    return chain.openEvents
      ? chain.openEvents.includes(event.id)
      : chain.child === childOf(event);
  }

  /**
   * Prochaine récompense de la réserve, ou null si la réserve est vide ou si
   * la prochaine attend une nuit ultérieure.
   */
  function nextPoolReward(child, night) {
    const next = POOLS[child].find(reward => !isOwned(reward));
    return next && next.minNight <= night ? next : null;
  }

  /** À appeler quand une anomalie se déclenche. */
  function onEventTriggered(event, night) {
    const endedChain = chainByFinalEvent.get(event.id);
    if (endedChain) {
      Collectibles.unlockTape(endedChain.finalTape);
      return;
    }

    CHAINS.filter(chain => isChainDoor(chain, event))
      .forEach(chain => Collectibles.unlockLog(chain.log));

    const child = childOf(event);
    const reward = child && nextPoolReward(child, night);
    if (reward) grant(reward);
  }

  /** L'anomalie de fin de chaîne attend que le log de la chaîne ait été lu. */
  function canTrigger(event) {
    const chain = chainByFinalEvent.get(event.id);
    if (!chain) return true;
    return typeof LoreCore !== "undefined" && LoreCore.isFound(chain.log);
  }

  /** Vrai pour un log de chaîne ou bonus que le joueur n'a pas encore obtenu. */
  function isLogLocked(command) {
    return REWARD_LOGS.has(command) && !Collectibles.isLogUnlocked(command);
  }

  return { onEventTriggered, canTrigger, isLogLocked };
})();
