/**
 * ASTRA-1: The Red Frontier - 6-Chapter Mission Campaign, Habitat Map & Dialogues
 * 2026 NASA Space Apps Challenge
 */

// --- 6-CHAPTER CONNECTED CAMPAIGN DEFINITIONS ---
const CHAPTERS = [
    {
        id: 0,
        solRange: "Sol 01–02",
        solStart: 1,
        title: "CHAPTER 1: Arrival — A New World",
        story: "In 2048, the first crew of the Astra-1 expedition lands on Mars to establish a research outpost for future human exploration. You are Cadet Nova. Before the five-person crew can unpack scientific gear, an unexpected chain of equipment anomalies appears.",
        science: "Astronauts use sensors, displays, checklists, and verified procedures to confirm spacecraft safety. Like NASA's Orion spacecraft, Astra-1 relies on telemetry verification before committing crew resources.",
        dilemma: "Complete your initial walkaround inspection: check the Airlock pressure seal, inspect the Power Room telemetry (where Solar Array 1 reports instability), verify the Life-Support oxygen processor, and pick up your Diagnostic Multi-Tool.",
        tasks: [
            { id: 'ch1_airlock', text: 'Inspect Airlock Pressure Console (Airlock)', done: false },
            { id: 'ch1_tool', text: 'Collect Diagnostic Tool & Spare Fuse (Storage)', done: false },
            { id: 'ch1_power', text: 'Check Power Telemetry Console (Power Room)', done: false },
            { id: 'ch1_life', text: 'Verify O₂ & Cabin Sensor Console (Life Support)', done: false }
        ]
    },
    {
        id: 1,
        solRange: "Sol 03–06",
        solStart: 4,
        title: "CHAPTER 2: Power Down",
        story: "Solar generation drops to 18 kW while the habitat draws 24 kW—creating a 6 kW power deficit! Battery reserves are steadily draining. Furthermore, a blown HV junction circuit in the Power Room is limiting distribution efficiency.",
        science: "Power systems must balance generation (kW), consumption (kW), and stored energy (kWh). A battery buys time; it does not create energy.",
        dilemma: "Do you keep the Laboratory and high-intensity Greenhouse lights running, or shed non-essential loads while you grab a replacement HV Fuse from Maintenance Storage and repair the damaged circuit?",
        tasks: [
            { id: 'ch2_diag', text: 'Diagnose fault at Power Telemetry Console', done: false },
            { id: 'ch2_shed', text: 'Eliminate kW Deficit via Power Grid (Shed Lab/Backup)', done: false },
            { id: 'ch2_repair', text: 'Repair Junction Box in Power Room using HV Fuse', done: false }
        ]
    },
    {
        id: 2,
        solRange: "Sol 07–11",
        solStart: 8,
        title: "CHAPTER 3: Breath of Life",
        story: "The habitat's environmental monitor triggers an amber alert: carbon dioxide levels are climbing above 1,400 ppm! At the same time, a pipe coupling leak is draining the Water-Recycling Room and spiking water conductivity to 185 µS/cm.",
        science: "Oxygen supply, CO₂ removal (ppm), cabin pressure (kPa), and closed-loop water filtration (µS/cm conductivity) are core functions modeled on Orion and ISS life-support hardware.",
        dilemma: "Activating the backup CO₂ scrubber draws +3 kW of power immediately, while replacing the LiOH filter cassette in Life Support permanently fixes the unit. You must also grab a Pipe Seal Kit and repair the leaking water recycler.",
        tasks: [
            { id: 'ch3_part', text: 'Collect LiOH Filter & Pipe Seal Kit from Maintenance', done: false },
            { id: 'ch3_co2', text: 'Replace CO₂ Scrubber Filter in Life-Support Room', done: false },
            { id: 'ch3_water', text: 'Repair Water Pipe & Verify Purity in Water Room', done: false }
        ]
    },
    {
        id: 3,
        solRange: "Sol 12–16",
        solStart: 12,
        title: "CHAPTER 4: Growing a Future",
        story: "Crew food reserves are declining as packaged rations are consumed. Inside the Greenhouse dome, the hydroponic irrigation pump is cavitating, crop growth has stalled, and nutrient delivery needs recalibration.",
        science: "Hydroponic crops require balanced light, potable water, nutrients, and temperature (°C). Healthy plants produce fresh food and assist air revitalization, but demand steady water and electrical allocation.",
        dilemma: "Enter the Greenhouse, repair the malfunctioning irrigation pump, calibrate nutrient & LED spectrum settings, and ensure Greenhouse Power remains switched ON in the Power Grid.",
        tasks: [
            { id: 'ch4_inspect', text: 'Inspect Hydroponic Crop Beds in Greenhouse', done: false },
            { id: 'ch4_pump', text: 'Repair Irrigation Pump & Calibrate Nutrients', done: false },
            { id: 'ch4_power', text: 'Verify Greenhouse Power is ON & Balanced', done: false }
        ]
    },
    {
        id: 4,
        solRange: "Sol 17–24",
        solStart: 18,
        title: "CHAPTER 5: The Red Storm",
        story: "A major regional Martian dust storm rolls over Astra-1, slashing solar array output to 8 kW! Simultaneously, orbital satellites warn of a Solar Particle Event (SPE) spiking surface radiation to 2.40 mSv/h, and the outdoor Comms Antenna loses lock.",
        science: "Dust storms and Solar Particle Events are distinct hazards: dust blocks sunlight and visibility, while solar radiation events require immediate sheltering inside shielded central quarters.",
        dilemma: "Step outside through the Airlock in your EVA suit to secure the outdoor Solar Array latch before radiation peaks, switch on the Backup RTG/Generator, diagnose the Comms link from the Lab, and verify the Radiation Shelter protocol.",
        tasks: [
            { id: 'ch5_eva', text: 'EVA Outside: Secure Solar Array Latch on Mars Surface', done: false },
            { id: 'ch5_gen', text: 'Enable Backup Generator (+12 kW) in Power Grid', done: false },
            { id: 'ch5_comms', text: 'Reroute External Comms Antenna from Lab Console', done: false },
            { id: 'ch5_shelter', text: 'Activate Radiation Shelter Protocol in Crew Quarters', done: false }
        ]
    },
    {
        id: 5,
        solRange: "Sol 25–30",
        solStart: 28,
        title: "CHAPTER 6: The Last 18 Hours",
        story: "Three sols remain before the resupply lander arrives! The storm battered the external power conduit, the water recycler needs a final batch verification, and Mission Control requires a full Readiness Verification Report.",
        science: "Real spaceflight missions succeed through integrated systems engineering, redundancy, checklists, and calm prioritization of life-critical faults.",
        dilemma: "Restore the external Solar Array bus on the Mars surface, verify that net power is positive (>= 0 kW), confirm CO₂ (< 800 ppm) and Water purity (< 60 µS/cm), and transmit the Final Mission Readiness Report from the Lab!",
        tasks: [
            { id: 'ch6_solar', text: 'EVA Outside: Restore External Solar Conduit (28 kW)', done: false },
            { id: 'ch6_systems', text: 'Ensure Positive Power Balance & Healthy Life Support', done: false },
            { id: 'ch6_report', text: 'Transmit Final Mission Readiness Report (Lab Console)', done: false }
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

const DOORS = [
    { x: 266, y: 350, w: 10, h: 60, label: 'EVA Hatch' },
    { x: 416, y: 350, w: 10, h: 60, label: 'Inner Seal' },
    { x: 510, y: 246, w: 55, h: 10, label: 'Power Door' },
    { x: 750, y: 246, w: 55, h: 10, label: 'ECLSS Door' },
    { x: 510, y: 506, w: 55, h: 10, label: 'Water Door' },
    { x: 750, y: 506, w: 55, h: 10, label: 'Agro Door' },
    { x: 886, y: 270, w: 10, h: 55, label: 'Lab Door' },
    { x: 886, y: 425, w: 10, h: 55, label: 'Shelter Door' }
];

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

// UPGRADE 4: Task-to-Equipment Mapping for Junior Astronaut Waypoint Navigation
const TASK_OBJECT_MAP = {
    ch1_airlock: 'airlock_console',
    ch1_tool: 'storage_locker',
    ch1_power: 'power_console',
    ch1_life: 'co2_scrubber',
    ch2_diag: 'power_console',
    ch2_shed: 'power_console',
    ch2_repair: 'power_console',
    ch3_part: 'storage_locker',
    ch3_co2: 'co2_scrubber',
    ch3_water: 'water_recycler',
    ch4_inspect: 'greenhouse_console',
    ch4_pump: 'greenhouse_console',
    ch4_power: 'power_console',
    ch5_eva: 'solar_array_eva',
    ch5_gen: 'power_console',
    ch5_comms: 'lab_console',
    ch5_shelter: 'shelter_console',
    ch6_solar: 'solar_array_eva',
    ch6_systems: 'power_console',
    ch6_report: 'lab_console'
};

const CREW_NPCS = [
    {
        id: 'vance',
        name: 'Cmdr. Vance',
        x: 960, y: 240,
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
                text: 'Welcome to the Command Lab, Cadet Nova! As a Junior Astronaut on Astra-1, remember our golden rule: never guess which button to press. Read the kW, kPa, and ppm telemetry first.',
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
                text: 'Look at these hydroponic dwarf wheat and cherry tomato beds, Nova! Plants give us fresh nutrition and help revitalize oxygen—but my LED grow banks need 5 kW of power.',
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
                text: 'Mars has no thick atmosphere or global magnetic field like Earth. Notice these blue cylinders along our quarters wall? We surround the crew bunks with potable water tanks to block solar protons!',
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
            text: 'Touchdown confirmed at Arcadia Planitia, Mars. Welcome to the 2026 NASA Junior Astronaut Mission Trainer, Cadet Nova! All five crew members have survived entry, descent, and landing.',
            tradeoff: 'Mission Goal: Balance life support, radiation shielding, power, and food across 30 Martian sols.'
        },
        {
            speaker: 'Cmdr. Vance',
            role: 'Mission Commander',
            portrait: 'vance',
            text: 'Nova, look out the Cupola viewport at Earth—we are 225 million kilometers from home. Before we unpack our science experiments, we must verify the habitat is safe using our electronic checklists.',
            tradeoff: 'Astronauts never guess: we check pressure (101.3 kPa), power (kW), and oxygen before starting work.'
        },
        {
            speaker: 'Eng. Philip',
            role: 'Chief Engineer',
            portrait: 'philip',
            text: 'Heads up, team! Landing kicked up heavy regolith dust, and Solar Array 1 is showing voltage fluctuations. Nova, grab the Diagnostic Multi-Tool and spare HV Fuse from Central Storage right after you check the Airlock!',
            tradeoff: 'First Mission Task: Check Airlock -> Grab Tools in Storage -> Inspect Power & Life-Support consoles.'
        },
        {
            speaker: 'Cadet Nova (You)',
            role: 'Junior Astronaut',
            portrait: 'nova',
            text: 'Copy that, Commander Vance and Philip! I’m starting my walkaround inspection at the Airlock console right now.',
            tradeoff: 'Use WASD / Arrows or Click any room to walk. Press [E] near glowing consoles or crew members.'
        }
    ],
    1: [
        {
            speaker: 'Eng. Philip',
            role: 'Chief Engineer',
            portrait: 'philip',
            text: '🚨 Red Alert in the Power Room, Nova! Our solar generation just dropped to 18 kW, but the habitat is pulling 24 kW. That is a 6 kW power deficit—our battery bank is draining fast!',
            tradeoff: 'Engineering Dilemma: 18 kW Solar Output vs. 24 kW Habitat Load = -6 kW Deficit.'
        },
        {
            speaker: 'Dr. Elena Lin',
            role: 'Chief Botanist',
            portrait: 'lin',
            text: 'If we lose main bus power, the heaters and life-support fans will trip offline! You can temporarily shed the Science Lab (4 kW) or my Greenhouse LEDs (5 kW) in the Power Grid to save the battery.',
            tradeoff: 'A battery only buys time; it does not create energy. Shed non-essential loads while making repairs!'
        },
        {
            speaker: 'Cadet Nova (You)',
            role: 'Junior Astronaut',
            portrait: 'nova',
            text: 'I’ll inspect the Power Room telemetry first, shed non-essential loads in the Power Grid so we stop draining kWh reserves, and install the replacement HV Fuse to fix the blown junction!',
            tradeoff: 'Never shut off Primary Life Support (O₂ / CO₂ Scrubber) or CO₂ levels will spike!'
        }
    ],
    2: [
        {
            speaker: 'Dr. Maya Patel',
            role: 'Flight Surgeon',
            portrait: 'maya',
            text: 'Nova, I’m getting reports of crew headaches! Cabin Carbon Dioxide has climbed past 1,380 ppm because the primary LiOH scrubber cartridge in Life Support is saturated.',
            tradeoff: 'High CO₂ (ppm) becomes toxic long before oxygen runs out in a sealed spacecraft.'
        },
        {
            speaker: 'Eng. Philip',
            role: 'Chief Engineer',
            portrait: 'philip',
            text: 'And it gets worse—a pipe coupling in the Water-Recycling Room cracked! Greywater is contaminating our potable tank and spiking water conductivity to 185 µS/cm.',
            tradeoff: 'You can flip on the Backup CO₂ Scrubber immediately, but it costs +3 kW of extra electrical load!'
        },
        {
            speaker: 'Cadet Nova (You)',
            role: 'Junior Astronaut',
            portrait: 'nova',
            text: 'I’ll grab the LiOH CO₂ Filter and Pipe Seal Kit from the Maintenance Locker, replace the scrubber cartridge in Life Support, and seal the water pipe so conductivity drops below 60 µS/cm!',
            tradeoff: 'NASA’s ISS Water Recovery System verifies water purity via electrical conductivity (µS/cm).'
        }
    ],
    3: [
        {
            speaker: 'Dr. Elena Lin',
            role: 'Chief Botanist',
            portrait: 'lin',
            text: 'Nova, come quick to the Greenhouse Dome! Our packaged rations are down to 21 crew-days, and the hydroponic irrigation pump is cavitating—the dwarf wheat and tomato beds are wilting!',
            tradeoff: 'Long-duration Mars missions require bioregenerative food production to supplement packaged rations.'
        },
        {
            speaker: 'Cmdr. Vance',
            role: 'Mission Commander',
            portrait: 'vance',
            text: 'Here is the real astronaut trade-off, Nova: once you repair Dr. Lin’s irrigation pump, keeping the Greenhouse LEDs powered requires 5 kW continuously. Make sure our power budget can support it!',
            tradeoff: 'Greenhouse crops produce food and aid air revitalization, but demand steady water and 5 kW of power.'
        },
        {
            speaker: 'Cadet Nova (You)',
            role: 'Junior Astronaut',
            portrait: 'nova',
            text: 'On my way to the Greenhouse! I’ll inspect the root sensors, repair the impeller pump, calibrate the nutrient dosing, and verify the 5 kW LED array is switched ON.',
            tradeoff: 'Healthy crops require balanced PAR light, clean water (<60 µS/cm), nutrients, and 21°C temperature.'
        }
    ],
    4: [
        {
            speaker: 'ARIA • Shipboard AI',
            role: 'Orion / Astra-1 Telemetry AI',
            portrait: 'aria',
            text: 'EMERGENCY WARNING: Regional Martian dust storm enveloping Arcadia Planitia! Atmospheric opacity (Tau) has surged to 3.8, slashing solar output to 8 kW. Simultaneously, orbital sensors detect a Solar Particle Event (2.45 mSv/h)!',
            tradeoff: 'Key Science Distinction: Dust storms reduce solar power; Solar Particle Events cause radiation hazards!'
        },
        {
            speaker: 'Dr. Maya Patel',
            role: 'Flight Surgeon',
            portrait: 'maya',
            text: 'Nova! Put on your pressurized EVA suit, rush outside to lock down the Solar Array wind latches, and get back inside immediately so we can activate the Water-Wall Radiation Shelter in Crew Quarters!',
            tradeoff: 'Do not stay outdoors during a Solar Particle Event—ionizing radiation (mSv/h) damages cells!'
        },
        {
            speaker: 'Eng. Philip',
            role: 'Chief Engineer',
            portrait: 'philip',
            text: 'With solar down to 8 kW, you also MUST open the Power Grid and enable our Backup RTG/Fission Generator (+12 kW), then reroute the blown Comms Dish from the Lab!',
            tradeoff: 'NASA researches fission surface power for Mars because dust storms can last for weeks.'
        }
    ],
    5: [
        {
            speaker: 'Cmdr. Vance',
            role: 'Mission Commander',
            portrait: 'vance',
            text: 'This is it, Cadet Nova—the last 18 hours before the Sol 30 resupply lander arrives! The storm severed our external HV Solar Conduit outside and shook loose a water filter seal.',
            tradeoff: 'Final Integrated Test: Prioritize multiple faults across EVA Surface, Water Room, Power Grid, and Lab.'
        },
        {
            speaker: 'Cadet Nova (You)',
            role: 'Junior Astronaut',
            portrait: 'nova',
            text: 'We’ve come too far to fail now! I will go outside in my EVA suit to reconnect the 28 kW Solar Conduit, verify our water purity and positive kW power balance, and transmit the Final Mission Readiness Report!',
            tradeoff: 'Complete all final verifications to earn your Junior Astronaut Mission Certification!'
        }
    ]
};

