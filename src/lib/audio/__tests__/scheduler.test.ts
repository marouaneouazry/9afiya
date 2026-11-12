import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BEAT_DEFINITIONS } from "../beatDefinitions";
import { BeatScheduler } from "../BeatScheduler";
import { previewManager } from "../previewManager";

describe("Data-Driven BeatScheduler & Preview Manager", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    (globalThis as any).window = globalThis;
    previewManager.stop();
  });

  afterEach(() => {
    previewManager.stop();
    vi.useRealTimers();
  });

  it("should initialize with any beat definition and correct tempo", () => {
    for (const beat of BEAT_DEFINITIONS) {
      const scheduler = new BeatScheduler(beat);
      expect(scheduler.getBpm()).toBe(beat.bpm);
      expect(scheduler.getBeat().id).toBe(beat.id);
      expect(scheduler.getIsPlaying()).toBe(false);
    }
  });

  it("should calculate correct 16th-note durations and swing offsets", () => {
    const boombap = BEAT_DEFINITIONS.find((b) => b.id === "boombap")!;
    const secondsPerBeat = 60.0 / boombap.bpm;
    const secondsPer16th = secondsPerBeat / 4.0;

    expect(secondsPer16th).toBeCloseTo(0.17045, 4);

    // Verify swing adds positive delay on odd sixteenth steps
    const swingDelay = secondsPer16th * boombap.swing * 0.75;
    expect(swingDelay).toBeGreaterThan(0);
    expect(swingDelay).toBeLessThan(secondsPer16th / 2);
  });

  it("should clamp tempo changes strictly within safe bounds", () => {
    const scheduler = new BeatScheduler("boombap");
    scheduler.setBpm(200);
    expect(scheduler.getBpm()).toBe(160);

    scheduler.setBpm(30);
    expect(scheduler.getBpm()).toBe(50);

    scheduler.setBpm(85);
    expect(scheduler.getBpm()).toBe(85);
  });

  it("should allow only one preview at a time and stop previous preview", () => {
    const mockCtx = {
      state: "running",
      currentTime: 10,
      sampleRate: 44100,
      destination: {},
      createOscillator: () => ({
        type: "sine",
        frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }),
      createGain: () => ({
        gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(),
      }),
      createBiquadFilter: () => ({
        type: "lowpass",
        frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        Q: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
      }),
      createBuffer: () => ({ getChannelData: () => new Float32Array(100) }),
      createBufferSource: () => ({ buffer: null, connect: vi.fn(), start: vi.fn(), stop: vi.fn() }),
      resume: vi.fn(),
    };
    (globalThis as any).AudioContext = vi.fn().mockImplementation(() => mockCtx);

    const boombap = BEAT_DEFINITIONS[0];
    const chaabi = BEAT_DEFINITIONS[3];

    let lastState: any = null;
    const unsub = previewManager.subscribe((st) => {
      lastState = st;
    });

    previewManager.play(boombap);
    expect(previewManager.getCurrentBeatId()).toBe("boombap");
    expect(lastState?.playingBeatId).toBe("boombap");

    // Starting chaabi must immediately stop boombap
    previewManager.play(chaabi);
    expect(previewManager.getCurrentBeatId()).toBe("chaabi");
    expect(lastState?.playingBeatId).toBe("chaabi");

    // Explicit stop
    previewManager.stop();
    expect(previewManager.getCurrentBeatId()).toBeNull();
    expect(lastState?.playingBeatId).toBeNull();

    unsub();
  });

  it("should automatically stop preview when 2-bar limit or 8 seconds is reached", () => {
    const mockCtx = {
      state: "running",
      currentTime: 0,
      sampleRate: 44100,
      destination: {},
      createOscillator: () => ({
        type: "sine",
        frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }),
      createGain: () => ({
        gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(),
      }),
      createBiquadFilter: () => ({
        type: "lowpass",
        frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        Q: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
      }),
      createBuffer: () => ({ getChannelData: () => new Float32Array(100) }),
      createBufferSource: () => ({ buffer: null, connect: vi.fn(), start: vi.fn(), stop: vi.fn() }),
      resume: vi.fn(),
    };
    (globalThis as any).AudioContext = vi.fn().mockImplementation(() => mockCtx);

    const trap = BEAT_DEFINITIONS.find((b) => b.id === "trap")!; // 72 BPM -> 2 bars = ~6.66s
    previewManager.play(trap);
    expect(previewManager.getCurrentBeatId()).toBe("trap");

    // Advance 7 seconds
    vi.advanceTimersByTime(7000);

    // Auto-stop must have fired
    expect(previewManager.getCurrentBeatId()).toBeNull();
  });
});
