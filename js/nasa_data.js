/**
 * ASTRA-1: The Red Frontier - NASA Open Science Database & Educational Jargon Decoder
 * 2026 NASA Space Apps Challenge
 */

const SPACE_FACTS = {
    orion_checklists: {
        title: "Electronic Procedures & Telemetry",
        text: "NASA's Orion spacecraft uses electronic procedures and automated environmental monitoring so crews can verify cabin pressure and system health systematically rather than guessing."
    },
    mars_power: {
        title: "Martian Surface Power & Battery Buffering",
        text: "A battery buys time; it does not create energy. Because Mars receives less sunlight than Earth and experiences dust accumulation, NASA researches fission surface power alongside solar arrays."
    },
    co2_scrubbing: {
        title: "Carbon Dioxide Removal (ECLSS)",
        text: "Exhaled CO₂ becomes toxic long before oxygen runs out. Spacecraft life-support systems continuously scrub CO₂ to keep partial pressure and ppm within safe crew limits."
    },
    water_recovery: {
        title: "Closed-Loop Water Recycling & Conductivity",
        text: "Aboard the ISS, NASA's Environmental Control and Life Support System recovers over 90% of water. Sensors measure electrical conductivity (µS/cm) to verify ionic purity before astronauts drink it."
    },
    hydroponics: {
        title: "Controlled Environment Agriculture",
        text: "Growing crops on Mars supplements packaged food, recycles water through transpiration, and boosts crew morale—but LED grow banks and pumps require significant electrical power."
    },
    dust_vs_radiation: {
        title: "Dust Storms vs. Solar Particle Events",
        text: "Martian dust storms reduce visibility and solar output, whereas Solar Particle Events (SPE) pose an acute ionizing radiation hazard (mSv/h) requiring crews to shelter inside high-mass central modules."
    },
    airlock_pressure: {
        title: "Martian Atmospheric Pressure",
        text: "Mars surface pressure averages ~0.6 kPa (less than 1% of Earth's 101.3 kPa). Astronauts must cycle airlocks and wear pressurized EVA suits before stepping outside."
    },
    redundancy: {
        title: "Integrated Systems & Redundancy",
        text: "Every habitat subsystem is interconnected: power drives water pumps and CO₂ scrubbers, water feeds crops and cooling, and checklists let astronauts prioritize faults under pressure."
    },
    nasa_donki: {
        title: "NASA DONKI (Space Weather Database)",
        text: "Chapter 5's Solar Particle Event (2.45 mSv/h spike) is modeled on archived Coronal Mass Ejection (CME) and SEP proton flux events logged in NASA's Space Weather Database Of Notifications, Knowledge, Information (DONKI)."
    },
    nasa_osdr: {
        title: "NASA OSDR (Open Science Data Repository)",
        text: "Chapter 4's hydroponic PAR lighting (5 kW), dwarf wheat transpiration, and astronaut radiation dosimetry responses are grounded in biological payloads from NASA's Open Science Data Repository (OSDR)."
    },
    nasa_curiosity_meda: {
        title: "Curiosity RAD & Perseverance MEDA Data",
        text: "Astra-1's 0.6 kPa exterior pressure, 0.08 mSv/h baseline radiation, and dust storm optical depth (Tau 0.5 to 3.8) use real Martian surface measurements from Curiosity's RAD and Perseverance's MEDA instruments."
    }
};

const BADGES = [
    { id: 'power_saver', name: 'Power Saver', icon: 'fa-bolt', desc: 'Balanced habitat electrical loads and eliminated power deficit.' },
    { id: 'air_guardian', name: 'Air Guardian', icon: 'fa-lungs', desc: 'Restored CO₂ scrubbing and maintained safe cabin atmosphere.' },
    { id: 'water_wizard', name: 'Water Wizard', icon: 'fa-droplet', desc: 'Repaired plumbing leaks and verified <50 µS/cm potable water.' },
    { id: 'storm_survivor', name: 'Storm Survivor', icon: 'fa-shield-halved', desc: 'Protected the crew through the Sol 17-24 Red Storm and SPE alert.' }
];

const JARGON_DECODER = {
    sol: "JARGON DECODER: 'Sol' is a Martian day! Mars spins slightly slower than Earth, so a Sol lasts 24 hours, 39 minutes, and 35 seconds—giving you 39 extra minutes of playtime each day!",
    power: "JARGON DECODER: 'kW' stands for Kilowatts! That's electrical power flow—like how fast water sprays from a garden hose. 1 kW can power a microwave oven. On Mars, our solar panels make power, while life support and heaters consume it!",
    battery: "JARGON DECODER: 'kWh' stands for Kilowatt-hours! It measures stored energy inside our big lithium-ion battery banks—like water stored inside a bucket. During dark Martian nights, we survive on these stored kilowatt-hours!",
    atmo: "JARGON DECODER: 'kPa' is air pressure (kilopascals) keeping your blood liquid, and 'ppm' is parts-per-million of Carbon Dioxide (CO₂)! If CO₂ goes over 1000 ppm, astronauts get headaches. We scrub it out to keep the air fresh!",
    water: "JARGON DECODER: 'L' is Litres of water, and 'µS/cm' (microSiemens) checks purity! Fresh distilled water doesn't conduct electricity well (<50 µS/cm). High numbers mean salt, dirt, or pipe rust leaked into your drinking water!",
    env: "JARGON DECODER: 'Food (d)' is crew food rations left in days, and 'mSv/h' (milliSieverts per hour) measures cosmic radiation! Normal Mars surface radiation is ~0.08 mSv/h, but dangerous solar storms can spike it 30 times higher!"
};

const WEATHER_MODES = [
    { id: 'baseline', label: 'NASA Baseline', solarDelta: 0, radMult: 1.0, desc: 'Standard NASA Baseline restored. Atmospheric optical depth and radiation normalized.' },
    { id: 'solar_max', label: 'DONKI Solar Max', solarDelta: 2, radMult: 1.65, desc: "DONKI X-Class Solar Max active! Coronal Mass Ejection proton flux detected. Solar arrays produce +2 kW, but surface radiation spikes by 1.65x!" },
    { id: 'dust_storm', label: 'Tau-4.5 Dust Storm', solarDelta: -4, radMult: 1.0, desc: "Global Tau-4.5 Dust Storm active! Fine airborne hematite dust blocks sunlight. Solar array output reduced by -4 kW!" }
];
