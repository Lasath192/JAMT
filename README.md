# 🚀 ASTRA-1: The Red Frontier
### **2026 NASA Space Apps Challenge Submission**
**Challenge Category:** *"Build a Junior Astronaut Mission Trainer"*  
**Target Audience:** Junior Astronauts & Students (Ages 7–12) to General Public  
**Architecture:** Single-file zero-dependency HTML5 application (`index.html`)

---

## 🌟 Mission Overview

**ASTRA-1: The Red Frontier** is an authentic, educational 2.5D pseudo-isometric mission trainer where players step into the boots of **Cadet Nova**, the junior astronaut aboard humanity's first permanent Mars surface habitat in Arcadia Planitia (2048).

Rather than simplified trivia, *ASTRA-1* immerses students directly into real systems engineering trade-offs modeled after NASA's **Orion spacecraft**, the **International Space Station (ISS) Environmental Control and Life Support System (ECLSS)**, the **Curiosity RAD** instrument, and the **Perseverance MEDA** weather station.

Students must balance electrical generation against life-critical loads, scrub rising carbon dioxide levels before toxicity sets in, manage closed-loop hydroponics, suit up with proper airlock pressurization procedures, and navigate real space weather phenomena.

---

## 🔬 Core 2026 NASA Space Apps Upgrades

### 1. Official NASA Open Data Attribution
The mission parameters and environmental challenges are directly calibrated with real NASA datasets:
- **NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information):** The Chapter 5 Solar Particle Event (SPE) peaking at `2.45 mSv/h` is derived from historical Coronal Mass Ejections (CMEs) and solar proton flux events logged by NASA DONKI.
- **NASA OSDR (Open Science Data Repository):** Chapter 4's dwarf wheat transpiration rates, Photosynthetically Active Radiation (PAR) lighting draw (5 kW), and biological radiation countermeasures reflect plant research payloads in NASA's OSDR.
- **Curiosity RAD & Perseverance MEDA Instruments:** Mars surface ambient pressure (0.6 kPa), baseline cosmic radiation (0.08 mSv/h), and atmospheric dust storm optical depth ($\tau = 0.5 \text{ to } 3.8$) utilize real in-situ surface telemetry.
- **NASA Codex:** 11 discovered space science cards embedded directly in the mission terminal.

### 2. Kid-Friendly Jargon Decoder (Ages 7–12 Accessibility)
Complex telemetry units are decoded into relatable, plain-language concepts with a single click:
- **Sol:** A Martian day (24h 39m 35s)—explaining why astronauts get 39 bonus minutes of playtime every day.
- **kW (Kilowatts):** Power flow—analogized to water spraying from a garden hose or running microwave ovens.
- **kWh (Kilowatt-hours):** Stored energy—like a bucket of electricity holding power for the freezing Martian night.
- **kPa / CO₂ ppm:** Air pressure keeping blood liquid vs. invisible carbon dioxide molecules that cause headaches if not scrubbed.
- **µS/cm (Conductivity):** Water purity tested by electrical flow—pure drinking water doesn't conduct electricity well!
- **mSv/h (MilliSieverts/hour):** Cosmic radiation dose rate comparing normal surface background to intense solar storms.

### 3. Compounding Real-Time Telemetry & Finite Backup Fuel ("No Free Choices")
A background physics simulation models interconnected systems every 1500ms:
- **Dynamic Battery Buffering:** Net power deficits directly drain the 100 kWh battery bank; net surpluses recharge it.
- **Finite Backup RTG Fuel:** The emergency +12 kW backup generator consumes $0.25\text{ kg}$ of fuel per cycle from a finite $45\text{ kg}$ reserve, automatically cutting out when empty.
- **Compounding CO₂ Dynamics:** If primary life support is unpowered or clogged, $\text{CO}_2$ rises steadily toward hazardous levels ($2800\text{ ppm}$) and requires functional scrubbers to restore safe equilibrium ($415\text{ ppm}$).
- **Plumbing Failures:** Leaking pipes drain freshwater reserves unless actively repaired with seal kits.
- **Agricultural Life-Cycle:** Hydroponic grow banks consume water to produce crew food rations.

### 4. Junior Astronaut Waypoint Guide Arrow
A pulsing yellow directional compass arrow (`#fde047`) orbits Cadet Nova at a 34px radius, calculating vector trajectories to the active objective hardware console whenever distance exceeds 65px.

### 5. Replayable Space Weather Mutators & 14-Minute Comms Delay
- **Weather Scenario Mutator:** Allows players to test habitat resilience across three conditions:
  - *Standard NASA Baseline*
  - *DONKI X-Class Solar Max* (+2 kW solar, 1.65x radiation dose rate)
  - *Global Tau-4.5 Dust Storm* (-4 kW severe solar attenuation)
- **14-Minute Radio Delay Simulator:** Demonstrates speed-of-light electromagnetic propagation delay between Earth and Mars (~14 minutes one-way, 28 minutes round-trip), reinforcing why junior astronauts must master automated onboard procedures rather than relying on real-time Mission Control decisions.

---

## 🗺️ Habitat Layout (Arcadia Planitia Base)

```
+---------------------------------------------------------------------------------------+
|                                    MARS SURFACE                                       |
|  [External Solar Array]                  [Astra-1 Pressurized Rover]                  |
+---------------------------------------------------------------------------------------+
|  [1. AIRLOCK & SUIT BENCH]  |  [2. POWER ROOM]        |  [3. LIFE-SUPPORT ROOM]       |
|  - Pressure cycling seal    |  - Solar array telemetry|  - Primary & backup CO₂ scrub |
|  - IVA / EVA suit interlock |  - HV junction box      |  - O₂ processor & sensors     |
+-----------------------------+-------------------------+-------------------------------+
|  [CENTRAL SPINE & STORAGE]  |  [4. WATER ROOM]        |  [5. GREENHOUSE DOME]         |
|  - Multi-tools & spare fuses|  - Closed-loop purifier |  - Hydroponic dwarf wheat     |
|  - LiOH filters & pipe seals|  - Conductivity testing |  - Automated irrigation pump  |
+-----------------------------+-------------------------+-------------------------------+
|                             |  [6. SCIENCE & COMMS]   |  [7. RADIATION SHELTER]      |
|                             |  - UHF antenna reroute  |  - High-density storm bunker  |
|                             |  - Mission report uplink|  - Crew quarters & bunks      |
+-----------------------------+-------------------------+-------------------------------+
```

---

## 🎮 How to Play

### Controls
| Key / Input | Action |
| :--- | :--- |
| **`W`, `A`, `S`, `D`** or **Arrow Keys** | Walk / Move Cadet Nova |
| **Click / Tap on Floor** | Click-to-Walk navigation (mobile & tablet friendly) |
| **`E`** or **Click Floating Prompt** | Interact with consoles, tool lockers, and crew members |
| **`Esc`** | Close open modal terminals |
| **Telemetry Badges** | Click to open the Kid-Friendly Jargon Decoder |

### Mission Walkthrough (6 Chapters)
1. **Chapter 1: Arrival — A New World (Sol 01–02)**  
   Verify airlock pressures, collect diagnostic equipment, and conduct initial habitat diagnostics.
2. **Chapter 2: Power Down (Sol 03–06)**  
   Manage a 6 kW generation deficit by shedding non-essential lab loads and replacing a blown High-Voltage (HV) fuse.
3. **Chapter 3: Breath of Life (Sol 07–11)**  
   Service a clogged $\text{CO}_2$ scrubber using lithium hydroxide (LiOH) cassettes and patch a leaking potable water pipe.
4. **Chapter 4: Growing a Future (Sol 12–16)**  
   Repair an irrigation pump, calibrate nutrient conductivity, and balance greenhouse lighting.
5. **Chapter 5: The Red Storm (Sol 17–24)**  
   Conduct an EVA to latch external solar arrays, fire up the emergency generator, and execute radiation shelter protocols.
6. **Chapter 6: The Last 18 Hours (Sol 25–30)**  
   Restore full-array conduits, confirm all life-support equilibrium metrics, and transmit the final mission certification report.

---

## 🛠️ Technology Stack

- **Graphics Engine:** Custom 2.5D pseudo-isometric volumetric canvas engine with dynamic depth sorting, drop shadows, and procedural Martian dust atmospheric effects.
- **Audio Architecture:** Procedural Web Audio API sound synthesizer (`SoundFX`) producing real-time retro telemetry beeps, airlock pressure cycling, low-frequency habitat hum, and alarm sirens—without external audio files.
- **Styling & UI:** Tailwind CSS with HUD sci-fi glassmorphism and FontAwesome vector iconography.
- **Portability:** 100% self-contained in `index.html` (runs in any modern desktop, tablet, or mobile browser without installation, build tools, or web servers).

---

## 🚀 Live Demo & Local Execution

### Run Locally:
Simply open `index.html` in any web browser:
```bash
# On Windows PowerShell:
Start-Process index.html

# On macOS:
open index.html

# On Linux:
xdg-open index.html
```

### Deploy to GitHub Pages:
1. Go to repository **Settings** > **Pages**.
2. Select **Source:** `Deploy from a branch`.
3. Choose branch **`main`** and folder **`/ (root)`**.
4. Click **Save**—the game is live instantly!

---

*Developed for the 2026 NASA Space Apps Challenge.*

