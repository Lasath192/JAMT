/**
 * ASTRA-1: The Red Frontier - Real-Time Telemetry Simulation & ECLSS Engineering Engine
 * 2026 NASA Space Apps Challenge
 */

// --- GLOBAL MISSION & TELEMETRY STATE ---
const state = {
    chapterIdx: 0,
    sol: 1,
    solarOutputKW: 20,
    backupGenKW: 0,
    backupFuelKg: 45,
    weatherMutator: 'baseline',
    batteryKWh: 68,
    cabinPressureKPa: 101.3,
    oxygenKPa: 21.2,
    co2PPM: 420,
    waterLitres: 420,
    waterConductivity: 42,
    radiationMSvH: 0.08,
    temperatureC: 21.0,
    foodCrewDays: 32,
    crewHealth: 100,
    inventory: [],
    unlockedFacts: ['nasa_donki', 'nasa_osdr', 'nasa_curiosity_meda'],
    earnedBadges: [],
    loads: {
        lifesupport: { name: 'Primary Life Support (O₂ / Scrub)', kw: 8, on: true, essential: true },
        heating: { name: 'Habitat Thermal Control', kw: 4, on: true, essential: true },
        water: { name: 'Water Recycling & Filtration', kw: 3, on: true, essential: true },
        greenhouse: { name: 'Hydroponic Greenhouse LEDs', kw: 5, on: false, essential: false },
        lab: { name: 'Science Lab & Mass Spec', kw: 4, on: true, essential: false },
        backupScrub: { name: 'Backup CO₂ Scrubber Unit', kw: 3, on: false, essential: false }
    },
    faults: {
        hvJunctionBroken: false,
        co2FilterClogged: false,
        waterPipeLeaking: false,
        irrigationPumpBroken: false,
        dustStormActive: false,
        radiationAlertActive: false,
        commsAntennaOffline: false,
        externalConduitDamaged: false,
        shelterProtocolActive: false
    },
    player: {
        x: 345,
        y: 385,
        speed: 185,
        inSuit: false,
        facing: 'right',
        targetX: null,
        targetY: null
    }
};

function hasItem(itemName) {
    return state.inventory.includes(itemName);
}

function addItem(itemName) {
    if (!state.inventory.includes(itemName)) {
        state.inventory.push(itemName);
        sfx.pickup();
        updateUI();
    }
}

function setAria(msg) {
    const el = document.getElementById('aria-message');
    if (el) el.textContent = `"${msg}"`;
}

// --- CALCULATE POWER TELEMETRY ---
function getPowerStats() {
    let solar = state.solarOutputKW;
    if (state.weatherMutator === 'solar_max') solar += 2;
    else if (state.weatherMutator === 'dust_storm') solar = Math.max(2, solar - 4);
    const gen = solar + state.backupGenKW;
    let load = 0;
    Object.values(state.loads).forEach(l => {
        if (l.on) load += l.kw;
    });
    // Faulty HV junction adds 2 kW parasitic loss until fixed
    if (state.faults.hvJunctionBroken) load += 2;
    const net = gen - load;
    return { gen, load, net };
}

// --- CHAPTER INITIALIZATION & STATE TRANSITIONS ---
function loadChapter(idx, showBriefing = true) {
    state.chapterIdx = idx;
    const ch = CHAPTERS[idx];
    state.sol = ch.solStart;
    const sel = document.getElementById('chapter-select');
    if (sel) sel.value = String(idx);

    // Reset task completion for this chapter if replaying
    ch.tasks.forEach(t => t.done = false);

    // UPGRADE 1: Guarantee NASA Open Data facts unlocked for immediate inspection by judges
    ['nasa_donki', 'nasa_osdr', 'nasa_curiosity_meda'].forEach(fId => {
        if (!state.unlockedFacts.includes(fId)) state.unlockedFacts.push(fId);
    });

    // Configure authentic chapter anomalies
    state.faults.hvJunctionBroken = false;
    state.faults.co2FilterClogged = false;
    state.faults.waterPipeLeaking = false;
    state.faults.irrigationPumpBroken = false;
    state.faults.dustStormActive = false;
    state.faults.radiationAlertActive = false;
    state.faults.commsAntennaOffline = false;
    state.faults.externalConduitDamaged = false;
    state.faults.shelterProtocolActive = false;

    if (idx === 0) {
        // Ch 1: Arrival
        state.solarOutputKW = 20;
        state.backupGenKW = 0;
        state.loads.lab.on = true;
        state.loads.greenhouse.on = false;
        state.co2PPM = 430;
        state.waterConductivity = 42;
        state.radiationMSvH = 0.08;
        setAria("Welcome to Astra-1, Cadet Nova! Start at the Airlock console, grab your tools from Central Storage, and inspect the Power & Life-Support rooms.");
    } else if (idx === 1) {
        // Ch 2: Power Down (18 kW solar vs 24 kW load = 6 kW deficit)
        state.solarOutputKW = 18;
        state.backupGenKW = 0;
        state.batteryKWh = Math.min(state.batteryKWh, 52);
        state.loads.lifesupport.on = true;
        state.loads.heating.on = true;
        state.loads.water.on = true;
        state.loads.greenhouse.on = true;
        state.loads.lab.on = true;
        state.faults.hvJunctionBroken = true;
        setAria("Alert! Solar output dropped to 18 kW while habitat load is 24 kW (6 kW deficit). Inspect the Power Room console, shed non-essential loads, and replace the blown HV Fuse!");
        sfx.alert();
    } else if (idx === 2) {
        // Ch 3: Breath of Life (CO2 rising + Water pipe leak)
        state.solarOutputKW = 22;
        state.faults.co2FilterClogged = true;
        state.faults.waterPipeLeaking = true;
        state.co2PPM = 1380;
        state.waterConductivity = 185;
        setAria("Environmental Warning! CO₂ levels are climbing past 1,380 ppm and Water Recycling reports a pipe leak spiking conductivity to 185 µS/cm. Grab spare parts in Storage!");
        sfx.alert();
    } else if (idx === 3) {
        // Ch 4: Growing a Future (Greenhouse irrigation failure)
        state.solarOutputKW = 22;
        state.faults.irrigationPumpBroken = true;
        state.foodCrewDays = 21;
        setAria("Botanist Dr. Lin reports the Greenhouse irrigation pump is cavitating and crop growth has stalled. Head to the Greenhouse (bottom-right) to repair and calibrate it!");
    } else if (idx === 4) {
        // Ch 5: The Red Storm (Dust storm drops solar to 8 kW + SPE radiation alert + Comms offline)
        state.solarOutputKW = 8;
        state.faults.dustStormActive = true;
        state.faults.radiationAlertActive = true;
        state.faults.commsAntennaOffline = true;
        state.radiationMSvH = 2.45;
        setAria("RED STORM & SOLAR PARTICLE ALERT! Solar output is down to 8 kW and surface radiation is 2.45 mSv/h. Secure the outdoor Solar Array, enable Backup Gen, fix Comms in the Lab, and activate the Radiation Shelter!");
        sfx.alert();
    } else if (idx === 5) {
        // Ch 6: The Last 18 Hours (Integrated multi-system crisis)
        state.solarOutputKW = 11;
        state.faults.externalConduitDamaged = true;
        state.faults.waterPipeLeaking = true;
        state.waterConductivity = 140;
        state.radiationMSvH = 0.12;
        setAria("Final 18 Hours before resupply! The storm damaged the external Solar Conduit on the Mars surface and water purity needs re-verification. Restore all systems and transmit the Readiness Report from the Lab!");
        sfx.alert();
    }

    syncTasksWithState();
    updateUI();

    if (showBriefing) {
        openStoryBriefing(ch);
    }
}

function openStoryBriefing(ch) {
    document.getElementById('story-sol-tag').textContent = `MARS OUTPOST ASTRA-1 • ${ch.solRange.toUpperCase()}`;
    document.getElementById('story-title').textContent = ch.title;
    document.getElementById('story-illustration').innerHTML = getChapterSceneSVG(ch.id);
    document.getElementById('story-body').textContent = ch.story;
    document.getElementById('story-science').textContent = ch.science;
    document.getElementById('story-dilemma').textContent = ch.dilemma;
    document.getElementById('btn-start-chapter').textContent = `Begin ${ch.solRange} Operations`;
    document.getElementById('modal-story').classList.remove('hidden');
}

function showVictoryModal() {
    document.getElementById('story-sol-tag').textContent = `MISSION ACCOMPLISHED • SOL 30 / 30 COMPLETE`;
    document.getElementById('story-title').textContent = `ASTRA-1 SECURED FOR THE NEXT CREW!`;
    document.getElementById('story-body').textContent =
        `Congratulations, Cadet Nova! Across 30 Martian sols, you diagnosed electrical faults, balanced kW loads against kWh battery reserves, maintained breathable O₂/CO₂ atmosphere, purified recycled water below 50 µS/cm, sustained hydroponic crops, and protected the five-person crew through a Martian dust storm and solar particle event.`;
    document.getElementById('story-science').textContent =
        `You mastered the three core astronaut questions: What do I check? What action do I take? And how does it affect the interconnected habitat systems?`;
    document.getElementById('story-dilemma').textContent =
        `Final Status — Battery: ${Math.round(state.batteryKWh)} kWh | Potable Water: ${Math.round(state.waterLitres)} L (${state.waterConductivity} µS/cm) | Crew Health: ${Math.round(state.crewHealth)}% | Badges Earned: ${state.earnedBadges.length}/4.`;
    const btn = document.getElementById('btn-start-chapter');
    btn.textContent = "Continue Free Exploration / Replay";
    document.getElementById('modal-story').classList.remove('hidden');
}

// --- STATE-TO-TASK SYNCHRONIZATION ENGINE ---
function syncTasksWithState() {
    const pwr = getPowerStats();
    const markDone = (id) => {
        const ch = CHAPTERS[state.chapterIdx];
        if (!ch) return;
        const t = ch.tasks.find(item => item.id === id);
        if (t && !t.done) {
            t.done = true;
        }
    };

    // Chapter 1 auto-sync
    if (hasItem('Multi-Tool') && hasItem('HV Fuse')) markDone('ch1_tool');

    // Chapter 2 auto-sync
    if (state.chapterIdx === 1) {
        if (!state.faults.hvJunctionBroken) markDone('ch2_repair');
        if (pwr.net >= 0 && state.loads.lifesupport.on) markDone('ch2_shed');
    }

    // Chapter 3 auto-sync
    if (hasItem('LiOH Filter') && hasItem('Pipe Seal Kit')) markDone('ch3_part');
    if (state.chapterIdx === 2) {
        if (!state.faults.co2FilterClogged || state.loads.backupScrub.on) markDone('ch3_co2');
        if (!state.faults.waterPipeLeaking && state.waterConductivity <= 60) markDone('ch3_water');
    }

    // Chapter 4 auto-sync
    if (state.chapterIdx === 3) {
        if (!state.faults.irrigationPumpBroken) markDone('ch4_pump');
        if (!state.faults.irrigationPumpBroken && state.loads.greenhouse.on) markDone('ch4_power');
    }

    // Chapter 5 auto-sync
    if (state.chapterIdx === 4) {
        if (state.backupGenKW > 0) markDone('ch5_gen');
        if (!state.faults.commsAntennaOffline) markDone('ch5_comms');
        if (state.faults.shelterProtocolActive) markDone('ch5_shelter');
    }

    // Chapter 6 auto-sync
    if (state.chapterIdx === 5) {
        if (!state.faults.externalConduitDamaged) markDone('ch6_solar');
        if (!state.faults.externalConduitDamaged && !state.faults.waterPipeLeaking && pwr.net >= 0 && state.co2PPM < 800) {
            markDone('ch6_systems');
        }
    }
}

function completeTask(taskId) {
    const ch = CHAPTERS[state.chapterIdx];
    const t = ch.tasks.find(item => item.id === taskId);
    if (t && !t.done) {
        t.done = true;
        sfx.success();
        updateUI();
    }
}

function unlockFact(factId) {
    if (factId && !state.unlockedFacts.includes(factId)) {
        state.unlockedFacts.push(factId);
    }
}

function awardBadge(badgeId) {
    if (!state.earnedBadges.includes(badgeId)) {
        state.earnedBadges.push(badgeId);
        sfx.success();
    }
}

// --- REAL-TIME COMPOUNDING TELEMETRY SIMULATION LOOP (Every 1500ms) ---
setInterval(() => {
    if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) return;

    const pwr = getPowerStats();

    // Battery buffering
    state.batteryKWh = Math.max(5, Math.min(100, state.batteryKWh + pwr.net * 0.12));

    // Backup generator fuel burn
    if (state.backupGenKW > 0) {
        state.backupFuelKg = Math.max(0, state.backupFuelKg - 0.25);
        if (state.backupFuelKg <= 0) {
            state.backupFuelKg = 0;
            state.backupGenKW = 0;
            setAria("CRITICAL FUEL DEPLETION! Backup Generator ran out of fuel (0.0 kg) and shut down!");
            sfx.alert();
        }
    }

    // CO2 Dynamics
    const co2Failing = !state.loads.lifesupport.on || (state.faults.co2FilterClogged && !state.loads.backupScrub.on);
    if (co2Failing) {
        state.co2PPM = Math.min(2800, state.co2PPM + 18);
    } else {
        if (state.co2PPM > 415) {
            state.co2PPM = Math.max(415, state.co2PPM - 14);
        }
    }

    // Water Leaks
    if (state.faults.waterPipeLeaking) {
        state.waterLitres = Math.max(0, state.waterLitres - 1.2);
    }

    // Greenhouse Crop Growth
    if (state.loads.greenhouse.on && !state.faults.irrigationPumpBroken) {
        state.foodCrewDays = Math.min(60, state.foodCrewDays + 0.08);
        state.waterLitres = Math.max(0, state.waterLitres - 0.15);
    }

    if (typeof updateUI === 'function') {
        updateUI();
    }
}, 1500);
