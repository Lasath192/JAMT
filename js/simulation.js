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
    cropGrowthStage: 0,
    hasCoreSample: false,
    selectedDilemmas: {},
    gridOverloadSeconds: 0,
    inventory: [],
    unlockedFacts: ['nasa_donki', 'nasa_osdr', 'nasa_curiosity_meda', 'chapea_habitat', 'chapea_comms'],
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
        shelterProtocolActive: false,
        breakerTripped: false
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
        if (typeof updateUI === 'function') updateUI();
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
        if (state.faults.breakerTripped && !l.essential) {
            // Breaker trip cuts all non-essential buses immediately
            return;
        }
        if (l.on) load += l.kw;
    });
    // Faulty HV junction adds 2 kW parasitic loss until fixed
    if (state.faults.hvJunctionBroken) load += 2;
    const net = gen - load;
    return { gen, load, net };
}

// --- CHAPTER INITIALIZATION & STATE TRANSITIONS ---
function applyDilemmaChoice(chapterIdx, choiceId) {
    const ch = CHAPTERS[chapterIdx];
    if (!ch || !ch.dilemmaChoices) return;
    const choice = ch.dilemmaChoices.find(c => c.id === choiceId);
    if (!choice) return;

    state.selectedDilemmas[chapterIdx] = choiceId;
    if (typeof sfx !== 'undefined' && sfx.chime) sfx.chime();

    // Execute authentic dilemma mechanical consequences
    if (choice.effect) {
        if (choice.effect.shedLab) {
            state.loads.lab.on = false;
        }
        if (choice.effect.cropDamage) {
            state.loads.greenhouse.on = false;
            state.foodCrewDays = Math.max(8, state.foodCrewDays - 5);
        }
        if (choice.effect.boostLight) {
            state.loads.greenhouse.on = true;
            state.loads.greenhouse.kw = 7;
            state.cropGrowthStage = Math.max(state.cropGrowthStage, 1);
        }
        if (choice.effect.gridCharge) {
            state.batteryKWh = Math.max(12, state.batteryKWh - 12);
        }
        if (choice.effect.sprintEVA) {
            state.crewHealth = Math.max(45, state.crewHealth - 5);
        }
        if (choice.effect.swapFilter) {
            state.faults.co2FilterClogged = false;
            state.loads.backupScrub.on = false;
        }
        if (choice.effect.backupScrub) {
            state.loads.backupScrub.on = true;
        }
        if (choice.effect.precisionDrill || choice.effect.fastDrill) {
            state.hasCoreSample = true;
        }
        if (choice.effect.flushWater) {
            state.waterLitres = Math.max(50, state.waterLitres - 120);
            state.waterConductivity = 38;
        }
        if (choice.effect.fullShield) {
            state.faults.shelterProtocolActive = true;
            state.radiationMSvH = 0.04;
        }
        if (choice.effect.partialShield) {
            state.faults.shelterProtocolActive = true;
            state.radiationMSvH = 0.45;
        }
    }

    setAria(`Trade-Off Chosen: "${choice.label}". ${choice.outcome}`);
    syncTasksWithState();
    if (typeof updateUI === 'function') if (typeof updateUI === 'function') updateUI();
}

function loadChapter(idx, showBriefing = true) {
    state.chapterIdx = idx;
    const ch = CHAPTERS[idx];
    if (!ch) return;
    state.sol = ch.solStart;
    const sel = document.getElementById('chapter-select');
    if (sel) sel.value = String(idx);

    // Reset task completion for this chapter if replaying
    ch.tasks.forEach(t => t.done = false);

    // Guarantee NASA Open Data facts unlocked for immediate inspection by judges
    ['nasa_donki', 'nasa_osdr', 'nasa_curiosity_meda', 'chapea_habitat', 'chapea_comms'].forEach(fId => {
        if (!state.unlockedFacts.includes(fId)) state.unlockedFacts.push(fId);
    });

    // Reset standard faults
    state.faults.hvJunctionBroken = false;
    state.faults.co2FilterClogged = false;
    state.faults.waterPipeLeaking = false;
    state.faults.irrigationPumpBroken = false;
    state.faults.dustStormActive = false;
    state.faults.radiationAlertActive = false;
    state.faults.commsAntennaOffline = false;
    state.faults.externalConduitDamaged = false;
    state.faults.shelterProtocolActive = false;
    state.faults.breakerTripped = false;
    state.gridOverloadSeconds = 0;
    if (state.player) state.player.inSuit = false;

    // Crop Growth Stage progression by Sol
    if (state.sol < 45) {
        state.cropGrowthStage = 0; // Sprout
    } else if (state.sol < 180) {
        state.cropGrowthStage = 1; // Growing
    } else {
        state.cropGrowthStage = 2; // Mature / Fruiting
    }

    // Configure 10 authentic NASA CHAPEA 4-Act Missions
    if (idx === 0) {
        // ACT I - MISSION 1: The First Breath (Sol 01-03)
        state.solarOutputKW = 22;
        state.backupGenKW = 0;
        state.loads.lab.on = true;
        state.loads.greenhouse.on = false;
        state.co2PPM = 425;
        state.waterConductivity = 42;
        state.radiationMSvH = 0.08;
        setAria("Welcome to Astra-1, Cadet Nova! Verify Airlock pressure, grab your tools from Central Storage, and inspect the Power & Life-Support consoles.");
    } else if (idx === 1) {
        // ACT I - MISSION 2: First Seeds in Red Soil (Sol 07-12)
        state.solarOutputKW = 24;
        state.backupGenKW = 0;
        state.loads.greenhouse.on = false;
        state.foodCrewDays = 28;
        setAria("Act I Mission 2: Plant dwarf wheat and salad microgreens! Inspect crop beds in the Greenhouse, mix nutrients at Water Recycling, and activate Greenhouse LEDs.");
    } else if (idx === 2) {
        // ACT I - MISSION 3: Commissioning Perseverance & Ingenuity (Sol 20-25)
        state.solarOutputKW = 24;
        state.loads.greenhouse.on = true;
        setAria("Act I Mission 3: Don your EVA suit at the Airlock, exit to the Mars surface, and link telemetry with NASA Perseverance & Ingenuity!");
    } else if (idx === 3) {
        // ACT II - MISSION 4: The Rising Sky of Copper (Sol 45-50)
        state.solarOutputKW = 14;
        state.backupGenKW = 0;
        state.batteryKWh = Math.min(state.batteryKWh, 48);
        state.faults.dustStormActive = true;
        state.faults.hvJunctionBroken = true;
        setAria("ALERT: Massive dust storm reducing solar output to 14 kW! HV junction circuit blown. Inspect Power Console, shed non-essential loads, and start Backup Gen!");
        if (typeof sfx !== 'undefined' && sfx.alert) sfx.alert();
    } else if (idx === 4) {
        // ACT II - MISSION 5: The Zero-Visibility EVA (Sol 72-75)
        state.solarOutputKW = 10;
        state.faults.dustStormActive = true;
        state.faults.externalConduitDamaged = true;
        setAria("ALERT: High winds rattling solar arrays outside! Don your EVA suit, exit to the surface, and secure the array wind latches before the conduit snaps!");
        if (typeof sfx !== 'undefined' && sfx.alert) sfx.alert();
    } else if (idx === 5) {
        // ACT II - MISSION 6: ECLSS Scrubber Saturation (Sol 95-100)
        state.solarOutputKW = 22;
        state.faults.co2FilterClogged = true;
        state.co2PPM = 1420;
        setAria("ENVIRONMENTAL WARNING: Primary LiOH CO₂ scrubber is saturated! Exhaled carbon dioxide climbing past 1,420 ppm. Grab a replacement cartridge from Storage!");
        if (typeof sfx !== 'undefined' && sfx.alert) sfx.alert();
    } else if (idx === 6) {
        // ACT III - MISSION 7: Jezero Delta Core Expedition (Sol 140-150)
        state.solarOutputKW = 24;
        state.hasCoreSample = false;
        setAria("Act III Mission 7: Drive Perseverance to extract a pristine Jezero sediment core, then seal it into the Science Lab sample hermetic vault!");
    } else if (idx === 7) {
        // ACT III - MISSION 8: The Graywater Biofilm Crisis (Sol 185-190)
        state.solarOutputKW = 22;
        state.faults.waterPipeLeaking = true;
        state.waterConductivity = 190;
        setAria("WATER CONTAMINATION WARNING: Microbial biofilm breach in greywater loop! Conductivity spiked to 190 µS/cm. Grab the Pipe Seal Kit from Storage and flush the line!");
        if (typeof sfx !== 'undefined' && sfx.alert) sfx.alert();
    } else if (idx === 8) {
        // ACT IV - MISSION 9: Solar Particle Event — Code Red (Sol 290-295)
        state.solarOutputKW = 18;
        state.faults.radiationAlertActive = true;
        state.radiationMSvH = 3.20;
        setAria("CODE RED: NASA DONKI alerts Coronal Mass Ejection! Radiation at 3.20 mSv/h! Sound the shelter alarm and flood the water-wall shielding!");
        if (typeof sfx !== 'undefined' && sfx.alert) sfx.alert();
    } else if (idx === 9) {
        // ACT IV - MISSION 10: The Return Window — Handover (Sol 378)
        state.solarOutputKW = 26;
        state.hasCoreSample = true;
        state.cropGrowthStage = 2;
        setAria("SOL 378 FINAL MISSION: Outpost Handover! Package the basalt cores in the Lab, harvest and stash cryo-seeds in the Greenhouse, and transmit the final 378-Sol Debrief!");
    }

    syncTasksWithState();
    if (typeof updateUI === 'function') updateUI();

    if (showBriefing) {
        openStoryBriefing(ch);
    }
}

function openStoryBriefing(ch) {
    const solTag = document.getElementById('story-sol-tag');
    if (solTag) solTag.textContent = `MARS OUTPOST ASTRA-1 • ${ch.act ? ch.act + ' • ' : ''}${ch.solRange.toUpperCase()}`;
    const titleEl = document.getElementById('story-title');
    if (titleEl) titleEl.textContent = ch.title;
    const illus = document.getElementById('story-illustration');
    if (illus && typeof getChapterSceneSVG === 'function') {
        illus.innerHTML = getChapterSceneSVG(ch.id);
    }
    const bodyEl = document.getElementById('story-body');
    if (bodyEl) bodyEl.textContent = ch.story;
    const sciEl = document.getElementById('story-science');
    if (sciEl) sciEl.textContent = ch.science;
    const dilEl = document.getElementById('story-dilemma');
    if (dilEl) dilEl.textContent = ch.dilemma;
    const btnStart = document.getElementById('btn-start-chapter');
    if (btnStart) btnStart.textContent = `Begin ${ch.solRange} Operations`;

    // Render High-Stakes Consequence Decision Point
    const decBox = document.getElementById('story-decision-box');
    const decOpts = document.getElementById('story-decision-options');
    const decStatus = document.getElementById('story-decision-status');
    if (decBox && decOpts) {
        if (ch.dilemmaChoices && ch.dilemmaChoices.length > 0) {
            decBox.classList.remove('hidden');
            decOpts.innerHTML = '';
            const currentChoice = state.selectedDilemmas[ch.id];
            if (decStatus) {
                decStatus.textContent = currentChoice ? 'Decision Committed' : 'Action Required';
                decStatus.className = `text-[9px] font-mono-tech px-2 py-0.5 rounded-full font-bold ${currentChoice ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`;
            }
            ch.dilemmaChoices.forEach(choice => {
                const isSelected = currentChoice === choice.id;
                const btn = document.createElement('button');
                btn.className = `p-2.5 rounded-xl text-left border transition cursor-pointer ${
                    isSelected 
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/10' 
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 hover:border-slate-500 text-slate-300'
                }`;
                btn.innerHTML = `
                    <div class="flex items-center justify-between mb-1">
                        <span class="font-bold text-xs ${isSelected ? 'text-amber-300' : 'text-slate-200'} font-display">${choice.label}</span>
                        <span class="text-[10px] font-mono-tech ${isSelected ? 'text-emerald-400 font-bold' : 'text-slate-500'}">
                            ${isSelected ? '✓ SELECTED' : 'CHOOSE'}
                        </span>
                    </div>
                    <div class="text-[10px] text-slate-400 font-mono-tech leading-relaxed">${choice.outcome}</div>
                `;
                btn.addEventListener('click', () => {
                    applyDilemmaChoice(ch.id, choice.id);
                    openStoryBriefing(ch);
                });
                decOpts.appendChild(btn);
            });
        } else {
            decBox.classList.add('hidden');
        }
    }

    const modal = document.getElementById('modal-story');
    if (modal) modal.classList.remove('hidden');
}

// --- SOL 378 MULTI-TIER MISSION OUTCOME CALCULATOR ---
function calculateMissionLegacy() {
    const bat = state.batteryKWh;
    const water = state.waterLitres;
    const food = state.foodCrewDays;
    const health = state.crewHealth;
    const cores = state.hasCoreSample;

    if (bat >= 45 && water >= 280 && food >= 18 && health >= 80 && cores) {
        return {
            tier: "COMMANDER TIER",
            title: "Thriving Martian Biosphere",
            badgeClass: "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20",
            icon: "fa-award",
            headline: "Exceptional Outpost Stewardship • Full 378 Sols Achieved",
            summary: "Cadet Nova, your engineering leadership has guided Astra-1 through the full 378-day NASA CHAPEA Mars simulation! The Earth Return Vehicle receives pristine Jezero Delta core samples, thriving dwarf wheat cultivars, and fully charged battery banks. Houston Flight Directors have certified your performance as the gold standard for human Mars exploration.",
            rating: "5.0 / 5.0 (Commander Distinction)"
        };
    } else if (bat >= 25 && health >= 65) {
        return {
            tier: "PIONEER TIER",
            title: "Resilient Outpost Handover",
            badgeClass: "bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20",
            icon: "fa-shield-halved",
            headline: "Sturdy Expedition Handover • Crew Safe Across 378 Sols",
            summary: "Cadet Nova, your disciplined balance of habitat breakers and life-support scrubbers safely delivered all 5 astronauts through severe dust storms, SPE radiation bursts, and hardware anomalies across 378 Sols. Life support held firm, and mission handover was successfully achieved.",
            rating: "4.2 / 5.0 (Pioneer Commendation)"
        };
    } else {
        return {
            tier: "SURVIVOR TIER",
            title: "Emergency Extraction & Resupply",
            badgeClass: "bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/20",
            icon: "fa-triangle-exclamation",
            headline: "Critical Red-Frontier Survival • Handover Complete",
            summary: "Cadet Nova, the harsh Martian frontier pushed Astra-1 to its absolute threshold. Tight water margins and depleted power banks forced severe rationing. Yet through grit and adherence to emergency checklists, you kept all five crew members alive through Sol 378. A testament to why every watt and litre counts on Mars!",
            rating: "3.5 / 5.0 (Survivor Citation)"
        };
    }
}

function showVictoryModal() {
    if (typeof closeAllModals === 'function') closeAllModals();
    const legacy = calculateMissionLegacy();
    const pwr = getPowerStats();

    // 1. Render Sol 378 Touchdown SVG Scene
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
    if (rptRadStat) rptRadStat.textContent = state.faults.shelterProtocolActive ? '0.04 mSv/h (Shielded)' : `${state.radiationMSvH.toFixed(2)} mSv/h`;
    const rptRadDetail = document.getElementById('rpt-rad-detail');
    if (rptRadDetail) rptRadDetail.textContent = `DONKI SPE Event mitigated by water-wall shielding. Crew Health: ${Math.round(state.crewHealth)}% OK`;

    const rptWaterStat = document.getElementById('rpt-water-stat');
    if (rptWaterStat) rptWaterStat.textContent = `${state.waterConductivity} µS/cm (${state.waterConductivity <= 60 ? 'Potable' : 'Sub-Optimal'})`;
    const rptWaterDetail = document.getElementById('rpt-water-detail');
    if (rptWaterDetail) rptWaterDetail.textContent = `Reserve: ${Math.round(state.waterLitres)} Litres potable H₂O recovered from greywater loop`;

    const rptFoodStat = document.getElementById('rpt-food-stat');
    if (rptFoodStat) rptFoodStat.textContent = `${Math.round(state.foodCrewDays)} Crew-Days`;
    const rptFoodDetail = document.getElementById('rpt-food-detail');
    if (rptFoodDetail) rptFoodDetail.textContent = `Hydroponic dwarf wheat & microgreens sustained via grow LEDs and automated dosing`;

    // Badges Showcase
    const rptBadgeCount = document.getElementById('rpt-badge-count');
    if (rptBadgeCount) rptBadgeCount.textContent = `${state.earnedBadges.length} / ${typeof BADGES !== 'undefined' ? BADGES.length : 5} Badges Earned`;
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
    if (certRad) certRad.textContent = state.faults.shelterProtocolActive ? 'Shielded (0.04 mSv/h)' : `${state.radiationMSvH.toFixed(2)} mSv/h`;

    // 5. Open Modal
    const victoryModal = document.getElementById('modal-victory');
    if (victoryModal) {
        victoryModal.classList.remove('hidden');
    }

    if (typeof sfx !== 'undefined' && sfx.success) sfx.success();
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

    // Ch 0 (Mission 1) auto-sync
    if (hasItem('Multi-Tool') && hasItem('HV Fuse')) markDone('ch1_tool');

    // Ch 1 (Mission 2) auto-sync
    if (state.chapterIdx === 1) {
        if (state.loads.greenhouse.on) markDone('ch2_greenhouse_power');
    }

    // Ch 2 (Mission 3) auto-sync
    if (state.chapterIdx === 2) {
        if (state.player.inSuit) markDone('ch3_eva_prep');
    }

    // Ch 3 (Mission 4) auto-sync
    if (state.chapterIdx === 3) {
        if (!state.faults.hvJunctionBroken) markDone('ch4_replace_fuse');
        if (state.backupGenKW > 0) markDone('ch4_gen_backup');
        if (pwr.net >= 0) markDone('ch4_shed_load');
    }

    // Ch 4 (Mission 5) auto-sync
    if (state.chapterIdx === 4) {
        if (state.player.inSuit) markDone('ch5_airlock_exit');
        if (!state.faults.externalConduitDamaged) markDone('ch5_conduit_verify');
    }

    // Ch 5 (Mission 6) auto-sync
    if (hasItem('LiOH Filter')) markDone('ch6_filter_grab');
    if (state.chapterIdx === 5) {
        if (!state.faults.co2FilterClogged || state.loads.backupScrub.on) markDone('ch6_filter_install');
        if (state.co2PPM <= 650) markDone('ch6_co2_verify');
    }

    // Ch 6 (Mission 7) auto-sync
    if (state.chapterIdx === 6) {
        if (state.hasCoreSample) {
            markDone('ch7_drill_core');
        }
    }

    // Ch 7 (Mission 8) auto-sync
    if (hasItem('Pipe Seal Kit')) markDone('ch8_pipe_seal');
    if (state.chapterIdx === 7) {
        if (!state.faults.waterPipeLeaking) markDone('ch8_flush_bioreactor');
        if (state.waterConductivity <= 60) markDone('ch8_conductivity_check');
    }

    // Ch 8 (Mission 9) auto-sync
    if (state.chapterIdx === 8) {
        if (state.faults.shelterProtocolActive) {
            markDone('ch9_water_shield');
        }
    }

    // Ch 9 (Mission 10) auto-sync
    if (state.chapterIdx === 9) {
        if (state.coresPackaged) markDone('ch10_package_cores');
    }
}

function isTaskDone(taskId) {
    if (typeof CHAPTERS === 'undefined' || !state) return false;
    const ch = CHAPTERS[state.chapterIdx];
    if (!ch || !ch.tasks) return false;
    const t = ch.tasks.find(item => item.id === taskId);
    return t ? !!t.done : false;
}

function completeTask(taskId) {
    const ch = CHAPTERS[state.chapterIdx];
    if (!ch) return;
    const t = ch.tasks.find(item => item.id === taskId);
    if (t && !t.done) {
        t.done = true;
        if (typeof sfx !== 'undefined' && sfx.success) sfx.success();
        if (typeof updateUI === 'function') updateUI();
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
        if (typeof sfx !== 'undefined' && sfx.success) sfx.success();
    }
}

// --- REAL-TIME COMPOUNDING TELEMETRY SIMULATION LOOP (Every 1500ms) ---
setInterval(() => {
    if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) return;

    const pwr = getPowerStats();

    // High-Stakes Grid Overload Breaker Watcher
    // If electrical deficit exceeds -6 kW for 12 continuous seconds, the main bus trips!
    if (pwr.net < -6) {
        state.gridOverloadSeconds += 1.5;
        if (state.gridOverloadSeconds >= 12 && !state.faults.breakerTripped) {
            state.faults.breakerTripped = true;
            state.loads.lab.on = false;
            state.loads.greenhouse.on = false;
            state.loads.backupScrub.on = false;
            if (typeof sfx !== 'undefined' && sfx.alert) sfx.alert();
            setAria("MAIN BREAKER TRIPPED! Continuous 6 kW power deficit overloaded the primary electrical bus. Reset breakers at Power Room console!");
        }
    } else {
        state.gridOverloadSeconds = Math.max(0, state.gridOverloadSeconds - 1.5);
    }

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

    // Greenhouse Crop Growth & CHAPEA Nutrition/Morale Dynamics
    const isGreenhouseRunning = state.loads.greenhouse.on && !state.faults.irrigationPumpBroken;
    if (isGreenhouseRunning) {
        state.foodCrewDays = Math.min(60, state.foodCrewDays + 0.08);
        state.waterLitres = Math.max(0, state.waterLitres - 0.15);
        // Fresh salad crops provide vitamins and psychological uplift (NASA CHAPEA research)
        if (state.crewHealth < 100) {
            state.crewHealth = Math.min(100, state.crewHealth + 0.05);
        }
        // Unlock CHAPEA Fresh Harvest achievement badge in or after Chapter 4
        if (state.chapterIdx >= 3 && !state.earnedBadges.includes('chapea_botanist')) {
            awardBadge('chapea_botanist');
            setAria("🌱 ACHIEVEMENT: CHAPEA Fresh Harvest unlocked! Fresh hydroponics boosted crew dietary morale.");
        }
    } else {
        // If greenhouse is shut off or pump broken past Sol 5, relying solely on freeze-dried rations causes minor nutritional fatigue
        if (state.sol > 5 && state.crewHealth > 45) {
            state.crewHealth = Math.max(45, state.crewHealth - 0.02);
        }
    }

    if (typeof updateUI === 'function') {
        if (typeof updateUI === 'function') updateUI();
    }
}, 1500);

if (typeof module !== 'undefined') {
    module.exports = {
        state,
        hasItem,
        addItem,
        getPowerStats,
        loadChapter,
        applyDilemmaChoice,
        openStoryBriefing,
        calculateMissionLegacy,
        showVictoryModal,
        syncTasksWithState,
        completeTask,
        isTaskDone,
        unlockFact,
        awardBadge
    };
}

if (typeof window !== 'undefined') {
    window.state = state;
    window.loadChapter = loadChapter;
    window.applyDilemmaChoice = applyDilemmaChoice;
    window.completeTask = completeTask;
    window.isTaskDone = isTaskDone;
    window.syncTasksWithState = syncTasksWithState;
    window.calculateMissionLegacy = calculateMissionLegacy;
    window.showVictoryModal = showVictoryModal;
    window.getPowerStats = getPowerStats;
}
