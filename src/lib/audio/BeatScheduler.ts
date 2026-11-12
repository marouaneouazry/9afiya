import { ProceduralSynth } from "./ProceduralBeats";
import { BeatDefinition } from "@/types/audio";
import { BEAT_DEFINITIONS, getBeatById } from "./beatDefinitions";

export type BeatStyle = string;

export interface BeatCallback {
  (bar: number, beat: number, time: number): void;
}

let sharedAudioContext: AudioContext | null = null;

export function getSharedAudioContext(): AudioContext {
  if (typeof window === "undefined") {
    throw new Error("AudioContext is only available in browser environment");
  }
  if (!sharedAudioContext) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === "suspended") {
    sharedAudioContext.resume();
  }
  return sharedAudioContext;
}

export class BeatScheduler {
  private ctx: AudioContext | null = null;
  private synth: ProceduralSynth | null = null;
  private beat: BeatDefinition;
  private bpm: number;
  private isPlaying: boolean = false;
  private currentBar: number = 1;
  private currentStep: number = 0; // 0 to 15 within the current bar
  private nextStepTime: number = 0;
  private timerID: number | null = null;
  private lookaheadMs: number = 25;
  private scheduleAheadSec: number = 0.1;
  private onBeatCallbacks: Set<BeatCallback> = new Set();
  private maxBars: number | null = null;

  constructor(
    first?: BeatDefinition | string | number,
    second?: BeatDefinition | string | number,
    existingContext?: AudioContext
  ) {
    let resolvedBeat: BeatDefinition | string = "boombap";
    let resolvedBpm: number | undefined;

    if (typeof first === "number") {
      resolvedBpm = first;
      if (typeof second === "string" || typeof second === "object") {
        resolvedBeat = second;
      }
    } else if (typeof first === "string" || typeof first === "object") {
      resolvedBeat = first;
      if (typeof second === "number") {
        resolvedBpm = second;
      }
    }

    if (typeof resolvedBeat === "string") {
      this.beat = getBeatById(resolvedBeat) || BEAT_DEFINITIONS[0];
    } else {
      this.beat = resolvedBeat;
    }
    this.bpm = resolvedBpm || this.beat.bpm;
    if (existingContext) {
      this.ctx = existingContext;
      this.synth = new ProceduralSynth(this.ctx);
    }
  }

  public initContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = getSharedAudioContext();
      this.synth = new ProceduralSynth(this.ctx);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public start(maxBars?: number): void {
    const ctx = this.initContext();
    if (this.isPlaying) return;

    this.maxBars = maxBars || null;
    this.isPlaying = true;
    this.currentBar = 1;
    this.currentStep = 0;
    this.nextStepTime = ctx.currentTime + 0.05;

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

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setBpm(bpm: number): void {
    this.bpm = Math.max(50, Math.min(160, bpm));
  }

  public getBpm(): number {
    return this.bpm;
  }

  public setBeat(beatOrStyle: BeatDefinition | string): void {
    if (typeof beatOrStyle === "string") {
      const found = getBeatById(beatOrStyle);
      if (found) {
        this.beat = found;
      }
    } else {
      this.beat = beatOrStyle;
    }
  }

  public setStyle(style: BeatStyle): void {
    this.setBeat(style);
  }

  public getBeat(): BeatDefinition {
    return this.beat;
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

    while (this.nextStepTime < this.ctx.currentTime + this.scheduleAheadSec) {
      if (this.maxBars && this.currentBar > this.maxBars) {
        this.stop();
        return;
      }
      this.scheduleSixteenthStep(this.currentBar, this.currentStep, this.nextStepTime);
      this.advanceStep();
    }
  }

  private advanceStep(): void {
    const secondsPer16th = (60.0 / this.bpm) / 4.0;
    this.nextStepTime += secondsPer16th;

    this.currentStep++;
    if (this.currentStep >= 16) {
      this.currentStep = 0;
      this.currentBar++;
    }
  }

  private scheduleSixteenthStep(bar: number, step: number, time: number): void {
    if (!this.synth) return;

    const secondsPerBeat = 60.0 / this.bpm;
    const secondsPer16th = secondsPerBeat / 4.0;

    // Apply swing on odd sixteenth notes (1, 3, 5, 7, 9, 11, 13, 15)
    let noteTime = time;
    if (step % 2 === 1 && this.beat.swing) {
      noteTime += secondsPer16th * this.beat.swing * 0.75;
    }

    // Trigger visual/state callback on quarter note beats (steps 0, 4, 8, 12)
    if (step % 4 === 0) {
      const beatNumber = Math.floor(step / 4) + 1; // 1, 2, 3, 4
      this.onBeatCallbacks.forEach((cb) => cb(bar, beatNumber, noteTime));
    }

    const { patterns, bassNotes, padChords } = this.beat;

    // Trigger procedural voices per instrument pattern
    if (patterns.kick && patterns.kick[step] > 0) {
      this.synth.playKick(noteTime, patterns.kick[step]);
    }

    if (patterns.snare && patterns.snare[step] > 0) {
      this.synth.playSnare(noteTime, patterns.snare[step]);
    }

    if (patterns.clap && patterns.clap[step] > 0) {
      this.synth.playClap(noteTime, patterns.clap[step]);
    }

    if (patterns.hat_closed && patterns.hat_closed[step] > 0) {
      this.synth.playHiHat(noteTime, false, patterns.hat_closed[step]);
    }

    if (patterns.hat_open && patterns.hat_open[step] > 0) {
      this.synth.playHiHat(noteTime, true, patterns.hat_open[step]);
    }

    if (patterns.darbouka_dum && patterns.darbouka_dum[step] > 0) {
      this.synth.playDarboukaDum(noteTime, patterns.darbouka_dum[step]);
    }

    if (patterns.darbouka_tek && patterns.darbouka_tek[step] > 0) {
      this.synth.playDarboukaTek(noteTime, patterns.darbouka_tek[step]);
    }

    if (patterns.krakeb && patterns.krakeb[step] > 0) {
      this.synth.playKrakeb(noteTime, patterns.krakeb[step]);
    }

    if (patterns.bendir && patterns.bendir[step] > 0) {
      this.synth.playBendir(noteTime, patterns.bendir[step]);
    }

    if (patterns.sub_bass && patterns.sub_bass[step] > 0) {
      const noteHz = bassNotes && bassNotes[step] ? bassNotes[step]! : 55;
      this.synth.playSubBass(noteTime, noteHz, secondsPerBeat * 0.9, patterns.sub_bass[step]);
    }

    if (patterns.guembri_bass && patterns.guembri_bass[step] > 0) {
      const noteHz = bassNotes && bassNotes[step] ? bassNotes[step]! : 65.4;
      this.synth.playGuembriBass(noteTime, noteHz, patterns.guembri_bass[step]);
    }

    if (patterns.pad && patterns.pad[step] > 0) {
      const chord = padChords && padChords[step] ? padChords[step]! : [220, 261.6, 329.6];
      this.synth.playPad(noteTime, chord, secondsPerBeat * 2.5, patterns.pad[step]);
    }
  }
}
