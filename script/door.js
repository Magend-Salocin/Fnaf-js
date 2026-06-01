// #region Gestion des lumières

/**
 * Objets représentant l'état et la configuration des lumières gauche et droite.
 * @property {number} value - État actuel de la lumière (0 = éteinte, 1 = allumée).
 * @property {boolean} on - Indique si la lumière est allumée.
 * @property {string} side - Côté de la lumière ('left' ou 'right').
 * @property {boolean} disabled - Indique si la lumière est désactivée.
 * @property {string} toggleId - ID de l'élément DOM associé au bouton de basculement.
 */
const leftLight = {
    value: 0,
    on: false,
    side: 'left',
    disabled: false,
    toggleId: 'left-light-toggle'
};

const rightLight = {
    value: 0,
    on: false,
    side: 'right',
    disabled: false,
    toggleId: 'right-light-toggle'
};

/**
 * Configure les écouteurs d'événements pour basculer une lumière.
 * @param {Object} light - Objet représentant une lumière (gauche ou droite).
 */
function setupLightToggle(light) {
    const toggle = document.getElementById(light.toggleId);

    toggle.addEventListener('mousedown', () => {
        if (light.disabled) return;

        if(bonnie.isInSafeRoom() && leftLight.on){
            playSound("window_scare");
        }else if(chica.isInSafeRoom() && rightLight.on) {
            playSound("window_scare");
        }

        light.value = 1;
        light.on = true;
        power -= 0.5;
        updatePowerDisplay();
        processLightActivity(light.value, light.side);
    });

    toggle.addEventListener('mouseup', () => {
        if (light.disabled) return;
        light.value = 0;
        light.on = false;
        processLightActivity(light.value, light.side);
    });

    toggle.addEventListener('mouseleave', () => {
        if (light.disabled) return;
        light.value = 0;
        light.on = false;
        processLightActivity(light.value, light.side);
    });
}

/**
 * Traite l'activité d'une lumière (mise à jour de l'interface et des sons).
 * @param {number} state - État de la lumière (0 ou 1).
 * @param {string} pos - Position de la lumière ('left' ou 'right').
 */
function processLightActivity(state, pos) {
    if (power > 0 && !rightLight.disabled && !leftLight.disabled) {
         const switchImg = document.querySelector(`.${pos}-switch > img`);
        if (pos === 'left') {
            switchImg.src = `images/_switch_door/left_switch_door_${doors.left.value}_light_${leftLight.value}.png`;
        } else {
            switchImg.src = `images/_switch_door/right_switch_door_${doors.right.value}_light_${rightLight.value}.png`;
        }
        state ? playSoundLoop("light_on") : stopSound("light_on");
    }else{
        stopSound("light_on");
        playSound("door_light_disabled");
      
    }
}

// #endregion

// #region Gestion des portes

/**
 * Objet représentant l'état et la configuration des portes gauche et droite.
 * @property {boolean} isClosed - Indique si la porte est fermée.
 * @property {number} value - État actuel de la porte (0 = ouverte, 1 = fermée).
 * @property {HTMLElement} element - Élément DOM associé à la porte.
 */
const doors = {
    left: { isClosed: false, value: 0, element: document.getElementById('_left') },
    right: { isClosed: false, value: 0, element: document.getElementById('_right') }
};

/**
 * Cache les deux portes en appliquant la classe CSS 'display-0'.
 */
function hideDoors() {
    Object.values(doors).forEach(door => {
        door.element.classList.remove('display-0', 'display-1');
        door.element.classList.add('display-0');
    });
}

/**
 * Affiche les deux portes en appliquant la classe CSS 'display-1'.
 */
function showDoors() {
    Object.values(doors).forEach(door => {
        door.element.classList.remove('display-0', 'display-1');
        door.element.classList.add('display-1');
    });
}

/**
 * Bascule l'état d'une porte (ouverte/fermée) et met à jour l'interface.
 * @param {string} location - Position de la porte ('left' ou 'right').
 */
function toggleDoor(location) {

    if (power <= 0 || leftLight.disabled || rightLight.disabled) {
        playSound("door_light_disabled");
        return;
    }

    playSound("door_sound");
    const door = doors[location];
    
    door.value= door.value ? 0 : 1;
    door.isClosed = !door.isClosed;

    power -= 1;
    updatePowerDisplay();

    // Mise à jour des images
    const lightState = location === 'right' ? rightLight.value : leftLight.value;
    document.getElementById(`${location}-switch`).src =`images/_switch_door/${location}_switch_door_${door.value}_light_${lightState}.png`;
    document.getElementById(`${location}-door`).src =`images/_doors/${location}_door_${door.value}.gif`;
}

/**
 * Détermine la clé de l'image du bureau en fonction de l'état des lumières et des personnages.
 * @returns {string} Clé de l'image à afficher.
 */
function getOfficeImageKey() {
    // Exemple : Choisir une image en fonction de l'état des lumières

    if(power > 0 ){

        // Cas spéciaux pour Bonnie et Chica
        if (bonnie.isInSafeRoom() && leftLight.on) {
            return 'safe_room_bonny_right_door_scare';
        }
        if (chica.isInSafeRoom() && rightLight.on) {
            return 'safe_room_chika_left_door_scare';
        }

        // Construction d'une clé temporaire pour le switch
        const leftOn = leftLight.on ? '1' : '0';
        const rightOn = rightLight.on ? '1' : '0';
        return `safe_room_left_light_${leftOn}_right_light_${rightOn}`;
    }
}
// #endregion