// office_screen.js
// Surimpression de la batterie et de la consommation sur les ecrans presents
// dans l'image du bureau. Les panneaux HTML #powerUsage et #usage-status
// restent en place : ces surimpressions sont un second affichage, diegetique,
// dessine directement sur le canvas pour suivre le panoramique du bureau.

const OFFICE_SCREEN = Object.freeze({
  // Le rendu 3D contient un texte de remplissage : on repeint le fond
  // pour le masquer avant de dessiner la jauge et les barres.
  BACKDROP: '#010402',
  SCANLINE_COLOR: 'rgba(0, 0, 0, 0.13)',
  PADDING_X_RATIO: 0.06,
  LOW_THRESHOLD: 30,
  CRITICAL_THRESHOLD: 10,
  BLINK_PERIOD_MS: 800,
  // En dessous de cette taille a l'ecran la surimpression n'est plus
  // lisible : l'ecran du rendu suffit.
  MIN_WIDTH: 40,
  MIN_HEIGHT: 18
});

const OFFICE_BATTERY_SCREEN = Object.freeze({
  // Part de la hauteur de l'ecran occupee par la jauge.
  GAUGE_HEIGHT_RATIO: 0.62,
  SEGMENT_COUNT: 10,
  SEGMENT_GAP_RATIO: 0.18,
  TRACK_COLOR: 'rgba(255, 255, 255, 0.06)',
  TRACK_BORDER: 'rgba(120, 220, 150, 0.22)'
});

const OFFICE_USAGE_SCREEN = Object.freeze({
  // Part de la hauteur de l'ecran occupee par la barre la plus haute.
  MAX_BAR_HEIGHT_RATIO: 0.78,
  BAR_WIDTH_RATIO: 0.72,
  // Hauteur relative de la barre la plus courte : les barres montent en
  // escalier comme sur le panneau HTML #usage-status.
  MIN_BAR_HEIGHT_RATIO: 0.45,
  IDLE_BAR_COLOR: 'rgba(255, 255, 255, 0.05)',
  IDLE_BAR_BORDER: 'rgba(150, 150, 150, 0.35)'
});

/**
 * Palette de la jauge de batterie selon le niveau restant.
 * @param {number} displayPower - Batterie affichee (0-100)
 * @returns {{from: string, to: string, glow: string}} Couleurs de la jauge
 */
function getOfficeBatteryPalette(displayPower) {
  if (displayPower <= OFFICE_SCREEN.CRITICAL_THRESHOLD) {
    return { from: '#ff6d4b', to: '#ff2222', glow: 'rgba(255, 40, 40, 0.55)' };
  }
  if (displayPower <= OFFICE_SCREEN.LOW_THRESHOLD) {
    return { from: '#ffd23f', to: '#ff8a1f', glow: 'rgba(255, 150, 40, 0.45)' };
  }
  return { from: '#3dff6a', to: '#e2ff3a', glow: 'rgba(80, 255, 130, 0.40)' };
}

/**
 * Palette des barres de consommation. Passe au rouge quand la batterie est
 * critique, comme le panneau HTML #usage-status.
 * @param {boolean} isCritical - Vrai si la batterie est au niveau critique
 * @returns {{from: string, to: string, glow: string}} Couleurs des barres
 */
function getOfficeUsagePalette(isCritical) {
  if (isCritical) {
    return { from: '#ff7f54', to: '#ff3535', glow: 'rgba(255, 58, 58, 0.55)' };
  }
  return { from: '#ffd24f', to: '#ff9d20', glow: 'rgba(255, 170, 48, 0.45)' };
}

/**
 * Convertit une zone normalisee en rectangle a l'ecran, dans le repere de
 * l'image telle qu'elle vient d'etre dessinee par ctx.drawImage().
 * @param {{x: number, y: number, width: number, height: number}|null} rect - Zone normalisee
 * @param {number} drawX - Abscisse de l'image dessinee
 * @param {number} drawY - Ordonnee de l'image dessinee
 * @param {number} drawWidth - Largeur de l'image dessinee
 * @param {number} drawHeight - Hauteur de l'image dessinee
 * @returns {{x: number, y: number, width: number, height: number}|null} Rectangle a l'ecran, ou null si la zone est absente ou trop petite
 */
function resolveOfficeScreenBox(rect, drawX, drawY, drawWidth, drawHeight) {
  if (!rect) return null;

  const width = rect.width * drawWidth;
  const height = rect.height * drawHeight;
  if (width < OFFICE_SCREEN.MIN_WIDTH || height < OFFICE_SCREEN.MIN_HEIGHT) return null;

  return {
    x: drawX + rect.x * drawWidth,
    y: drawY + rect.y * drawHeight,
    width,
    height
  };
}

/**
 * Repeint le fond d'un ecran pour masquer le texte de remplissage du rendu.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {{x: number, y: number, width: number, height: number}} box - Rectangle de l'ecran
 */
function clearOfficeScreen(ctx, box) {
  ctx.fillStyle = OFFICE_SCREEN.BACKDROP;
  ctx.fillRect(box.x, box.y, box.width, box.height);
}

/**
 * Dessine les lignes de balayage pour que la surimpression se fonde dans
 * l'ecran du rendu.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {{x: number, y: number, width: number, height: number}} box - Rectangle de l'ecran
 */
function drawOfficeScreenScanlines(ctx, box) {
  const step = Math.max(2, Math.round(box.height / 14));
  ctx.fillStyle = OFFICE_SCREEN.SCANLINE_COLOR;
  for (let lineY = box.y; lineY < box.y + box.height; lineY += step) {
    ctx.fillRect(box.x, lineY, box.width, 1);
  }
}

/**
 * Dessine la jauge segmentee : piste complete en fond, segments allumes
 * jusqu'au niveau courant.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {number} x - Bord gauche de la jauge
 * @param {number} y - Bord haut de la jauge
 * @param {number} width - Largeur de la jauge
 * @param {number} height - Hauteur de la jauge
 * @param {number} ratio - Niveau de remplissage (0-1)
 * @param {{from: string, to: string, glow: string}} palette - Couleurs de la jauge
 */
function drawOfficeBatteryGauge(ctx, x, y, width, height, ratio, palette) {
  ctx.fillStyle = OFFICE_BATTERY_SCREEN.TRACK_COLOR;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = OFFICE_BATTERY_SCREEN.TRACK_BORDER;
  ctx.lineWidth = Math.max(1, height * 0.05);
  ctx.strokeRect(x, y, width, height);

  if (ratio <= 0) return;

  const inset = Math.max(1, height * 0.12);
  const innerX = x + inset;
  const innerY = y + inset;
  const innerWidth = width - inset * 2;
  const innerHeight = height - inset * 2;
  if (innerWidth <= 0 || innerHeight <= 0) return;

  const gradient = ctx.createLinearGradient(innerX, innerY, innerX + innerWidth, innerY);
  gradient.addColorStop(0, palette.from);
  gradient.addColorStop(1, palette.to);

  ctx.save();
  ctx.beginPath();
  ctx.rect(innerX, innerY, innerWidth * ratio, innerHeight);
  ctx.clip();

  ctx.shadowColor = palette.glow;
  ctx.shadowBlur = Math.max(2, height * 0.4);
  ctx.fillStyle = gradient;

  const segmentPitch = innerWidth / OFFICE_BATTERY_SCREEN.SEGMENT_COUNT;
  const segmentGap = Math.max(1, segmentPitch * OFFICE_BATTERY_SCREEN.SEGMENT_GAP_RATIO);
  for (let i = 0; i < OFFICE_BATTERY_SCREEN.SEGMENT_COUNT; i++) {
    ctx.fillRect(innerX + i * segmentPitch, innerY, segmentPitch - segmentGap, innerHeight);
  }

  ctx.restore();
}

/**
 * Dessine les barres de consommation en escalier, allumees jusqu'au niveau
 * d'utilisation courant.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {number} x - Bord gauche de la rangee
 * @param {number} baselineY - Ordonnee du pied des barres
 * @param {number} width - Largeur de la rangee
 * @param {number} maxHeight - Hauteur de la barre la plus haute
 * @param {number} usageLevel - Niveau d'utilisation courant (1 a MAX_USAGE)
 * @param {{from: string, to: string, glow: string}} palette - Couleurs des barres allumees
 */
function drawOfficeUsageBars(ctx, x, baselineY, width, maxHeight, usageLevel, palette) {
  const barCount = POWER_SYSTEM.MAX_USAGE;
  const pitch = width / barCount;
  const barWidth = Math.max(1, pitch * OFFICE_USAGE_SCREEN.BAR_WIDTH_RATIO);
  const heightStep = barCount > 1
    ? (1 - OFFICE_USAGE_SCREEN.MIN_BAR_HEIGHT_RATIO) / (barCount - 1)
    : 0;

  for (let i = 0; i < barCount; i++) {
    const barHeight = maxHeight * (OFFICE_USAGE_SCREEN.MIN_BAR_HEIGHT_RATIO + heightStep * i);
    const barX = x + i * pitch;
    const barY = baselineY - barHeight;

    if (i < usageLevel) {
      const gradient = ctx.createLinearGradient(barX, barY, barX, barY + barHeight);
      gradient.addColorStop(0, palette.from);
      gradient.addColorStop(1, palette.to);
      ctx.fillStyle = gradient;
      ctx.shadowColor = palette.glow;
      ctx.shadowBlur = Math.max(2, maxHeight * 0.25);
      ctx.fillRect(barX, barY, barWidth, barHeight);
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = OFFICE_USAGE_SCREEN.IDLE_BAR_COLOR;
      ctx.fillRect(barX, barY, barWidth, barHeight);
      ctx.strokeStyle = OFFICE_USAGE_SCREEN.IDLE_BAR_BORDER;
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
  }
}

/**
 * Dessine le contenu de l'ecran batterie : la jauge remplit l'ecran.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {{x: number, y: number, width: number, height: number}} box - Rectangle de l'ecran
 * @param {number} displayPower - Batterie affichee (0-100)
 */
function drawOfficeBatteryContent(ctx, box, displayPower) {
  const palette = getOfficeBatteryPalette(displayPower);
  const paddingX = box.width * OFFICE_SCREEN.PADDING_X_RATIO;

  const gaugeWidth = box.width - paddingX * 2;
  const gaugeHeight = box.height * OFFICE_BATTERY_SCREEN.GAUGE_HEIGHT_RATIO;
  const gaugeY = box.y + (box.height - gaugeHeight) * 0.5;
  drawOfficeBatteryGauge(ctx, box.x + paddingX, gaugeY, gaugeWidth, gaugeHeight, displayPower / 100, palette);
}

/**
 * Dessine le contenu de l'ecran consommation : les barres remplissent l'ecran.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {{x: number, y: number, width: number, height: number}} box - Rectangle de l'ecran
 * @param {number} usageLevel - Niveau d'utilisation courant (1 a MAX_USAGE)
 * @param {boolean} isCritical - Vrai si la batterie est au niveau critique
 */
function drawOfficeUsageContent(ctx, box, usageLevel, isCritical) {
  const palette = getOfficeUsagePalette(isCritical);
  const paddingX = box.width * OFFICE_SCREEN.PADDING_X_RATIO;

  const barsWidth = box.width - paddingX * 2;
  const barsMaxHeight = box.height * OFFICE_USAGE_SCREEN.MAX_BAR_HEIGHT_RATIO;
  const barsBaselineY = box.y + (box.height + barsMaxHeight) * 0.5;
  drawOfficeUsageBars(ctx, box.x + paddingX, barsBaselineY, barsWidth, barsMaxHeight, usageLevel, palette);
}

/**
 * Dessine les ecrans batterie et consommation en surimpression sur l'image
 * du bureau. Les coordonnees passees sont celles utilisees pour
 * ctx.drawImage() : les surimpressions suivent donc exactement le
 * panoramique du bureau.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {string} officeImageKey - Cle de l'image du bureau affichee
 * @param {number} drawX - Abscisse de l'image dessinee
 * @param {number} drawY - Ordonnee de l'image dessinee
 * @param {number} drawWidth - Largeur de l'image dessinee
 * @param {number} drawHeight - Hauteur de l'image dessinee
 */
function drawOfficeScreens(ctx, officeImageKey, drawX, drawY, drawWidth, drawHeight) {
  if (power <= 0) return;

  const batteryBox = resolveOfficeScreenBox(getOfficeBatteryScreenRect(officeImageKey), drawX, drawY, drawWidth, drawHeight);
  const usageBox = resolveOfficeScreenBox(getOfficeUsageScreenRect(officeImageKey), drawX, drawY, drawWidth, drawHeight);
  if (!batteryBox && !usageBox) return;

  const displayPower = Math.max(0, Math.min(100, Math.floor(power)));
  const isCritical = displayPower <= OFFICE_SCREEN.CRITICAL_THRESHOLD;
  const blinkOff = isCritical &&
    (performance.now() % OFFICE_SCREEN.BLINK_PERIOD_MS) > OFFICE_SCREEN.BLINK_PERIOD_MS / 2;

  ctx.save();

  if (batteryBox) clearOfficeScreen(ctx, batteryBox);
  if (usageBox) clearOfficeScreen(ctx, usageBox);

  if (blinkOff) {
    ctx.globalAlpha = 0.45;
  }

  if (batteryBox) {
    drawOfficeBatteryContent(ctx, batteryBox, displayPower);
  }
  if (usageBox) {
    drawOfficeUsageContent(ctx, usageBox, getPowerUsageLevel(), isCritical);
  }

  ctx.globalAlpha = 1;
  if (batteryBox) drawOfficeScreenScanlines(ctx, batteryBox);
  if (usageBox) drawOfficeScreenScanlines(ctx, usageBox);

  ctx.restore();
}
