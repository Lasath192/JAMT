/**
 * ASTRA-1: The Red Frontier - Main Game Loop, Input Controller & Player Physics
 * 2026 NASA Space Apps Challenge
 */

// --- INPUT STATE & LISTENERS ---
const keys = { up: false, down: false, left: false, right: false };

window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup') { keys.up = true; if (state.player) state.player.targetX = null; }
    if (k === 's' || k === 'arrowdown') { keys.down = true; if (state.player) state.player.targetX = null; }
    if (k === 'a' || k === 'arrowleft') { keys.left = true; if (state.player) state.player.targetX = null; }
    if (k === 'd' || k === 'arrowright') { keys.right = true; if (state.player) state.player.targetX = null; }
    
    if (k === 'e') {
        const dlgModal = document.getElementById('modal-dialogue');
        if (dlgModal && !dlgModal.classList.contains('hidden')) {
            if (typeof advanceDialogueStep === 'function') advanceDialogueStep();
            return;
        }
        if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) return;
        if (typeof triggerNearestObjectInteraction === 'function') triggerNearestObjectInteraction();
    }
    
    if (k === 'escape' || (k === 'q' && typeof isAnyModalOpen === 'function' && isAnyModalOpen())) {
        if (typeof closeAllModals === 'function') closeAllModals();
    }
});

window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup') keys.up = false;
    if (k === 's' || k === 'arrowdown') keys.down = false;
    if (k === 'a' || k === 'arrowleft') keys.left = false;
    if (k === 'd' || k === 'arrowright') keys.right = false;
});

// Mobile Touch D-Pad Binding
function initTouchControls() {
    document.querySelectorAll('.dpad-btn').forEach(btn => {
        const dir = btn.dataset.dir;
        const start = (ev) => {
            ev.preventDefault();
            keys[dir] = true;
            if (state.player) state.player.targetX = null;
        };
        const end = (ev) => {
            ev.preventDefault();
            keys[dir] = false;
        };
        btn.addEventListener('touchstart', start, { passive: false });
        btn.addEventListener('touchend', end, { passive: false });
        btn.addEventListener('mousedown', start);
        btn.addEventListener('mouseup', end);
        btn.addEventListener('mouseleave', end);
    });

    const btnTouchE = document.getElementById('btn-touch-e');
    if (btnTouchE) {
        btnTouchE.addEventListener('click', () => {
            if (typeof isAnyModalOpen === 'function' && !isAnyModalOpen()) {
                if (typeof triggerNearestObjectInteraction === 'function') triggerNearestObjectInteraction();
            }
        });
    }
}

// Canvas Click-to-Walk / Pointer Interaction
function initCanvasPointer() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;

    canvas.addEventListener('pointerdown', (e) => {
        if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) return;
        const rect = canvas.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const cam = window.camera || { x: 560, y: 380, zoom: 1 };
        const worldX = (sx - canvas.width / 2) / cam.zoom + cam.x;
        const worldY = (sy - canvas.height / 2) / cam.zoom + cam.y;

        // Check if player clicked directly on an interactive console
        if (typeof OBJECTS !== 'undefined') {
            for (const obj of OBJECTS) {
                if (Math.hypot(worldX - obj.x, worldY - obj.y) <= obj.radius) {
                    if (Math.hypot(state.player.x - obj.x, state.player.y - obj.y) <= obj.radius + 35) {
                        if (typeof triggerNearestObjectInteraction === 'function') triggerNearestObjectInteraction();
                        return;
                    }
                }
            }
        }

        // Check if player clicked directly on a crew NPC
        if (typeof CREW_NPCS !== 'undefined') {
            for (const npc of CREW_NPCS) {
                if (Math.hypot(worldX - npc.x, worldY - npc.y) <= 36) {
                    if (Math.hypot(state.player.x - npc.x, state.player.y - npc.y) <= 75) {
                        if (typeof triggerNearestObjectInteraction === 'function') triggerNearestObjectInteraction();
                        return;
                    }
                }
            }
        }

        // Otherwise walk to clicked point
        state.player.targetX = Math.max(45, Math.min(1145, worldX));
        state.player.targetY = Math.max(55, Math.min(705, worldY));
    });
}

// --- GAME LOGIC UPDATE ---
function updateGame(dt) {
    if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) return;
    if (!state.player) return;

    let dx = 0;
    let dy = 0;
    if (keys.up) dy -= 1;
    if (keys.down) dy += 1;
    if (keys.left) { dx -= 1; state.player.facing = 'left'; }
    if (keys.right) { dx += 1; state.player.facing = 'right'; }

    // Click-to-walk pathing if no keyboard input active
    if (dx === 0 && dy === 0 && state.player.targetX !== null) {
        const tx = state.player.targetX - state.player.x;
        const ty = state.player.targetY - state.player.y;
        const dist = Math.hypot(tx, ty);
        if (dist > 6) {
            dx = tx / dist;
            dy = ty / dist;
            if (Math.abs(dx) > 0.2) state.player.facing = dx > 0 ? 'right' : 'left';
        } else {
            state.player.targetX = null;
            state.player.targetY = null;
        }
    } else if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        dx /= len;
        dy /= len;
    }

    // Apply movement within boundaries
    const nextX = state.player.x + dx * state.player.speed * dt;
    const nextY = state.player.y + dy * state.player.speed * dt;
    state.player.x = Math.max(45, Math.min(1145, nextX));
    state.player.y = Math.max(55, Math.min(705, nextY));

    const isMoving = (dx !== 0 || dy !== 0);
    state.player.isMoving = isMoving;

    // Visual Upgrade 4: Fading Regolith Bootprints (rust-orange outside, slate inside)
    if (isMoving && typeof footprints !== 'undefined') {
        state.player.footstepTimer = (state.player.footstepTimer || 0) + dt;
        if (state.player.footstepTimer > 0.16) {
            state.player.footstepTimer = 0;
            const isOutdoor = (state.player.x < 282 || state.player.x > 422);
            footprints.push({
                x: state.player.x,
                y: state.player.y + 11,
                color: isOutdoor ? '#c2410c' : '#64748b',
                alpha: 0.85,
                angle: state.player.facing === 'left' ? Math.PI : 0
            });
            if (footprints.length > 60) footprints.shift();
        }
    }

    // AUTOMATED AIRLOCK EVA SUIT INTERLOCK RULE:
    // Crossing outer EVA hatch (x <= 282) equips & pressurizes suit.
    if (state.player.x <= 282 && !state.player.inSuit) {
        state.player.inSuit = true;
        if (typeof triggerCameraShake === 'function') triggerCameraShake(2.5);
        if (window.sfx && typeof sfx.pickup === 'function') sfx.pickup();
        if (typeof unlockFact === 'function') unlockFact('airlock_pressure');
        setAria("Airlock Interlock: EVA Spacesuit automatically donned and pressurized to 30 kPa pure O₂ for Martian surface excursion (0.6 kPa exterior).");
        if (typeof updateUI === 'function') updateUI();
    } else if (state.player.x > 422 && state.player.inSuit) {
        // Returning to Central Spine stows the EVA suit
        state.player.inSuit = false;
        if (typeof triggerCameraShake === 'function') triggerCameraShake(2.0);
        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
        setAria("Airlock Equalization Complete: Returned to 101.3 kPa shirtsleeve IVA habitat environment. EVA suit stowed in Airlock.");
        if (typeof updateUI === 'function') updateUI();
    }

    // Visual Upgrade 4: Camera Shake on Dust Storm Wind Peaks
    if (state.faults && state.faults.dustStormActive && state.player.x < 282) {
        if (Math.random() < 0.008 && typeof triggerCameraShake === 'function') {
            triggerCameraShake(3.0);
        }
    }

    // Environmental Audio & Footsteps
    if (typeof ROOMS !== 'undefined' && window.sfx && typeof sfx.updateEnvironmentAudio === 'function') {
        const currentRoom = ROOMS.find(r =>
            state.player.x >= r.x && state.player.x <= r.x + r.w &&
            state.player.y >= r.y && state.player.y <= r.y + r.h
        );
        const isMoving = (dx !== 0 || dy !== 0);
        sfx.updateEnvironmentAudio(
            currentRoom ? currentRoom.id : 'corridor',
            state.faults.dustStormActive,
            isMoving,
            performance.now()
        );
    }

    // Smooth camera follow
    const cam = window.camera || { x: 560, y: 380, zoom: 1 };
    cam.x += (state.player.x - cam.x) * 0.08;
    cam.y += (state.player.y - cam.y) * 0.08;
    window.camera = cam;

    // Floating interaction prompt update
    const nearestObj = (typeof getNearestObject === 'function') ? getNearestObject() : null;
    const nearestNPC = (typeof getNearestCrewNPC === 'function') ? getNearestCrewNPC() : null;
    const promptEl = document.getElementById('interact-prompt');
    const titleEl = document.getElementById('interact-title');
    const subEl = document.getElementById('interact-sub');

    if (promptEl && titleEl && subEl) {
        if (nearestObj) {
            promptEl.classList.remove('hidden');
            titleEl.textContent = nearestObj.name;
            subEl.textContent = 'Click or Press [E] to operate';
        } else if (nearestNPC) {
            promptEl.classList.remove('hidden');
            titleEl.textContent = `Talk to ${nearestNPC.name} (${nearestNPC.role})`;
            subEl.textContent = 'Click or Press [E] for Crew Story Dialogue';
        } else {
            promptEl.classList.add('hidden');
        }
    }
}

// --- MAIN LOOP ---
let lastTime = performance.now();

function gameLoop(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    updateGame(dt);
    if (typeof renderGame === 'function') renderGame(now);
    requestAnimationFrame(gameLoop);
}

// --- BOOTSTRAP INITIALIZATION ---
function initGame() {
    initTouchControls();
    initCanvasPointer();
    if (typeof resizeCanvas === 'function') resizeCanvas();
    if (typeof loadChapter === 'function') loadChapter(0, true);
    requestAnimationFrame(gameLoop);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

