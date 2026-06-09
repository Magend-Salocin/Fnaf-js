/**
 * Affiche l'heure actuelle dans le div #time-status
 */
function drawGameTime() {
  const el = document.getElementById('time-status');
  if (!el) return;

  const lang = window.selectedLanguage || window.FNAF_DEFAULT_LANGUAGE || 'fr';
  const allTranslations = window.FNAF_TRANSLATIONS || {};
  const t = allTranslations[lang] || allTranslations[window.FNAF_DEFAULT_LANGUAGE] || {};
  const modeLabel = t.clockPanel?.modeLabel || 'CAM / OFFICE';
  const amLabel = t.clockPanel?.amLabel || 'AM';
  const nightLabel = t.clockPanel?.nightLabel || 'NIGHT';

  const h = (gameTime.hours === 0) ? '12' : String(gameTime.hours).padStart(2, '0');
  const m = String(gameTime.minutes).padStart(2, '0');
  el.innerHTML =
    `<div class="clock-label">${modeLabel}</div>` +
    `<div class="clock-time"><span class="clock-digits">${h}</span><span class="clock-colon">:</span><span class="clock-digits">${m}</span></div>` +
    `<div class="clock-ampm">${amLabel} - ${nightLabel} ${night}</div>`;
}

// Formate l'heure en "HH:MM"
function formatGameTime(time) {
    const hoursStr = time.hours.toString().padStart(2, '0');
    const minutesStr = time.minutes.toString().padStart(2, '0');
    return `${hoursStr}:${minutesStr}`;
}