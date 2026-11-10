/* ============================================================
   ATLAS DE SPRITES ET CALQUES DE SCÈNE
   ------------------------------------------------------------
   Un atlas = images/atlas/<nom>.png + <nom>.json, produits par
   tools/atlas/slice_atlas.js. Un sprite est désigné par
   "<atlas>/<sprite>", par ex. "foxy/car_front".

   Un calque pose un sprite sur l'image de base d'une caméra :
     { "sprite": "foxy/car_front", "x": 1080, "y": 672,
       "scale": 0.42, "flip": false, "shadow": true }
   x, y : point de contact au sol (bas centre du sprite), en pixels
   de l'image de base (1600x719), avant panoramique.

   L'étalonnage de la salle (rooms_config.json, "propGrade")
   adapte la lumière du sprite à la scène :
     { "brightness": 0.5, "saturate": 0.8, "blur": 0.6,
       "tint": "#3a2a6a", "tintStrength": 0.3 }
   ============================================================ */

const SpriteAtlas = (() => {
  const atlases = {};       // nom -> { image, sprites } ou null si introuvable
  const gradedCache = new Map();

  function loadAtlas(atlasName) {
    if (atlasName in atlases) return atlases[atlasName];
    atlases[atlasName] = null;
    try {
      // XHR synchrone, comme les autres loaders (fetch() ne marche pas en file://).
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `images/atlas/${atlasName}.json`, false);
      xhr.send(null);
      if (xhr.status !== 200 && xhr.status !== 0) throw new Error(`HTTP ${xhr.status}`);
      const data = JSON.parse(xhr.responseText);
      const image = new Image();
      image.src = data.image;
      atlases[atlasName] = { image, sprites: data.sprites };
    } catch (err) {
      console.warn(`[SpriteAtlas] Atlas introuvable : ${atlasName}`, err);
    }
    return atlases[atlasName];
  }

  function getSprite(spriteId) {
    const [atlasName, spriteName] = spriteId.split('/');
    const atlas = loadAtlas(atlasName);
    const frame = atlas?.sprites[spriteName];
    if (!frame) {
      console.warn(`[SpriteAtlas] Sprite introuvable : ${spriteId}`);
      return null;
    }
    return { image: atlas.image, frame };
  }

  function isReady(layers) {
    return layers.every(layer => {
      const sprite = getSprite(layer.sprite);
      return sprite && sprite.image.complete && sprite.image.naturalWidth > 0;
    });
  }

  /** Sprite redimensionné et étalonné pour la salle, mis en cache. */
  function getGradedSprite(sprite, layer, grade, cacheKey) {
    const width = Math.max(1, Math.round(sprite.frame.w * (layer.scale ?? 1)));
    const height = Math.max(1, Math.round(sprite.frame.h * (layer.scale ?? 1)));
    const key = `${cacheKey}|${layer.sprite}|${width}|${layer.flip ? 1 : 0}`;
    if (gradedCache.has(key)) return gradedCache.get(key);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.filter = [
      `brightness(${grade.brightness ?? 1})`,
      `saturate(${grade.saturate ?? 1})`,
      `blur(${grade.blur ?? 0}px)`
    ].join(' ');
    if (layer.flip) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    const { x, y, w, h } = sprite.frame;
    ctx.drawImage(sprite.image, x, y, w, h, 0, 0, width, height);

    if (grade.tint) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'source-atop';
      ctx.globalAlpha = grade.tintStrength ?? 0.3;
      ctx.fillStyle = grade.tint;
      ctx.fillRect(0, 0, width, height);
    }

    gradedCache.set(key, canvas);
    return canvas;
  }

  function drawContactShadow(ctx, x, y, width) {
    const radiusX = width * 0.55;
    const radiusY = Math.max(3, width * 0.1);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, radiusY / radiusX);
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radiusX);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, radiusX, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Dessine des calques par-dessus l'image de base, dans le repère déjà
   * mis à l'échelle par drawWithCamera().
   * @param {Object} view { sourceX, scaleY, grade, cacheKey }
   */
  function drawLayers(ctx, layers, view) {
    layers.forEach(layer => {
      const sprite = getSprite(layer.sprite);
      if (!sprite) return;
      const graded = getGradedSprite(sprite, layer, view.grade || {}, view.cacheKey);
      const footX = layer.x - view.sourceX;
      const footY = layer.y * view.scaleY;

      if (layer.shadow !== false) drawContactShadow(ctx, footX, footY, graded.width);
      ctx.drawImage(graded, footX - graded.width / 2, footY - graded.height);
    });
  }

  return { loadAtlas, getSprite, isReady, drawLayers };
})();
