
function applyLanguage(lang) {
  selectedLanguage = translations[lang] ? lang : defaultLanguage;
  const t = translations[selectedLanguage];

  document.documentElement.lang = selectedLanguage;
  document.getElementById('language-title').textContent = t.languageTitle;
  document.getElementById('language-subtitle').textContent = t.languageSubtitle;
  document.getElementById('lang-fr-btn').textContent = t.languageFrButton;
  document.getElementById('lang-en-btn').textContent = t.languageEnButton;
  document.getElementById('game-title').innerHTML = t.gameTitle;
  document.getElementById('start-game').textContent = t.startGame;
  if (t.transition) {
    document.getElementById('transition-night-label').textContent = t.transition.nightLabel;
  }
  if (typeof updatePowerDisplay === 'function') {
    updatePowerDisplay(true);
  } else {
    document.getElementById('powerUsage').textContent = t.powerUsage;
  }

  if (t.panels) {
    document.getElementById('computer-panel-label').textContent = t.panels.computerLabel;
    document.getElementById('computer-panel-status').textContent = t.panels.computerStatus;
    document.getElementById('computer-panel-footer').textContent = t.panels.computerFooter;

    document.getElementById('phone-panel-label').textContent = t.panels.phoneLabel;
    document.getElementById('phone-panel-status').textContent = t.panels.phoneStatus;
    document.getElementById('phone-panel-footer').textContent = t.panels.phoneFooter;

    document.getElementById('camera-panel-label').textContent = t.panels.cameraLabel;
    document.getElementById('camera-panel-status').textContent = t.panels.cameraStatus;
    document.getElementById('camera-panel-footer').textContent = t.panels.cameraFooter;

    document.getElementById('tape-panel-label').textContent = t.panels.tapeLabel;
    document.getElementById('tape-panel-status').textContent = t.panels.tapeStatus;
    document.getElementById('tape-panel-footer').textContent = t.panels.tapeFooter;
  }

  document.getElementById('room-dining-area').textContent = t.rooms.diningArea;
  document.getElementById('room-backstage').textContent = t.rooms.backstage;
  document.getElementById('room-showstage').textContent = t.rooms.showstage;
  document.getElementById('camsafe').textContent = t.rooms.office;
  document.getElementById('room-pirate-cove').textContent = t.rooms.pirateCove;
  document.getElementById('room-supply-closet').textContent = t.rooms.supplyCloset;
  document.getElementById('room-rest-room').textContent = t.rooms.restRoom;
  document.getElementById('room-kitchen').textContent = t.rooms.kitchen;
  document.getElementById('room-west-hall').textContent = t.rooms.westHall;
  document.getElementById('room-east-hall').textContent = t.rooms.eastHall;

  document.getElementById('cam1a').textContent = t.cameras.cam1a;
  document.getElementById('cam1b').textContent = t.cameras.cam1b;
  document.getElementById('cam1c').textContent = t.cameras.cam1c;
  document.getElementById('cam2a').textContent = t.cameras.cam2a;
  document.getElementById('cam2b').textContent = t.cameras.cam2b;
  document.getElementById('cam3').textContent = t.cameras.cam3;
  document.getElementById('cam4a').textContent = t.cameras.cam4a;
  document.getElementById('cam4b').textContent = t.cameras.cam4b;
  document.getElementById('cam5').textContent = t.cameras.cam5;
  document.getElementById('cam6').textContent = t.cameras.cam6;
  document.getElementById('cam7').textContent = t.cameras.cam7;

 
  window.selectedLanguage = selectedLanguage;
}

function setupLanguageScreen() {
  const languageScreen = document.getElementById('language-screen');
  const startScreen = document.getElementById('start-screen');
  const langButtons = document.querySelectorAll('.lang-btn');
  const savedLanguage = localStorage.getItem('fnaf-language');

  if (savedLanguage && translations[savedLanguage]) {
    applyLanguage(savedLanguage);
  } else {
    applyLanguage(defaultLanguage);
  }

  languageScreen.classList.remove('display-0');
  startScreen.classList.add('display-0');

  langButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const lang = button.getAttribute('data-lang') || 'fr';
      localStorage.setItem('fnaf-language', lang);
      applyLanguage(lang);
      languageScreen.classList.remove('language-screen');
      languageScreen.classList.add('display-0');
      startScreen.classList.remove('display-0');
      console.log(`Langue sélectionnée : ${lang}`);
   
      startMenuSounds();

    });
  });
}
