/**
 * =============================================
 * GESTION CENTRALISÉE DES SONS POUR FNAF 1
 * =============================================
 * Ce module gère la lecture, l'arrêt et le volume
 * de tous les effets sonores et musiques du jeu.
 */



// ---------------------------------------------
// 2. GESTION DU VOLUME GLOBAL
// ---------------------------------------------
/**
 * Réglages d'usine du mixer, seule référence du jeu.
 *
 * Les groupes sont neutres : l'équilibre entre les sons est entièrement porté
 * par le `mixVolume` de chaque entrée de game_sounds.json, calé sur le tableau
 * de référence FNAF 1. Un groupe réglé ailleurs qu'à 1 est une préférence du
 * joueur, pas une correction du mixage. Le volume général est le seul niveau
 * d'écoute à ajuster.
 */
const AUDIO_MIXER_DEFAULTS = Object.freeze({
    globalVolume: 0.4,
    groups: Object.freeze({
        voice: 1,
        ambient: 1,
        metallic: 1,
        abnormal: 1
    })
});

/**
 * Volume général du jeu (0.0 à 1.0).
 * @type {number}
 */
let globalVolume = AUDIO_MIXER_DEFAULTS.globalVolume;

/**
 * Clé de sauvegarde. La version est incrémentée quand les réglages d'usine
 * changent, pour qu'un ancien enregistrement ne remette pas des valeurs
 * calées sur un mixage qui n'existe plus.
 */
const AUDIO_MIXER_STORAGE_KEY = 'fnaf_audio_mixer_v2';

/**
 * Volumes par groupe de sons (0.0 à 1.0).
 */
const audioGroupVolumes = { ...AUDIO_MIXER_DEFAULTS.groups };

/** Volume avant mute (pour restauration). */
let _volumeBeforeMute = globalVolume;
/** Etat mute. */
let _isMuted = false;

/**
 * Définit le volume global pour tous les sons.
 * @param {number} volume - Niveau de volume (0.0 à 1.0).
 */
function setGlobalVolume(volume) {
    globalVolume = Math.max(0, Math.min(1, volume)); // Limite entre 0 et 1
    _applyVolumeToAllSounds();
    _saveAudioMixerState();
    //console.log(`Volume global défini à : ${globalVolume}`);
}

/**
 * Sauvegarde les volumes du mixer.
 */
function _saveAudioMixerState() {
    try {
        const payload = {
            globalVolume,
            groups: audioGroupVolumes
        };
        localStorage.setItem(AUDIO_MIXER_STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
        console.warn('Impossible de sauvegarder le mixer audio :', error);
    }
}

/**
 * Remet le mixer aux réglages d'usine et oublie les réglages sauvegardés.
 * C'est la sortie de secours quand les curseurs ont été déplacés au point de
 * ne plus savoir d'où on part.
 */
function resetAudioMixer() {
    globalVolume = AUDIO_MIXER_DEFAULTS.globalVolume;
    _volumeBeforeMute = globalVolume;
    _isMuted = false;

    Object.assign(audioGroupVolumes, AUDIO_MIXER_DEFAULTS.groups);

    try {
        localStorage.removeItem(AUDIO_MIXER_STORAGE_KEY);
    } catch (error) {
        console.warn('Impossible d\'effacer le mixer audio sauvegarde :', error);
    }

    _syncMixerUI();
    console.log('Mixer audio remis aux réglages par défaut.');
}

/**
 * Recharge les volumes sauvegardés du mixer.
 */
function _loadAudioMixerState() {
    try {
        const raw = localStorage.getItem(AUDIO_MIXER_STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw);

        // Une valeur absente ou aberrante laisse le réglage d'usine en place
        // plutôt que de propager un enregistrement abîmé.
        if (Number.isFinite(parsed?.globalVolume)) {
            globalVolume = Math.max(0, Math.min(1, parsed.globalVolume));
            _volumeBeforeMute = globalVolume;
        }

        if (parsed?.groups && typeof parsed.groups === 'object') {
            Object.keys(audioGroupVolumes).forEach(group => {
                if (Number.isFinite(parsed.groups[group])) {
                    audioGroupVolumes[group] = Math.max(0, Math.min(1, parsed.groups[group]));
                }
            });
        }
    } catch (error) {
        console.warn('Impossible de charger le mixer audio sauvegarde :', error);
    }
}

/**
 * Retourne le groupe audio logique d'un son.
 * @param {{category?: string}} soundInfo
 * @returns {'voice'|'ambient'|'metallic'|'abnormal'}
 */
function getAudioGroupForSound(soundInfo) {
    const category = soundInfo?.category;

    if (category === 'voice' || category === 'call') return 'voice';
    if (category === 'ambiance' || category === 'victory') return 'ambient';
    if (category === 'camera' || category === 'door' || category === 'kitchen' || category === 'movement') return 'metallic';
    if (category === 'gameover' || category === 'breath' || category === 'misc') return 'abnormal';

    return 'ambient';
}

/**
 * Calcule le volume final d'un son (global * groupe * mix individuel).
 * @param {{mixVolume?: number, category?: string}} soundInfo
 * @returns {number}
 */
function getFinalSoundVolume(soundInfo) {
    const mixVolume = Number.isFinite(soundInfo?.mixVolume) ? soundInfo.mixVolume : 1;
    const group = getAudioGroupForSound(soundInfo);
    const groupVolume = audioGroupVolumes[group] ?? 1;
    // Gain piloté par le jeu (cf. ambiance de menace). Vaut 1 pour tous les
    // sons que le jeu ne module pas dynamiquement.
    const dynamicGain = Number.isFinite(soundInfo?.dynamicGain) ? soundInfo.dynamicGain : 1;

    return Math.max(0, Math.min(1, globalVolume * groupVolume * mixVolume * dynamicGain));
}

/**
 * Règle le gain dynamique d'un son et l'applique immédiatement.
 * @param {string} id - Identifiant du son.
 * @param {number} gain - Gain entre 0.0 et 1.0.
 */
function setSoundDynamicGain(id, gain) {
    const soundInfo = gameSounds.find(s => s.id === id);
    if (!soundInfo) {
        console.warn(`Gain dynamique : son "${id}" introuvable.`);
        return;
    }

    soundInfo.dynamicGain = Math.max(0, Math.min(1, gain));
    _applySoundVolume(soundInfo);
}

/**
 * Règle le niveau visé d'un son en valeur absolue plutôt qu'en gain. Le
 * mixVolume du son sert de plafond : viser au-dessus revient à viser le
 * plafond.
 * @param {string} id - Identifiant du son.
 * @param {number} level - Niveau visé, dans l'échelle des mixVolume.
 */
function setSoundTargetLevel(id, level) {
    const soundInfo = gameSounds.find(s => s.id === id);
    if (!soundInfo) {
        console.warn(`Niveau visé : son "${id}" introuvable.`);
        return;
    }

    const mixVolume = Number.isFinite(soundInfo.mixVolume) ? soundInfo.mixVolume : 1;
    setSoundDynamicGain(id, mixVolume > 0 ? level / mixVolume : 0);
}

/**
 * Applique le volume calculé aux éléments audio d'un son. Une boucle en
 * fondu enchaîné en utilise deux, chacun avec son propre coefficient.
 * @param {{element?: HTMLAudioElement, loopPlayer?: {voices: HTMLAudioElement[]}}} soundInfo
 */
function _applySoundVolume(soundInfo) {
    const volume = getFinalSoundVolume(soundInfo);
    const elements = soundInfo?.loopPlayer ? soundInfo.loopPlayer.voices : [soundInfo?.element];

    elements.forEach(element => {
        if (!element) return;
        element.volume = Math.max(0, Math.min(1, volume * (element.crossfadeGain ?? 1)));
    });
}

/**
 * Applique les volumes à tous les sons.
 */
function _applyVolumeToAllSounds() {
    gameSounds.forEach(soundInfo => _applySoundVolume(soundInfo));
}

/**
 * Définit le volume d'un groupe audio.
 * @param {'voice'|'ambient'|'metallic'|'abnormal'} group
 * @param {number} volume
 */
function setAudioGroupVolume(group, volume) {
    if (!(group in audioGroupVolumes)) {
        console.warn(`Groupe audio inconnu : ${group}`);
        return;
    }

    const normalized = Math.max(0, Math.min(1, volume));
    audioGroupVolumes[group] = normalized;

    _applyVolumeToAllSounds();
    _updateAudioGroupUI(group, normalized);
    _saveAudioMixerState();
}

/**
 * Accès rapide pour régler plusieurs groupes à la fois.
 * @param {{voice?: number, ambient?: number, metallic?: number, abnormal?: number}} volumes
 */
function setAudioMixerVolumes(volumes) {
    Object.keys(audioGroupVolumes).forEach(group => {
        if (typeof volumes?.[group] === 'number') {
            audioGroupVolumes[group] = Math.max(0, Math.min(1, volumes[group]));
            _updateAudioGroupUI(group, audioGroupVolumes[group]);
        }
    });

    _applyVolumeToAllSounds();
    _saveAudioMixerState();
}

/**
 * Handler HTML pour les sliders de groupes.
 * @param {'voice'|'ambient'|'metallic'|'abnormal'} group
 * @param {string|number} value
 */
function onAudioGroupSliderChange(group, value) {
    const vol = Number(value) / 100;
    setAudioGroupVolume(group, vol);
}

// ---------------------------------------------
// CONTRÔLEUR DE VOLUME (UI)
// ---------------------------------------------

/**
 * Affiche / masque le panneau de volume.
 */
function toggleVolumePanel() {
    const panel = document.getElementById('volume-panel');
    if (panel) panel.classList.toggle('hidden');
}

/**
 * Appelé par le slider HTML quand l'utilisateur change le volume.
 * @param {string|number} value - Valeur 0–100 du slider.
 */
function onVolumeSliderChange(value) {
    const vol = Number(value) / 100;
    _volumeBeforeMute = vol;
    _isMuted = false;

    setGlobalVolume(vol);
    _updateVolumeUI(vol);
}

/**
 * Active / désactive le mute.
 */
function toggleMute() {
    if (_isMuted) {
        // Démute
        _isMuted = false;
        setGlobalVolume(_volumeBeforeMute);
        _updateVolumeUI(_volumeBeforeMute);
    } else {
        // Mute
        _volumeBeforeMute = globalVolume;
        _isMuted = true;
        setGlobalVolume(0);
        _updateVolumeUI(0);
    }
}

/**
 * Met à jour l'affichage du slider et du label.
 * @param {number} vol - Volume 0.0 à 1.0.
 */
function _updateVolumeUI(vol) {
    const slider = document.getElementById('volume-slider');
    const label  = document.getElementById('volume-label');
    const btn    = document.getElementById('volume-btn');
    const muteBtn = document.getElementById('volume-mute-btn');

    const pct = Math.round(vol * 100);

    if (slider) slider.value = pct;
    if (label)  label.textContent = pct + '%';

    // Icône du bouton principal
    if (btn) {
        if (vol === 0)      btn.textContent = '🔇';
        else if (vol < 0.4) btn.textContent = '🔉';
        else                btn.textContent = '🔊';
    }
    // Icône mute
    if (muteBtn) muteBtn.textContent = _isMuted ? '🔕' : '🔈';
}

/**
 * Met à jour l'affichage d'un groupe dans l'UI.
 * @param {'voice'|'ambient'|'metallic'|'abnormal'} group
 * @param {number} vol
 */
function _updateAudioGroupUI(group, vol) {
    const slider = document.getElementById(`volume-${group}-slider`);
    const label = document.getElementById(`volume-${group}-label`);
    const pct = Math.round(vol * 100);

    if (slider) slider.value = pct;
    if (label) label.textContent = pct + '%';
}

/**
 * Synchronise les sliders/labels au chargement.
 */
function _syncMixerUI() {
    _updateVolumeUI(globalVolume);
    Object.entries(audioGroupVolumes).forEach(([group, vol]) => _updateAudioGroupUI(group, vol));
    _applyVolumeToAllSounds();
}


/**
 * Applique le volume global et l'égaliseur individuel à un élément audio.
 * @param {HTMLAudioElement} audioElement - Élément audio à configurer.
 */
function applyGlobalVolume(audioElement) {
    if (!audioElement) return;

    // Trouve le son dans gameSounds pour récupérer son mixVolume
    const soundInfo = gameSounds.find(s => s.element === audioElement);
    if (soundInfo) {
        audioElement.volume = getFinalSoundVolume(soundInfo);
    } else {
        // Par défaut, applique seulement le globalVolume
        audioElement.volume = globalVolume;
    }
}

// ---------------------------------------------
// 3. FONCTIONS DE LECTURE ET D'ARRÊT PAR ID
// ---------------------------------------------
/**
 * Trouve un son par son identifiant.
 * @param {string} id - Identifiant du son.
 * @returns {HTMLAudioElement|undefined} - Élément audio ou undefined.
 */
function getSoundById(id) {
    const sound = gameSounds.find(s => s.id === id);
    return sound ? sound.element : undefined;
}

/**
 * Durée du recouvrement entre deux passages d'une boucle, en secondes.
 * Ramenée au quart de la durée du son s'il est plus court.
 */
const LOOP_CROSSFADE_SECONDS = 1.5;

/** Période de surveillance des boucles en fondu, en millisecondes. */
const LOOP_WATCH_INTERVAL_MS = 100;

/** Boucles en cours, indexées par identifiant de son. */
const _loopPlayers = new Map();

/** Timer partagé par toutes les boucles ; null quand il n'y en a aucune. */
let _loopWatchTimer = null;

/**
 * Joue un son en boucle par son identifiant.
 *
 * La boucle native de <audio> redémarre le fichier net : on entend la fin
 * s'arrêter puis le début repartir, d'autant plus que les ambiances longues
 * du jeu se terminent par un fondu vers le silence. On fait donc jouer deux
 * copies du son en alternance, la suivante démarrant avant que la précédente
 * ne se termine, avec un fondu croisé entre les deux.
 * @param {string} id - Identifiant du son.
 */
function playSoundLoop(id) {
    const soundInfo = gameSounds.find(s => s.id === id);
    if (!soundInfo?.element) {
        console.error(`Erreur : son avec l'id "${id}" non trouvé.`);
        return;
    }

    // Arrête le son s'il est déjà en cours
    stopSound(id);

    // La seconde voix est un clone du même élément : même source, donc même
    // fichier déjà en cache, et aucune balise à ajouter dans index.html. On
    // la garde d'une boucle à l'autre, les sons courts comme la lumière de
    // porte étant relancés très souvent.
    if (!soundInfo.secondVoice) {
        soundInfo.secondVoice = soundInfo.element.cloneNode();
    }

    const voices = [soundInfo.element, soundInfo.secondVoice];

    voices.forEach(voice => {
        voice.loop = false;
        voice.crossfadeGain = 0;
    });

    soundInfo.loopPlayer = { voices, current: 0, fadingIn: null };
    _loopPlayers.set(id, soundInfo);

    _startLoopVoice(soundInfo, 0, 1);
    _applySoundVolume(soundInfo);

    if (!_loopWatchTimer) {
        _loopWatchTimer = setInterval(_updateLoopPlayers, LOOP_WATCH_INTERVAL_MS);
    }
}

/**
 * Démarre une des deux voix d'une boucle depuis le début.
 * @param {{loopPlayer: {voices: HTMLAudioElement[]}}} soundInfo
 * @param {number} index - Voix à démarrer (0 ou 1).
 * @param {number} gain - Coefficient de fondu initial (0 pour entrer en fondu).
 */
function _startLoopVoice(soundInfo, index, gain) {
    const voice = soundInfo.loopPlayer.voices[index];

    voice.currentTime = 0;
    voice.crossfadeGain = gain;
    voice.play().catch(error => {
        console.error("Erreur de lecture en boucle :", error);
    });
}

/**
 * Durée du fondu applicable à une voix, bornée au quart de sa durée pour les
 * sons courts.
 * @param {HTMLAudioElement} voice
 * @returns {number} Durée en secondes, 0 si la durée du son est inconnue.
 */
function _getCrossfadeDuration(voice) {
    if (!Number.isFinite(voice.duration) || voice.duration <= 0) return 0;
    return Math.min(LOOP_CROSSFADE_SECONDS, voice.duration / 4);
}

/**
 * Fait avancer toutes les boucles : lance la voix suivante à l'approche de la
 * fin, puis répartit le volume entre les deux pendant le recouvrement.
 */
function _updateLoopPlayers() {
    _loopPlayers.forEach(soundInfo => {
        const player = soundInfo.loopPlayer;
        if (!player) return;

        const outgoing = player.voices[player.current];
        const crossfade = _getCrossfadeDuration(outgoing);

        // Filet de sécurité : si la voix s'est tue sans qu'un fondu ait pu
        // démarrer, parce que sa durée n'était pas encore connue, on relance
        // plutôt que de laisser la boucle s'éteindre.
        if (player.fadingIn === null && outgoing.ended) {
            _startLoopVoice(soundInfo, player.current, 1);
            _applySoundVolume(soundInfo);
            return;
        }

        if (crossfade === 0) return;

        if (player.fadingIn === null && outgoing.duration - outgoing.currentTime <= crossfade) {
            player.fadingIn = 1 - player.current;
            _startLoopVoice(soundInfo, player.fadingIn, 0);
        }

        if (player.fadingIn !== null) {
            const incoming = player.voices[player.fadingIn];
            const progress = Math.min(1, incoming.currentTime / crossfade);

            incoming.crossfadeGain = progress;
            outgoing.crossfadeGain = 1 - progress;

            if (progress >= 1) {
                outgoing.pause();
                outgoing.currentTime = 0;
                outgoing.crossfadeGain = 0;
                player.current = player.fadingIn;
                player.fadingIn = null;
            }
        }

        _applySoundVolume(soundInfo);
    });
}

/**
 * Arrête et oublie la boucle d'un son, s'il en a une.
 * @param {{loopPlayer?: {voices: HTMLAudioElement[]}}} soundInfo
 */
function _stopLoopPlayer(soundInfo) {
    if (!soundInfo?.loopPlayer) return;

    soundInfo.loopPlayer.voices.forEach(voice => {
        voice.pause();
        voice.currentTime = 0;
        voice.crossfadeGain = 1;
    });

    soundInfo.loopPlayer = null;
    _loopPlayers.delete(soundInfo.id);

    if (_loopPlayers.size === 0 && _loopWatchTimer) {
        clearInterval(_loopWatchTimer);
        _loopWatchTimer = null;
    }
}

/**
 * Joue un son de Foxy (avec limitation pour éviter les répétitions)
 * @param {string} soundId - ID du son à jouer
 * @param {string} message - Message de log
 */
function playFoxySound(soundId, message) {
    console.log(`[Foxy] ${message}`);
    playSound(soundId); 
}
    
/**
 * Joue un son une seule fois.
 * @param {string} id - Identifiant du son.
 */
function playSound(id) {

    const audioElement = getSoundById(id);

    if (!audioElement) {
        console.error(`Erreur : son avec l'id "${id}" non trouvé.`);
        return;
    }

    // Arrête le son s'il est déjà en cours
    stopSound(id);

    audioElement.loop = false;
    audioElement.currentTime = 0;
    applyGlobalVolume(audioElement);

    audioElement.play().catch(error => {
        console.error("Erreur de lecture :", error ,"(son id:", id, ")");
    });
}

/**
 * Arrête un son spécifique par son identifiant.
 * @param {string} id - Identifiant du son.
 */
function stopSound(id) {
    const soundInfo = gameSounds.find(s => s.id === id);
    if (!soundInfo?.element) return;

    _stopLoopPlayer(soundInfo);

    soundInfo.element.pause();
    soundInfo.element.currentTime = 0;
}

/**
 * Arrête tous les sons en cours de lecture.
 */
function stopAllSounds() {
    gameSounds.forEach(soundInfo => {
        //console.log(`Arrêt du son (id: ${soundInfo.id}):`, soundInfo.element.src);
        stopSound(soundInfo.id);
    });
    console.log("Tous les sons ont été arrêtés.");
}

/**
 * Démarre les sons d'ambiance du jeu.
 */
function startAmbientSounds() {
    if (!gameStarted) {
        // Trois couches : le ventilateur du bureau, l'ambiance de fond de la
        // nuit, et la nappe de menace dont le volume suit les animatronics.
        playSoundLoop("buzz_fan");
        playSoundLoop("cold_presc");
        playSoundLoop("ambience1");
        console.log("Sons d'ambiance démarrés avec volume global :", globalVolume);
    }
}


// ---------------------------------------------
// 4. AMBIANCE DE MENACE
// ---------------------------------------------
/**
 * Reprend le comportement de FNAF 1 : la nappe sonore inquiétante monte par
 * paliers selon le nombre d'animatronics en position d'attaque, et sature
 * quand Freddy est juste derrière la porte. Le palier donne un gain
 * dynamique, multiplié ensuite par le mixer habituel (global × groupe × mix).
 */
const THREAT_AMBIENCE_ID = "ambience1";

/** Gain par nombre de menaces ; au-delà du dernier palier, on reste à 1. */
const THREAT_AMBIENCE_STEPS = [0, 0.30, 0.50, 0.75, 1];

/** Gain forcé quand Freddy attend devant le bureau. */
const THREAT_AMBIENCE_FREDDY_GAIN = 1;

/** Vitesse de transition entre deux paliers, en gain par seconde. */
const THREAT_AMBIENCE_FADE_PER_SECOND = 0.5;

/** Gain courant, interpolé vers le palier cible à chaque frame. */
let _threatAmbienceGain = 0;

/**
 * Calcule le gain cible à partir de l'état des animatronics.
 * @returns {number} Gain entre 0.0 et 1.0.
 */
function getThreatAmbienceTargetGain() {
    if (typeof getOfficeThreatState !== 'function') return 0;

    const { threatCount, freddyAtOffice } = getOfficeThreatState();

    if (freddyAtOffice) return THREAT_AMBIENCE_FREDDY_GAIN;

    const step = Math.min(threatCount, THREAT_AMBIENCE_STEPS.length - 1);
    return THREAT_AMBIENCE_STEPS[step];
}

/**
 * Fait glisser l'ambiance de menace vers son palier cible.
 * À appeler à chaque frame de la boucle de jeu.
 * @param {number} deltaSeconds - Temps écoulé depuis la frame précédente.
 */
function updateThreatAmbience(deltaSeconds) {
    const target = getThreatAmbienceTargetGain();
    const maxStep = THREAT_AMBIENCE_FADE_PER_SECOND * deltaSeconds;
    const delta = target - _threatAmbienceGain;

    if (Math.abs(delta) <= 0.001) {
        if (_threatAmbienceGain === target) return;
        _threatAmbienceGain = target;
    } else {
        _threatAmbienceGain += Math.sign(delta) * Math.min(Math.abs(delta), maxStep);
    }

    setSoundDynamicGain(THREAT_AMBIENCE_ID, _threatAmbienceGain);
}

/**
 * Remet l'ambiance de menace au silence (début de nuit).
 */
function resetThreatAmbience() {
    _threatAmbienceGain = 0;
    setSoundDynamicGain(THREAT_AMBIENCE_ID, 0);
}

// ---------------------------------------------
// 5. RESPIRATION DU VENTILATEUR
// ---------------------------------------------
/**
 * Le ventilateur du bureau tourne en boucle toute la nuit. À volume
 * rigoureusement constant, l'oreille finit par le gommer. On le fait donc
 * dériver lentement entre deux niveaux, assez peu pour qu'aucune variation
 * ne s'entende, assez pour que la boucle reste vivante.
 */
const FAN_SOUND_ID = "buzz_fan";
const FAN_LEVEL_MIN = 0.02;
const FAN_LEVEL_MAX = 0.06;

/**
 * Périodes des deux oscillations, en secondes. Volontairement premières entre
 * elles : leur somme ne se répète qu'au bout de 77 s, donc la dérive ne
 * s'entend jamais comme un cycle.
 */
const FAN_FLUTTER_PERIODS = [7, 11];

/** Temps écoulé dans le cycle de dérive, en secondes. */
let _fanFlutterTime = 0;

/**
 * Fait dériver le volume du ventilateur.
 * À appeler à chaque frame de la boucle de jeu.
 * @param {number} deltaSeconds - Temps écoulé depuis la frame précédente.
 */
function updateFanFlutter(deltaSeconds) {
    const cycle = FAN_FLUTTER_PERIODS[0] * FAN_FLUTTER_PERIODS[1];
    _fanFlutterTime = (_fanFlutterTime + deltaSeconds) % cycle;

    const wave = FAN_FLUTTER_PERIODS
        .reduce((sum, period) => sum + Math.sin(2 * Math.PI * _fanFlutterTime / period), 0)
        / FAN_FLUTTER_PERIODS.length;

    const middle = (FAN_LEVEL_MIN + FAN_LEVEL_MAX) / 2;
    const amplitude = (FAN_LEVEL_MAX - FAN_LEVEL_MIN) / 2;

    setSoundTargetLevel(FAN_SOUND_ID, middle + amplitude * wave);
}

// ---------------------------------------------
// 6. SON D'AMBIANCE RARE
// ---------------------------------------------
/**
 * La musique de cirque est un son d'ambiance rare. Elle ne sert aucune
 * information au joueur : son seul rôle est de tomber sans prévenir, une fois
 * de temps en temps, sur une nuit par ailleurs silencieuse. Elle ne se
 * déclenche donc qu'une fois par nuit au maximum.
 */
const RARE_AMBIENT_SOUND_ID = "circus";

/**
 * Probabilité tirée à chaque minute de jeu. Une nuit dure 360 minutes de jeu,
 * ce qui donne environ une nuit sur trois avec le son.
 */
const RARE_AMBIENT_CHANCE_PER_MINUTE = 0.001;

/** Vrai dès que le son a été joué cette nuit. */
let _rareAmbientPlayed = false;

/**
 * Tire au sort le son d'ambiance rare.
 * À appeler une fois par minute de jeu.
 */
function tryPlayRareAmbientSound() {
    if (_rareAmbientPlayed) return;
    if (Math.random() >= RARE_AMBIENT_CHANCE_PER_MINUTE) return;

    _rareAmbientPlayed = true;
    playSound(RARE_AMBIENT_SOUND_ID);
}

/**
 * Rend le son d'ambiance rare à nouveau tirable (début de nuit).
 */
function resetRareAmbientSound() {
    _rareAmbientPlayed = false;
}

/**
 * Démarre les sons de l'écran d'accueil. C'est darkness_music, la musique de
 * menu du jeu d'origine ; le thème ajouté reste réservé au journal.
 */
function startMenuSounds() {
    if (!gameStarted) {
        playSoundLoop("menu_start");
        console.log("Sons du menu principal démarrés avec volume global :", globalVolume);
    }
}

