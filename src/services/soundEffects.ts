/**
 * Retro Procedural Web Audio API Sound System
 * Zero external audio files required! Synthesizes authentic retro 90s OS blips,
 * chimes, level-up fanfares, and continuous ambient soundscapes on the fly.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Continuous ambient nodes
  private rainGain: GainNode | null = null;
  private thunderGain: GainNode | null = null;
  private vinylGain: GainNode | null = null;
  private cafeGain: GainNode | null = null;
  private alphaGain: GainNode | null = null;

  private isAmbientRunning: boolean = false;
  private ambientSources: (AudioNode | number)[] = [];

  constructor() {
    // AudioContext will initialize on first user gesture
  }

  private initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.7, this.ctx.currentTime);
    }
  }

  public setMasterVolume(vol: number) {
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  // --- Retro Micro-Interaction Sound Effects ---

  /** Classic Windows 95/98 tactile button click */
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain || ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  }

  /** Retro Window Open chord chime */
  public playWindowOpen() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const freqs = [330, 440, 660]; // E4, A4, E5 chord
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.03);

      gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.03 + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);

      osc.start(ctx.currentTime + idx * 0.03);
      osc.stop(ctx.currentTime + idx * 0.03 + 0.22);
    });
  }

  /** Retro Window Close pitch tick */
  public playWindowClose() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain || ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.065);
  }

  /** Super-satisfying 8-bit Mario/Arcade Coin Pickup chime */
  public playCoin() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Classic B5 to E6 jump
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.setValueAtTime(0.2, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain || ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  /** 8-bit Level Up Victory Fanfare */
  public playLevelUp() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [
      { f: 523.25, d: 0.1 },  // C5
      { f: 659.25, d: 0.1 },  // E5
      { f: 783.99, d: 0.1 },  // G5
      { f: 1046.50, d: 0.25 } // C6
    ];

    let t = ctx.currentTime;
    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);

      osc.start(t);
      osc.stop(t + note.d + 0.02);

      t += note.d * 0.85;
    });
  }

  /** Snappy 3D card flip whoosh */
  public playCardFlip() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(250, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain || ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  /** Pomodoro Timer Done Bell / Singing Bowl */
  public playTimerDone() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const freqs = [587.33, 880, 1174.66]; // D5, A5, D6 harmonic bell
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const amp = 0.15 / (idx + 1);
      gain.gain.setValueAtTime(amp, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.5);
    });
  }

  /** Retro gentle error bonk */
  public playError() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain || ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }

  // --- Procedural Ambient Sound Generator ---

  public startAmbientGenerator() {
    if (this.isAmbientRunning) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    this.isAmbientRunning = true;

    // 1. Pink Noise Rain Generator (4096 buffer pink noise + biquad filter)
    const bufferSize = ctx.sampleRate * 2;
    const rainBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const rainData = rainBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      rainData[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;

    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.value = 1400;

    this.rainGain = ctx.createGain();
    this.rainGain.gain.setValueAtTime(0, ctx.currentTime);

    rainSource.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain || ctx.destination);
    rainSource.start();

    // 2. Thunder / Rumble Generator
    const thunderFilter = ctx.createBiquadFilter();
    thunderFilter.type = 'lowpass';
    thunderFilter.frequency.value = 160;

    const thunderSource = ctx.createBufferSource();
    thunderSource.buffer = rainBuffer;
    thunderSource.loop = true;

    this.thunderGain = ctx.createGain();
    this.thunderGain.gain.setValueAtTime(0, ctx.currentTime);

    thunderSource.connect(thunderFilter);
    thunderFilter.connect(this.thunderGain);
    this.thunderGain.connect(this.masterGain || ctx.destination);
    thunderSource.start();

    // 3. Vinyl Crackle Generator (High-pass filtered noise with random pops)
    const vinylFilter = ctx.createBiquadFilter();
    vinylFilter.type = 'bandpass';
    vinylFilter.frequency.value = 3500;
    vinylFilter.Q.value = 2.0;

    const vinylSource = ctx.createBufferSource();
    vinylSource.buffer = rainBuffer;
    vinylSource.loop = true;

    this.vinylGain = ctx.createGain();
    this.vinylGain.gain.setValueAtTime(0, ctx.currentTime);

    vinylSource.connect(vinylFilter);
    vinylFilter.connect(this.vinylGain);
    this.vinylGain.connect(this.masterGain || ctx.destination);
    vinylSource.start();

    // Random needle pops
    const popInterval = window.setInterval(() => {
      if (!this.vinylGain || this.vinylGain.gain.value < 0.05 || !this.ctx) return;
      if (Math.random() < 0.4) {
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        popOsc.type = 'triangle';
        popOsc.frequency.setValueAtTime(80 + Math.random() * 200, this.ctx.currentTime);
        popGain.gain.setValueAtTime(this.vinylGain.gain.value * 0.2, this.ctx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);
        popOsc.connect(popGain);
        popGain.connect(this.masterGain || this.ctx.destination);
        popOsc.start();
        popOsc.stop(this.ctx.currentTime + 0.025);
      }
    }, 400);

    // 4. Cafe Murmur (warm filtered resonance)
    const cafeFilter = ctx.createBiquadFilter();
    cafeFilter.type = 'bandpass';
    cafeFilter.frequency.value = 500;
    cafeFilter.Q.value = 1.2;

    const cafeSource = ctx.createBufferSource();
    cafeSource.buffer = rainBuffer;
    cafeSource.loop = true;

    this.cafeGain = ctx.createGain();
    this.cafeGain.gain.setValueAtTime(0, ctx.currentTime);

    cafeSource.connect(cafeFilter);
    cafeFilter.connect(this.cafeGain);
    this.cafeGain.connect(this.masterGain || ctx.destination);
    cafeSource.start();

    // 5. Alpha Binaural Drone (10Hz difference between left and right ears: 210Hz & 220Hz)
    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    oscL.type = 'sine';
    oscR.type = 'sine';
    oscL.frequency.value = 210;
    oscR.frequency.value = 220; // 10Hz Alpha focus rhythm

    const merger = ctx.createChannelMerger(2);
    this.alphaGain = ctx.createGain();
    this.alphaGain.gain.setValueAtTime(0, ctx.currentTime);

    oscL.connect(merger, 0, 0);
    oscR.connect(merger, 0, 1);
    merger.connect(this.alphaGain);
    this.alphaGain.connect(this.masterGain || ctx.destination);

    oscL.start();
    oscR.start();

    this.ambientSources = [rainSource, thunderSource, vinylSource, cafeSource, oscL, oscR, popInterval];
  }

  public updateAmbientLevels(levels: {
    rain: number;
    thunder: number;
    vinyl: number;
    cafe: number;
    alpha: number;
  }) {
    if (!this.isAmbientRunning) {
      const anyActive = Object.values(levels).some((v) => v > 0);
      if (anyActive) {
        this.startAmbientGenerator();
      } else {
        return;
      }
    }

    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    if (this.rainGain) this.rainGain.gain.setTargetAtTime(levels.rain * 0.35, now, 0.1);
    if (this.thunderGain) this.thunderGain.gain.setTargetAtTime(levels.thunder * 0.45, now, 0.1);
    if (this.vinylGain) this.vinylGain.gain.setTargetAtTime(levels.vinyl * 0.25, now, 0.1);
    if (this.cafeGain) this.cafeGain.gain.setTargetAtTime(levels.cafe * 0.3, now, 0.1);
    if (this.alphaGain) this.alphaGain.gain.setTargetAtTime(levels.alpha * 0.2, now, 0.1);
  }
}

export const sound = new SoundSystem();
