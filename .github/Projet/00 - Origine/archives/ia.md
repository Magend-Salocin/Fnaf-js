

⚙️ 1. Architecture globale (toutes les IA)

Tous les animatroniques suivent ce schéma :

         ┌───────────────┐
         │  TIMER GLOBAL  │ (toutes les X sec)
         └───────┬───────┘
                 │
                 ▼
        ┌─────────────────┐
        │ CHECK AI LEVEL  │ (par heure 12AM → 5AM)
        └───────┬─────────┘
                │
     ┌──────────┼───────────┐
     ▼          ▼           ▼
 MOVEMENT   ATTACK CHECK   SPECIAL RULES
 (nodes)    (door kill)    (Foxy / Freddy)
🤖 2. Bonnie IA (pattern “path classique”)
Stage → Dining → Hall → Corner → Left Door
Logique :
every 3-7 sec:
    if player NOT watching Bonnie:
        roll chance (AI + time)
            → move forward 1 node
Diagramme :
[Stage]
   ↓
[Dining Room]
   ↓
[West Hall]
   ↓
[Corner]
   ↓
[Left Door] → ATTACK if open

👉 comportement simple : pression progressive

🍗 3. Chica IA (identique à Bonnie)
Stage → Dining → Hall → Kitchen → Right Door
Particularité :
plus “bruitée” (audio kitchen)
mêmes règles que Bonnie
if not watched:
    random move forward
🐻 4. Freddy Fazbear IA (stealth + anti-camera)

Freddy est non-linéaire.

🔁 Système réel :
Stage → Dining → Corner → Door

MAIS :

👉 il n’avance QUE si :

il n’est pas vu
un roll interne réussit
🧠 Diagramme logique :
        NOT WATCHED?
             │
        ┌────┴────┐
        │         │
       NO        YES
        │         │
     STOP     RANDOM CHANCE
                 │
                 ▼
         +1 PROGRESS (invisible)

👉 illusion clé : il “semble apparaître”

🦊 5. Foxy IA (système unique)

Foxy n’utilise PAS de path normal.

📊 Système en 4 étapes :
[Stage 0] Hidden (Curtain)
[Stage 1] Peeking
[Stage 2] Leaving Cove
[Stage 3] Running → Office
⚙️ Diagramme réel :
IF NOT WATCHED:
    stage += random progression

IF WATCHED:
    stage stabilise ou recule

IF stage == 3:
    RUN ATTACK
🎭 Particularité
Surveillance = ralentit Foxy
Absence = accélère Foxy

👉 c’est une mécanique de pression attentionnelle

🚪 6. Système de kill (tous animatroniques)
IF animatronic at door:
    IF door OPEN:
        → JUMPSCARE

Diagramme :

[At Door]
     │
     ▼
Door Closed? ── YES → Safe
     │
     NO
     ▼
💀 JUMPSCARE
🔋 7. Système global de tension (power)
Power drain = base
+ caméra usage
+ portes fermées

Diagramme :

Actions player
     │
     ▼
+ surveillance
+ défense
+ sécurité
     │
     ▼
POWER ↓↓↓
     │
     ▼
FORCED VULNERABILITY
🧩 8. Résumé mental (le vrai “AI system”)
         ┌───────────────┐
         │   PLAYER      │
         └──────┬────────┘
                │
   ┌────────────┼────────────┐
   ▼            ▼            ▼
CAMERAS     DOORS        POWER
   │            │            │
   ▼            ▼            ▼
LIMIT INFO   RISK/SAFE   TIMER LOSS

        ▲
        │
  RANDOMIZED ANIMATRONICS
 (Bonnie / Chica / Freddy / Foxy)
🎮 Conclusion

Le système des IA de FNAF1 n’est pas une IA classique :

👉 c’est une machine à états + probabilités + règles asymétriques

Et le génie de Scott Cawthon est ici :

Bonnie/Chica = pression constante
Freddy = paranoia invisible
Foxy = punition de l’inattention
joueur = gestion d’information incomplète

// Simplified FNAF1-like probabilistic AI (educational recreation)
// Single-file playable simulation (browser console + minimal UI)

/*
HOW TO RUN:
- Paste into an HTML file inside <script>
- Open in browser
- Use buttons to simulate cameras and doors
*/

const game = {
  hour: 0,
  power: 100,
  camera: null,
  timeTick: 0,
  gameOver: false,

  animatronics: {
    bonnie: { pos: 0, ai: 3 },
    chica: { pos: 0, ai: 3 },
    freddy: { pos: 0, ai: 1, progress: 0 },
    foxy: { stage: 0, ai: 2, cooldown: 0 }
  }
};

const rooms = ["Stage", "Dining", "Hall", "Corner", "Door"];

function log(msg) {
  console.log(msg);
}

function rand(n) {
  return Math.random() * n;
}

function updateAI() {
  const hourMultiplier = [1, 2, 4, 6, 8, 10][game.hour] || 10;

  for (let name in game.animatronics) {
    let a = game.animatronics[name];

    if (name === "foxy") {
      updateFoxy(a, hourMultiplier);
      continue;
    }

    if (name === "freddy") {
      updateFreddy(a, hourMultiplier);
      continue;
    }

    // Bonnie / Chica
    if (Math.random() < (a.ai * hourMultiplier) / 200) {
      if (!isWatched(name)) {
        a.pos = Math.min(a.pos + 1, rooms.length - 1);
        log(`${name} moved to ${rooms[a.pos]}`);
      }
    }

    if (a.pos === rooms.length - 1) {
      attemptAttack(name, a);
    }
  }
}

function updateFreddy(a, mult) {
  if (isWatched("freddy")) return;

  if (Math.random() < (a.ai * mult) / 500) {
    a.progress++;
    log(`Freddy laughs... (${a.progress})`);

    if (a.progress > 5) {
      a.pos = rooms.length - 1;
    }
  }
}

function updateFoxy(a, mult) {
  if (game.camera === "foxy") {
    a.stage = Math.max(0, a.stage - 1);
    return;
  }

  if (a.cooldown-- > 0) return;

  if (Math.random() < (a.ai * mult) / 300) {
    a.stage++;
    log(`Foxy stage ${a.stage}`);

    if (a.stage >= 3) {
      log("Foxy runs!");
      attemptAttack("foxy", a);
      a.stage = 0;
      a.cooldown = 10;
    }
  }
}

function isWatched(name) {
  return game.camera === name;
}

function attemptAttack(name, a) {
  const chance = 0.2 + game.hour * 0.1;

  if (!doorClosed()) {
    if (Math.random() < chance) {
      gameOver(name);
    }
  }
}

function doorClosed() {
  return game.door === true;
}

function gameOver(name) {
  game.gameOver = true;
  log(`💀 ${name} killed you! Game Over.`);
  clearInterval(loop);
}

function updatePower() {
  let drain = 0.05;

  if (game.camera) drain += 0.1;
  if (game.door) drain += 0.2;

  game.power -= drain;

  if (game.power <= 0) {
    log("⚡ Power out...");
    gameOver("darkness");
  }
}

function updateTime() {
  game.timeTick++;

  if (game.timeTick % 60 === 0) {
    game.hour++;
    log(`🕐 Hour ${game.hour}`);

    if (game.hour >= 6) {
      log("You survived!");
      clearInterval(loop);
    }
  }
}

function tick() {
  if (game.gameOver) return;

  updateAI();
  updatePower();
  updateTime();

  console.log(`Power: ${game.power.toFixed(1)}%`);
}

// Controls (simple simulation)

function setCamera(cam) {
  game.camera = cam;
  log(`📷 Camera: ${cam}`);
}

function toggleDoor() {
  game.door = !game.door;
  log(`🚪 Door: ${game.door ? "CLOSED" : "OPEN"}`);
}

// Start game loop
const loop = setInterval(tick, 1000);

// Expose controls
window.game = game;
window.setCamera = setCamera;
window.toggleDoor = toggleDoor;

log("FNAF-like simulation started. Use setCamera('bonnie/chica/freddy/foxy') or toggleDoor()");
