/**
 * ASTRA-1: The Red Frontier - Node.js Server & NASA Open Data API Gateway
 * 2026 NASA Space Apps Challenge - Junior Astronaut Mission Trainer
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.md': 'text/markdown; charset=UTF-8',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg'
};

// Simulated authentic NASA DONKI & Curiosity/Perseverance Telemetry Cache
const NASA_DONKI_DATA = {
    source: 'NASA Space Weather Database Of Notifications, Knowledge, Information (DONKI)',
    mission: 'ASTRA-1 Mars Outpost Ground Station',
    timestamp: new Date().toISOString(),
    solarCycle: 'Solar Cycle 25 (Approaching Solar Max)',
    events: [
        {
            type: 'Coronal Mass Ejection (CME)',
            catalogId: '2026-CME-014',
            speedKms: 1250,
            halfAngle: 42,
            targetCoordinates: 'Mars L1 Heliocentric Transfer',
            arrivalEstimate: 'Sol 24 14:20 UTC',
            geomagneticRisk: 'HIGH - SPE Proton Flux Enhancement (> 100 MeV)',
            recommendedProtocol: 'Seal Outdoor EVA Airway; Summon Crew to Water-Wall Quarters'
        },
        {
            type: 'Solar Flare',
            class: 'X2.8 / 3B',
            sourceLocation: 'NOAA AR 3698',
            peakXRayFlux: '2.8e-4 W/m^2',
            radioBlackoutLevel: 'R3 (Strong S-Band HF Degradation)',
            recommendedProtocol: 'Reroute Comms to Backup UHF/S-Band Surface Relay'
        }
    ],
    surfaceConditions: {
        location: 'Jezero / Gale Crater Transit Corridor (18.38°N, 77.58°E)',
        atmosphericPressureKPa: 0.61,
        ambientTemperatureMinC: -82.4,
        ambientTemperatureMaxC: -14.2,
        opticalDepthTau: 0.52,
        solarIrradianceWM2: 520,
        uvDoseIndex: 8.4
    }
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Enable CORS for modern web apps / API consumers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // --- REST API ENDPOINTS ---
    if (pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'nominal',
            outpost: 'ASTRA-1',
            system: 'Junior Astronaut Mission Trainer',
            challenge: '2026 NASA Space Apps Challenge',
            uptimeSec: process.uptime()
        }, null, 2));
        return;
    }

    if (pathname === '/api/nasa/donki' || pathname === '/api/donki') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(NASA_DONKI_DATA, null, 2));
        return;
    }

    if (pathname === '/api/telemetry') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            sol: 1,
            power: { solarKW: 20, backupKW: 0, batterySoC: 68 },
            atmosphere: { pressureKPa: 101.3, oxygenKPa: 21.2, co2PPM: 420 },
            water: { reserveLitres: 420, conductivityUSCm: 42 },
            crew: { size: 5, healthPercent: 100 }
        }, null, 2));
        return;
    }

    // --- STATIC ASSET SERVING ---
    if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
    }

    const filePath = path.join(BASE_DIR, pathname);

    // Prevent directory traversal attacks
    if (!filePath.startsWith(BASE_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`404 Not Found: ${pathname}`);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log('================================================================');
    console.log('  ASTRA-1: The Red Frontier - Mission Server Online');
    console.log('  2026 NASA Space Apps Challenge | Junior Astronaut Mission Trainer');
    console.log('================================================================');
    console.log(`  Local Habitat URL:   http://localhost:${PORT}`);
    console.log(`  Standalone Fallback: http://localhost:${PORT}/astra_1_the_red_frontier.html`);
    console.log(`  NASA DONKI API:      http://localhost:${PORT}/api/nasa/donki`);
    console.log(`  Telemetry Endpoint:  http://localhost:${PORT}/api/telemetry`);
    console.log('================================================================\n');
});

