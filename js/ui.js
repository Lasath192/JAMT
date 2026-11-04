
// --- ROLLING TELEMETRY SPARKLINES ---
const sparklineHistory = {
    battery: [68, 68, 67, 68, 69, 70, 71, 71, 72, 71, 70, 71, 72, 73, 72, 71],
    co2: [450, 445, 440, 435, 430, 428, 425, 424, 422, 420, 420, 418, 420, 419, 420, 420]
};

function drawSparkline(canvasId, data, strokeColor, fillColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (!data || data.length < 2) return;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = (max - min) || 1;

    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
        const x = (i / (data.length - 1)) * (w - 4) + 2;
        const norm = (data[i] - min) / range;
        const y = h - 2 - norm * (h - 4);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.3;
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.lineTo(w - 2, h);
    ctx.lineTo(2, h);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
}
/**
 * ASTRA-1: The Red Frontier - UI, Modals, Dialogues & Telemetry HUD Engine
 * 2026 NASA Space Apps Challenge
 */

// --- MODAL UTILITY HELPERS ---
function isAnyModalOpen() {
    const consoleModal = document.getElementById('modal-console');
    const powerModal = document.getElementById('modal-power');
    const codexModal = document.getElementById('modal-codex');
    const storyModal = document.getElementById('modal-story');
    const dialogueModal = document.getElementById('modal-dialogue');
    const victoryModal = document.getElementById('modal-victory');

    return (consoleModal && !consoleModal.classList.contains('hidden')) ||
           (powerModal && !powerModal.classList.contains('hidden')) ||
           (codexModal && !codexModal.classList.contains('hidden')) ||
           (storyModal && !storyModal.classList.contains('hidden')) ||
           (dialogueModal && !dialogueModal.classList.contains('hidden')) ||
           (victoryModal && !victoryModal.classList.contains('hidden'));
}

function closeAllModals() {
    ['modal-console', 'modal-power', 'modal-codex', 'modal-dialogue', 'modal-story', 'modal-victory'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
}

// --- INTERACTIVE STORY DIALOGUE ENGINE ---
let activeDialogueQueue = [];
let activeDialogueIndex = 0;

function startDialogueSequence(dialogueArray, chapterBannerIdx = state.chapterIdx) {
    if (!dialogueArray || dialogueArray.length === 0) return;
    activeDialogueQueue = dialogueArray;
    activeDialogueIndex = 0;
    
    const bannerEl = document.getElementById('dlg-scene-banner');
    if (bannerEl && typeof getChapterSceneSVG === 'function') {
        bannerEl.innerHTML = getChapterSceneSVG(chapterBannerIdx);
    }
    
    const dlgModal = document.getElementById('modal-dialogue');
    if (dlgModal) dlgModal.classList.remove('hidden');
    renderCurrentDialogueStep();
}

function renderCurrentDialogueStep() {
    const step = activeDialogueQueue[activeDialogueIndex];
    if (!step) return;

    const portraitBox = document.getElementById('dlg-portrait-box');
    if (portraitBox && typeof getCharacterPortraitSVG === 'function') {
        portraitBox.innerHTML = getCharacterPortraitSVG(step.portrait || 'nova');
    }

    const rolePill = document.getElementById('dlg-role-pill');
    if (rolePill) rolePill.textContent = step.role || 'ASTRA-1 CREW';

    const speakerName = document.getElementById('dlg-speaker-name');
    if (speakerName) speakerName.textContent = step.speaker;

    const stepCounter = document.getElementById('dlg-step-counter');
    if (stepCounter) stepCounter.textContent = `TRANSMISSION ${activeDialogueIndex + 1} / ${activeDialogueQueue.length}`;

    const dlgText = document.getElementById('dlg-text');
    if (dlgText) dlgText.textContent = `"${step.text}"`;

    const tradeoffText = document.getElementById('dlg-tradeoff-text');
    if (tradeoffText) tradeoffText.textContent = step.tradeoff || 'Every engineering decision affects the outpost.';

    const btnLabel = document.getElementById('btn-next-dlg-label');
    if (btnLabel) {
        btnLabel.textContent = (activeDialogueIndex < activeDialogueQueue.length - 1) ? 'Next Transmission' : 'Begin Mission Tasks';
    }
    
    if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
}

function advanceDialogueStep() {
    if (activeDialogueIndex < activeDialogueQueue.length - 1) {
        activeDialogueIndex++;
        renderCurrentDialogueStep();
    } else {
        if (window.sfx && typeof sfx.success === 'function') sfx.success();
        const dlgModal = document.getElementById('modal-dialogue');
        if (dlgModal) dlgModal.classList.add('hidden');
    }
}

// --- PROXIMITY DETECTION & INTERACTION TRIGGER ---
function getNearestObject() {
    if (typeof OBJECTS === 'undefined' || !state.player) return null;
    let best = null;
    let bestDist = Infinity;
    for (const obj of OBJECTS) {
        const dx = state.player.x - obj.x;
        const dy = state.player.y - obj.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= obj.radius + 26 && dist < bestDist) {
            best = obj;
            bestDist = dist;
        }
    }
    return best;
}

function getNearestCrewNPC() {
    if (typeof CREW_NPCS === 'undefined' || !state.player) return null;
    let best = null;
    let bestDist = Infinity;
    for (const npc of CREW_NPCS) {
        const dist = Math.hypot(state.player.x - npc.x, state.player.y - npc.y);
        if (dist <= 65 && dist < bestDist) {
            best = npc;
            bestDist = dist;
        }
    }
    return best;
}

function triggerNearestObjectInteraction() {
    const obj = getNearestObject();
    if (obj) {
        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
        unlockFact(obj.factId);
        openObjectModal(obj);
        return;
    }
    const npc = getNearestCrewNPC();
    if (npc && npc.dialogues) {
        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
        startDialogueSequence(npc.dialogues, state.chapterIdx);
    }
}

// --- EQUIPMENT DIAGNOSTIC & CONSOLE MODAL ---
function openObjectModal(obj) {
    document.getElementById('console-room').textContent = obj.room.toUpperCase();
    document.getElementById('console-title').textContent = obj.name;
    
    const illusEl = document.getElementById('console-illustration');
    if (illusEl && typeof getConsoleIllustrationSVG === 'function') {
        illusEl.innerHTML = getConsoleIllustrationSVG(obj.id);
    }

    const fact = (typeof SPACE_FACTS !== 'undefined' && SPACE_FACTS[obj.factId]) ? SPACE_FACTS[obj.factId] : { title: 'NASA Systems Engineering', text: 'Spacecraft require rigorous checklist discipline.' };
    document.getElementById('console-fact-text').textContent = `${fact.title}: ${fact.text}`;

    const grid = document.getElementById('console-telemetry-grid');
    const desc = document.getElementById('console-desc');
    const actionsEl = document.getElementById('console-actions');
    const badge = document.getElementById('console-status-badge');

    grid.innerHTML = '';
    actionsEl.innerHTML = '';

    const pwr = getPowerStats();

    const addMetric = (label, value, colorClass = 'text-white') => {
        const div = document.createElement('div');
        div.innerHTML = `<div class="text-[10px] text-slate-400">${label}</div><div class="text-sm sm:text-base font-bold ${colorClass}">${value}</div>`;
        grid.appendChild(div);
    };

    const addActionBtn = (label, subtext, onClick, styleClass = 'bg-sky-600 hover:bg-sky-500 text-white', disabled = false) => {
        const btn = document.createElement('button');
        btn.disabled = disabled;
        btn.className = `w-full btn-tech ${disabled ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : styleClass} p-2.5 rounded-xl text-left flex items-center justify-between border border-white/10`;
        btn.innerHTML = `
            <div>
                <div class="font-bold text-xs sm:text-sm">${label}</div>
                <div class="text-[10px] opacity-85 font-mono-tech">${subtext}</div>
            </div>
            <i class="fa-solid fa-chevron-right text-xs"></i>
        `;
        if (!disabled) btn.addEventListener('click', onClick);
        actionsEl.appendChild(btn);
    };

    if (obj.id === 'airlock_console') {
        badge.textContent = state.player.inSuit ? 'EVA Suit Pressurized' : 'IVA Nominal';
        badge.className = 'text-[11px] font-mono-tech font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
        addMetric('Cabin Pressure', `${state.cabinPressureKPa.toFixed(1)} kPa`, 'text-emerald-400');
        addMetric('Mars Exterior Pressure', '0.6 kPa (Vacuum Hazard)', 'text-amber-400');
        addMetric('EVA Suit Status', state.player.inSuit ? 'PRESSURIZED (ON)' : 'STOWED (OFF)', 'text-sky-300');
        addMetric('Outer Hatch Interlock', 'VERIFIED SEALED', 'text-emerald-300');
        desc.textContent = 'The Airlock isolates Astra-1’s 101.3 kPa breathable atmosphere from the 0.6 kPa Martian surface. Always don your pressurized EVA suit before stepping onto the Martian surface.';

        // Mission 1: The First Breath
        addActionBtn(
            state.player.inSuit ? '✓ Airlock Pressure Verified & EVA Suit Pressurized' : 'Verify Cabin Pressure & Don EVA Suit',
            'Electronic Orion-style telemetry verification and 30 kPa suit pressurization',
            () => {
                state.player.inSuit = true;
                completeTask('ch1_airlock');
                if (typeof spawnFloatingText === 'function') spawnFloatingText('EVA SUIT DONNED & PRESSURIZED', state.player.x, state.player.y - 20, '#38bdf8');
                if (typeof sfx !== 'undefined' && sfx.pickup) sfx.pickup();
                setAria('Airlock pressure verified at 101.3 kPa and EVA Suit pressurized! Next, grab your tools from Central Storage.');
                if (typeof updateUI === 'function') updateUI();
                openObjectModal(obj);
            },
            state.player.inSuit ? 'bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100' : 'bg-sky-600 hover:bg-sky-500 text-white'
        );

        // Mission 3: Commissioning Perseverance & Ingenuity
        if (state.chapterIdx === 2) {
            addActionBtn(
                'Don EVA Spacesuit & Depressurize for Surface Rover EVA',
                'Prepares astronaut for outdoor surface traverse to NASA Perseverance',
                () => {
                    state.player.inSuit = true;
                    completeTask('ch3_eva_prep');
                    setAria('EVA Spacesuit pressurized! Step through the outer hatch to link with the Mars Rover.');
                    openObjectModal(obj);
                },
                'bg-amber-500 hover:bg-amber-400 text-slate-950'
            );
        }

        // Mission 5: The Zero-Visibility EVA
        if (state.chapterIdx === 4) {
            addActionBtn(
                'Don Heavy Storm Suit & Cycle Hatch into Zero-Visibility Gale',
                'Required to reach outdoor solar array latches during dust storm',
                () => {
                    state.player.inSuit = true;
                    completeTask('ch5_airlock_exit');
                    setAria('Storm suit locked and pressurized! Head outside immediately to secure the solar array latches.');
                    openObjectModal(obj);
                },
                'bg-red-600 hover:bg-red-500 text-white'
            );
        }

        // General Suit Toggle
        addActionBtn(
            state.player.inSuit ? 'Doff EVA Spacesuit (Return to Shirtsleeve IVA)' : 'Don & Pressurize EVA Spacesuit',
            state.player.inSuit ? 'Stow suit in airlock rack' : 'Required for safe outdoor Mars surface excursions',
            () => {
                state.player.inSuit = !state.player.inSuit;
                if (typeof sfx !== 'undefined' && sfx.pickup) sfx.pickup();
                if (typeof spawnFloatingText === 'function') {
                    spawnFloatingText(state.player.inSuit ? 'EVA SUIT DONNED' : 'SHIRTSLEEVE IVA', state.player.x, state.player.y - 20, state.player.inSuit ? '#38bdf8' : '#4ade80');
                }
                syncTasksWithState();
                if (typeof updateUI === 'function') updateUI();
                openObjectModal(obj);
            },
            state.player.inSuit ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
        );

    } else if (obj.id === 'storage_locker') {
        badge.textContent = 'Supply Cache';
        addMetric('Diagnostic Multi-Tool', hasItem('Multi-Tool') ? 'In Pouch' : 'Available', 'text-amber-300');
        addMetric('High-Voltage Fuse', hasItem('HV Fuse') ? 'In Pouch' : 'Available', 'text-sky-300');
        addMetric('LiOH CO₂ Filter', hasItem('LiOH Filter') ? 'In Pouch' : 'Available', 'text-teal-300');
        addMetric('Pipe Seal Kit', hasItem('Pipe Seal Kit') ? 'In Pouch' : 'Available', 'text-blue-300');
        desc.textContent = 'Central storage locker containing diagnostic tools, replacement fuses, LiOH scrubber cartridges, and plumbing seal kits for habitat maintenance.';

        // Mission 1 Tools
        const hasCh1Tools = hasItem('Multi-Tool') && hasItem('HV Fuse');
        addActionBtn(
            hasCh1Tools ? '✓ Multi-Tool & Spare HV Fuse in Pouch' : 'Collect Diagnostic Multi-Tool & Spare HV Fuse',
            'Required for initial habitat power & life-support inspection',
            () => {
                addItem('Multi-Tool');
                addItem('HV Fuse');
                if (typeof spawnFloatingText === 'function') spawnFloatingText('MULTI-TOOL & HV FUSE ACQUIRED', state.player.x, state.player.y - 20, '#fde047');
                completeTask('ch1_tool');
                setAria('Multi-Tool and HV Fuse verified in your pouch! Next, check the Power Console and Life Support.');
                openObjectModal(obj);
            },
            hasCh1Tools ? 'bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
        );

        // Mission 6: LiOH Filter Grab
        const hasFilter = hasItem('LiOH Filter');
        addActionBtn(
            hasFilter ? '✓ Fresh LiOH CO₂ Scrubber Cartridge in Pouch' : 'Collect Fresh LiOH CO₂ Scrubber Cartridge',
            'Required for Mission 6 ECLSS scrubber replacement',
            () => {
                addItem('LiOH Filter');
                if (typeof spawnFloatingText === 'function') spawnFloatingText('LiOH SCRUBBER CARTRIDGE ACQUIRED', state.player.x, state.player.y - 20, '#2dd4bf');
                completeTask('ch6_filter_grab');
                completeTask('ch3_part');
                setAria('Fresh LiOH Scrubber Cartridge collected! Head to the CO₂ Scrubber in Life Support.');
                openObjectModal(obj);
            },
            hasFilter ? 'bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100' : 'bg-teal-600 hover:bg-teal-500 text-white'
        );

        // Mission 8: Pipe Seal Kit Grab
        const hasSealKit = hasItem('Pipe Seal Kit');
        addActionBtn(
            hasSealKit ? '✓ Plumbing Seal Kit & Bioreactor Filter in Pouch' : 'Collect Plumbing Seal Kit & Bioreactor Filter',
            'Required for Mission 8 graywater pipe repair',
            () => {
                addItem('Pipe Seal Kit');
                if (typeof spawnFloatingText === 'function') spawnFloatingText('PLUMBING SEAL KIT ACQUIRED', state.player.x, state.player.y - 20, '#38bdf8');
                completeTask('ch8_pipe_seal');
                completeTask('ch3_part');
                setAria('Plumbing Seal Kit collected! Head to Water Recycling to patch the leaking coupling.');
                openObjectModal(obj);
            },
            hasSealKit ? 'bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100' : 'bg-blue-600 hover:bg-blue-500 text-white'
        );

    } else if (obj.id === 'power_console') {
        const hasFault = state.faults.hvJunctionBroken || pwr.net < 0 || state.faults.breakerTripped;
        badge.textContent = state.faults.breakerTripped ? 'BREAKER TRIPPED' : (hasFault ? 'Bus Under Strain' : 'Bus Nominal');
        badge.className = `text-[11px] font-mono-tech font-semibold px-2.5 py-0.5 rounded-full ${hasFault ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`;

        addMetric('Solar + Gen Output', `${pwr.gen} kW`, 'text-amber-400');
        addMetric('Habitat Load Demand', `${pwr.load} kW`, 'text-white');
        addMetric('Battery State of Charge', `${Math.round(state.batteryKWh)}% (${Math.round(state.batteryKWh)} kWh)`, state.batteryKWh < 40 ? 'text-orange-400' : 'text-sky-300');
        addMetric('Power Net Balance', pwr.net < 0 ? `${pwr.net} kW Deficit` : `+${pwr.net} kW Surplus`, pwr.net < 0 ? 'text-red-400' : 'text-emerald-400');

        desc.textContent = state.faults.breakerTripped
            ? 'CRITICAL FAULT: Main breaker tripped due to persistent power deficit! All non-essential loads have been severed. Reset breakers below to restore habitat systems.'
            : (state.faults.hvJunctionBroken
                ? 'FAULT DETECTED: Blown High-Voltage Junction circuit is causing parasitic load loss. Replace fuse and manage power loads!'
                : 'Electrical bus distributes power from external solar arrays and backup generators to habitat loads.');

        // Breaker Reset if Tripped
        if (state.faults.breakerTripped) {
            addActionBtn(
                '⚡ Reset Main Electrical Breaker & Restore Habitat Buses',
                'Re-energizes Science Lab and Greenhouse circuits after load stabilization',
                () => {
                    state.faults.breakerTripped = false;
                    state.loads.lab.on = true;
                    state.loads.greenhouse.on = true;
                    state.gridOverloadSeconds = 0;
                    if (typeof sfx !== 'undefined' && sfx.success) sfx.success();
                    setAria('Main breaker successfully reset! Power buses restored.');
                    if (typeof updateUI === 'function') updateUI();
                    openObjectModal(obj);
                },
                'bg-red-600 hover:bg-red-500 text-white animate-pulse'
            );
        }

        // Mission 1: Verify Power Telemetry
        addActionBtn(
            'Inspect Habitat Power Telemetry & Bus Status',
            'Electronic verification of solar input, battery buffer, and load distribution',
            () => {
                completeTask('ch1_power');
                completeTask('ch4_power_diag');
                setAria('Power telemetry verified! Array generation and load balance recorded.');
                openObjectModal(obj);
            }
        );

        // Mission 2: Switch on Greenhouse LEDs
        if (state.chapterIdx === 1) {
            addActionBtn(
                state.loads.greenhouse.on ? '✓ Greenhouse LED Circuit Active (+5 kW Load)' : 'Activate Greenhouse LED Array (+5 kW Load)',
                'Energizes PAR grow lights to begin seed germination',
                () => {
                    state.loads.greenhouse.on = true;
                    completeTask('ch2_greenhouse_power');
                    setAria('Greenhouse grow lights activated! Crop germination has begun.');
                    if (typeof updateUI === 'function') updateUI();
                    openObjectModal(obj);
                },
                'bg-emerald-600 hover:bg-emerald-500 text-white'
            );
        }

        // Mission 4: Open Breaker Grid & Shed Loads
        addActionBtn(
            'Open Power Load Breaker Grid (Shed Non-Essential Loads)',
            'Switch off optional Lab/Greenhouse loads to survive dust storm deficit',
            () => {
                document.getElementById('modal-console').classList.add('hidden');
                openPowerModal();
            },
            'bg-amber-500 hover:bg-amber-400 text-slate-950'
        );

        // Mission 4: Replace Blown HV Fuse
        if (state.faults.hvJunctionBroken) {
            addActionBtn(
                'Replace Blown HV Junction Circuit (Requires HV Fuse)',
                hasItem('HV Fuse') ? 'Ready in pouch — eliminates fault loss and restores array efficiency' : 'Requires HV Fuse from Storage Locker',
                () => {
                    state.faults.hvJunctionBroken = false;
                    state.solarOutputKW = 22;
                    if (typeof spawnFloatingText === 'function') spawnFloatingText('+4 kW EFFICIENCY RESTORED', state.player.x, state.player.y - 20, '#38bdf8');
                    completeTask('ch4_replace_fuse');
                    completeTask('ch2_repair');
                    awardBadge('power_saver');
                    setAria('HV Junction repaired! Efficiency restored and Power Saver badge earned!');
                    if (typeof updateUI === 'function') updateUI();
                    openObjectModal(obj);
                },
                'bg-emerald-600 hover:bg-emerald-500 text-white',
                !hasItem('HV Fuse')
            );
        }

        // Mission 4: Spin up Backup Generator
        if (state.chapterIdx === 3 || state.backupGenKW === 0) {
            addActionBtn(
                state.backupGenKW > 0 ? '✓ Backup Generator Running (+10 kW)' : 'Spin Up Emergency Backup Generator (+10 kW)',
                'Burns fuel at 0.25 kg/s to supply 10 kW emergency power during storm',
                () => {
                    state.backupGenKW = 10;
                    completeTask('ch4_gen_backup');
                    setAria('Backup Generator online! Providing 10 kW auxiliary power.');
                    if (typeof updateUI === 'function') updateUI();
                    openObjectModal(obj);
                },
                'bg-orange-500 hover:bg-orange-400 text-slate-950'
            );
        }

    } else if (obj.id === 'co2_scrubber') {
        const isHigh = state.co2PPM > 900 || state.faults.co2FilterClogged;
        badge.textContent = isHigh ? 'CO₂ Warning' : 'ECLSS Nominal';
        badge.className = `text-[11px] font-mono-tech font-semibold px-2.5 py-0.5 rounded-full ${isHigh ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`;

        addMetric('Cabin CO₂ Concentration', `${Math.round(state.co2PPM)} ppm`, isHigh ? 'text-red-400' : 'text-emerald-400');
        addMetric('Oxygen Partial Pressure', `${state.oxygenKPa.toFixed(1)} kPa`, 'text-teal-300');
        addMetric('Primary LiOH Filter', state.faults.co2FilterClogged ? 'SATURATED (FAULT)' : 'CLEAN (ACTIVE)', state.faults.co2FilterClogged ? 'text-red-400' : 'text-emerald-300');
        addMetric('Backup Scrubber Unit', state.loads.backupScrub.on ? 'ONLINE (+3 kW)' : 'STANDBY (0 kW)', 'text-sky-300');

        desc.textContent = state.faults.co2FilterClogged
            ? 'Primary CO₂ scrubber cartridge is saturated! Exhaled carbon dioxide is rising rapidly. Replace the LiOH filter cassette or activate the Backup Scrubber (+3 kW power draw).'
            : 'Environmental Control and Life Support System (ECLSS) maintains breathable oxygen (21.2 kPa) and scrubs metabolically produced CO₂ below 600 ppm.';

        // Mission 1: Verify Life Support
        addActionBtn(
            'Verify Atmospheric Sensors & O₂ Processor',
            'Confirm cabin pressure (101.3 kPa) and oxygen partial pressure (21.2 kPa)',
            () => {
                completeTask('ch1_life');
                setAria('Atmospheric sensors verified! O₂ partial pressure is stable at 21.2 kPa.');
                openObjectModal(obj);
            }
        );

        // Mission 6: Replace Saturated LiOH Filter
        if (state.faults.co2FilterClogged) {
            addActionBtn(
                'Replace Saturated LiOH Filter Cartridge (Recommended)',
                hasItem('LiOH Filter') ? 'Installs fresh LiOH cassette — permanently restores CO₂ scrubbing' : 'Requires LiOH Filter from Maintenance Storage Locker',
                () => {
                    state.faults.co2FilterClogged = false;
                    state.co2PPM = 440;
                    if (typeof spawnFloatingText === 'function') spawnFloatingText('CO₂ SCRUBBER NOMINAL • 420 ppm', state.player.x, state.player.y - 20, '#2dd4bf');
                    completeTask('ch6_filter_install');
                    completeTask('ch6_co2_verify');
                    completeTask('ch3_co2');
                    awardBadge('air_guardian');
                    setAria('Fresh LiOH CO₂ filter installed! Cabin CO₂ is dropping back to 420 ppm. Air Guardian badge unlocked!');
                    if (typeof updateUI === 'function') updateUI();
                    openObjectModal(obj);
                },
                'bg-emerald-600 hover:bg-emerald-500 text-white',
                !hasItem('LiOH Filter')
            );
        }

        // Mission 6: Verify CO2 Below Safe Limit
        addActionBtn(
            'Verify Cabin CO₂ Scrubber Recovery (< 600 ppm)',
            'Check real-time air telemetry across all habitat compartments',
            () => {
                if (state.co2PPM <= 650) {
                    completeTask('ch6_co2_verify');
                    setAria('CO₂ verified nominal at safe levels!');
                } else {
                    setAria(`Current CO₂ is ${Math.round(state.co2PPM)} ppm. Replace filter or run backup scrubber to lower it!`);
                }
                openObjectModal(obj);
            }
        );

        // Backup Scrubber Toggle
        addActionBtn(
            state.loads.backupScrub.on ? 'Shut Down Backup CO₂ Scrubber (Save 3 kW)' : 'Emergency: Activate Backup CO₂ Scrubber (+3 kW Load)',
            'Trade-off: Scrubs CO₂ immediately using redundant bed, but adds 3 kW electrical demand',
            () => {
                state.loads.backupScrub.on = !state.loads.backupScrub.on;
                if (state.loads.backupScrub.on) {
                    state.co2PPM = Math.min(state.co2PPM, 650);
                    completeTask('ch6_filter_install');
                    completeTask('ch6_co2_verify');
                }
                if (typeof updateUI === 'function') updateUI();
                openObjectModal(obj);
            },
            'bg-amber-500 hover:bg-amber-400 text-slate-950'
        );

    } else if (obj.id === 'greenhouse_console') {
        const cropNames = ['Seedling Sprout Phase', 'Vegetative Foliage Phase', 'Mature Fruiting & Grain Harvest'];
        badge.textContent = state.faults.irrigationPumpBroken ? 'Irrigation Fault' : cropNames[state.cropGrowthStage || 0];
        addMetric('Food Reserves', `${Math.round(state.foodCrewDays)} Crew-Days`, 'text-lime-400');
        addMetric('Crop Lifecycle', cropNames[state.cropGrowthStage || 0], 'text-emerald-300');
        addMetric('Grow LED Lighting', state.loads.greenhouse.on ? 'ACTIVE (ON)' : 'OFF', state.loads.greenhouse.on ? 'text-emerald-400' : 'text-amber-400');
        addMetric('Dome Temperature', `${state.temperatureC.toFixed(1)} °C`, 'text-sky-300');

        // Irrigation Pump Fault Repair
        if (state.faults.irrigationPumpBroken) {
            addActionBtn(
                'Repair Nutrient Delivery Irrigation Pump (Requires Multi-Tool)',
                hasItem('Multi-Tool') ? 'Clears sediment blockage and restores nutrient circulation to crops' : 'Requires Multi-Tool from Maintenance Storage',
                () => {
                    state.faults.irrigationPumpBroken = false;
                    state.foodCrewDays += 9;
                    if (typeof spawnFloatingText === 'function') spawnFloatingText('+9 DAYS FOOD RESERVES RESTORED', state.player.x, state.player.y - 20, '#4ade80');
                    completeTask('ch4_pump');
                    setAria('Irrigation pump repaired and nutrients calibrated! Make sure Greenhouse LEDs are switched ON.');
                    if (typeof updateUI === 'function') updateUI();
                    openObjectModal(obj);
                },
                'bg-emerald-600 hover:bg-emerald-500 text-white',
                !hasItem('Multi-Tool')
            );
        }

        desc.textContent = 'Hydroponic crop beds grow dwarf wheat, lettuce, and microgreens to supplement packaged rations. Plants require balanced nutrients, 21 °C temperature, and PAR spectrum grow lighting.';

        // Mission 2: Inspect Crop Beds
        addActionBtn(
            'Inspect Hydroponic Seed Trays & Root Substrate',
            'Examine moisture retention and seed germination telemetry',
            () => {
                completeTask('ch2_crop_inspect');
                setAria('Seed beds inspected! Now head to Water Recycling to formulate the mineral nutrient dosing mix.');
                openObjectModal(obj);
            }
        );

        // Mission 10: Harvest Mature Wheat & Cryo-Stash Seeds
        if (state.chapterIdx === 9 || state.cropGrowthStage >= 2) {
            const seedsDone = (typeof isTaskDone === 'function') ? isTaskDone('ch10_greenhouse_seeds') : false;
            addActionBtn(
                seedsDone ? '✓ Generation-2 Seeds Cryo-Preserved in Storage Vault' : 'Harvest Mature Dwarf Wheat & Cryo-Stash Generation-2 Seeds',
                seedsDone ? 'Genetically adapted seeds vaulted for return to Earth in ERV' : 'Preserves genetically adapted seeds for return to Earth in the ERV',
                () => {
                    completeTask('ch10_greenhouse_seeds');
                    if (typeof spawnFloatingText === 'function') spawnFloatingText('CRYO-SEEDS VAULTED', state.player.x, state.player.y - 20, '#4ade80');
                    awardBadge('chapea_botanist');
                    setAria('Generation-2 seeds successfully cryo-preserved! Head to the Science Lab to complete the outpost handover.');
                    if (typeof updateUI === 'function') updateUI();
                    openObjectModal(obj);
                },
                seedsDone ? 'bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            );
        }

        // Toggle LEDs
        addActionBtn(
            state.loads.greenhouse.on ? 'Verify Greenhouse LEDs Active (5 kW)' : 'Switch ON Greenhouse LED Array (+5 kW)',
            'Allocates power to sustain ongoing plant growth and crew psychology',
            () => {
                state.loads.greenhouse.on = true;
                completeTask('ch2_greenhouse_power');
                if (typeof updateUI === 'function') updateUI();
                openObjectModal(obj);
            },
            'bg-amber-500 hover:bg-amber-400 text-slate-950'
        );

    } else if (obj.id === 'water_recycler') {
        const badWater = state.faults.waterPipeLeaking || state.waterConductivity > 60;
        badge.textContent = badWater ? 'Contamination Alert' : 'Potable Purity Verified';
        badge.className = `text-[11px] font-mono-tech font-semibold px-2.5 py-0.5 rounded-full ${badWater ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`;

        addMetric('Potable Water Reserve', `${Math.round(state.waterLitres)} Litres`, 'text-blue-400');
        addMetric('Water Conductivity', `${state.waterConductivity} µS/cm`, badWater ? 'text-amber-400' : 'text-emerald-400');
        addMetric('Recycling Loop', state.faults.waterPipeLeaking ? 'LEAKING (-1.2 L/min)' : 'SEALED (100%)', state.faults.waterPipeLeaking ? 'text-red-400' : 'text-emerald-300');
        addMetric('Purity Standard', '< 60 µS/cm for Drinking', 'text-slate-300');

        desc.textContent = badWater
            ? 'WARNING: Cracked coupling in the greywater line is leaking and raising ionic conductivity to 190 µS/cm. Seal the pipe and flush the bioreactor loop!'
            : 'Closed-loop ECLSS water recovery distills and filters humidity condensate and hygiene greywater, verifying potable quality via electrical conductivity (<60 µS/cm).';

        // Mission 2: Nutrient Mix
        if (state.chapterIdx === 1) {
            addActionBtn(
                'Formulate Hydroponic N-P-K Mineral Nutrient Solution',
                'Mixes nitrogen, phosphorus, and potassium trace minerals for greenhouse dosing',
                () => {
                    completeTask('ch2_nutrient_mix');
                    setAria('Nutrient solution formulated and injected into hydroponic irrigation lines!');
                    openObjectModal(obj);
                },
                'bg-emerald-600 hover:bg-emerald-500 text-white'
            );
        }

        // Mission 8: Seal Pipe & Flush Loop
        if (state.faults.waterPipeLeaking || state.waterConductivity > 60) {
            addActionBtn(
                'Seal Cracked Pipe Coupling & Flush Bioreactor Filter Loop',
                hasItem('Pipe Seal Kit') ? 'Stops leak and purifies water batch to 38 µS/cm' : 'Requires Pipe Seal Kit from Maintenance Storage Locker',
                () => {
                    state.faults.waterPipeLeaking = false;
                    state.waterConductivity = 38;
                    state.waterLitres = Math.min(500, state.waterLitres + 40);
                    if (typeof spawnFloatingText === 'function') spawnFloatingText('PIPE SEALED • 38 µS/cm NOMINAL', state.player.x, state.player.y - 20, '#38bdf8');
                    completeTask('ch8_flush_bioreactor');
                    completeTask('ch8_conductivity_check');
                    completeTask('ch3_water');
                    awardBadge('water_wizard');
                    setAria('Pipe sealed and bioreactor flushed! Water conductivity verified at 38 µS/cm.');
                    if (typeof updateUI === 'function') updateUI();
                    openObjectModal(obj);
                },
                'bg-emerald-600 hover:bg-emerald-500 text-white',
                !hasItem('Pipe Seal Kit')
            );
        } else {
            addActionBtn(
                'Verify Potable Water Purity Batch (< 60 µS/cm)',
                'Confirm ionic purity and reserve level for crew & greenhouse',
                () => {
                    completeTask('ch8_conductivity_check');
                    setAria('Water batch verified safe at 38 µS/cm!');
                    openObjectModal(obj);
                }
            );
        }

    } else if (obj.id === 'mars_rover') {
        badge.textContent = 'NASA 3D Surface Assets';
        addMetric('Rover Telemetry', 'NASA Perseverance Linked', 'text-emerald-400');
        addMetric('Scout Helicopter', 'Ingenuity Pre-Flight Green', 'text-teal-300');
        addMetric('Coring Drill Assembly', state.hasCoreSample ? 'BASALT CORE SECURED' : 'STOWED (READY)', state.hasCoreSample ? 'text-amber-300' : 'text-sky-300');
        addMetric('Emergency Power Bus', '15 kWh Available', 'text-purple-300');

        desc.textContent = 'NASA Perseverance Rover and Ingenuity Mars Helicopter stationed outside the Astra-1 airlock for geological prospecting and delta exploration.';

        // Mission 3: Link Rover Telemetry
        addActionBtn(
            'Establish Umbilical Telemetry Link with Perseverance Rover',
            'Synchronizes rover navigation, MMRTG thermal bus, and science instruments',
            () => {
                completeTask('ch3_rover_link');
                setAria('Perseverance telemetry linked! MMRTG and mobility systems operational.');
                openObjectModal(obj);
            },
            'bg-sky-600 hover:bg-sky-500 text-white'
        );

        // Mission 3: Inspect Ingenuity
        addActionBtn(
            'Execute Rotor Pre-Flight Diagnostics on Ingenuity Helicopter',
            'Spins coaxial carbon-fiber rotors to 2,400 RPM to verify aerodynamics in thin Martian air',
            () => {
                completeTask('ch3_heli_inspect');
                setAria('Ingenuity avionics and solar panel confirmed green for reconnaissance flight!');
                openObjectModal(obj);
            },
            'bg-teal-600 hover:bg-teal-500 text-white'
        );

        // Mission 7: Drill Jezero Core Sample
        if (state.chapterIdx === 6 || !state.hasCoreSample) {
            addActionBtn(
                'Deploy Rotary-Percussive Coring Drill into Delta Basalt',
                'Extracts a 6-centimeter cylindrical rock core for astrobiological analysis',
                () => {
                    state.hasCoreSample = true;
                    completeTask('ch7_drill_core');
                    setAria('Pristine basalt core extracted! Return inside to the Science Lab to hermetically seal the canister.');
                    if (typeof updateUI === 'function') updateUI();
                    openObjectModal(obj);
                },
                'bg-amber-500 hover:bg-amber-400 text-slate-950'
            );
        }

        // Emergency Power Transfer
        addActionBtn(
            'Transfer 15 kWh Emergency Rover Battery to Habitat',
            'Transfers mobile power reserve into Astra-1 main battery bank',
            () => {
                state.batteryKWh = Math.min(100, state.batteryKWh + 15);
                if (typeof sfx !== 'undefined' && sfx.success) sfx.success();
                setAria('Transferred 15 kWh from rover into Astra-1 main battery bank!');
                if (typeof updateUI === 'function') updateUI();
                openObjectModal(obj);
            },
            'bg-slate-700 hover:bg-slate-600 text-white'
        );

    } else if (obj.id === 'solar_array_eva') {
        badge.textContent = 'Outdoor Photovoltaic Field';
        addMetric('Current Array Output', `${state.solarOutputKW} kW`, 'text-amber-400');
        addMetric('Atmospheric Opacity (Tau)', state.faults.dustStormActive ? 'Tau 3.8 (Severe Dust)' : 'Tau 0.5 (Clear)', 'text-orange-300');
        addMetric('Wind Latch Status', state.faults.externalConduitDamaged ? 'VIBRATING / STRAINED' : 'LOCKED (100%)', 'text-sky-300');
        addMetric('EVA Suit Protection', state.player.inSuit ? 'PRESSURIZED (SAFE)' : 'UNSUITED HAZARD!', state.player.inSuit ? 'text-emerald-400' : 'text-red-500');

        desc.textContent = 'External solar tracking arrays supply primary power to Astra-1. Severe dust accumulation and high wind shear require physical latch maintenance.';

        // Mission 5: Secure Array Latches
        addActionBtn(
            'Secure Heavy Mechanical Wind Latches Against Regolith Gale',
            'Prevents catastrophic array flutter and structural damage during the storm',
            () => {
                completeTask('ch5_secure_latch');
                setAria('Wind latches clamped tight! Now inspect and re-anchor the external HV conduit.');
                openObjectModal(obj);
            },
            'bg-amber-500 hover:bg-amber-400 text-slate-950'
        );

        // Mission 5: Verify External Conduit
        addActionBtn(
            'Re-Anchor & Verify External High-Voltage Solar Conduit',
            'Ensures all electrical lines from arrays feed reliably into the habitat bus',
            () => {
                state.faults.externalConduitDamaged = false;
                state.solarOutputKW = Math.max(state.solarOutputKW, 22);
                completeTask('ch5_conduit_verify');
                setAria('Conduit secured and signal integrity verified! Return inside through the Airlock.');
                if (typeof updateUI === 'function') updateUI();
                openObjectModal(obj);
            },
            'bg-emerald-600 hover:bg-emerald-500 text-white'
        );

    } else if (obj.id === 'lab_console') {
        badge.textContent = state.hasCoreSample ? 'Geological Samples Stored' : 'Spectrometer Ready';
        addMetric('Mass Spectrometer', 'Calibrated (Argon/Methane)', 'text-teal-300');
        addMetric('Jezero Core Canister', state.hasCoreSample ? 'SEALED IN HERMETIC VAULT' : 'PENDING EXTRACTION', state.hasCoreSample ? 'text-emerald-400' : 'text-slate-400');
        addMetric('High-Gain Earth Uplink', state.faults.commsAntennaOffline ? 'OFFLINE' : 'LOCKED ON HOUSTON', state.faults.commsAntennaOffline ? 'text-red-400' : 'text-emerald-400');
        addMetric('Expedition Sol', `SOL ${state.sol} / 378`, 'text-amber-300');

        desc.textContent = 'Astra-1 Science Laboratory & Medical Bay. Houses analytical instruments, deep-space communication uplinks, and hermetic sample vaults for Mars sample return.';

        // Mission 7: Calibrate Mass Spec
        addActionBtn(
            'Calibrate Laboratory Mass Spectrometer & Raman Sensor',
            'Performs automated baseline scan for organic carbon and hydrous minerals',
            () => {
                completeTask('ch7_lab_terminal');
                setAria('Mass Spectrometer calibrated! Ready to analyze sediment cores.');
                openObjectModal(obj);
            }
        );

        // Mission 7: Seal Sample Canister
        if (state.hasCoreSample || state.chapterIdx === 6) {
            addActionBtn(
                'Hermetically Seal Jezero Core Canister into Scientific Sample Vault',
                'Creates double-brazed titanium seal to prevent terrestrial contamination',
                () => {
                    state.hasCoreSample = true;
                    if (typeof spawnFloatingText === 'function') spawnFloatingText('CORE CANISTER SEALED', state.player.x, state.player.y - 20, '#2dd4bf');
                    completeTask('ch7_seal_canister');
                    setAria('Sample canister hermetically sealed! Core preserved for Earth laboratory analysis.');
                    if (typeof updateUI === 'function') updateUI();
                    openObjectModal(obj);
                },
                'bg-emerald-600 hover:bg-emerald-500 text-white'
            );
        }

        // Mission 10: Package Cores for ERV
        if (state.chapterIdx === 9) {
            const coresDone = (typeof isTaskDone === 'function') ? isTaskDone('ch10_package_cores') : false;
            const seedsDone = (typeof isTaskDone === 'function') ? isTaskDone('ch10_greenhouse_seeds') : false;
            const prereqsDone = coresDone && seedsDone;

            addActionBtn(
                coresDone ? '✓ Jezero Core Canisters Packaged in ERV Container' : 'Package Certified Core Canisters into Earth Return Vehicle (ERV) Container',
                coresDone ? 'Verified and secured in transit shock harness' : 'Secures all sampled geological tubes in shock-absorbing transit harness',
                () => {
                    state.coresPackaged = true;
                    completeTask('ch10_package_cores');
                    if (typeof spawnFloatingText === 'function') spawnFloatingText('CORE CANISTERS PACKAGED FOR ERV', state.player.x, state.player.y - 20, '#38bdf8');
                    setAria('Core canisters secured into ERV return module! ' + (seedsDone ? 'All pre-handover checklists complete — you can now transmit the final report!' : 'Next, deposit generation-2 cryo-seeds in the Greenhouse.'));
                    if (typeof updateUI === 'function') updateUI();
                    openObjectModal(obj);
                },
                coresDone ? 'bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100' : 'bg-sky-600 hover:bg-sky-500 text-white'
            );

            // Mission 10: Transmit Final 378-Sol Report & Complete Campaign
            // LOCKED until all other Chapter 10 tasks (cores & seeds) are completed!
            const remaining = [];
            if (!coresDone) remaining.push('Package Cores (Lab)');
            if (!seedsDone) remaining.push('Cryo-Seeds (Greenhouse)');

            addActionBtn(
                prereqsDone
                    ? '★ Transmit Final 378-Sol Outpost Handover Debrief to Houston'
                    : `★ Transmit Handover (Locked: Complete ${remaining.join(' & ')})`,
                prereqsDone
                    ? 'Concludes NASA CHAPEA 378-Sol Simulation and triggers Mission Certification!'
                    : `Prerequisite checklist incomplete! Must finish: ${remaining.join(' and ')} before handover.`,
                () => {
                    if (!prereqsDone) {
                        setAria(`CANNOT TRANSMIT HANDOVER: Incomplete checklists! Must finish: ${remaining.join(' and ')} first.`);
                        if (typeof sfx !== 'undefined' && sfx.alert) sfx.alert();
                        return;
                    }
                    completeTask('ch10_final_report');
                    if (typeof spawnFloatingText === 'function') spawnFloatingText('378-SOL EXPEDITION COMPLETE!', state.player.x, state.player.y - 20, '#fbbf24');
                    document.getElementById('modal-console').classList.add('hidden');
                    showVictoryModal();
                },
                prereqsDone
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700',
                !prereqsDone
            );
        } else {
            // General Medical Scan
            addActionBtn(
                'Run Crew Medical & Telemetry Readiness Scan',
                'Restores crew health to 100% and logs daily science data',
                () => {
                    state.crewHealth = 100;
                    setAria('Crew medical scan complete! All five astronauts are in peak health.');
                    if (typeof updateUI === 'function') updateUI();
                    openObjectModal(obj);
                }
            );
        }

    } else if (obj.id === 'shelter_console') {
        badge.textContent = state.faults.radiationAlertActive ? 'SPE RADIATION CODE RED' : (state.faults.shelterProtocolActive ? 'Shelter Fully Shielded' : 'Shelter Nominal');
        badge.className = `text-[11px] font-mono-tech font-semibold px-2.5 py-0.5 rounded-full ${state.faults.radiationAlertActive ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse' : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'}`;

        addMetric('Surface Radiation Dose', `${state.radiationMSvH.toFixed(2)} mSv/h`, state.radiationMSvH > 0.5 ? 'text-red-400' : 'text-emerald-400');
        addMetric('Water-Wall Shielding', state.faults.shelterProtocolActive ? 'FLOODED (420 L H₂O Jacket)' : 'STANDBY (DRAINED)', 'text-sky-300');
        addMetric('Shelter Protocol', state.faults.shelterProtocolActive ? 'ACTIVE (CREW SHIELDED)' : 'STANDBY', 'text-purple-300');
        addMetric('Crew Health', `${Math.round(state.crewHealth)}%`, 'text-emerald-400');

        desc.textContent = 'Radiation Shelter & Crew Quarters. Water storage tanks encase the compartment walls, creating a hydrogen-dense barrier that stops high-energy solar proton events (SPE).';

        // Mission 9: Alarm Siren
        addActionBtn(
            'Sound Habitat-Wide Solar Particle Event (SPE) Emergency Siren',
            'Broadcasts alert chimes to all modules instructing astronauts to abandon stations',
            () => {
                completeTask('ch9_alarm_siren');
                completeTask('ch5_shelter');
                if (typeof spawnFloatingText === 'function') spawnFloatingText('EMERGENCY SIREN SOUNDED', state.player.x, state.player.y - 20, '#ef4444');
                if (typeof sfx !== 'undefined' && sfx.alert) sfx.alert();
                setAria('Emergency radiation siren sounding! Evacuate crew to shelter immediately.');
                openObjectModal(obj);
            },
            'bg-red-600 hover:bg-red-500 text-white'
        );

        // Mission 9: Evacuate Crew
        addActionBtn(
            'Evacuate All 5 Crew Members into Protected Quarters',
            'Accounts for every astronaut and secures compartment airtight pressure hatch',
            () => {
                completeTask('ch9_shelter_evac');
                if (typeof spawnFloatingText === 'function') spawnFloatingText('5 CREW EVACUATED TO SHELTER', state.player.x, state.player.y - 20, '#c084fc');
                setAria('All five astronauts safely inside the radiation shelter!');
                openObjectModal(obj);
            },
            'bg-purple-600 hover:bg-purple-500 text-white'
        );

        // Mission 9: Water Shield Flood
        addActionBtn(
            'Deploy Water-Wall Protective Flood (420 L Hydrogen Shielding)',
            'Attenuates proton flux, dropping exposure from 3.20 mSv/h down to safe 0.04 mSv/h',
            () => {
                state.faults.radiationAlertActive = false;
                state.faults.shelterProtocolActive = true;
                state.radiationMSvH = 0.04;
                if (typeof spawnFloatingText === 'function') spawnFloatingText('WATER-WALL FLOODED • 0.04 mSv/h', state.player.x, state.player.y - 20, '#38bdf8');
                completeTask('ch9_water_shield');
                completeTask('ch5_shelter');
                awardBadge('storm_survivor');
                setAria('Water wall flooded! Crew dose rate reduced to 0.04 mSv/h. Storm Survivor badge earned!');
                if (typeof updateUI === 'function') updateUI();
                openObjectModal(obj);
            },
            'bg-blue-600 hover:bg-blue-500 text-white'
        );
    }

    const consoleModal = document.getElementById('modal-console');
    if (consoleModal) consoleModal.classList.remove('hidden');
}

// --- POWER DISTRIBUTION GRID MODAL ---
function openPowerModal() {
    const pwr = getPowerStats();
    document.getElementById('pwr-modal-gen').textContent = `${pwr.gen} kW`;
    document.getElementById('pwr-modal-gen-sub').textContent = `Solar: ${state.solarOutputKW} kW | Backup: ${state.backupGenKW} kW`;
    document.getElementById('pwr-modal-load').textContent = `${pwr.load} kW`;
    document.getElementById('pwr-modal-soc').textContent = `${Math.round(state.batteryKWh)}%`;

    const netEl = document.getElementById('pwr-modal-net');
    if (pwr.net < 0) {
        netEl.textContent = `${pwr.net} kW Deficit`;
        netEl.className = 'text-xl font-bold text-red-400';
    } else {
        netEl.textContent = `+${pwr.net} kW Surplus`;
        netEl.className = 'text-xl font-bold text-emerald-400';
    }

    const list = document.getElementById('power-breaker-list');
    list.innerHTML = '';

    // Backup RTG / Fission Generator Toggle
    const genDiv = document.createElement('div');
    genDiv.className = 'flex items-center justify-between bg-amber-950/40 border border-amber-500/40 p-2.5 rounded-xl';
    genDiv.innerHTML = `
        <div>
            <div class="font-bold text-amber-300 text-xs sm:text-sm">Backup RTG / Fission Surface Generator</div>
            <div class="text-[10px] font-mono-tech text-amber-200/70">Supplies +12 kW emergency power | Fuel: <span class="text-amber-300 font-bold">${state.backupFuelKg.toFixed(1)} kg</span></div>
        </div>
        <button id="toggle-backup-gen" class="px-3 py-1 rounded-lg font-mono-tech font-bold text-xs ${state.backupGenKW > 0 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 border border-slate-600'}">
            ${state.backupGenKW > 0 ? 'ONLINE (+12 kW)' : 'OFF (0 kW)'}
        </button>
    `;
    list.appendChild(genDiv);
    genDiv.querySelector('#toggle-backup-gen').addEventListener('click', () => {
        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
        if (state.backupGenKW === 0 && state.backupFuelKg <= 0) {
            setAria("CANNOT ACTIVATE: Backup generator fuel reserve is depleted (0.0 kg)!");
            if (window.sfx && typeof sfx.alert === 'function') sfx.alert();
            return;
        }
        state.backupGenKW = state.backupGenKW > 0 ? 0 : 12;
        if (state.backupGenKW > 0) completeTask('ch5_gen');
        checkPowerTasks();
        updateUI();
        openPowerModal();
    });

    // Individual Load Breakers
    Object.entries(state.loads).forEach(([key, item]) => {
        const row = document.createElement('div');
        row.className = 'flex items-center justify-between bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl';
        row.innerHTML = `
            <div>
                <div class="font-semibold text-white text-xs sm:text-sm flex items-center gap-2">
                    <span>${item.name}</span>
                    <span class="text-[9px] font-mono-tech px-1.5 py-0.5 rounded ${item.essential ? 'bg-red-500/20 text-red-300' : 'bg-sky-500/20 text-sky-300'}">${item.essential ? 'ESSENTIAL' : 'DEFERRABLE'}</span>
                </div>
                <div class="text-[10px] font-mono-tech text-slate-400">Demand: ${item.kw} kW</div>
            </div>
            <button class="px-3 py-1 rounded-lg font-mono-tech font-bold text-xs ${item.on ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
                ${item.on ? `ON (${item.kw} kW)` : 'SHED (0 kW)'}
            </button>
        `;
        row.querySelector('button').addEventListener('click', () => {
            if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
            item.on = !item.on;
            if (key === 'lifesupport' && !item.on) {
                setAria("WARNING! You shut off Primary Life Support! Carbon dioxide (ppm) is now rising rapidly in the habitat!");
                if (window.sfx && typeof sfx.alert === 'function') sfx.alert();
            }
            checkPowerTasks();
            updateUI();
            openPowerModal();
        });
        list.appendChild(row);
    });

    const powerModal = document.getElementById('modal-power');
    if (powerModal) powerModal.classList.remove('hidden');
}

function checkPowerTasks() {
    const pwr = getPowerStats();
    if (pwr.net >= 0 && state.loads.lifesupport.on) {
        completeTask('ch2_shed');
        awardBadge('power_saver');
        if (state.chapterIdx === 3 && state.loads.greenhouse.on && !state.faults.irrigationPumpBroken) {
            completeTask('ch4_power');
        }
        if (state.chapterIdx === 5 && !state.faults.waterPipeLeaking && !state.faults.externalConduitDamaged) {
            completeTask('ch6_systems');
        }
    }
}

// --- CODEX & BADGES MODAL ---
function openCodexModal() {
    const badgesContainer = document.getElementById('codex-badges');
    if (badgesContainer && typeof BADGES !== 'undefined') {
        badgesContainer.innerHTML = '';
        BADGES.forEach(b => {
            const earned = state.earnedBadges.includes(b.id);
            const card = document.createElement('div');
            card.className = `p-3 rounded-xl border text-center ${earned ? 'bg-amber-500/15 border-amber-400/50 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-500'}`;
            card.innerHTML = `
                <div class="w-9 h-9 mx-auto mb-1.5 rounded-full flex items-center justify-center ${earned ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-600'}">
                    <i class="fa-solid ${b.icon}"></i>
                </div>
                <div class="font-bold text-xs font-display">${b.name}</div>
                <div class="text-[10px] mt-1 leading-tight opacity-85">${b.desc}</div>
            `;
            badgesContainer.appendChild(card);
        });
    }

    const factsContainer = document.getElementById('codex-facts');
    if (factsContainer && typeof SPACE_FACTS !== 'undefined') {
        factsContainer.innerHTML = '';
        const factCount = document.getElementById('fact-count');
        if (factCount) factCount.textContent = state.unlockedFacts.length;

        Object.entries(SPACE_FACTS).forEach(([id, fact]) => {
            const unlocked = state.unlockedFacts.includes(id);
            const fCard = document.createElement('div');
            fCard.className = `p-3 rounded-xl border ${unlocked ? 'bg-sky-950/30 border-sky-500/40 text-slate-200' : 'bg-slate-900/50 border-slate-800 text-slate-500'}`;
            fCard.innerHTML = `
                <div class="font-bold text-sky-300 font-mono-tech text-[11px] mb-1">
                    <i class="fa-solid ${unlocked ? 'fa-unlock text-emerald-400' : 'fa-lock'} mr-1"></i>
                    ${unlocked ? fact.title : 'Inspect Outpost Equipment to Unlock'}
                </div>
                <p class="text-[11px] leading-relaxed">${unlocked ? fact.text : 'Walk up to habitat consoles and press [E] to discover NASA science facts.'}</p>
            `;
            factsContainer.appendChild(fCard);
        });
    }

    const codexModal = document.getElementById('modal-codex');
    if (codexModal) codexModal.classList.remove('hidden');
}

// --- UI & TELEMETRY HUD UPDATER ---
function updateUI() {
    syncTasksWithState();
    if (typeof CHAPTERS === 'undefined' || !state) return;
    const ch = CHAPTERS[state.chapterIdx];
    if (!ch) return;
    const pwr = getPowerStats();

    // Sol & Chapter Header
    const hudSol = document.getElementById('hud-sol');
    if (hudSol) hudSol.textContent = `SOL ${String(state.sol).padStart(2, '0')} / 378`;

    const chSel = document.getElementById('chapter-select');
    if (chSel && chSel.value !== String(state.chapterIdx)) {
        chSel.value = String(state.chapterIdx);
    }

    const hudTag = document.getElementById('hud-chapter-tag');
    if (hudTag) hudTag.textContent = ch.title.split('—')[0].trim().toUpperCase();

    const solRange = document.getElementById('chapter-sol-range');
    if (solRange) solRange.textContent = ch.solRange;

    // Current Room Indicator
    if (typeof ROOMS !== 'undefined') {
        const currentRoom = ROOMS.find(r =>
            state.player.x >= r.x && state.player.x <= r.x + r.w &&
            state.player.y >= r.y && state.player.y <= r.y + r.h
        );
        const locEl = document.getElementById('hud-location');
        if (locEl && currentRoom) {
            locEl.innerHTML = `
                <i class="fa-solid fa-location-crosshairs text-sky-400 text-[11px]"></i>
                <span>${currentRoom.name}</span>
            `;
        }
    }

    // Telemetry Top Bar Readouts
    const valPower = document.getElementById('val-power');
    if (valPower) {
        valPower.textContent = `${pwr.gen} / ${pwr.load} kW`;
        valPower.className = `font-bold text-[11px] sm:text-xs ${pwr.net < 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`;
    }

    const valBat = document.getElementById('val-battery');
    if (valBat) {
        valBat.textContent = `${Math.round(state.batteryKWh)}% (${Math.round(state.batteryKWh)} kWh)`;
        valBat.className = `font-bold text-[11px] sm:text-xs ${state.batteryKWh < 35 ? 'text-amber-400' : 'text-sky-300'}`;
    }

    const valAtmo = document.getElementById('val-atmo');
    if (valAtmo) {
        valAtmo.textContent = `${state.cabinPressureKPa.toFixed(1)} kPa | ${Math.round(state.co2PPM)} ppm`;
        valAtmo.className = `font-bold text-[11px] sm:text-xs ${state.co2PPM > 900 ? 'text-red-400 animate-pulse' : 'text-teal-300'}`;
    }

    const valWater = document.getElementById('val-water');
    if (valWater) {
        valWater.textContent = `${Math.round(state.waterLitres)} L | ${state.waterConductivity} µS/cm`;
        valWater.className = `font-bold text-[11px] sm:text-xs ${state.waterConductivity > 60 || state.faults.waterPipeLeaking ? 'text-amber-400' : 'text-blue-300'}`;
    }

    const valEnv = document.getElementById('val-env');
    if (valEnv) {
        const effRad = state.weatherMutator === 'solar_max' ? state.radiationMSvH * 1.65 : state.radiationMSvH;
        valEnv.textContent = `${Math.round(state.foodCrewDays)}d | ${effRad.toFixed(2)} mSv/h`;
        valEnv.className = `font-bold text-[11px] sm:text-xs ${effRad > 0.5 ? 'text-red-400' : 'text-lime-300'}`;
    }

    // Cadet Mode 3 Core Meters
    const cadetValPower = document.getElementById('cadet-val-power');
    if (cadetValPower) {
        const isNetNeg = pwr.net < 0;
        cadetValPower.textContent = `${Math.round(state.batteryKWh)}% ${isNetNeg ? '(-kW Deficit)' : '(Stable)'}`;
        cadetValPower.className = `font-bold text-[11px] ${state.batteryKWh < 35 || isNetNeg ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`;
    }

    const cadetValLife = document.getElementById('cadet-val-life');
    if (cadetValLife) {
        const isLifeWarn = state.co2PPM > 900 || state.waterConductivity > 60 || state.faults.co2FilterClogged || state.faults.waterPipeLeaking;
        cadetValLife.textContent = isLifeWarn ? 'Alert (Check ECLSS)' : 'Optimal (Air & H2O)';
        cadetValLife.className = `font-bold text-[11px] ${isLifeWarn ? 'text-amber-400 animate-pulse' : 'text-teal-300'}`;
    }

    const cadetValRad = document.getElementById('cadet-val-rad');
    if (cadetValRad) {
        const effRad = state.weatherMutator === 'solar_max' ? state.radiationMSvH * 1.65 : state.radiationMSvH;
        const isRadDanger = effRad > 0.5 || state.faults.radiationAlertActive;
        cadetValRad.textContent = isRadDanger ? 'STORM ALERT (SHELTER!)' : `${effRad.toFixed(2)} mSv/h (Safe)`;
        cadetValRad.className = `font-bold text-[11px] ${isRadDanger ? 'text-red-400 animate-pulse' : 'text-sky-300'}`;
    }

    const trainerHealthEl = document.getElementById('trainer-health-text');
    if (trainerHealthEl) {
        trainerHealthEl.textContent = `Nova: ${Math.round(state.crewHealth)}%`;
    }

    // Suit & Crew Health
    const suitPill = document.getElementById('suit-status-pill');
    if (suitPill) {
        if (state.player.inSuit) {
            suitPill.textContent = 'EVA SUIT ON';
            suitPill.className = 'text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40';
        } else {
            suitPill.textContent = 'IVA HABITAT';
            suitPill.className = 'text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300';
        }
    }

    const healthVal = document.getElementById('crew-health-val');
    if (healthVal) healthVal.textContent = `${Math.round(state.crewHealth)}% OK`;

    const healthBar = document.getElementById('crew-health-bar');
    if (healthBar) healthBar.style.width = `${Math.max(0, Math.min(100, state.crewHealth))}%`;

    // Rolling sparkline updates
    if (Math.random() < 0.25) {
        sparklineHistory.battery.push(Math.round(state.batteryKWh));
        if (sparklineHistory.battery.length > 20) sparklineHistory.battery.shift();
        sparklineHistory.co2.push(Math.round(state.co2PPM));
        if (sparklineHistory.co2.length > 20) sparklineHistory.co2.shift();
    }
    drawSparkline('spark-battery', sparklineHistory.battery, '#38bdf8', 'rgba(56, 189, 248, 0.25)');
    drawSparkline('spark-co2', sparklineHistory.co2, '#2dd4bf', 'rgba(45, 212, 191, 0.25)');

    const badgeCount = document.getElementById('badge-count');
    if (badgeCount) badgeCount.textContent = `${state.earnedBadges.length}/${typeof BADGES !== 'undefined' ? BADGES.length : 5}`;

    // Emergency Banner
    const banner = document.getElementById('emergency-banner');
    const bannerText = document.getElementById('emergency-text');
    if (banner && bannerText) {
        if (state.faults.radiationAlertActive) {
            banner.classList.remove('hidden');
            bannerText.textContent = `SOLAR PARTICLE EVENT: ${state.radiationMSvH.toFixed(2)} mSv/h — SHELTER IN CREW QUARTERS!`;
        } else if (pwr.net < 0) {
            banner.classList.remove('hidden');
            bannerText.textContent = `POWER DEFICIT (${pwr.net} kW): SHED NON-ESSENTIAL LOADS OR REPAIR ARRAY!`;
        } else if (state.co2PPM > 1000 || state.faults.co2FilterClogged) {
            banner.classList.remove('hidden');
            bannerText.textContent = `HIGH CO₂ (${Math.round(state.co2PPM)} ppm): SERVICE SCRUBBER IN LIFE SUPPORT!`;
        } else if (state.faults.waterPipeLeaking) {
            banner.classList.remove('hidden');
            bannerText.textContent = `WATER LEAK & HIGH CONDUCTIVITY (${state.waterConductivity} µS/cm) IN WATER ROOM!`;
        } else {
            banner.classList.add('hidden');
        }
    }

    // Mission Checklist Tasks
    const taskListEl = document.getElementById('task-list');
    if (taskListEl) {
        taskListEl.innerHTML = '';
        let allDone = true;
        ch.tasks.forEach(t => {
            if (!t.done) allDone = false;
            const item = document.createElement('div');
            item.className = `flex items-start gap-2 p-1.5 rounded-lg border ${t.done ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-slate-900/70 border-slate-800 text-slate-200'}`;
            item.innerHTML = `
                <i class="fa-solid ${t.done ? 'fa-circle-check text-emerald-400' : 'fa-circle-dot text-amber-400'} mt-0.5 text-[11px]"></i>
                <span class="${t.done ? 'line-through opacity-75' : ''} leading-snug">${t.text}</span>
            `;
            taskListEl.appendChild(item);
        });

        const advContainer = document.getElementById('advance-container');
        if (advContainer) {
            if (allDone) advContainer.classList.remove('hidden');
            else advContainer.classList.add('hidden');
        }

        // Active Objective Pill (1-line focus for younger students)
        const activeTask = ch.tasks.find(t => !t.done);
        const objTextEl = document.getElementById('active-objective-text');
        if (objTextEl) {
            objTextEl.textContent = activeTask ? activeTask.text : 'All Chapter Tasks Complete! Advance Sol when ready.';
        }

        const taskProgEl = document.getElementById('checklist-progress-text');
        if (taskProgEl) {
            const doneCount = ch.tasks.filter(t => t.done).length;
            taskProgEl.textContent = `Tasks: ${doneCount}/${ch.tasks.length}`;
        }
    }

    // Inventory Pouch
    const invEl = document.getElementById('inventory-list');
    if (invEl) {
        invEl.innerHTML = '';
        if (state.inventory.length === 0) {
            invEl.innerHTML = `<span class="text-[10px] font-mono-tech text-slate-500 px-2">Empty (Visit Storage)</span>`;
        } else {
            state.inventory.forEach(item => {
                const pill = document.createElement('span');
                pill.className = 'text-[10px] font-mono-tech bg-sky-500/20 border border-sky-400/40 text-sky-200 px-2 py-0.5 rounded-md flex items-center gap-1';
                pill.innerHTML = `<i class="fa-solid fa-wrench text-[9px] text-amber-400"></i>${item}`;
                invEl.appendChild(pill);
            });
        }
    }
}

// --- SETUP EVENT LISTENERS (Modals, Buttons, Jargon, Weather, Comms) ---
function initUIEventListeners() {
    // --- HUD Mode Toggle (Cadet Mode vs Engineer Mode) ---
    let isEngineerMode = false;
    const btnHudMode = document.getElementById('btn-hud-mode');
    const labelHudMode = document.getElementById('label-hud-mode');
    const cadetMeters = document.getElementById('hud-cadet-meters');
    const engMeters = document.getElementById('hud-engineer-meters');

    if (btnHudMode) {
        btnHudMode.addEventListener('click', () => {
            if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
            isEngineerMode = !isEngineerMode;
            if (isEngineerMode) {
                if (labelHudMode) labelHudMode.textContent = 'Engineer Mode';
                if (cadetMeters) cadetMeters.classList.add('hidden');
                if (engMeters) engMeters.classList.remove('hidden');
                btnHudMode.classList.add('border-amber-400', 'text-amber-300');
                setAria('ENGINEER MODE: Detailed kW, kPa, ppm, and mSv/h telemetry exposed for mission diagnostics.');
            } else {
                if (labelHudMode) labelHudMode.textContent = 'Cadet Mode';
                if (cadetMeters) cadetMeters.classList.remove('hidden');
                if (engMeters) engMeters.classList.add('hidden');
                btnHudMode.classList.remove('border-amber-400', 'text-amber-300');
                setAria('CADET MODE: Streamlined 3-pillar safety gauges active. Click any gauge for plain-language decoder.');
            }
        });
    }

    // --- Collapsible Left Checklist Panel ---
    const btnToggleChecklist = document.getElementById('btn-toggle-checklist');
    const panelChecklist = document.getElementById('panel-checklist');
    const pillChecklist = document.getElementById('pill-checklist-collapsed');
    const activeObjPill = document.getElementById('active-objective-pill');

    const toggleChecklist = (show) => {
        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
        const shouldShow = typeof show === 'boolean' ? show : (panelChecklist && panelChecklist.classList.contains('hidden'));
        if (panelChecklist) {
            if (shouldShow) {
                panelChecklist.classList.remove('hidden');
                if (pillChecklist) pillChecklist.classList.add('hidden');
            } else {
                panelChecklist.classList.add('hidden');
                if (pillChecklist) pillChecklist.classList.remove('hidden');
            }
        }
    };

    if (btnToggleChecklist) btnToggleChecklist.addEventListener('click', () => toggleChecklist(false));
    if (pillChecklist) pillChecklist.addEventListener('click', () => toggleChecklist(true));
    if (activeObjPill) activeObjPill.addEventListener('click', () => toggleChecklist(true));

    // --- Collapsible Right Trainer Panel ---
    const btnToggleTrainer = document.getElementById('btn-toggle-trainer');
    const panelTrainer = document.getElementById('panel-trainer');
    const pillTrainer = document.getElementById('pill-trainer-collapsed');

    const toggleTrainer = (show) => {
        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
        const shouldShow = typeof show === 'boolean' ? show : (panelTrainer && panelTrainer.classList.contains('hidden'));
        if (panelTrainer) {
            if (shouldShow) {
                panelTrainer.classList.remove('hidden');
                if (pillTrainer) pillTrainer.classList.add('hidden');
            } else {
                panelTrainer.classList.add('hidden');
                if (pillTrainer) pillTrainer.classList.remove('hidden');
            }
        }
    };

    if (btnToggleTrainer) btnToggleTrainer.addEventListener('click', () => toggleTrainer(false));
    if (pillTrainer) pillTrainer.addEventListener('click', () => toggleTrainer(true));

    // --- 3D WebGL Simulation Engine (Default Active Viewport) ---
    window.currentViewMode = '3d';
    const container3D = document.getElementById('three-container');
    if (container3D) container3D.classList.remove('hidden');

    // --- Mission Settings & Tools Modal ---
    const btnSettings = document.getElementById('btn-settings');
    const modalSettings = document.getElementById('modal-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');

    if (btnSettings && modalSettings) {
        btnSettings.addEventListener('click', () => {
            if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
            modalSettings.classList.remove('hidden');
        });
    }
    if (btnCloseSettings && modalSettings) {
        btnCloseSettings.addEventListener('click', () => {
            if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
            modalSettings.classList.add('hidden');
        });
    }
    if (modalSettings) {
        modalSettings.addEventListener('click', (e) => {
            if (e.target === modalSettings) {
                if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
                modalSettings.classList.add('hidden');
            }
        });
    }

    // Bind Cadet Meters to Jargon Decoder
    if (typeof JARGON_DECODER !== 'undefined') {
        const bindJargonClick = (id, key) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', () => {
                    if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
                    setAria(JARGON_DECODER[key]);
                });
            }
        };
        bindJargonClick('cadet-meter-power', 'power');
        bindJargonClick('cadet-meter-life', 'atmo');
        bindJargonClick('cadet-meter-rad', 'env');
    }

    // Dialogue Modal Controls
    const btnNextDlg = document.getElementById('btn-next-dialogue');
    if (btnNextDlg) btnNextDlg.addEventListener('click', advanceDialogueStep);

    const btnSkipDlg = document.getElementById('btn-skip-dialogue');
    if (btnSkipDlg) btnSkipDlg.addEventListener('click', () => {
        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
        const dlgModal = document.getElementById('modal-dialogue');
        if (dlgModal) dlgModal.classList.add('hidden');
    });

    const btnReplayDlg = document.getElementById('btn-replay-dialogue');
    if (btnReplayDlg) btnReplayDlg.addEventListener('click', () => {
        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
        if (typeof CHAPTER_DIALOGUES !== 'undefined' && CHAPTER_DIALOGUES[state.chapterIdx]) {
            startDialogueSequence(CHAPTER_DIALOGUES[state.chapterIdx], state.chapterIdx);
        }
    });

    // Console Modal Close
    const closeConsoleModal = () => {
        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
        const cm = document.getElementById('modal-console');
        if (cm) cm.classList.add('hidden');
    };
    const btnCloseConsole = document.getElementById('btn-close-console');
    if (btnCloseConsole) btnCloseConsole.addEventListener('click', closeConsoleModal);
    const btnCloseConsoleTop = document.getElementById('btn-close-console-top');
    if (btnCloseConsoleTop) btnCloseConsoleTop.addEventListener('click', closeConsoleModal);
    const modalConsole = document.getElementById('modal-console');
    if (modalConsole) {
        modalConsole.addEventListener('click', (e) => {
            if (e.target === modalConsole) closeConsoleModal();
        });
    }

    // Power Grid Modal Open & Close
    const btnPowerGrid = document.getElementById('btn-power-grid');
    if (btnPowerGrid) {
        btnPowerGrid.addEventListener('click', () => {
            if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
            openPowerModal();
        });
    }

    const closePowerModal = () => {
        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
        const pm = document.getElementById('modal-power');
        if (pm) pm.classList.add('hidden');
    };
    const btnClosePower = document.getElementById('btn-close-power');
    if (btnClosePower) btnClosePower.addEventListener('click', closePowerModal);
    const btnClosePowerTop = document.getElementById('btn-close-power-top');
    if (btnClosePowerTop) btnClosePowerTop.addEventListener('click', closePowerModal);
    const btnBackPower = document.getElementById('btn-back-power');
    if (btnBackPower) btnBackPower.addEventListener('click', closePowerModal);
    const modalPower = document.getElementById('modal-power');
    if (modalPower) {
        modalPower.addEventListener('click', (e) => {
            if (e.target === modalPower) closePowerModal();
        });
    }

    // Codex Modal Open & Close
    const btnCodex = document.getElementById('btn-codex');
    if (btnCodex) {
        btnCodex.addEventListener('click', () => {
            if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
            openCodexModal();
        });
    }
    const closeCodexModal = () => {
        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
        const cxm = document.getElementById('modal-codex');
        if (cxm) cxm.classList.add('hidden');
    };
    const btnCloseCodex = document.getElementById('btn-close-codex');
    if (btnCloseCodex) btnCloseCodex.addEventListener('click', closeCodexModal);
    const btnCloseCodexBottom = document.getElementById('btn-close-codex-bottom');
    if (btnCloseCodexBottom) btnCloseCodexBottom.addEventListener('click', closeCodexModal);
    const modalCodex = document.getElementById('modal-codex');
    if (modalCodex) {
        modalCodex.addEventListener('click', (e) => {
            if (e.target === modalCodex) closeCodexModal();
        });
    }

    // Story Briefing Begin Button
    const btnCloseStoryTop = document.getElementById('btn-close-story-top');
    if (btnCloseStoryTop) {
        btnCloseStoryTop.addEventListener('click', () => {
            if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
            const sm = document.getElementById('modal-story');
            if (sm) sm.classList.add('hidden');
        });
    }

    const btnStartChapter = document.getElementById('btn-start-chapter');
    if (btnStartChapter) {
        btnStartChapter.addEventListener('click', () => {
            if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
            const sm = document.getElementById('modal-story');
            if (sm) sm.classList.add('hidden');
            if (typeof CHAPTER_DIALOGUES !== 'undefined' && CHAPTER_DIALOGUES[state.chapterIdx]) {
                startDialogueSequence(CHAPTER_DIALOGUES[state.chapterIdx], state.chapterIdx);
            }
        });
    }

    // Audio & Ambient Music Toggles
    const btnMusic = document.getElementById('btn-music');
    if (btnMusic) {
        btnMusic.addEventListener('click', () => {
            if (window.sfx) {
                sfx.startAmbientEngine();
                sfx.musicEnabled = !sfx.musicEnabled;
                const icon = document.getElementById('icon-music');
                const label = document.getElementById('label-music');
                if (sfx.musicEnabled) {
                    if (icon) icon.className = 'fa-solid fa-music text-indigo-300';
                    if (label) label.textContent = 'AMBIENT ON';
                    sfx.beep();
                } else {
                    if (icon) icon.className = 'fa-solid fa-volume-off text-slate-400';
                    if (label) label.textContent = 'AMBIENT OFF';
                }
            }
        });
    }

    const btnSound = document.getElementById('btn-sound');
    if (btnSound) {
        btnSound.addEventListener('click', () => {
            if (window.sfx) {
                sfx.startAmbientEngine();
                sfx.enabled = !sfx.enabled;
                const icon = document.getElementById('icon-sound');
                if (icon) icon.className = sfx.enabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark text-red-400';
                if (sfx.enabled) sfx.beep();
            }
        });
    }

    // Jargon Decoder Bindings
    if (typeof JARGON_DECODER !== 'undefined') {
        const hudSolBadge = document.getElementById('badge-hud-sol') || document.getElementById('hud-sol');
        if (hudSolBadge) {
            hudSolBadge.addEventListener('click', () => {
                if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
                setAria(JARGON_DECODER.sol);
            });
        }

        const bindJargon = (id, key) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', () => {
                    if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
                    setAria(JARGON_DECODER[key]);
                });
            }
        };

        bindJargon('metric-power', 'power');
        bindJargon('metric-battery', 'battery');
        bindJargon('metric-atmo', 'atmo');
        bindJargon('metric-water', 'water');
        bindJargon('metric-env', 'env');
    }

    // Weather Mutator
    let weatherModeIdx = 0;
    const btnWeatherMutator = document.getElementById('btn-weather-mutator');
    if (btnWeatherMutator && typeof WEATHER_MODES !== 'undefined') {
        btnWeatherMutator.addEventListener('click', () => {
            if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
            weatherModeIdx = (weatherModeIdx + 1) % WEATHER_MODES.length;
            const mode = WEATHER_MODES[weatherModeIdx];
            state.weatherMutator = mode.id;
            const label = document.getElementById('weather-mutator-label');
            if (label) label.textContent = mode.label;
            setAria(`WEATHER MUTATOR: ${mode.desc}`);
            updateUI();
        });
    }

    // Comms Delay (14m Ping Houston)
    let isPingActive = false;
    const btnPingHouston = document.getElementById('btn-ping-houston');
    if (btnPingHouston) {
        btnPingHouston.addEventListener('click', () => {
            if (isPingActive) return;
            if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
            isPingActive = true;
            const label = document.getElementById('ping-houston-label');

            setAria("TRANSMITTING TO EARTH: Radio signals travel at the speed of light (~300,000 km/s). Delay shifts from 4 to 24 minutes as Earth & Mars orbit the Sun. NASA's 378-day CHAPEA simulation trains with a 22-minute delay; Astra-1 is at a 14-minute mid-orbit delay. Crew responses must be autonomous!");

            let countdown = 4;
            if (label) label.textContent = `Radio Lag: 14m (${countdown}s sim)...`;
            btnPingHouston.classList.add('border-amber-400', 'text-amber-300');

            const timer = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    if (label) label.textContent = `Radio Lag: ${Math.round(countdown * 3.5)}m (${countdown}s sim)...`;
                } else {
                    clearInterval(timer);
                    isPingActive = false;
                    if (label) label.textContent = 'Ping Houston (14m Delay)';
                    btnPingHouston.classList.remove('border-amber-400', 'text-amber-300');
                    if (window.sfx && typeof sfx.chime === 'function') sfx.chime();
                    setAria("HOUSTON REPLIES (14m Radio Delay): 'Astra-1, telemetry acknowledged. In orbit, radio lag ranges from 4 to 24 minutes (NASA CHAPEA tests with a fixed 22m delay!). At 14m mid-orbit delay, you must rely on onboard automated checklists. You are the flight directors of Mars!'");
                }
            }, 1000);
        });
    }

    // Chapter Select & Advance Handlers
    const chapterSelect = document.getElementById('chapter-select');
    if (chapterSelect) {
        if (typeof CHAPTERS !== 'undefined' && CHAPTERS.length > 0) {
            chapterSelect.innerHTML = '';
            CHAPTERS.forEach((ch, idx) => {
                const opt = document.createElement('option');
                opt.value = String(idx);
                opt.textContent = `Ch ${idx + 1}: ${ch.title} (${ch.solRange})`;
                chapterSelect.appendChild(opt);
            });
            chapterSelect.value = String(state.chapterIdx);
        }
        chapterSelect.addEventListener('change', (e) => {
            if (typeof sfx !== 'undefined' && sfx.beep) sfx.beep();
            loadChapter(parseInt(e.target.value, 10), true);
        });
    }

    const btnAdvance = document.getElementById('btn-advance-chapter');
    if (btnAdvance) {
        btnAdvance.addEventListener('click', () => {
            if (window.sfx && typeof sfx.success === 'function') sfx.success();
            if (state.chapterIdx < CHAPTERS.length - 1) {
                loadChapter(state.chapterIdx + 1, true);
            } else {
                showVictoryModal();
            }
        });
    }

    // Floating Prompt click
    const interactPrompt = document.getElementById('interact-prompt');
    if (interactPrompt) {
        interactPrompt.addEventListener('click', () => {
            if (!isAnyModalOpen()) triggerNearestObjectInteraction();
        });
    }

    // Sol 30 Victory Modal & Certificate Controls
    const cadetInput = document.getElementById('cert-cadet-name');
    if (cadetInput) {
        cadetInput.addEventListener('input', (e) => {
            const certDisplayName = document.getElementById('cert-display-name');
            if (certDisplayName) {
                certDisplayName.textContent = (e.target.value.trim() || 'Cadet Nova').toUpperCase();
            }
        });
    }

    const btnPrintCert = document.getElementById('btn-print-certificate');
    if (btnPrintCert) {
        btnPrintCert.addEventListener('click', () => {
            if (window.sfx && typeof sfx.chime === 'function') sfx.chime();
            window.print();
        });
    }

    const btnReplayMutator = document.getElementById('btn-replay-mutator');
    if (btnReplayMutator) {
        btnReplayMutator.addEventListener('click', () => {
            if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
            closeAllModals();
            if (typeof WEATHER_MODES !== 'undefined' && WEATHER_MODES.length > 0) {
                weatherModeIdx = (weatherModeIdx + 1) % WEATHER_MODES.length;
                const mode = WEATHER_MODES[weatherModeIdx];
                state.weatherMutator = mode.id;
                const label = document.getElementById('weather-mutator-label');
                if (label) label.textContent = mode.label;
                setAria(`REPLAY COMMENCING: Weather Mutator active — ${mode.desc}`);
            }
            loadChapter(0, true);
        });
    }

    const closeVictoryModal = () => {
        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
        const vm = document.getElementById('modal-victory');
        if (vm) vm.classList.add('hidden');
    };
    const btnCloseVictory = document.getElementById('btn-close-victory');
    if (btnCloseVictory) btnCloseVictory.addEventListener('click', closeVictoryModal);

    const modalVictory = document.getElementById('modal-victory');
    if (modalVictory) {
        modalVictory.addEventListener('click', (e) => {
            if (e.target === modalVictory) closeVictoryModal();
        });
    }
}

// Automatically bind UI events if DOM is ready, or on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUIEventListeners);
} else {
    initUIEventListeners();
}

