/**
 * ASTRA-1: The Red Frontier - True 3D WebGL Simulation Engine (Three.js)
 * 2026 NASA Space Apps Challenge
 */

let scene3D, camera3D, renderer3D, threeContainer;
let nova3D, crew3DMeshes = {}, object3DMeshes = {}, roomLights = {};
let roomFloorDecals = {}, doorwayBadges = [], roomMachineryAnimations = [], techReferenceSprites = [], habitatDoor3DMeshes = [];
let isThreeInitialized = false;
let raycaster3D, mouse3D;
let emergencyLight3D;

// World coordinates (1200 x 760) map to 3D centered at origin
function to3DX(x) { return (x - 600) * 1.0; }
function to3DZ(y) { return (y - 380) * 1.0; }
function from3DX(x3d) { return x3d + 600; }
function from3DZ(z3d) { return z3d + 380; }

function initThreeScene() {
    if (isThreeInitialized || typeof THREE === 'undefined') return;

    threeContainer = document.getElementById('three-container');
    if (!threeContainer) return;

    const width = threeContainer.clientWidth || window.innerWidth;
    const height = threeContainer.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    scene3D = new THREE.Scene();
    scene3D.background = new THREE.Color(0x050811);
    scene3D.fog = new THREE.FogExp2(0x0c0f1d, 0.0005);

    // Dynamic 3D Perspective Camera (tactical isometric angle looking at habitat)
    camera3D = new THREE.PerspectiveCamera(40, width / height, 10, 4500);
    const startX = state && state.player ? to3DX(state.player.x) : 0;
    const startZ = state && state.player ? to3DZ(state.player.y) : 0;
    camera3D.position.set(startX, 450, startZ + 360);
    camera3D.lookAt(startX, 22, startZ);

    // 2. WebGL Renderer with High-Fidelity Soft Shadows
    renderer3D = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer3D.setSize(width, height);
    renderer3D.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer3D.shadowMap.enabled = true;
    renderer3D.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer3D.toneMapping = THREE.ACESFilmicToneMapping;
    renderer3D.toneMappingExposure = 1.15;
    threeContainer.innerHTML = '';
    threeContainer.appendChild(renderer3D.domElement);

    raycaster3D = new THREE.Raycaster();
    mouse3D = new THREE.Vector2();
    roomFloorDecals = {}; doorwayBadges = []; roomMachineryAnimations = []; techReferenceSprites = [];

    // 3. Lighting Architecture
    const ambientLight = new THREE.AmbientLight(0x334155, 0.95);
    scene3D.add(ambientLight);

    const marsSun = new THREE.DirectionalLight(0xffa257, 1.4);
    marsSun.position.set(-450, 750, -300);
    marsSun.castShadow = true;
    marsSun.shadow.mapSize.width = 2048;
    marsSun.shadow.mapSize.height = 2048;
    marsSun.shadow.camera.near = 100;
    marsSun.shadow.camera.far = 2200;
    const d = 800;
    marsSun.shadow.camera.left = -d;
    marsSun.shadow.camera.right = d;
    marsSun.shadow.camera.top = d;
    marsSun.shadow.camera.bottom = -d;
    marsSun.shadow.bias = -0.0005;
    scene3D.add(marsSun);

    emergencyLight3D = new THREE.PointLight(0xef4444, 0, 450);
    emergencyLight3D.position.set(0, 75, 0);
    scene3D.add(emergencyLight3D);

    // 4. Build 3D Environment, Habitat Architecture & Holographic Signage
    build3DMarsEnvironment();
    build3DHabitatArchitecture();
    build3DEquipmentConsoles();
    build3DRoomMachinery();
    build3DCrewNPCs();
    build3DCadetNova();

    // 5. Pointer Raycaster
    renderer3D.domElement.addEventListener('pointerdown', onThreePointerDown);

    window.addEventListener('resize', onThreeResize);
    isThreeInitialized = true;
}

function onThreeResize() {
    if (!renderer3D || !camera3D || !threeContainer) return;
    const width = threeContainer.clientWidth || window.innerWidth;
    const height = threeContainer.clientHeight || window.innerHeight;
    if (width === 0 || height === 0) return;
    camera3D.aspect = width / height;
    camera3D.updateProjectionMatrix();
    renderer3D.setSize(width, height);
}

function onThreePointerDown(e) {
    if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) return;
    if (!renderer3D || !camera3D) return;

    const rect = renderer3D.domElement.getBoundingClientRect();
    mouse3D.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse3D.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster3D.setFromCamera(mouse3D, camera3D);

    // 1. Check if clicked on interactive console
    const interactables = Object.values(object3DMeshes).map(o => o.mesh);
    const hits = raycaster3D.intersectObjects(interactables, true);
    if (hits.length > 0) {
        let hitObj = hits[0].object;
        while (hitObj.parent && !hitObj.userData.objectId) {
            hitObj = hitObj.parent;
        }
        if (hitObj.userData.objectId) {
            const objId = hitObj.userData.objectId;
            const targetObj = OBJECTS.find(o => o.id === objId);
            if (targetObj) {
                const dist = Math.hypot(state.player.x - targetObj.x, state.player.y - targetObj.y);
                if (dist <= targetObj.radius + 45) {
                    if (typeof triggerNearestObjectInteraction === 'function') triggerNearestObjectInteraction();
                    return;
                } else {
                    state.player.targetX = targetObj.x;
                    state.player.targetY = targetObj.y;
                    state.player.targetAction = { type: 'object', target: targetObj };
                    if (typeof spawnClickMarker === 'function') spawnClickMarker(targetObj.x, targetObj.y, '#38bdf8');
                    if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
                    return;
                }
            }
        }
    }

    // 1b. Check if clicked on prop prompt for details
    if (techReferenceSprites && techReferenceSprites.length > 0) {
        const propHits = raycaster3D.intersectObjects(techReferenceSprites, false);
        if (propHits.length > 0) {
            const hitProp = propHits[0].object.userData.prop;
            if (hitProp && typeof showPropDetailsCard === 'function') {
                const dist = Math.hypot(state.player.x - hitProp.x, state.player.y - hitProp.y);
                if (dist <= 65) {
                    showPropDetailsCard(hitProp);
                    return;
                }
            }
        }
    }

    // 1c. Check if clicked on crew NPC
    if (typeof CREW_NPCS !== 'undefined' && crew3DMeshes) {
        const crewMeshes = Object.values(crew3DMeshes).map(c => c.mesh);
        const crewHits = raycaster3D.intersectObjects(crewMeshes, true);
        if (crewHits.length > 0) {
            let hitNpcObj = crewHits[0].object;
            while (hitNpcObj.parent && !hitNpcObj.userData.npcId) {
                hitNpcObj = hitNpcObj.parent;
            }
            if (hitNpcObj.userData.npcId) {
                const npcId = hitNpcObj.userData.npcId;
                const targetNpc = CREW_NPCS.find(n => n.id === npcId);
                if (targetNpc) {
                    const dist = Math.hypot(state.player.x - targetNpc.x, state.player.y - targetNpc.y);
                    if (dist <= 65) {
                        state.player.targetX = null;
                        state.player.targetY = null;
                        state.player.targetAction = null;
                        if (targetNpc.dialogues && typeof startDialogueSequence === 'function') {
                            startDialogueSequence(targetNpc.dialogues, state.chapterIdx);
                        }
                        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
                        return;
                    } else {
                        state.player.targetX = targetNpc.x;
                        state.player.targetY = targetNpc.y;
                        state.player.targetAction = { type: 'npc', target: targetNpc };
                        if (typeof spawnClickMarker === 'function') spawnClickMarker(targetNpc.x, targetNpc.y, '#22c55e');
                        if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
                        return;
                    }
                }
            }
        }
    }

    // 2. Check if clicked ground for walking (with doorway threshold support)
    const groundHits = raycaster3D.intersectObjects(scene3D.children, true);
    for (const gh of groundHits) {
        if (gh.object.userData.isGround) {
            const worldX = from3DX(gh.point.x);
            const worldY = from3DZ(gh.point.z);
            const insideWall = (typeof checkWallCollision === 'function') ? checkWallCollision(worldX, worldY, 10) : false;
            if (!insideWall) {
                state.player.targetX = Math.max(45, Math.min(1145, worldX));
                state.player.targetY = Math.max(55, Math.min(705, worldY));
                state.player.targetAction = null;
                if (typeof spawnClickMarker === 'function') spawnClickMarker(state.player.targetX, state.player.targetY, '#38bdf8');
                if (window.sfx && typeof sfx.beep === 'function') sfx.beep();
            }
            break;
        }
    }
}

// --- 3D ENVIRONMENT BUILDERS ---
function build3DMarsEnvironment() {
    const marsGeo = new THREE.PlaneGeometry(1600, 1100, 48, 36);
    const pos = marsGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vz = pos.getY(i);
        if (vx < to3DX(270)) {
            pos.setZ(i, Math.sin(vx * 0.015) * 8 + Math.cos(vz * 0.02) * 6);
        } else {
            pos.setZ(i, 0);
        }
    }
    marsGeo.computeVertexNormals();

    const marsMat = new THREE.MeshStandardMaterial({
        color: 0x9a3412,
        roughness: 0.92,
        metalness: 0.05,
        flatShading: true
    });
    const marsTerrain = new THREE.Mesh(marsGeo, marsMat);
    marsTerrain.rotation.x = -Math.PI / 2;
    marsTerrain.position.y = -1;
    marsTerrain.receiveShadow = true;
    marsTerrain.userData.isGround = true;
    scene3D.add(marsTerrain);

    // Outdoor Martian Boulders
    const rockGeo = new THREE.DodecahedronGeometry(8, 1);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.85 });
    for (let i = 0; i < 22; i++) {
        const rock = new THREE.Mesh(rockGeo, rockMat);
        const rx = to3DX(30 + Math.random() * 200);
        const rz = to3DZ(40 + Math.random() * 680);
        rock.position.set(rx, 4, rz);
        const s = 0.5 + Math.random() * 1.2;
        rock.scale.set(s, s * (0.6 + Math.random() * 0.5), s);
        rock.rotation.set(Math.random(), Math.random(), Math.random());
        rock.castShadow = true;
        rock.receiveShadow = true;
        scene3D.add(rock);
    }


}

// --- HIGH-PERFORMANCE ANTI-ALIASED TEXTURE FILTER ---
// Uses hardware Trilinear Mipmapping + Anisotropic Filtering to eliminate
// 100% of movement shimmer, pixel-crawl, subpixel moiré, and harsh jaggies!
function makeSmoothTexture(canvas) {
    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    if (typeof renderer3D !== 'undefined' && renderer3D && renderer3D.capabilities) {
        texture.anisotropy = Math.min(renderer3D.capabilities.getMaxAnisotropy(), 8);
    }
    return texture;
}

// --- HIGH-VISIBILITY [E] INTERACT PROMPT GENERATOR ---
// Crisp, large, and readable floating pill that fades in when Cadet Nova approaches consoles
function createCompactInteractPrompt(obj) {
    const canvas = document.createElement('canvas');
    canvas.width = 560;
    canvas.height = 144;
    const ctx = canvas.getContext('2d');

    const themeCol = obj.color || '#38bdf8';

    // Dark high-contrast glass pill background
    ctx.fillStyle = 'rgba(8, 13, 26, 0.95)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 544, 128, 36);
    ctx.fill();

    // Vivid neon border
    ctx.lineWidth = 6;
    ctx.strokeStyle = themeCol;
    ctx.stroke();

    // Left Keycap Badge: [E]
    ctx.fillStyle = themeCol;
    ctx.beginPath();
    ctx.roundRect(20, 20, 104, 104, 20);
    ctx.fill();

    ctx.fillStyle = '#020617';
    ctx.font = '900 64px "Orbitron", "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('E', 72, 72);

    // Right label: "INTERACT" in large, bold Orbitron typography
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 48px "Orbitron", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('INTERACT', 340, 72);

    const texture = makeSmoothTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.0,
        depthTest: false,
        depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    // Generously scaled up for high readability (was 16 x 4.1)
    sprite.scale.set(34, 8.8, 1);
    const elev = (obj.id === 'solar_array_eva' ? 42 : (obj.id === 'mars_rover' ? 34 : 28));
    sprite.position.set(0, elev, 0);
    sprite.userData.baseY = elev;
    sprite.userData.isInteractPrompt = true;
    sprite.userData.obj = obj;
    sprite.visible = false;
    return sprite;
}

// --- FLOOR-PROJECTED HOLOGRAPHIC ROOM STENCIL GENERATOR ---
// Projects crisp, high-contrast room markings onto the floor with ZERO glowing blur!
function createRoomFloorDecal(room) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const col = room.borderColor || '#38bdf8';
    let cleanTitle = room.name.replace(/\(.*?\)/g, '').replace(/^\d+\.\s*/, '').trim().toUpperCase();
    let modNum = '';
    const match = room.name.match(/^(\d+)\./);
    if (match) modNum = 'MODULE 0' + match[1];
    else if (room.id === 'corridor') modNum = 'CENTRAL SPINE';
    else if (room.isOutdoor) modNum = 'SURFACE EVA';

    // Zero shadow blur for maximum crisp legibility
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    // 1. Sci-Fi Tech Corner Brackets & Frame
    ctx.strokeStyle = col;
    ctx.lineWidth = 6;

    const bLen = 64;
    // Top-Left
    ctx.beginPath(); ctx.moveTo(32, 32 + bLen); ctx.lineTo(32, 32); ctx.lineTo(32 + bLen, 32); ctx.stroke();
    // Top-Right
    ctx.beginPath(); ctx.moveTo(992 - bLen, 32); ctx.lineTo(992, 32); ctx.lineTo(992, 32 + bLen); ctx.stroke();
    // Bottom-Left
    ctx.beginPath(); ctx.moveTo(32, 480 - bLen); ctx.lineTo(32, 480); ctx.lineTo(32 + bLen, 480); ctx.stroke();
    // Bottom-Right
    ctx.beginPath(); ctx.moveTo(992 - bLen, 480); ctx.lineTo(992, 480); ctx.lineTo(992, 480 - bLen); ctx.stroke();

    // Divider rule
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(120, 220);
    ctx.lineTo(904, 220);
    ctx.stroke();

    // 2. Module Number Tag (Zero glow blur)
    ctx.fillStyle = col;
    ctx.font = 'bold 38px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('◄ ' + modNum + ' ►', 512, 145);

    // 3. Room Title (Solid, pure white, crisp bold Orbitron, zero blur)
    // Dynamic text size fitting so long titles like "RADIATION SHELTER & QUARTERS" fit completely
    const maxTitleWidth = 840;
    let titleFontSize = 62;
    ctx.font = `bold ${titleFontSize}px "Orbitron", sans-serif`;
    while (ctx.measureText(cleanTitle).width > maxTitleWidth && titleFontSize > 28) {
        titleFontSize -= 2;
        ctx.font = `bold ${titleFontSize}px "Orbitron", sans-serif`;
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillText(cleanTitle, 512, 305, maxTitleWidth);

    // 4. Subtitle / System Specification Tag
    let subtitle = 'PRESSURIZED HABITAT ZONE';
    if (room.id === 'power') subtitle = 'PHOTOVOLTAIC & FUEL CELL GRID';
    else if (room.id === 'lifesupport') subtitle = 'ECLSS O₂ & CO₂ REGULATION';
    else if (room.id === 'water') subtitle = 'GRAYWATER & CONDENSATE RECYCLING';
    else if (room.id === 'greenhouse') subtitle = 'HYDROPONIC CROP PRODUCTION';
    else if (room.id === 'lab') subtitle = 'SCIENCE, COMMS & MEDICAL BAY';
    else if (room.id === 'shelter') subtitle = 'REGOLITH RADIATION SHIELDED BUNKS';
    else if (room.id === 'airlock') subtitle = 'PRESSURE EQUALIZATION CHAMBER';

    let subFontSize = 28;
    ctx.font = `500 ${subFontSize}px "JetBrains Mono", monospace`;
    while (ctx.measureText(subtitle).width > maxTitleWidth && subFontSize > 18) {
        subFontSize -= 1;
        ctx.font = `500 ${subFontSize}px "JetBrains Mono", monospace`;
    }
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(subtitle, 512, 395, maxTitleWidth);

    const texture = makeSmoothTexture(canvas);

    const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.88,
        depthWrite: false
    });

    const geo = new THREE.PlaneGeometry(140, 70);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.28;
    mesh.userData.isGround = true;

    return { mesh, material: mat, roomId: room.id, baseOpacity: 0.88 };
}

// --- ILLUMINATED DOORWAY SIGNPOST GENERATOR ---
function createDoorwaySignSprite(door) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const col = '#' + door.color.toString(16).padStart(6, '0');

    // High contrast solid dark pill
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.roundRect(12, 12, 488, 232, 32);
    ctx.fill();

    // Clean border in portal color
    ctx.lineWidth = 6;
    ctx.strokeStyle = col;
    ctx.stroke();

    // Crisp White Text with zero blur & dynamic fitting (Clean humanist font)
    const maxDoorWidth = 440;
    let doorFontSize = 40;
    ctx.font = `bold ${doorFontSize}px "Inter", "Segoe UI", sans-serif`;
    while (ctx.measureText(door.label.toUpperCase()).width > maxDoorWidth && doorFontSize > 22) {
        doorFontSize -= 2;
        ctx.font = `bold ${doorFontSize}px "Inter", "Segoe UI", sans-serif`;
    }
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(door.label.toUpperCase(), 256, 128, maxDoorWidth);

    const texture = makeSmoothTexture(canvas);

    const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(64, 32, 1);
    return sprite;
}

function build3DHabitatArchitecture() {
    if (typeof ROOMS === 'undefined') return;

    // 1. Interior Floor Tiles, Ambient Room Glows & Floating Holographic Badges
    ROOMS.forEach(r => {
        const w = r.w;
        const h = r.h;
        const cx = to3DX(r.x + w / 2);
        const cz = to3DZ(r.y + h / 2);

        if (!r.isOutdoor) {
            // Habitat Floor Plate
            const floorGeo = new THREE.PlaneGeometry(w, h);
            const floorColor = new THREE.Color(r.floorColor).multiplyScalar(1.25);
            const floorMat = new THREE.MeshStandardMaterial({
                color: floorColor,
                roughness: 0.45,
                metalness: 0.35
            });
            const floorMesh = new THREE.Mesh(floorGeo, floorMat);
            floorMesh.rotation.x = -Math.PI / 2;
            floorMesh.position.set(cx, 0.2, cz);
            floorMesh.receiveShadow = true;
            floorMesh.userData.isGround = true;
            scene3D.add(floorMesh);

            // Room Dedicated Ambient Glow PointLight
            let lightCol = 0x38bdf8;
            if (r.id === 'power') lightCol = 0xf59e0b;
            else if (r.id === 'lifesupport') lightCol = 0x14b8a6;
            else if (r.id === 'greenhouse') lightCol = 0x22c55e;
            else if (r.id === 'water') lightCol = 0x3b82f6;
            else if (r.id === 'shelter') lightCol = 0xc084fc;
            else if (r.id === 'lab') lightCol = 0x818cf8;

            const roomLight = new THREE.PointLight(lightCol, 0.75, 260);
            roomLight.position.set(cx, 45, cz);
            scene3D.add(roomLight);
            roomLights[r.id] = roomLight;
        }

        // Floor-Projected Holographic Room Stencil (Lies on floor, fades out upon entering)
        if (!r.isOutdoor) {
            const decalObj = createRoomFloorDecal(r);
            let decalX = cx;
            let decalZ = cz;
            if (r.id === 'power') { decalX = to3DX(535); decalZ = to3DZ(195); }
            else if (r.id === 'lifesupport') { decalX = to3DX(770); decalZ = to3DZ(195); }
            else if (r.id === 'water') { decalX = to3DX(535); decalZ = to3DZ(565); }
            else if (r.id === 'greenhouse') { decalX = to3DX(770); decalZ = to3DZ(565); }
            else if (r.id === 'lab') { decalX = to3DX(960); decalZ = to3DZ(297); }
            else if (r.id === 'shelter') { decalX = to3DX(960); decalZ = to3DZ(452); }
            else if (r.id === 'airlock') { decalX = to3DX(345); decalZ = to3DZ(400); }
            else if (r.id === 'corridor') { decalX = to3DX(655); decalZ = to3DZ(385); }

            decalObj.mesh.position.set(decalX, 0.28, decalZ);
            scene3D.add(decalObj.mesh);
            roomFloorDecals[r.id] = decalObj;
        }
    });

    // 2. 3D-Printed Regolith Walls (Full continuous enclosure from HABITAT_WALLS)
    const wallHeight = 40;
    const wallMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.75,
        metalness: 0.35,
        flatShading: true
    });
    const capMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.45,
        metalness: 0.6
    });

    if (typeof HABITAT_WALLS !== 'undefined') {
        HABITAT_WALLS.forEach(w => {
            const wallGeo = new THREE.BoxGeometry(w.w, wallHeight, w.h);
            const wallMesh = new THREE.Mesh(wallGeo, wallMat);
            wallMesh.position.set(to3DX(w.x + w.w / 2), wallHeight / 2, to3DZ(w.y + w.h / 2));
            wallMesh.castShadow = true;
            wallMesh.receiveShadow = true;
            scene3D.add(wallMesh);

            const capGeo = new THREE.BoxGeometry(w.w + 0.8, 1.6, w.h + 0.8);
            const capMesh = new THREE.Mesh(capGeo, capMat);
            capMesh.position.set(to3DX(w.x + w.w / 2), wallHeight + 0.8, to3DZ(w.y + w.h / 2));
            scene3D.add(capMesh);
        });
    }

    // 3. 3D High-Tech Illuminated Doorway Portals & Animated Sliding Pressure Hatches
    if (typeof HABITAT_DOORWAYS !== 'undefined') {
        habitatDoor3DMeshes = [];
        const hazardTex = createHazardStripeTexture();
        const hazardMat = new THREE.MeshStandardMaterial({ map: hazardTex, roughness: 0.4, metalness: 0.2 });

        HABITAT_DOORWAYS.forEach(door => {
            const group = new THREE.Group();
            const cx = to3DX(door.x);
            const cz = to3DZ(door.y);
            group.position.set(cx, 0, cz);

            const doorColor = new THREE.Color(door.color);
            const frameMat = new THREE.MeshStandardMaterial({
                color: 0x1e293b,
                roughness: 0.35,
                metalness: 0.85
            });
            const neonMat = new THREE.MeshStandardMaterial({
                color: doorColor,
                emissive: doorColor,
                emissiveIntensity: 0.85,
                roughness: 0.1
            });

            const archHeight = 36;
            const isHorizontalDoor = (door.w > door.h);
            const hatchGroup = new THREE.Group();
            const hatchMat = new THREE.MeshStandardMaterial({
                color: 0x334155,
                roughness: 0.45,
                metalness: 0.8
            });
            const ledMat = new THREE.MeshStandardMaterial({
                color: 0xf59e0b,
                emissive: 0xf59e0b,
                emissiveIntensity: 0.9,
                roughness: 0.2
            });

            if (isHorizontalDoor) {
                const doorSpan = door.w;
                // Left & Right Jambs
                const lJamb = new THREE.Mesh(new THREE.BoxGeometry(3.5, archHeight, 14), frameMat);
                lJamb.position.set(-doorSpan / 2 + 1.75, archHeight / 2, 0);
                group.add(lJamb);

                const rJamb = new THREE.Mesh(new THREE.BoxGeometry(3.5, archHeight, 14), frameMat);
                rJamb.position.set(doorSpan / 2 - 1.75, archHeight / 2, 0);
                group.add(rJamb);

                // Top Lintel Header
                const lintel = new THREE.Mesh(new THREE.BoxGeometry(doorSpan, 4, 14), frameMat);
                lintel.position.set(0, archHeight - 2, 0);
                group.add(lintel);

                // Neon Indicator Strip
                const neon = new THREE.Mesh(new THREE.BoxGeometry(doorSpan - 8, 1.5, 14.5), neonMat);
                neon.position.set(0, archHeight - 4, 0);
                group.add(neon);

                // Floor Threshold (allows direct click walking through doorway)
                const threshold = new THREE.Mesh(new THREE.PlaneGeometry(doorSpan, 12), neonMat);
                threshold.rotation.x = -Math.PI / 2;
                threshold.position.set(0, 0.3, 0);
                threshold.userData.isGround = true;
                group.add(threshold);

                // Sliding Pressure Door Hatch
                const hatch = new THREE.Mesh(new THREE.BoxGeometry(doorSpan - 6, archHeight - 4, 3.2), hatchMat);
                hatch.position.set(0, (archHeight - 4) / 2 + 1, 0);
                hatch.castShadow = true;
                hatchGroup.add(hatch);

                const hazStripeMesh = new THREE.Mesh(new THREE.BoxGeometry(doorSpan - 12, 4.5, 3.6), hazardMat);
                hazStripeMesh.position.set(0, (archHeight - 4) / 2 + 1, 0);
                hatchGroup.add(hazStripeMesh);

                const ledLight = new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 8), ledMat);
                ledLight.position.set(0, (archHeight - 4) / 2 + 7, 1.8);
                hatchGroup.add(ledLight);
            } else {
                const doorSpan = door.h;
                // Top & Bottom Jambs
                const tJamb = new THREE.Mesh(new THREE.BoxGeometry(14, archHeight, 3.5), frameMat);
                tJamb.position.set(0, archHeight / 2, -doorSpan / 2 + 1.75);
                group.add(tJamb);

                const bJamb = new THREE.Mesh(new THREE.BoxGeometry(14, archHeight, 3.5), frameMat);
                bJamb.position.set(0, archHeight / 2, doorSpan / 2 - 1.75);
                group.add(bJamb);

                // Top Lintel Header
                const lintel = new THREE.Mesh(new THREE.BoxGeometry(14, 4, doorSpan), frameMat);
                lintel.position.set(0, archHeight - 2, 0);
                group.add(lintel);

                // Neon Indicator Strip
                const neon = new THREE.Mesh(new THREE.BoxGeometry(14.5, 1.5, doorSpan - 8), neonMat);
                neon.position.set(0, archHeight - 4, 0);
                group.add(neon);

                // Floor Threshold (allows direct click walking through doorway)
                const threshold = new THREE.Mesh(new THREE.PlaneGeometry(12, doorSpan), neonMat);
                threshold.rotation.x = -Math.PI / 2;
                threshold.position.set(0, 0.3, 0);
                threshold.userData.isGround = true;
                group.add(threshold);

                // Sliding Pressure Door Hatch
                const hatch = new THREE.Mesh(new THREE.BoxGeometry(3.2, archHeight - 4, doorSpan - 6), hatchMat);
                hatch.position.set(0, (archHeight - 4) / 2 + 1, 0);
                hatch.castShadow = true;
                hatchGroup.add(hatch);

                const hazStripeMesh = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.5, doorSpan - 12), hazardMat);
                hazStripeMesh.position.set(0, (archHeight - 4) / 2 + 1, 0);
                hatchGroup.add(hazStripeMesh);

                const ledLight = new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 8), ledMat);
                ledLight.position.set(1.8, (archHeight - 4) / 2 + 7, 0);
                hatchGroup.add(ledLight);
            }

            group.add(hatchGroup);
            habitatDoor3DMeshes.push({
                id: door.id,
                x: door.x,
                y: door.y,
                hatchGroup: hatchGroup,
                ledMat: ledMat,
                closedY: 0,
                openY: archHeight + 10
            });

            // Portal Soft Down-Light
            const portalLight = new THREE.PointLight(door.color, 0.65, 80);
            portalLight.position.set(0, archHeight - 8, 0);
            group.add(portalLight);

            scene3D.add(group);
        });
    }
}

// --- PROCEDURAL NASA HARDWARE TEXTURE GENERATORS ---
function createHazardStripeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    for (let i = -128; i < 256; i += 28) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 128, 128);
        ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

function createSolarPanelTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#082f49';
    ctx.lineWidth = 4;
    for (let x = 0; x <= 256; x += 64) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
    }
    for (let y = 0; y <= 256; y += 64) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
    }
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2;
    for (let x = 16; x < 256; x += 32) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
    }
    return new THREE.CanvasTexture(canvas);
}

function createTelemetryScreenTexture(title, colHex, subtext, iconType) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, 256, 160);

    ctx.strokeStyle = colHex;
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 248, 152);

    ctx.fillStyle = colHex;
    ctx.font = 'bold 16px "Orbitron", sans-serif';
    ctx.fillText(title, 14, 26);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText(subtext || 'SYSTEM NOMINAL', 14, 42);

    if (iconType === 'ecg') {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(14, 95); ctx.lineTo(55, 95); ctx.lineTo(70, 75); ctx.lineTo(80, 125);
        ctx.lineTo(95, 50); ctx.lineTo(110, 110); ctx.lineTo(120, 95); ctx.lineTo(175, 95);
        ctx.lineTo(190, 75); ctx.lineTo(200, 125); ctx.lineTo(215, 50); ctx.lineTo(242, 95);
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 16px "Orbitron", sans-serif';
        ctx.fillText('HR: 72 BPM  SpO2: 99%', 14, 145);
    } else if (iconType === 'bars') {
        const barColors = ['#22c55e', '#22c55e', '#22c55e', '#eab308', '#f59e0b'];
        for (let b = 0; b < 10; b++) {
            const bh = 15 + Math.sin(b * 0.8) * 25 + 20;
            ctx.fillStyle = barColors[b % barColors.length];
            ctx.fillRect(16 + b * 22, 130 - bh, 16, bh);
        }
    } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        for (let gy = 60; gy <= 130; gy += 20) {
            ctx.beginPath(); ctx.moveTo(14, gy); ctx.lineTo(242, gy); ctx.stroke();
        }
        ctx.strokeStyle = colHex;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 14; x <= 242; x += 4) {
            const y = 95 + Math.sin(x * 0.08) * 22;
            if (x === 14) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = colHex;
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText('TELEMETRY: ACTIVE', 14, 145);
    }

    return new THREE.CanvasTexture(canvas);
}

function createGaugeDialTexture(label) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(64, 64, 60, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(64, 64, 46, Math.PI * 0.75, Math.PI * 1.8);
    ctx.stroke();

    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(64, 64, 46, Math.PI * 1.8, Math.PI * 2.25);
    ctx.stroke();

    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(64, 64);
    ctx.lineTo(64 + Math.cos(Math.PI * 1.3) * 36, 64 + Math.sin(Math.PI * 1.3) * 36);
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, 64, 98);

    return new THREE.CanvasTexture(canvas);
}

// --- HIGH-VISIBILITY [Q] DETAILS PROMPT GENERATOR FOR PROPS ---
// Crisp, large, and readable floating pill that fades in when Cadet Nova approaches hardware props
function createCompactPropPrompt(prop) {
    const canvas = document.createElement('canvas');
    canvas.width = 520;
    canvas.height = 144;
    const ctx = canvas.getContext('2d');

    // Dark high-contrast glass pill background
    ctx.fillStyle = 'rgba(8, 13, 26, 0.95)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 504, 128, 36);
    ctx.fill();

    // Cyan/Sky vivid border
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#0ea5e9';
    ctx.stroke();

    // Left Keycap Badge: [Q]
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.roundRect(20, 20, 104, 104, 20);
    ctx.fill();

    ctx.fillStyle = '#020617';
    ctx.font = '900 64px "Orbitron", "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Q', 72, 72);

    // Right label: "DETAILS"
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 48px "Orbitron", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DETAILS', 320, 72);

    const texture = makeSmoothTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.0,
        depthTest: false,
        depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    // Generously scaled up for high readability (was 14 x 3.8)
    sprite.scale.set(30, 8.3, 1);
    const elev = (prop.h ? prop.h + 18 : 28);
    sprite.position.set(to3DX(prop.x), elev, to3DZ(prop.y));
    sprite.userData.baseY = elev;
    sprite.userData.prop = prop;
    sprite.visible = false;
    return sprite;
}

function build3DEquipmentConsoles() {
    if (typeof OBJECTS === 'undefined') return;

    OBJECTS.forEach(obj => {
        const group = new THREE.Group();
        group.position.set(to3DX(obj.x), 0, to3DZ(obj.y));
        group.userData.objectId = obj.id;

        const baseMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.4,
            metalness: 0.6
        });
        const glowColor = new THREE.Color(obj.color);
        const accentMat = new THREE.MeshStandardMaterial({
            color: glowColor,
            emissive: glowColor,
            emissiveIntensity: 0.65,
            roughness: 0.2
        });

        if (obj.id === 'solar_array_eva') {
            const poleGeo = new THREE.CylinderGeometry(2.5, 2.5, 30, 8);
            const pole = new THREE.Mesh(poleGeo, baseMat);
            pole.position.y = 15;
            group.add(pole);

            const panelGeo = new THREE.BoxGeometry(64, 2, 40);
            const solarTex = createSolarPanelTexture();
            const panelMat = new THREE.MeshStandardMaterial({
                map: solarTex,
                color: 0xffffff,
                metalness: 0.85,
                roughness: 0.15
            });
            const panel = new THREE.Mesh(panelGeo, panelMat);
            panel.position.set(0, 28, 0);
            panel.rotation.x = -Math.PI / 5;
            panel.castShadow = true;
            group.add(panel);
        } else if (obj.id === 'mars_rover') {
            const proceduralRover = new THREE.Group();
            const bodyGeo = new THREE.BoxGeometry(38, 16, 26);
            const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 });
            const roverBody = new THREE.Mesh(bodyGeo, bodyMat);
            roverBody.position.y = 14;
            roverBody.castShadow = true;
            proceduralRover.add(roverBody);

            const wheelGeo = new THREE.CylinderGeometry(5.5, 5.5, 4, 12);
            const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
            [-14, 14].forEach(wx => {
                [-14, 14].forEach(wz => {
                    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
                    wheel.rotation.z = Math.PI / 2;
                    wheel.position.set(wx, 5.5, wz);
                    wheel.castShadow = true;
                    proceduralRover.add(wheel);
                });
            });
            group.add(proceduralRover);

            // Mast camera & antenna
            const mastGeo = new THREE.CylinderGeometry(1.5, 1.5, 16, 8);
            const mastMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 });
            const mast = new THREE.Mesh(mastGeo, mastMat);
            mast.position.set(10, 24, 0);
            proceduralRover.add(mast);

            const camGeo = new THREE.BoxGeometry(6, 4, 8);
            const camMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
            const cam = new THREE.Mesh(camGeo, camMat);
            cam.position.set(10, 32, 0);
            proceduralRover.add(cam);

            // Companion: Ingenuity Mars Helicopter on Mars regolith surface
            const heliGroup = new THREE.Group();
            heliGroup.position.set(to3DX(135), 0, to3DZ(460));
            heliGroup.userData.objectId = 'ingenuity_helicopter';

            const procHeli = new THREE.Group();
            const heliBody = new THREE.Mesh(
                new THREE.BoxGeometry(8, 8, 8),
                new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 })
            );
            heliBody.position.y = 6;
            procHeli.add(heliBody);

            // Rotor blades
            const bladeGeo = new THREE.BoxGeometry(20, 0.4, 2);
            const bladeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
            const rotor1 = new THREE.Mesh(bladeGeo, bladeMat);
            rotor1.position.y = 11;
            procHeli.add(rotor1);
            const rotor2 = new THREE.Mesh(bladeGeo, bladeMat);
            rotor2.position.y = 13;
            rotor2.rotation.y = Math.PI / 2;
            procHeli.add(rotor2);

            heliGroup.add(procHeli);
            scene3D.add(heliGroup);
        } else if (obj.id === 'storage_locker') {
            const cabGeo = new THREE.BoxGeometry(26, 24, 18);
            const cab = new THREE.Mesh(cabGeo, baseMat);
            cab.position.y = 12;
            cab.castShadow = true;
            group.add(cab);

            const latchGeo = new THREE.BoxGeometry(28, 3, 20);
            const latch = new THREE.Mesh(latchGeo, accentMat);
            latch.position.y = 12;
            group.add(latch);
        } else {
            // MASTER CONTROL TERMINAL FOR HABITAT CUBICLE
            const plinthGeo = new THREE.BoxGeometry(28, 3, 20);
            const plinth = new THREE.Mesh(plinthGeo, new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, metalness: 0.4 }));
            plinth.position.y = 1.5;
            group.add(plinth);

            const deskGeo = new THREE.BoxGeometry(24, 11, 16);
            const desk = new THREE.Mesh(deskGeo, baseMat);
            desk.position.y = 8.5;
            desk.castShadow = true;
            group.add(desk);

            const padGeo = new THREE.BoxGeometry(18, 1, 6);
            const padMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
            const pad = new THREE.Mesh(padGeo, padMat);
            pad.position.set(0, 14.5, 3);
            pad.rotation.x = Math.PI / 12;
            group.add(pad);

            // Procedural Telemetry Screen Texture for Main Display
            const colHex = '#' + glowColor.getHexString();
            let screenType = 'bars';
            if (obj.id === 'lab_console') screenType = 'ecg';
            else if (obj.id === 'co2_scrubber' || obj.id === 'water_recycler') screenType = 'sine';

            const scrTex = createTelemetryScreenTexture(obj.name.split('&')[0].trim().toUpperCase(), colHex, 'AUTONOMOUS HUB', screenType);
            const screenMat = new THREE.MeshStandardMaterial({
                map: scrTex,
                roughness: 0.2,
                metalness: 0.1,
                emissive: glowColor,
                emissiveIntensity: 0.4
            });

            const screenGeo = new THREE.BoxGeometry(16, 10, 1.5);
            const screen = new THREE.Mesh(screenGeo, screenMat);
            screen.position.set(0, 19, -4);
            screen.rotation.x = -Math.PI / 10;
            group.add(screen);

            const sideGeo = new THREE.BoxGeometry(6, 7, 1);
            const leftScreen = new THREE.Mesh(sideGeo, accentMat);
            leftScreen.position.set(-10, 18, -2);
            leftScreen.rotation.set(-Math.PI / 12, Math.PI / 5, 0);
            group.add(leftScreen);

            const rightScreen = new THREE.Mesh(sideGeo, accentMat);
            rightScreen.position.set(10, 18, -2);
            rightScreen.rotation.set(-Math.PI / 12, -Math.PI / 5, 0);
            group.add(rightScreen);

            const ringGeo = new THREE.TorusGeometry(8.5, 0.75, 8, 28);
            const ringMat = new THREE.MeshBasicMaterial({ color: glowColor, wireframe: true });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.set(0, 29, 0);
            ring.rotation.x = Math.PI / 2;
            group.add(ring);
            group.userData.ring = ring;
        }

        // Sleek Minimalist [E] Interact Prompt (Fades in only when close, zero clutter)
        const interactPrompt = createCompactInteractPrompt(obj);
        group.add(interactPrompt);
        group.userData.prompt = interactPrompt;

        scene3D.add(group);
        object3DMeshes[obj.id] = { mesh: group, data: obj };
        window.object3DMeshes = object3DMeshes;
        window.techReferenceSprites = techReferenceSprites;
    });
}

// --- DEDICATED ROOM SURROUNDING MACHINERY BUILDER ---
// Enriches each cubicle with authentic NASA habitat hardware, tanks, vertical farming racks,
// and diagnostics while keeping the central Master Control Console as the room\'s brain,
// and preserving 100% unobstructed clearance for the floor decals!
function build3DRoomMachinery() {
    roomMachineryAnimations = [];
    techReferenceSprites = [];

    const metalDarkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.6 });
    const metalLightMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.8 });
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.25, metalness: 0.85 });
    const hazardTex = createHazardStripeTexture();
    const hazardMat = new THREE.MeshStandardMaterial({ map: hazardTex, roughness: 0.4, metalness: 0.2 });

    // 1. POWER ROOM (MODULE 02)
    // Lithium Battery Storage Racks (West Wall: x=445, y=65, 100, 135)
    [65, 100, 135].forEach((py, idx) => {
        const batGroup = new THREE.Group();
        batGroup.position.set(to3DX(445), 0, to3DZ(py));

        const cabMesh = new THREE.Mesh(new THREE.BoxGeometry(16, 26, 22), metalDarkMat);
        cabMesh.position.y = 13;
        cabMesh.castShadow = true;
        batGroup.add(cabMesh);

        // Vertical LED State of Charge Bar
        const ledMat = new THREE.MeshStandardMaterial({
            color: 0x22c55e,
            emissive: 0x22c55e,
            emissiveIntensity: 0.85,
            roughness: 0.2
        });
        const ledBar = new THREE.Mesh(new THREE.BoxGeometry(2.5, 18, 2), ledMat);
        ledBar.position.set(8.2, 13, 0);
        batGroup.add(ledBar);

        const ventMesh = new THREE.Mesh(new THREE.BoxGeometry(12, 1.5, 16), metalLightMat);
        ventMesh.position.set(0, 26.5, 0);
        batGroup.add(ventMesh);

        // Wall Cable Conduit
        const conduit = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 14, 8), metalDarkMat);
        conduit.position.set(-6, 20, 0);
        conduit.rotation.z = Math.PI / 2;
        batGroup.add(conduit);

        scene3D.add(batGroup);
        roomMachineryAnimations.push({
            update: (now) => {
                ledMat.emissiveIntensity = 0.65 + Math.sin(now * 0.004 + idx) * 0.3;
            }
        });
    });

    // Step-Down Transformer Station (North Wall: x=535, y=55)
    const transGroup = new THREE.Group();
    transGroup.position.set(to3DX(535), 0, to3DZ(55));
    const transBase = new THREE.Mesh(new THREE.BoxGeometry(62, 18, 18), metalDarkMat);
    transBase.position.y = 9;
    transBase.castShadow = true;
    transGroup.add(transBase);

    // Hazard Plate with Realistic 45-degree Stripes
    const hazStripe = new THREE.Mesh(new THREE.BoxGeometry(56, 3.5, 1), hazardMat);
    hazStripe.position.set(0, 7, 9.2);
    transGroup.add(hazStripe);

    [-18, 0, 18].forEach(cx => {
        const coil = new THREE.Mesh(
            new THREE.CylinderGeometry(4.5, 4.5, 12, 12),
            new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3, metalness: 0.85 })
        );
        coil.position.set(cx, 18, 0);
        coil.castShadow = true;
        transGroup.add(coil);

        const insul = new THREE.Mesh(
            new THREE.CylinderGeometry(1.6, 2.2, 7, 8),
            new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.2, metalness: 0.1 })
        );
        insul.position.set(cx, 26, 0);
        transGroup.add(insul);
    });
    scene3D.add(transGroup);

    // High Voltage Breaker Panels (East Wall: x=625, y=80 & 140)
    [80, 140].forEach(py => {
        const pnl = new THREE.Group();
        pnl.position.set(to3DX(625), 0, to3DZ(py));
        const cab = new THREE.Mesh(new THREE.BoxGeometry(16, 28, 30), metalDarkMat);
        cab.position.y = 14;
        cab.castShadow = true;
        pnl.add(cab);

        const readout = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 6, 18),
            new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.75 })
        );
        readout.position.set(-8.2, 20, 0);
        pnl.add(readout);
        scene3D.add(pnl);
    });

    // 2. LIFE-SUPPORT (ECLSS) ROOM (MODULE 03)
    // Sabatier Catalytic Reactor Tower (North Wall: x=770, y=55)
    const sabGroup = new THREE.Group();
    sabGroup.position.set(to3DX(770), 0, to3DZ(55));
    const sabTower = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 8.5, 28, 16), metalLightMat);
    sabTower.position.y = 14;
    sabTower.castShadow = true;
    sabGroup.add(sabTower);

    const heatJacket = new THREE.Mesh(
        new THREE.CylinderGeometry(9, 9, 12, 16),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.4 })
    );
    heatJacket.position.y = 12;
    sabGroup.add(heatJacket);

    // Realistic Wall Manifold Connecting Pipe
    const sabPipe = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 16, 8), pipeMat);
    sabPipe.position.set(0, 22, -8);
    sabPipe.rotation.x = Math.PI / 2;
    sabGroup.add(sabPipe);

    const sabGlow = new THREE.Mesh(
        new THREE.TorusGeometry(8, 0.9, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0x14b8a6, emissive: 0x14b8a6, emissiveIntensity: 0.8 })
    );
    sabGlow.rotation.x = Math.PI / 2;
    sabGlow.position.y = 20;
    sabGroup.add(sabGlow);
    scene3D.add(sabGroup);

    // Liquid Oxygen (LOX) Tanks (West Wall: x=675, y=115)
    const o2Group = new THREE.Group();
    o2Group.position.set(to3DX(675), 0, to3DZ(115));
    const loxMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.3 });
    const loxBandMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0ea5e9, emissiveIntensity: 0.6 });
    const loxGaugeTex = createGaugeDialTexture('O2 BAR');
    const gaugeMat = new THREE.MeshStandardMaterial({ map: loxGaugeTex, roughness: 0.3 });

    [-18, 0, 18].forEach(pz => {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 24, 14), loxMat);
        tank.position.set(0, 12, pz);
        tank.castShadow = true;
        o2Group.add(tank);

        const cap = new THREE.Mesh(new THREE.SphereGeometry(5.5, 12, 8), loxMat);
        cap.position.set(0, 24, pz);
        o2Group.add(cap);

        const band = new THREE.Mesh(new THREE.CylinderGeometry(5.7, 5.7, 4, 14), loxBandMat);
        band.position.set(0, 14, pz);
        o2Group.add(band);

        // Brass Handwheel Valve on top
        const valve = new THREE.Mesh(
            new THREE.TorusGeometry(2, 0.5, 6, 12),
            new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.9 })
        );
        valve.position.set(0, 28, pz);
        valve.rotation.x = Math.PI / 2;
        o2Group.add(valve);
    });

    // Pressure Gauge Mount on center tank
    const pGauge = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1.2, 16), gaugeMat);
    pGauge.position.set(5.8, 18, 0);
    pGauge.rotation.z = -Math.PI / 2;
    o2Group.add(pGauge);
    scene3D.add(o2Group);

    // Nitrogen (N2) Buffer Gas Cylinders (East Wall: x=865, y=115)
    const n2Group = new THREE.Group();
    n2Group.position.set(to3DX(865), 0, to3DZ(115));
    const n2Mat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.45, metalness: 0.5 });
    [-18, 0, 18].forEach(pz => {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.2, 24, 14), n2Mat);
        tank.position.set(0, 12, pz);
        tank.castShadow = true;
        n2Group.add(tank);

        const cap = new THREE.Mesh(new THREE.SphereGeometry(5.2, 12, 8), n2Mat);
        cap.position.set(0, 24, pz);
        n2Group.add(cap);
    });
    scene3D.add(n2Group);

    // 3. WATER-RECYCLING ROOM (MODULE 04)
    // Dual Vacuum Distillation Towers (South Wall: x=535, y=700)
    const distGroup = new THREE.Group();
    distGroup.position.set(to3DX(535), 0, to3DZ(700));
    const distBase = new THREE.Mesh(new THREE.BoxGeometry(62, 6, 20), metalDarkMat);
    distBase.position.y = 3;
    distGroup.add(distBase);

    [-16, 16].forEach(cx => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, 28, 16), metalLightMat);
        col.position.set(cx, 17, 0);
        col.castShadow = true;
        distGroup.add(col);
    });
    const bridgePipe = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 32, 10), pipeMat);
    bridgePipe.rotation.z = Math.PI / 2;
    bridgePipe.position.set(0, 26, 0);
    distGroup.add(bridgePipe);

    // Condenser Wall Link Pipe
    const wallPipe = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 16, 8), pipeMat);
    wallPipe.position.set(0, 26, 8);
    wallPipe.rotation.x = Math.PI / 2;
    distGroup.add(wallPipe);
    scene3D.add(distGroup);

    // Reverse Osmosis Membrane Filter Array (West Wall: x=445, y=620)
    const roGroup = new THREE.Group();
    roGroup.position.set(to3DX(445), 0, to3DZ(620));
    const roFrame = new THREE.Mesh(new THREE.BoxGeometry(16, 26, 56), metalDarkMat);
    roFrame.position.y = 13;
    roFrame.castShadow = true;
    roGroup.add(roFrame);

    const roTubeMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.65,
        roughness: 0.3
    });
    [-16, 0, 16].forEach(pz => {
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 18, 12), roTubeMat);
        tube.position.set(8.2, 13, pz);
        roGroup.add(tube);
    });
    scene3D.add(roGroup);

    // Potable Water Storage Cisterns (East Wall: x=625, y=620)
    const cistGroup = new THREE.Group();
    cistGroup.position.set(to3DX(625), 0, to3DZ(620));
    [-16, 16].forEach(pz => {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 26, 16), metalLightMat);
        tank.position.set(0, 13, pz);
        tank.castShadow = true;
        cistGroup.add(tank);

        const sightGlass = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 1, 18, 8),
            new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x3b82f6, emissiveIntensity: 0.8 })
        );
        sightGlass.position.set(-8.2, 13, pz);
        cistGroup.add(sightGlass);
    });
    scene3D.add(cistGroup);

    // 4. HYDROPONIC GREENHOUSE (MODULE 05)
    // Multi-Tier Vertical Salad Crop Racks (South Wall: x=770, y=700)
    const greenGroup = new THREE.Group();
    greenGroup.position.set(to3DX(770), 0, to3DZ(700));

    const rackFrame = new THREE.Mesh(new THREE.BoxGeometry(72, 30, 22), metalDarkMat);
    rackFrame.position.y = 15;
    rackFrame.castShadow = true;
    greenGroup.add(rackFrame);

    const cropMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.65 });
    const cropMat2 = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.6 });
    const cropMat3 = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.55 });
    const cropMats = [cropMat1, cropMat2, cropMat3];

    const growLightMat = new THREE.MeshStandardMaterial({
        color: 0xd946ef,
        emissive: 0xd946ef,
        emissiveIntensity: 0.95,
        roughness: 0.2
    });

    [9, 21].forEach(tierY => {
        const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(66, 1.2, 14), growLightMat);
        ledStrip.position.set(0, tierY + 7, 0);
        greenGroup.add(ledStrip);

        if (!window.greenhouseCropHeads) window.greenhouseCropHeads = [];
        for (let gx = -28; gx <= 28; gx += 9.5) {
            const m1 = cropMats[Math.abs(Math.round(gx)) % cropMats.length];
            const head = new THREE.Mesh(new THREE.SphereGeometry(3.6, 6, 6), m1);
            head.position.set(gx, tierY + 2, -2);
            head.scale.set(1.15, 0.75, 1.15);
            greenGroup.add(head);
            window.greenhouseCropHeads.push(head);

            const m2 = cropMats[(Math.abs(Math.round(gx)) + 1) % cropMats.length];
            const head2 = new THREE.Mesh(new THREE.SphereGeometry(3.2, 6, 6), m2);
            head2.position.set(gx + 4.5, tierY + 2, 4);
            head2.scale.set(1.1, 0.8, 1.1);
            greenGroup.add(head2);
            window.greenhouseCropHeads.push(head2);
        }
    });
    scene3D.add(greenGroup);

    // Microgreen Germination Station (West Wall: x=675, y=620)
    const microGroup = new THREE.Group();
    microGroup.position.set(to3DX(675), 0, to3DZ(620));
    const microBox = new THREE.Mesh(new THREE.BoxGeometry(16, 22, 54), metalDarkMat);
    microBox.position.y = 11;
    microBox.castShadow = true;
    microGroup.add(microBox);

    const warmLed = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 4, 46),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 0.8 })
    );
    warmLed.position.set(8.2, 16, 0);
    microGroup.add(warmLed);
    scene3D.add(microGroup);

    // Nutrient Dosing Reservoirs (East Wall: x=865, y=620)
    const nutGroup = new THREE.Group();
    nutGroup.position.set(to3DX(865), 0, to3DZ(620));
    [-18, 0, 18].forEach(pz => {
        const nutTank = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 22, 14), metalLightMat);
        nutTank.position.set(0, 11, pz);
        nutTank.castShadow = true;
        nutGroup.add(nutTank);

        const gauge = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 14, 2.5),
            new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.75 })
        );
        gauge.position.set(-5.2, 11, pz);
        nutGroup.add(gauge);
    });
    scene3D.add(nutGroup);

    // 5. LABORATORY & MEDICAL BAY (MODULE 06)
    // Bio-Diagnostic Stasis Exam Bed / Pod (North Wall: x=1030, y=65)
    const medGroup = new THREE.Group();
    medGroup.position.set(to3DX(1030), 0, to3DZ(65));

    const bedBase = new THREE.Mesh(
        new THREE.BoxGeometry(56, 10, 24),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35, metalness: 0.2 })
    );
    bedBase.position.y = 5;
    bedBase.castShadow = true;
    medGroup.add(bedBase);

    const matMesh = new THREE.Mesh(
        new THREE.BoxGeometry(50, 3, 20),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.7 })
    );
    matMesh.position.y = 11.5;
    medGroup.add(matMesh);

    // Pillow / Headrest
    const pillow = new THREE.Mesh(
        new THREE.BoxGeometry(10, 2.5, 16),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 })
    );
    pillow.position.set(-18, 13, 0);
    medGroup.add(pillow);

    const canopyMat = new THREE.MeshStandardMaterial({
        color: 0x818cf8,
        transparent: true,
        opacity: 0.35,
        roughness: 0.1,
        metalness: 0.1
    });
    const canopy = new THREE.Mesh(
        new THREE.CylinderGeometry(11, 11, 46, 16, 1, false, 0, Math.PI),
        canopyMat
    );
    canopy.rotation.z = Math.PI / 2;
    canopy.position.set(0, 14, 0);
    medGroup.add(canopy);

    // Vitals Monitor Screen with ECG Sinus Rhythm Waveform
    const ecgTex = createTelemetryScreenTexture('PATIENT VITALS', '#22c55e', 'ASTRONAUT HEALTH', 'ecg');
    const vitalsMat = new THREE.MeshStandardMaterial({
        map: ecgTex,
        roughness: 0.2,
        emissive: 0x22c55e,
        emissiveIntensity: 0.4
    });
    const vitalsScreen = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 1.5), vitalsMat);
    vitalsScreen.position.set(24, 18, 12);
    vitalsScreen.rotation.y = -Math.PI / 6;
    medGroup.add(vitalsScreen);
    scene3D.add(medGroup);

    // Analytical Specimen Centrifuge Workbench (East Wall: x=1140, y=170)
    const benchGroup = new THREE.Group();
    benchGroup.position.set(to3DX(1140), 0, to3DZ(170));
    const benchTop = new THREE.Mesh(new THREE.BoxGeometry(18, 14, 84), metalLightMat);
    benchTop.position.y = 7;
    benchTop.castShadow = true;
    benchGroup.add(benchTop);

    const centrifugeRotor = new THREE.Mesh(
        new THREE.CylinderGeometry(4.5, 4.5, 6, 16),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 })
    );
    centrifugeRotor.position.set(-3, 17, -18);
    benchGroup.add(centrifugeRotor);

    const scopeGeo = new THREE.BoxGeometry(4, 10, 5);
    const scopeMesh = new THREE.Mesh(scopeGeo, metalDarkMat);
    scopeMesh.position.set(-3, 19, 12);
    benchGroup.add(scopeMesh);

    // Geological Jezero Basalt Core Canister (Hermetic Sample Cylinder)
    const coreCylinderGeo = new THREE.CylinderGeometry(1.6, 1.6, 7.5, 16);
    const coreCylinderMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.85,
        roughness: 0.25,
        emissive: 0xd97706,
        emissiveIntensity: 0.35
    });
    const coreCanisterMesh = new THREE.Mesh(coreCylinderGeo, coreCylinderMat);
    coreCanisterMesh.rotation.z = Math.PI / 2;
    coreCanisterMesh.position.set(-3, 15.5, 0);
    benchGroup.add(coreCanisterMesh);
    coreCanisterMesh.visible = false;
    window.labCoreCanister = coreCanisterMesh;

    scene3D.add(benchGroup);
    roomMachineryAnimations.push({
        update: () => {
            centrifugeRotor.rotation.y += 0.05;
        }
    });

    // Comms & Deep Space Telemetry Server Rack (South Wall: x=1030, y=335)
    const commsGroup = new THREE.Group();
    commsGroup.position.set(to3DX(1030), 0, to3DZ(335));
    const rackBox = new THREE.Mesh(new THREE.BoxGeometry(52, 28, 16), metalDarkMat);
    rackBox.position.y = 14;
    rackBox.castShadow = true;
    commsGroup.add(rackBox);

    const rackLeds = new THREE.Mesh(
        new THREE.BoxGeometry(44, 20, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.7 })
    );
    rackLeds.position.set(0, 14, -8.2);
    commsGroup.add(rackLeds);
    scene3D.add(commsGroup);

    // 6. RADIATION SHELTER & QUARTERS (MODULE 07)
    // Astronaut Sleeping Bunks (East Wall: x=1135, y=460 & 630)
    [460, 630].forEach((py) => {
        const bunkGroup = new THREE.Group();
        bunkGroup.position.set(to3DX(1135), 0, to3DZ(py));

        const bunkMesh = new THREE.Mesh(new THREE.BoxGeometry(24, 26, 54), metalDarkMat);
        bunkMesh.position.y = 13;
        bunkMesh.castShadow = true;
        bunkGroup.add(bunkMesh);

        const bedPad = new THREE.Mesh(
            new THREE.BoxGeometry(18, 4, 46),
            new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 })
        );
        bedPad.position.set(-3, 10, 0);
        bunkGroup.add(bedPad);

        const readingLight = new THREE.PointLight(0xfef08a, 0.45, 45);
        readingLight.position.set(-4, 20, 16);
        bunkGroup.add(readingLight);

        scene3D.add(bunkGroup);
    });

    // Storm Shielding Wall (North Wall: x=1030, y=405)
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(to3DX(1030), 0, to3DZ(405));
    const shieldMesh = new THREE.Mesh(
        new THREE.BoxGeometry(72, 30, 18),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, metalness: 0.5 })
    );
    shieldMesh.position.y = 15;
    shieldMesh.castShadow = true;
    shieldGroup.add(shieldMesh);
    scene3D.add(shieldGroup);

    // Emergency Ration & Trauma Locker (South Wall: x=1030, y=700)
    const rationGroup = new THREE.Group();
    rationGroup.position.set(to3DX(1030), 0, to3DZ(700));
    const rationBox = new THREE.Mesh(new THREE.BoxGeometry(62, 26, 18), metalDarkMat);
    rationBox.position.y = 13;
    rationBox.castShadow = true;
    rationGroup.add(rationBox);

    const medCross = new THREE.Mesh(
        new THREE.BoxGeometry(14, 14, 1),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.6 })
    );
    medCross.position.set(0, 16, -9.2);
    rationGroup.add(medCross);
    scene3D.add(rationGroup);

    // 7. AIRLOCK & ENTRANCE (MODULE 01)
    // EVA Spacesuit Charging Stanchions (North Corners: x=295 & 395, y=310)
    [295, 395].forEach(px => {
        const suitDock = new THREE.Group();
        suitDock.position.set(to3DX(px), 0, to3DZ(310));

        const post = new THREE.Mesh(new THREE.BoxGeometry(26, 28, 10), metalDarkMat);
        post.position.y = 14;
        post.castShadow = true;
        suitDock.add(post);

        const halo = new THREE.Mesh(
            new THREE.TorusGeometry(5, 0.7, 8, 16),
            new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.8 })
        );
        halo.position.set(0, 20, 5.2);
        suitDock.add(halo);



        scene3D.add(suitDock);
    });

    // Decompression Vacuum Turbopumps (South Corners: x=295 & 395, y=450)
    [295, 395].forEach(px => {
        const pumpGroup = new THREE.Group();
        pumpGroup.position.set(to3DX(px), 0, to3DZ(450));

        const pumpBody = new THREE.Mesh(new THREE.CylinderGeometry(7, 8, 18, 16), metalLightMat);
        pumpBody.position.y = 9;
        pumpBody.castShadow = true;
        pumpGroup.add(pumpBody);

        scene3D.add(pumpGroup);
    });

    // 8. ATTACH SLEEK [Q] DETAILS PROXIMITY PROMPT PILLS TO ALL PROPS
    if (typeof HABITAT_PROPS !== 'undefined') {
        HABITAT_PROPS.forEach(p => {
            const spr = createCompactPropPrompt(p);
            scene3D.add(spr);
            techReferenceSprites.push(spr);
        });
    }
}


function build3DCrewNPCs() {
    if (typeof CREW_NPCS === 'undefined') return;

    CREW_NPCS.forEach(npc => {
        const group = new THREE.Group();
        group.position.set(to3DX(npc.x), 0, to3DZ(npc.y));
        group.userData.npcId = npc.id;

        const suitMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(npc.suitColor),
            roughness: 0.5,
            metalness: 0.3
        });
        const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

        const legGeo = new THREE.CylinderGeometry(2, 2.2, 12, 8);
        const lLeg = new THREE.Mesh(legGeo, darkMat);
        lLeg.position.set(-3.5, 6, 0);
        lLeg.castShadow = true;
        group.add(lLeg);

        const rLeg = new THREE.Mesh(legGeo, darkMat);
        rLeg.position.set(3.5, 6, 0);
        rLeg.castShadow = true;
        group.add(rLeg);

        const torsoGeo = new THREE.BoxGeometry(12, 14, 8);
        const torso = new THREE.Mesh(torsoGeo, suitMat);
        torso.position.y = 18;
        torso.castShadow = true;
        group.add(torso);

        const armGeo = new THREE.CylinderGeometry(1.6, 1.8, 11, 8);
        const lArm = new THREE.Mesh(armGeo, suitMat);
        lArm.position.set(-7.5, 17, 0);
        lArm.rotation.z = Math.PI * 0.05;
        lArm.castShadow = true;
        group.add(lArm);

        const rArm = new THREE.Mesh(armGeo, suitMat);
        rArm.position.set(7.5, 17, 0);
        rArm.rotation.z = -Math.PI * 0.05;
        rArm.castShadow = true;
        group.add(rArm);

        if (npc.helmetOn) {
            const helmGeo = new THREE.SphereGeometry(6, 16, 16);
            const helmMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.2 });
            const helm = new THREE.Mesh(helmGeo, helmMat);
            helm.position.y = 29;
            helm.castShadow = true;
            group.add(helm);

            const visorGeo = new THREE.SphereGeometry(4, 12, 12);
            const visorMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.1 });
            const visor = new THREE.Mesh(visorGeo, visorMat);
            visor.position.set(0, 29, 3);
            visor.scale.set(1, 0.7, 0.6);
            group.add(visor);
        } else {
            const headGeo = new THREE.SphereGeometry(5.5, 14, 14);
            const headMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(npc.skinColor), roughness: 0.8 });
            const head = new THREE.Mesh(headGeo, headMat);
            head.position.y = 29;
            head.castShadow = true;
            group.add(head);

            const hairGeo = new THREE.SphereGeometry(5.8, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
            const hairMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(npc.hairColor), roughness: 0.9 });
            const hair = new THREE.Mesh(hairGeo, hairMat);
            hair.position.y = 30;
            group.add(hair);
        }

        scene3D.add(group);
        crew3DMeshes[npc.id] = { mesh: group, data: npc };
    });
}

function build3DCadetNova() {
    nova3D = new THREE.Group();
    const initX = state && state.player ? to3DX(state.player.x) : 0;
    const initZ = state && state.player ? to3DZ(state.player.y) : 0;
    nova3D.position.set(initX, 0, initZ);

    // Dynamic Switchable Materials
    const suitMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.45, metalness: 0.25 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.45, metalness: 0.25 });
    const gloveMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });

    // Legs
    const legGeo = new THREE.CylinderGeometry(2.2, 2.5, 12, 10);

    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-4, 11, 0);
    const lLegMesh = new THREE.Mesh(legGeo, pantsMat);
    lLegMesh.position.y = -5;
    lLegMesh.castShadow = true;
    leftLegGroup.add(lLegMesh);
    const lBoot = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.5, 6), bootMat);
    lBoot.position.set(0, -10, 1);
    lBoot.castShadow = true;
    leftLegGroup.add(lBoot);
    nova3D.add(leftLegGroup);
    nova3D.userData.leftLeg = leftLegGroup;

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(4, 11, 0);
    const rLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rLegMesh.position.y = -5;
    rLegMesh.castShadow = true;
    rightLegGroup.add(rLegMesh);
    const rBoot = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.5, 6), bootMat);
    rBoot.position.set(0, -10, 1);
    rBoot.castShadow = true;
    rightLegGroup.add(rBoot);
    nova3D.add(rightLegGroup);
    nova3D.userData.rightLeg = rightLegGroup;

    // Torso
    const torsoGeo = new THREE.BoxGeometry(13, 15, 9);
    const torso = new THREE.Mesh(torsoGeo, suitMat);
    torso.position.y = 19;
    torso.castShadow = true;
    nova3D.add(torso);

    const chestScreenGeo = new THREE.BoxGeometry(6, 4.5, 1);
    const chestScreenMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.7
    });
    const chestScreen = new THREE.Mesh(chestScreenGeo, chestScreenMat);
    chestScreen.position.set(0, 20.5, 4.8);
    nova3D.add(chestScreen);

    // Arms
    const armGeo = new THREE.CylinderGeometry(1.8, 2.0, 12, 8);

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-8, 23, 0);
    const lArmMesh = new THREE.Mesh(armGeo, suitMat);
    lArmMesh.position.y = -5;
    lArmMesh.castShadow = true;
    leftArmGroup.add(lArmMesh);
    const lGlove = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 8), gloveMat);
    lGlove.position.set(0, -11, 0);
    lGlove.castShadow = true;
    leftArmGroup.add(lGlove);
    nova3D.add(leftArmGroup);
    nova3D.userData.leftArm = leftArmGroup;

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(8, 23, 0);
    const rArmMesh = new THREE.Mesh(armGeo, suitMat);
    rArmMesh.position.y = -5;
    rArmMesh.castShadow = true;
    rightArmGroup.add(rArmMesh);
    const rGlove = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 8), gloveMat);
    rGlove.position.set(0, -11, 0);
    rGlove.castShadow = true;
    rightArmGroup.add(rGlove);
    nova3D.add(rightArmGroup);
    nova3D.userData.rightArm = rightArmGroup;

    // --- 1. EVA GEAR (Full Spacesuit Helmet, Gold Visor, PLSS Life-Support Backpack & O2 Cylinders) ---
    const evaGear = new THREE.Group();

    // Backpack (PLSS)
    const packGeo = new THREE.BoxGeometry(11, 14, 5.5);
    const packMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.3 });
    const backpack = new THREE.Mesh(packGeo, packMat);
    backpack.position.set(0, 19, -6.5);
    backpack.castShadow = true;
    evaGear.add(backpack);

    // Dual O2 Cylinders on PLSS Backpack
    const o2Mat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.5 });
    const lO2 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 12, 10), o2Mat);
    lO2.position.set(-3.5, 19, -9.6);
    evaGear.add(lO2);
    const rO2 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 12, 10), o2Mat);
    rO2.position.set(3.5, 19, -9.6);
    evaGear.add(rO2);

    const antGeo = new THREE.CylinderGeometry(0.5, 0.5, 14, 6);
    const antMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
    const antenna = new THREE.Mesh(antGeo, antMat);
    antenna.position.set(-3.5, 27, -7);
    evaGear.add(antenna);

    // Helmet & Gold Metallic Visor
    const helmGeo = new THREE.SphereGeometry(6.5, 24, 24);
    const helmMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.4 });
    const helmet = new THREE.Mesh(helmGeo, helmMat);
    helmet.position.y = 31;
    helmet.castShadow = true;
    evaGear.add(helmet);

    const visorGeo = new THREE.SphereGeometry(5.2, 20, 20);
    const visorMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.12,
        emissive: 0x78350f,
        emissiveIntensity: 0.2
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 31, 3);
    visor.scale.set(1.05, 0.82, 0.65);
    evaGear.add(visor);
    nova3D.add(evaGear);

    // --- 2. IVA GEAR (Shirtsleeve Flight Uniform: Cadet Head, Hair, Comms Headset & Mic) ---
    const ivaGear = new THREE.Group();

    // Cadet Head
    const headGeo = new THREE.SphereGeometry(5.4, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.75 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 30.5;
    head.castShadow = true;
    ivaGear.add(head);

    // Cadet Hair with Volumetric Bangs
    const hairGeo = new THREE.SphereGeometry(5.65, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.58);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.9 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 31.2;
    hair.castShadow = true;
    ivaGear.add(hair);

    const bangGeo = new THREE.BoxGeometry(4.5, 2.5, 2.5);
    const bang = new THREE.Mesh(bangGeo, hairMat);
    bang.position.set(1.5, 32.5, 4.2);
    ivaGear.add(bang);

    // Comms Headset
    const headsetMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.8 });
    const bandGeo = new THREE.TorusGeometry(5.4, 0.45, 8, 16, Math.PI);
    const band = new THREE.Mesh(bandGeo, headsetMat);
    band.rotation.x = -Math.PI / 2;
    band.position.set(0, 32.5, 0);
    ivaGear.add(band);

    const earcupGeo = new THREE.CylinderGeometry(1.5, 1.5, 1.2, 8);
    const lCup = new THREE.Mesh(earcupGeo, headsetMat);
    lCup.rotation.z = Math.PI / 2;
    lCup.position.set(-5.6, 30.5, 0);
    ivaGear.add(lCup);
    const rCup = new THREE.Mesh(earcupGeo, headsetMat);
    rCup.rotation.z = Math.PI / 2;
    rCup.position.set(5.6, 30.5, 0);
    ivaGear.add(rCup);

    const micBoomGeo = new THREE.CylinderGeometry(0.3, 0.3, 6, 6);
    const micBoom = new THREE.Mesh(micBoomGeo, headsetMat);
    micBoom.rotation.x = Math.PI / 3;
    micBoom.position.set(-4.8, 28.5, 3.5);
    ivaGear.add(micBoom);

    const micTipMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.9 });
    const micTip = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), micTipMat);
    micTip.position.set(-4.8, 26.5, 5.8);
    ivaGear.add(micTip);
    nova3D.add(ivaGear);

    // Store references for dynamic suit swapping in render loop
    nova3D.userData.evaGear = evaGear;
    nova3D.userData.ivaGear = ivaGear;
    nova3D.userData.suitMat = suitMat;
    nova3D.userData.pantsMat = pantsMat;
    nova3D.userData.gloveMat = gloveMat;
    nova3D.userData.chestScreenMat = chestScreenMat;

    // Spotlight
    const chestLight = new THREE.SpotLight(0xffffff, 1.2, 180, Math.PI / 5, 0.35);
    chestLight.position.set(0, 21, 4);
    nova3D.add(chestLight);
    nova3D.userData.chestLight = chestLight;

    const lightTarget = new THREE.Object3D();
    scene3D.add(lightTarget);
    chestLight.target = lightTarget;
    nova3D.userData.lightTarget = lightTarget;

    scene3D.add(nova3D);
}

// --- 3D ANIMATION & TELEMETRY SYNCHRONIZATION LOOP ---
function renderGame3D(now) {
    if (!isThreeInitialized) {
        initThreeScene();
        return;
    }
    if (!renderer3D || !scene3D || !camera3D) return;

    const hasKeys = (typeof keys !== 'undefined') && (keys.up || keys.down || keys.left || keys.right);
    const hasTarget = state && state.player && (state.player.targetX !== null && state.player.targetY !== null);
    const isMoving = hasKeys || hasTarget;

    const legSwing = isMoving ? Math.sin(now * 0.016) * 0.55 : 0;
    const bodyBob = isMoving ? Math.abs(Math.sin(now * 0.016)) * 1.5 : 0;

    // 1. Update Cadet Nova Position, 360-degree Facing & Limb Animation
    if (nova3D && state && state.player) {
        const targetX3D = to3DX(state.player.x);
        const targetZ3D = to3DZ(state.player.y);
        nova3D.position.x = targetX3D;
        nova3D.position.z = targetZ3D;
        nova3D.position.y = bodyBob;

        let targetRotY = nova3D.rotation.y;
        if (hasKeys) {
            if (keys.up && keys.right) targetRotY = Math.PI * 0.75;
            else if (keys.up && keys.left) targetRotY = -Math.PI * 0.75;
            else if (keys.down && keys.right) targetRotY = Math.PI * 0.25;
            else if (keys.down && keys.left) targetRotY = -Math.PI * 0.25;
            else if (keys.up) targetRotY = Math.PI;
            else if (keys.down) targetRotY = 0;
            else if (keys.right) targetRotY = Math.PI * 0.5;
            else if (keys.left) targetRotY = -Math.PI * 0.5;
        } else if (hasTarget) {
            const tdx = state.player.targetX - state.player.x;
            const tdy = state.player.targetY - state.player.y;
            if (Math.hypot(tdx, tdy) > 4) {
                targetRotY = Math.atan2(tdx, tdy);
            }
        } else if (state.player.facing) {
            targetRotY = state.player.facing === 'right' ? Math.PI * 0.5 : -Math.PI * 0.5;
        }

        let diff = (targetRotY - nova3D.rotation.y) % (Math.PI * 2);
        if (diff < -Math.PI) diff += Math.PI * 2;
        if (diff > Math.PI) diff -= Math.PI * 2;
        nova3D.rotation.y += diff * 0.22;

        if (nova3D.userData.leftLeg && nova3D.userData.rightLeg) {
            nova3D.userData.leftLeg.rotation.x = legSwing;
            nova3D.userData.rightLeg.rotation.x = -legSwing;
        }

        if (nova3D.userData.leftArm && nova3D.userData.rightArm) {
            nova3D.userData.leftArm.rotation.x = -legSwing * 0.75;
            nova3D.userData.rightArm.rotation.x = legSwing * 0.75;
        }

        if (nova3D.userData.lightTarget) {
            const forwardX = Math.sin(nova3D.rotation.y);
            const forwardZ = Math.cos(nova3D.rotation.y);
            nova3D.userData.lightTarget.position.set(
                nova3D.position.x + forwardX * 80,
                10,
                nova3D.position.z + forwardZ * 80
            );
        }

        // Dynamic EVA Suit vs Shirtsleeve IVA Flight Uniform Sync
        const wearSuit = (state && state.player && (state.player.inSuit || state.player.x <= 285));
        const ud = nova3D.userData;
        if (ud && ud.evaGear && ud.ivaGear) {
            ud.evaGear.visible = !!wearSuit;
            ud.ivaGear.visible = !wearSuit;
        }
        if (ud && ud.suitMat && ud.pantsMat) {
            if (wearSuit) {
                ud.suitMat.color.setHex(0xea580c);
                ud.pantsMat.color.setHex(0xea580c);
                if (ud.gloveMat) ud.gloveMat.color.setHex(0xf8fafc);
                if (ud.chestScreenMat) {
                    ud.chestScreenMat.color.setHex(0x38bdf8);
                    ud.chestScreenMat.emissive.setHex(0x0284c7);
                }
            } else {
                ud.suitMat.color.setHex(0x0284c7);
                ud.pantsMat.color.setHex(0x0f172a);
                if (ud.gloveMat) ud.gloveMat.color.setHex(0xfed7aa);
                if (ud.chestScreenMat) {
                    ud.chestScreenMat.color.setHex(0x4ade80);
                    ud.chestScreenMat.emissive.setHex(0x15803d);
                }
            }
        }
    }

    // 2. Smooth 3D Camera Tracking with Tactical Tilt
    if (camera3D && nova3D) {
        const camTargetX = nova3D.position.x;
        const camTargetZ = nova3D.position.z + 330;
        camera3D.position.x += (camTargetX - camera3D.position.x) * 0.08;
        camera3D.position.z += (camTargetZ - camera3D.position.z) * 0.08;
        camera3D.lookAt(nova3D.position.x, 22, nova3D.position.z - 25);
    }

    // 3. Dynamic Floor Decal Fade-Out & Location Tracking
    // When Cadet Nova enters a cubicle, its floor nameplate smoothly dissolves / fades out
    // so the interior consoles, equipment, and crew are 100% visible and unobstructed!
    let activeRoomId = null;
    if (typeof ROOMS !== 'undefined' && state && state.player) {
        const currentRoom = ROOMS.find(r =>
            state.player.x >= r.x && state.player.x <= r.x + r.w &&
            state.player.y >= r.y && state.player.y <= r.y + r.h
        );
        if (currentRoom) {
            activeRoomId = currentRoom.id;
            const locTextEl = document.getElementById('hud-location-text');
            if (locTextEl) {
                const label = 'LOCATION: ' + currentRoom.name;
                if (locTextEl.textContent !== label) {
                    locTextEl.textContent = label;
                }
            }
        }
    }

    // Animate floor decal opacity
    Object.values(roomFloorDecals).forEach(decal => {
        if (!decal || !decal.material) return;
        const isCurrentRoom = (decal.roomId === activeRoomId);

        // Inside the room: fade to 0 opacity. Outside: gentle pulsing glow.
        let targetOpacity = 0.0;
        if (!isCurrentRoom) {
            targetOpacity = decal.baseOpacity + Math.sin(now * 0.003) * 0.08;
        }

        // Smooth fade interpolation
        decal.material.opacity += (targetOpacity - decal.material.opacity) * 0.12;
        decal.mesh.visible = decal.material.opacity > 0.01;
    });

    // Animate doorway signs hover
    if (doorwayBadges && doorwayBadges.length > 0) {
        for (let i = 0; i < doorwayBadges.length; i++) {
            const b = doorwayBadges[i];
            if (b && b.userData.baseY) {
                b.position.y = b.userData.baseY + Math.sin(now * 0.002 + i) * 1.2;
            }
        }
    }

    // 5. Rotate Hologram Console Rings & Proximity Fade for [E] Prompts
    if (state && state.player) {
        const px = state.player.x;
        const py = state.player.y;

        Object.values(object3DMeshes).forEach(o => {
            if (o.mesh) {
                if (o.mesh.userData.ring) {
                    o.mesh.userData.ring.rotation.z += 0.025;
                }
                const prompt = o.mesh.userData.prompt;
                if (prompt && o.data) {
                    const dist = Math.hypot(px - o.data.x, py - o.data.y);
                    const inRange = dist <= (o.data.radius + 24);
                    const targetOpacity = inRange ? 0.98 : 0.0;
                    prompt.material.opacity += (targetOpacity - prompt.material.opacity) * 0.22;
                    prompt.visible = prompt.material.opacity > 0.02;
                    if (prompt.visible) {
                        const base = prompt.userData.baseY || 28;
                        prompt.position.y = base + Math.sin(now * 0.003) * 0.9;
                    }
                }
            }
        });

        // 6. Proximity Fade for [Q] Details Prop Prompts
        if (techReferenceSprites && techReferenceSprites.length > 0) {
            for (let i = 0; i < techReferenceSprites.length; i++) {
                const spr = techReferenceSprites[i];
                const p = spr.userData.prop;
                if (!p) continue;
                const dist = Math.hypot(px - p.x, py - p.y);
                const inRange = dist <= 48;
                const targetOpacity = inRange ? 0.98 : 0.0;
                spr.material.opacity += (targetOpacity - spr.material.opacity) * 0.22;
                spr.visible = spr.material.opacity > 0.02;
                if (spr.visible) {
                    const base = spr.userData.baseY || 28;
                    spr.position.y = base + Math.sin(now * 0.003 + i) * 0.8;
                }
            }
        }
    }

        // Dynamic Pressure Door Hatch Proximity Sliding & LED Interlocks
    if (habitatDoor3DMeshes && habitatDoor3DMeshes.length > 0 && state && state.player) {
        const px = state.player.x;
        const py = state.player.y;
        for (let i = 0; i < habitatDoor3DMeshes.length; i++) {
            const d = habitatDoor3DMeshes[i];
            const dist = Math.hypot(px - d.x, py - d.y);
            const isOpen = (dist <= 65);
            const targetY = isOpen ? d.openY : d.closedY;
            d.hatchGroup.position.y += (targetY - d.hatchGroup.position.y) * 0.18;
            if (d.ledMat) {
                const targetCol = isOpen ? 0x22c55e : 0xf59e0b;
                if (d.ledMat.color.getHex() !== targetCol) {
                    d.ledMat.color.setHex(targetCol);
                    d.ledMat.emissive.setHex(targetCol);
                }
            }
        }
    }

    if (roomMachineryAnimations && roomMachineryAnimations.length > 0) {
        for (let i = 0; i < roomMachineryAnimations.length; i++) {
            roomMachineryAnimations[i].update(now);
        }
    }

    // 6. Emergency Alarm Pulsing & Dust Storm Atmospheric Evolution
    if (scene3D && scene3D.fog && state && state.faults) {
        if (state.faults.dustStormActive) {
            scene3D.fog.density = 0.0022;
            scene3D.fog.color.setHex(0x6e2c14);
        } else {
            scene3D.fog.density = 0.0005;
            scene3D.fog.color.setHex(0x0c0f1d);
        }
    }

    // 7. Dynamic Hydroponic Crop Growth Lifecycle (Visual World Progression)
    if (window.greenhouseCropHeads && window.greenhouseCropHeads.length > 0 && typeof state !== 'undefined') {
        const stage = state.cropGrowthStage || 0;
        const scaleFactor = stage === 0 ? 0.45 : (stage === 1 ? 1.0 : 1.6);
        for (let i = 0; i < window.greenhouseCropHeads.length; i++) {
            const h = window.greenhouseCropHeads[i];
            h.scale.set(scaleFactor * 1.15, scaleFactor * 0.75, scaleFactor * 1.15);
        }
    }

    // 8. Scientific Core Sample Canister Display
    if (window.labCoreCanister && typeof state !== 'undefined') {
        window.labCoreCanister.visible = !!state.hasCoreSample;
    }

    if (emergencyLight3D && state && state.faults) {
        if (state.faults.radiationAlertActive || state.faults.dustStormActive || state.co2PPM > 1000 || state.faults.breakerTripped) {
            emergencyLight3D.intensity = 1.5 + Math.sin(now * 0.01) * 1.2;
            if (nova3D) {
                emergencyLight3D.position.set(nova3D.position.x, 60, nova3D.position.z);
            }
        } else {
            emergencyLight3D.intensity = 0;
        }
    }

    renderer3D.render(scene3D, camera3D);
}

if (typeof window !== 'undefined') {
    window.createCompactInteractPrompt = createCompactInteractPrompt;
    window.createCompactPropPrompt = createCompactPropPrompt;
}
