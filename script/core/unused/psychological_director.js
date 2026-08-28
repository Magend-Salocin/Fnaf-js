/*
 * IA Directeur Psychologique
 *
 * Objectif:
 * - Estimer l'etat mental du joueur en temps reel.
 * - Ajuster discretement la pression (agressivite, bruit camera, faux relachements).
 * - Declencher des anomalies rares (Golden Freddy comme symptome).
 */
(function attachPsychologicalDirector(globalScope) {
  'use strict';

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function chance(probability) {
    return Math.random() < probability;
  }

  /**
   * Parametres de base du directeur.
   * Chaque valeur peut etre ajustee pour changer le rythme psychologique.
   */
  const DIRECTOR_DEFAULTS = Object.freeze({
    enabled: true,
    updateIntervalSeconds: 1,
    phoneInterventionCooldownSeconds: 55,
    goldenFlickerCooldownSeconds: 20,
    fakeoutBaseChance: 0.03,
    maxAggressionDelta: 2,
    cameraNoiseMin: 0.8,
    cameraNoiseMax: 2.2,
    confidenceGrowthPerSecond: 0.015,
    stressDecayPerSecond: 0.03,
    boredomGrowthPerSecond: 0.025,
    fearDecayPerSecond: 0.02,
    attentionDecayPerSecond: 0.04
  });

  /**
   * Objet principal du directeur.
   * Il joue le role d'une classe singleton exposee globalement.
   */
  const director = {
    enabled: DIRECTOR_DEFAULTS.enabled,
    config: { ...DIRECTOR_DEFAULTS },

    /**
     * Etat mental estime du joueur (normalise entre 0 et 1).
     */
    state: {
      fear: 0.25,
      stress: 0.2,
      boredom: 0.3,
      confidence: 0.35,
      attention: 0.5
    },

    /**
     * Sorties runtime calculees a partir de l'etat mental.
     * Ces valeurs pilotent les systemes visuels/gameplay.
     */
    runtime: {
      cameraNoise: 1,
      cameraJitter: 1,
      aggressionBias: 0,
      fakeoutBoost: 0,
      lightInstability: 0,
      pendingGoldenFlicker: false,
      pendingIntervention: null
    },

    /**
     * Metriques de comportement collectees pendant la partie.
     */
    metrics: {
      timeSinceInput: 0,
      timeInCamera: 0,
      rapidActionsWindow: 0,
      cameraSwitchCount: 0,
      doorToggleCount: 0,
      lightToggleCount: 0,
      nearMissCount: 0,
      successfulBlocks: 0,
      failedBlocks: 0,
      lastCameraId: null
    },

    /**
     * Timers internes utilises pour lisser les decisions.
     */
    timers: {
      accumulator: 0,
      nextPhoneInterventionAt: 0,
      nextGoldenFlickerAt: 0
    },

    /**
     * Reinitialise completement le directeur au debut d'une nuit.
     * @param {number} nightNumber Numero de la nuit courante.
     */
    resetForNewNight(nightNumber) {
      const normalizedNight = clamp((Number(nightNumber) || 1) / 6, 0, 1);

      this.state.fear = 0.2 + normalizedNight * 0.12;
      this.state.stress = 0.15 + normalizedNight * 0.12;
      this.state.boredom = 0.35;
      this.state.confidence = 0.25;
      this.state.attention = 0.45;

      this.runtime.cameraNoise = 1;
      this.runtime.cameraJitter = 1;
      this.runtime.aggressionBias = 0;
      this.runtime.fakeoutBoost = 0;
      this.runtime.lightInstability = 0;
      this.runtime.pendingGoldenFlicker = false;
      this.runtime.pendingIntervention = null;

      this.metrics.timeSinceInput = 0;
      this.metrics.timeInCamera = 0;
      this.metrics.rapidActionsWindow = 0;
      this.metrics.cameraSwitchCount = 0;
      this.metrics.doorToggleCount = 0;
      this.metrics.lightToggleCount = 0;
      this.metrics.nearMissCount = 0;
      this.metrics.successfulBlocks = 0;
      this.metrics.failedBlocks = 0;
      this.metrics.lastCameraId = null;

      this.timers.accumulator = 0;
      this.timers.nextPhoneInterventionAt = 20;
      this.timers.nextGoldenFlickerAt = 8;
    },

    /**
     * Met a jour le modele psychologique selon le delta temps.
     * @param {number} dtSeconds Delta temps en secondes.
     */
    update(dtSeconds) {
      if (!this.enabled) return;
      if (typeof gameEnd !== 'undefined' && gameEnd) return;

      const dt = Math.max(0, Number(dtSeconds) || 0);
      this.timers.accumulator += dt;

      this.metrics.timeSinceInput += dt;
      this.metrics.timeInCamera += (typeof activeView !== 'undefined' && activeView === 'camera') ? dt : 0;
      this.metrics.rapidActionsWindow = Math.max(0, this.metrics.rapidActionsWindow - dt * 0.8);

      if (this.timers.accumulator < this.config.updateIntervalSeconds) {
        return;
      }

      const tick = this.timers.accumulator;
      this.timers.accumulator = 0;

      const panicSignal = clamp(this.metrics.rapidActionsWindow / 6, 0, 1);
      const idleSignal = clamp(this.metrics.timeSinceInput / 18, 0, 1);
      const cameraSignal = clamp(this.metrics.timeInCamera / 20, 0, 1);
      const threatSignal = clamp((this.metrics.failedBlocks + this.metrics.nearMissCount * 0.6) / 4, 0, 1);

      this.state.boredom = clamp(
        this.state.boredom + (idleSignal * this.config.boredomGrowthPerSecond - panicSignal * 0.04) * tick,
        0,
        1
      );

      this.state.stress = clamp(
        this.state.stress + ((panicSignal * 0.16 + threatSignal * 0.11) - this.config.stressDecayPerSecond) * tick,
        0,
        1
      );

      this.state.confidence = clamp(
        this.state.confidence + ((idleSignal * this.config.confidenceGrowthPerSecond + cameraSignal * 0.02) - panicSignal * 0.08) * tick,
        0,
        1
      );

      this.state.attention = clamp(
        this.state.attention + ((1 - idleSignal) * 0.08 - this.config.attentionDecayPerSecond) * tick,
        0,
        1
      );

      this.state.fear = clamp(
        this.state.fear + ((this.state.stress * 0.11 + threatSignal * 0.1) - this.config.fearDecayPerSecond) * tick,
        0,
        1
      );

      this.runtime.cameraNoise = clamp(
        0.95 + this.state.confidence * 0.75 + this.state.boredom * 0.35 - this.state.stress * 0.25,
        this.config.cameraNoiseMin,
        this.config.cameraNoiseMax
      );

      this.runtime.cameraJitter = clamp(0.8 + this.runtime.cameraNoise * 0.55, 0.8, 2.4);
      this.runtime.lightInstability = clamp(0.08 + this.state.confidence * 0.48, 0, 0.85);

      this.runtime.aggressionBias = clamp(
        this.state.confidence * 0.85 - this.state.stress * 0.35 - this.state.fear * 0.15,
        -1,
        1
      );

      this.runtime.fakeoutBoost = clamp(this.state.confidence * 0.5 + this.state.attention * 0.25, 0, 0.6);

      this.planGoldenFlicker();
      this.planPhoneIntervention();

      this.metrics.cameraSwitchCount = 0;
      this.metrics.doorToggleCount = 0;
      this.metrics.lightToggleCount = 0;
      this.metrics.nearMissCount = 0;
      this.metrics.successfulBlocks = 0;
      this.metrics.failedBlocks = 0;
      this.metrics.timeInCamera = 0;
    },

    /**
     * Planifie une apparition fugace de type Golden Freddy.
     * L'effet est volontairement rare et ambigu.
     */
    planGoldenFlicker() {
      if (this.timers.nextGoldenFlickerAt > 0) {
        this.timers.nextGoldenFlickerAt -= 1;
        return;
      }

      const calmControlState = this.state.confidence > 0.62 && this.state.stress < 0.58;
      if (!calmControlState) {
        return;
      }

      const flickerChance = clamp(0.06 + this.state.confidence * 0.12, 0.04, 0.2);
      if (chance(flickerChance)) {
        this.runtime.pendingGoldenFlicker = true;
        this.timers.nextGoldenFlickerAt = this.config.goldenFlickerCooldownSeconds;
      }
    },

    /**
     * Planifie une intervention de type Phone Guy pour stabiliser
     * ponctuellement la pression mentale.
     */
    planPhoneIntervention() {
      if (this.timers.nextPhoneInterventionAt > 0) {
        this.timers.nextPhoneInterventionAt -= 1;
        return;
      }

      const shouldStabilize = this.state.stress > 0.72 || (this.state.fear > 0.7 && this.state.attention > 0.6);
      if (!shouldStabilize) {
        return;
      }

      this.runtime.pendingIntervention = { type: 'phone-reset', variant: chance(0.3) ? 'anomaly' : 'normal' };
      this.timers.nextPhoneInterventionAt = this.config.phoneInterventionCooldownSeconds;
    },

    /**
     * Consomme l'intervention planifiee (lecture unique).
     * @returns {{type: string, variant: string}|null}
     */
    consumeIntervention() {
      const pending = this.runtime.pendingIntervention;
      this.runtime.pendingIntervention = null;
      return pending;
    },

    /**
     * Consomme un flicker Golden Freddy sur la camera donnee.
     * @param {string} cameraId Identifiant de la camera active.
     * @returns {boolean} true si un flicker doit etre affiche.
     */
    consumeGoldenFlicker(cameraId) {
      if (!this.runtime.pendingGoldenFlicker) return false;
      if (!cameraId) return false;

      if (cameraId === 'safe') {
        return false;
      }

      this.runtime.pendingGoldenFlicker = false;
      return true;
    },

    /**
     * Retourne le profil de distorsion a appliquer au rendu camera.
     * @returns {{noiseMultiplier: number, jitterMultiplier: number}}
     */
    getCameraDistortionProfile() {
      return {
        noiseMultiplier: this.runtime.cameraNoise,
        jitterMultiplier: this.runtime.cameraJitter
      };
    },

    /**
     * Retourne le niveau d'instabilite des lumieres (0..1).
     * @returns {number}
     */
    getLightInstability() {
      return this.runtime.lightInstability;
    },

    /**
     * Calcule un delta d'agressivite contextuel pour un animatronique.
     * @param {string} animatronicName Nom de l'animatronique.
     * @returns {number}
     */
    getAggressionDelta(animatronicName) {
      const roleWeight = {
        Freddy: 0.8,
        Bonnie: 1,
        Chica: 0.9,
        Foxy: 1.1
      };

      const weight = roleWeight[animatronicName] || 1;
      const rawDelta = this.runtime.aggressionBias * this.config.maxAggressionDelta * weight;
      return Math.round(clamp(rawDelta, -this.config.maxAggressionDelta, this.config.maxAggressionDelta));
    },

    /**
     * Indique si l'attaque doit etre annulee en fakeout.
     * @param {string} animatronicName Nom de l'animatronique.
     * @returns {boolean}
     */
    shouldFakeoutAttack(animatronicName) {
      const base = this.config.fakeoutBaseChance;
      const foxyPenalty = animatronicName === 'Foxy' ? 0.02 : 0;
      const probability = clamp(base + this.runtime.fakeoutBoost - foxyPenalty, 0.01, 0.3);
      return chance(probability);
    },

    /**
     * Signale une action utilisateur generique (input).
     */
    notifyUserInput() {
      this.metrics.timeSinceInput = 0;
      this.metrics.rapidActionsWindow = clamp(this.metrics.rapidActionsWindow + 0.4, 0, 8);
      this.state.attention = clamp(this.state.attention + 0.03, 0, 1);
    },

    /**
     * Signale l'ouverture/fermeture du moniteur camera.
     * @param {boolean} isOpen true si la camera vient de s'ouvrir.
     */
    notifyCameraToggle(isOpen) {
      this.notifyUserInput();
      if (isOpen) {
        this.metrics.rapidActionsWindow = clamp(this.metrics.rapidActionsWindow + 0.6, 0, 8);
      }
    },

    /**
     * Signale un changement de camera observee.
     * @param {string} cameraId Camera active.
     */
    notifyCameraSwitch(cameraId) {
      this.notifyUserInput();
      if (cameraId && cameraId !== this.metrics.lastCameraId) {
        this.metrics.cameraSwitchCount += 1;
        this.metrics.lastCameraId = cameraId;
      }
      this.state.confidence = clamp(this.state.confidence + 0.01, 0, 1);
    },

    /**
     * Signale un changement d'etat d'une porte.
     * @param {string} side Cote de la porte.
     * @param {boolean} isClosed true si la porte est fermee.
     */
    notifyDoorToggle(side, isClosed) {
      void side;
      this.notifyUserInput();
      this.metrics.doorToggleCount += 1;
      this.metrics.rapidActionsWindow = clamp(this.metrics.rapidActionsWindow + 0.8, 0, 8);

      if (isClosed) {
        this.state.stress = clamp(this.state.stress + 0.02, 0, 1);
      }
    },

    /**
     * Signale un changement d'etat d'une lumiere.
     * @param {string} side Cote de la lumiere.
     * @param {boolean} isOn true si la lumiere est allumee.
     */
    notifyLightChange(side, isOn) {
      void side;
      this.notifyUserInput();
      this.metrics.lightToggleCount += 1;

      if (isOn) {
        this.state.stress = clamp(this.state.stress + 0.01, 0, 1);
      }
    },

    /**
     * Signale le resultat d'une tentative d'attaque animatronique.
     * @param {{blocked?: boolean, success?: boolean}} payload
     */
    notifyAttackAttempt(payload) {
      const blocked = Boolean(payload?.blocked);
      const success = Boolean(payload?.success);

      if (blocked) {
        this.metrics.successfulBlocks += 1;
        this.state.confidence = clamp(this.state.confidence + 0.04, 0, 1);
      }

      if (success) {
        this.metrics.failedBlocks += 1;
        this.state.stress = clamp(this.state.stress + 0.08, 0, 1);
        this.state.fear = clamp(this.state.fear + 0.09, 0, 1);
      }
    },

    /**
     * Signale un quasi-incident (near miss) pour augmenter la tension.
     */
    notifyNearMiss() {
      this.metrics.nearMissCount += 1;
      this.state.stress = clamp(this.state.stress + 0.04, 0, 1);
      this.state.fear = clamp(this.state.fear + 0.03, 0, 1);
    },

    /**
     * Retourne l'etat utile au debug.
     * @returns {object}
     */
    getDebugState() {
      return {
        enabled: this.enabled,
        ...this.state,
        ...this.runtime
      };
    }
  };

  // Initialisation par defaut avant exposition globale.
  director.resetForNewNight(1);
  globalScope.PsychologicalDirector = director;
})(window);
