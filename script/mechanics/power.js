function getPowerUsageLevel() {
  let usage = POWER_SYSTEM.BASE_USAGE;

  if (doors.left.isClosed) usage++;
  if (doors.right.isClosed) usage++;
  if (leftLight.on) usage++;
  if (rightLight.on) usage++;
  if (activeView === 'camera') usage++;

  return Math.min(usage, POWER_SYSTEM.MAX_USAGE);
}

function drainPowerByUsage(deltaSeconds) {
  currentPowerUsageLevel = getPowerUsageLevel();
  const drainRate = POWER_SYSTEM.DRAIN_PER_SECOND[currentPowerUsageLevel] || POWER_SYSTEM.DRAIN_PER_SECOND[1];
  power = Math.max(0, power - (drainRate * deltaSeconds));
}

function formatUsageBars(usage) {
  return `[${'I'.repeat(usage)}${'.'.repeat(POWER_SYSTEM.MAX_USAGE - usage)}]`;
}

function drawUsageStatus(usageLevel, currentLang, isCritical) {
  const usageEl = document.getElementById('usage-status');
  if (!usageEl) return;

  const usageLabel = currentLang === 'en' ? 'USAGE' : 'CONSO';
  const roomLabel = currentLang === 'en' ? 'POWER GRID' : 'RESEAU ELEC';
  const bars = Array.from({ length: POWER_SYSTEM.MAX_USAGE }, (_, idx) => {
    const level = idx + 1;
    const activeClass = level <= usageLevel ? ' active' : '';
    return `<span class="usage-bar usage-bar-${level}${activeClass}"></span>`;
  }).join('');

  usageEl.classList.toggle('usage-critical', isCritical);
  usageEl.innerHTML =
    `<div class="usage-label">OFFICE ${usageLabel}</div>` +
    `<div class="usage-row">` +
      `<div class="usage-bars" aria-label="usage level ${usageLevel} of ${POWER_SYSTEM.MAX_USAGE}">${bars}</div>` +
      `<div class="usage-value">${usageLevel}</div>` +
    `</div>` +
    `<div class="usage-footnote">${roomLabel} ${formatUsageBars(usageLevel)}</div>`;
}

function getPowerStatusLabel() {
  const lang = window.selectedLanguage || window.FNAF_DEFAULT_LANGUAGE || 'fr';
  if (lang === 'en') return 'POWER';
  return 'PUISSANCE';
}


// Mettre à jour l'affichage de l'énergie
function updatePowerDisplay(forceRender = false) {
  const powerEl = document.getElementById('powerUsage');
  if (!powerEl) return;

  const displayPower = Math.max(0, Math.floor(power));
  const usageLevel = getPowerUsageLevel();
  const displayDigits = String(displayPower).padStart(3, '0');
  const powerLabel = getPowerStatusLabel();
  const currentLang = window.selectedLanguage || window.FNAF_DEFAULT_LANGUAGE || 'fr';
  const isLow = displayPower <= 30;
  const isCritical = displayPower <= 10;

  drawUsageStatus(usageLevel, currentLang, isCritical);

  if (!forceRender &&
    POWER_DISPLAY_CACHE.value === displayPower &&
    POWER_DISPLAY_CACHE.usage === usageLevel &&
    POWER_DISPLAY_CACHE.lang === currentLang
  ) {
    return;
  }

  POWER_DISPLAY_CACHE.value = displayPower;
  POWER_DISPLAY_CACHE.usage = usageLevel;
  POWER_DISPLAY_CACHE.lang = currentLang;

  powerEl.classList.toggle('power-low', isLow && !isCritical);
  powerEl.classList.toggle('power-critical', isCritical);
  powerEl.innerHTML =
    `<div class="power-label">OFFICE ${powerLabel}</div>` +
    `<div class="power-row">` +
      `<div class="battery-shell"><div class="battery-level" style="width: ${displayPower}%;"></div></div>` +
      `<div class="power-percent">` +
        `<span class="power-digits">${displayDigits}</span>` +
        `<span class="power-unit">%</span>` +
      `</div>` +
    `</div>` +
    `<div class="power-footnote">BATTERY // LIVE FEED</div>`;

  if (power <= 0) {

    clearInterval(gameLoopInterval);
  }
}