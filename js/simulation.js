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

// --- SOL 30 MULTI-TIER MISSION OUTCOME CALCULATOR ---
function calculateMissionLegacy() {
    const bat = state.batteryKWh;
    const water = state.waterLitres;
    const food = state.foodCrewDays;
    const health = state.crewHealth;

    if (bat >= 50 && water >= 350 && food >= 24) {
        return {
            tier: "COMMANDER TIER",
            title: "Thriving Martian Biosphere",
            badgeClass: "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20",
            icon: "fa-award",
            headline: "Exceptional Outpost Stewardship • 100% Objectives Achieved",
            summary: "Cadet Nova, your engineering leadership has preserved Astra-1 in peak operational condition! The arriving Astra-2 relief crew steps into a vibrant, self-sustaining biosphere with brimming water cisterns, abundant dwarf wheat harvests, and fully charged battery banks. Houston Flight Directors have cited Astra-1 as the gold standard for future crewed Mars expeditions.",
            rating: "5.0 / 5.0 (Commander Distinction)"
        };
    } else if (bat >= 25 && health >= 75) {
        return {
            tier: "PIONEER TIER",
            title: "Resilient Outpost Handover",
            badgeClass: "bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20",
            icon: "fa-shield-halved",
            headline: "Sturdy Expedition Handover • Crew Safe Across 30 Sols",
            summary: "Cadet Nova, your disciplined balance of habitat breakers and life-support scrubbers safely delivered all 5 astronauts through storms, radiation spikes, and hardware failures. While reserves will require rationing during the first week of handover, your proactive maintenance kept life support intact.",
            rating: "4.2 / 5.0 (Pioneer Commendation)"
        };
    } else {
        return {
            tier: "SURVIVOR TIER",
            title: "Emergency Extraction & Resupply",
            badgeClass: "bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/20",
            icon: "fa-triangle-exclamation",
            headline: "Critical Red-Frontier Survival • Handover Complete",
            summary: "Cadet Nova, the harsh Martian frontier pushed Astra-1 to its absolute threshold. Depleted battery reserves and tight water margins forced harsh rationing. Yet through grit and adherence to emergency checklists, you kept all five crew members alive until the Astra-2 lander touched down. A testament to why every watt and litre counts on Mars!",
            rating: "3.5 / 5.0 (Survivor Citation)"
        };
    }
}

function showVictoryModal() {
    if (typeof closeAllModals === 'function') closeAllModals();
    const legacy = calculateMissionLegacy();
    const pwr = getPowerStats();

    // 1. Render Sol 30 Touchdown SVG Scene
    const victoryIllustration = document.getElementById('victory-illustration');
    const svgScene = (typeof getSol30TouchdownSVG === 'function') ? getSol30TouchdownSVG() : '';
    if (victoryIllustration) {
        victoryIllustration.innerHTML = svgScene;
    }
    const storyIllustration = document.getElementById('story-illustration');
    if (storyIllustration) {
        storyIllustration.innerHTML = svgScene;
    }

    // 2. Set Tier and Narrative in Victory Modal
    const victoryTitle = document.getElementById('victory-title');
    if (victoryTitle) victoryTitle.textContent = `${legacy.tier}: ${legacy.title.toUpperCase()}`;

    const tierBadge = document.getElementById('victory-tier-badge');
    if (tierBadge) {
        tierBadge.textContent = legacy.tier;
        tierBadge.className = `px-3 py-1 rounded-full text-xs font-black font-display uppercase tracking-wider ${legacy.badgeClass}`;
    }

    const headline = document.getElementById('victory-headline');
    if (headline) headline.textContent = legacy.headline;

    const headlineIcon = document.getElementById('victory-headline-icon');
    if (headlineIcon) headlineIcon.className = `fa-solid ${legacy.icon}`;

    const summary = document.getElementById('victory-summary');
    if (summary) summary.textContent = legacy.summary;

    // 3. Populate 4 Real-World NASA Trade-Off Report Cards
    const rptPwrStat = document.getElementById('rpt-pwr-stat');
    if (rptPwrStat) rptPwrStat.textContent = pwr.net >= 0 ? `+${pwr.net} kW Surplus` : `${pwr.net} kW Deficit`;
    const rptPwrDetail = document.getElementById('rpt-pwr-detail');
    if (rptPwrDetail) rptPwrDetail.textContent = `Battery: ${Math.round(state.batteryKWh)}% (${Math.round(state.batteryKWh)} kWh) | Solar: ${state.solarOutputKW} kW | Backup Fuel: ${state.backupFuelKg.toFixed(1)} kg`;

    const rptRadStat = document.getElementById('rpt-rad-stat');
    if (rptRadStat) rptRadStat.textContent = state.faults.shelterProtocolActive ? '0.05 mSv/h (Shielded)' : `${state.radiationMSvH.toFixed(2)} mSv/h`;
    const rptRadDetail = document.getElementById('rpt-rad-detail');
    if (rptRadDetail) rptRadDetail.textContent = `DONKI SPE Event mitigated by water-wall shielding. Crew Health: ${Math.round(state.crewHealth)}% OK`;

    const rptWaterStat = document.getElementById('rpt-water-stat');
    if (rptWaterStat) rptWaterStat.textContent = `${state.waterConductivity} µS/cm (${state.waterConductivity <= 60 ? 'Potable' : 'Sub-Optimal'})`;
    const rptWaterDetail = document.getElementById('rpt-water-detail');
    if (rptWaterDetail) rptWaterDetail.textContent = `Reserve: ${Math.round(state.waterLitres)} Litres potable H₂O recovered from greywater loop`;

    const rptFoodStat = document.getElementById('rpt-food-stat');
    if (rptFoodStat) rptFoodStat.textContent = `${Math.round(state.foodCrewDays)} Crew-Days`;
    const rptFoodDetail = document.getElementById('rpt-food-detail');
    if (rptFoodDetail) rptFoodDetail.textContent = `Hydroponic dwarf wheat & microgreens sustained via 5 kW grow LEDs and automated dosing`;

    // Badges Showcase
    const rptBadgeCount = document.getElementById('rpt-badge-count');
    if (rptBadgeCount) rptBadgeCount.textContent = `${state.earnedBadges.length} / 4 Badges Earned`;
    const rptBadgesList = document.getElementById('rpt-badges-list');
    if (rptBadgesList && typeof BADGES !== 'undefined') {
        rptBadgesList.innerHTML = '';
        BADGES.forEach(b => {
            const earned = state.earnedBadges.includes(b.id);
            const card = document.createElement('div');
            card.className = `p-2 rounded-lg border text-center ${earned ? 'bg-amber-500/15 border-amber-400/50 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-500'}`;
            card.innerHTML = `
                <div class="w-6 h-6 mx-auto mb-1 rounded-full flex items-center justify-center text-[10px] ${earned ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-600'}">
                    <i class="fa-solid ${b.icon}"></i>
                </div>
                <div class="font-bold text-[10px] font-display truncate">${b.name}</div>
            `;
            rptBadgesList.appendChild(card);
        });
    }

    // 4. Update Printable Certificate Display Elements
    const certDisplayName = document.getElementById('cert-display-name');
    const cadetInput = document.getElementById('cert-cadet-name');
    if (certDisplayName && cadetInput) {
        certDisplayName.textContent = (cadetInput.value || 'Cadet Nova').toUpperCase();
    }
    const certDisplayTier = document.getElementById('cert-display-tier');
    if (certDisplayTier) {
        certDisplayTier.textContent = `★ ${legacy.tier}: ${legacy.title.toUpperCase()} ★`;
    }
    const certPwr = document.getElementById('cert-pwr');
    if (certPwr) certPwr.textContent = `${Math.round(state.batteryKWh)} kWh (${pwr.net >= 0 ? '+' : ''}${pwr.net} kW Net)`;
    const certWater = document.getElementById('cert-water');
    if (certWater) certWater.textContent = `${Math.round(state.waterLitres)} L (${state.waterConductivity} µS/cm)`;
    const certAtmo = document.getElementById('cert-atmo');
    if (certAtmo) certAtmo.textContent = `${Math.round(state.co2PPM)} ppm CO₂ | 101.3 kPa`;
    const certRad = document.getElementById('cert-rad');
    if (certRad) certRad.textContent = state.faults.shelterProtocolActive ? 'Shielded (0.05 mSv/h)' : `${state.radiationMSvH.toFixed(2)} mSv/h`;

    // 5. Open Modal
    const victoryModal = document.getElementById('modal-victory');
    if (victoryModal) {
        victoryModal.classList.remove('hidden');
    } else {
        const storyModal = document.getElementById('modal-story');
        if (storyModal) {
            document.getElementById('story-sol-tag').textContent = `MISSION ACCOMPLISHED • SOL 30 / 30 COMPLETE`;
            document.getElementById('story-title').textContent = `${legacy.tier}: ${legacy.title.toUpperCase()}`;
            document.getElementById('story-body').textContent = legacy.summary;
            document.getElementById('story-science').textContent = `Final Status — Battery: ${Math.round(state.batteryKWh)} kWh | Potable Water: ${Math.round(state.waterLitres)} L (${state.waterConductivity} µS/cm) | Crew Health: ${Math.round(state.crewHealth)}% | Badges Earned: ${state.earnedBadges.length}/4.`;
            document.getElementById('story-dilemma').textContent = legacy.headline;
            const btn = document.getElementById('btn-start-chapter');
            if (btn) btn.textContent = "Continue Free Exploration / Replay";
            storyModal.classList.remove('hidden');
        }
    }

    if (window.sfx && typeof sfx.success === 'function') sfx.success();
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

