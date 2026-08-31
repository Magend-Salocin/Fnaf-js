/**
 * Validateur de config — audite au démarrage les données chargées depuis
 * script/config/*.json et journalise (console.warn) toute incohérence :
 * IDs dupliqués, salle non mappée à une caméra existante, référence
 * audio/journal/cassette/terminal invalide.
 *
 * Ne bloque jamais le jeu : sert uniquement à repérer une erreur de
 * saisie dans les fichiers de données avant qu'elle ne cause un bug
 * silencieux en jeu (événement qui s'efface au chargement, son qui ne
 * joue jamais, salle jamais éligible...). Voir reste_a_faire pour le
 * contexte — les bugs de ce type déjà rencontrés (CHICA-002 dupliqué,
 * roomLabel "Dining" invalide, garble_2 dupliqué) auraient tous été
 * détectés ici.
 */
(function validateGameConfig() {

  const issues = [];

  function report(message) {
    issues.push(message);
  }

  // 1. Événements aléatoires dupliqués (sur les données brutes, avant
  //    dédoublonnage par id dans RANDOM_EVENTS — un id en double y
  //    écrase silencieusement l'entrée précédente).
  if (typeof RANDOM_EVENTS_RAW !== 'undefined') {
    const counts = new Map();
    RANDOM_EVENTS_RAW.forEach(raw => counts.set(raw.id, (counts.get(raw.id) || 0) + 1));
    for (const [id, count] of counts) {
      if (count > 1) {
        report(`Événement aléatoire dupliqué : "${id}" apparaît ${count} fois (une seule entrée survit dans RANDOM_EVENTS, les autres sont silencieusement perdues).`);
      }
    }
  }

  // 2. roomLabel -> cameraId cohérent
  if (typeof RANDOM_EVENTS_RAW !== 'undefined' && typeof EVENT_ROOM_MAP !== 'undefined') {
    const validCameraIds = new Set((typeof cameras !== 'undefined' ? cameras : []).map(c => c.id));
    RANDOM_EVENTS_RAW.forEach(raw => {
      const mapping = EVENT_ROOM_MAP[raw.roomLabel];
      if (!mapping) {
        report(`Événement "${raw.id}" : roomLabel "${raw.roomLabel}" absent de EVENT_ROOM_MAP (l'événement ne sera jamais restreint à une caméra précise).`);
        return;
      }
      if (mapping.cameraId !== null && !validCameraIds.has(mapping.cameraId)) {
        report(`Événement "${raw.id}" : roomLabel "${raw.roomLabel}" pointe vers un cameraId inexistant ("${mapping.cameraId}") — l'événement ne pourra jamais se déclencher.`);
      }
    });
  }

  // 3. requiresEvent pointe vers un événement existant
  if (typeof RANDOM_EVENTS_RAW !== 'undefined') {
    const allIds = new Set(RANDOM_EVENTS_RAW.map(raw => raw.id));
    RANDOM_EVENTS_RAW.forEach(raw => {
      if (raw.requiresEvent && !allIds.has(raw.requiresEvent)) {
        report(`Événement "${raw.id}" : requiresEvent "${raw.requiresEvent}" ne correspond à aucun événement existant.`);
      }
    });
  }

  // 4. Commandes terminal référencées par les événements présentes dans
  //    LOG_FILES (donc avec un fichier ressources/logs/<CMD>.json).
  if (typeof RANDOM_EVENTS_RAW !== 'undefined' && typeof LOG_FILES !== 'undefined') {
    RANDOM_EVENTS_RAW.forEach(raw => {
      if (raw.terminal && !LOG_FILES.includes(raw.terminal.toUpperCase())) {
        report(`Événement "${raw.id}" : commande terminal "${raw.terminal}" absente de LOG_FILES (aucun ressources/logs/${raw.terminal}.json).`);
      }
    });
  }

  // 5. Journaux référencés par les événements présents dans
  //    journals_data.json.
  if (typeof RANDOM_EVENTS_RAW !== 'undefined' && typeof JOURNALS_LIBRARY !== 'undefined') {
    const validJournalCodes = new Set(JOURNALS_LIBRARY.map(j => j.code));
    RANDOM_EVENTS_RAW.forEach(raw => {
      if (raw.journal && !validJournalCodes.has(raw.journal)) {
        report(`Événement "${raw.id}" : journal "${raw.journal}" absent de script/config/journals_data.json.`);
      }
    });
  }

  // 6. Cassettes référencées par les événements présentes dans
  //    tapes_data.json.
  if (typeof RANDOM_EVENTS_RAW !== 'undefined' && typeof TAPES_LIBRARY !== 'undefined') {
    const validTapeCodes = new Set(TAPES_LIBRARY.map(t => t.code));
    RANDOM_EVENTS_RAW.forEach(raw => {
      if (raw.tape && !validTapeCodes.has(raw.tape)) {
        report(`Événement "${raw.id}" : cassette "${raw.tape}" absente de script/config/tapes_data.json.`);
      }
    });
  }

  // 7. IDs dupliqués dans le catalogue audio (game_sounds.json) — un
  //    doublon rend l'une des deux entrées définitivement inaccessible
  //    via playSound()/getSoundById().
  if (typeof gameSounds !== 'undefined') {
    const counts = new Map();
    gameSounds.forEach(s => counts.set(s.id, (counts.get(s.id) || 0) + 1));
    for (const [id, count] of counts) {
      if (count > 1) {
        report(`Catalogue audio : id "${id}" dupliqué (${count} entrées) — une seule est réellement jouable via playSound("${id}").`);
      }
    }
  }

  // 8. Sons référencés par les événements aléatoires présents dans le
  //    catalogue audio.
  if (typeof RANDOM_EVENTS_RAW !== 'undefined' && typeof gameSounds !== 'undefined') {
    const validSoundIds = new Set(gameSounds.map(s => s.id));
    RANDOM_EVENTS_RAW.forEach(raw => {
      if (raw.sound && !validSoundIds.has(raw.sound)) {
        report(`Événement "${raw.id}" : son "${raw.sound}" introuvable dans game_sounds.json (playSound() échouera silencieusement).`);
      }
    });
  }

  // 9. Sons référencés par les cassettes présents dans le catalogue
  //    audio.
  if (typeof TAPES_LIBRARY !== 'undefined' && typeof gameSounds !== 'undefined') {
    const validSoundIds = new Set(gameSounds.map(s => s.id));
    TAPES_LIBRARY.forEach(tape => {
      if (tape.soundId && !validSoundIds.has(tape.soundId)) {
        report(`Cassette "${tape.code}" : soundId "${tape.soundId}" introuvable dans game_sounds.json.`);
      }
    });
  }

  if (issues.length > 0) {
    console.warn(`[ConfigValidator] ${issues.length} incohérence(s) détectée(s) dans la configuration :`);
    issues.forEach(issue => console.warn(`  - ${issue}`));
  } else {
    console.log('[ConfigValidator] Configuration cohérente, aucune incohérence détectée.');
  }

})();
