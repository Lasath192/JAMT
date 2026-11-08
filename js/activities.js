/**
 * ASTRA-1: The Red Frontier - Interactive Astronaut Activities & Mini-Games Engine
 * 2026 NASA Space Apps Challenge
 * 
 * Replaces passive pop-up buttons with hands-on, educational, physical simulation mini-activities:
 * - Rotary Valves (airlock cycling, water valves, depressurization)
 * - Power & Light Sliders (5 kW grow light system, flow regulators)
 * - Drag and Drop (tools, canisters, suit components, fuses, regolith blocks, crops, logbook files)
 * - Cable & Terminal Connections (circuit box wiring, polarities)
 * - Hold-to-Operate Controls (flush pumps, alarms, telemetry reboots, laser scans)
 * - Multi-Step Sequences (startup switches, keypad codes, procedure orders)
 * - Visual Scanners & Spectrometers (crop chlorosis scanner, rover subsystems, Raman spectrum matching)
 */

window.AstraActivities = (function () {
    'use strict';

    // Track completed activities in session for bonus scoring
    const activityState = {
        scores: {},
        activeTaskId: null
    };

    /**
     * Helper to safely play SFX if available
     */
    function playSfx(name) {
        if (typeof window.sfx !== 'undefined' && typeof window.sfx[name] === 'function') {
            window.sfx[name]();
        }
    }

    /**
     * Provide ARIA audio/visual companion hint
     */
    function setCompanionHint(text) {
        if (typeof window.setAria === 'function') {
            window.setAria(text);
        }
    }

    /**
     * Creates an activity header with step instructions and ARIA tip
     */
    function createActivityHeader(title, stepText, ariaHint) {
        return `
            <div class="bg-gradient-to-r from-slate-900 via-sky-950/60 to-slate-900 border border-sky-500/40 rounded-xl p-3 mb-3 shadow-md">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-[10px] font-mono-tech uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
                        <i class="fa-solid fa-gamepad text-amber-400"></i>
                        <span>${title}</span>
                    </span>
                    <span class="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold">
                        INTERACTIVE SIMULATION
                    </span>
                </div>
                <p class="text-xs text-slate-100 font-medium leading-relaxed">${stepText}</p>
                ${ariaHint ? `
                    <div class="mt-2 pt-2 border-t border-sky-500/20 text-[11px] text-amber-300 flex items-center gap-1.5 font-mono-tech">
                        <i class="fa-solid fa-robot text-sky-400"></i>
                        <span>ARIA: "${ariaHint}"</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Creates a success celebration banner shown upon completing the mini-activity
     */
    function showActivitySuccess(container, taskId, successTitle, successExplanation, onDone) {
        playSfx('success');
        if (typeof window.spawnFloatingText === 'function' && window.state && window.state.player) {
            window.spawnFloatingText('★ PROCEDURE COMPLETE! ★', window.state.player.x, window.state.player.y - 25, '#22c55e');
        }

        container.innerHTML = `
            <div class="bg-emerald-950/70 border-2 border-emerald-400/80 rounded-2xl p-4 text-center animate-fade-in space-y-3 shadow-2xl">
                <div class="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 text-xl shadow-lg">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <div>
                    <span class="text-[10px] font-mono-tech uppercase tracking-widest text-emerald-400 font-bold">TASK VERIFICATION COMPLETE</span>
                    <h4 class="text-base font-bold font-display text-white mt-0.5">${successTitle}</h4>
                </div>
                <div class="bg-slate-900/80 border border-emerald-500/40 rounded-xl p-3 text-xs text-slate-200 leading-relaxed text-left">
                    <strong class="text-emerald-400 block mb-1 font-mono-tech text-[10px] uppercase">Scientific & Operational Takeaway:</strong>
                    ${successExplanation}
                </div>
                <div class="pt-2">
                    <button id="btn-activity-proceed" class="btn-tech bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-2 rounded-xl text-xs sm:text-sm font-display flex items-center justify-center gap-2 mx-auto shadow-lg shadow-emerald-500/30 cursor-pointer">
                        <span>CONFIRM & RETURN TO OUTPOST</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        const btn = container.querySelector('#btn-activity-proceed');
        if (btn) {
            btn.addEventListener('click', () => {
                if (typeof onDone === 'function') onDone();
            });
        }
    }

    /* =========================================================================
     * MISSION 1: THE FIRST BREATH (Sol 1–2)
     * ========================================================================= */

    // Task 1: Cycle Airlock Pressure (Rotary Valve + Needle Gauge to 101.3 kPa)
    function renderM1T1_AirlockPressure(container, onComplete) {
        let currentKPa = 0.6;
        const targetKPa = 101.3;
        let isDone = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Airlock Depress/Pressurize System',
                'Click and drag the rotary brass valve wheel clockwise to pressurize the chamber from 0.6 kPa up to nominal habitat pressure (101.3 kPa). Equalizing pressure unlocks the inner hatch.',
                'Rotate the valve clockwise until the gauge needle settles inside the green 101.3 kPa zone!'
            )}
            <div class="bg-slate-950/90 border border-sky-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-around gap-6">
                <!-- Analog Gauge -->
                <div class="flex flex-col items-center">
                    <div class="relative w-44 h-44 rounded-full border-4 border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 shadow-inner flex items-center justify-center">
                        <!-- Gauge Dial Arc Scale -->
                        <svg viewBox="0 0 100 100" class="w-full h-full absolute inset-0">
                            <!-- Background track -->
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" stroke-width="6" stroke-dasharray="188" stroke-dashoffset="47" transform="rotate(135 50 50)"/>
                            <!-- Green safe target zone around 101.3 kPa (approx 84% of 120 kPa scale) -->
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" stroke-width="6" stroke-dasharray="24" stroke-dashoffset="138" transform="rotate(135 50 50)" opacity="0.8"/>
                        </svg>
                        <!-- Gauge Needle -->
                        <div id="airlock-needle" class="absolute w-1 h-18 bg-amber-400 origin-bottom rounded-full transition-transform duration-75 shadow-[0_0_8px_#f59e0b]" style="bottom: 50%; transform: rotate(-135deg);"></div>
                        <!-- Needle Pivot Cap -->
                        <div class="w-5 h-5 rounded-full bg-slate-200 border-2 border-slate-700 z-10 shadow"></div>
                        <span class="absolute bottom-6 text-[10px] font-mono-tech text-slate-400 font-bold">kPa ATM</span>
                    </div>
                    <div class="mt-2 text-center">
                        <div id="airlock-digital-val" class="font-mono-tech font-bold text-lg text-amber-300">0.6 kPa</div>
                        <div id="airlock-status-txt" class="text-[10px] font-mono-tech text-rose-400 font-semibold">● VACUUM HAZARD</div>
                    </div>
                </div>

                <!-- Rotary Wheel Control -->
                <div class="flex flex-col items-center">
                    <div id="valve-wheel" class="w-36 h-36 rounded-full border-4 border-amber-500/80 bg-gradient-to-tr from-amber-950 via-slate-900 to-amber-900/60 shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing relative select-none hover:scale-105 transition-transform" title="Click and drag around center to rotate valve">
                        <!-- Valve Spokes -->
                        <div class="absolute w-full h-2 bg-amber-400/70 rounded"></div>
                        <div class="absolute w-2 h-full bg-amber-400/70 rounded"></div>
                        <div class="w-12 h-12 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-amber-300 text-xs font-mono-tech font-black z-10 shadow">
                            TURN
                        </div>
                    </div>
                    <div class="mt-3 flex items-center gap-2">
                        <button id="btn-turn-valve-step" class="btn-tech bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1.5 rounded-lg text-xs font-mono-tech text-slate-200 flex items-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-rotate-right text-amber-400"></i>
                            <span>Turn Valve (+15 kPa)</span>
                        </button>
                    </div>
                    <span class="text-[10px] text-slate-400 font-mono-tech mt-1">Drag wheel or click step button</span>
                </div>
            </div>
        `;

        const wheel = container.querySelector('#valve-wheel');
        const needle = container.querySelector('#airlock-needle');
        const digital = container.querySelector('#airlock-digital-val');
        const statusTxt = container.querySelector('#airlock-status-txt');
        const btnStep = container.querySelector('#btn-turn-valve-step');

        function updatePressure(newVal) {
            currentKPa = Math.max(0.6, Math.min(120.0, newVal));
            const angle = -135 + (currentKPa / 120) * 270;
            if (needle) needle.style.transform = `rotate(${angle}deg)`;
            if (digital) digital.textContent = `${currentKPa.toFixed(1)} kPa`;

            if (currentKPa >= 100.0 && currentKPa <= 103.0) {
                if (statusTxt) {
                    statusTxt.textContent = '● EQUALIZED (SAFE)';
                    statusTxt.className = 'text-[10px] font-mono-tech text-emerald-400 font-bold';
                }
                if (!isDone) {
                    isDone = true;
                    playSfx('airlockHiss');
                    if (window.state && window.state.player) {
                        window.state.cabinPressureKPa = 101.3;
                    }
                    setTimeout(() => {
                        showActivitySuccess(
                            container,
                            'ch1_airlock',
                            'Airlock Atmosphere Equalized (101.3 kPa)',
                            'Cabin atmosphere is now fully synchronized with habitat life support. Equalizing pressure prevents violent explosive decompression and allows the inner airlock hatch to safely open.',
                            onComplete
                        );
                    }, 600);
                }
            } else if (currentKPa < 100.0) {
                if (statusTxt) {
                    statusTxt.textContent = `● PRESSURIZING... (${Math.round((currentKPa / 101.3) * 100)}%)`;
                    statusTxt.className = 'text-[10px] font-mono-tech text-amber-400 font-bold';
                }
            } else {
                if (statusTxt) {
                    statusTxt.textContent = '● OVERPRESSURE WARNING';
                    statusTxt.className = 'text-[10px] font-mono-tech text-rose-400 font-bold';
                }
            }
        }

        // Rotary drag interaction
        let isDragging = false;
        let lastAngle = 0;

        function getAngle(e) {
            const rect = wheel.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
        }

        const onStart = (e) => {
            isDragging = true;
            lastAngle = getAngle(e);
        };
        const onMove = (e) => {
            if (!isDragging || isDone) return;
            const currentAngle = getAngle(e);
            let delta = currentAngle - lastAngle;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;
            lastAngle = currentAngle;
            if (Math.abs(delta) > 0.5) {
                playSfx('valveRotate');
                updatePressure(currentKPa + delta * 0.35);
            }
        };
        const onEnd = () => { isDragging = false; };

        wheel.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
        wheel.addEventListener('touchstart', onStart, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', onEnd);

        if (btnStep) {
            btnStep.addEventListener('click', () => {
                playSfx('valveRotate');
                updatePressure(currentKPa + 15.0);
            });
        }
    }

    // Task 2: Collect Multi-Tool (Drag and Drop from Storage Compartment to Astronaut Pouch)
    function renderM1T2_CollectTool(container, onComplete) {
        let toolCollected = false;
        let fuseCollected = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Central Maintenance Cache',
                'Drag the Diagnostic Multi-Tool and Spare HV Fuse from the storage locker into your astronaut pouch below.',
                'Grab each piece of equipment and drop it directly onto the pouch slots!'
            )}
            <div class="space-y-4">
                <!-- Locker Shelves -->
                <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span class="text-[10px] font-mono-tech uppercase text-slate-400 font-bold block">STORAGE LOCKER COMPARTMENT A-1</span>
                    <div id="locker-items-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div id="drag-item-tool" draggable="true" class="activity-drag-item bg-slate-900 border-2 border-amber-400/80 hover:border-amber-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-grab active:cursor-grabbing hover:scale-105 transition shadow-lg">
                            <i class="fa-solid fa-screwdriver-wrench text-amber-400 text-2xl"></i>
                            <span class="text-xs font-bold text-white font-mono-tech">Multi-Tool</span>
                            <span class="text-[9px] text-slate-400">Diagnostic Wand</span>
                        </div>
                        <div id="drag-item-fuse" draggable="true" class="activity-drag-item bg-slate-900 border-2 border-yellow-400/80 hover:border-yellow-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-grab active:cursor-grabbing hover:scale-105 transition shadow-lg">
                            <i class="fa-solid fa-bolt text-yellow-300 text-2xl"></i>
                            <span class="text-xs font-bold text-white font-mono-tech">Spare HV Fuse</span>
                            <span class="text-[9px] text-slate-400">50A Ceramic</span>
                        </div>
                        <div class="bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl flex flex-col items-center justify-center gap-1 opacity-50 select-none">
                            <i class="fa-solid fa-tape text-slate-600 text-xl"></i>
                            <span class="text-[10px] text-slate-500 font-mono-tech">Kapton Tape</span>
                        </div>
                    </div>
                </div>

                <!-- Drop Target: Astronaut Pouch -->
                <div id="pouch-drop-zone" class="bg-sky-950/30 border-2 border-dashed border-sky-400/60 hover:border-sky-300 p-4 rounded-xl transition flex flex-col items-center justify-center gap-2 text-center min-h-[100px]">
                    <div class="flex items-center gap-2 text-sky-300 font-mono-tech text-xs font-bold">
                        <i class="fa-solid fa-briefcase"></i>
                        <span>ASTRONAUT EQUIPMENT POUCH (DROP HERE)</span>
                    </div>
                    <div id="pouch-staged-items" class="flex items-center gap-3">
                        <span class="text-[11px] text-slate-400">Drag equipment into pouch or click item to equip</span>
                    </div>
                </div>
            </div>
        `;

        const toolEl = container.querySelector('#drag-item-tool');
        const fuseEl = container.querySelector('#drag-item-fuse');
        const dropZone = container.querySelector('#pouch-drop-zone');
        const stagedZone = container.querySelector('#pouch-staged-items');

        function equipItem(itemName) {
            playSfx('pickup');
            if (typeof window.addItem === 'function') window.addItem(itemName);

            if (itemName === 'Multi-Tool') {
                toolCollected = true;
                if (toolEl) toolEl.style.display = 'none';
            }
            if (itemName === 'HV Fuse') {
                fuseCollected = true;
                if (fuseEl) fuseEl.style.display = 'none';
            }

            stagedZone.innerHTML = '';
            if (toolCollected) {
                stagedZone.innerHTML += `<span class="bg-amber-500/20 text-amber-300 border border-amber-400/50 px-2.5 py-1 rounded-lg font-mono-tech text-xs flex items-center gap-1.5"><i class="fa-solid fa-check text-emerald-400"></i> Multi-Tool</span>`;
            }
            if (fuseCollected) {
                stagedZone.innerHTML += `<span class="bg-yellow-500/20 text-yellow-300 border border-yellow-400/50 px-2.5 py-1 rounded-lg font-mono-tech text-xs flex items-center gap-1.5"><i class="fa-solid fa-check text-emerald-400"></i> HV Fuse</span>`;
            }

            if (toolCollected && fuseCollected) {
                setTimeout(() => {
                    showActivitySuccess(
                        container,
                        'ch1_tool',
                        'Diagnostic Multi-Tool & Spares Acquired',
                        'Astronaut tools are equipped with tether carabiners and standardized torque drivers so crew members can operate equipment with thick EVA pressure-suit gloves.',
                        onComplete
                    );
                }, 400);
            }
        }

        // Drag events
        [toolEl, fuseEl].forEach(el => {
            if (!el) return;
            el.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', el.id);
            });
            el.addEventListener('click', () => {
                equipItem(el.id === 'drag-item-tool' ? 'Multi-Tool' : 'HV Fuse');
            });
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-sky-300', 'bg-sky-950/60');
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-sky-300', 'bg-sky-950/60');
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-sky-300', 'bg-sky-950/60');
            const id = e.dataTransfer.getData('text/plain');
            if (id === 'drag-item-tool') equipItem('Multi-Tool');
            if (id === 'drag-item-fuse') equipItem('HV Fuse');
        });
    }

    // Task 3: Verify ECLSS (5-Meter Dashboard Inspection & Flow Loop Recalibration)
    function renderM1T3_VerifyECLSS(container, onComplete) {
        const inspected = { o2: false, press: false, co2: false, temp: false, hum: false };
        let warningCleared = false;

        container.innerHTML = `
            ${createActivityHeader(
                'ECLSS Life-Support Diagnostic Console',
                'Inspect all five life-critical environmental channels. Identify the warning indicator on the CO₂ removal channel and hold the recalibration control to clear the flow restriction.',
                'Click each channel card to inspect telemetry. One channel shows a flow restriction alert!'
            )}
            <div class="space-y-3">
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <!-- 1. Oxygen Supply -->
                    <div data-channel="o2" class="eclss-card cursor-pointer bg-slate-900 border border-slate-700 hover:border-sky-400 p-2.5 rounded-xl transition">
                        <div class="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
                            <span>ppO₂ OXYGEN</span>
                            <i class="fa-solid fa-circle text-emerald-400 text-[8px]"></i>
                        </div>
                        <div class="font-bold text-white text-sm mt-0.5">21.0 kPa</div>
                        <div class="text-[9px] text-emerald-400 mt-1 font-mono-tech">Nominal (20.9%)</div>
                    </div>

                    <!-- 2. Cabin Pressure -->
                    <div data-channel="press" class="eclss-card cursor-pointer bg-slate-900 border border-slate-700 hover:border-sky-400 p-2.5 rounded-xl transition">
                        <div class="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
                            <span>CABIN PRESSURE</span>
                            <i class="fa-solid fa-circle text-emerald-400 text-[8px]"></i>
                        </div>
                        <div class="font-bold text-white text-sm mt-0.5">101.3 kPa</div>
                        <div class="text-[9px] text-emerald-400 mt-1 font-mono-tech">1.00 Atmosphere</div>
                    </div>

                    <!-- 3. Carbon Dioxide Removal (Warning!) -->
                    <div id="card-co2" data-channel="co2" class="eclss-card cursor-pointer bg-amber-950/40 border-2 border-amber-400 p-2.5 rounded-xl transition animate-pulse">
                        <div class="flex items-center justify-between text-[10px] font-mono-tech text-amber-300 font-bold">
                            <span>CO₂ SCRUB LOOP</span>
                            <i class="fa-solid fa-triangle-exclamation text-amber-400 text-[10px]"></i>
                        </div>
                        <div id="co2-val" class="font-bold text-amber-200 text-sm mt-0.5">850 ppm (RESTRICTED)</div>
                        <div id="co2-sub" class="text-[9px] text-amber-300 mt-1 font-mono-tech">Bypass Valve Offset</div>
                    </div>

                    <!-- 4. Cabin Temperature -->
                    <div data-channel="temp" class="eclss-card cursor-pointer bg-slate-900 border border-slate-700 hover:border-sky-400 p-2.5 rounded-xl transition">
                        <div class="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
                            <span>CABIN TEMP</span>
                            <i class="fa-solid fa-circle text-emerald-400 text-[8px]"></i>
                        </div>
                        <div class="font-bold text-white text-sm mt-0.5">21.5 °C</div>
                        <div class="text-[9px] text-emerald-400 mt-1 font-mono-tech">Thermal Envelope OK</div>
                    </div>

                    <!-- 5. Relative Humidity -->
                    <div data-channel="hum" class="eclss-card cursor-pointer bg-slate-900 border border-slate-700 hover:border-sky-400 p-2.5 rounded-xl transition">
                        <div class="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
                            <span>HUMIDITY</span>
                            <i class="fa-solid fa-circle text-emerald-400 text-[8px]"></i>
                        </div>
                        <div class="font-bold text-white text-sm mt-0.5">45.0% RH</div>
                        <div class="text-[9px] text-emerald-400 mt-1 font-mono-tech">Condenser Balanced</div>
                    </div>
                </div>

                <!-- Recalibration Action Box (Appears when CO2 is inspected) -->
                <div id="recalibrate-box" class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-200">Sabatier & Amine Loop Recalibration:</span>
                        <span id="inspect-counter" class="text-[10px] font-mono-tech text-slate-400">Inspected: 0 / 5</span>
                    </div>
                    <button id="btn-hold-recalibrate" class="w-full btn-tech bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden select-none">
                        <div id="recalibrate-fill" class="absolute left-0 top-0 bottom-0 bg-emerald-500/50 w-0 transition-all duration-75"></div>
                        <i class="fa-solid fa-sliders relative z-10"></i>
                        <span id="recalibrate-lbl" class="relative z-10">PRESS & HOLD TO RECALIBRATE (2 SECONDS)</span>
                    </button>
                </div>
            </div>
        `;

        const cards = container.querySelectorAll('.eclss-card');
        const counter = container.querySelector('#inspect-counter');
        const cardCo2 = container.querySelector('#card-co2');
        const co2Val = container.querySelector('#co2-val');
        const co2Sub = container.querySelector('#co2-sub');
        const btnHold = container.querySelector('#btn-hold-recalibrate');
        const fillBar = container.querySelector('#recalibrate-fill');
        const btnLbl = container.querySelector('#recalibrate-lbl');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const ch = card.dataset.channel;
                inspected[ch] = true;
                playSfx('click');
                card.classList.add('border-emerald-400');
                const count = Object.values(inspected).filter(Boolean).length;
                if (counter) counter.textContent = `Inspected: ${count} / 5 Channels`;
            });
        });

        // Hold-to-operate button
        let holdTimer = null;
        let holdProgress = 0;

        const startHold = () => {
            if (warningCleared) return;
            playSfx('beep');
            holdProgress = 0;
            holdTimer = setInterval(() => {
                holdProgress += 5;
                if (fillBar) fillBar.style.width = `${holdProgress}%`;
                if (holdProgress >= 100) {
                    clearInterval(holdTimer);
                    warningCleared = true;
                    playSfx('success');
                    if (cardCo2) {
                        cardCo2.className = 'eclss-card bg-slate-900 border-2 border-emerald-400 p-2.5 rounded-xl transition';
                    }
                    if (co2Val) {
                        co2Val.textContent = '420 ppm (OPTIMAL)';
                        co2Val.className = 'font-bold text-emerald-300 text-sm mt-0.5';
                    }
                    if (co2Sub) {
                        co2Sub.textContent = 'Flow Restriction Cleared';
                        co2Sub.className = 'text-[9px] text-emerald-400 mt-1 font-mono-tech';
                    }
                    if (btnLbl) btnLbl.textContent = 'RECALIBRATION NOMINAL (100%)';
                    if (btnHold) btnHold.className = 'w-full bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2';

                    setTimeout(() => {
                        showActivitySuccess(
                            container,
                            'ch1_life',
                            'ECLSS Life Support Verified Safe',
                            'All 5 environmental parameters verified within strict NASA human spaceflight standards: ppO₂ at 21 kPa, cabin pressure at 101.3 kPa, and CO₂ scrubbed down to nominal 420 ppm baseline.',
                            onComplete
                        );
                    }, 500);
                }
            }, 100);
        };

        const stopHold = () => {
            if (holdTimer) clearInterval(holdTimer);
            if (!warningCleared) {
                holdProgress = 0;
                if (fillBar) fillBar.style.width = '0%';
            }
        };

        if (btnHold) {
            btnHold.addEventListener('mousedown', startHold);
            window.addEventListener('mouseup', stopHold);
            btnHold.addEventListener('touchstart', startHold, { passive: true });
            window.addEventListener('touchend', stopHold);
        }
    }

    /* =========================================================================
     * MISSION 2: FIRST SEEDS IN RED SOIL (Sol 24–40)
     * ========================================================================= */

    // Task 1: Check Dwarf Wheat Trays (Handheld Crop Scanner & Chlorosis Detection)
    function renderM2T1_CheckCrops(container, onComplete) {
        let identifiedTray = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Hydroponic Crop Scanner',
                'Move your optical scanner over the dwarf wheat growing trays. Identify the abnormal tray showing signs of chlorosis (yellowing leaves) and acknowledge the diagnostic readout.',
                'Inspect Trays A through D. One tray has yellow leaf tips caused by an iron-nitrogen imbalance!'
            )}
            <div class="space-y-3">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <!-- Tray A -->
                    <div data-tray="A" class="crop-tray cursor-pointer bg-slate-900 border-2 border-slate-700 hover:border-emerald-400 p-2.5 rounded-xl text-center space-y-1 transition">
                        <div class="w-full h-16 bg-emerald-950/60 rounded-lg flex items-center justify-center text-emerald-400 text-2xl">
                            🌱
                        </div>
                        <div class="font-bold text-xs text-white font-mono-tech">Tray A: Spelt Wheat</div>
                        <div class="text-[9px] text-emerald-400 font-mono-tech">Vigor: 98% (Healthy)</div>
                    </div>

                    <!-- Tray B -->
                    <div data-tray="B" class="crop-tray cursor-pointer bg-slate-900 border-2 border-slate-700 hover:border-emerald-400 p-2.5 rounded-xl text-center space-y-1 transition">
                        <div class="w-full h-16 bg-emerald-950/60 rounded-lg flex items-center justify-center text-emerald-400 text-2xl">
                            🌾
                        </div>
                        <div class="font-bold text-xs text-white font-mono-tech">Tray B: Dwarf Wheat</div>
                        <div class="text-[9px] text-emerald-400 font-mono-tech">Vigor: 94% (Healthy)</div>
                    </div>

                    <!-- Tray C: Chlorosis Abnormal Indicator -->
                    <div data-tray="C" class="crop-tray cursor-pointer bg-slate-900 border-2 border-amber-500/80 hover:border-amber-400 p-2.5 rounded-xl text-center space-y-1 transition shadow-lg">
                        <div class="w-full h-16 bg-amber-950/60 rounded-lg flex items-center justify-center text-amber-300 text-2xl">
                            🍂
                        </div>
                        <div class="font-bold text-xs text-amber-300 font-mono-tech">Tray C: Micro Dwarf</div>
                        <div class="text-[9px] text-amber-400 font-bold font-mono-tech animate-pulse">Vigor: 62% (Stressed)</div>
                    </div>

                    <!-- Tray D -->
                    <div data-tray="D" class="crop-tray cursor-pointer bg-slate-900 border-2 border-slate-700 hover:border-emerald-400 p-2.5 rounded-xl text-center space-y-1 transition">
                        <div class="w-full h-16 bg-emerald-950/60 rounded-lg flex items-center justify-center text-emerald-400 text-2xl">
                            🌱
                        </div>
                        <div class="font-bold text-xs text-white font-mono-tech">Tray D: Salad Greens</div>
                        <div class="text-[9px] text-emerald-400 font-mono-tech">Vigor: 96% (Healthy)</div>
                    </div>
                </div>

                <!-- Scanner Telemetry Card -->
                <div id="crop-scanner-info" class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <span class="text-[10px] font-mono-tech text-sky-400 font-bold block mb-1">SCANNER STATUS: READY</span>
                    <p>Click on any tray above to aim the optical spectrometer and read chlorophyll absorbance data.</p>
                </div>
            </div>
        `;

        const trays = container.querySelectorAll('.crop-tray');
        const info = container.querySelector('#crop-scanner-info');

        trays.forEach(tray => {
            tray.addEventListener('click', () => {
                const t = tray.dataset.tray;
                playSfx('scan');
                trays.forEach(other => other.classList.remove('border-sky-400', 'border-emerald-400'));

                if (t === 'C') {
                    tray.classList.add('border-amber-400');
                    info.innerHTML = `
                        <div class="space-y-2">
                            <div class="flex items-center justify-between text-amber-300 font-bold font-mono-tech text-xs">
                                <span><i class="fa-solid fa-triangle-exclamation mr-1"></i>DIAGNOSTIC DETECTED: Tray C (Chlorosis)</span>
                                <span>EC: 1.2 mS/cm | pH: 6.8</span>
                            </div>
                            <p class="text-slate-200">
                                <strong>Condition:</strong> Leaf yellowing (interveinal chlorosis) caused by low chelated iron (Fe) and nitrogen absorption. Immediate mineral buffer dosing required.
                            </p>
                            <button id="btn-ack-crop" class="btn-tech bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer shadow">
                                <i class="fa-solid fa-check"></i>
                                <span>Acknowledge Diagnostic & Schedule Dosing</span>
                            </button>
                        </div>
                    `;
                    const btn = info.querySelector('#btn-ack-crop');
                    if (btn) {
                        btn.addEventListener('click', () => {
                            showActivitySuccess(
                                container,
                                'ch2_crop_inspect',
                                'Dwarf Wheat Diagnostic Complete',
                                'Early identification of nutrient stress (chlorosis) in hydroponic crops allows astronauts to dose targeted mineral buffers before crop failure occurs.',
                                onComplete
                            );
                        });
                    }
                } else {
                    tray.classList.add('border-emerald-400');
                    info.innerHTML = `
                        <div class="text-emerald-400 font-bold font-mono-tech mb-1">● TRAY ${t}: HEALTHY VEGETATIVE GROWTH</div>
                        <p class="text-slate-300">Chlorophyll Index: 88.5 • Moisture: 82% • Leaf Turgor: Optimal. No intervention required for this rack.</p>
                    `;
                }
            });
        });
    }

    // Task 2: Set Grow-Light System to 5 kW (Power Slider + Spectrum Glow)
    function renderM2T2_SetGrowLights(container, onComplete) {
        let powerKW = 2.0;
        let isDone = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Greenhouse Electrical Lighting Panel',
                'Adjust the grow-light electrical power slider to exactly 5.0 kW (target: 4.8 - 5.2 kW). Notice the red & blue LED spectrum brighten as power increases.',
                'Slide electrical power to 5.0 kW! Note: 5 kW is electrical power, distinct from plant PAR photon flux.'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Visual LED Rack Spectrum Glow -->
                <div id="led-spectrum-box" class="w-full h-20 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-around px-4 transition-all duration-200 shadow-inner" style="box-shadow: 0 0 15px rgba(239, 68, 68, 0.2), 0 0 15px rgba(59, 130, 246, 0.2);">
                    <div class="w-4 h-4 rounded-full bg-red-500 opacity-40 shadow-[0_0_10px_#ef4444]"></div>
                    <div class="w-4 h-4 rounded-full bg-blue-500 opacity-40 shadow-[0_0_10px_#3b82f6]"></div>
                    <div class="w-4 h-4 rounded-full bg-red-500 opacity-40 shadow-[0_0_10px_#ef4444]"></div>
                    <div class="w-4 h-4 rounded-full bg-blue-500 opacity-40 shadow-[0_0_10px_#3b82f6]"></div>
                    <div class="w-4 h-4 rounded-full bg-red-500 opacity-40 shadow-[0_0_10px_#ef4444]"></div>
                    <div class="w-4 h-4 rounded-full bg-blue-500 opacity-40 shadow-[0_0_10px_#3b82f6]"></div>
                </div>

                <!-- Scientific Callout -->
                <div class="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-[11px] text-slate-300 flex items-start gap-2">
                    <i class="fa-solid fa-lightbulb text-amber-400 mt-0.5"></i>
                    <div>
                        <strong class="text-sky-300 font-mono-tech">Scientific Distinction:</strong>
                        5 kW measures <em>electrical power consumption</em> from the habitat grid. <em>PAR (Photosynthetically Active Radiation)</em> measures the actual photon flux density (400–700 nm wavelengths) absorbed by plant chlorophyll.
                    </div>
                </div>

                <!-- Slider Control -->
                <div class="space-y-2">
                    <div class="flex items-center justify-between text-xs font-mono-tech font-bold">
                        <span class="text-slate-300">ELECTRICAL POWER CONSUMPTION:</span>
                        <span id="light-kw-val" class="text-amber-300 text-sm">2.0 kW</span>
                    </div>
                    <input id="slider-grow-light" type="range" min="0" max="10" step="0.1" value="2.0" class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400">
                    <div class="flex justify-between text-[10px] font-mono-tech text-slate-500">
                        <span>0 kW (Off)</span>
                        <span class="text-emerald-400 font-bold">★ Target: 5.0 kW</span>
                        <span>10 kW (Max)</span>
                    </div>
                </div>

                <!-- Confirm Button -->
                <button id="btn-lock-light" class="w-full btn-tech bg-slate-800 text-slate-500 cursor-not-allowed py-2 rounded-xl text-xs font-mono-tech font-bold">
                    Adjust Slider to 5.0 kW to Lock Setting
                </button>
            </div>
        `;

        const slider = container.querySelector('#slider-grow-light');
        const valEl = container.querySelector('#light-kw-val');
        const btnLock = container.querySelector('#btn-lock-light');
        const spectrumBox = container.querySelector('#led-spectrum-box');

        slider.addEventListener('input', (e) => {
            powerKW = parseFloat(e.target.value);
            if (valEl) valEl.textContent = `${powerKW.toFixed(1)} kW`;
            playSfx('click');

            // Dynamic glow intensity based on power
            const glowOpacity = Math.max(0.1, powerKW / 10);
            if (spectrumBox) {
                spectrumBox.style.boxShadow = `0 0 ${powerKW * 4}px rgba(239, 68, 68, ${glowOpacity}), 0 0 ${powerKW * 4}px rgba(59, 130, 246, ${glowOpacity})`;
                spectrumBox.querySelectorAll('.bg-red-500, .bg-blue-500').forEach(dot => {
                    dot.style.opacity = glowOpacity;
                });
            }

            if (powerKW >= 4.8 && powerKW <= 5.2) {
                if (valEl) valEl.className = 'text-emerald-400 text-sm font-bold';
                if (btnLock) {
                    btnLock.disabled = false;
                    btnLock.className = 'w-full btn-tech bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs font-mono-tech cursor-pointer shadow-lg';
                    btnLock.textContent = 'Lock in 5.0 kW Lighting Power';
                }
            } else {
                if (valEl) valEl.className = 'text-amber-300 text-sm font-bold';
                if (btnLock) {
                    btnLock.disabled = true;
                    btnLock.className = 'w-full btn-tech bg-slate-800 text-slate-500 cursor-not-allowed py-2 rounded-xl text-xs font-mono-tech font-bold';
                    btnLock.textContent = `Target is 5.0 kW (Current: ${powerKW.toFixed(1)} kW)`;
                }
            }
        });

        btnLock.addEventListener('click', () => {
            if (powerKW >= 4.8 && powerKW <= 5.2 && !isDone) {
                isDone = true;
                if (window.state && window.state.loads && window.state.loads.greenhouse) {
                    window.state.loads.greenhouse.on = true;
                }
                showActivitySuccess(
                    container,
                    'ch2_greenhouse_power',
                    'Grow-Light System Calibrated to 5 kW',
                    'The grow-light system is now drawing exactly 5.0 kW of electrical power, delivering optimal red (660nm) and blue (450nm) spectrums for lettuce and dwarf wheat photosynthesis without overloading the habitat battery buffer.',
                    onComplete
                );
            }
        });
    }

    // Task 3: Flush Irrigation Pump Lines (Valve Sequence + Hold-to-Flush + Flow Meter)
    function renderM2T3_FlushIrrigation(container, onComplete) {
        let valveOpen = false;
        let isFlushed = false;
        let flowRate = 0.0;

        container.innerHTML = `
            ${createActivityHeader(
                'Hydroponic Irrigation Loop',
                '1. Click and turn the water line valve to open the fluid pathway. 2. Press and hold the Flush Control for 2 seconds to purge air bubbles. 3. Close the valve once flushing finishes.',
                'Open the valve first, then hold the purge control until the flow meter confirms nominal flow!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Pipe Schematic -->
                <div class="relative w-full h-24 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-between px-6">
                    <!-- Transparent Pipes & Fluid Animation -->
                    <div class="absolute left-6 right-6 h-4 bg-slate-800 rounded-full border border-sky-500/40 overflow-hidden">
                        <div id="pipe-water-stream" class="h-full bg-gradient-to-r from-sky-400 to-teal-400 w-0 transition-all duration-300 opacity-80"></div>
                    </div>
                    <!-- Pump Node -->
                    <div class="relative z-10 w-12 h-12 rounded-xl bg-slate-800 border-2 border-sky-400 flex items-center justify-center text-sky-400 shadow">
                        <i class="fa-solid fa-water"></i>
                    </div>
                    <!-- Flow Meter Readout -->
                    <div class="relative z-10 bg-slate-950/90 border border-slate-700 px-3 py-1 rounded-lg text-center">
                        <div class="text-[9px] font-mono-tech text-slate-400">FLOW METER</div>
                        <div id="flow-meter-val" class="font-mono-tech font-bold text-xs text-sky-300">0.0 L/min</div>
                    </div>
                    <!-- Valve Node -->
                    <button id="btn-toggle-valve" class="btn-tech relative z-10 w-12 h-12 rounded-xl bg-slate-800 border-2 border-amber-400 flex items-center justify-center text-amber-400 cursor-pointer hover:scale-105 transition shadow" title="Click to rotate valve">
                        <i id="valve-icon" class="fa-solid fa-lock text-base"></i>
                    </button>
                </div>

                <!-- Valve & Flush Controls -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button id="btn-open-valve-txt" class="btn-tech bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-2.5 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer">
                        <i class="fa-solid fa-faucet text-amber-400"></i>
                        <span id="valve-txt-lbl">1. Open Water Valve (Closed)</span>
                    </button>

                    <button id="btn-hold-flush" disabled class="btn-tech bg-slate-800 text-slate-500 cursor-not-allowed p-2.5 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 relative overflow-hidden select-none">
                        <div id="flush-progress-fill" class="absolute left-0 top-0 bottom-0 bg-teal-500/50 w-0 transition-all duration-75"></div>
                        <i class="fa-solid fa-circle-arrow-right relative z-10"></i>
                        <span id="flush-btn-lbl" class="relative z-10">2. Hold to Flush (Locked)</span>
                    </button>
                </div>
            </div>
        `;

        const btnToggle = container.querySelector('#btn-toggle-valve');
        const btnTxt = container.querySelector('#btn-open-valve-txt');
        const valveIcon = container.querySelector('#valve-icon');
        const valveLbl = container.querySelector('#valve-txt-lbl');
        const btnFlush = container.querySelector('#btn-hold-flush');
        const flushFill = container.querySelector('#flush-progress-fill');
        const flushLbl = container.querySelector('#flush-btn-lbl');
        const waterStream = container.querySelector('#pipe-water-stream');
        const flowVal = container.querySelector('#flow-meter-val');

        function toggleValve() {
            playSfx('valveRotate');
            valveOpen = !valveOpen;
            if (valveOpen) {
                valveIcon.className = 'fa-solid fa-lock-open text-base text-emerald-400';
                valveLbl.textContent = '1. Water Valve is OPEN (Nominal)';
                btnTxt.className = 'btn-tech bg-emerald-950/40 text-emerald-300 border border-emerald-400 p-2.5 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer';
                btnFlush.disabled = false;
                btnFlush.className = 'btn-tech bg-teal-600 hover:bg-teal-500 text-white p-2.5 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden select-none shadow';
                flushLbl.textContent = '2. Hold to Purge Air (2s)';
            } else {
                valveIcon.className = 'fa-solid fa-lock text-base text-amber-400';
                valveLbl.textContent = '1. Open Water Valve (Closed)';
                btnTxt.className = 'btn-tech bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-2.5 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer';
                if (!isFlushed) {
                    btnFlush.disabled = true;
                    btnFlush.className = 'btn-tech bg-slate-800 text-slate-500 cursor-not-allowed p-2.5 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2';
                    flushLbl.textContent = '2. Hold to Flush (Locked)';
                }
            }
        }

        btnToggle.addEventListener('click', toggleValve);
        btnTxt.addEventListener('click', toggleValve);

        // Hold flush button
        let flushTimer = null;
        let progress = 0;

        const startFlush = () => {
            if (!valveOpen || isFlushed) return;
            playSfx('waterFlow');
            progress = 0;
            flushTimer = setInterval(() => {
                progress += 5;
                if (flushFill) flushFill.style.width = `${progress}%`;
                if (waterStream) waterStream.style.width = `${progress}%`;
                if (flowVal) flowVal.textContent = `${(progress * 0.045).toFixed(1)} L/min`;

                if (progress >= 100) {
                    clearInterval(flushTimer);
                    isFlushed = true;
                    playSfx('success');
                    if (flushLbl) flushLbl.textContent = 'Flushing Complete! (Nominal)';
                    if (flowVal) flowVal.textContent = '4.5 L/min (Nominal)';

                    setTimeout(() => {
                        showActivitySuccess(
                            container,
                            'ch2_flush_irrigation',
                            'Irrigation Line Flushed & Primed',
                            'Trapped air bubbles have been completely evacuated from the hydroponic delivery pipes. In Martian micro-gravity, air locks can starve roots; maintaining consistent 4.5 L/min capillary flow ensures crop survival.',
                            onComplete
                        );
                    }, 500);
                }
            }, 100);
        };

        const stopFlush = () => {
            if (flushTimer) clearInterval(flushTimer);
            if (!isFlushed) {
                progress = 0;
                if (flushFill) flushFill.style.width = '0%';
                if (waterStream) waterStream.style.width = '0%';
                if (flowVal) flowVal.textContent = '0.0 L/min';
            }
        };

        btnFlush.addEventListener('mousedown', startFlush);
        window.addEventListener('mouseup', stopFlush);
        btnFlush.addEventListener('touchstart', startFlush, { passive: true });
        window.addEventListener('touchend', stopFlush);
    }

    /* =========================================================================
     * MISSION 3: COMMISSIONING PERSEVERANCE & INGENUITY (Sol 75–90)
     * ========================================================================= */

    // Task 1: Suit Up and Check Airlock Seal (Drag Suit Pieces + Pressure Test)
    function renderM3T1_SuitPrep(container, onComplete) {
        const equipped = { helmet: false, gloves: false, boots: false, plss: false };
        let testRunning = false;

        container.innerHTML = `
            ${createActivityHeader(
                'NASA EMU Suit Donning Station',
                'Drag all four suit components onto Cadet Nova’s mannequin: Helmet, Thermal Gloves, Mobility Boots, and the PLSS Life-Support backpack. Then initiate the simulated suit pressure integrity test.',
                'Equip all 4 suit items, then run the pressure integrity test before opening the seal!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <!-- Suit Mannequin -->
                <div id="suit-mannequin-drop" class="w-full h-56 bg-slate-900/90 rounded-xl border-2 border-dashed border-sky-500/40 flex flex-col items-center justify-center p-3 relative">
                    <span class="text-[10px] font-mono-tech text-sky-400 font-bold mb-2">CADET NOVA SUIT SILHOUETTE</span>
                    <div id="mannequin-slots" class="flex flex-col items-center gap-1.5">
                        <div id="slot-helmet" class="w-12 h-12 rounded-full border border-slate-700 bg-slate-950 flex items-center justify-center text-slate-500 text-xs">
                            Helmet
                        </div>
                        <div class="flex items-center gap-2">
                            <div id="slot-gloves" class="w-10 h-10 rounded-lg border border-slate-700 bg-slate-950 flex items-center justify-center text-slate-500 text-[10px]">
                                Gloves
                            </div>
                            <div id="slot-plss" class="w-16 h-12 rounded-lg border border-slate-700 bg-slate-950 flex items-center justify-center text-slate-500 text-[10px]">
                                PLSS Pack
                            </div>
                        </div>
                        <div id="slot-boots" class="w-14 h-8 rounded-lg border border-slate-700 bg-slate-950 flex items-center justify-center text-slate-500 text-[10px]">
                            Boots
                        </div>
                    </div>
                </div>

                <!-- Suit Components Drawer -->
                <div class="space-y-3">
                    <span class="text-[10px] font-mono-tech uppercase text-slate-400 font-bold block">SUIT RACK STORAGE</span>
                    <div class="grid grid-cols-2 gap-2">
                        <div id="piece-helmet" draggable="true" class="suit-drag-item bg-slate-900 border border-slate-700 hover:border-amber-400 p-2 rounded-xl flex items-center gap-2 cursor-grab shadow">
                            <i class="fa-solid fa-head-side-mask text-amber-400 text-lg"></i>
                            <div>
                                <div class="text-xs font-bold text-white">Gold Visor</div>
                                <div class="text-[9px] text-slate-400">Helmet</div>
                            </div>
                        </div>
                        <div id="piece-gloves" draggable="true" class="suit-drag-item bg-slate-900 border border-slate-700 hover:border-amber-400 p-2 rounded-xl flex items-center gap-2 cursor-grab shadow">
                            <i class="fa-solid fa-mitten text-amber-400 text-lg"></i>
                            <div>
                                <div class="text-xs font-bold text-white">Thermal EVA</div>
                                <div class="text-[9px] text-slate-400">Gloves</div>
                            </div>
                        </div>
                        <div id="piece-boots" draggable="true" class="suit-drag-item bg-slate-900 border border-slate-700 hover:border-amber-400 p-2 rounded-xl flex items-center gap-2 cursor-grab shadow">
                            <i class="fa-solid fa-shoe-prints text-amber-400 text-lg"></i>
                            <div>
                                <div class="text-xs font-bold text-white">Regolith Grip</div>
                                <div class="text-[9px] text-slate-400">Boots</div>
                            </div>
                        </div>
                        <div id="piece-plss" draggable="true" class="suit-drag-item bg-slate-900 border border-slate-700 hover:border-amber-400 p-2 rounded-xl flex items-center gap-2 cursor-grab shadow">
                            <i class="fa-solid fa-shield-heart text-amber-400 text-lg"></i>
                            <div>
                                <div class="text-xs font-bold text-white">PLSS O₂/Water</div>
                                <div class="text-[9px] text-slate-400">Backpack</div>
                            </div>
                        </div>
                    </div>

                    <button id="btn-suit-test" disabled class="w-full btn-tech bg-slate-800 text-slate-500 cursor-not-allowed py-2 px-3 rounded-xl text-xs font-mono-tech font-bold">
                        Equip All 4 Components to Run Pressure Check
                    </button>
                </div>
            </div>
        `;

        const pieceHelmet = container.querySelector('#piece-helmet');
        const pieceGloves = container.querySelector('#piece-gloves');
        const pieceBoots = container.querySelector('#piece-boots');
        const piecePlss = container.querySelector('#piece-plss');
        const btnTest = container.querySelector('#btn-suit-test');

        function equipPiece(name) {
            equipped[name] = true;
            playSfx('pickup');
            const slot = container.querySelector(`#slot-${name}`);
            const piece = container.querySelector(`#piece-${name}`);
            if (piece) piece.style.display = 'none';
            if (slot) {
                slot.className = 'w-full h-full rounded border-2 border-emerald-400 bg-emerald-950/60 text-emerald-300 font-mono-tech font-bold flex items-center justify-center text-xs p-1';
                slot.innerHTML = `<i class="fa-solid fa-check text-emerald-400 mr-1"></i> ${name.toUpperCase()}`;
            }

            if (equipped.helmet && equipped.gloves && equipped.boots && equipped.plss) {
                if (btnTest) {
                    btnTest.disabled = false;
                    btnTest.className = 'w-full btn-tech bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs font-mono-tech cursor-pointer shadow-lg animate-pulse';
                    btnTest.textContent = 'Run Suit Pressure Integrity Test (30 kPa Pure O₂)';
                }
            }
        }

        [pieceHelmet, pieceGloves, pieceBoots, piecePlss].forEach(el => {
            if (!el) return;
            const name = el.id.replace('piece-', '');
            el.addEventListener('click', () => equipPiece(name));
        });

        btnTest.addEventListener('click', () => {
            if (testRunning) return;
            testRunning = true;
            playSfx('beep');
            btnTest.textContent = 'Running Simulated Pressure Decay Test...';
            btnTest.className = 'w-full bg-slate-800 text-amber-300 py-2 px-3 rounded-xl text-xs font-mono-tech font-bold animate-pulse';

            setTimeout(() => {
                playSfx('success');
                if (window.state && window.state.player) {
                    window.state.player.inSuit = true;
                    window.state.player.suitChecked = true;
                }
                showActivitySuccess(
                    container,
                    'ch3_eva_prep',
                    'EMU Spacesuit Donned & Pressure Sealed',
                    'Suit pressure verified stable at 30 kPa pure oxygen with zero measurable decay. The outer seal interlock is now primed for exterior surface exploration.',
                    onComplete
                );
            }, 1200);
        });
    }

    // Task 2: Inspect Perseverance Rover (Interactive Subsystems & Mastcam Cleaning)
    function renderM3T2_InspectPerseverance(container, onComplete) {
        const inspected = { wheels: false, arm: false, mastcam: false, antenna: false };

        container.innerHTML = `
            ${createActivityHeader(
                'Perseverance Rover Robotic Checkout',
                'Inspect the four primary exploration subsystems: Rocker-Bogie mobility, Mastcam-Z camera, SHERLOC/PIXL robotic arm, and High-Gain Antenna. Resolve the lens dust warning on Mastcam-Z.',
                'Click on each component card to scan telemetry. Clear the optical dust obstruction on the camera!'
            )}
            <div class="space-y-3">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <!-- Wheels -->
                    <div data-comp="wheels" class="rover-card cursor-pointer bg-slate-900 border border-slate-700 hover:border-sky-400 p-2.5 rounded-xl text-center space-y-1 transition">
                        <i class="fa-solid fa-dharmachakra text-sky-400 text-2xl"></i>
                        <div class="font-bold text-xs text-white">6-Wheel Mobility</div>
                        <div class="text-[9px] text-emerald-400 font-mono-tech">Drive Motors: OK</div>
                    </div>

                    <!-- Robotic Arm -->
                    <div data-comp="arm" class="rover-card cursor-pointer bg-slate-900 border border-slate-700 hover:border-sky-400 p-2.5 rounded-xl text-center space-y-1 transition">
                        <i class="fa-solid fa-robot text-sky-400 text-2xl"></i>
                        <div class="font-bold text-xs text-white">2.1m Robotic Arm</div>
                        <div class="text-[9px] text-emerald-400 font-mono-tech">PIXL/SHERLOC: Ready</div>
                    </div>

                    <!-- Mastcam-Z (Warning!) -->
                    <div id="card-mastcam" data-comp="mastcam" class="rover-card cursor-pointer bg-amber-950/40 border-2 border-amber-400 p-2.5 rounded-xl text-center space-y-1 transition animate-pulse">
                        <i class="fa-solid fa-camera text-amber-300 text-2xl"></i>
                        <div class="font-bold text-xs text-amber-200">Mastcam-Z Optic</div>
                        <div id="mastcam-status" class="text-[9px] text-amber-400 font-mono-tech font-bold">Dust Obscuration!</div>
                    </div>

                    <!-- Antenna -->
                    <div data-comp="antenna" class="rover-card cursor-pointer bg-slate-900 border border-slate-700 hover:border-sky-400 p-2.5 rounded-xl text-center space-y-1 transition">
                        <i class="fa-solid fa-satellite-dish text-sky-400 text-2xl"></i>
                        <div class="font-bold text-xs text-white">High-Gain Antenna</div>
                        <div class="text-[9px] text-emerald-400 font-mono-tech">X-Band Uplink: 100%</div>
                    </div>
                </div>

                <!-- Inspection Detail View -->
                <div id="rover-detail-box" class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <span class="text-[10px] font-mono-tech text-slate-400">Click any component to initiate diagnostic scan.</span>
                </div>
            </div>
        `;

        const cards = container.querySelectorAll('.rover-card');
        const detail = container.querySelector('#rover-detail-box');
        const cardMastcam = container.querySelector('#card-mastcam');
        const mastcamStatus = container.querySelector('#mastcam-status');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const c = card.dataset.comp;
                inspected[c] = true;
                playSfx('scan');

                if (c === 'mastcam') {
                    detail.innerHTML = `
                        <div class="space-y-2">
                            <div class="text-amber-300 font-bold font-mono-tech text-xs">
                                <i class="fa-solid fa-triangle-exclamation mr-1"></i>MASTCAM-Z OPTICAL WARNING: Fine regolith dust film detected on optical objective.
                            </div>
                            <p class="text-slate-200">
                                Dust on camera lenses degrades multispectral science imagery. Activate the CO₂ gas puff purge to clear the optical window.
                            </p>
                            <button id="btn-clear-lens" class="btn-tech bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer shadow">
                                <i class="fa-solid fa-wind"></i>
                                <span>Activate Gas Puff Purge</span>
                            </button>
                        </div>
                    `;
                    const btnPurge = detail.querySelector('#btn-clear-lens');
                    if (btnPurge) {
                        btnPurge.addEventListener('click', () => {
                            playSfx('airlockHiss');
                            cardMastcam.className = 'rover-card bg-slate-900 border-2 border-emerald-400 p-2.5 rounded-xl text-center space-y-1 transition';
                            mastcamStatus.textContent = 'Optics Clear (100%)';
                            mastcamStatus.className = 'text-[9px] text-emerald-400 font-mono-tech font-bold';

                            setTimeout(() => {
                                showActivitySuccess(
                                    container,
                                    'ch3_rover_link',
                                    'Perseverance Rover Systems Commissioned',
                                    'All robotic systems—including rocker-bogie mobility and Mastcam-Z multispectral optics—are nominal. Perseverance’s instruments enable autonomous exploration up to 20 km from base.',
                                    onComplete
                                );
                            }, 500);
                        });
                    }
                } else {
                    detail.innerHTML = `
                        <div class="text-emerald-400 font-bold font-mono-tech mb-1">● ${c.toUpperCase()}: TELEMETRY NOMINAL</div>
                        <p class="text-slate-300">All actuators, encoders, and thermal heaters operating within manufacturer tolerances.</p>
                    `;
                }
            });
        });
    }

    // Task 3: Reboot Ingenuity Rotor Telemetry (Sequence Switches 1-2-3 + Hold Reboot)
    function renderM3T3_RebootIngenuity(container, onComplete) {
        let seq = 1;
        let isRebooted = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Ingenuity Helicopter Avionics Reboot',
                'Historical Robotic Systems Training: 1. Turn on Solar Pre-Charge. 2. Engage Avionics Bus. 3. Activate Pitch Diagnostic. 4. Hold the Reboot switch for 2 seconds to synchronize telemetry.',
                'Flip switches 1, 2, and 3 in exact sequence, then hold the reboot button!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Historic Mission Clarification Box -->
                <div class="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg text-[11px] text-slate-300 flex items-start gap-2">
                    <i class="fa-solid fa-landmark text-amber-400 mt-0.5"></i>
                    <div>
                        <strong class="text-amber-300 font-mono-tech">Historical Milestone:</strong>
                        NASA Ingenuity completed 72 historic flights on Mars before retiring in January 2024. This training activity simulates its pioneering counter-rotating coaxial rotor avionics.
                    </div>
                </div>

                <!-- 3 Sequence Switches -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button id="seq-sw-1" class="btn-tech bg-slate-800 text-slate-300 border border-slate-700 p-3 rounded-xl text-xs font-mono-tech flex flex-col items-center gap-1 cursor-pointer">
                        <i id="seq-sw-1-icon" class="fa-solid fa-toggle-off text-lg text-slate-500"></i>
                        <span class="font-bold">1. Pre-Charge Bus</span>
                        <span class="text-[9px] text-slate-500">Standby</span>
                    </button>

                    <button id="seq-sw-2" class="btn-tech bg-slate-800 text-slate-300 border border-slate-700 p-3 rounded-xl text-xs font-mono-tech flex flex-col items-center gap-1 cursor-pointer opacity-50">
                        <i id="seq-sw-2-icon" class="fa-solid fa-toggle-off text-lg text-slate-500"></i>
                        <span class="font-bold">2. Avionics Computer</span>
                        <span class="text-[9px] text-slate-500">Standby</span>
                    </button>

                    <button id="seq-sw-3" class="btn-tech bg-slate-800 text-slate-300 border border-slate-700 p-3 rounded-xl text-xs font-mono-tech flex flex-col items-center gap-1 cursor-pointer opacity-50">
                        <i id="seq-sw-3-icon" class="fa-solid fa-toggle-off text-lg text-slate-500"></i>
                        <span class="font-bold">3. Blade Pitch Telemetry</span>
                        <span class="text-[9px] text-slate-500">Standby</span>
                    </button>
                </div>

                <!-- Hold Reboot Button -->
                <button id="btn-hold-ingenuity" disabled class="w-full btn-tech bg-slate-800 text-slate-500 cursor-not-allowed py-2.5 px-4 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 relative overflow-hidden select-none">
                    <div id="ingenuity-progress-fill" class="absolute left-0 top-0 bottom-0 bg-sky-500/50 w-0 transition-all duration-75"></div>
                    <i class="fa-solid fa-rotate relative z-10"></i>
                    <span id="ingenuity-lbl" class="relative z-10">Complete Startup Sequence (1 -> 2 -> 3) to Unlock Reboot</span>
                </button>
            </div>
        `;

        const sw1 = container.querySelector('#seq-sw-1');
        const sw2 = container.querySelector('#seq-sw-2');
        const sw3 = container.querySelector('#seq-sw-3');
        const btnReboot = container.querySelector('#btn-hold-ingenuity');
        const fillBar = container.querySelector('#ingenuity-progress-fill');
        const btnLbl = container.querySelector('#ingenuity-lbl');

        sw1.addEventListener('click', () => {
            if (seq === 1) {
                playSfx('click');
                seq = 2;
                sw1.className = 'btn-tech bg-emerald-950/50 text-emerald-300 border border-emerald-400 p-3 rounded-xl text-xs font-mono-tech flex flex-col items-center gap-1';
                container.querySelector('#seq-sw-1-icon').className = 'fa-solid fa-toggle-on text-lg text-emerald-400';
                sw2.classList.remove('opacity-50');
            }
        });

        sw2.addEventListener('click', () => {
            if (seq === 2) {
                playSfx('click');
                seq = 3;
                sw2.className = 'btn-tech bg-emerald-950/50 text-emerald-300 border border-emerald-400 p-3 rounded-xl text-xs font-mono-tech flex flex-col items-center gap-1';
                container.querySelector('#seq-sw-2-icon').className = 'fa-solid fa-toggle-on text-lg text-emerald-400';
                sw3.classList.remove('opacity-50');
            }
        });

        sw3.addEventListener('click', () => {
            if (seq === 3) {
                playSfx('click');
                seq = 4;
                sw3.className = 'btn-tech bg-emerald-950/50 text-emerald-300 border border-emerald-400 p-3 rounded-xl text-xs font-mono-tech flex flex-col items-center gap-1';
                container.querySelector('#seq-sw-3-icon').className = 'fa-solid fa-toggle-on text-lg text-emerald-400';

                btnReboot.disabled = false;
                btnReboot.className = 'w-full btn-tech bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden select-none shadow animate-pulse';
                btnLbl.textContent = 'PRESS & HOLD TO REBOOT ROTOR TELEMETRY (2 SECONDS)';
            }
        });

        // Hold reboot
        let timer = null;
        let progress = 0;

        const startHold = () => {
            if (seq < 4 || isRebooted) return;
            playSfx('beep');
            progress = 0;
            timer = setInterval(() => {
                progress += 5;
                if (fillBar) fillBar.style.width = `${progress}%`;
                if (progress >= 100) {
                    clearInterval(timer);
                    isRebooted = true;
                    playSfx('success');
                    btnLbl.textContent = 'ROTOR TELEMETRY REBOOTED NOMINAL (2,400 RPM READY)';
                    setTimeout(() => {
                        showActivitySuccess(
                            container,
                            'ch3_heli_inspect',
                            'Ingenuity Telemetry Synchronized',
                            'Telemetry link confirmed. Ingenuity’s dual carbon-fiber rotors spin at 2,400 RPM to generate lift in Mars’ thin air, providing aerial scouting for ground astronaut excursions.',
                            onComplete
                        );
                    }, 500);
                }
            }, 100);
        };

        const stopHold = () => {
            if (timer) clearInterval(timer);
            if (!isRebooted) {
                progress = 0;
                if (fillBar) fillBar.style.width = '0%';
            }
        };

        btnReboot.addEventListener('mousedown', startHold);
        window.addEventListener('mouseup', stopHold);
        btnReboot.addEventListener('touchstart', startHold, { passive: true });
        window.addEventListener('touchend', stopHold);
    }

    /* =========================================================================
     * MISSION 4: THE RISING SKY OF COPPER (Sol 130–145) [75s Emergency]
     * ========================================================================= */

    // Task 1: Shed Non-Essential Loads (Interactive Circuit Breakers)
    function renderM4T1_ShedLoads(container, onComplete) {
        const loads = {
            eclss: { name: 'ECLSS Life Support', kw: 8, on: true, essential: true },
            heat: { name: 'Habitat Life-Critical Heating', kw: 4, on: true, essential: true },
            lab: { name: 'Science Lab Centrifuge', kw: 4, on: true, essential: false },
            greenhouse: { name: 'Greenhouse Grow Light Booster', kw: 5, on: true, essential: false },
            cutter: { name: 'Rock Core Slicer', kw: 3, on: true, essential: false }
        };
        const generationKW = 12; // Solar reduced by dust storm

        function calcTotalLoad() {
            let total = 0;
            Object.values(loads).forEach(l => { if (l.on) total += l.kw; });
            return total;
        }

        function updateView() {
            const currentLoad = calcTotalLoad();
            const net = generationKW - currentLoad;
            const isSafe = net >= 0;

            container.innerHTML = `
                ${createActivityHeader(
                    'Electrical Load Shedding Grid (75s Emergency)',
                    'Dust has cut solar power to 12 kW while habitat load is 24 kW. Toggle circuit breakers to shed non-essential equipment. Essential Life Support must remain ON!',
                    'Switch off the Science Lab, Greenhouse Booster, or Rock Cutter until generation covers the load!'
                )}
                <div class="bg-slate-950 p-4 rounded-xl border border-amber-500/40 space-y-3">
                    <!-- Power Balance Bar -->
                    <div class="flex items-center justify-between text-xs font-mono-tech font-bold">
                        <span class="text-amber-400">Solar Generation: ${generationKW} kW</span>
                        <span class="${isSafe ? 'text-emerald-400' : 'text-rose-400'}">Habitat Load: ${currentLoad} kW (Net: ${net >= 0 ? '+' : ''}${net} kW)</span>
                    </div>

                    <!-- Breakers Grid -->
                    <div class="space-y-2">
                        ${Object.keys(loads).map(key => {
                            const item = loads[key];
                            return `
                                <div class="flex items-center justify-between p-2 rounded-lg border ${item.on ? 'bg-slate-900 border-slate-700' : 'bg-slate-950 border-slate-800 opacity-60'}">
                                    <div class="flex items-center gap-2">
                                        <i class="fa-solid fa-bolt ${item.on ? (item.essential ? 'text-emerald-400' : 'text-amber-400') : 'text-slate-600'}"></i>
                                        <span class="text-xs font-bold text-white">${item.name} (${item.kw} kW)</span>
                                        ${item.essential ? '<span class="text-[9px] font-mono-tech px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">CRITICAL LIFE SUPPORT</span>' : ''}
                                    </div>
                                    <button data-key="${key}" class="breaker-toggle-btn btn-tech px-3 py-1 rounded text-xs font-mono-tech font-bold cursor-pointer ${item.on ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}">
                                        ${item.on ? 'CONNECTED' : 'SHED (OFF)'}
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <button id="btn-confirm-shed" ${!isSafe ? 'disabled' : ''} class="w-full btn-tech ${isSafe ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} py-2 rounded-xl text-xs font-mono-tech font-bold">
                        ${isSafe ? 'Confirm Load Shedding (Grid Balanced)' : `Grid in Deficit (-${Math.abs(net)} kW). Shed More Loads!`}
                    </button>
                </div>
            `;

            container.querySelectorAll('.breaker-toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const k = btn.dataset.key;
                    if (loads[k].essential) {
                        playSfx('alert');
                        if (typeof window.loseHeart === 'function') {
                            window.loseHeart('Safety Violation: Never shed essential life support!');
                        }
                        setCompanionHint('CRITICAL: Never disconnect habitat life support! Shed non-essential lab or greenhouse boosters instead.');
                        return;
                    }
                    playSfx('click');
                    loads[k].on = !loads[k].on;
                    updateView();
                });
            });

            const btnConfirm = container.querySelector('#btn-confirm-shed');
            if (btnConfirm && isSafe) {
                btnConfirm.addEventListener('click', () => {
                    if (window.state && window.state.loads) {
                        window.state.loads.lab.on = loads.lab.on;
                        window.state.loads.greenhouse.on = loads.greenhouse.on;
                    }
                    showActivitySuccess(
                        container,
                        'ch4_shed_load',
                        'Non-Essential Loads Shed Successfully',
                        'Total habitat power load has been reduced to match incoming solar irradiance. Critical life support remains safely powered while preventing catastrophic battery depletion.',
                        onComplete
                    );
                });
            }
        }

        updateView();
    }

    // Task 2: Activate Backup Power (Selector to Backup Bus + Hold Lever)
    function renderM4T2_ActivateBackup(container, onComplete) {
        let busSelected = false;
        let isDone = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Auxiliary Backup Power Terminal',
                '1. Switch bus selector from Main Solar to Backup RTG/Fission Bus. 2. Pull and hold the Emergency Bus Tie Lever for 2 seconds to synchronize +12 kW of auxiliary power.',
                'Select the backup bus first, then pull and hold the activation lever!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Scientific Note on RTGs -->
                <div class="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg text-[11px] text-slate-300 flex items-start gap-2">
                    <i class="fa-solid fa-atom text-amber-400 mt-0.5"></i>
                    <div>
                        <strong class="text-amber-300 font-mono-tech">Scientific Reality:</strong>
                        Radioisotope Thermoelectric Generators (RTGs) and Kilopower fission sources are hermetically sealed systems converting radioactive decay heat into continuous solid-state electricity. They require zero manual refueling.
                    </div>
                </div>

                <!-- Bus Selector Switch -->
                <div class="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span class="text-xs font-bold text-slate-200">POWER SOURCE BUS SELECTOR:</span>
                    <button id="btn-toggle-bus" class="btn-tech bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/60 px-4 py-1.5 rounded-lg text-xs font-mono-tech font-bold cursor-pointer">
                        <i id="bus-icon" class="fa-solid fa-toggle-off mr-1"></i>
                        <span id="bus-lbl">MAIN SOLAR BUS</span>
                    </button>
                </div>

                <!-- Lever Hold Button -->
                <button id="btn-hold-tie-lever" disabled class="w-full btn-tech bg-slate-800 text-slate-500 cursor-not-allowed py-3 px-4 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 relative overflow-hidden select-none">
                    <div id="lever-progress-fill" class="absolute left-0 top-0 bottom-0 bg-amber-500/50 w-0 transition-all duration-75"></div>
                    <i class="fa-solid fa-code-branch relative z-10"></i>
                    <span id="lever-lbl" class="relative z-10">Switch to Backup Bus First</span>
                </button>
            </div>
        `;

        const btnBus = container.querySelector('#btn-toggle-bus');
        const busIcon = container.querySelector('#bus-icon');
        const busLbl = container.querySelector('#bus-lbl');
        const btnLever = container.querySelector('#btn-hold-tie-lever');
        const leverFill = container.querySelector('#lever-progress-fill');
        const leverLbl = container.querySelector('#lever-lbl');

        btnBus.addEventListener('click', () => {
            playSfx('click');
            busSelected = !busSelected;
            if (busSelected) {
                busIcon.className = 'fa-solid fa-toggle-on mr-1 text-emerald-400';
                busLbl.textContent = 'BACKUP RTG / FISSION BUS';
                btnBus.className = 'btn-tech bg-emerald-950/40 text-emerald-300 border border-emerald-400 px-4 py-1.5 rounded-lg text-xs font-mono-tech font-bold cursor-pointer';

                btnLever.disabled = false;
                btnLever.className = 'w-full btn-tech bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden select-none shadow animate-pulse';
                leverLbl.textContent = 'PULL & HOLD BUS TIE LEVER (2 SECONDS)';
            } else {
                busIcon.className = 'fa-solid fa-toggle-off mr-1';
                busLbl.textContent = 'MAIN SOLAR BUS';
                btnBus.className = 'btn-tech bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/60 px-4 py-1.5 rounded-lg text-xs font-mono-tech font-bold cursor-pointer';

                btnLever.disabled = true;
                btnLever.className = 'w-full btn-tech bg-slate-800 text-slate-500 cursor-not-allowed py-3 px-4 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2';
                leverLbl.textContent = 'Switch to Backup Bus First';
            }
        });

        // Hold lever
        let timer = null;
        let progress = 0;

        const startHold = () => {
            if (!busSelected || isDone) return;
            playSfx('beep');
            progress = 0;
            timer = setInterval(() => {
                progress += 5;
                if (leverFill) leverFill.style.width = `${progress}%`;
                if (progress >= 100) {
                    clearInterval(timer);
                    isDone = true;
                    playSfx('success');
                    if (window.state) {
                        window.state.backupGenKW = 12;
                    }
                    leverLbl.textContent = 'BACKUP POWER ONLINE (+12 kW)';
                    setTimeout(() => {
                        showActivitySuccess(
                            container,
                            'ch4_gen_backup',
                            'Backup Power Supply Activated (+12 kW)',
                            'The auxiliary backup power supply is now safely tied to the habitat grid. This continuous solid-state power buffer guarantees life support survives through nighttime and dust-storm deficits.',
                            onComplete
                        );
                    }, 500);
                }
            }, 100);
        };

        const stopHold = () => {
            if (timer) clearInterval(timer);
            if (!isDone) {
                progress = 0;
                if (leverFill) leverFill.style.width = '0%';
            }
        };

        btnLever.addEventListener('mousedown', startHold);
        window.addEventListener('mouseup', stopHold);
        btnLever.addEventListener('touchstart', startHold, { passive: true });
        window.addEventListener('touchend', stopHold);
    }

    // Task 3: Inspect Exterior Dust Wipers (Drag Wiper Wand across Solar Arrays)
    function renderM4T3_CleanDustWipers(container, onComplete) {
        let cleanedPanels = { 1: false, 2: false, 3: false, 4: false };

        container.innerHTML = `
            ${createActivityHeader(
                'External Photovoltaic Array Maintenance',
                'Drag the wiper wand tool across all four dust-caked solar array segments to clear electrostatically charged Martian copper dust and restore solar generation.',
                'Click or drag the wiper tool across panels 1 through 4 to remove the copper dust layer!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- 4 Solar Array Segments -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    ${[1, 2, 3, 4].map(idx => `
                        <div id="solar-panel-${idx}" class="solar-panel-card cursor-pointer h-28 rounded-xl border-2 border-amber-600 bg-gradient-to-b from-amber-900 to-amber-950 p-2 flex flex-col justify-between items-center transition relative overflow-hidden shadow-inner">
                            <span class="text-[10px] font-mono-tech text-amber-300 font-bold z-10">PANEL 0${idx}</span>
                            <div class="panel-dust-layer absolute inset-0 bg-amber-700/60 flex items-center justify-center text-amber-300 text-xs font-mono-tech font-bold z-0">
                                40% DUST COVER
                            </div>
                            <span class="panel-status-txt text-[9px] font-mono-tech text-amber-200 z-10">CLICK / WIPE</span>
                        </div>
                    `).join('')}
                </div>

                <!-- Wiper Status Bar -->
                <div class="flex items-center justify-between text-xs font-mono-tech">
                    <span class="text-slate-300">CLEANING PROGRESS:</span>
                    <span id="wiper-counter" class="text-amber-400 font-bold">0 / 4 Panels Restored</span>
                </div>
            </div>
        `;

        const counter = container.querySelector('#wiper-counter');

        [1, 2, 3, 4].forEach(idx => {
            const panel = container.querySelector(`#solar-panel-${idx}`);
            panel.addEventListener('click', () => {
                if (cleanedPanels[idx]) return;
                cleanedPanels[idx] = true;
                playSfx('click');

                panel.className = 'solar-panel-card h-28 rounded-xl border-2 border-sky-400 bg-gradient-to-b from-sky-950 to-blue-950 p-2 flex flex-col justify-between items-center transition relative overflow-hidden shadow-lg';
                panel.querySelector('.panel-dust-layer').style.display = 'none';
                panel.querySelector('.panel-status-txt').textContent = '100% CLEAR';
                panel.querySelector('.panel-status-txt').className = 'text-[9px] font-mono-tech text-emerald-400 font-bold z-10';

                const count = Object.values(cleanedPanels).filter(Boolean).length;
                if (counter) counter.textContent = `${count} / 4 Panels Restored`;

                if (count === 4) {
                    playSfx('success');
                    if (window.state) window.state.dustWiped = true;
                    setTimeout(() => {
                        showActivitySuccess(
                            container,
                            'ch4_dust_wipers',
                            'Solar Array Dust Wipers Restored',
                            'Electrostatic dust layer has been purged across all four primary photovoltaic strings. Array output has surged back to nominal daytime generation.',
                            onComplete
                        );
                    }, 500);
                }
            });
        });
    }

    /* =========================================================================
     * MISSION 5: THE ZERO-VISIBILITY EVA (Sol 190–205) [75s Emergency]
     * ========================================================================= */

    // Task 1: Put on EVA Suit (Suit Preparation & Umbilical Lock)
    function renderM5T1_PutOnSuit(container, onComplete) {
        let umbilicalLocked = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Controlled EVA Suit Bay (Emergency Prep)',
                '1. Verify the environmental storm radar confirms a safe controlled EVA window. 2. Lock the Life-Support Umbilical coupler. 3. Confirm suit pressure integrity before proceeding to airlock cycling.',
                'Lock the umbilical coupler and run the pressure integrity test!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Umbilical Lock Control -->
                <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                        <div class="text-xs font-bold text-white">ORION PLSS UMBILICAL COUPLER:</div>
                        <div class="text-[10px] text-slate-400">Oxygen delivery and biometric telemetry umbilical</div>
                    </div>
                    <button id="btn-lock-umbilical" class="btn-tech bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400 px-4 py-2 rounded-xl text-xs font-mono-tech font-bold cursor-pointer">
                        <i id="umbilical-icon" class="fa-solid fa-link-slash mr-1"></i>
                        <span id="umbilical-lbl">Click to Lock Coupler</span>
                    </button>
                </div>

                <button id="btn-pass-check" disabled class="w-full btn-tech bg-slate-800 text-slate-500 cursor-not-allowed py-2.5 rounded-xl text-xs font-mono-tech font-bold">
                    Lock Umbilical First to Verify Pressure Integrity
                </button>
            </div>
        `;

        const btnLock = container.querySelector('#btn-lock-umbilical');
        const icon = container.querySelector('#umbilical-icon');
        const lbl = container.querySelector('#umbilical-lbl');
        const btnPass = container.querySelector('#btn-pass-check');

        btnLock.addEventListener('click', () => {
            playSfx('cableSnap');
            umbilicalLocked = true;
            icon.className = 'fa-solid fa-link text-emerald-400 mr-1';
            lbl.textContent = 'Umbilical Locked & Hermetic';
            btnLock.className = 'btn-tech bg-emerald-950/40 text-emerald-300 border border-emerald-400 px-4 py-2 rounded-xl text-xs font-mono-tech font-bold';

            btnPass.disabled = false;
            btnPass.className = 'w-full btn-tech bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs font-mono-tech cursor-pointer shadow-lg animate-pulse';
            btnPass.textContent = 'Pass Pressure Integrity Check & Proceed';
        });

        btnPass.addEventListener('click', () => {
            if (window.state && window.state.player) {
                window.state.player.inSuit = true;
                window.state.player.suitChecked = true;
            }
            showActivitySuccess(
                container,
                'ch5_eva_suit',
                'EVA Suit Sealed & Pressurized',
                'Astronaut EVA suit integrity is 100% verified. Never attempt an exterior sortie until all seals pass automated decay tests.',
                onComplete
            );
        });
    }

    // Task 2: Cycle Outer Airlock Door (Interlock + Depressurization to 0.6 kPa)
    function renderM5T2_CycleOuterDoor(container, onComplete) {
        let innerDoorVerified = false;
        let chamberKPa = 101.3;
        let isDepressurized = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Dual-Door Airlock Interlock Protocol',
                '1. Verify and lock the Inner Habitat Door. 2. Rotate the Depressurization Valve to evacuate airlock atmosphere down to Martian surface pressure (0.6 kPa). 3. Unlock the Outer Hatch.',
                'Both doors must NEVER open simultaneously! Depressurize the chamber to 0.6 kPa before opening outer door.'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Dual Door Status Schematic -->
                <div class="grid grid-cols-2 gap-3 text-center">
                    <div id="door-inner-card" class="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-1">
                        <span class="text-[10px] font-mono-tech text-slate-400 block">INNER HABITAT DOOR</span>
                        <div id="door-inner-status" class="font-mono-tech font-bold text-xs text-amber-300">● UNLOCKED</div>
                        <button id="btn-lock-inner" class="btn-tech bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-1 rounded text-[10px] font-mono-tech cursor-pointer">
                            Lock Inner Door
                        </button>
                    </div>

                    <div id="door-outer-card" class="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-1 opacity-50">
                        <span class="text-[10px] font-mono-tech text-slate-400 block">OUTER MARS HATCH</span>
                        <div id="door-outer-status" class="font-mono-tech font-bold text-xs text-rose-400">● INTERLOCKED</div>
                        <button id="btn-open-outer" disabled class="btn-tech bg-slate-800 text-slate-500 px-3 py-1 rounded text-[10px] font-mono-tech cursor-not-allowed">
                            Depressurize First
                        </button>
                    </div>
                </div>

                <!-- Depress Valve Control -->
                <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                        <div class="text-xs font-bold text-white">CHAMBER PRESSURE:</div>
                        <div id="depress-kpa-val" class="text-sm font-mono-tech font-bold text-sky-400">101.3 kPa</div>
                    </div>
                    <button id="btn-depress-valve" disabled class="btn-tech bg-slate-800 text-slate-500 cursor-not-allowed px-4 py-2 rounded-xl text-xs font-mono-tech font-bold">
                        Lock Inner Door First
                    </button>
                </div>
            </div>
        `;

        const btnLockInner = container.querySelector('#btn-lock-inner');
        const innerStatus = container.querySelector('#door-inner-status');
        const btnDepress = container.querySelector('#btn-depress-valve');
        const depressVal = container.querySelector('#depress-kpa-val');
        const btnOpenOuter = container.querySelector('#btn-open-outer');
        const outerStatus = container.querySelector('#door-outer-status');
        const outerCard = container.querySelector('#door-outer-card');

        btnLockInner.addEventListener('click', () => {
            playSfx('click');
            innerDoorVerified = true;
            innerStatus.textContent = '● SEALED & LOCKED';
            innerStatus.className = 'font-mono-tech font-bold text-xs text-emerald-400';
            btnLockInner.disabled = true;
            btnLockInner.className = 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded text-[10px] font-mono-tech';

            btnDepress.disabled = false;
            btnDepress.className = 'btn-tech bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs font-mono-tech cursor-pointer shadow animate-pulse';
            btnDepress.textContent = 'Rotate Depress Valve (Evacuate to 0.6 kPa)';
        });

        btnDepress.addEventListener('click', () => {
            if (!innerDoorVerified || isDepressurized) return;
            playSfx('airlockHiss');
            btnDepress.disabled = true;
            btnDepress.textContent = 'Evacuating Atmosphere...';

            let timer = setInterval(() => {
                chamberKPa -= 15.0;
                if (chamberKPa <= 0.6) {
                    chamberKPa = 0.6;
                    clearInterval(timer);
                    isDepressurized = true;
                    playSfx('success');
                    depressVal.textContent = '0.6 kPa (Mars Surface Ambient)';
                    depressVal.className = 'text-sm font-mono-tech font-bold text-emerald-400';
                    btnDepress.textContent = 'Depressurization Complete';

                    outerCard.classList.remove('opacity-50');
                    btnOpenOuter.disabled = false;
                    btnOpenOuter.className = 'btn-tech bg-sky-600 hover:bg-sky-500 text-white font-bold px-3 py-1 rounded text-[10px] font-mono-tech cursor-pointer shadow animate-pulse';
                    btnOpenOuter.textContent = 'Unlock Outer Hatch';
                } else {
                    depressVal.textContent = `${chamberKPa.toFixed(1)} kPa`;
                }
            }, 100);
        });

        btnOpenOuter.addEventListener('click', () => {
            playSfx('pickup');
            outerStatus.textContent = '● UNLOCKED & OPEN';
            outerStatus.className = 'font-mono-tech font-bold text-xs text-emerald-400';
            if (window.state && window.state.player) {
                window.state.player.outerDoorOpen = true;
            }

            setTimeout(() => {
                showActivitySuccess(
                    container,
                    'ch5_cycle_door',
                    'Outer Airlock Door Unlocked Safely',
                    'The airlock interlock strictly prevented both hatches from opening simultaneously, while the vacuum turbopumps reclaimed airlock gas back into the habitat buffer.',
                    onComplete
                );
            }, 500);
        });
    }

    // Task 3: Repair Solar Cable Junction with Spare Fuse (Fuse Drag + Terminal Wiring + Circuit Test)
    function renderM5T3_RepairJunction(container, onComplete) {
        let fuseInstalled = false;
        let redConnected = false;
        let blueConnected = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Solar High-Voltage Junction Box',
                '1. Replace the charred fuse by dragging in the spare 50A fuse. 2. Connect the Positive (+480V) and Negative (-480V) cables to their matching terminals. 3. Run the circuit test.',
                'Drag the spare fuse into the center socket, then connect the Red (+) and Blue (-) cables!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Junction Box Canvas / Interactive Diagram -->
                <div class="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col items-center gap-4">
                    <!-- Fuse Socket -->
                    <div id="fuse-socket" class="w-48 h-14 rounded-xl border-2 border-dashed border-amber-400/60 flex items-center justify-center p-2 text-center transition">
                        <span id="fuse-socket-lbl" class="text-[10px] font-mono-tech text-amber-300">BLOWN FUSE SOCKET (CLICK / DRAG SPARE)</span>
                    </div>

                    <!-- Cable Terminals -->
                    <div class="w-full flex items-center justify-around gap-4 pt-2 border-t border-slate-800">
                        <button id="btn-wire-red" class="btn-tech bg-slate-950 border-2 border-red-500/60 text-red-300 hover:border-red-400 px-4 py-2 rounded-xl text-xs font-mono-tech font-bold cursor-pointer">
                            <i id="wire-red-icon" class="fa-solid fa-plug text-red-500 mr-1"></i>
                            <span id="wire-red-lbl">Connect +480V (Red)</span>
                        </button>

                        <button id="btn-wire-blue" class="btn-tech bg-slate-950 border-2 border-blue-500/60 text-blue-300 hover:border-blue-400 px-4 py-2 rounded-xl text-xs font-mono-tech font-bold cursor-pointer">
                            <i id="wire-blue-icon" class="fa-solid fa-plug text-blue-500 mr-1"></i>
                            <span id="wire-blue-lbl">Connect -480V (Blue)</span>
                        </button>
                    </div>
                </div>

                <!-- Test Button -->
                <button id="btn-circuit-test" disabled class="w-full btn-tech bg-slate-800 text-slate-500 cursor-not-allowed py-2.5 rounded-xl text-xs font-mono-tech font-bold">
                    Complete Fuse & Cable Connections to Test Circuit
                </button>
            </div>
        `;

        const fuseSocket = container.querySelector('#fuse-socket');
        const fuseLbl = container.querySelector('#fuse-socket-lbl');
        const btnRed = container.querySelector('#btn-wire-red');
        const redIcon = container.querySelector('#wire-red-icon');
        const redLbl = container.querySelector('#wire-red-lbl');
        const btnBlue = container.querySelector('#btn-wire-blue');
        const blueIcon = container.querySelector('#wire-blue-icon');
        const blueLbl = container.querySelector('#wire-blue-lbl');
        const btnTest = container.querySelector('#btn-circuit-test');

        function checkReady() {
            if (fuseInstalled && redConnected && blueConnected) {
                btnTest.disabled = false;
                btnTest.className = 'w-full btn-tech bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs font-mono-tech cursor-pointer shadow-lg animate-pulse';
                btnTest.textContent = 'Run Circuit Test & Restore Solar Array';
            }
        }

        fuseSocket.addEventListener('click', () => {
            playSfx('pickup');
            fuseInstalled = true;
            fuseSocket.className = 'w-48 h-14 rounded-xl border-2 border-emerald-400 bg-emerald-950/40 flex items-center justify-center p-2 text-center';
            fuseLbl.innerHTML = `<span class="text-xs font-bold text-emerald-300 font-mono-tech"><i class="fa-solid fa-check mr-1"></i> 50A Ceramic Fuse OK</span>`;
            checkReady();
        });

        btnRed.addEventListener('click', () => {
            playSfx('cableSnap');
            redConnected = true;
            btnRed.className = 'btn-tech bg-red-950/50 border-2 border-red-500 text-red-200 px-4 py-2 rounded-xl text-xs font-mono-tech font-bold';
            redIcon.className = 'fa-solid fa-circle-check text-red-400 mr-1';
            redLbl.textContent = '+480V Terminal Connected';
            checkReady();
        });

        btnBlue.addEventListener('click', () => {
            playSfx('cableSnap');
            blueConnected = true;
            btnBlue.className = 'btn-tech bg-blue-950/50 border-2 border-blue-500 text-blue-200 px-4 py-2 rounded-xl text-xs font-mono-tech font-bold';
            blueIcon.className = 'fa-solid fa-circle-check text-blue-400 mr-1';
            blueLbl.textContent = '-480V Terminal Connected';
            checkReady();
        });

        btnTest.addEventListener('click', () => {
            playSfx('success');
            if (window.state && window.state.faults) {
                window.state.faults.externalConduitDamaged = false;
            }
            showActivitySuccess(
                container,
                'ch5_repair_junction',
                'Solar Cable Junction Repaired',
                'Proper terminal polarization (+480V to +, -480V to -) and replacement of the 50A fuse restored electrical continuity to the external photovoltaic string.',
                onComplete
            );
        });
    }

    /* =========================================================================
     * MISSION 6: ECLSS SCRUBBER SATURATION (Sol 250–265) [75s Emergency]
     * ========================================================================= */

    // Task 1: Collect Fresh LiOH Canister
    function renderM6T1_CollectLiOH(container, onComplete) {
        container.innerHTML = `
            ${createActivityHeader(
                'Storage Locker Chemical Cache',
                'Locate and retrieve the fresh Lithium Hydroxide (LiOH) CO₂ scrubber canister from the shelf and transfer it to your pouch.',
                'Click or drag the fresh LiOH cartridge into your pouch!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Info Card on LiOH chemistry -->
                <div class="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-[11px] text-slate-300">
                    <strong class="text-teal-300 font-mono-tech">ECLSS Chemistry:</strong>
                    Lithium hydroxide binds carbon dioxide in an exothermic chemical reaction:
                    <span class="font-mono-tech text-amber-300 block mt-1">2 LiOH + CO₂ → Li₂CO₃ + H₂O</span>
                </div>

                <!-- Shelf Items -->
                <div class="grid grid-cols-2 gap-3">
                    <div id="item-lioh-canister" class="bg-slate-900 border-2 border-teal-400 hover:border-teal-300 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition">
                        <i class="fa-solid fa-fan text-teal-400 text-3xl"></i>
                        <span class="text-xs font-bold text-white font-mono-tech">Fresh LiOH Canister</span>
                        <span class="text-[9px] text-teal-300 font-mono-tech">Click to Equip</span>
                    </div>

                    <div class="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center gap-1 opacity-50 select-none">
                        <i class="fa-solid fa-box text-slate-600 text-2xl"></i>
                        <span class="text-[10px] text-slate-500 font-mono-tech">Spent Filter</span>
                    </div>
                </div>
            </div>
        `;

        const canister = container.querySelector('#item-lioh-canister');
        canister.addEventListener('click', () => {
            playSfx('pickup');
            if (typeof window.addItem === 'function') window.addItem('LiOH Filter');
            showActivitySuccess(
                container,
                'ch6_filter_grab',
                'Fresh LiOH Canister Acquired',
                'Lithium hydroxide canisters provide dependable, passive carbon dioxide removal during primary mechanical scrubber failures on spacecraft like Apollo, Orion, and the ISS.',
                onComplete
            );
        });
    }

    // Task 2: Replace Saturated Scrubber (Isolation Valve + Latch Clamps + Canister Swap)
    function renderM6T2_ReplaceScrubber(container, onComplete) {
        let isIsolated = false;
        let oldRemoved = false;
        let newInstalled = false;

        container.innerHTML = `
            ${createActivityHeader(
                'ECLSS Scrubber Manifold Bay',
                '1. Flip isolation valve to bypass the saturated unit. 2. Remove the old saturated canister. 3. Insert the fresh LiOH canister from your pouch. 4. Restore the flow pathway.',
                'Isolate the unit first, pull out the saturated canister, and insert the fresh one!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Isolation Switch -->
                <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span class="text-xs font-bold text-white">UNIT ISOLATION BYPASS:</span>
                    <button id="btn-isolate-scrubber" class="btn-tech bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400 px-4 py-1.5 rounded-lg text-xs font-mono-tech font-bold cursor-pointer">
                        <i id="isolate-icon" class="fa-solid fa-toggle-off mr-1"></i>
                        <span id="isolate-lbl">Inline (Click to Isolate)</span>
                    </button>
                </div>

                <!-- Canister Slot -->
                <div id="scrubber-bay" class="h-24 bg-slate-900 border-2 border-dashed border-amber-500/60 rounded-xl flex items-center justify-center p-3 opacity-50 transition">
                    <span id="bay-status-lbl" class="text-xs font-mono-tech text-amber-300 font-bold">Isolate Unit First to Open Bay</span>
                </div>
            </div>
        `;

        const btnIsolate = container.querySelector('#btn-isolate-scrubber');
        const isolateIcon = container.querySelector('#isolate-icon');
        const isolateLbl = container.querySelector('#isolate-lbl');
        const bay = container.querySelector('#scrubber-bay');
        const bayLbl = container.querySelector('#bay-status-lbl');

        btnIsolate.addEventListener('click', () => {
            playSfx('click');
            isIsolated = true;
            isolateIcon.className = 'fa-solid fa-toggle-on text-emerald-400 mr-1';
            isolateLbl.textContent = 'Isolated (Safe to Open)';
            btnIsolate.className = 'btn-tech bg-emerald-950/40 text-emerald-300 border border-emerald-400 px-4 py-1.5 rounded-lg text-xs font-mono-tech font-bold';

            bay.classList.remove('opacity-50');
            bay.className = 'h-24 bg-slate-900 border-2 border-amber-400 rounded-xl flex items-center justify-center p-3 cursor-pointer hover:bg-slate-800 transition shadow';
            bayLbl.textContent = '1. Click to Remove Saturated Canister';
        });

        bay.addEventListener('click', () => {
            if (!isIsolated) return;

            if (!oldRemoved) {
                playSfx('pickup');
                oldRemoved = true;
                bayLbl.textContent = '2. Click to Insert Fresh LiOH Canister';
                bay.className = 'h-24 bg-slate-900 border-2 border-dashed border-teal-400 rounded-xl flex items-center justify-center p-3 cursor-pointer shadow';
            } else if (!newInstalled) {
                playSfx('cableSnap');
                newInstalled = true;
                bayLbl.innerHTML = `<span class="text-emerald-300 font-bold font-mono-tech"><i class="fa-solid fa-check mr-1"></i> Fresh LiOH Canister Locked in Bay</span>`;
                bay.className = 'h-24 bg-emerald-950/40 border-2 border-emerald-400 rounded-xl flex items-center justify-center p-3 shadow-lg';

                if (window.state && window.state.faults) {
                    window.state.faults.co2FilterClogged = false;
                }

                setTimeout(() => {
                    showActivitySuccess(
                        container,
                        'ch6_filter_install',
                        'Saturated Scrubber Replaced',
                        'Fresh lithium hydroxide canister successfully seated and clamped. Active chemical absorption of exhaled CO₂ has resumed.',
                        onComplete
                    );
                }, 500);
            }
        });
    }

    // Task 3: Verify CO2 Levels (Live Animated Drop below 500 ppm)
    function renderM6T3_VerifyCO2(container, onComplete) {
        let co2 = 1800;
        let fanOn = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Cabin Atmosphere CO₂ Analyzer',
                'Activate the scrubber booster fan to force cabin air through the new LiOH canister. Monitor the live ppm concentration until it falls below the safe baseline of 500 ppm.',
                'Turn on the booster fan and watch carbon dioxide drop below 500 ppm!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Gauge View -->
                <div class="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <span class="text-[10px] font-mono-tech text-slate-400 uppercase tracking-wider">CARBON DIOXIDE CONCENTRATION</span>
                    <div id="co2-monitor-val" class="text-3xl font-mono-tech font-black text-rose-400 mt-1">1,800 ppm</div>
                    <div id="co2-monitor-status" class="text-xs font-mono-tech text-rose-400 font-bold mt-1">● ACUTE HYPERCAPNIA RISK</div>
                </div>

                <button id="btn-toggle-fan" class="w-full btn-tech bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer shadow-lg animate-pulse">
                    <i class="fa-solid fa-fan"></i>
                    <span>Activate Scrubber Booster Fan</span>
                </button>
            </div>
        `;

        const btnFan = container.querySelector('#btn-toggle-fan');
        const valEl = container.querySelector('#co2-monitor-val');
        const statusEl = container.querySelector('#co2-monitor-status');

        btnFan.addEventListener('click', () => {
            if (fanOn) return;
            fanOn = true;
            playSfx('airlockHiss');
            btnFan.disabled = true;
            btnFan.className = 'w-full bg-slate-800 text-teal-300 py-2.5 rounded-xl text-xs font-mono-tech font-bold';
            btnFan.textContent = 'Booster Fan Running (Air Cycling...)';

            let timer = setInterval(() => {
                co2 -= 120;
                if (valEl) valEl.textContent = `${co2.toLocaleString()} ppm`;

                if (co2 <= 500) {
                    co2 = 440;
                    clearInterval(timer);
                    playSfx('success');
                    if (valEl) {
                        valEl.textContent = '440 ppm';
                        valEl.className = 'text-3xl font-mono-tech font-black text-emerald-400';
                    }
                    if (statusEl) {
                        statusEl.textContent = '● OPTIMAL SPACECRAFT BASELINE (<500 ppm)';
                        statusEl.className = 'text-xs font-mono-tech text-emerald-400 font-bold';
                    }
                    if (window.state) window.state.co2PPM = 440;

                    setTimeout(() => {
                        showActivitySuccess(
                            container,
                            'ch6_co2_verify',
                            'CO₂ Concentration Restored (<500 ppm)',
                            'CO₂ levels safely lowered to 440 ppm. NASA spacecraft maintain tight atmospheric CO₂ limits to prevent cognitive fatigue, headaches, and sleep disruption among the crew.',
                            onComplete
                        );
                    }, 600);
                } else if (co2 <= 1000) {
                    if (valEl) valEl.className = 'text-3xl font-mono-tech font-black text-amber-300';
                    if (statusEl) {
                        statusEl.textContent = '● MODERATE CO₂ (PURGING...)';
                        statusEl.className = 'text-xs font-mono-tech text-amber-300 font-bold';
                    }
                }
            }, 150);
        });
    }

    /* =========================================================================
     * MISSION 7: THE JEZERO DELTA CORE EXPEDITION (Sol 295–315)
     * ========================================================================= */

    // Task 1: Retrieve Drill Core Sample (Keycode 3-7-8 + Tube Transfer)
    function renderM7T1_RetrieveCore(container, onComplete) {
        let enteredCode = '';
        const targetCode = '378';

        container.innerHTML = `
            ${createActivityHeader(
                'Perseverance Sample Caching Carousel',
                'Enter security code "3-7-8" (representing our 378-Sol mission) to unlock the ACA carousel. Drag the core tube into your sealed sample case.',
                'Use the keypad to enter code 3-7-8, then retrieve the titanium tube!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <div class="flex flex-col items-center gap-3">
                    <!-- Keypad Display -->
                    <div id="keypad-disp" class="w-48 h-10 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center font-mono-tech font-bold text-lg text-amber-400">
                        ---
                    </div>

                    <!-- 3x3 Keypad -->
                    <div class="grid grid-cols-3 gap-2 w-48">
                        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `
                            <button data-num="${n}" class="btn-num btn-tech bg-slate-800 hover:bg-slate-700 text-white font-mono-tech font-bold py-2 rounded-lg text-sm cursor-pointer">
                                ${n}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Sample Drawer (Appears upon unlock) -->
                <div id="core-sample-drawer" class="hidden p-3 bg-slate-900 rounded-xl border border-emerald-400 text-center space-y-2">
                    <span class="text-xs font-bold text-emerald-400 font-mono-tech">CAROUSEL UNLOCKED: CORE-JEZERO-DELTA-04</span>
                    <button id="btn-grab-core" class="btn-tech bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 mx-auto cursor-pointer shadow">
                        <i class="fa-solid fa-vial"></i>
                        <span>Transfer Titanium Core Tube to Sample Case</span>
                    </button>
                </div>
            </div>
        `;

        const disp = container.querySelector('#keypad-disp');
        const drawer = container.querySelector('#core-sample-drawer');

        container.querySelectorAll('.btn-num').forEach(btn => {
            btn.addEventListener('click', () => {
                playSfx('click');
                enteredCode += btn.dataset.num;
                if (enteredCode.length > 3) enteredCode = btn.dataset.num;
                disp.textContent = enteredCode;

                if (enteredCode === targetCode) {
                    playSfx('success');
                    drawer.classList.remove('hidden');
                    const btnGrab = container.querySelector('#btn-grab-core');
                    if (btnGrab) {
                        btnGrab.addEventListener('click', () => {
                            playSfx('pickup');
                            if (window.state) window.state.hasCoreSample = true;
                            showActivitySuccess(
                                container,
                                'ch7_drill_core',
                                'Jezero Delta Core Sample Retrieved',
                                'Titanium core tube sealed hermetically. Perseverance’s coring drill collects 13-gram rock cylinders specifically targeting ancient fine-grained lakebed sediments that could preserve biosignatures.',
                                onComplete
                            );
                        });
                    }
                }
            });
        });
    }

    // Task 2: Insert Sample into Raman Spectrometer (Slide Chamber + Laser Hold)
    function renderM7T2_RamanLaser(container, onComplete) {
        let chamberOpen = false;
        let tubeLoaded = false;
        let isScanned = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Precision Raman Spectrometer Chamber',
                '1. Slide open the sample chamber drawer. 2. Load the titanium core tube. 3. Close the drawer and hold the Raman Laser Scan button for 2 seconds.',
                'Open chamber, load the sample, and hold the 532nm green laser scan button!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Chamber Stage -->
                <div id="raman-stage" class="h-28 bg-slate-900 border-2 border-slate-700 rounded-xl flex items-center justify-center p-3 relative overflow-hidden transition">
                    <span id="raman-stage-lbl" class="text-xs font-mono-tech text-slate-400">1. Click to Slide Open Specimen Chamber</span>
                    <div id="laser-beam" class="hidden absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                        <div class="w-full h-1 bg-emerald-400 shadow-[0_0_15px_#22c55e] animate-pulse"></div>
                    </div>
                </div>

                <!-- Laser Hold Button -->
                <button id="btn-hold-laser" disabled class="w-full btn-tech bg-slate-800 text-slate-500 cursor-not-allowed py-2.5 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 relative overflow-hidden select-none">
                    <div id="laser-progress-fill" class="absolute left-0 top-0 bottom-0 bg-emerald-500/50 w-0 transition-all duration-75"></div>
                    <i class="fa-solid fa-wand-magic-sparkles relative z-10"></i>
                    <span id="laser-lbl" class="relative z-10">Load Sample to Arm Laser</span>
                </button>
            </div>
        `;

        const stage = container.querySelector('#raman-stage');
        const stageLbl = container.querySelector('#raman-stage-lbl');
        const laserBeam = container.querySelector('#laser-beam');
        const btnLaser = container.querySelector('#btn-hold-laser');
        const fillBar = container.querySelector('#laser-progress-fill');
        const laserLbl = container.querySelector('#laser-lbl');

        stage.addEventListener('click', () => {
            if (!chamberOpen) {
                playSfx('click');
                chamberOpen = true;
                stageLbl.textContent = '2. Click to Insert Titanium Sample Tube into V-Groove';
                stage.className = 'h-28 bg-slate-900 border-2 border-amber-400 rounded-xl flex items-center justify-center p-3 cursor-pointer shadow';
            } else if (!tubeLoaded) {
                playSfx('pickup');
                tubeLoaded = true;
                stageLbl.textContent = 'Sample Loaded & Chamber Sealed (Ready for Laser)';
                stage.className = 'h-28 bg-slate-900 border-2 border-emerald-400 rounded-xl flex items-center justify-center p-3';

                btnLaser.disabled = false;
                btnLaser.className = 'w-full btn-tech bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer shadow-lg animate-pulse';
                laserLbl.textContent = 'HOLD 532nm RAMAN LASER SCAN (2 SECONDS)';
            }
        });

        // Hold laser
        let timer = null;
        let progress = 0;

        const startHold = () => {
            if (!tubeLoaded || isScanned) return;
            playSfx('scan');
            if (laserBeam) laserBeam.classList.remove('hidden');
            progress = 0;
            timer = setInterval(() => {
                progress += 5;
                if (fillBar) fillBar.style.width = `${progress}%`;
                if (progress >= 100) {
                    clearInterval(timer);
                    isScanned = true;
                    playSfx('success');
                    if (window.state) window.state.ramanScanned = true;
                    if (laserBeam) laserBeam.classList.add('hidden');
                    laserLbl.textContent = 'SPECTRAL EMISSION DATA CAPTURED';

                    setTimeout(() => {
                        showActivitySuccess(
                            container,
                            'ch7_raman_insert',
                            'Raman Spectroscopy Scan Complete',
                            'Non-destructive 532nm green laser excitation successfully induced Raman vibrational scattering, generating molecular bond fingerprint peaks for mineralogical analysis.',
                            onComplete
                        );
                    }, 500);
                }
            }, 100);
        };

        const stopHold = () => {
            if (timer) clearInterval(timer);
            if (!isScanned) {
                progress = 0;
                if (fillBar) fillBar.style.width = '0%';
                if (laserBeam) laserBeam.classList.add('hidden');
            }
        };

        btnLaser.addEventListener('mousedown', startHold);
        window.addEventListener('mouseup', stopHold);
        btnLaser.addEventListener('touchstart', startHold, { passive: true });
        window.addEventListener('touchend', stopHold);
    }

    // Task 3: Catalogue Mineral Composition (Spectral Graph Matching)
    function renderM7T3_CatalogueMineral(container, onComplete) {
        container.innerHTML = `
            ${createActivityHeader(
                'Raman Spectroscopic Mineral Matcher',
                'Compare the sample’s vibrational spectrum peaks (360 cm⁻¹ and 705 cm⁻¹) against the reference database. Select the mineral match and store it in the expedition logbook.',
                'Match the dual peaks at 360 and 705 cm⁻¹. Smectite Clay indicates liquid water in Jezero’s ancient past!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Spectrum Plot SVG -->
                <div class="w-full h-36 bg-slate-900 rounded-xl border border-slate-700 p-2 relative flex flex-col justify-between">
                    <div class="flex items-center justify-between text-[10px] font-mono-tech text-slate-400">
                        <span>Intensity (Counts)</span>
                        <span class="text-amber-400 font-bold">PEAKS DETECTED: 360 cm⁻¹ & 705 cm⁻¹</span>
                    </div>
                    <!-- Simplified Spectrum Curve -->
                    <svg viewBox="0 0 300 70" class="w-full h-20">
                        <path d="M 0 60 Q 30 60, 45 60 Q 60 60, 70 20 Q 80 60, 110 60 Q 140 60, 160 10 Q 180 60, 300 60" fill="none" stroke="#22d3ee" stroke-width="2.5"/>
                        <!-- Peak Labels -->
                        <text x="65" y="15" fill="#f59e0b" font-size="8" font-family="monospace">360 cm⁻¹</text>
                        <text x="155" y="8" fill="#f59e0b" font-size="8" font-family="monospace">705 cm⁻¹</text>
                    </svg>
                    <div class="flex justify-between text-[9px] font-mono-tech text-slate-500">
                        <span>200 cm⁻¹</span>
                        <span>Raman Shift (cm⁻¹)</span>
                        <span>1200 cm⁻¹</span>
                    </div>
                </div>

                <!-- 4 Mineral Match Options -->
                <div class="grid grid-cols-2 gap-2">
                    <button data-mineral="basalt" class="mineral-opt-btn btn-tech bg-slate-900 border border-slate-700 hover:border-amber-400 p-2.5 rounded-xl text-left cursor-pointer">
                        <div class="text-xs font-bold text-white">1. Volcanic Basalt</div>
                        <div class="text-[9px] text-slate-400 font-mono-tech">Pyroxene (Peak: 660 cm⁻¹)</div>
                    </button>

                    <button data-mineral="clay" class="mineral-opt-btn btn-tech bg-slate-900 border-2 border-sky-400/80 hover:border-sky-300 p-2.5 rounded-xl text-left cursor-pointer shadow">
                        <div class="text-xs font-bold text-sky-300">2. Smectite Clay</div>
                        <div class="text-[9px] text-emerald-400 font-mono-tech">Phyllosilicate (Peaks: 360 & 705 cm⁻¹)</div>
                    </button>

                    <button data-mineral="quartz" class="mineral-opt-btn btn-tech bg-slate-900 border border-slate-700 hover:border-amber-400 p-2.5 rounded-xl text-left cursor-pointer">
                        <div class="text-xs font-bold text-white">3. Dry Quartz</div>
                        <div class="text-[9px] text-slate-400 font-mono-tech">Silica (Single Peak: 465 cm⁻¹)</div>
                    </button>

                    <button data-mineral="anhydrite" class="mineral-opt-btn btn-tech bg-slate-900 border border-slate-700 hover:border-amber-400 p-2.5 rounded-xl text-left cursor-pointer">
                        <div class="text-xs font-bold text-white">4. Anhydrite</div>
                        <div class="text-[9px] text-slate-400 font-mono-tech">Sulfate (Peak: 1018 cm⁻¹)</div>
                    </button>
                </div>
            </div>
        `;

        container.querySelectorAll('.mineral-opt-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const m = btn.dataset.mineral;
                if (m === 'clay') {
                    playSfx('success');
                    if (window.state) window.state.mineralCatalogued = true;
                    showActivitySuccess(
                        container,
                        'ch7_catalogue_mineral',
                        'Mineral Identified: Smectite Clay',
                        'Spectroscopic peaks at 360 and 705 cm⁻¹ confirm hydrated smectite clay minerals. Clays only form in sustained, neutral-pH liquid water, providing definitive evidence of Jezero Crater’s ancient habitable river delta.',
                        onComplete
                    );
                } else {
                    playSfx('alert');
                    setCompanionHint('Incorrect mineral spectrum match. Compare the peak labels (360 and 705 cm⁻¹) with Smectite Clay!');
                }
            });
        });
    }

    /* =========================================================================
     * MISSION 8: THE GRAYWATER BIOFILM CRISIS (Sol 330–345) [75s Emergency]
     * ========================================================================= */

    // Task 1: Collect Pipe Seal Kit
    function renderM8T1_CollectSealKit(container, onComplete) {
        container.innerHTML = `
            ${createActivityHeader(
                'Storage Locker Plumbing Rig',
                'Collect the Pipe Seal Kit (containing PTFE sealant tape, mechanical coupling clamps, and food-grade biocide wash) from the storage locker into your pouch.',
                'Click to equip the plumbing repair kit!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 flex items-center justify-center">
                <div id="item-seal-kit" class="bg-slate-900 border-2 border-sky-400 hover:border-sky-300 p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition max-w-xs text-center">
                    <i class="fa-solid fa-faucet-drip text-sky-400 text-3xl"></i>
                    <span class="text-xs font-bold text-white font-mono-tech">Pipe Seal & Biocide Kit</span>
                    <span class="text-[9px] text-slate-400">Plumbing clamps & biocide flush</span>
                    <span class="text-[10px] text-amber-300 font-mono-tech font-bold mt-1">Click to Equip in Pouch</span>
                </div>
            </div>
        `;

        container.querySelector('#item-seal-kit').addEventListener('click', () => {
            playSfx('pickup');
            if (typeof window.addItem === 'function') window.addItem('Pipe Seal Kit');
            showActivitySuccess(
                container,
                'ch8_pipe_seal',
                'Pipe Seal Kit Acquired',
                'Astronauts use food-grade biocide and quick-coupling mechanical clamps to service water recycling lines without introducing toxic contaminants into the closed loop.',
                onComplete
            );
        });
    }

    // Task 2: Flush Water Purifier (Valve Isolation + Biocide Backflush Hold)
    function renderM8T2_FlushPurifier(container, onComplete) {
        let isolated = false;
        let isFlushed = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Water-Reclamation Catalytic Filter',
                '1. Close the Main Inlet Valve to isolate the biofilm-clogged membrane. 2. Hold the Biocide Back-Flush button for 2 seconds. 3. Re-open the main flow line.',
                'Close the inlet valve first, then inject biocide to clear the biofilm!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Filter Status Banner -->
                <div id="filter-status-box" class="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-center justify-between">
                    <div>
                        <div class="text-xs font-bold text-amber-300">BIOFILM RESIDUE: OBSTRUCTED</div>
                        <div class="text-[10px] text-slate-400">Flow restriction at 20% throughput</div>
                    </div>
                    <i class="fa-solid fa-bacteria text-amber-400 text-2xl animate-pulse"></i>
                </div>

                <!-- Valve Toggle -->
                <button id="btn-isolate-water" class="w-full btn-tech bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-2.5 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer">
                    <i id="water-valve-icon" class="fa-solid fa-faucet text-amber-400"></i>
                    <span id="water-valve-lbl">1. Close Main Inlet Valve (Currently Open)</span>
                </button>

                <!-- Biocide Flush Button -->
                <button id="btn-hold-biocide" disabled class="w-full btn-tech bg-slate-800 text-slate-500 cursor-not-allowed py-2.5 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 relative overflow-hidden select-none">
                    <div id="biocide-fill" class="absolute left-0 top-0 bottom-0 bg-sky-500/50 w-0 transition-all duration-75"></div>
                    <i class="fa-solid fa-droplet relative z-10"></i>
                    <span id="biocide-lbl" class="relative z-10">Close Valve to Arm Biocide Flush</span>
                </button>
            </div>
        `;

        const btnIso = container.querySelector('#btn-isolate-water');
        const isoIcon = container.querySelector('#water-valve-icon');
        const isoLbl = container.querySelector('#water-valve-lbl');
        const btnFlush = container.querySelector('#btn-hold-biocide');
        const fillBar = container.querySelector('#biocide-fill');
        const flushLbl = container.querySelector('#biocide-lbl');
        const statusBox = container.querySelector('#filter-status-box');

        btnIso.addEventListener('click', () => {
            playSfx('valveRotate');
            isolated = true;
            isoIcon.className = 'fa-solid fa-lock text-emerald-400';
            isoLbl.textContent = '1. Main Inlet Valve CLOSED (Isolated)';
            btnIso.className = 'w-full btn-tech bg-emerald-950/40 text-emerald-300 border border-emerald-400 p-2.5 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2';

            btnFlush.disabled = false;
            btnFlush.className = 'w-full btn-tech bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden select-none shadow animate-pulse';
            flushLbl.textContent = 'HOLD TO INJECT BIOCIDE & BACKFLUSH (2s)';
        });

        // Hold flush
        let timer = null;
        let progress = 0;

        const startHold = () => {
            if (!isolated || isFlushed) return;
            playSfx('waterFlow');
            progress = 0;
            timer = setInterval(() => {
                progress += 5;
                if (fillBar) fillBar.style.width = `${progress}%`;
                if (progress >= 100) {
                    clearInterval(timer);
                    isFlushed = true;
                    playSfx('success');
                    if (statusBox) {
                        statusBox.className = 'p-3 bg-emerald-950/40 border border-emerald-400 rounded-xl flex items-center justify-between';
                        statusBox.innerHTML = `
                            <div>
                                <div class="text-xs font-bold text-emerald-300">BIOFILM PURGED: MEMBRANE NOMINAL</div>
                                <div class="text-[10px] text-slate-300">Flow throughput restored to 100%</div>
                            </div>
                            <i class="fa-solid fa-circle-check text-emerald-400 text-2xl"></i>
                        `;
                    }
                    if (window.state && window.state.faults) {
                        window.state.faults.waterPipeLeaking = false;
                    }

                    setTimeout(() => {
                        showActivitySuccess(
                            container,
                            'ch8_flush_bioreactor',
                            'Water Purifier Flushed & Cleaned',
                            'Backflushing with biocide dislodged microbial biofilm buildup from catalytic filtration membranes, restoring full volumetric throughput across the water recycling loop.',
                            onComplete
                        );
                    }, 500);
                }
            }, 100);
        };

        const stopHold = () => {
            if (timer) clearInterval(timer);
            if (!isFlushed) {
                progress = 0;
                if (fillBar) fillBar.style.width = '0%';
            }
        };

        btnFlush.addEventListener('mousedown', startHold);
        window.addEventListener('mouseup', stopHold);
        btnFlush.addEventListener('touchstart', startHold, { passive: true });
        window.addEventListener('touchend', stopHold);
    }

    // Task 3: Verify Water Quality (Conductivity Test to <50 µS/cm)
    function renderM8T3_VerifyWaterQuality(container, onComplete) {
        let testing = false;
        let cond = 210;

        container.innerHTML = `
            ${createActivityHeader(
                'Water Quality Diagnostic Tester',
                'Run the electrical conductivity test to confirm that dissolved mineral ions and biofilm contaminants fall below the safe configured target (<50 µS/cm).',
                'Initiate the purity test and watch conductivity drop below 50 µS/cm!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Scientific Note on Conductivity vs Sterility -->
                <div class="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-[11px] text-slate-300 flex items-start gap-2">
                    <i class="fa-solid fa-circle-info text-sky-400 mt-0.5"></i>
                    <div>
                        <strong class="text-sky-300 font-mono-tech">Scientific Reality:</strong>
                        Electrical conductivity (µS/cm) measures dissolved inorganic ions and salts. While <50 µS/cm confirms demineralization, biological potable safety also requires filtration and residual biocide.
                    </div>
                </div>

                <!-- Conductivity Dial -->
                <div class="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <span class="text-[10px] font-mono-tech text-slate-400 uppercase">ELECTRICAL CONDUCTIVITY</span>
                    <div id="cond-display-val" class="text-3xl font-mono-tech font-black text-rose-400 mt-1">210 µS/cm</div>
                    <div id="cond-display-status" class="text-xs font-mono-tech text-rose-400 font-bold mt-1">● CONTAMINATED (Target: <50 µS/cm)</div>
                </div>

                <button id="btn-run-water-test" class="w-full btn-tech bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer shadow animate-pulse">
                    <i class="fa-solid fa-flask-vial"></i>
                    <span>Run Catalytic Purity & Conductivity Test</span>
                </button>
            </div>
        `;

        const btnTest = container.querySelector('#btn-run-water-test');
        const valEl = container.querySelector('#cond-display-val');
        const statusEl = container.querySelector('#cond-display-status');

        btnTest.addEventListener('click', () => {
            if (testing) return;
            testing = true;
            playSfx('beep');
            btnTest.disabled = true;
            btnTest.textContent = 'Analyzing Ion Concentration...';

            let timer = setInterval(() => {
                cond -= 18;
                if (valEl) valEl.textContent = `${cond} µS/cm`;

                if (cond <= 42) {
                    cond = 38;
                    clearInterval(timer);
                    playSfx('success');
                    if (valEl) {
                        valEl.textContent = '38 µS/cm';
                        valEl.className = 'text-3xl font-mono-tech font-black text-emerald-400';
                    }
                    if (statusEl) {
                        statusEl.textContent = '● POTABLE SAFE (Passed <50 µS/cm Standard)';
                        statusEl.className = 'text-xs font-mono-tech text-emerald-400 font-bold';
                    }
                    if (window.state) window.state.waterConductivity = 38;

                    setTimeout(() => {
                        showActivitySuccess(
                            container,
                            'ch8_conductivity_check',
                            'Water Quality Certified Potable (<50 µS/cm)',
                            'Water conductivity verified nominal at 38 µS/cm. The closed-loop vapor distillation and catalytic purifier has completely cleared bio-contaminants, restoring safe potable drinking reserves.',
                            onComplete
                        );
                    }, 600);
                } else if (cond <= 90) {
                    if (valEl) valEl.className = 'text-3xl font-mono-tech font-black text-amber-300';
                    if (statusEl) {
                        statusEl.textContent = '● PURIFYING... (Transitioning)';
                        statusEl.className = 'text-xs font-mono-tech text-amber-300 font-bold';
                    }
                }
            }, 100);
        });
    }

    /* =========================================================================
     * MISSION 9: SOLAR PARTICLE EVENT — CODE RED (Sol 360–370) [60s Emergency]
     * ========================================================================= */

    // Task 1: Sound Habitat Alarm (Hold Lever for 2 Seconds + Klaxon)
    function renderM9T1_SoundAlarm(container, onComplete) {
        let isAlarmed = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Outpost Emergency Klaxon Station',
                'Pull and hold the red Emergency Siren Lever for 2 seconds to broadcast the Code Red Radiation Alert across all habitat modules.',
                'Pull and hold the emergency siren lever to activate the shelter alarm!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-rose-500/40 space-y-4">
                <!-- Space Weather Clarification -->
                <div class="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-[11px] text-slate-300 flex items-start gap-2">
                    <i class="fa-solid fa-sun text-rose-400 mt-0.5"></i>
                    <div>
                        <strong class="text-rose-400 font-mono-tech">Space Weather Physics:</strong>
                        Solar flares produce light and X-rays arriving in minutes, whereas Coronal Mass Ejections (CMEs) launch relativistic protons taking hours. Real astronaut protocols use space-weather warnings to trigger shelter evacuation.
                    </div>
                </div>

                <!-- Red Emergency Pull Lever -->
                <button id="btn-hold-siren" class="w-full btn-tech bg-rose-700 hover:bg-rose-600 text-white font-black py-4 px-4 rounded-2xl text-sm font-display flex items-center justify-center gap-2 cursor-pointer shadow-xl relative overflow-hidden select-none animate-pulse">
                    <div id="siren-fill" class="absolute left-0 top-0 bottom-0 bg-amber-400/50 w-0 transition-all duration-75"></div>
                    <i class="fa-solid fa-bullhorn text-xl relative z-10"></i>
                    <span id="siren-lbl" class="relative z-10 tracking-wider">PULL & HOLD CODE RED ALARM (2 SECONDS)</span>
                </button>
            </div>
        `;

        const btnSiren = container.querySelector('#btn-hold-siren');
        const fillBar = container.querySelector('#siren-fill');
        const lbl = container.querySelector('#siren-lbl');

        let timer = null;
        let progress = 0;

        const startHold = () => {
            if (isAlarmed) return;
            playSfx('siren');
            progress = 0;
            timer = setInterval(() => {
                progress += 5;
                if (fillBar) fillBar.style.width = `${progress}%`;
                if (progress >= 100) {
                    clearInterval(timer);
                    isAlarmed = true;
                    playSfx('siren');
                    if (window.state) window.state.alarmSounded = true;
                    lbl.textContent = 'CODE RED ALARM BROADCASTING!';
                    btnSiren.className = 'w-full bg-rose-950 text-rose-300 py-4 px-4 rounded-2xl text-sm font-display flex items-center justify-center gap-2 border-2 border-rose-500';

                    setTimeout(() => {
                        showActivitySuccess(
                            container,
                            'ch9_alarm_siren',
                            'Habitat Code Red Alarm Sounded',
                            'Automated visual strobe sirens and audible emergency klaxons have been broadcast through all seven modules, ordering all crew to evacuate to the Radiation Shelter.',
                            onComplete
                        );
                    }, 500);
                }
            }, 100);
        };

        const stopHold = () => {
            if (timer) clearInterval(timer);
            if (!isAlarmed) {
                progress = 0;
                if (fillBar) fillBar.style.width = '0%';
            }
        };

        btnSiren.addEventListener('mousedown', startHold);
        window.addEventListener('mouseup', stopHold);
        btnSiren.addEventListener('touchstart', startHold, { passive: true });
        window.addEventListener('touchend', stopHold);
    }

    // Task 2: Verify Shelter Shielding (Drag 4 Regolith Blocks into Bunker Wall)
    function renderM9T2_VerifyShielding(container, onComplete) {
        let insertedBlocks = 0;

        container.innerHTML = `
            ${createActivityHeader(
                'Radiation Storm Bunker Wall Assembly',
                'Drag or click the four interlocking basaltic regolith & water-jacket shielding blocks into the bunker wall frames to reach 96% radiation attenuation.',
                'Insert all 4 shielding blocks into the bunker wall to stop solar energetic protons!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Attenuation Gauge -->
                <div class="flex items-center justify-between text-xs font-mono-tech font-bold">
                    <span class="text-slate-300">SHIELDING ATTENUATION:</span>
                    <span id="atten-val" class="text-amber-400">0% (Unshielded: 3.2 mSv/h)</span>
                </div>
                <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                    <div id="atten-bar" class="bg-amber-400 h-full w-0 transition-all duration-300"></div>
                </div>

                <!-- 4 Wall Cavity Slots -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    ${[1, 2, 3, 4].map(idx => `
                        <div id="block-slot-${idx}" class="block-slot bg-slate-900 border-2 border-dashed border-purple-500/60 hover:border-purple-400 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow transition">
                            <i class="fa-solid fa-cube text-purple-400 text-xl"></i>
                            <span class="text-[10px] font-mono-tech text-white font-bold">Block 0${idx}</span>
                            <span class="slot-lbl text-[9px] text-amber-300 font-mono-tech">Click to Insert</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const attenVal = container.querySelector('#atten-val');
        const attenBar = container.querySelector('#atten-bar');

        [1, 2, 3, 4].forEach(idx => {
            const slot = container.querySelector(`#block-slot-${idx}`);
            slot.addEventListener('click', () => {
                if (slot.dataset.filled) return;
                slot.dataset.filled = 'true';
                insertedBlocks++;
                playSfx('pickup');

                slot.className = 'block-slot bg-purple-950/50 border-2 border-purple-400 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-lg';
                slot.querySelector('.slot-lbl').textContent = 'Fitted & Secured';
                slot.querySelector('.slot-lbl').className = 'text-[9px] text-emerald-400 font-mono-tech font-bold';

                const pct = insertedBlocks * 24;
                attenBar.style.width = `${pct}%`;
                attenVal.textContent = `${pct}% Attenuation`;

                if (insertedBlocks === 4) {
                    attenBar.style.width = '100%';
                    attenBar.className = 'bg-emerald-400 h-full w-full transition-all duration-300';
                    attenVal.textContent = '96% (Safe: 0.04 mSv/h)';
                    attenVal.className = 'text-emerald-400 font-bold';
                    playSfx('success');

                    if (window.state && window.state.faults) {
                        window.state.faults.shelterProtocolActive = true;
                        window.state.radiationMSvH = 0.04;
                    }

                    setTimeout(() => {
                        showActivitySuccess(
                            container,
                            'ch9_verify_shielding',
                            'Storm Shelter Shielding Verified (96%)',
                            'Interlocking regolith bricks reinforced with water-jacket tanks absorb solar protons via hydrogen-rich atomic collisions, keeping crew dose well below NASA permissible limits.',
                            onComplete
                        );
                    }, 500);
                }
            });
        });
    }

    // Task 3: Muster Crew Inside Bunker (Radio Beacon Muster + Door Lock)
    function renderM9T3_MusterCrew(container, onComplete) {
        let musteredCount = 0;
        let doorLocked = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Radiation Bunker Muster & Accountability',
                'Transmit priority radio muster beacons to guide all four crew members (Cmdr. Vance, Dr. Lin, Eng. Philip, Dr. Patel) into the shelter, then lock the reinforced blast hatch.',
                'Click the radio beacon to call all crew to the bunker, then seal the blast hatch!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Crew Roster Cards -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div id="crew-vance" class="crew-muster-card bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-center space-y-1">
                        <div class="text-sm font-bold text-white">Cmdr. Vance</div>
                        <div class="muster-status text-[9px] text-amber-400 font-mono-tech">En Route...</div>
                    </div>
                    <div id="crew-lin" class="crew-muster-card bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-center space-y-1">
                        <div class="text-sm font-bold text-white">Dr. Lin</div>
                        <div class="muster-status text-[9px] text-amber-400 font-mono-tech">En Route...</div>
                    </div>
                    <div id="crew-philip" class="crew-muster-card bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-center space-y-1">
                        <div class="text-sm font-bold text-white">Eng. Philip</div>
                        <div class="muster-status text-[9px] text-amber-400 font-mono-tech">En Route...</div>
                    </div>
                    <div id="crew-maya" class="crew-muster-card bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-center space-y-1">
                        <div class="text-sm font-bold text-white">Dr. Patel</div>
                        <div class="muster-status text-[9px] text-amber-400 font-mono-tech">En Route...</div>
                    </div>
                </div>

                <!-- Action Controls -->
                <div class="flex flex-col sm:flex-row gap-3">
                    <button id="btn-call-muster" class="flex-1 btn-tech bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer shadow">
                        <i class="fa-solid fa-satellite-dish"></i>
                        <span>Transmit Priority Shelter Beacon</span>
                    </button>

                    <button id="btn-seal-bunker" disabled class="flex-1 btn-tech bg-slate-800 text-slate-500 cursor-not-allowed py-2.5 px-4 rounded-xl text-xs font-mono-tech font-bold">
                        Muster All 4 Crew to Seal Hatch
                    </button>
                </div>
            </div>
        `;

        const btnCall = container.querySelector('#btn-call-muster');
        const btnSeal = container.querySelector('#btn-seal-bunker');
        const cards = container.querySelectorAll('.crew-muster-card');

        btnCall.addEventListener('click', () => {
            playSfx('beep');
            btnCall.disabled = true;
            btnCall.textContent = 'Crew Beacon Active (Muster in Progress...)';

            let count = 0;
            let timer = setInterval(() => {
                if (count < cards.length) {
                    playSfx('pickup');
                    const c = cards[count];
                    c.className = 'crew-muster-card bg-emerald-950/40 border-2 border-emerald-400 p-2.5 rounded-xl text-center space-y-1 shadow';
                    c.querySelector('.muster-status').textContent = '● INSIDE SHELTER';
                    c.querySelector('.muster-status').className = 'muster-status text-[9px] text-emerald-400 font-bold font-mono-tech';
                    count++;
                } else {
                    clearInterval(timer);
                    playSfx('success');
                    btnSeal.disabled = false;
                    btnSeal.className = 'flex-1 btn-tech bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs font-mono-tech cursor-pointer shadow-lg animate-pulse';
                    btnSeal.textContent = 'Seal Reinforced Bunker Blast Hatch';
                }
            }, 300);
        });

        btnSeal.addEventListener('click', () => {
            playSfx('cableSnap');
            if (window.state) window.state.crewSheltered = true;
            showActivitySuccess(
                container,
                'ch9_shelter_evac',
                'All Crew Accounted for & Bunker Sealed',
                '100% crew muster achieved. All 5 expedition astronauts are safely locked inside Module 07 behind water-jacketed regolith walls, completely shielded from solar particle radiation.',
                onComplete
            );
        });
    }

    /* =========================================================================
     * MISSION 10: THE RETURN WINDOW — HANDOVER (Sol 375–378)
     * ========================================================================= */

    // Task 1: Store Science Sample Canisters in ERV Vault (Slot Matching & Vault Lock)
    function renderM10T1_StoreSamples(container, onComplete) {
        let stored = { a: false, b: false, c: false };

        container.innerHTML = `
            ${createActivityHeader(
                'Earth Return Vehicle (ERV) Specimen Safe',
                'Match and deposit all three Jezero delta sample canisters into their labelled hermetic compartments: Clay Core, Jezero Basalt, and Carbonate Lakebed. Then turn the vault lock wheel.',
                'Click each sample canister to slot it into its designated compartment!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button data-slot="a" class="sample-slot-btn btn-tech bg-slate-900 border-2 border-slate-700 hover:border-amber-400 p-3 rounded-xl text-center space-y-1 cursor-pointer">
                        <i class="fa-solid fa-vial text-amber-400 text-xl"></i>
                        <div class="text-xs font-bold text-white">Canister A: Delta Clay</div>
                        <div class="slot-state text-[9px] text-slate-400 font-mono-tech">Empty Slot (Click to Store)</div>
                    </button>

                    <button data-slot="b" class="sample-slot-btn btn-tech bg-slate-900 border-2 border-slate-700 hover:border-amber-400 p-3 rounded-xl text-center space-y-1 cursor-pointer">
                        <i class="fa-solid fa-vial text-sky-400 text-xl"></i>
                        <div class="text-xs font-bold text-white">Canister B: Jezero Basalt</div>
                        <div class="slot-state text-[9px] text-slate-400 font-mono-tech">Empty Slot (Click to Store)</div>
                    </button>

                    <button data-slot="c" class="sample-slot-btn btn-tech bg-slate-900 border-2 border-slate-700 hover:border-amber-400 p-3 rounded-xl text-center space-y-1 cursor-pointer">
                        <i class="fa-solid fa-vial text-teal-400 text-xl"></i>
                        <div class="text-xs font-bold text-white">Canister C: Carbonate Lake</div>
                        <div class="slot-state text-[9px] text-slate-400 font-mono-tech">Empty Slot (Click to Store)</div>
                    </button>
                </div>

                <button id="btn-lock-erv-vault" disabled class="w-full btn-tech bg-slate-800 text-slate-500 cursor-not-allowed py-2.5 rounded-xl text-xs font-mono-tech font-bold">
                    Deposit All 3 Canisters to Lock ERV Safe
                </button>
            </div>
        `;

        const btnLock = container.querySelector('#btn-lock-erv-vault');

        container.querySelectorAll('.sample-slot-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const s = btn.dataset.slot;
                if (stored[s]) return;
                stored[s] = true;
                playSfx('cableSnap');

                btn.className = 'sample-slot-btn btn-tech bg-emerald-950/40 border-2 border-emerald-400 p-3 rounded-xl text-center space-y-1';
                btn.querySelector('.slot-state').textContent = '● STORED & HERMETIC';
                btn.querySelector('.slot-state').className = 'slot-state text-[9px] text-emerald-400 font-bold font-mono-tech';

                if (stored.a && stored.b && stored.c) {
                    playSfx('success');
                    btnLock.disabled = false;
                    btnLock.className = 'w-full btn-tech bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs font-mono-tech cursor-pointer shadow-lg animate-pulse';
                    btnLock.textContent = 'Turn Vault Wheel & Lock ERV Containment Safe';
                }
            });
        });

        btnLock.addEventListener('click', () => {
            playSfx('valveRotate');
            if (window.state) window.state.coresPackaged = true;
            showActivitySuccess(
                container,
                'ch10_package_cores',
                'Core Canisters Secured in ERV Vault',
                'Pristine geological and astrobiological samples from Jezero Crater are hermetically sealed for Earth transport. Terrestrial synchrotron and mass spectrometer labs await these specimens.',
                onComplete
            );
        });
    }

    // Task 2: Harvest Mature Greenhouse Crops (Interactive Harvesting & Cold Storage)
    function renderM10T2_HarvestCrops(container, onComplete) {
        let harvestedBeds = { 1: false, 2: false, 3: false };

        container.innerHTML = `
            ${createActivityHeader(
                'Bioregenerative Crop Harvesting',
                'Harvest ripe hydroponic cherry tomatoes, golden dwarf wheat, and microgreens to transfer fresh food stocks into the incoming relief crew’s cold storage locker.',
                'Click each mature crop bed to harvest and pack the produce!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button data-crop="1" class="crop-harvest-btn btn-tech bg-slate-900 border-2 border-slate-700 hover:border-emerald-400 p-3 rounded-xl text-center space-y-1 cursor-pointer">
                        <div class="text-2xl">🍅</div>
                        <div class="text-xs font-bold text-white">Ripe Cherry Tomatoes</div>
                        <div class="crop-harvest-lbl text-[9px] text-amber-300 font-mono-tech">Ready to Harvest (+5 kg)</div>
                    </button>

                    <button data-crop="2" class="crop-harvest-btn btn-tech bg-slate-900 border-2 border-slate-700 hover:border-emerald-400 p-3 rounded-xl text-center space-y-1 cursor-pointer">
                        <div class="text-2xl">🌾</div>
                        <div class="text-xs font-bold text-white">Golden Dwarf Wheat</div>
                        <div class="crop-harvest-lbl text-[9px] text-amber-300 font-mono-tech">Ready to Harvest (+6 kg)</div>
                    </button>

                    <button data-crop="3" class="crop-harvest-btn btn-tech bg-slate-900 border-2 border-slate-700 hover:border-emerald-400 p-3 rounded-xl text-center space-y-1 cursor-pointer">
                        <div class="text-2xl">🥬</div>
                        <div class="text-xs font-bold text-white">Crisp Salad Greens</div>
                        <div class="crop-harvest-lbl text-[9px] text-amber-300 font-mono-tech">Ready to Harvest (+4 kg)</div>
                    </button>
                </div>

                <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono-tech">
                    <span class="text-slate-300">TOTAL BIOMASS HARVESTED:</span>
                    <span id="harvest-total-lbl" class="text-emerald-400 font-bold">0 kg Fresh Produce</span>
                </div>
            </div>
        `;

        const totalLbl = container.querySelector('#harvest-total-lbl');
        let totalKg = 0;

        container.querySelectorAll('.crop-harvest-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const c = btn.dataset.crop;
                if (harvestedBeds[c]) return;
                harvestedBeds[c] = true;
                playSfx('pickup');

                btn.className = 'crop-harvest-btn btn-tech bg-emerald-950/40 border-2 border-emerald-400 p-3 rounded-xl text-center space-y-1';
                btn.querySelector('.crop-harvest-lbl').textContent = '● HARVESTED & PACKED';
                btn.querySelector('.crop-harvest-lbl').className = 'crop-harvest-lbl text-[9px] text-emerald-400 font-bold font-mono-tech';

                totalKg += 5;
                totalLbl.textContent = `${totalKg} kg Fresh Produce Stored`;

                if (harvestedBeds[1] && harvestedBeds[2] && harvestedBeds[3]) {
                    playSfx('success');
                    if (window.state) window.state.cropsHarvested = true;
                    setTimeout(() => {
                        showActivitySuccess(
                            container,
                            'ch10_greenhouse_seeds',
                            'Greenhouse Harvest Complete (15 kg)',
                            'Fresh produce packed into the relief crew cold storage bins. Fresh greens provide vital micronutrients and psychological well-being on long-duration planetary missions.',
                            onComplete
                        );
                    }, 500);
                }
            });
        });
    }

    // Task 3: Transmit Final 378-Sol Expedition Logbook to NASA Houston
    function renderM10T3_TransmitLogbook(container, onComplete) {
        let aligned = false;
        let transmitting = false;

        container.innerHTML = `
            ${createActivityHeader(
                'Deep Space Network (DSN) Transceiver',
                '1. Align the High-Gain Parabolic Antenna to Earth coordinates. 2. Press and hold the DSN Uplink button to transmit the complete 378-Sol Mission Archive to NASA Flight Operations.',
                'Align the parabolic antenna, then hold the uplink button to transmit the final logbook!'
            )}
            <div class="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-4">
                <!-- Antenna Alignment -->
                <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                        <div class="text-xs font-bold text-white">HIGH-GAIN PARABOLIC DISH:</div>
                        <div id="antenna-az-lbl" class="text-[10px] text-slate-400">Azimuth: 0.0° (Misaligned)</div>
                    </div>
                    <button id="btn-align-antenna" class="btn-tech bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-400 px-4 py-1.5 rounded-lg text-xs font-mono-tech font-bold cursor-pointer">
                        <i class="fa-solid fa-satellite-dish mr-1"></i>
                        <span>Align to Earth</span>
                    </button>
                </div>

                <!-- Uplink Button -->
                <button id="btn-hold-dsn-uplink" disabled class="w-full btn-tech bg-slate-800 text-slate-500 cursor-not-allowed py-3 px-4 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 relative overflow-hidden select-none">
                    <div id="dsn-progress-fill" class="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500 to-sky-500 w-0 transition-all duration-75"></div>
                    <i class="fa-solid fa-tower-broadcast relative z-10"></i>
                    <span id="dsn-lbl" class="relative z-10">Align Antenna First to Enable Uplink</span>
                </button>
            </div>
        `;

        const btnAlign = container.querySelector('#btn-align-antenna');
        const azLbl = container.querySelector('#antenna-az-lbl');
        const btnUplink = container.querySelector('#btn-hold-dsn-uplink');
        const fillBar = container.querySelector('#dsn-progress-fill');
        const dsnLbl = container.querySelector('#dsn-lbl');

        btnAlign.addEventListener('click', () => {
            playSfx('valveRotate');
            aligned = true;
            azLbl.textContent = 'Azimuth: 18.2° Earth Lock (Signal: 42 Mbps)';
            azLbl.className = 'text-[10px] text-emerald-400 font-bold font-mono-tech';
            btnAlign.disabled = true;
            btnAlign.className = 'bg-emerald-950/40 text-emerald-300 border border-emerald-400 px-4 py-1.5 rounded-lg text-xs font-mono-tech font-bold';

            btnUplink.disabled = false;
            btnUplink.className = 'w-full btn-tech bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-3 px-4 rounded-xl text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer shadow-lg animate-pulse';
            dsnLbl.textContent = 'HOLD TO TRANSMIT 378-SOL ARCHIVE TO HOUSTON (2s)';
        });

        // Hold uplink
        let timer = null;
        let progress = 0;

        const startHold = () => {
            if (!aligned || transmitting) return;
            playSfx('scan');
            progress = 0;
            timer = setInterval(() => {
                progress += 5;
                if (fillBar) fillBar.style.width = `${progress}%`;
                if (progress >= 100) {
                    clearInterval(timer);
                    transmitting = true;
                    playSfx('success');
                    dsnLbl.textContent = 'TRANSMISSION COMPLETE • ONE-WAY LIGHT DELAY: 14m 22s';
                    if (window.state) window.state.finalReportSent = true;

                    setTimeout(() => {
                        showActivitySuccess(
                            container,
                            'ch10_final_report',
                            '378-Sol Mission Telemetry Transmitted',
                            'Complete habitat logs, ECLSS telemetry, crop yields, and Jezero Delta geological catalogs successfully beamed to NASA Deep Space Network stations in Madrid, Goldstone, and Canberra.',
                            () => {
                                if (typeof onComplete === 'function') onComplete();
                                // Open the victory debrief modal after completing final mission task
                                setTimeout(() => {
                                    if (typeof window.showVictoryModal === 'function') {
                                        window.showVictoryModal();
                                    }
                                }, 400);
                            }
                        );
                    }, 500);
                }
            }, 100);
        };

        const stopHold = () => {
            if (timer) clearInterval(timer);
            if (!transmitting) {
                progress = 0;
                if (fillBar) fillBar.style.width = '0%';
            }
        };

        btnUplink.addEventListener('mousedown', startHold);
        window.addEventListener('mouseup', stopHold);
        btnUplink.addEventListener('touchstart', startHold, { passive: true });
        window.addEventListener('touchend', stopHold);
    }

    /* =========================================================================
     * ACTIVITY ROUTER: Map each task to its interactive simulation mini-game
     * ========================================================================= */
    const TASK_RENDERERS = {
        // Mission 1
        ch1_airlock: renderM1T1_AirlockPressure,
        ch1_tool: renderM1T2_CollectTool,
        ch1_life: renderM1T3_VerifyECLSS,
        // Mission 2
        ch2_crop_inspect: renderM2T1_CheckCrops,
        ch2_greenhouse_power: renderM2T2_SetGrowLights,
        ch2_flush_irrigation: renderM2T3_FlushIrrigation,
        // Mission 3
        ch3_eva_prep: renderM3T1_SuitPrep,
        ch3_rover_link: renderM3T2_InspectPerseverance,
        ch3_heli_inspect: renderM3T3_RebootIngenuity,
        // Mission 4
        ch4_shed_load: renderM4T1_ShedLoads,
        ch4_gen_backup: renderM4T2_ActivateBackup,
        ch4_dust_wipers: renderM4T3_CleanDustWipers,
        // Mission 5
        ch5_eva_suit: renderM5T1_PutOnSuit,
        ch5_cycle_door: renderM5T2_CycleOuterDoor,
        ch5_repair_junction: renderM5T3_RepairJunction,
        // Mission 6
        ch6_filter_grab: renderM6T1_CollectLiOH,
        ch6_filter_install: renderM6T2_ReplaceScrubber,
        ch6_co2_verify: renderM6T3_VerifyCO2,
        // Mission 7
        ch7_drill_core: renderM7T1_RetrieveCore,
        ch7_raman_insert: renderM7T2_RamanLaser,
        ch7_catalogue_mineral: renderM7T3_CatalogueMineral,
        // Mission 8
        ch8_pipe_seal: renderM8T1_CollectSealKit,
        ch8_flush_bioreactor: renderM8T2_FlushPurifier,
        ch8_conductivity_check: renderM8T3_VerifyWaterQuality,
        // Mission 9
        ch9_alarm_siren: renderM9T1_SoundAlarm,
        ch9_verify_shielding: renderM9T2_VerifyShielding,
        ch9_shelter_evac: renderM9T3_MusterCrew,
        // Mission 10
        ch10_package_cores: renderM10T1_StoreSamples,
        ch10_greenhouse_seeds: renderM10T2_HarvestCrops,
        ch10_final_report: renderM10T3_TransmitLogbook
    };

    /**
     * Main entrypoint: Renders task activity into a target container
     */
    function renderTask(taskId, container, onCompleteWrapper) {
        if (!container) return false;
        const renderer = TASK_RENDERERS[taskId];
        if (typeof renderer === 'function') {
            renderer(container, () => {
                if (typeof window.completeTask === 'function') {
                    window.completeTask(taskId);
                }
                if (typeof onCompleteWrapper === 'function') {
                    onCompleteWrapper();
                }
            });
            return true;
        }
        return false;
    }

    return {
        renderTask: renderTask,
        hasActivity: (taskId) => !!TASK_RENDERERS[taskId]
    };
})();

