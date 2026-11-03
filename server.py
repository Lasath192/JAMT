#!/usr/bin/env python3
"""
ASTRA-1: The Red Frontier - Python HTTP Server & NASA Data Bridge
2026 NASA Space Apps Challenge - Junior Astronaut Mission Trainer

Run with:
    python server.py [PORT]
"""

import os
import sys
import json
import urllib.request
import urllib.error
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else int(os.environ.get("PORT", 8000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

NASA_API_KEY = os.environ.get("NASA_API_KEY", "DEMO_KEY")

# Simulated authentic NASA DONKI & Curiosity/Perseverance Telemetry Cache
SIMULATED_DONKI = {
    "source": "NASA Space Weather Database Of Notifications, Knowledge, Information (DONKI)",
    "mission": "ASTRA-1 Mars Outpost Ground Station",
    "solarCycle": "Solar Cycle 25 (Approaching Solar Max)",
    "events": [
        {
            "type": "Coronal Mass Ejection (CME)",
            "catalogId": "2026-CME-014",
            "speedKms": 1250,
            "halfAngle": 42,
            "targetCoordinates": "Mars L1 Heliocentric Transfer",
            "arrivalEstimate": "Sol 24 14:20 UTC",
            "geomagneticRisk": "HIGH - SPE Proton Flux Enhancement (> 100 MeV)",
            "recommendedProtocol": "Seal Outdoor EVA Airway; Summon Crew to Water-Wall Quarters"
        },
        {
            "type": "Solar Flare",
            "class": "X2.8 / 3B",
            "sourceLocation": "NOAA AR 3698",
            "peakXRayFlux": "2.8e-4 W/m^2",
            "radioBlackoutLevel": "R3 (Strong S-Band HF Degradation)",
            "recommendedProtocol": "Reroute Comms to Backup UHF/S-Band Surface Relay"
        }
    ],
    "surfaceConditions": {
        "location": "Jezero / Gale Crater Transit Corridor (18.38°N, 77.58°E)",
        "atmosphericPressureKPa": 0.61,
        "ambientTemperatureMinC": -82.4,
        "ambientTemperatureMaxC": -14.2,
        "opticalDepthTau": 0.52,
        "solarIrradianceWM2": 520,
        "uvDoseIndex": 8.4
    }
}


class AstraMissionHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # Enable CORS for external tools and frontends
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        clean_path = self.path.split("?")[0].rstrip("/")

        if clean_path == "/api/health":
            self._send_json({
                "status": "nominal",
                "outpost": "ASTRA-1",
                "challenge": "2026 NASA Space Apps Challenge",
                "system": "Junior Astronaut Mission Trainer (Python Runtime)"
            })
            return

        if clean_path in ("/api/nasa/donki", "/api/donki"):
            data = self._fetch_live_donki_or_fallback()
            self._send_json(data)
            return

        if clean_path == "/api/telemetry":
            self._send_json({
                "sol": 1,
                "power": {"solarKW": 20, "backupKW": 0, "batterySoC": 68},
                "atmosphere": {"pressureKPa": 101.3, "oxygenKPa": 21.2, "co2PPM": 420},
                "water": {"reserveLitres": 420, "conductivityUSCm": 42},
                "crew": {"size": 5, "healthPercent": 100}
            })
            return

        # Default static file routing
        super().do_GET()

    def _send_json(self, data, status=200):
        body = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=UTF-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _fetch_live_donki_or_fallback(self):
        if NASA_API_KEY and NASA_API_KEY != "DEMO_KEY":
            try:
                url = f"https://api.nasa.gov/DONKI/CME?startDate=2024-01-01&endDate=2024-01-10&api_key={NASA_API_KEY}"
                req = urllib.request.Request(url, headers={"User-Agent": "ASTRA-1-JAMT/2.0"})
                with urllib.request.urlopen(req, timeout=4) as response:
                    live_data = json.loads(response.read().decode())
                    return {
                        "source": "NASA DONKI Live API",
                        "eventsCount": len(live_data),
                        "events": live_data[:5],
                        "simulatedModel": SIMULATED_DONKI
                    }
            except Exception:
                pass
        return SIMULATED_DONKI


def run_server():
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, AstraMissionHandler)
    print("================================================================")
    print("  ASTRA-1: The Red Frontier - Python Mission Server Online")
    print("  2026 NASA Space Apps Challenge | Junior Astronaut Mission Trainer")
    print("================================================================")
    print(f"  Local Habitat URL:   http://localhost:{PORT}")
    print(f"  Standalone Fallback: http://localhost:{PORT}/astra_1_the_red_frontier.html")
    print(f"  NASA DONKI API:      http://localhost:{PORT}/api/nasa/donki")
    print(f"  Telemetry Endpoint:  http://localhost:{PORT}/api/telemetry")
    print("================================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nHabitat server powering down. Sol complete.")


if __name__ == "__main__":
    run_server()
