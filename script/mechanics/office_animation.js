// office_animation.js
// Anime des objets du decor directement dans l'image du bureau : aujourd'hui
// la grille du ventilateur, dont seule la partie utile de spinning_fan.gif
// est reprise. Les zones viennent de office_animations.json ; elles sont
// normalisees, donc l'animation suit le panoramique du bureau et disparait
// sur les images qui ne la declarent pas (coupure de courant, jumpscares).
//
// Le GIF n'est pas colle tel quel : il a ete exporte d'un rendu plus clair
// que l'image actuelle, et son fond n'est pas celui du bureau. Chaque image
// passe donc par un tampon ou elle est assombrie puis decoupee au masque,
// avant d'etre posee sur le canvas.

/**
 * Lecteurs de GIF et tampons de composition, indexes par id d'animation.
 * Le tampon est garde d'une frame a l'autre et redimensionne seulement
 * quand la zone change de taille (fenetre redimensionnee).
 */
const officeAnimationPlayers = {};

/**
 * Charge les GIF des animations du bureau. A appeler une fois au demarrage,
 * comme preloadImages() : un GIF charge en cours de partie ferait un trou
 * dans le decor le temps du telechargement.
 * @returns {Promise<void>}
 */
async function preloadOfficeAnimations() {
  await Promise.all(getDeclaredOfficeAnimations().map(async animation => {
    try {
      const player = new GifPlayer();
      await player.load(animation.gif);
      player.play();
      officeAnimationPlayers[animation.id] = { player, buffer: null, bufferCtx: null };
    } catch (err) {
      console.error(`[OfficeAnimations] Chargement de "${animation.gif}" impossible`, err);
    }
  }));
}

/**
 * Tampon de composition d'une animation, aux dimensions de sa zone a
 * l'ecran.
 * @param {Object} entry - Entree de officeAnimationPlayers
 * @param {number} width - Largeur voulue, en pixels canvas
 * @param {number} height - Hauteur voulue, en pixels canvas
 * @returns {CanvasRenderingContext2D} Contexte du tampon, efface
 */
function resolveOfficeAnimationBuffer(entry, width, height) {
  if (!entry.buffer) {
    entry.buffer = document.createElement('canvas');
    entry.bufferCtx = entry.buffer.getContext('2d');
  }
  if (entry.buffer.width !== width || entry.buffer.height !== height) {
    entry.buffer.width = width;
    entry.buffer.height = height;
  }

  entry.bufferCtx.clearRect(0, 0, width, height);
  return entry.bufferCtx;
}

/**
 * Decoupe le contenu du tampon a la forme de l'objet. En ellipse, le bord
 * est adouci sur `feather` du rayon : une decoupe nette laisserait une
 * marche visible entre l'animation et le decor fixe autour.
 * @param {CanvasRenderingContext2D} ctx - Contexte du tampon
 * @param {number} width - Largeur du tampon
 * @param {number} height - Hauteur du tampon
 * @param {Object} animation - Animation en cours de dessin
 */
function maskOfficeAnimation(ctx, width, height, animation) {
  if (animation.shape !== 'ellipse') return;

  const feather = Math.min(Math.max(animation.feather ?? 0, 0), 1);

  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';
  // Repere unitaire : le disque devient l'ellipse inscrite dans la zone.
  ctx.translate(width / 2, height / 2);
  ctx.scale(width / 2, height / 2);

  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  gradient.addColorStop(Math.max(0, 1 - feather), 'rgba(0, 0, 0, 1)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(-1, -1, 2, 2);

  ctx.restore();
}

/**
 * Dessine une animation dans sa zone a l'ecran.
 * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
 * @param {Object} animation - Animation, zone `rect` comprise
 * @param {{x: number, y: number, width: number, height: number}} box - Zone a l'ecran
 */
function drawOfficeAnimation(ctx, animation, box) {
  const entry = officeAnimationPlayers[animation.id];
  if (!entry || !entry.player.ready) return;

  const width = Math.max(1, Math.round(box.width));
  const height = Math.max(1, Math.round(box.height));

  entry.player.update();

  const bufferCtx = resolveOfficeAnimationBuffer(entry, width, height);
  // Sans `source`, c'est tout le GIF qui est repris.
  const source = animation.source || { x: 0, y: 0, width: entry.player.width, height: entry.player.height };
  entry.player.drawFrameRegion(bufferCtx, source.x, source.y, source.width, source.height, 0, 0, width, height);

  // Assombrit l'image du GIF pour la mettre au niveau du rendu du bureau.
  // 'source-atop' n'agit que sur les pixels deja dessines : le fond du
  // tampon reste transparent.
  const brightness = animation.brightness ?? 1;
  if (brightness < 1) {
    bufferCtx.save();
    bufferCtx.globalCompositeOperation = 'source-atop';
    bufferCtx.fillStyle = `rgba(0, 0, 0, ${1 - brightness})`;
    bufferCtx.fillRect(0, 0, width, height);
    bufferCtx.restore();
  }

  maskOfficeAnimation(bufferCtx, width, height, animation);

  ctx.drawImage(entry.buffer, box.x, box.y);
}

/**
 * Dessine les animations du bureau par-dessus l'image qui vient d'etre
 * dessinee. Les coordonnees passees sont celles utilisees pour
 * ctx.drawImage() : les animations suivent donc exactement le panoramique.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {string} officeImageKey - Cle de l'image du bureau affichee
 * @param {number} drawX - Abscisse de l'image dessinee
 * @param {number} drawY - Ordonnee de l'image dessinee
 * @param {number} drawWidth - Largeur de l'image dessinee
 * @param {number} drawHeight - Hauteur de l'image dessinee
 */
function drawOfficeAnimations(ctx, officeImageKey, drawX, drawY, drawWidth, drawHeight) {
  getOfficeAnimations(officeImageKey).forEach(animation => {
    drawOfficeAnimation(ctx, animation, {
      x: drawX + animation.rect.x * drawWidth,
      y: drawY + animation.rect.y * drawHeight,
      width: animation.rect.width * drawWidth,
      height: animation.rect.height * drawHeight
    });
  });
}
