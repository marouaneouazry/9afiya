/**
 * Procedural Web Audio Synthesizer for 9afiya
 * Synthesizes zero-license kicks, snares, hats, sub-bass, and authentic
 * Moroccan percussion (darbouka dum/tek and krakeb iron castanets).
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
   * Snare / Clap with noise burst and tone body
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
   * Moroccan Krakeb (Gnawa/Chaabi metallic iron castanet pulse)
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
   * Sub-Bass 808
   */
  public playSubBass(time: number, noteHz: number = 55, duration: number = 0.6): void {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(noteHz, time);

    gain.gain.setValueAtTime(0.75, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration + 0.02);
  }
}
