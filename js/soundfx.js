/**
 * ASTRA-1: The Red Frontier - Web Audio Synthesizer & Procedural Sci-Fi Soundscape Engine
 * 2026 NASA Space Apps Challenge
 */

class SoundFX {
    constructor() {
        this.enabled = true;
        this.musicEnabled = true;
        this.ctx = null;
        this.ambientStarted = false;
        this.musicTimer = null;
        this.envGain = null;
        this.windFilter = null;
        this.windGain = null;
        this.machineryOsc = null;
        this.machineryGain = null;
        this.chordIdx = 0;
        this.lastStepSound = 0;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    startAmbientEngine() {
        if (this.ambientStarted) return;
        this.init();
        if (!this.ctx) return;
        this.ambientStarted = true;

        try {
            // 1. Continuous Filtered Noise Generator for Martian Wind & ECLSS Air Flow
            const bufferSize = this.ctx.sampleRate * 2;
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            const whiteNoise = this.ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;

            this.windFilter = this.ctx.createBiquadFilter();
            this.windFilter.type = 'bandpass';
            this.windFilter.frequency.setValueAtTime(220, this.ctx.currentTime);
            this.windFilter.Q.setValueAtTime(2.5, this.ctx.currentTime);

            this.windGain = this.ctx.createGain();
            this.windGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

            whiteNoise.connect(this.windFilter);
            this.windFilter.connect(this.windGain);
            this.windGain.connect(this.ctx.destination);
            whiteNoise.start();

            // 2. Room-Specific Habitat Sub-Bass & Machinery Hum Oscillator
            this.machineryOsc = this.ctx.createOscillator();
            this.machineryOsc.type = 'triangle';
            this.machineryOsc.frequency.setValueAtTime(58, this.ctx.currentTime);

            this.machineryGain = this.ctx.createGain();
            this.machineryGain.gain.setValueAtTime(0.018, this.ctx.currentTime);

            this.machineryOsc.connect(this.machineryGain);
            this.machineryGain.connect(this.ctx.destination);
            this.machineryOsc.start();

            // 3. Generative Sci-Fi Space Ambient Music Sequencer (Warm Ethereal Chords)
            const chords = [
                [130.81, 196.00, 246.94, 293.66], // Cmaj9 (Space Wonder)
                [110.00, 164.81, 220.00, 261.63], // Am7 (Martian Solitude)
                [87.31,  130.81, 174.61, 220.00], // Fmaj7 (Orbital Horizon)
                [98.00,  146.83, 196.00, 246.94]  // G6 (Discovery)
            ];

            const playAmbientChord = () => {
                if (!this.enabled || !this.musicEnabled || !this.ctx) return;
                const now = this.ctx.currentTime;
                const notes = chords[this.chordIdx % chords.length];
                this.chordIdx++;

                notes.forEach((freq, i) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    const filter = this.ctx.createBiquadFilter();

                    osc.type = i % 2 === 0 ? 'sine' : 'triangle';
                    osc.frequency.setValueAtTime(freq, now);

                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(650, now);

                    gain.gain.setValueAtTime(0.0001, now);
                    gain.gain.linearRampToValueAtTime(0.016, now + 1.8);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.8);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now);
                    osc.stop(now + 6.0);
                });
            };

            playAmbientChord();
            this.musicTimer = setInterval(playAmbientChord, 6000);
        } catch (e) {}
    }

    updateEnvironmentAudio(roomId, isDustStorm, isMoving, nowMs) {
        if (!this.ambientStarted || !this.ctx) return;
        const now = this.ctx.currentTime;

        if (!this.enabled || !this.musicEnabled) {
            if (this.windGain) this.windGain.gain.setTargetAtTime(0.0001, now, 0.2);
            if (this.machineryGain) this.machineryGain.gain.setTargetAtTime(0.0001, now, 0.2);
            return;
        }

        // Modulate environmental soundscape based on astronaut's current room
        let targetWindVol = 0.01;
        let targetWindFreq = 220;
        let targetMachVol = 0.016;
        let targetMachFreq = 58;

        if (roomId === 'surface') {
            // Howling Martian wind outdoors (louder during Chapter 5 Red Storm)
            targetWindVol = isDustStorm ? 0.065 : 0.035;
            targetWindFreq = isDustStorm ? 440 + Math.sin(nowMs * 0.003) * 140 : 280 + Math.sin(nowMs * 0.002) * 60;
            targetMachVol = 0.004;
        } else if (roomId === 'power') {
            // Deep 60Hz Electrical Reactor & Turbine Hum
            targetWindVol = 0.008;
            targetMachVol = 0.035;
            targetMachFreq = 60;
        } else if (roomId === 'lifesupport') {
            // ECLSS Air Scrubber Ventilation Flow
            targetWindVol = 0.028;
            targetWindFreq = 340;
            targetMachVol = 0.022;
            targetMachFreq = 72;
        } else if (roomId === 'water' || roomId === 'greenhouse') {
            // Hydroponic & Filtration Pump Resonance
            targetWindVol = 0.014;
            targetWindFreq = 520;
            targetMachVol = 0.02;
            targetMachFreq = 85;
        }

        if (this.windGain && this.windFilter) {
            this.windGain.gain.setTargetAtTime(targetWindVol, now, 0.3);
            this.windFilter.frequency.setTargetAtTime(targetWindFreq, now, 0.3);
        }
        if (this.machineryGain && this.machineryOsc) {
            this.machineryGain.gain.setTargetAtTime(targetMachVol, now, 0.3);
            this.machineryOsc.frequency.setTargetAtTime(targetMachFreq, now, 0.3);
        }

        // Subtle rhythmic astronaut footsteps when walking
        if (isMoving && nowMs - this.lastStepSound > 340) {
            this.lastStepSound = nowMs;
            const stepFreq = roomId === 'surface' ? 95 : 135;
            this.playTone(stepFreq, 'sine', 0.045, 0.022);
        }
    }

    playTone(freq, type = 'sine', duration = 0.12, vol = 0.08) {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    }

    beep() {
        this.startAmbientEngine();
        this.playTone(880, 'sine', 0.08, 0.06);
    }

    chime() {
        this.startAmbientEngine();
        this.playTone(587.33, 'sine', 0.15, 0.08);
        setTimeout(() => this.playTone(880.00, 'sine', 0.25, 0.08), 120);
    }

    success() {
        this.startAmbientEngine();
        this.playTone(523.25, 'triangle', 0.12, 0.09);
        setTimeout(() => this.playTone(659.25, 'triangle', 0.12, 0.09), 90);
        setTimeout(() => this.playTone(783.99, 'triangle', 0.22, 0.1), 180);
    }

    alert() {
        this.startAmbientEngine();
        this.playTone(310, 'sawtooth', 0.18, 0.08);
        setTimeout(() => this.playTone(240, 'sawtooth', 0.25, 0.08), 160);
    }

    pickup() {
        this.startAmbientEngine();
        this.playTone(620, 'sine', 0.09, 0.07);
        setTimeout(() => this.playTone(940, 'sine', 0.12, 0.07), 70);
    }

    click() {
        this.startAmbientEngine();
        this.playTone(1200, 'square', 0.03, 0.04);
    }

    valveRotate() {
        this.startAmbientEngine();
        this.playTone(480, 'triangle', 0.04, 0.05);
    }

    airlockHiss() {
        this.startAmbientEngine();
        try {
            if (!this.ctx) return;
            const bufferSize = this.ctx.sampleRate * 0.4;
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
            const whiteNoise = this.ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(600, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.35);
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.38);
            whiteNoise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            whiteNoise.start();
        } catch (e) {}
    }

    siren() {
        this.startAmbientEngine();
        this.playTone(720, 'sawtooth', 0.22, 0.1);
        setTimeout(() => this.playTone(540, 'sawtooth', 0.22, 0.1), 180);
    }

    scan() {
        this.startAmbientEngine();
        this.playTone(950, 'sine', 0.08, 0.05);
        setTimeout(() => this.playTone(1350, 'sine', 0.1, 0.06), 70);
    }

    cableSnap() {
        this.startAmbientEngine();
        this.playTone(280, 'sine', 0.06, 0.08);
        setTimeout(() => this.playTone(720, 'triangle', 0.08, 0.07), 40);
    }

    waterFlow() {
        this.startAmbientEngine();
        this.playTone(340, 'sine', 0.14, 0.05);
        setTimeout(() => this.playTone(420, 'triangle', 0.16, 0.05), 80);
    }
}

const sfx = new SoundFX();

