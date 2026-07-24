/**
 * AnalogVideoEngine — FNAF 1 Camera Calibration
 *
 * Reproduces the visual characteristics of Five Nights at Freddy's 1 security cameras.
 *
 * Key insight: FNAF's image character is NOT achieved through overlaid effects.
 * The image IS the grain + contrast + darkness. They are inseparable.
 *
 * The rendering pipeline:
 *   Scene → Lens → CCD Sensor → Gain Amplification → Cable Transmission
 *         → Canvas Rendering (ctx.filter for color-grade + grain overlay)
 */
const AnalogVideoEngine = (() => {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────
  // CAMERA PROFILES — calibrated against FNAF 1 reference images
  // ─────────────────────────────────────────────────────────────────────────
  const PROFILES = {

    '1a': {
      // Show Stage — cleanest camera, minimal noise
      brightness : 0.98,
      contrast   : 1.15,
      saturation : 0.92,
      warmth     : 0,
      hueShift   : 0,
      vignette   : 0.08,
      gain       : 0.08,   // Very faint grain
      grainStep  : 1,
      grainFps   : 24,
      signalStrength : 0.95,
      bands          : 0,
      jitter         : 0.05,
      trackingStability : 0.99,
      scanlineOpacity : 0.015,
      tintR: 128, tintG: 128, tintB: 128, tintA: 0.001,
    },

    '1b': {
      // Dining Area — older unit, medium grain
      brightness : 0.85,
      contrast   : 1.18,
      saturation : 0.88,
      warmth     : 0,
      hueShift   : 0,
      vignette   : 0.15,
      gain       : 0.18,
      grainStep  : 1,
      grainFps   : 20,
      signalStrength : 0.85,
      bands          : 0,
      jitter         : 0.1,
      trackingStability : 0.94,
      scanlineOpacity : 0.025,
      tintR: 128, tintG: 128, tintB: 128, tintA: 0.002,
    },

    '1c': {
      // Pirate Cove — DOMINANT grain is the visual character
      brightness : 0.62,
      contrast   : 1.32,
      saturation : 0.85,
      warmth     : 0,
      hueShift   : 0,
      vignette   : 0.25,
      gain       : 0.55,   // HEAVY grain — visual foundation
      grainStep  : 1,
      grainFps   : 14,
      signalStrength : 0.60,
      bands          : 0,
      jitter         : 0.2,
      trackingStability : 0.80,
      scanlineOpacity : 0.035,
      tintR: 128, tintG: 128, tintB: 128, tintA: 0.002,
    },

    '2a': {
      // West Hall — very dark, medium-heavy grain
      brightness : 0.68,
      contrast   : 1.24,
      saturation : 0.87,
      warmth     : 0,
      hueShift   : 0,
      vignette   : 0.22,
      gain       : 0.32,
      grainStep  : 1,
      grainFps   : 18,
      signalStrength : 0.75,
      bands          : 0,
      jitter         : 0.1,
      trackingStability : 0.90,
      scanlineOpacity : 0.03,
      tintR: 128, tintG: 128, tintB: 128, tintA: 0.002,
    },

    '2b': {
      // West Hall Corner — slightly better signal
      brightness : 0.76,
      contrast   : 1.20,
      saturation : 0.89,
      warmth     : 0,
      hueShift   : 0,
      vignette   : 0.18,
      gain       : 0.24,
      grainStep  : 1,
      grainFps   : 19,
      signalStrength : 0.82,
      bands          : 0,
      jitter         : 0.08,
      trackingStability : 0.93,
      scanlineOpacity : 0.025,
      tintR: 128, tintG: 128, tintB: 128, tintA: 0.001,
    },

    '3': {
      // Supply Closet — medium grain
      brightness : 0.82,
      contrast   : 1.16,
      saturation : 0.90,
      warmth     : 0,
      hueShift   : 0,
      vignette   : 0.12,
      gain       : 0.22,
      grainStep  : 1,
      grainFps   : 17,
      signalStrength : 0.80,
      bands          : 0,
      jitter         : 0.1,
      trackingStability : 0.92,
      scanlineOpacity : 0.025,
      tintR: 128, tintG: 128, tintB: 128, tintA: 0.002,
    },

    '4a': {
      // East Hall — very dark, medium-heavy grain
      brightness : 0.70,
      contrast   : 1.26,
      saturation : 0.88,
      warmth     : 0,
      hueShift   : 0,
      vignette   : 0.20,
      gain       : 0.30,
      grainStep  : 1,
      grainFps   : 19,
      signalStrength : 0.78,
      bands          : 0,
      jitter         : 0.1,
      trackingStability : 0.91,
      scanlineOpacity : 0.03,
      tintR: 128, tintG: 128, tintB: 128, tintA: 0.002,
    },

    '4b': {
      // East Hall Corner — very dark, heavy grain
      brightness : 0.64,
      contrast   : 1.30,
      saturation : 0.86,
      warmth     : 0,
      hueShift   : 0,
      vignette   : 0.24,
      gain       : 0.40,
      grainStep  : 1,
      grainFps   : 15,
      signalStrength : 0.70,
      bands          : 0,
      jitter         : 0.15,
      trackingStability : 0.85,
      scanlineOpacity : 0.035,
      tintR: 128, tintG: 128, tintB: 128, tintA: 0.002,
    },

    '5': {
      // Backstage — HEAVY grain, high contrast from harsh light
      brightness : 0.72,
      contrast   : 1.35,
      saturation : 0.85,
      warmth     : 0,
      hueShift   : 0,
      vignette   : 0.18,
      gain       : 0.45,   // Heavy grain
      grainStep  : 1,
      grainFps   : 12,
      signalStrength : 0.68,
      bands          : 0,
      jitter         : 0.2,
      trackingStability : 0.83,
      scanlineOpacity : 0.04,
      tintR: 128, tintG: 128, tintB: 128, tintA: 0.002,
    },

    '6': {
      // Kitchen — nearly unusable. EXTREME grain. You listen, not watch.
      brightness : 0.50,
      contrast   : 1.50,
      saturation : 0.80,
      warmth     : 0,
      hueShift   : 0,
      vignette   : 0.35,
      gain       : 0.70,   // EXTREME grain
      grainStep  : 1,
      grainFps   : 8,
      signalStrength : 0.40,
      bands          : 0,
      jitter         : 0.5,
      trackingStability : 0.70,
      scanlineOpacity : 0.05,
      tintR: 128, tintG: 128, tintB: 128, tintA: 0.003,
    },

    '7': {
      // Restroom — medium-light, light grain
      brightness : 0.88,
      contrast   : 1.12,
      saturation : 0.91,
      warmth     : 0,
      hueShift   : 0,
      vignette   : 0.10,
      gain       : 0.15,
      grainStep  : 1,
      grainFps   : 21,
      signalStrength : 0.88,
      bands          : 0,
      jitter         : 0.05,
      trackingStability : 0.95,
      scanlineOpacity : 0.02,
      tintR: 128, tintG: 128, tintB: 128, tintA: 0.001,
    },
  };

  const _states = {};

  function _getState(id) {
    if (_states[id]) return _states[id];
    let h = 5381;
    for (let i = 0; i < id.length; i++) {
      h = (((h << 5) + h) ^ id.charCodeAt(i)) >>> 0;
    }
    _states[id] = {
      time : ((h & 0xFFFF) / 65535) * 100,
      p1   : ((h >>>  0) & 0xFF) / 255 * Math.PI * 2,
      p3   : ((h >>> 16) & 0xFF) / 255 * Math.PI * 2,
      grainCanvas    : null,
      grainCtx       : null,
      grainLastUpdate: -999,
      grainW         : 0,
      grainH         : 0,
    };
    return _states[id];
  }

  function _breathe(t, baseFreq, phase) {
    return (
      Math.sin(t * baseFreq            + phase)        * 0.50 +
      Math.sin(t * baseFreq * 1.6180   + phase * 1.4)  * 0.30 +
      Math.sin(t * baseFreq * 2.7182   + phase * 0.7)  * 0.20
    );
  }

  function _stageVignette(ctx, p, w, h) {
    if (p.vignette <= 0) return;
    const cx = w * 0.5;
    const cy = h * 0.5;
    const inner  = h * 0.14;
    const outer  = Math.hypot(w, h) * 0.58;
    const grd = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
    grd.addColorStop(0.00, 'rgba(0,0,0,0)');
    grd.addColorStop(0.60, `rgba(0,0,0,${(p.vignette * 0.32).toFixed(3)})`);
    grd.addColorStop(1.00, `rgba(0,0,0,${p.vignette.toFixed(3)})`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
  }

  function _stageTint(ctx, p, w, h) {
    if (!p.tintA || p.tintA <= 0.0001) return;
    ctx.fillStyle = `rgba(${p.tintR},${p.tintG},${p.tintB},${p.tintA})`;
    ctx.fillRect(0, 0, w, h);
  }

  function _hash(x, y, t) {
    const n = Math.sin(
        x * 127.1 +
        y * 311.7 +
        t * 18.73
    ) * 43758.5453123;

    return n - Math.floor(n);
}

function _grainNoise(x, y, t) {

    const a = _hash(x, y, t);
    const b = _hash(x + 7, y + 3, t);

    return (a * 0.7 + b * 0.3) * 2 - 1;

}

  function _stageGrain(ctx, p, s, w, h) {
    if (p.gain <= 0) return;

    const step = p.grainStep;
    const ncW = Math.ceil(w / step);
    const ncH = Math.ceil(h / step);
    const t = s.time;

    if (!s.grainCanvas || s.grainW !== ncW || s.grainH !== ncH) {
        s.grainCanvas = document.createElement("canvas");
        s.grainCanvas.width = ncW;
        s.grainCanvas.height = ncH;
        s.grainCtx = s.grainCanvas.getContext("2d");
        s.grainW = ncW;
        s.grainH = ncH;
    }

    const interval = 1 / p.grainFps;

    if (t - s.grainLastUpdate >= interval) {

        s.grainLastUpdate = t;

        const breathe =
            0.90 +
            0.10 * _breathe(t, 1.8, s.p3);

        const gain = p.gain * breathe;

        const imgData = s.grainCtx.createImageData(ncW, ncH);
        const d = imgData.data;

        for (let y = 0; y < ncH; y++) {

            for (let x = 0; x < ncW; x++) {

                const index = (y * ncW + x) * 4;

                const noise =
                    _grainNoise(
                        x,
                        y,
                        t * 2.5
                    );

                // Grain plus doux
                const value =
                    128 +
                    noise * gain * 95;

                const v =
                    Math.max(
                        0,
                        Math.min(255, value)
                    );

                d[index] = v;
                d[index + 1] = v;
                d[index + 2] = v;

                // Opacité plus naturelle
                d[index + 3] =
                    Math.max(
                        6,
                        gain * 90
                    );
            }
        }

        s.grainCtx.putImageData(imgData, 0, 0);
    }

    ctx.save();

    ctx.globalCompositeOperation = "soft-light";

    ctx.globalAlpha = 0.65;

    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
        s.grainCanvas,
        0,
        0,
        ncW,
        ncH,
        0,
        0,
        w,
        h
    );

    ctx.restore();
}

  function _stageScanlines(ctx, p, w, h) {

    if (p.scanlineOpacity <= 0.005) return;

    ctx.save();

    ctx.globalAlpha = p.scanlineOpacity * 0.30;

    ctx.fillStyle = "#000";

    for (let y = 2; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1);
    }

    ctx.restore();
}

  // Minimal sync jitter — very rare, mostly invisible
  function _stageSyncJitter(ctx, p, w, h, s) {
    if (p.jitter < 0.05) return;
    const t = s.time;
    const activity = Math.max(0, _breathe(t, 0.28, s.p1) * 0.5 + 0.5);
    const count = Math.floor(p.jitter * activity * 2);
    if (count <= 0) return;

    ctx.save();
    for (let i = 0; i < count; i++) {
      const y = Math.floor(Math.random() * h);
      const alpha = 0.05 + Math.random() * 0.08;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
      ctx.fillRect(0, y, w, 1);
    }
    ctx.restore();
  }

  function getLensFilter(cameraId) {
    const p = PROFILES[cameraId];
    if (!p) return 'none';
    const parts = [
      `brightness(${p.brightness})`,
      `contrast(${p.contrast})`,
     // `saturate(${p.saturation})`,
    ];
    //if (p.warmth  > 0) parts.push(`sepia(${p.warmth})`);
    //if (p.hueShift !== 0) parts.push(`hue-rotate(${p.hueShift}deg)`);
    return parts.join(' ');
  }

 function renderOverlay(ctx, cameraId, w, h, dt) {
    const p = PROFILES[cameraId];
    if (!p) return;

    const s = _getState(cameraId);
    s.time += dt;

    const pixel = p.grainStep || 2;

    // Micro instabilité de la caméra
    const jitterX =
        (_grainNoise(11, 5, s.time * 18.0) - 0.5) *
        pixel *
        1.5;

    const jitterY =
        (_grainNoise(23, 9, s.time * 18.0) - 0.5) *
        pixel;

    // Léger pompage vidéo
    const flicker =
        0.94 +
        (_breathe(s.time, 1.2, s.p1) * 0.03);

    ctx.save();

    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();

    // La caméra "respire"
    ctx.translate(jitterX, jitterY);
    ctx.globalAlpha = flicker;

    // Pipeline
    _stageGrain(ctx, p, s, w, h);
    _stageVignette(ctx, p, w, h);
    _stageScanlines(ctx, p, w, h);

    // Quelques pixels parasites très discrets
    ctx.globalCompositeOperation = "screen";

    const noiseCount = Math.floor((w * h) / 2500);

    for (let i = 0; i < noiseCount; i++) {

        const x = Math.random() * w;
        const y = Math.random() * h;

        ctx.fillStyle =
            `rgba(255,255,255,${0.02 + Math.random() * 0.06})`;

        ctx.fillRect(x, y, 1, 1);

    }

    _stageSyncJitter(ctx, p, w, h, s);

    ctx.restore();
}

  return {
    getLensFilter,
    renderOverlay,
    PROFILES,
  };

})();
