/**
 * Procedural Web Audio Synthesizer for 9afiya
 * Synthesizes zero-license kicks, snares, hats, sub-bass, pads, and authentic
 * Moroccan percussion (darbouka dum/tek, krakeb, bendir, handclaps, and guembri bass).
 */

export class ProceduralSynth {
  private ctx: AudioContext;
  private noiseBuffer: AudioBuffer | null = null;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.generateNoiseBuffer();
  }

  private generateNoiseBuffer(): void {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  /**
   * Synthesized Boom-Bap / Hip-Hop Kick
   */
  public playKick(time: number, velocity: number = 1.0): void {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

    gain.gain.setValueAtTime(0.9 * velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.36);
  }

  /**
   * Snare / Rim with noise burst and tone body
   */
  public playSnare(time: number, velocity: number = 1.0): void {
    if (!this.noiseBuffer) return;

    // Noise component
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.setValueAtTime(800, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6 * velocity, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    // Body tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.08);

    oscGain.gain.setValueAtTime(0.5 * velocity, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    noiseSource.start(time);
    noiseSource.stop(time + 0.25);
    osc.start(time);
    osc.stop(time + 0.15);
  }

  /**
   * Handclap (Triple layered micro-burst with bandpass resonance)
   */
  public playClap(time: number, velocity: number = 0.8): void {
    if (!this.noiseBuffer) return;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1150, time);
    filter.Q.setValueAtTime(2.0, time);

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.7 * velocity, time);
    masterGain.gain.exponentialRampToValueAtTime(0.001, time + 0.24);

    filter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    // 3 rapid burst taps
    [0, 0.012, 0.024].forEach((offset) => {
      if (!this.noiseBuffer) return;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const tapGain = this.ctx.createGain();
      tapGain.gain.setValueAtTime(0.6, time + offset);
      tapGain.gain.exponentialRampToValueAtTime(0.001, time + offset + 0.04);
      src.connect(tapGain);
      tapGain.connect(filter);
      src.start(time + offset);
      src.stop(time + offset + 0.05);
    });
  }

  /**
   * Hi-Hat (Closed / Open)
   */
  public playHiHat(time: number, isOpen: boolean = false, velocity: number = 0.7): void {
    if (!this.noiseBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(7000, time);

    const gain = this.ctx.createGain();
    const duration = isOpen ? 0.35 : 0.05;
    gain.gain.setValueAtTime(0.35 * velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    source.start(time);
    source.stop(time + duration + 0.01);
  }

  /**
   * Moroccan Darbouka "Dum" (Bass thud)
   */
  public playDarboukaDum(time: number, velocity: number = 1.0): void {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(115, time);
    osc.frequency.exponentialRampToValueAtTime(62, time + 0.15);

    gain.gain.setValueAtTime(0.85 * velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.41);
  }

  /**
   * Moroccan Darbouka "Tek" (Sharp rim click)
   */
  public playDarboukaTek(time: number, velocity: number = 1.0): void {
    if (!this.noiseBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1850, time);
    filter.Q.setValueAtTime(3.5, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7 * velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    source.start(time);
    source.stop(time + 0.09);
  }

  /**
   * Moroccan Krakeb (Gnawa/Chaabi metallic iron castanets)
   */
  public playKrakeb(time: number, velocity: number = 0.8): void {
    if (!this.noiseBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;

    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = "bandpass";
    filter1.frequency.setValueAtTime(2600, time);
    filter1.Q.setValueAtTime(4.0, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.45 * velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

    source.connect(filter1);
    filter1.connect(gain);
    gain.connect(this.ctx.destination);

    source.start(time);
    source.stop(time + 0.07);
  }

  /**
   * Moroccan Bendir (Frame drum with skin resonance and internal snare buzz)
   */
  public playBendir(time: number, velocity: number = 1.0): void {
    // 1. Skin body resonance
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(95, time);
    osc.frequency.exponentialRampToValueAtTime(58, time + 0.18);

    oscGain.gain.setValueAtTime(0.8 * velocity, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    // 2. Snare wire buzzing against skin
    if (this.noiseBuffer) {
      const buzz = this.ctx.createBufferSource();
      buzz.buffer = this.noiseBuffer;

      const buzzFilter = this.ctx.createBiquadFilter();
      buzzFilter.type = "bandpass";
      buzzFilter.frequency.setValueAtTime(1400, time);
      buzzFilter.Q.setValueAtTime(2.5, time);

      const buzzGain = this.ctx.createGain();
      buzzGain.gain.setValueAtTime(0.25 * velocity, time);
      buzzGain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

      buzz.connect(buzzFilter);
      buzzFilter.connect(buzzGain);
      buzzGain.connect(this.ctx.destination);

      buzz.start(time);
      buzz.stop(time + 0.32);
    }

    osc.start(time);
    osc.stop(time + 0.46);
  }

  /**
   * Gnawa Guembri / Hajhouj Bass (camel-skin lute with woody pluck attack)
   */
  public playGuembriBass(time: number, noteHz: number = 65.4, velocity: number = 0.9): void {
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    // Fundamental + subtle octave overtone
    osc.type = "triangle";
    osc.frequency.setValueAtTime(noteHz, time);

    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(noteHz * 2, time);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, time);
    filter.frequency.exponentialRampToValueAtTime(180, time + 0.25);

    gain.gain.setValueAtTime(0.7 * velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + 0.42);
    osc2.stop(time + 0.42);
  }

  /**
   * Sub-Bass 808
   */
  public playSubBass(time: number, noteHz: number = 55, duration: number = 0.6, velocity: number = 1.0): void {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(noteHz, time);

    gain.gain.setValueAtTime(0.75 * velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  /**
   * Simple Warm Synth Pad (chord frequencies or single drone)
   */
  public playPad(time: number, frequencies: number[] = [220, 261.6, 329.6], duration: number = 1.2, velocity: number = 0.6): void {
    const masterGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, time);

    masterGain.gain.setValueAtTime(0.001, time);
    masterGain.gain.linearRampToValueAtTime(0.4 * velocity, time + 0.2);
    masterGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    filter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    frequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, time);
      osc.connect(filter);
      osc.start(time);
      osc.stop(time + duration + 0.05);
    });
  }
}
