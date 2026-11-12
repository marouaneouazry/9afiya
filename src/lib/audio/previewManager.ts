import { BeatDefinition } from "@/types/audio";
import { getBeatById, BEAT_DEFINITIONS } from "./beatDefinitions";
import { BeatScheduler, getSharedAudioContext } from "./BeatScheduler";

type PreviewListener = (state: { playingBeatId: string | null; progress: number }) => void;

class BeatPreviewManager {
  private currentBeatId: string | null = null;
  private scheduler: BeatScheduler | null = null;
  private autoStopTimer: ReturnType<typeof setTimeout> | null = null;
  private progressTimer: ReturnType<typeof setInterval> | null = null;
  private startTime: number = 0;
  private totalDurationMs: number = 0;
  private listeners: Set<PreviewListener> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      // Auto-stop preview when user switches tabs or page loses visibility
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.stop();
        }
      });
      window.addEventListener("pagehide", () => this.stop());
    }
  }

  public subscribe(listener: PreviewListener): () => void {
    this.listeners.add(listener);
    listener({ playingBeatId: this.currentBeatId, progress: this.getProgress() });
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const state = { playingBeatId: this.currentBeatId, progress: this.getProgress() };
    this.listeners.forEach((l) => l(state));
  }

  private getProgress(): number {
    if (!this.currentBeatId || this.totalDurationMs <= 0) return 0;
    const elapsed = Date.now() - this.startTime;
    return Math.min(1.0, Math.max(0, elapsed / this.totalDurationMs));
  }

  public togglePreview(beatOrId: BeatDefinition | string): void {
    const beat = typeof beatOrId === "string" ? getBeatById(beatOrId) : beatOrId;
    if (!beat) return;

    if (this.currentBeatId === beat.id) {
      this.stop();
      return;
    }

    this.play(beat);
  }

  public play(beat: BeatDefinition): void {
    this.stop();

    const ctx = getSharedAudioContext();
    this.scheduler = new BeatScheduler(beat, beat.bpm, ctx);

    // 2 bars duration in ms = 2 bars * 4 beats * (60 / bpm) * 1000
    const twoBarsMs = (8 * 60 / beat.bpm) * 1000;
    // Cap at 8.0 seconds maximum
    this.totalDurationMs = Math.min(8000, twoBarsMs);
    this.startTime = Date.now();
    this.currentBeatId = beat.id;

    this.scheduler.start(2); // Play 2 bars
    this.notify();

    // Progress updates at ~30fps for smooth progress bar
    this.progressTimer = setInterval(() => {
      this.notify();
    }, 33);

    // Auto-stop exactly when 2 bars / 8s limit finishes
    this.autoStopTimer = setTimeout(() => {
      this.stop();
    }, this.totalDurationMs);
  }

  public stop(): void {
    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
      this.autoStopTimer = null;
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
    if (this.scheduler) {
      this.scheduler.stop();
      this.scheduler = null;
    }
    if (this.currentBeatId !== null) {
      this.currentBeatId = null;
      this.totalDurationMs = 0;
      this.notify();
    }
  }

  public getCurrentBeatId(): string | null {
    return this.currentBeatId;
  }
}

export const previewManager = new BeatPreviewManager();
