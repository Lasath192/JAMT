/**
 * ASTRA-1: The Red Frontier - 6-Chapter Mission Campaign, Habitat Map & Dialogues
 * 2026 NASA Space Apps Challenge
 */

// --- 10-MISSION 4-ACT NASA CHAPEA ANALOG CAMPAIGN (Sol 01 to Sol 378) ---
const CHAPTERS = [
    // ACT I: THE RED CRADLE (Sol 01–90)
    {
        id: 0,
        act: "ACT I",
        actTitle: "The Red Cradle",
        solRange: "Sol 01–02",
        solStart: 1,
        role: "Flight Commander",
        title: "MISSION 1: Station Activation",
        story: "Step into the airlock from outside, stabilize pressure to 101.3 kPa, unpack your toolkit, and check cabin oxygen.",
        science: "Humans need 101.3 kPa pressure and 21% O₂—just like sea level on Earth.",
        scienceMore: "Mars outside pressure is under 1 kPa. Modeled on NASA's Orion ECLSS and CHAPEA, verifying pressure (101.3 kPa), oxygen partial pressure, and comms alignment first prevents decompression hazards.",
        dilemma: "Cycle Airlock Slowly or Fast?",
        classicStory: "In 2048, the Astra-1 expedition lands on Mars to occupy a research habitat 3D-printed from local basaltic regolith—the operational successor to NASA's famous CHAPEA Mars Dune Alpha. You are Cadet Nova. The habitat has operated on autonomous low-power hibernation for 6 months. Before the crew can unpack scientific gear, you must verify the life-support envelope and establish communication.",
        classicScience: "Astronauts follow strict commissioning checkouts before declaring a habitat safe. Modeled on Orion ECLSS and CHAPEA, pressure (101.3 kPa), oxygen partial pressure, and comms alignment must be verified first.",
        classicDilemma: "Airlock Startup Purge: Do you run a fast-purge (instant, but expends 120 L of nitrogen reserve) or the multi-stage recirculation pump cycle (takes manual verification, but preserves 100% of buffer)?",
        dilemmaChoices: [
            { id: 'opt_recirc', label: '🛡️ Standard 3-Min Cycle', pros: '+100% N₂ Reserve Saved', tag: 'Safe', tone: 'emerald', outcome: 'Preserved 100% nitrogen buffer. Nominal airlock cycle verified.', effect: { nitrogenSaved: true } },
            { id: 'opt_fast', label: '⚡ Fast 90s Vent', pros: 'Instant Entry', tag: '-3 kPa Buffer', tone: 'amber', outcome: 'Quick entry, but expended 120L nitrogen buffer. Cabin pressure set to 98 kPa.', effect: { pressureLoss: 3 } }
        ],
        tasks: [
            { id: 'ch1_airlock', text: 'Stabilize Airlock Pressure (Airlock)', room: '🚪 Airlock Bay', shortAction: 'Step in & equalize to 101.3 kPa', done: false },
            { id: 'ch1_tool', text: 'Unpack Multi-Tool & Fuse (Storage)', room: '🧰 Storage Bay', shortAction: 'Grab Multi-Tool & HV Fuse', done: false },
            { id: 'ch1_life', text: 'Verify Cabin Oxygen & ECLSS (Life Support)', room: '💨 Life Support', shortAction: 'Check 5 life-support channels', done: false }
        ]
    },
    {
        id: 1,
        act: "ACT I",
        actTitle: "The Red Cradle",
        solRange: "Sol 24–40",
        solStart: 24,
        role: "Botanist",
        title: "MISSION 2: Hydroponic Harvest Prep",
        story: "Scan the wheat trays, set grow lights to 5 kW, and flush the water lines.",
        science: "Plants use red and blue LED light best while making fresh oxygen and food.",
        scienceMore: "Hydroponics uses water enriched with mineral salts instead of soil. NASA's CHAPEA experiments proved that fresh greens prevent micronutrient degradation and reduce crew isolation stress.",
        dilemma: "How bright should we run the Greenhouse LEDs?",
        classicStory: "Packaged rations only last so long. Chief Botanist Dr. Elena Lin needs help setting up the vertical hydroponic racks. The crew's fresh food and psychological well-being depend on getting the first crop cycle planted and balancing the nutrient dosing.",
        classicScience: "Hydroponics uses water enriched with mineral salts instead of soil. NASA's CHAPEA experiments proved that fresh greens prevent micronutrient degradation and reduce crew isolation stress. 5 kW represents electrical power consumption for grow lights; PAR (Photosynthetically Active Radiation) is a distinct biological photon flux metric.",
        classicDilemma: "Nutrient & LED Balance: High-intensity 24/7 LED lighting accelerates lettuce growth by 30% but consumes 5 kW continuously, risking night battery drain. Standard 16/8 photoperiod balances the grid.",
        dilemmaChoices: [
            { id: 'opt_balanced_light', label: '🌱 Standard 16/8 Cycle', pros: '+10 Food, Grid Safe', tag: 'Balanced', tone: 'emerald', outcome: 'Balanced energy grid. Seedlings sprout cleanly with healthy root development.', effect: { foodBonus: 10, powerSafe: true } },
            { id: 'opt_boost_light', label: '⚡ 24/7 Max LEDs', pros: '+16 Food Yield', tag: '-15 kWh Battery', tone: 'amber', outcome: 'Fast sprouts, but draws +5 kW continuously, pulling battery down by 15 kWh.', effect: { foodBonus: 16, batCost: 15 } }
        ],
        tasks: [
            { id: 'ch2_crop_inspect', text: 'Scan Dwarf Wheat Trays (Greenhouse)', room: '🌿 Greenhouse', shortAction: 'Scan trays for yellow leaves', done: false },
            { id: 'ch2_greenhouse_power', text: 'Set Grow Lights to 5 kW (Power Room)', room: '⚡ Power Room', shortAction: 'Slide LED power to 5.0 kW', done: false },
            { id: 'ch2_flush_irrigation', text: 'Flush Irrigation Lines (Water Room)', room: '💧 Water Room', shortAction: 'Open valve & flush 2s', done: false }
        ]
    },
    {
        id: 2,
        act: "ACT I",
        actTitle: "The Red Cradle",
        solRange: "Sol 75–90",
        solStart: 75,
        role: "EVA Specialist",
        title: "MISSION 3: Rover & Drone Checkout",
        story: "Put on your EVA suit, check Perseverance rover, and reboot Ingenuity helicopter.",
        science: "Ingenuity proved flight is possible in Mars' ultra-thin 1% atmosphere.",
        scienceMore: "Perseverance and Ingenuity are historic NASA robotic explorers. Ingenuity's pioneering mission completed 72 flights by January 2024, proving aerodynamic lift works in Mars' thin CO₂ air.",
        dilemma: "How should we recharge the Perseverance Rover?",
        classicStory: "External robotic exploration begins! Staged outside the habitat are the Mars 2020 Perseverance Rover and Ingenuity Helicopter. As part of a historical robotic-systems simulation and future astronaut training exercise, Cadet Nova must suit up, inspect Perseverance's subsystems, and reboot Ingenuity rotor telemetry.",
        classicScience: "Perseverance and Ingenuity are historic NASA robotic explorers. Ingenuity's pioneering flight mission successfully ended in January 2024 after 72 flights, proving aerodynamic flight in Mars' 1% atmosphere.",
        classicDilemma: "Rover Battery Re-charge: Do you recharge Perseverance from the habitat's battery bank (enabling immediate autonomous radar scans) or let its MMRTG nuclear generator trickle-charge slowly over 3 Sols?",
        dilemmaChoices: [
            { id: 'opt_trickle', label: '🔋 Nuclear Trickle Charge', pros: 'Saves Habitat Battery', tag: '3-Sol Wait', tone: 'emerald', outcome: 'Preserved habitat power. Rover radar mapping will begin in 3 Sols.', effect: { pwrSaved: true } },
            { id: 'opt_grid_charge', label: '⚡ Fast Habitat Charge', pros: 'Instant Rover Scans', tag: '-12 kWh Battery', tone: 'sky', outcome: 'Perseverance fully powered! Long-range science scans available immediately.', effect: { batCost: 12, roverUnlocked: true } }
        ],
        tasks: [
            { id: 'ch3_eva_prep', text: 'Suit Up & Check Airlock Seal (Airlock)', room: '🚪 Airlock Bay', shortAction: 'Equip 4 suit parts & test seal', done: false },
            { id: 'ch3_rover_link', text: 'Check Perseverance Rover (Mars Surface)', room: '🪨 Mars Surface', shortAction: 'Verify 4 rover subsystems', done: false },
            { id: 'ch3_heli_inspect', text: 'Reboot Ingenuity Drone (Mars Surface)', room: '🚁 Mars Surface', shortAction: 'Flip 3 switches & hold reboot', done: false }
        ]
    },

    // ACT II: THE GREAT DUST VEIL (Sol 130–265)
    {
        id: 3,
        act: "ACT II",
        actTitle: "The Great Dust Veil",
        solRange: "Sol 130–145",
        solStart: 130,
        role: "Power Engineer",
        title: "MISSION 4: Solar Power Grid Defense",
        story: "Turn off extra power loads, start the backup generator, and wipe dusty solar panels.",
        science: "Fine Martian dust blocks sunlight and cuts solar panel power by over 50%.",
        scienceMore: "Martian dust storms can last months with atmospheric optical depth (tau) exceeding 4.0. Sealed solid-state RTG units convert decay heat into electricity to bridge solar deficits.",
        dilemma: "Which room should we power down during the dust storm?",
        classicStory: "Orbital satellite radar warns of a localized Martian dust storm. Sky darkness surges, slashing solar array output to 8 kW while the habitat draws 24 kW—a dangerous 16 kW deficit! Cadet Nova must shed non-essential loads, switch to the sealed backup RTG/fission power source, and inspect exterior dust wipers.",
        classicScience: "Martian dust storms can last months, with atmospheric optical depth (tau) exceeding 4.0. RTGs are sealed solid-state power systems converting decay heat into electricity; they do not have refuelable tanks.",
        classicDilemma: "Subsystem Load Shedding: Do you shut down the Science Lab (saving 4 kW) and pause sample research, or cut Greenhouse heating (risking crop root freeze)?",
        dilemmaChoices: [
            { id: 'opt_shed_lab', label: '🔬 Pause Science Lab', pros: 'Saves 4 kW Safely', tag: 'Crops Safe', tone: 'emerald', outcome: 'Conserves 4 kW safely. Sample analysis paused, but crops and life support protected.', effect: { shedLab: true } },
            { id: 'opt_shed_crops', label: '🌡️ Cut Greenhouse Heat', pros: 'Saves 5 kW Power', tag: '-25% Crop Health', tone: 'amber', outcome: 'Saves 5 kW, but crop temperature drops to 4°C, causing 25% plant withering.', effect: { cropDamage: true } }
        ],
        tasks: [
            { id: 'ch4_shed_load', text: 'Shed Non-Essential Loads (Power Room)', room: '⚡ Power Room', shortAction: 'Turn off optional breakers', done: false },
            { id: 'ch4_gen_backup', text: 'Start Backup Generator (Power Room)', room: '🔋 Power Room', shortAction: 'Switch to RTG & pull lever 2s', done: false },
            { id: 'ch4_dust_wipers', text: 'Wipe Solar Array Dust (Mars Surface)', room: '☀️ Solar Array', shortAction: 'Brush dust off 4 solar panels', done: false }
        ]
    },
    {
        id: 4,
        act: "ACT II",
        actTitle: "The Great Dust Veil",
        solRange: "Sol 190–205",
        solStart: 190,
        role: "Safety Officer",
        title: "MISSION 5: Storm EVA Repair",
        story: "Lock your suit umbilical, depressurize the airlock, and fix the solar junction fuse.",
        science: "Astronauts only go outside in calm windows using safety tethers and strict airlock checks.",
        scienceMore: "Repairs never happen during zero-visibility gales. Once wind radar confirms a calm maintenance window, guide rails and interlock pressure checks keep astronauts safe.",
        dilemma: "How should you cross the dusty yard to the solar array?",
        classicStory: "High winds damage an exterior solar-array junction. After weather sensors confirm a safe controlled EVA window, Cadet Nova must don the spacesuit, cycle the airlock according to strict interlock protocol, and replace the blown fuse at the cable junction box.",
        classicScience: "Safety is paramount: astronauts never conduct EVAs during zero-visibility gale conditions. Repairs occur only during verified calm windows with guide tethers and strict pressure checks.",
        classicDilemma: "Tether Navigation: Do you stay strictly clipped to the habitat rail (takes longer, drains suit heating) or sprint directly to the array using radar beacons?",
        dilemmaChoices: [
            { id: 'opt_safe_rail', label: '🛡️ Clip to Guide Rail', pros: 'Zero Getting-Lost Risk', tag: '-15% Suit Heat', tone: 'emerald', outcome: 'Safe navigation with zero disorientation risk. Suit heater drained 15% power.', effect: { suitDrain: 15 } },
            { id: 'opt_sprint_eva', label: '🏃 Fast Radar Sprint', pros: 'Quick Array Repair', tag: 'Wind Buffeting', tone: 'amber', outcome: 'Rapid repair! But wind buffeting causes minor suit telemetry glitch.', effect: { fastRepair: true } }
        ],
        tasks: [
            { id: 'ch5_eva_suit', text: 'Connect EVA Suit Umbilical (Airlock)', room: '🚪 Airlock Bay', shortAction: 'Check radar & lock umbilical', done: false },
            { id: 'ch5_cycle_door', text: 'Depressurize Outer Airlock (Airlock)', room: '🚪 Airlock Bay', shortAction: 'Vent chamber to 0.6 kPa', done: false },
            { id: 'ch5_repair_junction', text: 'Fix Solar Fuse & Cables (Mars Surface)', room: '☀️ Solar Array', shortAction: 'Swap fuse & wire +/- cables', done: false }
        ]
    },
    {
        id: 5,
        act: "ACT II",
        actTitle: "The Great Dust Veil",
        solRange: "Sol 250–265",
        solStart: 250,
        role: "ECLSS Specialist",
        title: "MISSION 6: CO₂ Scrubber Swap",
        story: "Grab a fresh LiOH filter, swap out the clogged cartridge, and clear cabin CO₂.",
        science: "Lithium Hydroxide (LiOH) crystals trap exhaled CO₂ so cabin air stays fresh.",
        scienceMore: "Even 1% CO₂ in cabin air causes fatigue and headaches. Swapping chemical LiOH cartridges binds carbon dioxide into solid lithium carbonate without wasting continuous electricity.",
        dilemma: "How should we lower high cabin CO₂ right now?",
        classicStory: "Fine dust infiltrates habitat intake filters, causing a simulated saturation in the primary amine CO₂ removal loop. Carbon dioxide climbs to 1,800 ppm in this training scenario. Nova must retrieve a fresh LiOH canister, install it, and verify that CO₂ drops below the 500 ppm baseline.",
        classicScience: "1,800 ppm and 500 ppm are game scenario values reflecting acute hypercapnia and nominal spacecraft target baselines. LiOH chemically binds CO2 into stable lithium carbonate.",
        classicDilemma: "Backup Scrubber vs LiOH Swap: Engaging the backup CO₂ scrubber draws +3 kW immediately. Disassembling and replacing the LiOH filter takes physical work but consumes zero extra watts.",
        dilemmaChoices: [
            { id: 'opt_swap_filter', label: '🔧 Manual Filter Swap', pros: 'Uses 0 kW Extra Power', tag: 'Best Efficiency', tone: 'emerald', outcome: 'Permanent fix with 0 kW electrical penalty! CO₂ drops back to 420 ppm.', effect: { manualFilter: true } },
            { id: 'opt_backup_scrub', label: '💨 Electric Backup Scrubber', pros: 'Instant CO₂ Drop', tag: '+3 kW Power Drain', tone: 'amber', outcome: 'Instant CO₂ drop, but adds 3 kW load to an already stressed battery bank.', effect: { backupLoad: true } }
        ],
        tasks: [
            { id: 'ch6_filter_grab', text: 'Grab Fresh LiOH Canister (Storage)', room: '🧰 Storage Bay', shortAction: 'Pack LiOH canister in pouch', done: false },
            { id: 'ch6_filter_install', text: 'Swap Clogged Scrubber (Life Support)', room: '💨 Life Support', shortAction: 'Bypass, swap filter & restore', done: false },
            { id: 'ch6_co2_verify', text: 'Drop CO₂ Below 500 ppm (Life Support)', room: '💨 Life Support', shortAction: 'Run booster fan until <500 ppm', done: false }
        ]
    },

    // ACT III: OUTSIDE THE RED LINE (Sol 295–345)
    {
        id: 6,
        act: "ACT III",
        actTitle: "Outside the Red Line",
        solRange: "Sol 295–315",
        solStart: 295,
        role: "Geologist",
        title: "MISSION 7: Jezero Rock Core Survey",
        story: "Collect the rock core from the rover, scan it with the laser, and log the mineral.",
        science: "Ancient Mars had liquid rivers and lakes—clay rocks still hold their chemical clues!",
        scienceMore: "Raman spectroscopy uses laser light to fingerprint molecular bonds. Identifying smectite clay minerals proves liquid water once pooled inside Jezero Crater.",
        dilemma: "How fast should the rover drill into the clay rock?",
        classicStory: "The dust storm subsides. Clear skies reveal the ancient river delta of Jezero Crater. Perseverance spots a layered sedimentary deposit that could preserve signs of ancient Martian microbial life. Nova retrieves a sample tube, loads it into the lab's Raman spectrometer, and catalogues the mineral.",
        classicScience: "Raman spectroscopy uses laser inelastic scattering to identify molecular bonds. Simulated spectra here represent realistic phyllosilicates (smectite clays) formed in ancient liquid water.",
        classicDilemma: "Drill Speed & Precision: Deep high-torque drilling risks jamming the diamond bit (ruining the tube). Cautious low-rpm drilling ensures a pristine sample but consumes extra rover power.",
        dilemmaChoices: [
            { id: 'opt_precision_drill', label: '❄️ Slow Precision Drill', pros: '100% Intact Core', tag: '+100 Science', tone: 'sky', outcome: 'Pristine ancient delta sediment core recovered! Vacuum canister sealed in Lab.', effect: { pristineSample: true, scienceScore: 100 } },
            { id: 'opt_fast_drill', label: '🔥 Fast High-Torque Drill', pros: 'Quick Extraction', tag: 'Cracked Sample', tone: 'amber', outcome: 'Drill bit overheated, but core recovered with partial fracturing.', effect: { fracturedSample: true, scienceScore: 70 } }
        ],
        tasks: [
            { id: 'ch7_drill_core', text: 'Get Rock Core from Rover (Mars Surface)', room: '🪨 Mars Surface', shortAction: 'Enter 3-7-8 & grab core tube', done: false },
            { id: 'ch7_raman_insert', text: 'Scan Core with Laser (Science Lab)', room: '🔬 Science Lab', shortAction: 'Load tube & hold laser 2s', done: false },
            { id: 'ch7_catalogue_mineral', text: 'Match Mineral Peaks (Science Lab)', room: '🔬 Science Lab', shortAction: 'Match spectrum & save log', done: false }
        ]
    },
    {
        id: 7,
        act: "ACT III",
        actTitle: "Outside the Red Line",
        solRange: "Sol 330–345",
        solStart: 330,
        role: "Water Tech",
        title: "MISSION 8: Water Recycling Repair",
        story: "Grab the plumbing seal kit, backflush the clogged water filter, and test purity.",
        science: "Closed-loop space habitats recycle up to 98% of every drop of water!",
        scienceMore: "Water conductivity measures dissolved salts and ions in µS/cm. Keeping conductivity under 50 µS/cm alongside biocide treatment keeps drinking water pure.",
        dilemma: "How should we clean the clogged water bioreactor?",
        classicStory: "Disaster in the Water Recycling Room! A bacterial biofilm obstructs the catalytic membrane, reducing throughput and driving water conductivity to 210 µS/cm. Nova must grab the pipe seal kit, flush the purifier, and verify water conductivity drops below 50 µS/cm.",
        classicScience: "Conductivity measures dissolved ions and salts in water. While low conductivity (<50 µS/cm) is a critical indicator of demineralization, biological sterility requires filtration and biocide.",
        classicDilemma: "Water Crisis Triage: Do you flush the bioreactor with 200 Litres of fresh water (depleting reserves), or institute strict crew rationing to 1.2 L/day while running chemical biocide?",
        dilemmaChoices: [
            { id: 'opt_flush_water', label: '💧 Full Water Backflush', pros: 'Instant Clean Filter', tag: '-200 L Reserve', tone: 'sky', outcome: 'Bioreactor cleaned instantly, but reserve water drops to critical 220 Litres!', effect: { waterLoss: 200 } },
            { id: 'opt_ration_water', label: '🔧 Chemical Dose & Ration', pros: 'Saves Water Tank', tag: 'Crew Thirst', tone: 'amber', outcome: 'Preserved water reserves. Crew reports dry throat and minor dehydration fatigue.', effect: { crewFatigue: 15 } }
        ],
        tasks: [
            { id: 'ch8_pipe_seal', text: 'Grab Pipe Seal Kit (Storage)', room: '🧰 Storage Bay', shortAction: 'Pack seal kit in pouch', done: false },
            { id: 'ch8_flush_bioreactor', text: 'Backflush Water Filter (Water Room)', room: '💧 Water Room', shortAction: 'Close inlet, flush 2s & open', done: false },
            { id: 'ch8_conductivity_check', text: 'Test Water Purity <50 µS (Water Room)', room: '💧 Water Room', shortAction: 'Dose biocide until <50 µS/cm', done: false }
        ]
    },

    // ACT IV: THE SOLAR STORM & FINAL SOL (Sol 360–378)
    {
        id: 8,
        act: "ACT IV",
        actTitle: "The Solar Storm & Final Sol",
        solRange: "Sol 360–370",
        solStart: 360,
        role: "Safety Officer",
        title: "MISSION 9: Solar Storm Shelter",
        story: "Sound the radiation siren, lock the water-shield blocks, and call all crew inside.",
        science: "Water tanks around crew bunks block high-energy solar protons like a shield!",
        scienceMore: "Coronal Mass Ejections fire swarms of charged protons across Mars. Hydrogen-rich materials like potable water and regolith blocks absorb ionizing radiation effectively.",
        dilemma: "Where should we pump the water supply during the solar storm?",
        classicStory: "Space weather monitoring detects a major Coronal Mass Ejection launching high-energy solar energetic particles (SEPs) toward Mars! Without Earth's protective magnetic field, radiation at the surface surges. Nova must sound the alarm, verify regolith shelter shielding, and muster all crew inside.",
        classicScience: "Solar flares emit light/X-rays (traveling at light speed), while Coronal Mass Ejections (CMEs) launch massive plasma clouds and high-energy protons (SEPs) taking hours to days to reach Mars.",
        classicDilemma: "Shelter Protocol Execution: All crew must enter Module 07. Do you pump the graywater jackets into the bunk walls immediately, or keep water circulating in the greenhouse crops?",
        dilemmaChoices: [
            { id: 'opt_full_shield', label: '🛡️ Flood Shelter Walls', pros: 'Max Crew Protection', tag: '0.05 mSv/h Safe', tone: 'emerald', outcome: 'Complete radiation protection! Crew shielded safely at 0.05 mSv/h dose.', effect: { fullShield: true } },
            { id: 'opt_partial_shield', label: '🌱 Keep Greenhouse Flow', pros: 'Protects Plants', tag: 'Higher Radiation', tone: 'amber', outcome: 'Crops protected, but crew absorbs 0.85 mSv dose, requiring medical detox.', effect: { crewRadiation: true } }
        ],
        tasks: [
            { id: 'ch9_alarm_siren', text: 'Sound Radiation Siren (Shelter)', room: '🚨 Shelter Bay', shortAction: 'Hold red siren lever 2s', done: false },
            { id: 'ch9_verify_shielding', text: 'Place 4 Shield Blocks (Shelter)', room: '🛡️ Shelter Bay', shortAction: 'Lock 4 water-shield blocks', done: false },
            { id: 'ch9_shelter_evac', text: 'Call All 4 Crew to Bunker (Shelter)', room: '👨‍🚀 Shelter Bay', shortAction: 'Ping 4 crew & seal hatch', done: false }
        ]
    },
    {
        id: 9,
        act: "ACT IV",
        actTitle: "The Solar Storm & Final Sol",
        solRange: "Sol 375–378",
        solStart: 375,
        role: "Mission Lead",
        title: "MISSION 10: Earth Return Prep",
        story: "Pack the Mars rock tubes, harvest fresh crops, and send the final report to Earth.",
        science: "Every Martian rock sample is triple-sealed to protect Earth's biosphere.",
        scienceMore: "Outpost handover archives 378 sols of life-support logs and prepares fresh crops while planetary protection seals keep Martian soil specimens sterile in transit.",
        dilemma: "Final Outpost Handover Mode:",
        classicStory: "Sol 378 has arrived! The 378-day CHAPEA analog expedition is complete. The Earth Return Vehicle (ERV) is on final orbital approach. Nova and the crew must package Jezero core tubes into the ERV vault, harvest mature greenhouse crops, and transmit the final 378-Sol logbook to NASA Houston.",
        classicScience: "Outpost handover requires winterizing life support, archiving telemetry, and securing astrobiological samples. Radio communication between Mars and Earth experiences a 14-minute one-way light delay.",
        classicDilemma: "Final Mission Legacy: Transmit the comprehensive 378-Sol Mission Telemetry Archive to Houston Flight Directors and receive your Junior Astronaut Trainer Certification Scorecard!",
        dilemmaChoices: [
            { id: 'opt_full_handover', label: '🚀 Full Autonomous Handover', pros: 'Certifies Astra-1 for Next Crew', tag: '100% Ready', tone: 'emerald', outcome: 'ASTRA-1 successfully certified! All systems nominal for the incoming relief crew.', effect: { certified: true } }
        ],
        tasks: [
            { id: 'ch10_package_cores', text: 'Pack 3 Rock Cores in Vault (Science Lab)', room: '📦 Science Lab', shortAction: 'Slot 3 sample tubes into vault', done: false },
            { id: 'ch10_greenhouse_seeds', text: 'Harvest Ripe Crops (Greenhouse)', room: '🧺 Greenhouse', shortAction: 'Harvest 3 crop trays to storage', done: false },
            { id: 'ch10_final_report', text: 'Send Final Report to Earth (Science Lab)', room: '📡 Science Lab', shortAction: 'Aim dish & hold transmit', done: false }
        ]
    }
];

// --- MAP LAYOUT: 7 HABITAT ROOMS + CORRIDOR + MARS SURFACE ---
// World coordinate space: 1200 x 760
const ROOMS = [
    {
        id: 'surface',
        name: 'Mars EVA Surface (Outdoors)',
        x: 20, y: 20, w: 250, h: 720,
        floorColor: '#7c2d12',
        borderColor: '#9a3412',
        isOutdoor: true,
        labelX: 145, labelY: 45
    },
    {
        id: 'airlock',
        name: '1. Airlock & Suit Entrance',
        x: 270, y: 290, w: 150, h: 180,
        floorColor: '#1e293b',
        borderColor: '#38bdf8',
        isOutdoor: false,
        labelX: 345, labelY: 312
    },
    {
        id: 'corridor',
        name: 'Central Pressurized Spine',
        x: 420, y: 250, w: 470, h: 260,
        floorColor: '#0f172a',
        borderColor: '#334155',
        isOutdoor: false,
        labelX: 655, labelY: 385
    },
    {
        id: 'power',
        name: '2. Electrical Power Room',
        x: 420, y: 30, w: 230, h: 220,
        floorColor: '#1c1917',
        borderColor: '#f59e0b',
        isOutdoor: false,
        labelX: 535, labelY: 52
    },
    {
        id: 'lifesupport',
        name: '3. Life-Support (ECLSS)',
        x: 660, y: 30, w: 230, h: 220,
        floorColor: '#0f292e',
        borderColor: '#14b8a6',
        isOutdoor: false,
        labelX: 775, labelY: 52
    },
    {
        id: 'water',
        name: '4. Water-Recycling Room',
        x: 420, y: 510, w: 230, h: 220,
        floorColor: '#0c1e35',
        borderColor: '#3b82f6',
        isOutdoor: false,
        labelX: 535, labelY: 715
    },
    {
        id: 'greenhouse',
        name: '5. Hydroponic Greenhouse',
        x: 660, y: 510, w: 230, h: 220,
        floorColor: '#0c291e',
        borderColor: '#22c55e',
        isOutdoor: false,
        labelX: 775, labelY: 715
    },
    {
        id: 'lab',
        name: '6. Laboratory & Medical Bay',
        x: 890, y: 30, w: 280, h: 330,
        floorColor: '#17172b',
        borderColor: '#818cf8',
        isOutdoor: false,
        labelX: 1030, labelY: 52
    },
    {
        id: 'shelter',
        name: '7. Radiation Shelter & Quarters',
        x: 890, y: 380, w: 280, h: 350,
        floorColor: '#231829',
        borderColor: '#c084fc',
        isOutdoor: false,
        labelX: 1030, labelY: 715
    }
];

// --- HABITAT ARCHITECTURAL WALLS & PHYSICAL COLLISION BOUNDARIES ---
// Built to reflect NASA CHAPEA Mars Dune Alpha 3D-printed regolith (Lavacrete) architecture.
// Every cubicle is fully enclosed by continuous walls with designated doorway openings.
const HABITAT_WALLS = [
    // 1. Outer Habitat Perimeter (Impervious outer shield against Mars vacuum & dust)
    { id: 'wall_n_outer', x: 415, y: 20, w: 755, h: 12 },
    { id: 'wall_s_outer', x: 415, y: 728, w: 755, h: 12 },
    { id: 'wall_e_outer', x: 1165, y: 20, w: 12, h: 720 },
    { id: 'wall_w_power', x: 415, y: 20, w: 12, h: 230 },
    { id: 'wall_w_water', x: 415, y: 510, w: 12, h: 230 },

    // 2. Airlock & Pressure Barrier (EVA transit cubicle)
    { id: 'airlock_w_upper', x: 270, y: 285, w: 12, h: 50 },
    { id: 'airlock_w_lower', x: 270, y: 425, w: 12, h: 50 },
    { id: 'airlock_n', x: 270, y: 285, w: 150, h: 12 },
    { id: 'airlock_s', x: 270, y: 463, w: 150, h: 12 },
    { id: 'airlock_conn_north', x: 415, y: 245, w: 12, h: 45 },
    { id: 'airlock_conn_south', x: 415, y: 470, w: 12, h: 45 },
    { id: 'airlock_e_upper', x: 415, y: 285, w: 12, h: 50 },
    { id: 'airlock_e_lower', x: 415, y: 425, w: 12, h: 50 },

    // 3. Central Pressurized Spine: North Wall (Encloses Power & ECLSS)
    // Power doorway at x: 510..565
    { id: 'corr_n_left', x: 415, y: 245, w: 95, h: 12 },
    { id: 'corr_n_mid1', x: 565, y: 245, w: 85, h: 12 },
    // ECLSS doorway at x: 750..805
    { id: 'corr_n_mid2', x: 655, y: 245, w: 95, h: 12 },
    { id: 'corr_n_right', x: 805, y: 245, w: 85, h: 12 },

    // 4. Central Pressurized Spine: South Wall (Encloses Water Recovery & Greenhouse)
    // Water recovery doorway at x: 510..565
    { id: 'corr_s_left', x: 415, y: 505, w: 95, h: 12 },
    { id: 'corr_s_mid1', x: 565, y: 505, w: 85, h: 12 },
    // Greenhouse doorway at x: 750..805
    { id: 'corr_s_mid2', x: 655, y: 505, w: 95, h: 12 },
    { id: 'corr_s_right', x: 805, y: 505, w: 85, h: 12 },

    // 5. Central Pressurized Spine: East Wall (Encloses Science Lab & Radiation Shelter)
    // Lab doorway at y: 270..325
    { id: 'corr_e_top', x: 885, y: 245, w: 12, h: 25 },
    { id: 'corr_e_mid', x: 885, y: 325, w: 12, h: 100 },
    // Shelter doorway at y: 425..480
    { id: 'corr_e_bot', x: 885, y: 480, w: 12, h: 37 },

    // 6. Interior Sound & Pressure Partitions between Cubicles
    { id: 'part_power_eclss', x: 645, y: 25, w: 12, h: 225 },
    { id: 'part_water_greenhouse', x: 645, y: 510, w: 12, h: 225 },
    { id: 'part_eclss_lab', x: 885, y: 25, w: 12, h: 225 },
    { id: 'part_greenhouse_shelter', x: 885, y: 510, w: 12, h: 225 },
    { id: 'part_lab_shelter', x: 890, y: 365, w: 280, h: 12 }
];

// High-Tech Doorway Portals (Dedicated entry points connecting each cubicle to the Central Spine)
const HABITAT_DOORWAYS = [
    { id: 'door_airlock_eva', name: 'EVA Surface Hatch', room: 'airlock', x: 276, y: 380, w: 14, h: 90, color: 0x38bdf8, label: 'EVA Hatch' },
    { id: 'door_airlock_iva', name: 'Airlock Pressurized Hatch', room: 'airlock', x: 421, y: 380, w: 14, h: 90, color: 0x38bdf8, label: 'Inner Seal' },
    { id: 'door_power', name: 'Power Grid Portal', room: 'power', x: 537, y: 251, w: 55, h: 14, color: 0xf59e0b, label: 'Power Door' },
    { id: 'door_lifesupport', name: 'Life Support Portal', room: 'lifesupport', x: 777, y: 251, w: 55, h: 14, color: 0x14b8a6, label: 'ECLSS Door' },
    { id: 'door_water', name: 'Water Recovery Portal', room: 'water', x: 537, y: 511, w: 55, h: 14, color: 0x3b82f6, label: 'Water Door' },
    { id: 'door_greenhouse', name: 'Greenhouse Bio-Portal', room: 'greenhouse', x: 777, y: 511, w: 55, h: 14, color: 0x22c55e, label: 'Agro Door' },
    { id: 'door_lab', name: 'Science & Medical Portal', room: 'lab', x: 891, y: 297, w: 14, h: 55, color: 0x818cf8, label: 'Lab Door' },
    { id: 'door_shelter', name: 'Radiation Shelter Portal', room: 'shelter', x: 891, y: 452, w: 14, h: 55, color: 0xc084fc, label: 'Shelter & Quarters' }
];

// Backward-compatible alias for existing 2D render callers
const DOORS = HABITAT_DOORWAYS;

const OBJECTS = [
    {
        id: 'airlock_console',
        name: 'Airlock Pressure & EVA Suit Check',
        room: '1. Airlock & Entrance',
        x: 345, y: 335, radius: 42,
        color: '#38bdf8', icon: '\uf505',
        factId: 'airlock_pressure'
    },
    {
        id: 'storage_locker',
        name: 'Maintenance Parts & Tool Locker',
        room: 'Central Spine Storage',
        x: 560, y: 375, radius: 44,
        color: '#fbbf24', icon: '\uf7d9',
        factId: 'orion_checklists'
    },
    {
        id: 'power_console',
        name: 'Power Telemetry & HV Junction',
        room: '2. Power Room',
        x: 535, y: 120, radius: 46,
        color: '#f59e0b', icon: '\uf0e7',
        factId: 'mars_power'
    },
    {
        id: 'co2_scrubber',
        name: 'CO₂ Scrubber & O₂ Processor',
        room: '3. Life-Support Room',
        x: 775, y: 120, radius: 46,
        color: '#14b8a6', icon: '\uf72e',
        factId: 'co2_scrubbing'
    },
    {
        id: 'water_recycler',
        name: 'Water Filtration & Plumbing Rig',
        room: '4. Water-Recycling Room',
        x: 535, y: 620, radius: 46,
        color: '#3b82f6', icon: '\uf043',
        factId: 'water_recovery'
    },
    {
        id: 'greenhouse_console',
        name: 'Hydroponic Irrigation & Crop Beds',
        room: '5. Greenhouse Dome',
        x: 775, y: 620, radius: 46,
        color: '#22c55e', icon: '\uf4d8',
        factId: 'hydroponics'
    },
    {
        id: 'lab_console',
        name: 'Science, Comms & Mission Readiness',
        room: '6. Laboratory & Medical Bay',
        x: 1030, y: 170, radius: 46,
        color: '#818cf8', icon: '\uf610',
        factId: 'redundancy'
    },
    {
        id: 'shelter_console',
        name: 'Radiation Shelter & Crew Bunks',
        room: '7. Radiation Shelter',
        x: 1030, y: 555, radius: 46,
        color: '#c084fc', icon: '\uf132',
        factId: 'dust_vs_radiation'
    },
    {
        id: 'solar_array_eva',
        name: 'External Solar Array & Conduit',
        room: 'Mars EVA Surface',
        x: 135, y: 210, radius: 50,
        color: '#f97316', icon: '\uf5ba',
        factId: 'mars_power'
    },
    {
        id: 'mars_rover',
        name: 'Astra-1 Pressurized Rover',
        room: 'Mars EVA Surface',
        x: 135, y: 540, radius: 48,
        color: '#fb923c', icon: '\uf1b9',
        factId: 'airlock_pressure'
    }
];

// NASA-Standard Cubicle Hardware Subsystems & Perimeter Props
const HABITAT_PROPS = [
    // Power Room (Module 02)
    { id: 'power_battery_1', name: 'Li-Ion Battery Bank Alpha', room: 'power', x: 445, y: 65, w: 16, h: 22, refCode: 'NASA-PWS-BAT01', status: 'Optimal (98%)', info: 'Solid-state lithium buffer storing photovoltaic power during Martian night.' },
    { id: 'power_battery_2', name: 'Li-Ion Battery Bank Beta', room: 'power', x: 445, y: 100, w: 16, h: 22, refCode: 'NASA-PWS-BAT02', status: 'Optimal (95%)', info: 'High-density energy storage with automated thermal runaway suppression.' },
    { id: 'power_battery_3', name: 'Li-Ion Battery Bank Gamma', room: 'power', x: 445, y: 135, w: 16, h: 22, refCode: 'NASA-PWS-BAT03', status: 'Optimal (94%)', info: 'Triple-redundant battery string feeding critical ECLSS life-support bus.' },
    { id: 'power_transformer', name: 'HV Step-Down Transformer', room: 'power', x: 535, y: 55, w: 62, h: 20, refCode: 'NASA-PWS-XFR01', status: '480V -> 120V DC', info: 'Converts high-voltage transmission from external solar arrays to habitat grid.' },
    { id: 'power_breakers_1', name: 'Primary Distribution Breakers', room: 'power', x: 625, y: 80, w: 16, h: 30, refCode: 'NASA-PWS-BRK01', status: 'Nominal Bus A', info: 'Solid-state circuit isolation preventing habitat-wide cascade blackouts.' },
    { id: 'power_breakers_2', name: 'Inverter & Auxiliary Switchgear', room: 'power', x: 625, y: 140, w: 16, h: 30, refCode: 'NASA-PWS-BRK02', status: 'Nominal Bus B', info: 'High-frequency DC-DC inverters managing sensitive avionics power feeds.' },

    // Life-Support ECLSS Room (Module 03)
    { id: 'eclss_sabatier', name: 'Sabatier Catalytic Reactor', room: 'lifesupport', x: 770, y: 55, w: 50, h: 24, refCode: 'NASA-ECLSS-SAB01', status: 'Nickel Catalyst 400°C', info: 'Combines metabolic CO₂ with H₂ to produce water and methane.' },
    { id: 'eclss_o2_tanks', name: 'Cryogenic O₂ Storage Array', room: 'lifesupport', x: 675, y: 115, w: 22, h: 65, refCode: 'NASA-ECLSS-LOX01', status: '220 Bar / 90 K', info: 'High-pressure liquid oxygen reserves providing 90 days of reserve breathing air.' },
    { id: 'eclss_n2_tanks', name: 'High-Pressure N₂ Buffer Tanks', room: 'lifesupport', x: 865, y: 115, w: 22, h: 65, refCode: 'NASA-ECLSS-NIT01', status: '180 Bar Buffer', info: 'Maintains 78% Nitrogen habitat partial pressure to prevent hyperoxia.' },

    // Water Recycling Room (Module 04)
    { id: 'water_distillation', name: 'Dual Vapor Distillation Towers', room: 'water', x: 535, y: 700, w: 62, h: 20, refCode: 'NASA-WRS-VCD01', status: 'Boiling Under Vacuum', info: 'Recovers pure water vapor from graywater with 93% thermodynamic efficiency.' },
    { id: 'water_ro_filters', name: 'Reverse Osmosis Filter Array', room: 'water', x: 445, y: 620, w: 16, h: 56, refCode: 'NASA-WRS-ROF01', status: 'Purity: 99.8% (<50 µS)', info: 'Triple-stage semi-permeable membranes filtering minerals, ions, and microbes.' },
    { id: 'water_cisterns', name: 'Pressurized Potable Water Cisterns', room: 'water', x: 625, y: 620, w: 22, h: 56, refCode: 'NASA-WRS-CST01', status: '1,450 Liters Stored', info: 'Potable reservoir treated with silver-ion biocide for crew consumption.' },

    // Hydroponic Greenhouse (Module 05)
    { id: 'greenhouse_crops', name: 'Vertical Hydroponic Salad Racks', room: 'greenhouse', x: 770, y: 700, w: 72, h: 22, refCode: 'NASA-BIO-VGR01', status: 'PAR 350 µmol/m²/s', info: 'Multi-tier LED aeroponic racks producing fresh lettuce, radishes, and spinach.' },
    { id: 'greenhouse_micro', name: 'Microgreen Germination Station', room: 'greenhouse', x: 675, y: 620, w: 16, h: 54, refCode: 'NASA-BIO-INC01', status: '22°C / 70% RH', info: 'Climate-controlled incubator for high-nutrient seedling germination.' },
    { id: 'greenhouse_nutrients', name: 'Automated Nutrient Dosing Buffer', room: 'greenhouse', x: 865, y: 620, w: 22, h: 56, refCode: 'NASA-BIO-DOS01', status: 'pH 5.8 / EC 1.8', info: 'Precision peristaltic injection of Nitrogen, Phosphorus, and Potassium solutions.' },

    // Laboratory & Medical Bay (Module 06)
    { id: 'lab_med_pod', name: 'Bio-Diagnostic Stasis Exam Pod', room: 'lab', x: 1030, y: 65, w: 56, h: 24, refCode: 'NASA-HRF-MED01', status: 'Sensors Calibrated', info: 'Ergonomic diagnostic bed with ultrasound, EEG, and non-invasive vitals telemetry.' },
    { id: 'lab_workbench', name: 'Specimen Centrifuge Workbench', room: 'lab', x: 1140, y: 170, w: 18, h: 84, refCode: 'NASA-SCI-LAB01', status: '8,000 RPM Ready', info: 'Analytical bench with optical microscope and sample blood/soil separation.' },
    { id: 'lab_comms', name: 'Deep Space Telemetry Server Rack', room: 'lab', x: 1030, y: 335, w: 52, h: 16, refCode: 'NASA-COM-SRV01', status: 'DSN Uplink: 42 Mbps', info: 'Computes orbital mechanics, Earth communication relay, and habitat telemetry.' },

    // Radiation Shelter & Quarters (Module 07)
    { id: 'shelter_bunk_1', name: 'Crew Bunk Alpha (Berth S-01)', room: 'shelter', x: 1135, y: 460, w: 24, h: 54, refCode: 'NASA-HAB-BNK01', status: 'Occupied: Philip', info: '3D-printed titanium berth with acoustic dampening and personal storage.' },
    { id: 'shelter_bunk_2', name: 'Crew Bunk Beta (Berth S-02)', room: 'shelter', x: 1135, y: 630, w: 24, h: 54, refCode: 'NASA-HAB-BNK02', status: 'Occupied: Nova', info: 'Regolith-insulated stasis berth equipped with circadian lighting and sleep monitors.' },
    { id: 'shelter_shield', name: 'Water-Jacketed Storm Shielding', room: 'shelter', x: 1030, y: 405, w: 72, h: 18, refCode: 'NASA-RAD-SHD01', status: 'Shield Atten: 94%', info: 'Interlocking 50cm regolith blocks lined with graywater jackets absorbing SPE radiation.' },
    { id: 'shelter_rations', name: 'Emergency Rations & Trauma Kit', room: 'shelter', x: 1030, y: 700, w: 62, h: 18, refCode: 'NASA-SUP-MED01', status: '180-Day Reserve', info: 'MRE packs, radiation counter-measures, and automated trauma response kit.' },

    // Airlock & Suit Chamber (Module 01)
    { id: 'airlock_suit_1', name: 'EVA Suit Charging Stanchion A', room: 'airlock', x: 295, y: 310, w: 26, h: 10, refCode: 'NASA-EVA-STN01', status: 'Recharge: 100%', info: 'Wall dock charging suit batteries, replenishing O₂ bottles, and running leak tests.' },
    { id: 'airlock_suit_2', name: 'EVA Suit Charging Stanchion B', room: 'airlock', x: 395, y: 310, w: 26, h: 10, refCode: 'NASA-EVA-STN02', status: 'Recharge: 100%', info: 'Auxiliary suit berth with automated telemetry sync and biometric umbilical.' },
    { id: 'airlock_pump_1', name: 'Turbomolecular Evacuation Pump Alpha', room: 'airlock', x: 295, y: 450, w: 20, h: 20, refCode: 'NASA-AL-PMP01', status: 'Standby (101.3 kPa)', info: 'Recovers 96% of airlock atmosphere back into habitat before opening outer hatch.' },
    { id: 'airlock_pump_2', name: 'Turbomolecular Evacuation Pump Beta', room: 'airlock', x: 395, y: 450, w: 20, h: 20, refCode: 'NASA-AL-PMP02', status: 'Standby (101.3 kPa)', info: 'Dual-stage vacuum evacuation pump completing chamber depressurization in 4 minutes.' }
];

// UPGRADE 4: Task-to-Equipment Mapping for Junior Astronaut Waypoint Navigation
const TASK_OBJECT_MAP = {
    // Act I: Missions 1 - 3
    ch1_airlock: 'airlock_console',
    ch1_tool: 'storage_locker',
    ch1_life: 'co2_scrubber',
    ch1_power: 'power_console',
    ch2_crop_inspect: 'greenhouse_console',
    ch2_greenhouse_power: 'power_console',
    ch2_flush_irrigation: 'water_recycler',
    ch2_nutrient_mix: 'water_recycler',
    ch3_eva_prep: 'airlock_console',
    ch3_rover_link: 'mars_rover',
    ch3_heli_inspect: 'mars_rover',

    // Act II: Missions 4 - 6
    ch4_shed_load: 'power_console',
    ch4_gen_backup: 'power_console',
    ch4_dust_wipers: 'solar_array_eva',
    ch4_power_diag: 'power_console',
    ch4_replace_fuse: 'power_console',
    ch5_eva_suit: 'airlock_console',
    ch5_cycle_door: 'airlock_console',
    ch5_repair_junction: 'solar_array_eva',
    ch5_airlock_exit: 'airlock_console',
    ch5_secure_latch: 'solar_array_eva',
    ch5_conduit_verify: 'solar_array_eva',
    ch6_filter_grab: 'storage_locker',
    ch6_filter_install: 'co2_scrubber',
    ch6_co2_verify: 'co2_scrubber',

    // Act III: Missions 7 - 8
    ch7_drill_core: 'mars_rover',
    ch7_raman_insert: 'lab_console',
    ch7_catalogue_mineral: 'lab_console',
    ch7_lab_terminal: 'lab_console',
    ch7_seal_canister: 'lab_console',
    ch8_pipe_seal: 'storage_locker',
    ch8_flush_bioreactor: 'water_recycler',
    ch8_conductivity_check: 'water_recycler',

    // Act IV: Missions 9 - 10
    ch9_alarm_siren: 'shelter_console',
    ch9_verify_shielding: 'shelter_console',
    ch9_shelter_evac: 'shelter_console',
    ch9_water_shield: 'shelter_console',
    ch10_package_cores: 'lab_console',
    ch10_greenhouse_seeds: 'greenhouse_console',
    ch10_final_report: 'lab_console'
};

// --- AUTONOMOUS NPC ROOM BOUNDARIES & WORKSTATION ACTIVITY ROUTINES ---
// Strict spatial limits guaranteeing NPCs remain within their assigned modules at all times
const NPC_ROOM_BOUNDS = {
    power: { roomId: 'power', roomName: '2. Electrical Power Room', minX: 450, maxX: 615, minY: 75, maxY: 215 },
    greenhouse: { roomId: 'greenhouse', roomName: '5. Hydroponic Greenhouse', minX: 695, maxX: 850, minY: 550, maxY: 685 },
    lab: { roomId: 'lab', roomName: '6. Laboratory & Medical Bay', minX: 930, maxX: 1120, minY: 80, maxY: 320 },
    shelter: { roomId: 'shelter', roomName: '7. Radiation Shelter & Quarters', minX: 935, maxX: 1115, minY: 425, maxY: 680 }
};

const NPC_ACTIVITY_ROUTINES = {
    vance: {
        assignedRoom: 'lab',
        defaultStatus: 'Overseeing habitat operational readiness',
        waypoints: [
            {
                id: 'wp_vance_comms',
                name: 'DSN Telemetry Server Rack',
                x: 1030, y: 305,
                facing: 'down',
                action: 'working',
                workText: 'Uplinking telemetry to DSN Earth relay',
                moveText: 'Heading to Deep Space Comms Rack',
                duration: 6.5
            },
            {
                id: 'wp_vance_bench',
                name: 'Specimen Centrifuge Bench',
                x: 1105, y: 175,
                facing: 'right',
                action: 'inspecting',
                workText: 'Analyzing regolith core sample spectra',
                moveText: 'Walking to Specimen Centrifuge Bench',
                duration: 5.5
            },
            {
                id: 'wp_vance_med',
                name: 'Bio-Diagnostic Stasis Exam Pod',
                x: 1030, y: 105,
                facing: 'up',
                action: 'inspecting',
                workText: 'Auditing medical diagnostic telemetry',
                moveText: 'Checking Bio-Diagnostic Pod',
                duration: 5.0
            },
            {
                id: 'wp_vance_console',
                name: 'Mission Readiness Console',
                x: 990, y: 175,
                facing: 'right',
                action: 'working',
                workText: 'Reviewing outpost mission operations',
                moveText: 'Moving to Mission Operations Console',
                duration: 7.0
            },
            {
                id: 'wp_vance_post',
                name: 'Command Observation Post',
                x: 960, y: 240,
                facing: 'down',
                action: 'idle',
                workText: 'Overseeing habitat operational readiness',
                moveText: 'Returning to Commander Station',
                duration: 4.5
            },
            {
                id: 'wp_vance_archive',
                name: 'Sample Storage Archive',
                x: 960, y: 120,
                facing: 'up',
                action: 'inspecting',
                workText: 'Cataloguing biological & mineral canisters',
                moveText: 'Inspecting Sample Canister Archive',
                duration: 5.0
            }
        ]
    },
    lin: {
        assignedRoom: 'greenhouse',
        defaultStatus: 'Tending hydroponic dwarf wheat & microgreens',
        waypoints: [
            {
                id: 'wp_lin_crops',
                name: 'Vertical Aeroponic Salad Racks',
                x: 770, y: 665,
                facing: 'down',
                action: 'working',
                workText: 'Pruning dwarf wheat & checking PAR sensor',
                moveText: 'Moving to Vertical Hydroponic Racks',
                duration: 6.5
            },
            {
                id: 'wp_lin_micro',
                name: 'Microgreen Germination Incubator',
                x: 710, y: 620,
                facing: 'left',
                action: 'inspecting',
                workText: 'Checking humidity in germination chamber',
                moveText: 'Inspecting Microgreen Incubator',
                duration: 5.0
            },
            {
                id: 'wp_lin_nutrients',
                name: 'Automated Nutrient Dosing Buffer',
                x: 830, y: 620,
                facing: 'right',
                action: 'working',
                workText: 'Balancing automated N-P-K nutrient buffer',
                moveText: 'Walking to Nutrient Dosing Station',
                duration: 6.0
            },
            {
                id: 'wp_lin_console',
                name: 'Greenhouse Climate Bio-Console',
                x: 775, y: 580,
                facing: 'down',
                action: 'working',
                workText: 'Calibrating aeroponic drip irrigation cycle',
                moveText: 'Checking Greenhouse Master Console',
                duration: 5.5
            },
            {
                id: 'wp_lin_observe',
                name: 'Seedling Observation Post',
                x: 830, y: 655,
                facing: 'left',
                action: 'idle',
                workText: 'Observing microgreen crop growth rates',
                moveText: 'Returning to Crop Observation Area',
                duration: 4.5
            },
            {
                id: 'wp_lin_lines',
                name: 'Aeroponic Delivery Drip Lines',
                x: 715, y: 565,
                facing: 'right',
                action: 'inspecting',
                workText: 'Inspecting drip lines for mineral deposits',
                moveText: 'Checking Aeroponic Feeder Lines',
                duration: 5.0
            }
        ]
    },
    philip: {
        assignedRoom: 'power',
        defaultStatus: 'Monitoring grid load & high-voltage stability',
        waypoints: [
            {
                id: 'wp_phil_bat1',
                name: 'Li-Ion Battery Banks Alpha & Beta',
                x: 480, y: 100,
                facing: 'left',
                action: 'inspecting',
                workText: 'Inspecting Li-Ion battery bank telemetry',
                moveText: 'Heading to Li-Ion Battery Banks',
                duration: 6.0
            },
            {
                id: 'wp_phil_bat3',
                name: 'Li-Ion Battery Bank Gamma',
                x: 475, y: 140,
                facing: 'left',
                action: 'working',
                workText: 'Testing bus voltage on backup battery string',
                moveText: 'Inspecting Backup Battery String',
                duration: 5.5
            },
            {
                id: 'wp_phil_xfr',
                name: 'HV Step-Down Transformer',
                x: 535, y: 85,
                facing: 'up',
                action: 'working',
                workText: 'Calibrating 480V step-down transformer',
                moveText: 'Moving to HV Transformer Unit',
                duration: 6.5
            },
            {
                id: 'wp_phil_brk',
                name: 'Primary Distribution Breakers',
                x: 590, y: 110,
                facing: 'right',
                action: 'inspecting',
                workText: 'Verifying solid-state distribution breakers',
                moveText: 'Inspecting Primary Breakers Bus A',
                duration: 5.0
            },
            {
                id: 'wp_phil_inv',
                name: 'Inverter & Auxiliary Switchgear',
                x: 595, y: 145,
                facing: 'right',
                action: 'working',
                workText: 'Monitoring DC-DC inverter wave harmonics',
                moveText: 'Testing Inverter Switchgear Bus B',
                duration: 5.5
            },
            {
                id: 'wp_phil_console',
                name: 'Power Telemetry & HV Console',
                x: 535, y: 165,
                facing: 'up',
                action: 'working',
                workText: 'Balancing outpost kilowatt power grid',
                moveText: 'Returning to Power Grid Console',
                duration: 7.0
            },
            {
                id: 'wp_phil_post',
                name: 'Chief Engineer Post',
                x: 465, y: 175,
                facing: 'right',
                action: 'idle',
                workText: 'Auditing high-voltage circuit stability',
                moveText: 'Returning to Engineer Station',
                duration: 4.5
            }
        ]
    },
    maya: {
        assignedRoom: 'shelter',
        defaultStatus: 'Evaluating crew vitals & radiation storm shield',
        waypoints: [
            {
                id: 'wp_maya_shield',
                name: 'Water-Jacket Storm Shielding',
                x: 1030, y: 440,
                facing: 'up',
                action: 'inspecting',
                workText: 'Checking water-shield radiation dosimeters',
                moveText: 'Inspecting Water-Wall Radiation Shield',
                duration: 6.0
            },
            {
                id: 'wp_maya_bunk1',
                name: 'Crew Bunk Alpha (Philip)',
                x: 1090, y: 465,
                facing: 'right',
                action: 'working',
                workText: 'Checking circadian lighting & sleep monitors',
                moveText: 'Checking Crew Berth S-01 Sensors',
                duration: 5.0
            },
            {
                id: 'wp_maya_bunk2',
                name: 'Crew Bunk Beta (Nova)',
                x: 1090, y: 630,
                facing: 'right',
                action: 'working',
                workText: 'Recording crew biometric baseline readings',
                moveText: 'Reviewing Stasis Berth S-02 Biometrics',
                duration: 5.5
            },
            {
                id: 'wp_maya_rations',
                name: 'Emergency Rations & Trauma Kit',
                x: 1030, y: 665,
                facing: 'down',
                action: 'inspecting',
                workText: 'Inventorying trauma supplies & dosimeter pens',
                moveText: 'Inspecting Emergency Trauma Kit',
                duration: 5.0
            },
            {
                id: 'wp_maya_console',
                name: 'Radiation Shelter Master Console',
                x: 990, y: 555,
                facing: 'right',
                action: 'working',
                workText: 'Tracking solar particle flux & space weather',
                moveText: 'Moving to Radiation Master Console',
                duration: 7.0
            },
            {
                id: 'wp_maya_post',
                name: 'Flight Surgeon Post',
                x: 965, y: 500,
                facing: 'down',
                action: 'idle',
                workText: 'Evaluating crew cardiovascular resilience',
                moveText: 'Returning to Surgeon Station',
                duration: 4.5
            }
        ]
    }
};

const CREW_NPCS = [
    {
        id: 'vance',
        name: 'Cmdr. Vance',
        x: 960, y: 240,
        assignedRoom: 'lab',
        facing: 'down',
        suitColor: '#0284c7',
        hairColor: '#fde047',
        skinColor: '#fed7aa',
        role: 'Mission Commander',
        statusIcon: '📡',
        hp: 100, energy: 92,
        quote: 'Check telemetry before flipping switches, Nova.',
        dialogues: [
            {
                speaker: 'Cmdr. Vance',
                role: 'Mission Commander',
                portrait: 'vance',
                text: "Welcome to the Command Lab, Cadet Nova! Just like NASA's pioneering CHAPEA analog crews at Johnson Space Center, our team depends on strict role specialization: Philip manages our power grid, Maya watches our biological vitals, Elena grows our food, and you are our lead systems troubleshooter. Remember our golden rule: never guess which button to press. Read the kW, kPa, and ppm telemetry first.",
                tradeoff: 'NASA astronauts on Orion & Artemis rely on electronic procedures to weigh competing system demands.'
            },
            {
                speaker: 'Cadet Nova (You)',
                role: 'Junior Astronaut',
                portrait: 'nova',
                text: 'Understood, Commander! I am tracking our battery reserve (kWh), cabin CO₂ (ppm), and water conductivity (µS/cm) across all seven habitat modules.',
                tradeoff: 'Balancing power, life support, radiation shielding, and food production determines mission success.'
            }
        ]
    },
    {
        id: 'lin',
        name: 'Dr. Elena Lin',
        x: 830, y: 635,
        assignedRoom: 'greenhouse',
        facing: 'left',
        suitColor: '#16a34a',
        hairColor: '#ea580c',
        skinColor: '#ffedd5',
        role: 'Chief Botanist',
        statusIcon: '🌱',
        hp: 98, energy: 88,
        quote: 'Our crops need clean water (<60 µS/cm) and steady LED light!',
        dialogues: [
            {
                speaker: 'Dr. Elena Lin',
                role: 'Chief Botanist',
                portrait: 'lin',
                text: "Look at these hydroponic dwarf wheat and cherry tomato beds, Nova! Just like NASA's CHAPEA and Veggie plant experiments, fresh crops provide vital vitamins, recycle water through transpiration, and boost crew morale far beyond freeze-dried rations—but my LED grow banks need 5 kW of power.",
                tradeoff: 'Trade-off: Running Greenhouse LEDs grows food for the future, but costs 5 kW of scarce electrical power.'
            },
            {
                speaker: 'Cadet Nova (You)',
                role: 'Junior Astronaut',
                portrait: 'nova',
                text: 'I will make sure the irrigation pump stays calibrated and only shed greenhouse lighting if life support is in an emergency deficit!',
                tradeoff: 'Hydroponics links the Water-Recycling loop directly to long-term crew food security.'
            }
        ]
    },
    {
        id: 'philip',
        name: 'Eng. Philip',
        x: 465, y: 175,
        assignedRoom: 'power',
        facing: 'right',
        suitColor: '#9a3412',
        hairColor: '#1e293b',
        skinColor: '#fdba74',
        role: 'Chief Engineer',
        statusIcon: '⚡',
        hp: 95, energy: 84,
        helmetOn: true,
        quote: 'Watch the kW load! A battery only buys us time.',
        dialogues: [
            {
                speaker: 'Eng. Philip',
                role: 'Chief Systems Engineer',
                portrait: 'philip',
                text: 'Careful around the HV Junction bus, Cadet! People think batteries create energy—they don’t. Our 100 kWh battery bank only buys us time when solar generation drops below habitat demand.',
                tradeoff: 'Trade-off: Shedding non-essential lab or greenhouse loads protects life-support reserves during solar deficits.'
            },
            {
                speaker: 'Cadet Nova (You)',
                role: 'Junior Astronaut',
                portrait: 'nova',
                text: 'Got it, Philip. If solar output drops below our kW demand, I will shed deferrable loads or bring the Backup RTG/Fission unit online.',
                tradeoff: 'Generation (kW) must equal or exceed Load (kW) to stop battery discharge.'
            }
        ]
    },
    {
        id: 'maya',
        name: 'Dr. Maya Patel',
        x: 965, y: 500,
        assignedRoom: 'shelter',
        facing: 'down',
        suitColor: '#9333ea',
        hairColor: '#475569',
        skinColor: '#fed7aa',
        role: 'Flight Surgeon',
        statusIcon: '🛡️',
        hp: 100, energy: 95,
        quote: 'During solar particle alerts, everyone shelters here.',
        dialogues: [
            {
                speaker: 'Dr. Maya Patel',
                role: 'Flight Surgeon & Radiation Officer',
                portrait: 'maya',
                text: "Mars has no thick atmosphere or global magnetic field like Earth. Notice these blue cylinders along our 3D-printed regolith walls? We surround the crew bunks with potable water tanks to block solar protons and keep our radiation dose below NASA lifetime limits!",
                tradeoff: 'Trade-off: Dust storms block sunlight (kW), whereas Solar Particle Events spike ionizing radiation (mSv/h) and require immediate sheltering.'
            }
        ]
    }
];

const CHAPTER_DIALOGUES = {
    0: [
        {
            speaker: 'ARIA • Shipboard AI',
            role: 'Orion / Astra-1 Telemetry AI',
            portrait: 'aria',
            text: 'Touchdown confirmed at Arcadia Planitia, Mars. Welcome to ASTRA-1, Cadet Nova! All five crew members have safely arrived. Our 3D-printed regolith habitat has awakened from dormancy.',
            tradeoff: 'Mission Goal: Balance life support, radiation shielding, power, and food across 378 Martian sols (NASA CHAPEA Analog).'
        },
        {
            speaker: 'Cmdr. Vance',
            role: 'Mission Commander',
            portrait: 'vance',
            text: 'Nova, look out the viewport—we are 225 million kilometers from Earth. Before we unpack science gear, we must verify the habitat is safe using our electronic checklists.',
            tradeoff: 'Astronauts never guess: we verify cabin pressure (101.3 kPa), power (kW), and oxygen before starting work.'
        },
        {
            speaker: 'Eng. Philip',
            role: 'Chief Engineer',
            portrait: 'philip',
            text: 'Landing kicked up regolith dust. Nova, grab your Diagnostic Multi-Tool from Central Storage, then check the Airlock, Power, and Life-Support consoles!',
            tradeoff: 'First Tasks: Check Airlock -> Grab Tools in Storage -> Inspect Power & Life-Support consoles.'
        }
    ],
    1: [
        {
            speaker: 'Dr. Elena Lin',
            role: 'Chief Botanist',
            portrait: 'lin',
            text: 'Nova, welcome to the Greenhouse Dome! Packaged astronaut meals only go so far. Fresh dwarf wheat and salad microgreens provide vital vitamins and psychological morale.',
            tradeoff: 'NASA CHAPEA research proved fresh crops drastically reduce astronaut isolation stress and nutrient fatigue.'
        },
        {
            speaker: 'Cadet Nova (You)',
            role: 'Junior Astronaut',
            portrait: 'nova',
            text: 'I will calibrate our LED grow lights to the optimal PAR spectrum, mix the mineral nutrients in the water loop, and ensure the greenhouse power circuit is engaged!',
            tradeoff: 'Balanced PAR lighting (450nm Blue + 660nm Red) produces maximum biomass with minimum electrical draw.'
        }
    ],
    2: [
        {
            speaker: 'Cmdr. Vance',
            role: 'Mission Commander',
            portrait: 'vance',
            text: 'Surface assets are online! The NASA Perseverance Rover and Ingenuity Helicopter are staged outside on the regolith. Time for your first extravehicular activity (EVA).',
            tradeoff: 'Always don the pressurized EMU suit at the Airlock before opening the outer hatch (0.6 kPa exterior).'
        },
        {
            speaker: 'Cadet Nova (You)',
            role: 'Junior Astronaut',
            portrait: 'nova',
            text: 'Suit donned and pressurized to 30 kPa pure O₂! Stepping onto the Martian surface to connect the rover telemetry umbilical and inspect Ingenuity rotor blades.',
            tradeoff: 'Perseverance expands our exploration radius from 500 meters to over 20 kilometers.'
        }
    ],
    3: [
        {
            speaker: 'Eng. Philip',
            role: 'Chief Engineer',
            portrait: 'philip',
            text: '🚨 Emergency in the Power Room, Nova! Atmospheric optical depth surged—a regional dust storm slashed solar output to 8 kW while we draw 24 kW (16 kW deficit)!',
            tradeoff: 'A battery only buys time; it does not create energy. Triage loads immediately to prevent total blackout!'
        },
        {
            speaker: 'Cadet Nova (You)',
            role: 'Junior Astronaut',
            portrait: 'nova',
            text: 'I will shed non-essential loads in the Power Grid, replace the blown junction HV Fuse, and bring our Backup Generator (+12 kW) online!',
            tradeoff: 'Keep Primary Life Support powered at all costs to prevent rapid CO₂ buildup.'
        }
    ],
    4: [
        {
            speaker: 'Eng. Philip',
            role: 'Chief Engineer',
            portrait: 'philip',
            text: 'High winds reach 40 m/s outside! The mechanical storm latch on the external solar array has dislodged. If we don’t clamp it down, the gale will rip the panels off!',
            tradeoff: 'Near-zero visibility EVA: stay tethered to guide rails to prevent spatial disorientation.'
        },
        {
            speaker: 'Cadet Nova (You)',
            role: 'Junior Astronaut',
            portrait: 'nova',
            text: 'Exiting the airlock into the brownout tempest. Locking down the storm clamps on the solar array and verifying high-voltage bus continuity!',
            tradeoff: 'Mars atmosphere is thin, but high-velocity dust causes intense electrostatic abrasion.'
        }
    ],
    5: [
        {
            speaker: 'Dr. Maya Patel',
            role: 'Flight Surgeon',
            portrait: 'maya',
            text: 'Nova, the crew is developing headaches and lethargy! Atmospheric dust clogged our air intakes, saturating the Life-Support LiOH scrubber. CO₂ is over 1,600 ppm!',
            tradeoff: 'Carbon dioxide toxicity (hypercapnia) impairs decision-making long before oxygen runs out.'
        },
        {
            speaker: 'Cadet Nova (You)',
            role: 'Junior Astronaut',
            portrait: 'nova',
            text: 'Retrieving a fresh LiOH filter cassette from Storage! I will swap the saturated cartridge in Life Support until CO₂ drops below 600 ppm.',
            tradeoff: 'LiOH cassettes chemically scrub CO₂ with zero continuous electrical power consumption.'
        }
    ],
    6: [
        {
            speaker: 'Cmdr. Vance',
            role: 'Mission Commander',
            portrait: 'vance',
            text: 'The storm has cleared, revealing the ancient river delta of Jezero Crater! Perseverance has located ancient clay sediments. Nova, take remote control from the Science Lab.',
            tradeoff: 'Perseverance uses a rotary percussive coring drill to extract 13-gram rock cores in sealed titanium tubes.'
        },
        {
            speaker: 'Cadet Nova (You)',
            role: 'Junior Astronaut',
            portrait: 'nova',
            text: 'Booting the rover robotics terminal in the Lab! Coring sequence initiated on delta sediment. Sample tube hermetically sealed and registered!',
            tradeoff: 'Astrobiology search: Jezero clay minerals may hold fossilized biosignatures of ancient microbial life.'
        }
    ],
    7: [
        {
            speaker: 'Eng. Philip',
            role: 'Chief Engineer',
            portrait: 'philip',
            text: 'Crisis in Water Recycling! Bacterial biofilm penetrated the catalytic membrane. Potable water conductivity spiked to 210 µS/cm—we only have 48 hours of clean water left!',
            tradeoff: 'NASA ISS and CHAPEA systems purify graywater with 98% efficiency, but membrane fouling is a real threat.'
        },
        {
            speaker: 'Cadet Nova (You)',
            role: 'Junior Astronaut',
            portrait: 'nova',
            text: 'Grabbing pipe sealant and silver-ion biocide from Maintenance! Flushing the bioreactor loop until conductivity drops below 50 µS/cm.',
            tradeoff: 'Potable water must maintain conductivity <50 µS/cm to prevent mineral and bacterial toxicity.'
        }
    ],
    8: [
        {
            speaker: 'ARIA • Shipboard AI',
            role: 'Orion / Astra-1 Telemetry AI',
            portrait: 'aria',
            text: 'CODE RED ALARM: DONKI space weather alert! An X-class coronal mass ejection has erupted. Lethal solar proton flux (120 mSv/h) will strike Arcadia Planitia in 3 minutes!',
            tradeoff: 'Without a planetary magnetic field, Solar Particle Events require immediate evacuation into shielded storm shelters.'
        },
        {
            speaker: 'Dr. Maya Patel',
            role: 'Flight Surgeon',
            portrait: 'maya',
            text: 'Nova! Sound the habitat siren! Everyone must get into Module 07 (Radiation Shelter & Quarters). Pump the water-jacket walls to maximum thickness!',
            tradeoff: 'Hydrogen-rich materials like water and food are the most effective shields against ionizing cosmic rays.'
        }
    ],
    9: [
        {
            speaker: 'Cmdr. Vance',
            role: 'Mission Commander',
            portrait: 'vance',
            text: 'Sol 378 has arrived! Cadet Nova, you have led this outpost through storms, blackouts, equipment failures, and radiation storms across 378 days.',
            tradeoff: 'Final Handover: Package sample tubes, archive telemetry, and certify the outpost for the relief crew.'
        },
        {
            speaker: 'Cadet Nova (You)',
            role: 'Junior Astronaut',
            portrait: 'nova',
            text: 'Jezero core canisters secured for the Earth Return Vehicle, cryo-seeds stored in the vault, and all systems nominal. Transmitting final 378-Sol debriefing to Houston!',
            tradeoff: 'Mission complete: You have earned your 2026 NASA Space Apps Junior Astronaut Mission Certification!'
        }
    ]
};

if (typeof module !== 'undefined') {
    module.exports = { CHAPTERS, OBJECTS, TASK_OBJECT_MAP, CHAPTER_DIALOGUES, CREW_NPCS, NPC_ROOM_BOUNDS, NPC_ACTIVITY_ROUTINES };
}

if (typeof window !== 'undefined') {
    window.CHAPTERS = CHAPTERS;
    window.OBJECTS = OBJECTS;
    window.TASK_OBJECT_MAP = TASK_OBJECT_MAP;
    window.CHAPTER_DIALOGUES = CHAPTER_DIALOGUES;
    window.CREW_NPCS = CREW_NPCS;
    window.NPC_ROOM_BOUNDS = NPC_ROOM_BOUNDS;
    window.NPC_ACTIVITY_ROUTINES = NPC_ACTIVITY_ROUTINES;
}
