import { ProceduralSynth } from "./ProceduralBeats";

export type BeatStyle = "boombap" | "chaabi" | "lofi";

export interface BeatCallback {
  (bar: number, beat: number, time: number): void;
}

export class BeatScheduler {
  private ctx: AudioContext | null = null;
  private synth: ProceduralSynth | null = null;
  private bpm: number;
  private isPlaying: boolean = false;
  private currentBar: number = 1;
  private currentBeat: number = 1;
  private nextNoteTime: number = 0;
  private timerID: number | null = null;
  private lookaheadMs: number = 25;
  private scheduleAheadSec: number = 0.1;
  private style: BeatStyle = "boombap";
  private onBeatCallbacks: Set<BeatCallback> = new Set();

  constructor(bpm: number = 88, style: BeatStyle = "boombap") {
    this.bpm = bpm;
    this.style = style;
  }

  public initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
      this.synth = new ProceduralSynth(this.ctx);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public start(): void {
    const ctx = this.initContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentBar = 1;
    this.currentBeat = 1;
    this.nextNoteTime = ctx.currentTime + 0.05;

    this.scheduler();
    this.timerID = window.setInterval(() => this.scheduler(), this.lookaheadMs);
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.timerID !== null) {
      clearInterval(this.timerID);
      this.timerID = null;
    }
  }

  public setBpm(bpm: number): void {
    this.bpm = Math.max(50, Math.min(160, bpm));
  }

  public getBpm(): number {
    return this.bpm;
  }

  public setStyle(style: BeatStyle): void {
    this.style = style;
  }

  public subscribe(cb: BeatCallback): () => void {
    this.onBeatCallbacks.add(cb);
    return () => this.onBeatCallbacks.delete(cb);
  }

  public getCurrentAudioTime(): number {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  private scheduler(): void {
    if (!this.ctx || !this.isPlaying) return;

    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadSec) {
      this.schedulePatternStep(this.currentBar, this.currentBeat, this.nextNoteTime);
      this.advanceStep();
    }
  }

  private advanceStep(): void {
    const secondsPerBeat = 60.0 / this.bpm;
    this.nextNoteTime += secondsPerBeat;

    this.currentBeat++;
    if (this.currentBeat > 4) {
      this.currentBeat = 1;
      this.currentBar++;
    }
  }

  private schedulePatternStep(bar: number, beat: number, time: number): void {
    if (!this.synth) return;

    // Trigger visual/state callbacks
    this.onBeatCallbacks.forEach((cb) => cb(bar, beat, time));

    const secondsPerBeat = 60.0 / this.bpm;
    const halfBeat = secondsPerBeat / 2;

    switch (this.style) {
      case "boombap":
        // Kick on Beat 1, Beat 2.5, Beat 3
        if (beat === 1) {
          this.synth.playKick(time, 1.0);
          this.synth.playSubBass(time, 55, 0.4);
        } else if (beat === 2) {
          this.synth.playSnare(time, 0.9);
          this.synth.playKick(time + halfBeat, 0.7);
        } else if (beat === 3) {
          this.synth.playKick(time, 0.85);
        } else if (beat === 4) {
          this.synth.playSnare(time, 1.0); // Delivery punchline beat
        }
        // Continuous Hi-Hats on 8th notes
        this.synth.playHiHat(time, false, 0.6);
        this.synth.playHiHat(time + halfBeat, false, 0.4);
        break;

      case "chaabi":
        // Moroccan Chaabi rhythm: Darbouka Dum-Tek patterns & Krakeb pulse
        if (beat === 1) {
          this.synth.playDarboukaDum(time, 1.0);
          this.synth.playKick(time, 0.7);
        } else if (beat === 2) {
          this.synth.playDarboukaTek(time, 0.8);
          this.synth.playDarboukaTek(time + halfBeat, 0.9);
        } else if (beat === 3) {
          this.synth.playDarboukaDum(time, 0.85);
          this.synth.playDarboukaTek(time + halfBeat, 0.75);
        } else if (beat === 4) {
          this.synth.playSnare(time, 0.9);
          this.synth.playDarboukaTek(time, 1.0);
        }
        // Krakeb on off-beats
        this.synth.playKrakeb(time + halfBeat, 0.7);
        break;

      case "lofi":
        // Soft kick on 1 & 3, Rimshot on 2 & 4
        if (beat === 1) {
          this.synth.playKick(time, 0.6);
          this.synth.playSubBass(time, 48, 0.6);
        } else if (beat === 2 || beat === 4) {
          this.synth.playSnare(time, 0.5);
        } else if (beat === 3) {
          this.synth.playKick(time, 0.5);
        }
        this.synth.playHiHat(time, false, 0.35);
        this.synth.playHiHat(time + halfBeat, true, 0.25);
        break;
    }
  }
}
