/*
 * Psychological Director AI
 *
 * Objectif:
 * - Estimer un etat mental du joueur en temps reel
 * - Ajuster discretement la pression (agressivite, bruit camera, faux relachements)
 * - Declencher des anomalies rares (Golden Freddy comme symptome)
 */
(function attachPsychologicalDirector(globalScope) {
  'use strict';

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function chance(probability) {
    return Math.random() < probability;
  }

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

  const director = {
    enabled: DIRECTOR_DEFAULTS.enabled,
    config: { ...DIRECTOR_DEFAULTS },

    state: {
      fear: 0.25,
      stress: 0.2,
      boredom: 0.3,
      confidence: 0.35,
      attention: 0.5
    },

    runtime: {
      cameraNoise: 1,
      cameraJitter: 1,
      aggressionBias: 0,
      fakeoutBoost: 0,
      lightInstability: 0,
      pendingGoldenFlicker: false,
      pendingIntervention: null
    },

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

    timers: {
      accumulator: 0,
      nextPhoneInterventionAt: 0,
      nextGoldenFlickerAt: 0
    },

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

    consumeIntervention() {
      const pending = this.runtime.pendingIntervention;
      this.runtime.pendingIntervention = null;
      return pending;
    },

    consumeGoldenFlicker(cameraId) {
      if (!this.runtime.pendingGoldenFlicker) return false;
      if (!cameraId) return false;

      if (cameraId === 'safe') {
        return false;
      }

      this.runtime.pendingGoldenFlicker = false;
      return true;
    },

    getCameraDistortionProfile() {
      return {
        noiseMultiplier: this.runtime.cameraNoise,
        jitterMultiplier: this.runtime.cameraJitter
      };
    },

    getLightInstability() {
      return this.runtime.lightInstability;
    },

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

    shouldFakeoutAttack(animatronicName) {
      const base = this.config.fakeoutBaseChance;
      const foxyPenalty = animatronicName === 'Foxy' ? 0.02 : 0;
      const probability = clamp(base + this.runtime.fakeoutBoost - foxyPenalty, 0.01, 0.3);
      return chance(probability);
    },

    notifyUserInput() {
      this.metrics.timeSinceInput = 0;
      this.metrics.rapidActionsWindow = clamp(this.metrics.rapidActionsWindow + 0.4, 0, 8);
      this.state.attention = clamp(this.state.attention + 0.03, 0, 1);
    },

    notifyCameraToggle(isOpen) {
      this.notifyUserInput();
      if (isOpen) {
        this.metrics.rapidActionsWindow = clamp(this.metrics.rapidActionsWindow + 0.6, 0, 8);
      }
    },

    notifyCameraSwitch(cameraId) {
      this.notifyUserInput();
      if (cameraId && cameraId !== this.metrics.lastCameraId) {
        this.metrics.cameraSwitchCount += 1;
        this.metrics.lastCameraId = cameraId;
      }
      this.state.confidence = clamp(this.state.confidence + 0.01, 0, 1);
    },

    notifyDoorToggle(side, isClosed) {
      void side;
      this.notifyUserInput();
      this.metrics.doorToggleCount += 1;
      this.metrics.rapidActionsWindow = clamp(this.metrics.rapidActionsWindow + 0.8, 0, 8);

      if (isClosed) {
        this.state.stress = clamp(this.state.stress + 0.02, 0, 1);
      }
    },

    notifyLightChange(side, isOn) {
      void side;
      this.notifyUserInput();
      this.metrics.lightToggleCount += 1;

      if (isOn) {
        this.state.stress = clamp(this.state.stress + 0.01, 0, 1);
      }
    },

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

    notifyNearMiss() {
      this.metrics.nearMissCount += 1;
      this.state.stress = clamp(this.state.stress + 0.04, 0, 1);
      this.state.fear = clamp(this.state.fear + 0.03, 0, 1);
    },

    getDebugState() {
      return {
        enabled: this.enabled,
        ...this.state,
        ...this.runtime
      };
    }
  };

  director.resetForNewNight(1);
  globalScope.PsychologicalDirector = director;
})(window);
