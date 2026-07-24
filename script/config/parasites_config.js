/**
 * Configuration des parasites pour chaque caméra
 * Chaque caméra peut avoir son propre type d'effet de parasite
 */

const PARASITES_CONFIG = {
  // Stage - Très lumineux, très stable, très propre
  '1a': {
    name: 'Show Stage',
    enabled: true,
    jitterX: 0.4,
    jitterY: 0.3,

    flicker:{
        min:0.985,
        max:1.015
    },

    horizontalLines:{
        enabled:true,
        spacing:6,
        lineWidth:1,
        strokeStyle:'rgba(255,255,255,0.025)'
    },

    whiteNoise:{
        enabled:true,
        density:950,
        size:1,
        alphaRange:{min:0.02,max:0.18}
    },

    verticalLines:{
        enabled:false
    },

    horizontalBands:{
        enabled:true,
        density:260,
        minHeight:2,
        maxHeight:5,
        minAlpha:0.01,
        maxAlpha:0.035
    }
  },

  // Dining Area - Stable, un peu de bruit, léger tremblement
  '1b': {
    name: 'Dining Area',
    enabled: true,
    jitterX:0.7,
    jitterY:0.5,

    flicker:{
        min:0.98,
        max:1.03
    },

    horizontalLines:{
        enabled:true,
        spacing:5,
        lineWidth:1,
        strokeStyle:'rgba(255,255,255,0.03)'
    },

    whiteNoise:{
        enabled:true,
        density:760,
        size:1,
        alphaRange:{min:0.03,max:0.22}
    },

    verticalLines:{
        enabled:true,
        density:900,
        strokeStyle:'rgba(255,255,255,0.03)'
    },

    horizontalBands:{
        enabled:true,
        density:220,
        minHeight:2,
        maxHeight:6,
        minAlpha:0.015,
        maxAlpha:0.05
    }
  },

  // Pirate Cove - Très sombre, très bruyant, très instable
  '1c': {
    name: 'Pirate Cove',
    enabled: true,
    jitterX:2.3,
    jitterY:1.8,

    flicker:{
        min:0.94,
        max:1.08
    },

    horizontalLines:{
        enabled:true,
        spacing:3,
        lineWidth:1,
        strokeStyle:'rgba(255,255,255,0.05)'
    },

    whiteNoise:{
        enabled:true,
        density:320,
        size:1.2,
        alphaRange:{min:0.05,max:0.30}
    },

    verticalLines:{
        enabled:true,
        density:600,
        strokeStyle:'rgba(255,255,255,0.05)'
    },

    horizontalBands:{
        enabled:true,
        density:130,
        minHeight:3,
        maxHeight:9,
        minAlpha:0.03,
        maxAlpha:0.09
    }
  },

  // West Hall - Parasites discrets
  '2a': {
    name: 'West Hall',
    enabled: true,
    jitterX:0.5,
    jitterY:0.4,

    flicker:{
        min:0.985,
        max:1.02
    },

    horizontalLines:{
        enabled:true,
        spacing:7,
        lineWidth:1,
        strokeStyle:'rgba(255,255,255,0.02)'
    },

    whiteNoise:{
        enabled:true,
        density:1100,
        size:1,
        alphaRange:{min:0.02,max:0.16}
    },

    verticalLines:{
        enabled:false
    },

    horizontalBands:{
        enabled:true,
        density:300,
        minHeight:2,
        maxHeight:4,
        minAlpha:0.01,
        maxAlpha:0.03
    }
  },

  // West Hall Corner
  '2b': {
    name: 'West Hall Corner',
    enabled: true,
    jitterX:0.8,
    jitterY:0.5,

    flicker:{
        min:0.98,
        max:1.03
    },

    whiteNoise:{
        density:720,
        size:1,
        alphaRange:{min:0.03,max:0.20}
    },

    horizontalBands:{
        density:220,
        minHeight:2,
        maxHeight:5,
        minAlpha:0.015,
        maxAlpha:0.045
    }
  },

  // Supply Closet - Parasites jaunes/chauds
  '3': {
    name: 'Supply Closet',
    enabled: true,
    jitterX:1.2,
    jitterY:0.8,

    flicker:{
        min:0.97,
        max:1.05
    },

    whiteNoise:{
        density:520,
        size:1.1,
        alphaRange:{min:0.04,max:0.25}
    },

    horizontalBands:{
        density:180,
        minHeight:3,
        maxHeight:8,
        minAlpha:0.02,
        maxAlpha:0.07
    }
  },

  // East Hall
  '4a': {
    name: 'East Hall',
    enabled: true,
    jitterX:0.6,
    jitterY:0.4,

    flicker:{
        min:0.985,
        max:1.02
    },

    whiteNoise:{
        density:1050,
        size:1,
        alphaRange:{min:0.02,max:0.16}
    },

    horizontalBands:{
        density:280,
        minHeight:2,
        maxHeight:4,
        minAlpha:0.01,
        maxAlpha:0.03
    }
  },

  // East Hall Corner
  '4b': {
    name: 'East Hall Corner',
    enabled: true,
    jitterX:1.0,
    jitterY:0.7,

    flicker:{
        min:0.975,
        max:1.04
    },

    whiteNoise:{
        density:620,
        size:1.1,
        alphaRange:{min:0.03,max:0.22}
    },

    horizontalBands:{
        density:190,
        minHeight:2,
        maxHeight:7,
        minAlpha:0.02,
        maxAlpha:0.06
    }
  },

  // Backstage - Sombre, bruyant, moyennement instable
  '5': {
    name: 'Backstage',
    enabled: true,
    jitterX:1.8,
    jitterY:1.4,

    flicker:{
        min:0.95,
        max:1.07
    },

    horizontalLines:{
        spacing:4,
        strokeStyle:'rgba(255,255,255,0.05)'
    },

    whiteNoise:{
        density:360,
        size:1.2,
        alphaRange:{min:0.05,max:0.28}
    },

    verticalLines:{
        enabled:true,
        density:700,
        strokeStyle:'rgba(255,255,255,0.05)'
    },

    horizontalBands:{
        density:150,
        minHeight:3,
        maxHeight:10,
        minAlpha:0.03,
        maxAlpha:0.08
    }
  },

  // Kitchen
  '6': {
    name: 'Kitchen',
    enabled: false,
    jitterX: 0,
    jitterY: 0,
    flicker: { min: 0, max: 0},

    horizontalLines: {
      enabled: false,
    },

    whiteNoise: {
      enabled: false,
    },

    verticalLines: {
      enabled: false,
    },

    horizontalBands: {
      enabled: false,
    },

    randomHorizontalLines: {
      enabled: false,
    },
  },

  // Restroom - Très sombre, très bruyant, très instable
  '7': {
    name: 'Restroom',
    enabled: true,
    jitterX:1.4,
    jitterY:1.0,

    flicker:{
        min:0.965,
        max:1.05
    },

    horizontalLines:{
        enabled:true,
        spacing:4,
        lineWidth:1,
        strokeStyle:'rgba(255,255,255,0.04)'
    },

    whiteNoise:{
        enabled:true,
        density:480,
        size:1.1,
        alphaRange:{
            min:0.04,
            max:0.24
        }
    },

    verticalLines:{
        enabled:true,
        density:750,
        strokeStyle:'rgba(255,255,255,0.04)'
    },

    horizontalBands:{
        enabled:true,
        density:170,
        minHeight:3,
        maxHeight:8,
        minAlpha:0.02,
        maxAlpha:0.07
    }
  },

  // The Office - Très stable, très propre (écran numérique)
  'office': {
    name: 'The Office',
    enabled: true,
    jitterX: 0.2,
    jitterY: 0.1,
    flicker: { min: 0.99, max: 1.01 },

    horizontalLines: {
      enabled: false,
    },

    whiteNoise: {
      enabled: false,
    },

    verticalLines: {
      enabled: false,
    },

    horizontalBands: {
      enabled: false,
    },

    randomHorizontalLines: {
      enabled: false,
    },
  },
};

/**
 * Récupère la configuration des parasites pour une caméra donnée
 * @param {string} cameraId - L'ID de la caméra
 * @returns {Object} Configuration des parasites
 */
function getParasiteConfig(cameraId) {
  return PARASITES_CONFIG[cameraId] || PARASITES_CONFIG['1a']; // Fallback sur Stage
}

/**
 * Récupère la configuration des parasites pour une pièce/caméra
 * @param {string} roomKey - La clé de la pièce
 * @returns {Object} Configuration des parasites
 */
function getParasiteConfigByRoom(roomKey) {
  return PARASITES_CONFIG[roomKey] || PARASITES_CONFIG['1a'];
}

// Cache global pour les textures de bruit (créées une seule fois)
const NOISE_TEXTURE_CACHE = new Map();

/**
 * Génère une texture de bruit réutilisable
 * @param {number} width
 * @param {number} height
 * @param {number} density
 * @returns {ImageData}
 */
function generateNoiseTexture(width, height, density) {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const noiseCount = Math.floor((width * height) / density);
  for (let i = 0; i < noiseCount; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const idx = (y * width + x) * 4;

    const alpha = 50 + Math.random() * 150; // Plus organique que avant

    data[idx] = 200;     // R
    data[idx + 1] = 200; // G
    data[idx + 2] = 200; // B
    data[idx + 3] = alpha; // A
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.convertToBlob().then(blob => createImageBitmap(blob));
}

/**
 * Dessine les parasites selon la configuration (nouveau système analog)
 * Ordre critique : jitter/flicker EN PREMIER, puis tous les effets
 * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
 * @param {Object} config - Configuration des parasites
 * @param {number} viewWidth - Largeur de la vue
 * @param {number} viewHeight - Hauteur de la vue
 * @param {number} scale - Facteur d'échelle
 */
function drawParasites(ctx, config, viewWidth, viewHeight, scale) {
  if (!config || !config.enabled) return;

  const pixelSize = Math.max(1, 1 / scale);
  const time = performance.now();

  ctx.save();

  // ==================== 0. JITTER ET FLICKER EN PREMIER ====================
  // Ces effets doivent s'appliquer à TOUT ce qui suit
  if (config.jitterX || config.jitterY) {
    const jitterX = (Math.random() - 0.5) * pixelSize * (config.jitterX || 0);
    const jitterY = (Math.random() - 0.5) * pixelSize * (config.jitterY || 0);
    ctx.translate(jitterX, jitterY);
  }

  if (config.flicker) {
    const flicker = config.flicker.min + Math.random() * (config.flicker.max - config.flicker.min);
    ctx.globalAlpha = flicker;
  }

  // ==================== 1. BANDE DE TRACKING HORIZONTALE ====================
  // C'est LE défaut caractéristique des vieilles caméras analogiques
  if (config.whiteNoise?.enabled) {
    const bandHeight = 8 + pixelSize * 20;
    const bandSpeed = 0.08; // pixels/ms
    const y = (time * bandSpeed) % (viewHeight + bandHeight);

    const grd = ctx.createLinearGradient(0, y - bandHeight, 0, y + bandHeight);
    grd.addColorStop(0, 'rgba(255,255,255,0)');
    grd.addColorStop(0.5, 'rgba(255,255,255,0.12)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = grd;
    ctx.fillRect(0, y - bandHeight, viewWidth, bandHeight * 2);
  }

  // ==================== 2. BANDES HORIZONTALES VHS ====================
  // Très FNAF 1 - le "scintillement" caractéristique des vieilles caméras
  if (config.horizontalBands?.enabled) {
    const bandCount = Math.max(
      1,
      Math.floor(viewHeight / config.horizontalBands.density)
    );

    for (let i = 0; i < bandCount; i++) {
      const y = Math.random() * viewHeight;
      const h =
        config.horizontalBands.minHeight +
        Math.random() *
        (config.horizontalBands.maxHeight - config.horizontalBands.minHeight);

      const bandAlpha =
        config.horizontalBands.minAlpha +
        Math.random() *
        (config.horizontalBands.maxAlpha - config.horizontalBands.minAlpha);

      ctx.fillStyle = `rgba(255,255,255,${bandAlpha})`;
      ctx.fillRect(0, y, viewWidth, h);
    }
  }

  // ==================== 3. LIGNES HORIZONTALES FIXES (SCINTILLEMENT) ====================
  if (config.horizontalLines?.enabled) {
    ctx.strokeStyle = config.horizontalLines.strokeStyle;
    ctx.lineWidth = pixelSize * (config.horizontalLines.lineWidth || 1);
    const spacing = config.horizontalLines.spacing;

    for (let y = 0; y < viewHeight; y += spacing) {
      // Petite ondulation lente (breathing)
      const wobble = Math.sin(time * 0.001 + y * 0.01) * pixelSize * 0.5;

      ctx.beginPath();
      ctx.moveTo(0, y + wobble);
      ctx.lineTo(viewWidth, y + wobble);
      ctx.stroke();
    }
  }

  // ==================== 4. BRUIT BLANC ====================
  if (config.whiteNoise?.enabled) {
    const noiseCount = Math.max(50, Math.floor((viewWidth * viewHeight) / (config.whiteNoise.density || 500)));

    for (let i = 0; i < noiseCount; i++) {
      const x = Math.random() * viewWidth;
      const y = Math.random() * viewHeight;
      const size = 1 + Math.random() * 2;
      const alpha = config.whiteNoise.alphaRange?.min || 0.05 + Math.random() * ((config.whiteNoise.alphaRange?.max || 0.55) - (config.whiteNoise.alphaRange?.min || 0.05));

      ctx.fillStyle = `rgba(200, 200, 200, ${alpha})`;
      ctx.fillRect(x, y, size, size);
    }
  }

  // ==================== 5. LIGNES VERTICALES ====================
  if (config.verticalLines?.enabled) {
    const verticalLineCount = Math.max(0, Math.floor(viewWidth / (config.verticalLines.density || 1000)));

    for (let i = 0; i < verticalLineCount; i++) {
      // Position plus stable (change tous les 100ms)
      const frameIndex = Math.floor(time / 100);
      const seed = i + frameIndex * 12345;
      const x = ((seed * 73856093) ^ (frameIndex * 19349663)) % viewWidth;

      ctx.strokeStyle = config.verticalLines.strokeStyle || 'rgba(255,255,255,0.05)';
      ctx.lineWidth = pixelSize;

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, viewHeight);
      ctx.stroke();
    }
  }

  // ==================== 6. DÉCALAGE HORIZONTAL (SYNC GLITCH) ====================
  // 8% de chance à chaque frame
  if (Math.random() < 0.08) {
    const lineY = Math.random() * viewHeight;
    const lineHeight = 1 + Math.random() * 3;
    const offsetX = (Math.random() - 0.5) * 8 * pixelSize;

    ctx.globalAlpha *= 0.3;
    ctx.drawImage(
      ctx.canvas,
      0,
      lineY,
      viewWidth,
      lineHeight,
      offsetX,
      lineY,
      viewWidth,
      lineHeight
    );
    ctx.globalAlpha /= 0.3;
  }

  // ==================== 7. FLASH ÉLECTRIQUE DISCRET ====================
  // 1% de chance = effet rare et impactant
  if (Math.random() < 0.01) {
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(0, 0, viewWidth, viewHeight);
  }

  ctx.restore();
}
