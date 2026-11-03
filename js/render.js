/**
 * ASTRA-1: The Red Frontier - 2.5D Volumetric Canvas & Vector SVG Rendering Engine
 * 2026 NASA Space Apps Challenge
 */

// --- 3D-SHADED CHARACTER PORTRAIT SVG GENERATOR ---
function getCharacterPortraitSVG(portraitId) {
    const portraits = {
        nova: `
        <svg viewBox="0 0 100 100" class="w-full h-full">
            <defs>
                <radialGradient id="bgNova" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stop-color="#0ea5e9"/><stop offset="100%" stop-color="#0f172a"/>
                </radialGradient>
                <linearGradient id="suitNova" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#fb923c"/><stop offset="50%" stop-color="#ea580c"/><stop offset="100%" stop-color="#9a3412"/>
                </linearGradient>
                <radialGradient id="faceNova" cx="45%" cy="40%" r="55%">
                    <stop offset="0%" stop-color="#ffedd5"/><stop offset="70%" stop-color="#fdba74"/><stop offset="100%" stop-color="#c2410c"/>
                </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#bgNova)"/>
            <circle cx="80" cy="22" r="18" fill="#2563eb" opacity="0.55"/>
            <path d="M70,16 Q80,12 88,22 Q82,32 72,28 Z" fill="#4ade80" opacity="0.5"/>
            <path d="M12,100 C15,72 85,72 88,100 Z" fill="url(#suitNova)" stroke="#fed7aa" stroke-width="1.5"/>
            <ellipse cx="50" cy="76" rx="22" ry="6" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
            <circle cx="50" cy="48" r="29" fill="none" stroke="#e2e8f0" stroke-width="3.5" opacity="0.85"/>
            <circle cx="50" cy="49" r="20" fill="url(#faceNova)"/>
            <path d="M30,46 C30,26 70,26 70,46 C65,36 35,36 30,46 Z" fill="#7c2d12"/>
            <ellipse cx="43" cy="48" rx="2.5" ry="3" fill="#0f172a"/>
            <circle cx="42" cy="47" r="1" fill="#fff"/>
            <ellipse cx="57" cy="48" rx="2.5" ry="3" fill="#0f172a"/>
            <circle cx="56" cy="47" r="1" fill="#fff"/>
            <path d="M44,57 Q50,62 56,57" fill="none" stroke="#7c2d12" stroke-width="2" stroke-linecap="round"/>
            <path d="M26,38 Q50,22 74,38" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.55"/>
        </svg>`,
        vance: `
        <svg viewBox="0 0 100 100" class="w-full h-full">
            <defs>
                <radialGradient id="bgVance" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stop-color="#1d4ed8"/><stop offset="100%" stop-color="#090d16"/>
                </radialGradient>
                <linearGradient id="suitVance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0369a1"/>
                </linearGradient>
                <radialGradient id="faceVance" cx="45%" cy="40%" r="55%">
                    <stop offset="0%" stop-color="#ffedd5"/><stop offset="75%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#92400e"/>
                </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#bgVance)"/>
            <path d="M12,100 C16,72 84,72 88,100 Z" fill="url(#suitVance)" stroke="#bae6fd" stroke-width="1.5"/>
            <rect x="38" y="80" width="24" height="10" rx="2" fill="#facc15"/>
            <circle cx="50" cy="48" r="21" fill="url(#faceVance)"/>
            <path d="M29,42 C30,24 70,24 71,42 C64,33 36,33 29,42 Z" fill="#fef08a"/>
            <rect x="36" y="43" width="28" height="7" rx="3" fill="#0284c7" opacity="0.85" stroke="#7dd3fc" stroke-width="1"/>
            <path d="M44,58 L56,58" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M29,48 Q26,58 42,60" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
            <circle cx="42" cy="60" r="2.5" fill="#38bdf8"/>
        </svg>`,
        philip: `
        <svg viewBox="0 0 100 100" class="w-full h-full">
            <defs>
                <radialGradient id="bgPhil" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stop-color="#b45309"/><stop offset="100%" stop-color="#0c0a09"/>
                </radialGradient>
                <linearGradient id="helmPhil" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
                <linearGradient id="visorPhil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#67e8f9"/><stop offset="50%" stop-color="#0284c7"/><stop offset="100%" stop-color="#1e3a8a"/>
                </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#bgPhil)"/>
            <path d="M10,100 C15,70 85,70 90,100 Z" fill="#9a3412" stroke="#f97316" stroke-width="2"/>
            <circle cx="50" cy="48" r="25" fill="url(#helmPhil)" stroke="#94a3b8" stroke-width="2"/>
            <rect x="31" y="36" width="38" height="22" rx="9" fill="url(#visorPhil)" stroke="#bae6fd" stroke-width="1.5"/>
            <path d="M36,41 L52,41" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
            <rect x="38" y="49" width="10" height="3" fill="#fde047"/>
            <rect x="52" y="49" width="10" height="3" fill="#22c55e"/>
        </svg>`,
        lin: `
        <svg viewBox="0 0 100 100" class="w-full h-full">
            <defs>
                <radialGradient id="bgLin" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stop-color="#15803d"/><stop offset="100%" stop-color="#052e16"/>
                </radialGradient>
                <linearGradient id="suitLin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#15803d"/>
                </linearGradient>
                <radialGradient id="faceLin" cx="45%" cy="40%" r="55%">
                    <stop offset="0%" stop-color="#fff7ed"/><stop offset="75%" stop-color="#fed7aa"/><stop offset="100%" stop-color="#c2410c"/>
                </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#bgLin)"/>
            <path d="M14,100 C18,73 82,73 86,100 Z" fill="url(#suitLin)" stroke="#bbf7d0" stroke-width="1.5"/>
            <path d="M25,52 C22,22 78,22 75,52 L78,70 L22,70 Z" fill="#c2410c"/>
            <circle cx="50" cy="49" r="19" fill="url(#faceLin)"/>
            <path d="M28,45 C32,26 68,26 72,45 C62,34 38,34 28,45 Z" fill="#ea580c"/>
            <circle cx="43" cy="48" r="2.3" fill="#064e3b"/>
            <circle cx="57" cy="48" r="2.3" fill="#064e3b"/>
            <path d="M44,56 Q50,61 56,56" fill="none" stroke="#9a3412" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
        maya: `
        <svg viewBox="0 0 100 100" class="w-full h-full">
            <defs>
                <radialGradient id="bgMaya" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stop-color="#7e22ce"/><stop offset="100%" stop-color="#1e1b4b"/>
                </radialGradient>
                <linearGradient id="suitMaya" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#c084fc"/><stop offset="100%" stop-color="#6b21a8"/>
                </linearGradient>
                <radialGradient id="faceMaya" cx="45%" cy="40%" r="55%">
                    <stop offset="0%" stop-color="#fed7aa"/><stop offset="75%" stop-color="#d97706"/><stop offset="100%" stop-color="#78350f"/>
                </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#bgMaya)"/>
            <path d="M14,100 C18,73 82,73 86,100 Z" fill="url(#suitMaya)" stroke="#e9d5ff" stroke-width="1.5"/>
            <circle cx="50" cy="49" r="19" fill="url(#faceMaya)"/>
            <path d="M29,48 C29,24 71,24 71,48 C65,34 35,34 29,48 Z" fill="#1e293b"/>
            <circle cx="43" cy="48" r="2.3" fill="#0f172a"/>
            <circle cx="57" cy="48" r="2.3" fill="#0f172a"/>
            <path d="M45,57 Q50,60 55,57" fill="none" stroke="#451a03" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
        aria: `
        <svg viewBox="0 0 100 100" class="w-full h-full">
            <defs>
                <radialGradient id="bgAria" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stop-color="#22d3ee"/><stop offset="60%" stop-color="#0284c7"/><stop offset="100%" stop-color="#082f49"/>
                </radialGradient>
            </defs>
            <rect width="100" height="100" fill="#040d1a"/>
            <circle cx="50" cy="50" r="38" fill="none" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="6 4"/>
            <circle cx="50" cy="50" r="28" fill="url(#bgAria)"/>
            <ellipse cx="50" cy="50" rx="34" ry="12" fill="none" stroke="#67e8f9" stroke-width="2" transform="rotate(-25 50 50)"/>
            <ellipse cx="50" cy="50" rx="34" ry="12" fill="none" stroke="#38bdf8" stroke-width="2" transform="rotate(35 50 50)"/>
            <circle cx="50" cy="50" r="9" fill="#ffffff"/>
        </svg>`
    };
    return portraits[portraitId] || portraits.nova;
}

// --- 3D-SHADED SCENE BANNER GENERATOR FOR CHAPTERS & BRIEFINGS ---
function getChapterSceneSVG(chapterIdx) {
    if (chapterIdx === 0) {
        return `
        <svg viewBox="0 0 600 180" class="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id="marsSky3D" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#030712"/>
                    <stop offset="45%" stop-color="#1e1b4b"/>
                    <stop offset="75%" stop-color="#7c2d12"/>
                    <stop offset="100%" stop-color="#c2410c"/>
                </linearGradient>
                <radialGradient id="earth3D" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stop-color="#93c5fd"/>
                    <stop offset="45%" stop-color="#2563eb"/>
                    <stop offset="85%" stop-color="#1e3a8a"/>
                    <stop offset="100%" stop-color="#090d16"/>
                </radialGradient>
                <radialGradient id="domeGlass3D" cx="35%" cy="25%" r="70%">
                    <stop offset="0%" stop-color="rgba(255,255,255,0.55)"/>
                    <stop offset="40%" stop-color="rgba(56,189,248,0.25)"/>
                    <stop offset="85%" stop-color="rgba(14,116,144,0.45)"/>
                    <stop offset="100%" stop-color="rgba(15,23,42,0.85)"/>
                </radialGradient>
                <linearGradient id="habMetal3D" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#f8fafc"/>
                    <stop offset="45%" stop-color="#94a3b8"/>
                    <stop offset="85%" stop-color="#475569"/>
                    <stop offset="100%" stop-color="#1e293b"/>
                </linearGradient>
            </defs>
            <rect width="600" height="180" fill="url(#marsSky3D)"/>
            <circle cx="50" cy="20" r="1.2" fill="#fff" opacity="0.8"/>
            <circle cx="145" cy="14" r="1.5" fill="#bae6fd"/>
            <circle cx="280" cy="24" r="1" fill="#fff"/>
            <circle cx="480" cy="18" r="1.4" fill="#fde047"/>
            <circle cx="105" cy="42" r="28" fill="#38bdf8" opacity="0.2"/>
            <circle cx="105" cy="42" r="22" fill="url(#earth3D)"/>
            <path d="M92,32 Q105,26 115,38 Q110,52 95,48 Z" fill="#4ade80" opacity="0.75"/>
            <path d="M90,28 A22,22 0 0,1 122,32" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.6"/>
            <polygon points="0,105 95,68 210,98 340,62 470,95 600,72 600,180 0,180" fill="#7c2d12"/>
            <polygon points="95,68 155,98 95,105" fill="#9a3412" opacity="0.7"/>
            <polygon points="340,62 415,95 340,105" fill="#b45309" opacity="0.65"/>
            <rect x="0" y="102" width="600" height="78" fill="#9a3412"/>
            <ellipse cx="300" cy="155" rx="280" ry="35" fill="#c2410c"/>
            <ellipse cx="155" cy="138" rx="75" ry="20" fill="rgba(0,0,0,0.45)"/>
            <path d="M85,134 A70,64 0 0,1 225,134 Z" fill="url(#domeGlass3D)" stroke="#bae6fd" stroke-width="1.5"/>
            <circle cx="130" cy="122" r="14" fill="#15803d"/>
            <circle cx="180" cy="120" r="16" fill="#16a34a"/>
            <circle cx="155" cy="126" r="9" fill="#fde047"/>
            <path d="M83,134 Q155,148 227,134 L224,142 Q155,156 86,142 Z" fill="url(#habMetal3D)"/>
            <ellipse cx="445" cy="138" rx="115" ry="16" fill="rgba(0,0,0,0.5)"/>
            <rect x="340" y="88" width="205" height="46" rx="18" fill="url(#habMetal3D)" stroke="#334155" stroke-width="1.5"/>
            <rect x="385" y="86" width="8" height="50" rx="3" fill="#64748b"/>
            <rect x="445" y="86" width="8" height="50" rx="3" fill="#64748b"/>
            <rect x="505" y="86" width="8" height="50" rx="3" fill="#64748b"/>
            <rect x="404" y="102" width="26" height="16" rx="4" fill="#fef08a" stroke="#0ea5e9" stroke-width="1.5"/>
            <rect x="464" y="102" width="26" height="16" rx="4" fill="#fef08a" stroke="#0ea5e9" stroke-width="1.5"/>
            <circle cx="285" cy="135" r="8" fill="#f8fafc"/>
            <circle cx="287" cy="135" r="5" fill="#d97706"/>
            <rect x="278" y="143" width="14" height="20" rx="4" fill="#ea580c"/>
        </svg>`;
    } else if (chapterIdx === 1) {
        return `
        <svg viewBox="0 0 600 180" class="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
                <radialGradient id="reactorGlow" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stop-color="rgba(249,115,22,0.55)"/>
                    <stop offset="60%" stop-color="rgba(234,88,12,0.15)"/>
                    <stop offset="100%" stop-color="rgba(15,23,42,0)"/>
                </radialGradient>
                <linearGradient id="steelCyl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#e2e8f0"/>
                    <stop offset="35%" stop-color="#64748b"/>
                    <stop offset="80%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#090d16"/>
                </linearGradient>
                <linearGradient id="orangeCoil" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#9a3412"/>
                    <stop offset="50%" stop-color="#fb923c"/>
                    <stop offset="100%" stop-color="#7c2d12"/>
                </linearGradient>
            </defs>
            <rect width="600" height="180" fill="#070b14"/>
            <polygon points="0,120 600,120 600,180 0,180" fill="#0f172a"/>
            <path d="M0,135 H600 M0,155 H600 M0,175 H600 M100,120 L40,180 M220,120 L190,180 M350,120 L350,180 M480,120 L520,180" stroke="#1e293b" stroke-width="2"/>
            <circle cx="195" cy="95" r="95" fill="url(#reactorGlow)"/>
            <rect x="95" y="42" width="175" height="96" rx="14" fill="url(#steelCyl)" stroke="#475569" stroke-width="2"/>
            <rect x="115" y="34" width="22" height="112" rx="6" fill="url(#orangeCoil)"/>
            <rect x="170" y="34" width="22" height="112" rx="6" fill="url(#orangeCoil)"/>
            <rect x="225" y="34" width="22" height="112" rx="6" fill="url(#orangeCoil)"/>
            <rect x="145" y="68" width="72" height="36" rx="6" fill="#0284c7" stroke="#7dd3fc" stroke-width="2"/>
            <circle cx="181" cy="86" r="11" fill="#e0f2fe"/>
            <rect x="315" y="64" width="160" height="82" rx="22" fill="url(#steelCyl)" stroke="#38bdf8" stroke-width="2"/>
            <circle cx="440" cy="105" r="28" fill="#090d16" stroke="#94a3b8" stroke-width="5"/>
            <circle cx="440" cy="105" r="12" fill="#38bdf8"/>
            <rect x="335" y="82" width="65" height="20" rx="4" fill="#0284c7"/>
            <rect x="335" y="110" width="28" height="16" rx="3" fill="#ef4444"/>
        </svg>`;
    } else if (chapterIdx === 2) {
        return `
        <svg viewBox="0 0 600 180" class="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id="waterTank3D" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#0c4a6e"/>
                    <stop offset="40%" stop-color="#38bdf8"/>
                    <stop offset="80%" stop-color="#0284c7"/>
                    <stop offset="100%" stop-color="#082f49"/>
                </linearGradient>
                <linearGradient id="scrubTank3D" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#134e4a"/>
                    <stop offset="45%" stop-color="#2dd4bf"/>
                    <stop offset="100%" stop-color="#042f2e"/>
                </linearGradient>
            </defs>
            <rect width="600" height="180" fill="#06121c"/>
            <rect x="75" y="38" width="75" height="110" rx="22" fill="url(#scrubTank3D)" stroke="#5eead4" stroke-width="2"/>
            <rect x="175" y="38" width="75" height="110" rx="22" fill="url(#scrubTank3D)" stroke="#f59e0b" stroke-width="2"/>
            <rect x="335" y="28" width="65" height="122" rx="16" fill="url(#waterTank3D)" stroke="#bae6fd" stroke-width="2"/>
            <rect x="425" y="28" width="65" height="122" rx="16" fill="url(#waterTank3D)" stroke="#bae6fd" stroke-width="2"/>
            <rect x="250" y="92" width="280" height="16" fill="#64748b"/>
            <circle cx="305" cy="84" r="14" fill="rgba(56,189,248,0.4)"/>
            <circle cx="298" cy="72" r="5" fill="#bae6fd"/>
            <circle cx="314" cy="68" r="4" fill="#7dd3fc"/>
        </svg>`;
    } else if (chapterIdx === 3) {
        return `
        <svg viewBox="0 0 600 180" class="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
                <radialGradient id="growGlow" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stop-color="rgba(250,204,21,0.35)"/>
                    <stop offset="50%" stop-color="rgba(34,197,94,0.2)"/>
                    <stop offset="100%" stop-color="rgba(5,46,22,0.95)"/>
                </radialGradient>
            </defs>
            <rect width="600" height="180" fill="#041f14"/>
            <rect width="600" height="180" fill="url(#growGlow)"/>
            <rect x="65" y="42" width="205" height="105" rx="10" fill="#1e293b" stroke="#4ade80" stroke-width="2"/>
            <rect x="75" y="50" width="185" height="6" rx="3" fill="#fef08a"/>
            <circle cx="110" cy="82" r="18" fill="#16a34a"/><circle cx="115" cy="76" r="10" fill="#4ade80"/>
            <circle cx="168" cy="82" r="18" fill="#16a34a"/><circle cx="172" cy="76" r="10" fill="#4ade80"/>
            <circle cx="225" cy="82" r="18" fill="#16a34a"/><circle cx="228" cy="76" r="10" fill="#4ade80"/>
            <circle cx="105" cy="80" r="4" fill="#ef4444"/><circle cx="175" cy="85" r="4" fill="#ef4444"/>
            <rect x="325" y="42" width="205" height="105" rx="10" fill="#1e293b" stroke="#4ade80" stroke-width="2"/>
            <rect x="335" y="50" width="185" height="6" rx="3" fill="#fef08a"/>
            <circle cx="370" cy="82" r="18" fill="#15803d"/><circle cx="375" cy="76" r="10" fill="#22c55e"/>
            <circle cx="428" cy="82" r="18" fill="#15803d"/><circle cx="432" cy="76" r="10" fill="#22c55e"/>
            <circle cx="485" cy="82" r="18" fill="#15803d"/><circle cx="488" cy="76" r="10" fill="#22c55e"/>
        </svg>`;
    } else if (chapterIdx === 4) {
        return `
        <svg viewBox="0 0 600 180" class="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id="stormSky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#450a0a"/>
                    <stop offset="50%" stop-color="#9a3412"/>
                    <stop offset="100%" stop-color="#ea580c"/>
                </linearGradient>
            </defs>
            <rect width="600" height="180" fill="url(#stormSky)"/>
            <path d="M0,28 Q160,5 320,35 T600,20" fill="none" stroke="#c084fc" stroke-width="8" opacity="0.5"/>
            <path d="M0,85 Q200,45 400,95 T600,75" fill="none" stroke="#fdba74" stroke-width="24" opacity="0.25"/>
            <rect x="55" y="45" width="130" height="88" rx="28" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
            <rect x="98" y="72" width="44" height="56" rx="6" fill="#334155"/>
            <rect x="255" y="92" width="145" height="52" rx="12" fill="#c2410c" stroke="#fed7aa" stroke-width="2"/>
            <rect x="270" y="100" width="60" height="26" rx="6" fill="#0284c7"/>
            <circle cx="280" cy="148" r="14" fill="#0f172a" stroke="#94a3b8" stroke-width="4"/>
            <circle cx="328" cy="148" r="14" fill="#0f172a" stroke="#94a3b8" stroke-width="4"/>
            <circle cx="376" cy="148" r="14" fill="#0f172a" stroke="#94a3b8" stroke-width="4"/>
        </svg>`;
    } else {
        return getSol30TouchdownSVG();
    }
}

// --- SOL 30 TOUCHDOWN & RESUPPLY LANDER SVG SCENE ---
function getSol30TouchdownSVG() {
    return `
    <svg viewBox="0 0 600 200" class="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="tdSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#020617"/>
                <stop offset="35%" stop-color="#0f172a"/>
                <stop offset="65%" stop-color="#431407"/>
                <stop offset="85%" stop-color="#9a3412"/>
                <stop offset="100%" stop-color="#ea580c"/>
            </linearGradient>
            <radialGradient id="tdEarth" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#bae6fd"/>
                <stop offset="30%" stop-color="#38bdf8"/>
                <stop offset="70%" stop-color="#1d4ed8"/>
                <stop offset="100%" stop-color="#0f172a"/>
            </radialGradient>
            <radialGradient id="tdRetroPlume" cx="50%" cy="10%" r="90%">
                <stop offset="0%" stop-color="#ffffff"/>
                <stop offset="25%" stop-color="#67e8f9"/>
                <stop offset="55%" stop-color="#f59e0b"/>
                <stop offset="85%" stop-color="#ea580c"/>
                <stop offset="100%" stop-color="rgba(154,52,18,0)"/>
            </radialGradient>
            <radialGradient id="tdDust" cx="50%" cy="60%" r="50%">
                <stop offset="0%" stop-color="rgba(251,146,60,0.6)"/>
                <stop offset="60%" stop-color="rgba(194,65,12,0.3)"/>
                <stop offset="100%" stop-color="rgba(67,20,7,0)"/>
            </radialGradient>
            <linearGradient id="tdLanderHull" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ffffff"/>
                <stop offset="45%" stop-color="#cbd5e1"/>
                <stop offset="70%" stop-color="#64748b"/>
                <stop offset="100%" stop-color="#1e293b"/>
            </linearGradient>
            <linearGradient id="tdGoldFoil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#fef08a"/>
                <stop offset="50%" stop-color="#eab308"/>
                <stop offset="100%" stop-color="#854d0e"/>
            </linearGradient>
        </defs>

        <!-- Sky & Stars -->
        <rect width="600" height="200" fill="url(#tdSky)"/>
        <g fill="#ffffff">
            <circle cx="35" cy="18" r="1" opacity="0.8"/><circle cx="75" cy="42" r="1.5" opacity="0.9"/>
            <circle cx="120" cy="15" r="0.8" opacity="0.6"/><circle cx="165" cy="35" r="1.2" opacity="0.7"/>
            <circle cx="210" cy="20" r="1" opacity="0.8"/><circle cx="280" cy="12" r="1.4" opacity="0.9"/>
            <circle cx="340" cy="28" r="0.8" opacity="0.7"/><circle cx="490" cy="16" r="1.2" opacity="0.8"/>
            <circle cx="530" cy="38" r="1" opacity="0.9"/><circle cx="575" cy="22" r="1.5" opacity="0.85"/>
        </g>

        <!-- Earth & Moon in Mars Horizon Sky -->
        <circle cx="85" cy="40" r="14" fill="url(#tdEarth)"/>
        <path d="M78,35 Q85,32 92,38 Q88,46 76,43 Z" fill="#22c55e" opacity="0.75"/>
        <circle cx="108" cy="34" r="3" fill="#e2e8f0"/>

        <!-- Distant Martian Mountains & Craters (Arcadia Planitia) -->
        <path d="M0,135 Q140,105 280,128 T600,118 L600,200 L0,200 Z" fill="#5c1d0c" opacity="0.85"/>
        <path d="M0,150 Q180,128 360,146 T600,138 L600,200 L0,200 Z" fill="#7c2d12"/>
        <path d="M0,165 Q220,152 440,160 T600,155 L600,200 L0,200 Z" fill="#9a3412"/>

        <!-- Astra-1 Habitat Complex (Left & Center-Left) -->
        <!-- Greenhouse Dome -->
        <path d="M120,168 A38,32 0 0,1 196,168 Z" fill="rgba(34,197,94,0.35)" stroke="#4ade80" stroke-width="2"/>
        <line x1="120" y1="168" x2="196" y2="168" stroke="#1e293b" stroke-width="3"/>
        <circle cx="145" cy="158" r="8" fill="#16a34a"/><circle cx="170" cy="156" r="9" fill="#22c55e"/>

        <!-- Pressurized Living Module & Airlock -->
        <rect x="185" y="145" width="85" height="25" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <rect x="200" y="150" width="16" height="8" rx="2" fill="#0284c7"/>
        <rect x="225" y="150" width="16" height="8" rx="2" fill="#0284c7"/>
        <rect x="250" y="150" width="12" height="18" fill="#334155"/>
        <!-- Comms Tower -->
        <line x1="210" y1="145" x2="210" y2="115" stroke="#94a3b8" stroke-width="2"/>
        <path d="M202,120 A12,12 0 0,1 218,120" fill="none" stroke="#38bdf8" stroke-width="2.5"/>

        <!-- Surface Details & Flag of Exploration -->
        <line x1="285" y1="172" x2="285" y2="148" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="285" y="148" width="18" height="10" fill="#dc2626"/>
        <rect x="285" y="148" width="8" height="6" fill="#1d4ed8"/>
        <circle cx="289" cy="151" r="1.5" fill="#ffffff"/>

        <!-- Waving Cadet Nova & Crew (3 Figures) -->
        <g transform="translate(298, 155)">
            <!-- Astronaut 1 (Cadet Nova waving) -->
            <ellipse cx="6" cy="14" rx="4" ry="6" fill="#f8fafc" stroke="#0284c7" stroke-width="1"/>
            <circle cx="6" cy="6" r="3.5" fill="#f8fafc" stroke="#0284c7" stroke-width="1"/>
            <path d="M5,5 Q6,4 7,5" stroke="#38bdf8" stroke-width="1.5"/>
            <line x1="10" y1="9" x2="14" y2="4" stroke="#f8fafc" stroke-width="1.5"/>
            <!-- Astronaut 2 -->
            <ellipse cx="18" cy="15" rx="3.5" ry="5.5" fill="#f8fafc"/>
            <circle cx="18" cy="7" r="3" fill="#f8fafc"/>
            <!-- Astronaut 3 -->
            <ellipse cx="28" cy="15" rx="3.5" ry="5.5" fill="#f8fafc"/>
            <circle cx="28" cy="7" r="3" fill="#f8fafc"/>
        </g>

        <!-- Astra-2 Heavy Resupply Lander Touchdown (Center-Right) -->
        <g transform="translate(420, 22)">
            <!-- Fiery Retro-Rocket Exhaust Plumes -->
            <polygon points="12,110 -8,168 32,168" fill="url(#tdRetroPlume)"/>
            <polygon points="68,110 48,168 88,168" fill="url(#tdRetroPlume)"/>
            <!-- Inner Blue Plasma Jets -->
            <polygon points="12,110 4,145 20,145" fill="#a5f3fc"/>
            <polygon points="68,110 60,145 76,145" fill="#a5f3fc"/>

            <!-- Billowing Regolith Dust Cloud on Surface -->
            <ellipse cx="40" cy="162" rx="90" ry="24" fill="url(#tdDust)"/>

            <!-- Lander Body -->
            <polygon points="40,10 68,48 12,48" fill="url(#tdLanderHull)" stroke="#e2e8f0" stroke-width="1.5"/>
            <rect x="8" y="48" width="64" height="42" rx="4" fill="url(#tdGoldFoil)" stroke="#78350f" stroke-width="1.5"/>
            <rect x="14" y="54" width="16" height="30" rx="3" fill="#b45309" opacity="0.6"/>
            <rect x="50" y="54" width="16" height="30" rx="3" fill="#b45309" opacity="0.6"/>
            <rect x="4" y="90" width="72" height="12" rx="2" fill="#334155" stroke="#64748b" stroke-width="1"/>
            <polygon points="6,102 18,102 22,114 2,114" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
            <polygon points="62,102 74,102 78,114 58,114" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>

            <!-- Deployed Quad Landing Legs & Footpads -->
            <line x1="8" y1="78" x2="-22" y2="152" stroke="#cbd5e1" stroke-width="3"/>
            <line x1="-2" y1="92" x2="-22" y2="152" stroke="#94a3b8" stroke-width="2"/>
            <ellipse cx="-22" cy="153" rx="10" ry="3.5" fill="#475569" stroke="#94a3b8" stroke-width="1"/>

            <line x1="72" y1="78" x2="102" y2="152" stroke="#cbd5e1" stroke-width="3"/>
            <line x1="82" y1="92" x2="102" y2="152" stroke="#94a3b8" stroke-width="2"/>
            <ellipse cx="102" cy="153" rx="10" ry="3.5" fill="#475569" stroke="#94a3b8" stroke-width="1"/>

            <!-- Mission Decal -->
            <rect x="28" y="58" width="24" height="10" rx="2" fill="#0284c7"/>
            <text x="40" y="65" font-family="'Orbitron', sans-serif" font-size="5" font-weight="bold" fill="#ffffff" text-anchor="middle">ASTRA-2</text>
        </g>
    </svg>`;
}

function getConsoleIllustrationSVG(objId) {
    const commonBg = `<rect width="400" height="100" fill="#070b14"/><path d="M0,25 H400 M0,50 H400 M0,75 H400 M80,0 V100 M160,0 V100 M240,0 V100 M320,0 V100" stroke="#1e293b" stroke-width="1"/>`;
    if (objId === 'power_console') {
        return `<svg viewBox="0 0 400 100" class="w-full h-full">${commonBg}
            <rect x="45" y="18" width="95" height="64" rx="6" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
            <rect x="55" y="14" width="12" height="72" fill="#ea580c"/><rect x="85" y="14" width="12" height="72" fill="#ea580c"/><rect x="115" y="14" width="12" height="72" fill="#ea580c"/>
            <rect x="180" y="25" width="165" height="52" rx="10" fill="#475569" stroke="#38bdf8" stroke-width="2"/>
            <rect x="195" y="34" width="75" height="16" fill="#0284c7"/>
            <circle cx="315" cy="51" r="16" fill="#0f172a" stroke="#22c55e" stroke-width="3"/>
        </svg>`;
    } else if (objId === 'greenhouse_console') {
        return `<svg viewBox="0 0 400 100" class="w-full h-full">${commonBg}
            <rect x="40" y="22" width="140" height="60" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
            <circle cx="70" cy="52" r="12" fill="#22c55e"/><circle cx="110" cy="52" r="12" fill="#4ade80"/><circle cx="150" cy="52" r="12" fill="#22c55e"/>
            <line x1="35" y1="28" x2="185" y2="28" stroke="#fde047" stroke-width="4"/>
            <rect x="220" y="22" width="140" height="60" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
            <circle cx="250" cy="52" r="12" fill="#4ade80"/><circle cx="290" cy="52" r="12" fill="#22c55e"/><circle cx="330" cy="52" r="12" fill="#4ade80"/>
            <line x1="215" y1="28" x2="365" y2="28" stroke="#fde047" stroke-width="4"/>
        </svg>`;
    } else if (objId === 'water_recycler' || objId === 'co2_scrubber') {
        return `<svg viewBox="0 0 400 100" class="w-full h-full">${commonBg}
            <rect x="50" y="24" width="90" height="52" rx="14" fill="#475569" stroke="#38bdf8" stroke-width="2"/>
            <rect x="170" y="16" width="45" height="68" rx="6" fill="#0369a1" stroke="#7dd3fc" stroke-width="2"/>
            <rect x="235" y="16" width="45" height="68" rx="6" fill="#0f766e" stroke="#5eead4" stroke-width="2"/>
            <path d="M140,50 H170 M215,50 H235 M280,50 H350" stroke="#38bdf8" stroke-width="6"/>
        </svg>`;
    }
    return `<svg viewBox="0 0 400 100" class="w-full h-full">${commonBg}
        <rect x="60" y="20" width="110" height="60" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <polyline points="75,55 95,35 115,60 135,40 155,50" fill="none" stroke="#22d3ee" stroke-width="3"/>
        <rect x="210" y="20" width="130" height="60" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <rect x="225" y="34" width="100" height="10" fill="#38bdf8"/><rect x="225" y="52" width="75" height="10" fill="#22c55e"/>
    </svg>`;
}

// --- CANVAS & CAMERA SETUP ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const camera = { x: 560, y: 380, zoom: 1 };

function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    const scaleX = canvas.width / 1220;
    const scaleY = canvas.height / 780;
    camera.zoom = Math.max(0.58, Math.min(1.12, Math.min(scaleX, scaleY) * 0.96));
}
window.addEventListener('resize', resizeCanvas);

// Dust particles for Chapter 5 / 6 storm effect
const dustParticles = Array.from({ length: 65 }, () => ({
    x: Math.random() * 1200,
    y: Math.random() * 760,
    speed: 140 + Math.random() * 120,
    size: 1.5 + Math.random() * 2.5
}));

// --- 2.5D VOLUMETRIC SCENERY RENDERERS ---
function drawExteriorMarsLandscape(now) {
    ctx.fillStyle = '#090d16';
    ctx.fillRect(-150, -140, 1500, 160);

    ctx.fillStyle = '#2563eb';
    ctx.beginPath(); ctx.arc(160, -65, 18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.arc(155, -68, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(167, -58, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(160, -65, 20, 0, Math.PI * 2); ctx.stroke();

    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.moveTo(-150, 20);
    ctx.lineTo(60, -28);
    ctx.lineTo(240, 12);
    ctx.lineTo(480, -35);
    ctx.lineTo(760, 15);
    ctx.lineTo(1040, -25);
    ctx.lineTo(1350, 20);
    ctx.closePath();
    ctx.fill();
}

function drawRoomFloorPattern(r) {
    if (r.id === 'corridor') {
        for (let gx = r.x; gx < r.x + r.w; gx += 20) {
            for (let gy = r.y; gy < r.y + r.h; gy += 20) {
                const isChecker = ((gx / 20) + (gy / 20)) % 2 === 0;
                ctx.fillStyle = isChecker ? 'rgba(30, 41, 59, 0.55)' : 'rgba(15, 23, 42, 0.55)';
                ctx.fillRect(gx, gy, 20, 20);
            }
        }
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(r.x + 165, r.y + 70, 160, 115);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(r.x + 170, r.y + 75, 150, 105);
    } else {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
        ctx.lineWidth = 1;
        for (let gx = r.x + 24; gx < r.x + r.w; gx += 24) {
            ctx.beginPath(); ctx.moveTo(gx, r.y); ctx.lineTo(gx, r.y + r.h); ctx.stroke();
        }
        for (let gy = r.y + 24; gy < r.y + r.h; gy += 24) {
            ctx.beginPath(); ctx.moveTo(r.x, gy); ctx.lineTo(r.x + r.w, gy); ctx.stroke();
        }
    }
}

function drawRoomDetails(now) {
    const pathGrad = ctx.createLinearGradient(115, 200, 270, 560);
    pathGrad.addColorStop(0, '#d97706');
    pathGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = pathGrad;
    ctx.beginPath();
    ctx.roundRect(120, 355, 150, 46, 8);
    ctx.roundRect(115, 200, 42, 360, 8);
    ctx.fill();

    const crater1 = ctx.createRadialGradient(85, 78, 5, 90, 82, 40);
    crater1.addColorStop(0, '#270902');
    crater1.addColorStop(0.7, '#5c1f0b');
    crater1.addColorStop(1, '#9a3412');
    ctx.fillStyle = crater1;
    ctx.beginPath(); ctx.ellipse(90, 82, 38, 18, 0, 0, Math.PI * 2); ctx.fill();

    const crater2 = ctx.createRadialGradient(180, 670, 5, 185, 675, 44);
    crater2.addColorStop(0, '#270902');
    crater2.addColorStop(0.7, '#5c1f0b');
    crater2.addColorStop(1, '#9a3412');
    ctx.fillStyle = crater2;
    ctx.beginPath(); ctx.ellipse(185, 675, 42, 20, 0, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath(); ctx.ellipse(85, 302, 46, 38, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#15803d';
    ctx.beginPath(); ctx.arc(70, 285, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.arc(100, 302, 14, 0, Math.PI * 2); ctx.fill();

    const lampGlow = ctx.createRadialGradient(85, 295, 2, 85, 295, 24);
    lampGlow.addColorStop(0, '#fef08a');
    lampGlow.addColorStop(0.4, '#f59e0b');
    lampGlow.addColorStop(1, 'rgba(245,158,11,0)');
    ctx.fillStyle = lampGlow;
    ctx.beginPath(); ctx.arc(85, 295, 24, 0, Math.PI * 2); ctx.fill();

    const domeSphere = ctx.createRadialGradient(70, 278, 6, 85, 295, 45);
    domeSphere.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    domeSphere.addColorStop(0.35, 'rgba(56, 189, 248, 0.22)');
    domeSphere.addColorStop(0.85, 'rgba(14, 116, 144, 0.38)');
    domeSphere.addColorStop(1, 'rgba(15, 23, 42, 0.75)');
    ctx.fillStyle = domeSphere;
    ctx.beginPath(); ctx.arc(85, 295, 44, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();
    ctx.restore();

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 2; col++) {
            const px = 55 + col * 85;
            const py = 128 + row * 38;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(px + 4, py + 8, 58, 25);
            const pnlGrad = ctx.createLinearGradient(px, py, px + 58, py + 25);
            if (state.faults.dustStormActive) {
                pnlGrad.addColorStop(0, '#9a3412');
                pnlGrad.addColorStop(1, '#451a03');
            } else {
                pnlGrad.addColorStop(0, '#60a5fa');
                pnlGrad.addColorStop(0.5, '#1d4ed8');
                pnlGrad.addColorStop(1, '#172554');
            }
            ctx.fillStyle = pnlGrad;
            ctx.beginPath(); ctx.roundRect(px, py, 58, 25, 3); ctx.fill();
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    const rvx = 68, rvy = 565;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath(); ctx.ellipse(rvx + 44, rvy + 36, 48, 10, 0, 0, Math.PI * 2); ctx.fill();
    const rvrGrad = ctx.createLinearGradient(rvx, rvy, rvx, rvy + 34);
    rvrGrad.addColorStop(0, '#fb923c');
    rvrGrad.addColorStop(0.5, '#c2410c');
    rvrGrad.addColorStop(1, '#431407');
    ctx.fillStyle = rvrGrad;
    ctx.beginPath(); ctx.roundRect(rvx, rvy, 88, 34, 8); ctx.fill();
    ctx.strokeStyle = '#fed7aa'; ctx.lineWidth = 1.5; ctx.stroke();

    const cabGrad = ctx.createLinearGradient(rvx + 4, rvy + 2, rvx + 4, rvy + 28);
    cabGrad.addColorStop(0, '#ffffff');
    cabGrad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = cabGrad;
    ctx.beginPath(); ctx.roundRect(rvx + 4, rvy + 4, 42, 24, 6); ctx.fill();
    ctx.fillStyle = '#0284c7';
    ctx.beginPath(); ctx.roundRect(rvx + 7, rvy + 7, 24, 16, 4); ctx.fill();

    for (let w = 0; w < 3; w++) {
        const wx = rvx + 16 + w * 28;
        ctx.fillStyle = '#090d16';
        ctx.beginPath(); ctx.arc(wx, rvy + 35, 9.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.5; ctx.stroke();
    }

    for (let s = 0; s < 2; s++) {
        const sx = 288, sy = 315 + s * 105;
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.roundRect(sx, sy, 28, 38, 4); ctx.fill();
        ctx.fillStyle = '#ea580c';
        ctx.beginPath(); ctx.roundRect(sx + 5, sy + 14, 18, 20, 4); ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.arc(sx + 14, sy + 9, 6.5, 0, Math.PI * 2); ctx.fill();
    }

    const pwrGlow = ctx.createRadialGradient(464, 91, 5, 464, 91, 45);
    pwrGlow.addColorStop(0, 'rgba(249, 115, 22, 0.45)');
    pwrGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx.fillStyle = pwrGlow;
    ctx.beginPath(); ctx.arc(464, 91, 45, 0, Math.PI * 2); ctx.fill();

    const reactGrad = ctx.createLinearGradient(435, 65, 435, 117);
    reactGrad.addColorStop(0, '#64748b');
    reactGrad.addColorStop(0.5, '#334155');
    reactGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = reactGrad;
    ctx.beginPath(); ctx.roundRect(435, 65, 58, 52, 8); ctx.fill();
    ctx.strokeStyle = '#090d16'; ctx.lineWidth = 2; ctx.stroke();

    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.roundRect(441, 60, 9, 62, 3);
    ctx.roundRect(460, 60, 9, 62, 3);
    ctx.roundRect(479, 60, 9, 62, 3);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(452, 82, 24, 16);

    const turbGrad = ctx.createLinearGradient(580, 68, 580, 116);
    turbGrad.addColorStop(0, '#cbd5e1');
    turbGrad.addColorStop(0.5, '#475569');
    turbGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = turbGrad;
    ctx.beginPath(); ctx.roundRect(580, 68, 56, 48, 12); ctx.fill();
    ctx.fillStyle = '#0284c7';
    ctx.beginPath(); ctx.roundRect(586, 74, 44, 16, 4); ctx.fill();
    ctx.fillStyle = state.faults.hvJunctionBroken ? '#ef4444' : '#22c55e';
    ctx.beginPath(); ctx.arc(598, 102, 5, 0, Math.PI * 2); ctx.fill();

    if (state.faults.hvJunctionBroken && Math.sin(now * 0.03) > 0.1) {
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(492, 95);
        ctx.lineTo(506, 108);
        ctx.lineTo(496, 118);
        ctx.lineTo(512, 126);
        ctx.stroke();
    }

    for (let t = 0; t < 2; t++) {
        const tx = 676 + t * 140, ty = 72;
        const cylGrad = ctx.createLinearGradient(tx, ty, tx + 44, ty);
        cylGrad.addColorStop(0, '#1e293b');
        cylGrad.addColorStop(0.4, '#94a3b8');
        cylGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = cylGrad;
        ctx.beginPath(); ctx.roundRect(tx, ty, 44, 62, 14); ctx.fill();
        ctx.strokeStyle = '#14b8a6'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = state.co2PPM > 1000 ? '#ef4444' : '#2dd4bf';
        ctx.fillRect(tx + 10, ty + 14, 24, 10);
    }

    for (let w = 0; w < 3; w++) {
        const wx = 438 + w * 28, wy = 532;
        const wGrad = ctx.createLinearGradient(wx, wy, wx + 22, wy);
        wGrad.addColorStop(0, '#0369a1');
        wGrad.addColorStop(0.45, '#7dd3fc');
        wGrad.addColorStop(1, '#0c4a6e');
        ctx.fillStyle = wGrad;
        ctx.beginPath(); ctx.roundRect(wx, wy, 22, 55, 8); ctx.fill();
    }
    ctx.fillStyle = '#64748b';
    ctx.fillRect(440, 595, 190, 10);

    if (state.faults.waterPipeLeaking) {
        ctx.fillStyle = '#38bdf8';
        for (let i = 0; i < 7; i++) {
            const angle = (now * 0.009 + i) % (Math.PI * 2);
            const rx = 490 + Math.cos(angle) * 18;
            const ry = 600 + Math.sin(angle) * 18;
            ctx.beginPath();
            ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const cropHealthy = !state.faults.irrigationPumpBroken && state.loads.greenhouse.on;
    for (let i = 0; i < 3; i++) {
        const bx = 678 + i * 66;
        const by = 528;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(bx + 3, by + 5, 54, 46);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.roundRect(bx, by, 54, 46, 5); ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.stroke();

        for (let row = 0; row < 2; row++) {
            for (let p = 0; p < 3; p++) {
                const px = bx + 11 + p * 16;
                const py = by + 13 + row * 20;
                const leafGrad = ctx.createRadialGradient(px - 2, py - 2, 1, px, py, 7);
                if (cropHealthy) {
                    leafGrad.addColorStop(0, '#86efac');
                    leafGrad.addColorStop(1, '#15803d');
                } else {
                    leafGrad.addColorStop(0, '#fde047');
                    leafGrad.addColorStop(1, '#854d0e');
                }
                ctx.fillStyle = leafGrad;
                ctx.beginPath();
                ctx.arc(px, py, 6.5, 0, Math.PI * 2);
                ctx.fill();
                if (cropHealthy && i === 0) {
                    ctx.fillStyle = '#ef4444';
                    ctx.beginPath(); ctx.arc(px + 2, py - 1, 2, 0, Math.PI * 2); ctx.fill();
                }
            }
        }
        if (state.loads.greenhouse.on) {
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
            ctx.lineWidth = 10;
            ctx.beginPath(); ctx.moveTo(bx + 2, by + 23); ctx.lineTo(bx + 52, by + 23); ctx.stroke();
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(bx + 2, by + 23); ctx.lineTo(bx + 52, by + 23); ctx.stroke();
        }
    }

    const cupGrad = ctx.createRadialGradient(660, 260, 2, 660, 260, 22);
    cupGrad.addColorStop(0, '#38bdf8');
    cupGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = cupGrad;
    ctx.beginPath(); ctx.arc(660, 262, 16, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.stroke();

    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath(); ctx.roundRect(627, 290, 70, 42, 8); ctx.fill();
    ctx.fillStyle = '#0f766e';
    ctx.beginPath(); ctx.roundRect(625, 285, 70, 42, 8); ctx.fill();
    ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 1.5; ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.roundRect(915, 78, 52, 85, 8); ctx.fill();
    ctx.fillStyle = '#0284c7';
    ctx.beginPath(); ctx.roundRect(923, 88, 36, 65, 5); ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.roundRect(1105, 85, 45, 75, 6); ctx.fill();
    ctx.fillStyle = state.faults.commsAntennaOffline ? '#ef4444' : '#38bdf8';
    ctx.fillRect(1112, 95, 31, 25);

    for (let b = 0; b < 3; b++) {
        const bx = 910, by = 415 + b * 48;
        ctx.fillStyle = '#334155';
        ctx.beginPath(); ctx.roundRect(bx, by, 56, 34, 6); ctx.fill();
        ctx.fillStyle = '#0284c7';
        ctx.beginPath(); ctx.roundRect(bx + 4, by + 4, 36, 26, 4); ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.roundRect(bx + 42, by + 6, 10, 22, 3); ctx.fill();
    }
    for (let w = 0; w < 4; w++) {
        const wy = 435 + w * 55;
        const shGrad = ctx.createRadialGradient(1138, wy - 4, 2, 1142, wy, 17);
        shGrad.addColorStop(0, '#bae6fd');
        shGrad.addColorStop(0.5, state.faults.shelterProtocolActive ? '#0ea5e9' : '#1d4ed8');
        shGrad.addColorStop(1, '#1e3a8a');
        ctx.fillStyle = shGrad;
        ctx.beginPath();
        ctx.arc(1142, wy, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}

function drawCrewNPC(npc, now) {
    const bob = Math.sin(now * 0.004 + npc.x) * 2;

    // 1. Soft 3D Ground Drop Shadow
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath(); ctx.ellipse(npc.x, npc.y + 17, 16, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath(); ctx.ellipse(npc.x, npc.y + 16, 11, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // 2. 3D Legs
    const legGrad = ctx.createLinearGradient(npc.x - 7, npc.y, npc.x + 7, npc.y);
    legGrad.addColorStop(0, '#0f172a');
    legGrad.addColorStop(0.5, '#334155');
    legGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = legGrad;
    ctx.beginPath(); ctx.roundRect(npc.x - 6, npc.y + 6, 5, 10, 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(npc.x + 1, npc.y + 6, 5, 10, 2); ctx.fill();

    // 3. Volumetric Shaded Torso
    const suitGrad = ctx.createLinearGradient(npc.x - 10, npc.y, npc.x + 10, npc.y);
    suitGrad.addColorStop(0, '#0f172a');
    suitGrad.addColorStop(0.35, npc.suitColor);
    suitGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = suitGrad;
    ctx.beginPath(); ctx.roundRect(npc.x - 9.5, npc.y - 9 + bob, 19, 17, 4.5); ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Chest Collar & Insignia
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(npc.x - 7, npc.y + 2 + bob, 14, 2.5);

    // 4. Head / Helmet
    if (npc.helmetOn) {
        const helmGrad = ctx.createRadialGradient(npc.x - 3, npc.y - 17 + bob, 1, npc.x, npc.y - 15 + bob, 10);
        helmGrad.addColorStop(0, '#ffffff');
        helmGrad.addColorStop(0.7, '#64748b');
        helmGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = helmGrad;
        ctx.beginPath(); ctx.arc(npc.x, npc.y - 15 + bob, 9.5, 0, Math.PI * 2); ctx.fill();

        // Visor
        const visorGrad = ctx.createLinearGradient(npc.x - 6, npc.y - 18 + bob, npc.x + 6, npc.y - 12 + bob);
        visorGrad.addColorStop(0, '#7dd3fc');
        visorGrad.addColorStop(0.5, '#0284c7');
        visorGrad.addColorStop(1, '#0c4a6e');
        ctx.fillStyle = visorGrad;
        ctx.beginPath(); ctx.roundRect(npc.x - 5.5, npc.y - 18 + bob, 11, 7, 3); ctx.fill();
    } else {
        // Face
        const faceGrad = ctx.createRadialGradient(npc.x - 2, npc.y - 17 + bob, 1, npc.x, npc.y - 15 + bob, 8.5);
        faceGrad.addColorStop(0, '#fff7ed');
        faceGrad.addColorStop(0.7, npc.skinColor);
        faceGrad.addColorStop(1, '#c2410c');
        ctx.fillStyle = faceGrad;
        ctx.beginPath(); ctx.arc(npc.x, npc.y - 15 + bob, 8.5, 0, Math.PI * 2); ctx.fill();

        // Hair
        ctx.fillStyle = npc.hairColor;
        ctx.beginPath(); ctx.arc(npc.x, npc.y - 18 + bob, 9, Math.PI * 0.9, Math.PI * 2.1); ctx.fill();
        ctx.fillRect(npc.x - 8, npc.y - 18 + bob, 4, 8);

        // Eyes
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(npc.x - 3, npc.y - 15 + bob, 2, 2.5);
        ctx.fillRect(npc.x + 2, npc.y - 15 + bob, 2, 2.5);
    }

    // 5. Floating Name & Health Bar
    ctx.font = 'bold 9.5px "Inter", sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.fillText(npc.name, npc.x, npc.y - 36 + bob);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(npc.x - 18, npc.y - 32 + bob, 36, 7);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(npc.x - 17, npc.y - 31 + bob, 34 * (npc.hp / 100), 2.5);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(npc.x - 17, npc.y - 28 + bob, 34 * (npc.energy / 100), 2);

    // 6. Interaction Dialogue Bubble
    const distToPlayer = Math.hypot(state.player.x - npc.x, state.player.y - npc.y);
    if (distToPlayer < 95) {
        ctx.fillStyle = 'rgba(9, 13, 22, 0.94)';
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(npc.x - 102, npc.y - 68 + bob, 204, 26, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9px "Inter", sans-serif';
        ctx.fillText(`[E] Talk: "${npc.quote}"`, npc.x, npc.y - 55 + bob);
    }
}

function drawAstronaut(x, y, inSuit, now) {
    const wearSuit = inSuit || x <= 282;
    const isMoving = (typeof keys !== 'undefined') && (keys.up || keys.down || keys.left || keys.right || state.player.targetX !== null);
    const bob = isMoving ? Math.sin(now * 0.018) * 3 : 0;
    const legSwing = isMoving ? Math.sin(now * 0.022) * 5 : 0;
    const armSwing = isMoving ? -Math.sin(now * 0.022) * 4 : 0;
    const dir = state.player.facing === 'right' ? 1 : -1;

    // 1. Dynamic Directional Ground Drop Shadow (3D ambient occlusion)
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(x + dir * 3, y + 20, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(x, y + 19, 12, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Flashlight forward illumination cone
    ctx.save();
    const lightCone = ctx.createRadialGradient(x + dir * 8, y + bob, 4, x + dir * 45, y + 15 + bob, 55);
    lightCone.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
    lightCone.addColorStop(0.5, 'rgba(56, 189, 248, 0.09)');
    lightCone.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = lightCone;
    ctx.beginPath();
    ctx.moveTo(x + dir * 8, y + bob);
    ctx.lineTo(x + dir * 65, y - 25 + bob);
    ctx.lineTo(x + dir * 65, y + 45 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 3. Volumetric 3D Legs (Cylindrical gradient with boot rims)
    const drawLeg = (lx, ly, swing) => {
        const legGrad = ctx.createLinearGradient(lx - 4, ly, lx + 4, ly);
        if (wearSuit) {
            legGrad.addColorStop(0, '#94a3b8');
            legGrad.addColorStop(0.35, '#f8fafc');
            legGrad.addColorStop(1, '#64748b');
        } else {
            legGrad.addColorStop(0, '#0f172a');
            legGrad.addColorStop(0.4, '#334155');
            legGrad.addColorStop(1, '#0f172a');
        }
        ctx.fillStyle = legGrad;
        ctx.beginPath();
        ctx.roundRect(lx - 4, ly + swing, 8, 12, 3);
        ctx.fill();

        // Heavy Magnetized Exploration Boot
        ctx.fillStyle = wearSuit ? '#334155' : '#090d16';
        ctx.beginPath();
        ctx.roundRect(lx - 4.5, ly + 9 + swing, 9, 4, 1.5);
        ctx.fill();
        ctx.fillStyle = wearSuit ? '#f59e0b' : '#38bdf8';
        ctx.fillRect(lx - 3, ly + 11 + swing, 6, 1.5);
    };

    drawLeg(x - 5, y + 6, legSwing);
    drawLeg(x + 5, y + 6, -legSwing);

    // 4. Life-Support Backpack (PLSS) behind Torso
    const packGrad = ctx.createLinearGradient(x - 14, y, x + 14, y);
    packGrad.addColorStop(0, '#475569');
    packGrad.addColorStop(0.35, '#f1f5f9');
    packGrad.addColorStop(1, '#334155');
    ctx.fillStyle = packGrad;
    ctx.beginPath();
    ctx.roundRect(x - (wearSuit ? 15 : 13), y - (wearSuit ? 14 : 11) + bob, wearSuit ? 30 : 26, wearSuit ? 23 : 19, 4.5);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (wearSuit) {
        // High-Gain Antenna & Blinking Beacon
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - 11, y - 14 + bob);
        ctx.lineTo(x - 11, y - 31 + bob);
        ctx.stroke();

        ctx.fillStyle = Math.sin(now * 0.012) > 0 ? '#22c55e' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(x - 11, y - 32 + bob, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Dual Oxygen Supply Cylinders on Backpack
        const o2Grad = ctx.createLinearGradient(x - 13, y, x - 7, y);
        o2Grad.addColorStop(0, '#0284c7');
        o2Grad.addColorStop(0.5, '#7dd3fc');
        o2Grad.addColorStop(1, '#0369a1');
        ctx.fillStyle = o2Grad;
        ctx.beginPath();
        ctx.roundRect(x - 13, y - 8 + bob, 4.5, 14, 2);
        ctx.fill();

        const o2Grad2 = ctx.createLinearGradient(x + 8.5, y, x + 13, y);
        o2Grad2.addColorStop(0, '#0284c7');
        o2Grad2.addColorStop(0.5, '#7dd3fc');
        o2Grad2.addColorStop(1, '#0369a1');
        ctx.fillStyle = o2Grad2;
        ctx.beginPath();
        ctx.roundRect(x + 8.5, y - 8 + bob, 4.5, 14, 2);
        ctx.fill();
    }

    // 5. 3D Cylindrical Curved Torso
    const torsoGrad = ctx.createLinearGradient(x - 12, y, x + 12, y);
    if (wearSuit) {
        torsoGrad.addColorStop(0, '#9a3412');
        torsoGrad.addColorStop(0.35, '#fb923c');
        torsoGrad.addColorStop(0.65, '#ea580c');
        torsoGrad.addColorStop(1, '#7c2d12');
    } else {
        torsoGrad.addColorStop(0, '#0369a1');
        torsoGrad.addColorStop(0.35, '#38bdf8');
        torsoGrad.addColorStop(0.65, '#0284c7');
        torsoGrad.addColorStop(1, '#0c4a6e');
    }
    ctx.fillStyle = torsoGrad;
    ctx.beginPath();
    ctx.roundRect(x - 11.5, y - 10 + bob, 23, 20, 5);
    ctx.fill();
    ctx.strokeStyle = wearSuit ? '#fed7aa' : '#bae6fd';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Chest Telemetry Display Unit (DCM) with Glowing LED
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(x - 7, y - 5 + bob, 14, 8, 2);
    ctx.fill();
    ctx.fillStyle = wearSuit ? '#38bdf8' : '#4ade80';
    ctx.fillRect(x - 5, y - 3 + bob, 4, 3);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + 1, y - 3 + bob, 4, 3);

    // Dynamic 3D Arms & Gloves with counter-phase swing
    const drawArm = (ax, ay, swing) => {
        const armGrad = ctx.createLinearGradient(ax - 3, ay, ax + 3, ay);
        armGrad.addColorStop(0, wearSuit ? '#9a3412' : '#0369a1');
        armGrad.addColorStop(0.4, wearSuit ? '#fb923c' : '#38bdf8');
        armGrad.addColorStop(1, wearSuit ? '#7c2d12' : '#0c4a6e');
        ctx.fillStyle = armGrad;
        ctx.beginPath();
        ctx.roundRect(ax - 3, ay + swing, 6, 12, 2.5);
        ctx.fill();

        // Pressurized Glove
        ctx.fillStyle = wearSuit ? '#f8fafc' : '#475569';
        ctx.beginPath();
        ctx.arc(ax, ay + 12 + swing, 3.2, 0, Math.PI * 2);
        ctx.fill();
    };
    drawArm(x - 13.5, y - 7 + bob, armSwing);
    drawArm(x + 13.5, y - 7 + bob, -armSwing);

    // 6. Spherical 3D Helmet with Specular Metallic Visor
    if (wearSuit) {
        // Metallic neck seal ring
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.ellipse(x, y - 8 + bob, 10, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3D Spherical Shaded Outer Helmet
        const helmGrad = ctx.createRadialGradient(x - 4, y - 22 + bob, 2, x, y - 18 + bob, 14);
        helmGrad.addColorStop(0, '#ffffff');
        helmGrad.addColorStop(0.5, '#f1f5f9');
        helmGrad.addColorStop(0.85, '#cbd5e1');
        helmGrad.addColorStop(1, '#475569');
        ctx.fillStyle = helmGrad;
        ctx.beginPath();
        ctx.arc(x, y - 18 + bob, 13.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Deep Gold Martian Visor with Reflective Horizon Arc
        const visorGrad = ctx.createLinearGradient(x - 9, y - 24 + bob, x + 9, y - 12 + bob);
        visorGrad.addColorStop(0, '#fef08a');
        visorGrad.addColorStop(0.3, '#f59e0b');
        visorGrad.addColorStop(0.7, '#d97706');
        visorGrad.addColorStop(1, '#78350f');
        ctx.fillStyle = visorGrad;
        ctx.beginPath();
        ctx.ellipse(x + dir * 2.5, y - 18 + bob, 9, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Curved 3D Specular Visor Highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(x + dir * 2.5 - 2, y - 19 + bob, 5, -Math.PI * 0.75, -Math.PI * 0.25);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x + dir * 2.5 - 4, y - 21 + bob, 1.2, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // IVA Mode: Head & Hair with Comms Headset
        const faceGrad = ctx.createRadialGradient(x - 2, y - 18 + bob, 1, x, y - 16 + bob, 10);
        faceGrad.addColorStop(0, '#fff7ed');
        faceGrad.addColorStop(0.7, '#fed7aa');
        faceGrad.addColorStop(1, '#f97316');
        ctx.fillStyle = faceGrad;
        ctx.beginPath();
        ctx.arc(x, y - 16 + bob, 10, 0, Math.PI * 2);
        ctx.fill();

        // Hair with volumetric layers
        ctx.fillStyle = '#7c2d12';
        ctx.beginPath();
        ctx.arc(x, y - 19 + bob, 10.5, Math.PI * 0.9, Math.PI * 2.1);
        ctx.fill();
        ctx.fillRect(x - 9, y - 19 + bob, 4, 7);

        // Eyes
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + dir * 2 - 2, y - 16 + bob, 2, 2.5);
        ctx.fillRect(x + dir * 2 + 2, y - 16 + bob, 2, 2.5);

        // Comms Headset boom
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x - 10, y - 16 + bob, 4, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(x + dir * 2 - 1, y - 13 + bob);
        ctx.stroke();
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(x + dir * 2 - 1, y - 13 + bob, 1.8, 0, Math.PI * 2);
        ctx.fill();
    }

    // 7. Floating Nameplate & Waypoint Guide
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillStyle = wearSuit ? '#fbbf24' : '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText(wearSuit ? 'CADET NOVA [EVA]' : 'CADET NOVA', x, y - 37 + bob);

    // Waypoint Guide Arrow
    const currentTasks = CHAPTERS[state.chapterIdx]?.tasks || [];
    const activeTask = currentTasks.find(t => !t.done);
    if (activeTask) {
        const targetObjId = TASK_OBJECT_MAP[activeTask.id];
        const targetObj = OBJECTS.find(o => o.id === targetObjId);
        if (targetObj) {
            const dx = targetObj.x - x;
            const dy = targetObj.y - y;
            const dist = Math.hypot(dx, dy);
            if (dist > 65) {
                const angle = Math.atan2(dy, dx);
                const arrowRadius = 36;
                const ax = x + Math.cos(angle) * arrowRadius;
                const ay = y + Math.sin(angle) * arrowRadius;

                ctx.save();
                ctx.translate(ax, ay);
                ctx.rotate(angle);
                ctx.fillStyle = '#fde047';
                ctx.shadowColor = '#facc15';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(7, 0);
                ctx.lineTo(-6, -4.5);
                ctx.lineTo(-3, 0);
                ctx.lineTo(-6, 4.5);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }
    }
}

function renderGame(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bgGrad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.5, 80,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.85
    );
    bgGrad.addColorStop(0, '#5c1d0c');
    bgGrad.addColorStop(1, '#1e0803');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camera.x, -camera.y);

    const pwr = getPowerStats();
    const lowPowerDim = pwr.net < 0 || state.batteryKWh < 30;

    // 0. Exterior Martian landscape
    drawExteriorMarsLandscape(now);

    // 1. Rooms and floors
    for (const r of ROOMS) {
        if (!r.isOutdoor) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
            ctx.beginPath();
            ctx.roundRect(r.x - 8, r.y + 10, r.w + 16, r.h + 14, 8);
            ctx.fill();

            const hullGrad = ctx.createLinearGradient(r.x, r.y - 12, r.x, r.y + r.h + 8);
            hullGrad.addColorStop(0, '#94a3b8');
            hullGrad.addColorStop(0.15, '#475569');
            hullGrad.addColorStop(0.9, '#1e293b');
            hullGrad.addColorStop(1, '#090d16');
            ctx.fillStyle = hullGrad;
            ctx.beginPath();
            ctx.roundRect(r.x - 7, r.y - 11, r.w + 14, r.h + 18, 6);
            ctx.fill();
        }

        const rmGrad = ctx.createRadialGradient(
            r.x + r.w / 2, r.y + r.h / 2, 15,
            r.x + r.w / 2, r.y + r.h / 2, Math.max(r.w, r.h) * 0.75
        );
        if (r.isOutdoor) {
            rmGrad.addColorStop(0, '#b45309');
            rmGrad.addColorStop(0.6, '#9a3412');
            rmGrad.addColorStop(1, '#6c1e0a');
        } else {
            rmGrad.addColorStop(0, '#1e293b');
            rmGrad.addColorStop(1, r.floorColor);
        }
        ctx.fillStyle = rmGrad;
        ctx.fillRect(r.x, r.y, r.w, r.h);

        if (!r.isOutdoor) {
            const wallGrad = ctx.createLinearGradient(r.x, r.y, r.x, r.y + 22);
            wallGrad.addColorStop(0, '#090d16');
            wallGrad.addColorStop(0.75, '#334155');
            wallGrad.addColorStop(1, '#1e293b');
            ctx.fillStyle = wallGrad;
            ctx.fillRect(r.x, r.y, r.w, 22);

            ctx.fillStyle = lowPowerDim ? '#ef4444' : r.borderColor;
            ctx.fillRect(r.x + 12, r.y + 19, r.w - 24, 2.5);

            drawRoomFloorPattern(r);

            ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
            ctx.lineWidth = 6;
            ctx.strokeRect(r.x + 3, r.y + 3, r.w - 6, r.h - 6);

            if (lowPowerDim) {
                ctx.fillStyle = 'rgba(127, 29, 29, 0.25)';
                ctx.fillRect(r.x, r.y, r.w, r.h);
            }
        }

        ctx.strokeStyle = r.borderColor;
        ctx.lineWidth = r.isOutdoor ? 2 : 3;
        ctx.strokeRect(r.x, r.y, r.w, r.h);

        ctx.fillStyle = 'rgba(9, 13, 22, 0.88)';
        ctx.beginPath();
        ctx.roundRect(r.labelX - 96, r.labelY - 12, 192, 18, 5);
        ctx.fill();
        ctx.strokeStyle = r.borderColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px "Orbitron", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(r.name.toUpperCase(), r.labelX, r.labelY - 3);
    }

    // 2. Doors
    for (const d of DOORS) {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(d.x - 3, d.y - 3, d.w + 6, d.h + 6);
        const doorGrad = ctx.createLinearGradient(d.x, d.y, d.x + d.w, d.y + d.h);
        doorGrad.addColorStop(0, '#7dd3fc');
        doorGrad.addColorStop(0.5, '#0284c7');
        doorGrad.addColorStop(1, '#0369a1');
        ctx.fillStyle = doorGrad;
        ctx.fillRect(d.x, d.y, d.w, d.h);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(d.x, d.y, 4, 4);
        ctx.fillRect(d.x + d.w - 4, d.y + d.h - 4, 4, 4);
    }

    // 3. Room details & machinery
    drawRoomDetails(now);

    // 4. Interactive consoles
    const nearest = (typeof getNearestObject === 'function') ? getNearestObject() : null;
    for (const obj of OBJECTS) {
        const isNear = nearest && nearest.id === obj.id;
        const pulse = Math.sin(now * 0.006) * 4;

        const glowGrad = ctx.createRadialGradient(obj.x, obj.y, 4, obj.x, obj.y, obj.radius + 8);
        glowGrad.addColorStop(0, isNear ? 'rgba(250, 204, 21, 0.45)' : 'rgba(56, 189, 248, 0.22)');
        glowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius + 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius - 6 + (isNear ? pulse : 0), 0, Math.PI * 2);
        ctx.lineWidth = isNear ? 2.5 : 1.2;
        ctx.strokeStyle = isNear ? '#fde047' : obj.color;
        ctx.stroke();

        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath();
        ctx.ellipse(obj.x, obj.y + 18, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        const kioskGrad = ctx.createLinearGradient(obj.x - 18, obj.y - 22, obj.x + 18, obj.y + 18);
        kioskGrad.addColorStop(0, '#334155');
        kioskGrad.addColorStop(0.5, '#0f172a');
        kioskGrad.addColorStop(1, '#020617');
        ctx.fillStyle = kioskGrad;
        ctx.beginPath();
        ctx.roundRect(obj.x - 18, obj.y - 20, 36, 36, 8);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = isNear ? '#fde047' : obj.color;
        ctx.stroke();

        ctx.fillStyle = isNear ? '#fde047' : obj.color;
        ctx.beginPath();
        ctx.roundRect(obj.x - 14, obj.y - 16, 28, 6, 2);
        ctx.fill();

        ctx.fillStyle = isNear ? '#fde047' : obj.color;
        ctx.font = '900 16px "Font Awesome 6 Free"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obj.icon, obj.x, obj.y + 2);

        ctx.fillStyle = 'rgba(9, 13, 22, 0.92)';
        ctx.beginPath();
        ctx.roundRect(obj.x - 54, obj.y + 20, 108, 15, 4);
        ctx.fill();
        ctx.font = '600 9.5px "JetBrains Mono", monospace';
        ctx.fillStyle = isNear ? '#fde047' : '#f8fafc';
        ctx.fillText(obj.name.split('&')[0].trim(), obj.x, obj.y + 28);
    }

    // 5. Crew NPCs
    for (const npc of CREW_NPCS) {
        drawCrewNPC(npc, now);
    }

    // 6. Target marker
    if (state.player.targetX !== null) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(state.player.targetX, state.player.targetY, 10 + Math.sin(now * 0.01) * 3, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 7. Cadet Nova
    drawAstronaut(state.player.x, state.player.y, state.player.inSuit, now);

    // 8. Dust storm overlay
    if (state.faults.dustStormActive) {
        ctx.fillStyle = 'rgba(194, 65, 12, 0.24)';
        ctx.fillRect(0, 0, 1200, 760);
        ctx.fillStyle = 'rgba(251, 146, 60, 0.55)';
        for (const p of dustParticles) {
            p.x += p.speed * 0.016;
            p.y += (p.speed * 0.3) * 0.016;
            if (p.x > 1200) p.x = 0;
            if (p.y > 760) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.restore();
}

