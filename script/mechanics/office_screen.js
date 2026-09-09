// office_screen.js
// Surimpression de la batterie sur l'ecran presente dans l'image du bureau.
// Le panneau HTML #powerUsage reste en place : cette surimpression est un
// second affichage, diegetique, dessine directement sur le canvas pour
// suivre le panoramique gauche/droite du bureau.

const OFFICE_BATTERY_SCREEN = Object.freeze({
  // Le rendu 3D contient un texte de remplissage : on repeint le fond
  // pour le masquer avant de dessiner les valeurs reelles.
  BACKDROP: '#010402',
  LABEL_COLOR: '#dcefe2',
  SEGMENT_COUNT: 10,
  SEGMENT_GAP_RATIO: 0.18,
  TRACK_COLOR: 'rgba(255, 255, 255, 0.06)',
  TRACK_BORDER: 'rgba(120, 220, 150, 0.22)',
  LOW_THRESHOLD: 30,
  CRITICAL_THRESHOLD: 10,
  BLINK_PERIOD_MS: 800,
  FONT_FAMILY: '"Press Start 2P", monospace'
});

/**
 * Palette de la jauge selon le niveau de batterie.
 * @param {number} displayPower - Batterie affichee (0-100)
 * @returns {{from: string, to: string, digits: string, glow: string}} Couleurs de la jauge
 */
function getOfficeBatteryPalette(displayPower) {
  if (displayPower <= OFFICE_BATTERY_SCREEN.CRITICAL_THRESHOLD) {
    return { from: '#ff6d4b', to: '#ff2222', digits: '#ff5252', glow: 'rgba(255, 40, 40, 0.55)' };
  }
  if (displayPower <= OFFICE_BATTERY_SCREEN.LOW_THRESHOLD) {
    return { from: '#ffd23f', to: '#ff8a1f', digits: '#ffb648', glow: 'rgba(255, 150, 40, 0.45)' };
  }
  return { from: '#3dff6a', to: '#e2ff3a', digits: '#ffe14a', glow: 'rgba(80, 255, 130, 0.40)' };
}

/**
 * Libelle de l'ecran batterie dans la langue courante.
 * @returns {string} Libelle a afficher
 */
function getOfficeBatteryScreenLabel() {
  const lang = window.selectedLanguage || window.FNAF_DEFAULT_LANGUAGE || 'fr';
  const t = typeof getCurrentTranslations === 'function' ? getCurrentTranslations() : {};
  return t.powerPanel?.screenLabel || (lang === 'en' ? 'BATTERY' : 'BATTERIE');
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
 * Dessine les lignes de balayage pour que la surimpression se fonde dans
 * l'ecran du rendu.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {number} x - Bord gauche de l'ecran
 * @param {number} y - Bord haut de l'ecran
 * @param {number} width - Largeur de l'ecran
 * @param {number} height - Hauteur de l'ecran
 */
function drawOfficeScreenScanlines(ctx, x, y, width, height) {
  const step = Math.max(2, Math.round(height / 14));
  ctx.fillStyle = 'rgba(0, 0, 0, 0.13)';
  for (let lineY = y; lineY < y + height; lineY += step) {
    ctx.fillRect(x, lineY, width, 1);
  }
}

/**
 * Dessine la batterie en surimpression sur l'ecran du bureau.
 * Les coordonnees d'image (drawX/drawY/drawWidth/drawHeight) sont celles
 * passees a ctx.drawImage() : la surimpression suit donc exactement le
 * panoramique du bureau.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {string} officeImageKey - Cle de l'image du bureau affichee
 * @param {number} drawX - Abscisse de l'image dessinee
 * @param {number} drawY - Ordonnee de l'image dessinee
 * @param {number} drawWidth - Largeur de l'image dessinee
 * @param {number} drawHeight - Hauteur de l'image dessinee
 */
function drawOfficeBatteryScreen(ctx, officeImageKey, drawX, drawY, drawWidth, drawHeight) {
  const rect = getOfficeBatteryScreenRect(officeImageKey);
  if (!rect || power <= 0) return;

  const x = drawX + rect.x * drawWidth;
  const y = drawY + rect.y * drawHeight;
  const width = rect.width * drawWidth;
  const height = rect.height * drawHeight;
  // Sous cette taille le texte est illisible : l'ecran du rendu suffit.
  if (width < 40 || height < 18) return;

  const displayPower = Math.max(0, Math.min(100, Math.floor(power)));
  const palette = getOfficeBatteryPalette(displayPower);
  const isCritical = displayPower <= OFFICE_BATTERY_SCREEN.CRITICAL_THRESHOLD;
  const blinkOff = isCritical &&
    (performance.now() % OFFICE_BATTERY_SCREEN.BLINK_PERIOD_MS) > OFFICE_BATTERY_SCREEN.BLINK_PERIOD_MS / 2;

  ctx.save();

  ctx.fillStyle = OFFICE_BATTERY_SCREEN.BACKDROP;
  ctx.fillRect(x, y, width, height);

  if (blinkOff) {
    ctx.globalAlpha = 0.45;
  }

  const paddingX = width * 0.06;
  const contentWidth = width - paddingX * 2;

  const labelSize = Math.max(5, height * 0.19);
  ctx.font = `${labelSize}px ${OFFICE_BATTERY_SCREEN.FONT_FAMILY}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = OFFICE_BATTERY_SCREEN.LABEL_COLOR;
  ctx.fillText(getOfficeBatteryScreenLabel(), x + paddingX, y + height * 0.30 + labelSize * 0.5);

  const gaugeWidth = contentWidth * 0.62;
  const gaugeHeight = height * 0.34;
  const gaugeY = y + height * 0.48;
  drawOfficeBatteryGauge(ctx, x + paddingX, gaugeY, gaugeWidth, gaugeHeight, displayPower / 100, palette);

  const digitsSize = Math.max(6, height * 0.26);
  ctx.font = `${digitsSize}px ${OFFICE_BATTERY_SCREEN.FONT_FAMILY}`;
  ctx.textAlign = 'right';
  ctx.fillStyle = palette.digits;
  ctx.shadowColor = palette.glow;
  ctx.shadowBlur = Math.max(2, digitsSize * 0.5);
  ctx.fillText(`${String(displayPower).padStart(3, '0')}%`, x + width - paddingX, gaugeY + gaugeHeight * 0.5 + digitsSize * 0.4);
  ctx.shadowBlur = 0;

  ctx.globalAlpha = 1;
  drawOfficeScreenScanlines(ctx, x, y, width, height);

  ctx.restore();
}
