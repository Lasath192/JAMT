# 🚀 ASTRA-1: The Red Frontier — Game Overview & Current Status
**2026 NASA Space Apps Challenge Submission**  
*Junior Astronaut Mission Trainer (JAMT) — 378-Sol Mars Analog Campaign*

---

## 📌 Executive Summary

**ASTRA-1: The Red Frontier** is an authentic, educational, dual-engine (2.5D Isometric & 3D WebGL) space mission trainer designed for students (ages 7–12) and the general public. Players step into the boots of **Cadet Nova**, the junior astronaut aboard humanity's first 378-sol permanent Mars surface habitat in Arcadia Planitia (modeled after NASA's **CHAPEA Mars Dune Alpha** 3D-printed habitat).

Rather than multiple-choice trivia, *ASTRA-1* is a live systems-engineering simulation where players manage real telemetry: balancing kilowatts against life support loads, scrubbing rising $\text{CO}_2$ ppm, purifying graywater, inspecting solar arrays during Martian dust storms, deploying the *Perseverance* rover and *Ingenuity* helicopter, and surviving Solar Particle Events (SPE).

---

## 📊 Current Development Status

| Component | Status | Details |
| :--- | :--- | :--- |
| **Campaign Missions** | ✅ **100% Complete** | 10 full chapters spanning Sol 1 to Sol 378, each with 3–4 scripted objectives. |
| **Automated Test Suite** | ✅ **100% Passing** | `npm test` verifies all 10 missions, 20 interactive tasks, and Sol 378 victory debrief. |
| **Engines & Visuals** | ✅ **100% Functional** | Dual-engine: Custom 2.5D Canvas renderer + Three.js 3D WebGL renderer. |
| **Airlock & Spacesuit System** | ✅ **100% Functional** | 2-step console sequence (`🧑‍🚀 Suit Up` + `✅ Seal Check`), `[F]` key locked outer hatch, dynamic IVA vs. EVA suit rendering, auto-stow on return. |
| **Life & Hearts System** | ✅ **100% Functional** | 3-Heart (`❤️❤️❤️`) health system, floating damage text, screen shake, audio alerts, and Game Over modal with Retry. |
| **Emergency Timers** | ✅ **100% Functional** | 60s–75s ticking countdown bars during crisis missions with health penalty on expiration. |
| **Icon Inventory Pouch** | ✅ **100% Functional** | 36×36px visual badges with hover tooltips (`🔧`, `⚡`, `🫧`, `🚰`, `🪨`). |
| **10-Second Storm Dilemma** | ✅ **100% Functional** | Interactive critical choice: Fold panels (0 kW safe) vs. Leave open (keep power, conduit sever, -1 ❤️). |
| **Live Space Weather (DONKI)** | ✅ **100% Functional** | Live fetch from NASA DONKI Solar Flare API (`api.nasa.gov`) with offline historical fallback. |
| **Packaging & Deployment** | ✅ **100% Ready** | Standalone single-file bundle (`astra_1_the_red_frontier.html`), modular web app (`index.html`), Vercel-ready (`vercel.json`). |

---

## 🎮 Core Gameplay Mechanics

### 1. 3-Heart Life System (`❤️❤️❤️`)
- Cadet Nova has 3 hearts displayed prominently in the top HUD.
- **Heart Loss Triggers:**
  - Emergency task countdown timer running out.
  - Manually disabling essential life support or habitat heating in the Power Console.
  - Total depletion of battery power, oxygen/clean air, or potable water.
  - Making dangerous dilemma choices (e.g., leaving solar panels unlatched in severe dust storms).
- Reaching 0 hearts triggers the **Game Over Screen** with options to **Retry Mission** or **Restart Campaign**.

### 2. Physical Airlock & Suit Cycling Interlock
- Leaving the habitat requires following realistic safety protocols:
  1. Approach the **Airlock Console** and click `🧑‍🚀 1. Put On Spacesuit`. Nova changes into the golden EVA helmet and pressurized suit.
  2. Click `✅ 2. Check Suit & Airlock Seal` to verify 101.3 kPa differential pressure.
  3. Step to the outer hatch (`x = 278`) and press **`[F]`** (or tap the on-screen `[F] Door` button).
- The outer door is a solid physical collision wall if unsuited or unsealed. Stepping back inside (`x >= 415`) automatically re-seals the door and stows the heavy EVA suit.

### 3. Compounding Real-Time Telemetry Loop
The simulation recalculates resource flows every 1500ms:
- **⚡ Power (kW / kWh):** Solar arrays generate power based on Mars sun angle and dust storm optical depth ($\tau$). A 100 kWh battery bank buffers surpluses and deficits.
- **🫧 Atmosphere (O₂ & CO₂ ppm):** Crew respiration generates $\text{CO}_2$. If scrubbers clog, $\text{CO}_2$ compounds toward dangerous levels ($>2800\text{ ppm}$), causing headaches and system warnings.
- **💧 Clean Water (Liters & Conductivity):** Graywater recycling system purifies hygiene water into drinking water ($<15\text{ µS/cm}$).
- **🌱 Food & Biome:** Hydroponic grow trays produce dwarf wheat crops, boosting crew health.
- **🛡️ Radiation Shielding:** Regolith roof panels attenuate cosmic rays and solar flares ($0.08\text{ mSv/h}$ normal up to $2.45\text{ mSv/h}$ in solar storms).

### 4. Time-Based Emergency Countdown Timers
During high-stakes missions (Missions 4, 5, 6, 8, 9), an animated countdown bar ticks down in the checklist panel (60 to 75 seconds). Completing all mission objectives stops the timer; running out inflicts heart damage.

### 5. Mike Given's 10-Second Solar Panel Dust Storm Dilemma
A high-tension pop-up event where a sudden dust front approaches:
- **Option A (Safe):** Fold and lock solar arrays. Generation drops to 0 kW, but panels remain undamaged.
- **Option B (Risky):** Keep panels deployed to maintain power. A flying debris fragment severs a conduit, costing -1 ❤️ and requiring immediate EVA repairs.

### 6. Live NASA DONKI Space Weather Integration
A top-bar button (`🛰️ Weather`) allows students to ping NASA's live **DONKI (Space Weather Database Of Notifications, Knowledge, Information)** API to view real solar flare events from the Sun, with an instant offline fallback if without internet access.

---

## 🗺️ Habitat Layout (Arcadia Planitia Base)

```text
+-------------------------------------------------------------------------------------------------+
|                                          MARS SURFACE                                           |
|   [External Solar Array]          [Ingenuity Scout Drone]           [Perseverance Rover]        |
+-------------------------------------------------------------------------------------------------+
|   [1. AIRLOCK & SUIT BENCH]   |   [2. POWER ROOM]          |   [3. LIFE SUPPORT (ECLSS)]        |
|   - Outer Hatch ([F] to open) |   - Solar Array Telemetry  |   - Primary & Backup CO2 Scrubbers |
|   - Suit Bench & Seal Check   |   - HV Junction & Breakers |   - O2 Generator & LiOH Filters    |
+-------------------------------+----------------------------+------------------------------------+
|   [CENTRAL CORRIDOR / STORAGE]|   [4. WATER ROOM]          |   [5. GREENHOUSE DOME]             |
|   - Multi-Tools & Spare Fuses |   - Graywater Purifier     |   - Hydroponic Dwarf Wheat         |
|   - Pipe Sealants & LiOH      |   - Conductivity Sensors   |   - Automated Irrigation Pumps     |
+-------------------------------+----------------------------+------------------------------------+
|   [CREW QUARTERS]             |   [6. SCIENCE & COMMS]     |   [7. RADIATION SHELTER]           |
|   - Cmdr. Sarah Ross          |   - High-Gain Uplink       |   - High-Density Regolith Bunker   |
|   - Dr. Chen, Elena, Marcus   |   - 14-Minute Comms Delay  |   - Storm Emergency Bunks          |
+-------------------------------+----------------------------+------------------------------------+
```

---

## 📜 Full 10-Mission CHAPEA Analog Campaign

### 1. Mission 1: The First Breath (Sol 1–2)
- **Story:** Fresh touchdown on Mars. Cadet Nova inspects life-critical habitat systems.
- **Tasks:** Cycle airlock pressure, collect multi-tool, verify ECLSS $\text{CO}_2$ scrubber levels, uplink touchdown confirmation.

### 2. Mission 2: First Seeds in Red Soil (Sol 24–40)
- **Story:** Initiating the bioregenerative life support system in the greenhouse dome.
- **Tasks:** Check dwarf wheat trays, set PAR lighting to 5 kW, flush irrigation pump lines.

### 3. Mission 3: Commissioning Perseverance & Ingenuity (Sol 75–90)
- **Story:** First major surface excursion outside the habitat to interface with robotic precursors.
- **Tasks:** Suit up and check airlock seal, inspect Perseverance rover, reboot Ingenuity drone rotor telemetry.

### 4. Mission 4: The Rising Sky of Copper (Sol 130–145)
- **Story:** A localized dust storm reduces solar irradiance. Power budget drops critically.
- **Tasks:** Emergency 75s countdown timer. Shed non-essential lab loads, activate backup RTG fuel, inspect exterior dust wipers.

### 5. Mission 5: The Zero-Visibility EVA (Sol 190–205)
- **Story:** High winds sever a solar panel array high-voltage feeder cable.
- **Tasks:** Emergency 75s timer. Put on EVA suit, cycle outer airlock door, repair solar cable junction with spare fuse.

### 6. Mission 6: ECLSS Scrubber Saturation (Sol 250–265)
- **Story:** Carbon dioxide spikes to 1800 ppm after mechanical failure in primary amine beds.
- **Tasks:** Emergency 75s timer. Grab fresh LiOH canister from storage, replace saturated scrubber, verify $\text{CO}_2$ falls below 500 ppm.

### 7. Mission 7: The Jezero Delta Core Expedition (Sol 295–315)
- **Story:** Collecting astrobiological regolith core sample tubes from ancient river delta sediment.
- **Tasks:** Retrieve drill core sample from rover, insert into science Raman spectrometer, catalog mineral composition.

### 8. Mission 8: The Graywater Biofilm Crisis (Sol 330–345)
- **Story:** Bacterial biofilm clogs catalytic oxidizer filters in the water reclamation loop.
- **Tasks:** Emergency 75s timer. Collect pipe seal kit, cycle water purifier flush, verify conductivity drops below $15\text{ µS/cm}$.

### 9. Mission 9: Solar Particle Event — Code Red (Sol 360–370)
- **Story:** Live NASA DONKI alert detects an X-Class coronal mass ejection heading toward Mars. Radiation reaches $2.45\text{ mSv/h}$.
- **Tasks:** Emergency 60s timer. Sound habitat alarm, verify regolith storm shelter shielding, muster crew inside bunker.

### 10. Mission 10: The Return Window — Handover (Sol 375–378)
- **Story:** Sol 378 milestone. Crew prepares habitat for relief crew rotation and Earth return window.
- **Tasks:** Store science sample canisters in airlock vault, harvest mature greenhouse crops, transmit final 378-sol expedition logbook to NASA Houston.
- **Ending:** Sol 378 debrief modal calculates final rank (**Commander Tier**, **Officer Tier**, or **Specialist Tier**) with a **Printable NASA Junior Astronaut Certificate**.

---

## 🕹️ Controls Guide

| Input | Action | Notes |
| :--- | :--- | :--- |
| **`W`, `A`, `S`, `D`** / **Arrow Keys** | Walk / Move Nova | Smooth 8-directional movement with footstep audio |
| **Click / Tap Floor** | Click-to-Move | Mobile & tablet friendly waypoint navigation |
| **`E`** | Interact | Opens consoles, lockers, crew dialogues, sample tubes |
| **`F`** (or `[F] Door` button) | Cycle Outer Hatch | Opens/closes exterior airlock door when suited & sealed |
| **Pouch Icon Click** | Select Tool | Selects active inventory item |
| **HUD Badge Click** | Jargon Decoder | Explains complex terms (kW, kPa, ppm, mSv/h, Sol) |
| **`3D / 2D` Button** | Toggle View Mode | Switches instantly between 2.5D Isometric & 3D Walkthrough |
| **`🛰️ Weather` Button** | Live DONKI Weather | Queries live NASA solar flare feed |
| **`⚡ 10s Storm` Button** | Storm Dilemma | Triggers Mike Given's interactive dust storm choice |

---

## 🏗️ Technical Architecture & File Map

```text
JAMT/
├── index.html                   # Primary web application (modular mode)
├── astra_1_the_red_frontier.html # Standalone single-file bundle (offline ready)
├── build_standalone.js          # Inlines CSS and JS into single standalone file
├── server.js / server.py        # Local lightweight development servers
├── package.json                 # Scripts: start, test, check, bundle
├── vercel.json                  # Static hosting configuration for Vercel
├── js/
│   ├── chapters.js              # 10 CHAPEA mission definitions, tasks, dialogs
│   ├── simulation.js            # Telemetry loop, hearts, timers, resource calculations
│   ├── game.js                  # Player physics, collision, input handler, [F] hatch
│   ├── render.js                # 2.5D pseudo-isometric Canvas renderer
│   ├── render3d.js              # Three.js 3D WebGL renderer & scene manager
│   ├── ui.js                    # Modals, HUD, icon pouch, jargon decoder, DONKI
│   ├── soundfx.js               # Web Audio API procedural sound synthesizer
│   └── nasa_data.js             # Historical NASA datasets (DONKI, OSDR, Curiosity)
├── css/
│   └── style.css                # Retro sci-fi HUD styling, responsive layout, modals
└── test/
    └── test_tasks.js            # End-to-end headless automated test suite
```

---

## 🚀 How to Run the Game

### Option 1: Standalone Direct Launch (No installation required)
Double-click `astra_1_the_red_frontier.html` or `Run_Game.bat`. It opens directly in any web browser with zero server setup or internet connection needed.

### Option 2: Local Node.js Development Server
```bash
npm install
npm start
# Open http://localhost:3000 in your browser
```

### Option 3: Run the Verification Test Suite
```bash
npm test
# Verifies all 10 missions, task triggers, and debrief sequences
```

---

## 🌟 NASA Open Data Calibrations

1. **NASA CHAPEA (Crew Health & Performance Exploration Analog):**
   Habitat geometry, 4-person crew roles, 378-sol mission timeline, and psychological stress mechanics mirror the Johnson Space Center Mars Dune Alpha mission.
2. **NASA DONKI (Space Weather Database):**
   Real-time and historical solar proton events and CME data power the solar flare telemetry.
3. **Curiosity RAD (Radiation Assessment Detector):**
   Surface cosmic ray baseline ($0.08\text{ mSv/h}$) calibrated against Gale Crater surface readings.
4. **Perseverance MEDA (Mars Environmental Dynamics Analyzer):**
   Surface pressure ($0.6\text{ kPa}$) and atmospheric dust tau values calibrated against Jezero Crater weather data.
5. **NASA OSDR (Open Science Data Repository):**
   Dwarf wheat crop parameters, transpiration, and lighting spectrums reflect spaceflight biology experiments.

