/**
 * Configuration des parasites derivee depuis la source unique ROOMS.
 */
const PARASITES_CONFIG = buildParasitesConfigFromRooms(ROOMS);

/**
 * Récupère la configuration des parasites pour une caméra donnée
 * @param {string} cameraId - L'ID de la caméra
 * @returns {Object} Configuration des parasites
 */
function getParasiteConfig(cameraId) {
  if (cameraId === 'office') {
    return PARASITES_CONFIG.safe || PARASITES_CONFIG['1a'];
  }

  return PARASITES_CONFIG[cameraId] || PARASITES_CONFIG['1a']; // Fallback sur Stage
}

/**
 * Récupère la configuration des parasites pour une pièce/caméra
 * @param {string} roomKey - La clé de la pièce
 * @returns {Object} Configuration des parasites
 */
function getParasiteConfigByRoom(roomKey) {
  if (roomKey === 'office') {
    return PARASITES_CONFIG.safe || PARASITES_CONFIG['1a'];
  }

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
