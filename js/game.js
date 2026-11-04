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
    
    if (k === 'q') {
        if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) {
            if (typeof closeAllModals === 'function') closeAllModals();
        } else if (typeof toggleNearestPropDetails === 'function') {
            toggleNearestPropDetails();
        }
    }

    if (k === 'escape') {
        if (typeof closeAllModals === 'function') closeAllModals();
        if (typeof closePropDetailsModal === 'function') closePropDetailsModal();
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

    const btnCloseCard = document.getElementById('btn-close-prop-card');
    if (btnCloseCard) {
        btnCloseCard.addEventListener('click', closePropDetailsModal);
    }
}

// Helper: Convert screen pointer coordinates to world game coordinates with exact scaling & camera zoom
function getPointerWorldPos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;

    const cam = (window.camera && typeof window.camera.zoom === 'number')
        ? window.camera
        : { x: 560, y: 380, zoom: 1 };

    const worldX = (canvasX - canvas.width / 2) / cam.zoom + cam.x;
    const worldY = (canvasY - canvas.height / 2) / cam.zoom + cam.y;
    return { worldX, worldY };
}

// Canvas Click-to-Walk / Pointer Interaction
function initCanvasPointer() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;

    let isPointerDragging = false;

    function handlePointer(e, isInitialClick = false) {
        if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) return;
        const { worldX, worldY } = getPointerWorldPos(canvas, e);
        const clampedX = Math.max(45, Math.min(1145, worldX));
        const clampedY = Math.max(55, Math.min(705, worldY));

        if (isInitialClick) {
            let clickedObj = null;
            if (typeof OBJECTS !== 'undefined') {
                for (const obj of OBJECTS) {
                    if (Math.hypot(worldX - obj.x, worldY - obj.y) <= obj.radius + 18) {
                        clickedObj = obj;
                        break;
                    }
                }
            }

            let clickedNPC = null;
            if (!clickedObj && typeof CREW_NPCS !== 'undefined') {
                for (const npc of CREW_NPCS) {
                    if (Math.hypot(worldX - npc.x, worldY - npc.y) <= 38) {
                        clickedNPC = npc;
                        break;
                    }
                }
            }

            if (clickedObj) {
                if (Math.hypot(state.player.x - clickedObj.x, state.player.y - clickedObj.y) <= clickedObj.radius + 40) {
                    state.player.targetX = null;
                    state.player.targetY = null;
                    state.player.targetAction = null;
                    if (typeof unlockFact === 'function') unlockFact(clickedObj.factId);
                    if (typeof openObjectModal === 'function') openObjectModal(clickedObj);
                    if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
                    return;
                } else {
                    state.player.targetX = clickedObj.x;
                    state.player.targetY = clickedObj.y;
                    state.player.targetAction = { type: 'object', target: clickedObj };
                    if (typeof spawnClickMarker === 'function') spawnClickMarker(clickedObj.x, clickedObj.y, '#38bdf8');
                    if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
                    return;
                }
            }

            if (clickedNPC) {
                if (Math.hypot(state.player.x - clickedNPC.x, state.player.y - clickedNPC.y) <= 65) {
                    state.player.targetX = null;
                    state.player.targetY = null;
                    state.player.targetAction = null;
                    if (clickedNPC.dialogues && typeof startDialogueSequence === 'function') {
                        startDialogueSequence(clickedNPC.dialogues, state.chapterIdx);
                    }
                    if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
                    return;
                } else {
                    state.player.targetX = clickedNPC.x;
                    state.player.targetY = clickedNPC.y;
                    state.player.targetAction = { type: 'npc', target: clickedNPC };
                    if (typeof spawnClickMarker === 'function') spawnClickMarker(clickedNPC.x, clickedNPC.y, '#22c55e');
                    if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
                    return;
                }
            }

            // Normal ground waypoint click
            if (typeof spawnClickMarker === 'function') spawnClickMarker(clampedX, clampedY, '#38bdf8');
            if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
        }

        state.player.targetX = clampedX;
        state.player.targetY = clampedY;
        state.player.targetAction = null;
    }

    canvas.addEventListener('pointerdown', (e) => {
        isPointerDragging = true;
        handlePointer(e, true);
    });

    window.addEventListener('pointermove', (e) => {
        if (isPointerDragging) {
            handlePointer(e, false);
        } else {
            // Hover cursor check
            if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) {
                canvas.style.cursor = 'default';
                return;
            }
            const { worldX, worldY } = getPointerWorldPos(canvas, e);
            let hover = false;
            if (typeof OBJECTS !== 'undefined') {
                for (const obj of OBJECTS) {
                    if (Math.hypot(worldX - obj.x, worldY - obj.y) <= obj.radius + 15) {
                        hover = true;
                        break;
                    }
                }
            }
            if (!hover && typeof CREW_NPCS !== 'undefined') {
                for (const npc of CREW_NPCS) {
                    if (Math.hypot(worldX - npc.x, worldY - npc.y) <= 35) {
                        hover = true;
                        break;
                    }
                }
            }
            canvas.style.cursor = hover ? 'pointer' : 'crosshair';
        }
    });

    window.addEventListener('pointerup', () => { isPointerDragging = false; });
    window.addEventListener('pointercancel', () => { isPointerDragging = false; });
}

// --- HABITAT SOLID COLLISION DETECTOR ---
// Prevents walking through regolith walls, central master consoles, and perimeter machinery.
function checkSolidCollision(px, py, radius = 13) {
    // 1. Solid Regolith Habitat Walls
    if (typeof HABITAT_WALLS !== 'undefined') {
        for (let i = 0; i < HABITAT_WALLS.length; i++) {
            const w = HABITAT_WALLS[i];
            if (px + radius > w.x && px - radius < w.x + w.w &&
                py + radius > w.y && py - radius < w.y + w.h) {
                return true;
            }
        }
    }

    // 2. Central Master Consoles (Solid Desk & Plinth Foundations)
    if (typeof OBJECTS !== 'undefined') {
        for (let i = 0; i < OBJECTS.length; i++) {
            const obj = OBJECTS[i];
            let cw = 26;
            let ch = 18;
            if (obj.id === 'mars_rover') { cw = 40; ch = 28; }
            else if (obj.id === 'solar_array_eva') { cw = 26; ch = 26; }
            else if (obj.id === 'storage_locker') { cw = 26; ch = 18; }

            if (px + radius > obj.x - cw / 2 && px - radius < obj.x + cw / 2 &&
                py + radius > obj.y - ch / 2 && py - radius < obj.y + ch / 2) {
                return true;
            }
        }
    }

    // 3. Perimeter Machinery & Cubicle Hardware Props
    if (typeof HABITAT_PROPS !== 'undefined') {
        for (let i = 0; i < HABITAT_PROPS.length; i++) {
            const p = HABITAT_PROPS[i];
            if (px + radius > p.x - p.w / 2 && px - radius < p.x + p.w / 2 &&
                py + radius > p.y - p.h / 2 && py - radius < p.y + p.h / 2) {
                return true;
            }
        }
    }

    return false;
}

// Backward-compatible alias for existing callers
function checkWallCollision(px, py, radius = 13) {
    return checkSolidCollision(px, py, radius);
}

// --- NASA HARDWARE PROP DETAILS CARD (Q KEY INSPECTOR) ---
window.activePropInspectionTarget = null;

function toggleNearestPropDetails() {
    const card = document.getElementById('hud-prop-card');
    if (card && !card.classList.contains('hidden')) {
        closePropDetailsModal();
        return;
    }

    if (typeof HABITAT_PROPS === 'undefined' || !state || !state.player) return;

    let nearestProp = null;
    let minDist = 48;
    for (let i = 0; i < HABITAT_PROPS.length; i++) {
        const p = HABITAT_PROPS[i];
        const d = Math.hypot(state.player.x - p.x, state.player.y - p.y);
        if (d < minDist) {
            minDist = d;
            nearestProp = p;
        }
    }

    if (nearestProp) {
        showPropDetailsCard(nearestProp);
    }
}
window.toggleNearestPropDetails = toggleNearestPropDetails;

function showPropDetailsCard(prop) {
    const card = document.getElementById('hud-prop-card');
    if (!card) return;

    window.activePropInspectionTarget = prop;

    const refEl = document.getElementById('prop-card-ref');
    const statEl = document.getElementById('prop-card-status');
    const titleEl = document.getElementById('prop-card-title');
    const descEl = document.getElementById('prop-card-desc');

    if (refEl) refEl.textContent = prop.refCode || 'NASA-STD-SPEC';
    if (statEl) {
        statEl.textContent = '● ' + (prop.status || 'NOMINAL').toUpperCase();
        if ((prop.status || '').toLowerCase().includes('optimal') || (prop.status || '').toLowerCase().includes('nominal')) {
            statEl.className = 'text-[10px] font-mono-tech text-emerald-400 font-bold';
        } else {
            statEl.className = 'text-[10px] font-mono-tech text-amber-400 font-bold';
        }
    }
    if (titleEl) {
        titleEl.innerHTML = `<i class="fa-solid fa-microchip text-sky-400 text-xs"></i> <span>${prop.name}</span>`;
    }
    if (descEl) descEl.textContent = prop.info || 'NASA standard pressurized habitat life-support subsystem.';

    card.classList.remove('hidden');
    if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
}
window.showPropDetailsCard = showPropDetailsCard;

function closePropDetailsModal() {
    const card = document.getElementById('hud-prop-card');
    if (card) card.classList.add('hidden');
    window.activePropInspectionTarget = null;
}
window.closePropDetailsModal = closePropDetailsModal;

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

        // Check if approaching an intentional target action (console or crew)
        if (state.player.targetAction) {
            const act = state.player.targetAction;
            if (act.type === 'object') {
                const objDist = Math.hypot(state.player.x - act.target.x, state.player.y - act.target.y);
                if (objDist <= act.target.radius + 36) {
                    state.player.targetX = null;
                    state.player.targetY = null;
                    state.player.targetAction = null;
                    if (typeof unlockFact === 'function') unlockFact(act.target.factId);
                    if (typeof openObjectModal === 'function') openObjectModal(act.target);
                    if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
                    return;
                }
            } else if (act.type === 'npc') {
                const npcDist = Math.hypot(state.player.x - act.target.x, state.player.y - act.target.y);
                if (npcDist <= 65) {
                    state.player.targetX = null;
                    state.player.targetY = null;
                    state.player.targetAction = null;
                    if (act.target.dialogues && typeof startDialogueSequence === 'function') {
                        startDialogueSequence(act.target.dialogues, state.chapterIdx);
                    }
                    if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
                    return;
                }
            }
        }

        if (dist > 5) {
            dx = tx / dist;
            dy = ty / dist;
            if (Math.abs(dx) > 0.15) state.player.facing = dx > 0 ? 'right' : 'left';
        } else {
            state.player.targetX = null;
            state.player.targetY = null;
            state.player.targetAction = null;
        }
    } else if (dx !== 0 || dy !== 0) {
        state.player.targetX = null;
        state.player.targetY = null;
        state.player.targetAction = null;
        const len = Math.hypot(dx, dy);
        dx /= len;
        dy /= len;
    }

    // Apply movement with axis-independent sliding collision against 3D-printed regolith walls
    const moveX = dx * state.player.speed * dt;
    const moveY = dy * state.player.speed * dt;

    if (moveX !== 0) {
        const nextX = Math.max(45, Math.min(1145, state.player.x + moveX));
        if (!checkWallCollision(nextX, state.player.y)) {
            state.player.x = nextX;
        } else if (state.player.targetX !== null) {
            state.player.targetX = null;
        }
    }

    if (moveY !== 0) {
        const nextY = Math.max(55, Math.min(705, state.player.y + moveY));
        if (!checkWallCollision(state.player.x, nextY)) {
            state.player.y = nextY;
        } else if (state.player.targetY !== null) {
            state.player.targetY = null;
        }
    }

    const isMoving = (dx !== 0 || dy !== 0);
    state.player.isMoving = isMoving;

    // Visual Upgrade 4: Fading Regolith Bootprints (rust-orange outside, slate inside)
    if (isMoving && typeof footprints !== 'undefined') {
        state.player.footstepTimer = (state.player.footstepTimer || 0) + dt;
        if (state.player.footstepTimer > 0.16) {
            state.player.footstepTimer = 0;
            const isOutdoor = (state.player.x <= 285);
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
    if (state.player.x <= 285 && !state.player.inSuit) {
        state.player.inSuit = true;
        if (typeof triggerCameraShake === 'function') triggerCameraShake(2.5);
        if (window.sfx && typeof sfx.pickup === 'function') sfx.pickup();
        if (typeof unlockFact === 'function') unlockFact('airlock_pressure');
        setAria("Airlock Interlock: EVA Spacesuit automatically donned and pressurized to 30 kPa pure O₂ for Martian surface excursion (0.6 kPa exterior).");
        if (typeof updateUI === 'function') updateUI();
    } else if (state.player.x >= 415 && state.player.inSuit) {
        // Returning to Central Spine stows the EVA suit
        state.player.inSuit = false;
        if (typeof triggerCameraShake === 'function') triggerCameraShake(2.0);
        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
        setAria("Airlock Equalization Complete: Returned to 101.3 kPa shirtsleeve IVA habitat environment. EVA suit stowed in Airlock.");
        if (typeof updateUI === 'function') updateUI();
    }

    // Visual Upgrade 4: Camera Shake on Dust Storm Wind Peaks
    if (state.faults && state.faults.dustStormActive && state.player.x <= 285) {
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

    // Floating interaction prompt: Visible in both 2D and 3D mode for maximum clarity
    if (promptEl && titleEl && subEl) {
        if (nearestObj) {
            promptEl.classList.remove('hidden');
            titleEl.textContent = nearestObj.name;
            subEl.textContent = 'Click or Press [E] to interact';
        } else if (nearestNPC) {
            promptEl.classList.remove('hidden');
            titleEl.textContent = `Talk to ${nearestNPC.name} (${nearestNPC.role})`;
            subEl.textContent = 'Click or Press [E] for Crew Dialogue';
        } else {
            promptEl.classList.add('hidden');
        }
    }

    // Auto-close prop details card if player walks away
    if (window.activePropInspectionTarget && state && state.player) {
        const d = Math.hypot(state.player.x - window.activePropInspectionTarget.x, state.player.y - window.activePropInspectionTarget.y);
        if (d > 55) {
            closePropDetailsModal();
        }
    }
}

// --- MAIN LOOP ---
let lastTime = performance.now();

function gameLoop(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    updateGame(dt);
    if (window.currentViewMode === '3d' && typeof renderGame3D === 'function') {
        renderGame3D(now);
    } else if (typeof renderGame === 'function') {
        renderGame(now);
    }
    requestAnimationFrame(gameLoop);
}

// --- BOOTSTRAP INITIALIZATION ---
function initGame() {
    window.currentViewMode = '3d';
    initTouchControls();
    initCanvasPointer();
    if (typeof initThreeScene === 'function') initThreeScene();
    if (typeof onThreeResize === 'function') onThreeResize();
    if (typeof resizeCanvas === 'function') resizeCanvas();
    if (typeof loadChapter === 'function') loadChapter(0, true);
    requestAnimationFrame(gameLoop);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

