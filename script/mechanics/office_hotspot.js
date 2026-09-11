// office_hotspot.js
// Objets du bureau que le joueur survole et clique directement sur l'image :
// le poste de radio ouvre le lecteur de cassettes, le terminal ouvre les
// archives et le telephone raccroche l'appel en cours, comme les boutons
// #tape-panel, #computer-panel et #phone-panel du HUD. Ces boutons restent
// en place : le clic sur l'objet est un second acces, diegetique. Les zones
// viennent de office_hotspots.json ; elles sont normalisees, donc le survol
// suit le panoramique du bureau et change avec l'image affichee (lumieres,
// power down) sans recalibrage.

const OFFICE_HOTSPOT = Object.freeze({
  // Le decor est tres sombre : l'objet survole est eclairci plutot
  // qu'entoure d'un cadre vif, pour rester dans l'ambiance du rendu.
  FILL_COLOR: 'rgb(255, 214, 140)',
  FILL_EDGE_COLOR: 'rgba(255, 214, 140, 0)',
  FILL_ALPHA: 0.22,
  BRACKET_COLOR: 'rgb(255, 236, 190)',
  BRACKET_ALPHA: 0.85,
  GLOW_COLOR: 'rgba(255, 190, 90, 0.55)',
  // Longueur et epaisseur des equerres, en part du petit cote de l'objet.
  BRACKET_LENGTH_RATIO: 0.22,
  BRACKET_WIDTH_RATIO: 0.016,
  GLOW_BLUR_RATIO: 0.08,
  // Le survol respire lentement : l'objet se distingue du decor sans
  // clignoter comme une alerte.
  PULSE_PERIOD_MS: 1800,
  PULSE_DEPTH: 0.35
});

/**
 * Pulsation d'appel des objets `attract` : plus rapide et plus marquee que
 * celle du survol, pour que le joueur remarque le telephone qui sonne sans
 * avoir a promener sa souris sur le bureau. Pas d'equerres ici : l'objet
 * respire, il ne se presente comme une cible qu'une fois survole.
 */
const OFFICE_HOTSPOT_ATTRACT = Object.freeze({
  FILL_ALPHA: 0.32,
  PULSE_PERIOD_MS: 900,
  PULSE_DEPTH: 0.85
});

/**
 * Etiquette affichee au survol. Sa taille suit la hauteur du canvas et non
 * celle de l'objet : c'est un texte a lire, il doit rester lisible meme sur
 * un petit objet comme le telephone. Le ratio la place au niveau des
 * panneaux du HUD (6 px pour une fenetre de 600 px de haut), pour que les
 * deux affichages restent a la meme echelle.
 */
const OFFICE_HOTSPOT_TOOLTIP = Object.freeze({
  FONT_FAMILY: '"Press Start 2P", monospace',
  FONT_SIZE_RATIO: 0.010,
  MIN_FONT_SIZE: 7,
  // Marge interne et ecart avec l'objet, en part de la taille de police.
  PADDING_RATIO: 0.7,
  GAP_RATIO: 0.9,
  BACKGROUND: 'rgba(6, 8, 7, 0.88)',
  BORDER: 'rgba(255, 236, 190, 0.55)',
  TEXT_COLOR: '#ffecbe'
});

/**
 * Geometrie de l'image du bureau telle que drawOfficeView() vient de la
 * dessiner, ou null quand aucune image n'est a l'ecran. L'image est plus
 * large que le canvas et se decale avec le panoramique : sans cette
 * geometrie, le test de survol serait faux des que le joueur regarde a
 * gauche ou a droite.
 */
let officeImageLayout = null;

/**
 * Position de la souris dans le repere du canvas, ou null quand elle est
 * sortie de la fenetre. Le survol en est recalcule a chaque frame plutot
 * que memorise au dernier mouvement : l'image bouge (panoramique) et
 * change (lumieres) sans que la souris bouge.
 */
let officePointerPosition = null;

/**
 * Oublie la geometrie de l'image du bureau. Appele au debut de chaque
 * frame : la geometrie n'est valable que pour l'image effectivement
 * dessinee, donc un bureau non dessine (GIF, coupure de courant) ne doit
 * laisser aucun objet cliquable derriere lui.
 */
function clearOfficeImageLayout() {
  officeImageLayout = null;
}

/**
 * Convertit une zone normalisee en rectangle a l'ecran, dans le repere de
 * l'image telle qu'elle a ete dessinee par ctx.drawImage().
 * @param {{x: number, y: number, width: number, height: number}} rect - Zone normalisee
 * @param {{drawX: number, drawY: number, drawWidth: number, drawHeight: number}} layout - Geometrie de l'image dessinee
 * @returns {{x: number, y: number, width: number, height: number}} Rectangle a l'ecran
 */
function resolveOfficeHotspotBox(rect, layout) {
  return {
    x: layout.drawX + rect.x * layout.drawWidth,
    y: layout.drawY + rect.y * layout.drawHeight,
    width: rect.width * layout.drawWidth,
    height: rect.height * layout.drawHeight
  };
}

/**
 * Conditions de disponibilite, indexees par le champ `available` de
 * office_hotspots.json. Un objet indisponible n'est ni dessine, ni
 * survolable, ni cliquable : le telephone ne se propose donc qu'une fois
 * l'appel decroche, et redevient inerte des qu'il est raccroche ou termine.
 */
const OFFICE_HOTSPOT_AVAILABILITY = Object.freeze({
  phoneCallActive: () => currentNight?.isPhoneCallActive() === true
});

/**
 * Indique si un objet est actuellement propose au joueur.
 * @param {{available: string|null}} hotspot - Objet du bureau
 * @returns {boolean} Vrai si l'objet est disponible
 */
function isOfficeHotspotAvailable(hotspot) {
  if (!hotspot.available) return true;
  return OFFICE_HOTSPOT_AVAILABILITY[hotspot.available]?.() === true;
}

/**
 * Retourne l'objet du bureau disponible situe sous une position, s'il y en
 * a un.
 * @param {{x: number, y: number}|null} position - Position dans le repere du canvas
 * @returns {{id: string, action: string, rect: Object}|null} Objet survole, ou null
 */
function findOfficeHotspotAt(position) {
  if (!position || !officeImageLayout || activeView !== 'office' || gameEnd) return null;

  return getOfficeHotspots(officeImageLayout.officeImageKey).find(hotspot => {
    if (!isOfficeHotspotAvailable(hotspot)) return false;

    const box = resolveOfficeHotspotBox(hotspot.rect, officeImageLayout);
    return position.x >= box.x && position.x <= box.x + box.width &&
           position.y >= box.y && position.y <= box.y + box.height;
  }) || null;
}

/**
 * Convertit une position souris (repere fenetre) dans le repere du canvas.
 * Le canvas est decale par la mise en page et sa taille CSS peut differer
 * de sa resolution : on passe donc par son rectangle reel.
 * @param {number} clientX - Abscisse de la souris dans la fenetre
 * @param {number} clientY - Ordonnee de la souris dans la fenetre
 * @returns {{x: number, y: number}|null} Position dans le repere du canvas, ou null si le canvas n'est pas affiche
 */
function toCanvasPosition(clientX, clientY) {
  const bounds = canvas.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return null;

  return {
    x: (clientX - bounds.left) * (canvas.width / bounds.width),
    y: (clientY - bounds.top) * (canvas.height / bounds.height)
  };
}

/**
 * Met le curseur en main au-dessus d'un objet cliquable, et le rend au
 * navigateur ailleurs.
 * @param {boolean} isOverHotspot - Vrai si la souris survole un objet
 */
function setOfficeHotspotCursor(isOverHotspot) {
  const cursor = isOverHotspot ? 'pointer' : '';
  if (canvas.style.cursor !== cursor) canvas.style.cursor = cursor;
}

/**
 * Suit la souris pour le survol des objets du bureau. Le curseur est aussi
 * remis a jour ici, et pas seulement a chaque frame du bureau : dans les
 * vues ou le bureau n'est pas dessine (camera levee, fin de partie), c'est
 * le seul moment ou il peut retrouver sa forme par defaut.
 * @param {MouseEvent} event - Evenement de deplacement de la souris
 */
function handleOfficeHotspotPointerMove(event) {
  officePointerPosition = toCanvasPosition(event.clientX, event.clientY);
  setOfficeHotspotCursor(findOfficeHotspotAt(officePointerPosition) !== null);
}

/**
 * Oublie la souris quand elle quitte la fenetre, pour ne pas laisser un
 * objet allume derriere elle.
 */
function handleOfficeHotspotPointerLeave() {
  officePointerPosition = null;
  setOfficeHotspotCursor(false);
}

/**
 * Actions declenchees au clic, indexees par le champ `action` de
 * office_hotspots.json. Pour rendre un nouvel objet cliquable : une zone
 * dans le JSON et une entree ici.
 */
const OFFICE_HOTSPOT_ACTIONS = Object.freeze({
  openTapeScene: () => showCloseTapeScene(),
  openComputerTerminal: () => openInfoComputerPanel(),
  hangUpPhone: () => hangupPhoneFromPanel()
});

/**
 * Declenche l'action de l'objet clique, s'il y en a un sous la souris.
 * Une action inconnue est deja signalee au demarrage par
 * validateOfficeHotspots() : on se contente ici d'ignorer le clic.
 * @param {number} clientX - Abscisse du clic dans la fenetre
 * @param {number} clientY - Ordonnee du clic dans la fenetre
 * @returns {boolean} Vrai si un objet a repondu au clic
 */
function handleOfficeHotspotClick(clientX, clientY) {
  officePointerPosition = toCanvasPosition(clientX, clientY);

  const hotspot = findOfficeHotspotAt(officePointerPosition);
  const action = hotspot && OFFICE_HOTSPOT_ACTIONS[hotspot.action];
  if (!action) return false;

  action();
  return true;
}

/**
 * Valeur d'une respiration, entre 1 (pleine intensite) et 1 - depth.
 * @param {number} periodMs - Duree d'un cycle complet
 * @param {number} depth - Amplitude de la variation (0 a 1)
 * @returns {number} Facteur a appliquer a l'opacite
 */
function officeHotspotPulse(periodMs, depth) {
  const phase = (performance.now() % periodMs) / periodMs;
  return 1 - depth * (0.5 - 0.5 * Math.cos(phase * Math.PI * 2));
}

/**
 * Eclaire l'objet depuis son centre. 'lighter' ajoute de la lumiere au
 * rendu au lieu de le recouvrir, et le degrade radial evite qu'un
 * rectangle plus clair se dessine sur le mur et le bureau autour.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {{x: number, y: number, width: number, height: number}} box - Rectangle de l'objet
 * @param {number} alpha - Opacite de la lueur
 */
function fillOfficeHotspotGlow(ctx, box, alpha) {
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.hypot(box.width, box.height) / 2);
  gradient.addColorStop(0, OFFICE_HOTSPOT.FILL_COLOR);
  gradient.addColorStop(1, OFFICE_HOTSPOT.FILL_EDGE_COLOR);

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = alpha;
  ctx.fillStyle = gradient;
  ctx.fillRect(box.x, box.y, box.width, box.height);
  ctx.restore();
}

/**
 * Fait respirer un objet disponible que le joueur ne survole pas encore :
 * c'est ainsi que le telephone signale un appel en cours.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {{x: number, y: number, width: number, height: number}} box - Rectangle de l'objet
 */
function drawOfficeHotspotAttract(ctx, box) {
  const pulse = officeHotspotPulse(OFFICE_HOTSPOT_ATTRACT.PULSE_PERIOD_MS, OFFICE_HOTSPOT_ATTRACT.PULSE_DEPTH);
  fillOfficeHotspotGlow(ctx, box, OFFICE_HOTSPOT_ATTRACT.FILL_ALPHA * pulse);
}

/**
 * Trace les quatre equerres qui marquent les coins de l'objet survole.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {{x: number, y: number, width: number, height: number}} box - Rectangle de l'objet
 * @param {number} length - Longueur de chaque branche d'equerre
 */
function traceOfficeHotspotBrackets(ctx, box, length) {
  const right = box.x + box.width;
  const bottom = box.y + box.height;

  ctx.beginPath();
  ctx.moveTo(box.x, box.y + length);
  ctx.lineTo(box.x, box.y);
  ctx.lineTo(box.x + length, box.y);

  ctx.moveTo(right - length, box.y);
  ctx.lineTo(right, box.y);
  ctx.lineTo(right, box.y + length);

  ctx.moveTo(right, bottom - length);
  ctx.lineTo(right, bottom);
  ctx.lineTo(right - length, bottom);

  ctx.moveTo(box.x + length, bottom);
  ctx.lineTo(box.x, bottom);
  ctx.lineTo(box.x, bottom - length);
  ctx.stroke();
}

/**
 * Eclaircit l'objet survole et marque ses coins.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {{x: number, y: number, width: number, height: number}} box - Rectangle de l'objet
 */
function drawOfficeHotspotHighlight(ctx, box) {
  const pulse = officeHotspotPulse(OFFICE_HOTSPOT.PULSE_PERIOD_MS, OFFICE_HOTSPOT.PULSE_DEPTH);
  const smallSide = Math.min(box.width, box.height);

  fillOfficeHotspotGlow(ctx, box, OFFICE_HOTSPOT.FILL_ALPHA * pulse);

  // Des equerres plutot qu'un cadre complet : l'objet reste le sujet, la
  // surbrillance ne devient pas un element d'interface pose sur le decor.
  ctx.save();
  ctx.globalAlpha = OFFICE_HOTSPOT.BRACKET_ALPHA * pulse;
  ctx.strokeStyle = OFFICE_HOTSPOT.BRACKET_COLOR;
  ctx.lineWidth = Math.max(1, smallSide * OFFICE_HOTSPOT.BRACKET_WIDTH_RATIO);
  ctx.shadowColor = OFFICE_HOTSPOT.GLOW_COLOR;
  ctx.shadowBlur = Math.max(3, smallSide * OFFICE_HOTSPOT.GLOW_BLUR_RATIO);
  traceOfficeHotspotBrackets(ctx, box, smallSide * OFFICE_HOTSPOT.BRACKET_LENGTH_RATIO);

  ctx.restore();
}

/**
 * Texte de l'etiquette d'un objet dans la langue active. Les libelles sont
 * ceux des panneaux du HUD (translations.json, section `panels`) : l'objet
 * et son bouton disent donc toujours la meme chose.
 * @param {{tooltip: string|null}} hotspot - Objet du bureau
 * @returns {string|null} Texte a afficher, ou null si l'objet n'a pas d'etiquette
 */
function getOfficeHotspotTooltip(hotspot) {
  if (!hotspot.tooltip) return null;

  const lang = window.selectedLanguage || window.FNAF_DEFAULT_LANGUAGE || 'fr';
  const allTranslations = window.FNAF_TRANSLATIONS || {};
  const t = allTranslations[lang] || allTranslations[window.FNAF_DEFAULT_LANGUAGE] || {};
  return t.panels?.[hotspot.tooltip] || null;
}

/**
 * Dessine l'etiquette au-dessus de l'objet survole, ou en dessous s'il
 * touche le haut de l'ecran. Elle reste toujours entierement dans le canvas.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {{x: number, y: number, width: number, height: number}} box - Rectangle de l'objet
 * @param {string} text - Texte a afficher
 */
function drawOfficeHotspotTooltip(ctx, box, text) {
  const fontSize = Math.max(OFFICE_HOTSPOT_TOOLTIP.MIN_FONT_SIZE, canvas.height * OFFICE_HOTSPOT_TOOLTIP.FONT_SIZE_RATIO);
  const padding = fontSize * OFFICE_HOTSPOT_TOOLTIP.PADDING_RATIO;
  const gap = fontSize * OFFICE_HOTSPOT_TOOLTIP.GAP_RATIO;

  ctx.save();
  ctx.font = `${fontSize}px ${OFFICE_HOTSPOT_TOOLTIP.FONT_FAMILY}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const width = ctx.measureText(text).width + padding * 2;
  const height = fontSize + padding * 2;
  const aboveY = box.y - gap - height;
  const y = aboveY >= 0 ? aboveY : Math.min(canvas.height - height, box.y + box.height + gap);
  const x = Math.max(0, Math.min(canvas.width - width, box.x + box.width / 2 - width / 2));

  ctx.fillStyle = OFFICE_HOTSPOT_TOOLTIP.BACKGROUND;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = OFFICE_HOTSPOT_TOOLTIP.BORDER;
  ctx.lineWidth = 1;
  // Le decalage d'un demi-pixel garde le trait net sur un trait de 1 px.
  ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);

  ctx.fillStyle = OFFICE_HOTSPOT_TOOLTIP.TEXT_COLOR;
  ctx.fillText(text, x + width / 2, y + height / 2);

  ctx.restore();
}

/**
 * Memorise la geometrie de l'image du bureau et dessine la surbrillance de
 * l'objet survole. Les coordonnees passees sont celles utilisees pour
 * ctx.drawImage() : la surbrillance et le test de clic suivent donc
 * exactement le panoramique du bureau.
 * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
 * @param {string} officeImageKey - Cle de l'image du bureau affichee
 * @param {number} drawX - Abscisse de l'image dessinee
 * @param {number} drawY - Ordonnee de l'image dessinee
 * @param {number} drawWidth - Largeur de l'image dessinee
 * @param {number} drawHeight - Hauteur de l'image dessinee
 */
function drawOfficeHotspots(ctx, officeImageKey, drawX, drawY, drawWidth, drawHeight) {
  officeImageLayout = { officeImageKey, drawX, drawY, drawWidth, drawHeight };

  // Le survol est recalcule ici plutot qu'au dernier mouvement de souris :
  // le panoramique continue de glisser apres l'arret du curseur, et
  // l'image change quand une lumiere s'allume.
  const hovered = findOfficeHotspotAt(officePointerPosition);
  setOfficeHotspotCursor(hovered !== null);

  getOfficeHotspots(officeImageKey).forEach(hotspot => {
    if (!isOfficeHotspotAvailable(hotspot)) return;

    const box = resolveOfficeHotspotBox(hotspot.rect, officeImageLayout);
    if (hotspot.id === hovered?.id) {
      drawOfficeHotspotHighlight(ctx, box);
    } else if (hotspot.attract) {
      drawOfficeHotspotAttract(ctx, box);
    }
  });

  // L'etiquette passe apres la boucle : elle est opaque et doit rester
  // au-dessus des lueurs des autres objets.
  if (!hovered) return;

  const tooltip = getOfficeHotspotTooltip(hovered);
  if (tooltip) {
    drawOfficeHotspotTooltip(ctx, resolveOfficeHotspotBox(hovered.rect, officeImageLayout), tooltip);
  }
}

/**
 * Verifie au demarrage que chaque objet declare pointe vers une action et
 * une condition qui existent : sans ce controle, une faute de frappe dans
 * office_hotspots.json rendrait l'objet silencieusement inerte.
 */
function validateOfficeHotspots() {
  getDeclaredOfficeHotspots().forEach(hotspot => {
    if (!OFFICE_HOTSPOT_ACTIONS[hotspot.action]) {
      console.warn(`[OfficeHotspots] Objet "${hotspot.id}" : action "${hotspot.action}" inconnue.`);
    }
    if (hotspot.available && !OFFICE_HOTSPOT_AVAILABILITY[hotspot.available]) {
      console.warn(`[OfficeHotspots] Objet "${hotspot.id}" : condition "${hotspot.available}" inconnue.`);
    }
    if (hotspot.tooltip && !getOfficeHotspotTooltip(hotspot)) {
      console.warn(`[OfficeHotspots] Objet "${hotspot.id}" : libelle "panels.${hotspot.tooltip}" absent de translations.json.`);
    }
  });
}

validateOfficeHotspots();
