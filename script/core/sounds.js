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
 * Volume général du jeu (0.0 à 1.0).
 * @type {number}
 */
let globalVolume = 0.4;

const AUDIO_MIXER_STORAGE_KEY = 'fnaf_audio_mixer_v1';

/**
 * Volumes par groupe de sons (0.0 à 1.0).
 */
const audioGroupVolumes = {
    voice: 1,
    ambient: 0.4,
    metallic: 0.6,
    abnormal: 0.8
};

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
 * Recharge les volumes sauvegardés du mixer.
 */
function _loadAudioMixerState() {
    try {
        const raw = localStorage.getItem(AUDIO_MIXER_STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw);

        if (typeof parsed?.globalVolume === 'number') {
            globalVolume = Math.max(0, Math.min(1, parsed.globalVolume));
            _volumeBeforeMute = globalVolume;
        }

        if (parsed?.groups && typeof parsed.groups === 'object') {
            Object.keys(audioGroupVolumes).forEach(group => {
                if (typeof parsed.groups[group] === 'number') {
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

    return Math.max(0, Math.min(1, globalVolume * groupVolume * mixVolume));
}

/**
 * Applique les volumes à tous les sons.
 */
function _applyVolumeToAllSounds() {
    gameSounds.forEach(soundInfo => {
        if (!soundInfo?.element) return;
        soundInfo.element.volume = getFinalSoundVolume(soundInfo);
    });
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
 * Joue un son en boucle par son identifiant.
 * @param {string} id - Identifiant du son.
 */
function playSoundLoop(id) {
    const audioElement = getSoundById(id);
    if (!audioElement) {
        console.error("Erreur : élément audio non défini.");
        return;
    }

    // Arrête le son s'il est déjà en cours
    stopSound(id);

    audioElement.loop = true;
    audioElement.currentTime = 0;
    
    applyGlobalVolume(audioElement);
    
    audioElement.play().catch(error => {
        console.error("Erreur de lecture en boucle :", error);
    });
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
    const audioElement = getSoundById(id);
    if (!audioElement) return;

    audioElement.pause();
    audioElement.currentTime = 0;
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
        //buzzFanSound.volume = 0.1 * globalVolume; // Volume relatif au volume global
        playSoundLoop("ambience1");
        playSoundLoop("buzz_fan");
        console.log("Sons d'ambiance démarrés avec volume global :", globalVolume);
    }
}


/**
 * Démarre les sons du menu principal.
 */
function startMenuSounds() {
    if (!gameStarted) {
        //buzzFanSound.volume = 0.1 * globalVolume; // Volume relatif au volume global
        playSoundLoop("menu_start2");
        console.log("Sons du menu principal démarrés avec volume global :", globalVolume);
    }
}

