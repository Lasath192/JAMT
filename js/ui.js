
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

        addActionBtn(
            'Verify Cabin Pressure & Seal Checklist',
            'Electronic Orion-style telemetry verification',
            () => {
                completeTask('ch1_airlock');
                setAria('Airlock pressure verified at 101.3 kPa! Now head to the Central Spine Storage Locker to pick up your Diagnostic Multi-Tool and HV Fuse.');
                openObjectModal(obj);
            }
        );
        addActionBtn(
            state.player.inSuit ? 'Doff EVA Spacesuit (Return to Shirtsleeve IVA)' : 'Don & Pressurize EVA Spacesuit',
            state.player.inSuit ? 'Stow suit in airlock rack' : 'Required for safe outdoor Mars surface excursions',
            () => {
                state.player.inSuit = !state.player.inSuit;
                if (window.sfx && typeof sfx.pickup === 'function') sfx.pickup();
                updateUI();
                openObjectModal(obj);
            },
            'bg-amber-500 hover:bg-amber-400 text-slate-950'
        );
    } else if (obj.id === 'storage_locker') {
        badge.textContent = 'Supply Cache';
        addMetric('Diagnostic Multi-Tool', hasItem('Multi-Tool') ? 'In Pouch (Verified)' : 'Available', 'text-amber-300');
        addMetric('High-Voltage Fuse', hasItem('HV Fuse') ? 'In Pouch (Verified)' : 'Available', 'text-sky-300');
        addMetric('LiOH CO₂ Filter', hasItem('LiOH Filter') ? 'In Pouch (Verified)' : 'Available', 'text-teal-300');
        addMetric('Pipe Seal & Pump Kit', hasItem('Pipe Seal Kit') ? 'In Pouch (Verified)' : 'Available', 'text-blue-300');
        desc.textContent = 'Maintenance store containing replacement fuses, LiOH scrubber cartridges, and plumbing seal kits for physical habitat repairs.';

        syncTasksWithState();
        updateUI();

        const hasCh1Tools = hasItem('Multi-Tool') && hasItem('HV Fuse');
        addActionBtn(
            hasCh1Tools ? '✓ Multi-Tool & Spare HV Fuse in Pouch (Click to Re-Verify)' : 'Collect Diagnostic Multi-Tool & Spare HV Fuse',
            'Required for Chapter 1 & Chapter 2 electrical repairs',
            () => {
                addItem('Multi-Tool');
                addItem('HV Fuse');
                if (typeof spawnFloatingText === 'function') spawnFloatingText('MULTI-TOOL & HV FUSE ACQUIRED', state.player.x, state.player.y - 20, '#fde047');
                completeTask('ch1_tool');
                setAria('Multi-Tool and HV Fuse verified in your pouch! Next, check the Power Room and Life-Support Room.');
                openObjectModal(obj);
            },
            hasCh1Tools ? 'bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100' : 'bg-amber-500 hover:bg-amber-400 text-slate-950',
            false
        );

        const hasCh3Parts = hasItem('LiOH Filter') && hasItem('Pipe Seal Kit');
        addActionBtn(
            hasCh3Parts ? '✓ LiOH Filter & Pipe Seal Kit in Pouch (Click to Re-Verify)' : 'Collect LiOH CO₂ Filter & Pipe Seal Kit',
            'Required for Chapter 3 & Chapter 4 life-support & water repairs',
            () => {
                addItem('LiOH Filter');
                addItem('Pipe Seal Kit');
                if (typeof spawnFloatingText === 'function') spawnFloatingText('LiOH FILTER & SEAL KIT ACQUIRED', state.player.x, state.player.y - 20, '#2dd4bf');
                completeTask('ch3_part');
                setAria('LiOH Filter and Pipe Seal Kit verified in your pouch! Head to Life Support and Water Recycling.');
                openObjectModal(obj);
            },
            hasCh3Parts ? 'bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100' : 'bg-sky-600 hover:bg-sky-500 text-white',
            false
        );
    } else if (obj.id === 'power_console') {
        const hasFault = state.faults.hvJunctionBroken || pwr.net < 0;
        badge.textContent = hasFault ? 'Under Investigation' : 'Bus Nominal';
        badge.className = `text-[11px] font-mono-tech font-semibold px-2.5 py-0.5 rounded-full ${hasFault ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`;

        addMetric('Solar + Gen Output', `${pwr.gen} kW`, 'text-amber-400');
        addMetric('Current Habitat Load', `${pwr.load} kW`, 'text-white');
        addMetric('Battery State of Charge', `${Math.round(state.batteryKWh)}% (${Math.round(state.batteryKWh)} kWh)`, state.batteryKWh < 40 ? 'text-orange-400' : 'text-sky-300');
        addMetric('Power Balance', pwr.net < 0 ? `${pwr.net} kW Deficit` : `+${pwr.net} kW Surplus`, pwr.net < 0 ? 'text-red-400' : 'text-emerald-400');

        desc.textContent = state.faults.hvJunctionBroken
            ? 'FAULT DETECTED: Blown High-Voltage Junction circuit is causing a 2 kW parasitic loss, and solar degradation has reduced output to 18 kW against a 24 kW load.'
            : 'Electrical bus distributes power from external solar arrays and backup generators to habitat loads. Remember: a battery buys time; it does not create energy.';

        addActionBtn(
            '1. Inspect Power System Telemetry & Fault Log',
            'Recommended first step: verify array output and load demand',
            () => {
                completeTask('ch1_power');
                completeTask('ch2_diag');
                setAria('Telemetry verified! Open the Power Distribution Grid to shed non-essential loads, or install the HV Fuse to fix the junction.');
                openObjectModal(obj);
            }
        );
        addActionBtn(
            '2. Open Power Load Distribution & Shed Non-Essential Loads',
            'Switch off optional Lab/Greenhouse loads or enable Backup Generator',
            () => {
                document.getElementById('modal-console').classList.add('hidden');
                openPowerModal();
            },
            'bg-amber-500 hover:bg-amber-400 text-slate-950'
        );
        if (state.faults.hvJunctionBroken) {
            addActionBtn(
                '3. Replace Blown HV Junction Circuit (Requires HV Fuse)',
                hasItem('HV Fuse') ? 'HV Fuse ready in pouch — eliminates +2 kW fault loss and restores +4 kW array efficiency' : 'Missing HV Fuse! Collect it from Central Spine Storage Locker first.',
                () => {
                    state.faults.hvJunctionBroken = false;
                    state.solarOutputKW = 22;
                    if (typeof spawnFloatingText === 'function') spawnFloatingText('+4 kW EFFICIENCY RESTORED', state.player.x, state.player.y - 20, '#38bdf8');
                    completeTask('ch2_repair');
                    awardBadge('power_saver');
                    setAria('HV Junction repaired! Array efficiency restored to 22 kW and Power Saver badge earned!');
                    updateUI();
                    openObjectModal(obj);
                },
                'bg-emerald-600 hover:bg-emerald-500 text-white',
                !hasItem('HV Fuse')
            );
        }
    } else if (obj.id === 'co2_scrubber') {
        const isHigh = state.co2PPM > 900 || state.faults.co2FilterClogged;
        badge.textContent = isHigh ? 'CO₂ Warning' : 'ECLSS Nominal';
        addMetric('Cabin CO₂ Concentration', `${Math.round(state.co2PPM)} ppm`, isHigh ? 'text-red-400' : 'text-emerald-400');
        addMetric('Oxygen Partial Pressure', `${state.oxygenKPa.toFixed(1)} kPa`, 'text-teal-300');
        addMetric('Primary LiOH Filter', state.faults.co2FilterClogged ? 'SATURATED (FAULT)' : 'CLEAN (ACTIVE)', state.faults.co2FilterClogged ? 'text-red-400' : 'text-emerald-300');
        addMetric('Backup Scrubber Unit', state.loads.backupScrub.on ? 'ONLINE (+3 kW)' : 'STANDBY (0 kW)', 'text-sky-300');

        desc.textContent = state.faults.co2FilterClogged
            ? 'Primary CO₂ scrubber cartridge is saturated! Exhaled carbon dioxide is rising rapidly. Replace the LiOH filter cassette or activate the Backup Scrubber (+3 kW power draw).'
            : 'Environmental Control and Life Support System (ECLSS) maintains breathable oxygen (21.2 kPa) and scrubs metabolically produced CO₂ below 600 ppm.';

        addActionBtn(
            'Verify Atmospheric Sensors & O₂ Processor',
            'Confirm cabin pressure (101.3 kPa) and oxygen partial pressure',
            () => {
                completeTask('ch1_life');
                setAria('Atmospheric sensors verified! O₂ partial pressure is stable at 21.2 kPa.');
                openObjectModal(obj);
            }
        );
        if (state.faults.co2FilterClogged) {
            addActionBtn(
                'Replace Saturated LiOH Filter Cartridge (Recommended)',
                hasItem('LiOH Filter') ? 'Installs fresh LiOH cassette — permanently restores CO₂ scrubbing without extra kW load' : 'Requires LiOH Filter from Maintenance Storage Locker',
                () => {
                    state.faults.co2FilterClogged = false;
                    state.co2PPM = 440;
                    if (typeof spawnFloatingText === 'function') spawnFloatingText('CO₂ SCRUBBER NOMINAL • 420 ppm', state.player.x, state.player.y - 20, '#2dd4bf');
                    completeTask('ch3_co2');
                    awardBadge('air_guardian');
                    setAria('Fresh LiOH CO₂ filter installed! Cabin CO₂ is dropping back to 420 ppm. Air Guardian badge unlocked!');
                    updateUI();
                    openObjectModal(obj);
                },
                'bg-emerald-600 hover:bg-emerald-500 text-white',
                !hasItem('LiOH Filter')
            );
        }
        addActionBtn(
            state.loads.backupScrub.on ? 'Shut Down Backup CO₂ Scrubber (Save 3 kW)' : 'Emergency: Activate Backup CO₂ Scrubber (+3 kW Load)',
            'Trade-off: Scrubs CO₂ immediately using redundant bed, but adds 3 kW electrical demand',
            () => {
                state.loads.backupScrub.on = !state.loads.backupScrub.on;
                if (state.loads.backupScrub.on) {
                    state.co2PPM = Math.min(state.co2PPM, 650);
                    completeTask('ch3_co2');
                }
                updateUI();
                openObjectModal(obj);
            },
            'bg-amber-500 hover:bg-amber-400 text-slate-950'
        );
    } else if (obj.id === 'water_recycler') {
        const badWater = state.faults.waterPipeLeaking || state.waterConductivity > 60;
        badge.textContent = badWater ? 'Leak / High Conductivity' : 'Potable Verified';
        addMetric('Potable Water Reserve', `${Math.round(state.waterLitres)} Litres`, 'text-blue-400');
        addMetric('Water Conductivity', `${state.waterConductivity} µS/cm`, badWater ? 'text-amber-400' : 'text-emerald-400');
        addMetric('Plumbing Manifold', state.faults.waterPipeLeaking ? 'LEAKING (-1.5 L/s)' : 'SEALED (100%)', state.faults.waterPipeLeaking ? 'text-red-400' : 'text-emerald-300');
        addMetric('Quality Threshold', '< 60 µS/cm for Potable', 'text-slate-300');

        desc.textContent = badWater
            ? 'A cracked coupling in the greywater return line is leaking water and raising ionic conductivity to 185 µS/cm. Seal the pipe and run the multifiltration bed before crew consumption!'
            : 'Closed-loop water recovery distills and filters humidity condensate and greywater, verifying potable quality via electrical conductivity (µS/cm).';

        if (state.faults.waterPipeLeaking || state.waterConductivity > 60) {
            addActionBtn(
                'Seal Pipe Coupling & Run Multifiltration Flush',
                hasItem('Pipe Seal Kit') ? 'Stops water leak and purifies batch to 40 µS/cm' : 'Requires Pipe Seal Kit from Maintenance Storage Locker',
                () => {
                    state.faults.waterPipeLeaking = false;
                    state.waterConductivity = 40;
                    state.waterLitres = Math.min(500, state.waterLitres + 35);
                    if (typeof spawnFloatingText === 'function') spawnFloatingText('PIPE SEALED • 40 µS/cm NOMINAL', state.player.x, state.player.y - 20, '#38bdf8');
                    completeTask('ch3_water');
                    awardBadge('water_wizard');
                    setAria('Water leak sealed and filtration verified at 40 µS/cm! Water Wizard badge earned!');
                    updateUI();
                    openObjectModal(obj);
                },
                'bg-emerald-600 hover:bg-emerald-500 text-white',
                !hasItem('Pipe Seal Kit')
            );
        } else {
            addActionBtn(
                'Verify Potable Water Quality Batch (< 60 µS/cm)',
                'Confirm ionic purity and reserve level for crew & greenhouse',
                () => {
                    completeTask('ch3_water');
                    setAria('Water batch verified at 40 µS/cm — safe for crew drinking and hydroponic irrigation!');
                    openObjectModal(obj);
                }
            );
        }
    } else if (obj.id === 'greenhouse_console') {
        badge.textContent = state.faults.irrigationPumpBroken ? 'Irrigation Fault' : (state.loads.greenhouse.on ? 'Crops Thriving' : 'LEDs Powered Off');
        addMetric('Food Reserves', `${Math.round(state.foodCrewDays)} Crew-Days`, 'text-lime-400');
        addMetric('Irrigation Pump', state.faults.irrigationPumpBroken ? 'CAVITATING (FAULT)' : 'FLOWING (2.4 L/min)', state.faults.irrigationPumpBroken ? 'text-red-400' : 'text-emerald-400');
        addMetric('Grow LED Allocation', state.loads.greenhouse.on ? 'ON (5 kW Draw)' : 'OFF (0 kW Draw)', state.loads.greenhouse.on ? 'text-emerald-300' : 'text-amber-400');
        addMetric('Dome Temperature', `${state.temperatureC.toFixed(1)} °C`, 'text-sky-300');

        desc.textContent = 'Hydroponic crop beds grow dwarf wheat, lettuce, and cherry tomatoes to supplement packaged rations. Plants require clean water, balanced nutrients, 21 °C temperature, and 5 kW of PAR spectrum lighting.';

        addActionBtn(
            '1. Inspect Hydroponic Crop Health & Root Moisture',
            'Diagnose wilting leaves and nutrient flow rate',
            () => {
                completeTask('ch4_inspect');
                setAria('Crop inspection complete: the primary irrigation pump impeller is jammed with mineral scale.');
                openObjectModal(obj);
            }
        );
        if (state.faults.irrigationPumpBroken) {
            addActionBtn(
                '2. Repair Irrigation Pump & Calibrate Nutrient Dosing',
                'Restores automated water and nutrient delivery to all 3 crop beds',
                () => {
                    state.faults.irrigationPumpBroken = false;
                    state.foodCrewDays += 9;
                    if (typeof spawnFloatingText === 'function') spawnFloatingText('+9 DAYS FOOD RESERVES RESTORED', state.player.x, state.player.y - 20, '#4ade80');
                    completeTask('ch4_pump');
                    setAria('Irrigation pump repaired and nutrients calibrated! Make sure Greenhouse LEDs are switched ON to complete Chapter 4.');
                    updateUI();
                    openObjectModal(obj);
                },
                'bg-emerald-600 hover:bg-emerald-500 text-white'
            );
        }
        addActionBtn(
            state.loads.greenhouse.on ? '3. Verify Greenhouse LEDs ON (5 kW Active)' : '3. Switch ON Greenhouse LED Array (+5 kW Load)',
            'Allocates 5 kW of electrical power to sustain long-term food production',
            () => {
                state.loads.greenhouse.on = true;
                if (!state.faults.irrigationPumpBroken) {
                    completeTask('ch4_power');
                }
                updateUI();
                openObjectModal(obj);
            },
            'bg-amber-500 hover:bg-amber-400 text-slate-950'
        );
    } else if (obj.id === 'lab_console') {
        badge.textContent = state.faults.commsAntennaOffline ? 'Comms Link Down' : 'Telemetry Ready';
        addMetric('High-Gain Comms Dish', state.faults.commsAntennaOffline ? 'SIGNAL LOST' : 'LOCKED (EARTH)', state.faults.commsAntennaOffline ? 'text-red-400' : 'text-emerald-400');
        addMetric('Net Power Balance', `${pwr.net >= 0 ? '+' : ''}${pwr.net} kW`, pwr.net < 0 ? 'text-red-400' : 'text-emerald-400');
        addMetric('Atmosphere & Water', `${Math.round(state.co2PPM)} ppm | ${state.waterConductivity} µS/cm`, 'text-sky-300');
        addMetric('Mission Readiness', state.chapterIdx === 5 ? 'FINAL VERIFICATION' : `SOL ${state.sol} ACTIVE`, 'text-amber-300');

        desc.textContent = 'The Laboratory & Medical Bay houses deep-space telemetry diagnostics, crew health monitors, and the Mission Control readiness uplink.';

        if (state.faults.commsAntennaOffline) {
            addActionBtn(
                'Reroute External Comms Antenna via Backup S-Band Transceiver',
                'Restores telemetry uplink with Mission Control during the dust storm without risky EVA',
                () => {
                    state.faults.commsAntennaOffline = false;
                    completeTask('ch5_comms');
                    setAria('Comms uplink restored via S-Band backup! Now head to the Crew Quarters Radiation Shelter!');
                    updateUI();
                    openObjectModal(obj);
                },
                'bg-sky-600 hover:bg-sky-500 text-white'
            );
        }

        if (state.chapterIdx === 5) {
            const systemsHealthy = pwr.net >= 0 && !state.faults.waterPipeLeaking && state.co2PPM < 800 && !state.faults.externalConduitDamaged;
            addActionBtn(
                'Verify All Habitat Systems & Transmit Final Readiness Report',
                systemsHealthy
                    ? 'All systems green! Transmit Sol 30 Handover Report to Mission Control'
                    : 'Requires: External Solar Repaired (28 kW), Net Power >= 0 kW, Water Leak Sealed, CO₂ < 800 ppm',
                () => {
                    completeTask('ch6_systems');
                    completeTask('ch6_report');
                    document.getElementById('modal-console').classList.add('hidden');
                    showVictoryModal();
                },
                'bg-emerald-600 hover:bg-emerald-500 text-white',
                !systemsHealthy
            );
        } else {
            addActionBtn(
                'Run Crew Medical & Telemetry Readiness Scan',
                'Restores crew health to 100% and logs daily science data',
                () => {
                    state.crewHealth = 100;
                    setAria('Crew medical scan complete! All five astronauts are in peak health.');
                    updateUI();
                    openObjectModal(obj);
                }
            );
        }
    } else if (obj.id === 'shelter_console') {
        badge.textContent = state.faults.radiationAlertActive ? 'SPE Radiation Alert!' : 'Shelter Standby';
        addMetric('Surface Dose Rate', `${state.radiationMSvH.toFixed(2)} mSv/h`, state.radiationMSvH > 0.5 ? 'text-red-400' : 'text-emerald-400');
        addMetric('Water-Wall Shielding', '420 L Polyethylene + H₂O', 'text-sky-300');
        addMetric('Shelter Protocol', state.faults.shelterProtocolActive ? 'ACTIVE (SHIELDED)' : 'STANDBY', 'text-purple-300');
        addMetric('Crew Health', `${Math.round(state.crewHealth)}%`, 'text-emerald-400');

        desc.textContent = 'Mars lacks a global magnetosphere and thick atmosphere. During Solar Particle Events (SPE), high-energy protons spike radiation dose rates (mSv/h), requiring the crew to shelter inside central quarters surrounded by water storage tanks.';

        addActionBtn(
            'Activate Solar Particle Event (SPE) Radiation Shelter Protocol',
            'Summons all 5 crew members to water-shielded quarters and reduces dose rate to 0.05 mSv/h',
            () => {
                state.faults.radiationAlertActive = false;
                state.faults.shelterProtocolActive = true;
                state.radiationMSvH = 0.05;
                if (typeof spawnFloatingText === 'function') spawnFloatingText('RADIATION SHELTER ACTIVE', state.player.x, state.player.y - 20, '#c084fc');
                completeTask('ch5_shelter');
                awardBadge('storm_survivor');
                setAria('Radiation Shelter protocol active! Water-wall shielding reduced crew exposure to 0.05 mSv/h. Storm Survivor badge earned!');
                updateUI();
                openObjectModal(obj);
            },
            'bg-purple-600 hover:bg-purple-500 text-white'
        );
    } else if (obj.id === 'solar_array_eva') {
        badge.textContent = 'Outdoor EVA Array';
        addMetric('Current Solar Output', `${state.solarOutputKW} kW`, 'text-amber-400');
        addMetric('Atmospheric Opacity', state.faults.dustStormActive ? 'TAU 3.8 (STORM)' : 'TAU 0.5 (CLEAR)', 'text-orange-300');
        addMetric('EVA Suit Protection', state.player.inSuit ? 'PRESSURIZED (SAFE)' : 'UNSUITED HAZARD!', state.player.inSuit ? 'text-emerald-400' : 'text-red-500');
        addMetric('HV Conduit Latch', state.faults.externalConduitDamaged ? 'DISCONNECTED' : 'LOCKED', 'text-sky-300');

        desc.textContent = 'External photovoltaic arrays power Astra-1. Dust accumulation and wind storms require periodic EVA tie-down checks and conduit maintenance.';

        addActionBtn(
            'Secure Solar Array Wind Latch & Clear Regolith Dust',
            'Protects panels during Chapter 5 Red Storm and boosts solar output',
            () => {
                completeTask('ch5_eva');
                if (state.chapterIdx === 4) state.solarOutputKW = 12;
                setAria('Solar array wind latches secured! Return through the Airlock before radiation peaks!');
                updateUI();
                openObjectModal(obj);
            },
            'bg-amber-500 hover:bg-amber-400 text-slate-950'
        );

        if (state.faults.externalConduitDamaged || state.chapterIdx === 5) {
            addActionBtn(
                'Repair Storm-Damaged External HV Solar Conduit',
                'Restores full 28 kW solar array generation for Chapter 6 final readiness',
                () => {
                    state.faults.externalConduitDamaged = false;
                    state.solarOutputKW = 28;
                    if (typeof spawnFloatingText === 'function') spawnFloatingText('EXTERNAL CONDUIT RESTORED • 28 kW', state.player.x, state.player.y - 20, '#38bdf8');
                    completeTask('ch6_solar');
                    if (getPowerStats().net >= 0 && !state.faults.waterPipeLeaking) {
                        completeTask('ch6_systems');
                    }
                    setAria('External HV Solar Conduit restored! Solar generation is up to a full 28 kW!');
                    updateUI();
                    openObjectModal(obj);
                },
                'bg-emerald-600 hover:bg-emerald-500 text-white'
            );
        }
    } else if (obj.id === 'mars_rover') {
        badge.textContent = 'Surface Rover';
        addMetric('Rover Battery Bank', '85 kWh (Charged)', 'text-emerald-400');
        addMetric('Cabin Pressure', '101.3 kPa', 'text-sky-300');
        addMetric('Geological Samples', '14.2 kg Basalt Core', 'text-amber-300');
        addMetric('Emergency Mobile Bus', 'Available', 'text-purple-300');
        desc.textContent = 'Astra-1’s pressurized rover explores Martian craters and can transfer reserve battery power to the habitat during emergencies.';

        addActionBtn(
            'Transfer 15 kWh Emergency Rover Reserve to Habitat Battery',
            'Boosts habitat battery state of charge during low-power emergencies',
            () => {
                state.batteryKWh = Math.min(100, state.batteryKWh + 15);
                if (typeof spawnFloatingText === 'function') spawnFloatingText('+15 kWh EMERGENCY BOOST', state.player.x, state.player.y - 20, '#fbbf24');
                if (window.sfx && typeof sfx.success === 'function') sfx.success();
                setAria('Transferred 15 kWh from the Pressurized Rover into Astra-1’s main battery bank!');
                updateUI();
                openObjectModal(obj);
            },
            'bg-sky-600 hover:bg-sky-500 text-white'
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
    if (hudSol) hudSol.textContent = `SOL ${String(state.sol).padStart(2, '0')} / 30`;

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
    if (badgeCount) badgeCount.textContent = `${state.earnedBadges.length}/4`;

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

            setAria("TRANSMITTING TO EARTH: Radio signals travel at the speed of light (~300,000 km/s). At Mars's current distance, a radio packet takes ~14 minutes one-way (28 min round-trip)! Mars astronauts must rely on onboard checklists during emergencies rather than waiting for Houston.");

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
                    setAria("HOUSTON REPLIES (14m Radio Delay): 'Astra-1, telemetry acknowledged. Due to the 14-minute radio lag, you must rely on your onboard checklists and procedures. You are the flight directors of Mars!'");
                }
            }, 1000);
        });
    }

    // Chapter Select & Advance Handlers
    const chapterSelect = document.getElementById('chapter-select');
    if (chapterSelect) {
        chapterSelect.addEventListener('change', (e) => {
            if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
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

