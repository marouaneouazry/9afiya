import { describe, it, expect } from "vitest";
import { GameEngine, DefaultTimeSource } from "../GameEngine";
import { RhymeWord, TimeSource } from "@/types/game";

class MockTimeSource implements TimeSource {
  public time: number = 0;
  getCurrentTime(): number {
    return this.time;
  }
}

const mockWords: RhymeWord[] = [
  {
    ar: "دار",
    latn: "dar",
    eng: "house",
    syllables: 1,
    frequency: 90,
    sensitive: false,
    rhymeKey: "ar",
  },
  {
    ar: "نهار",
    latn: "nhar",
    eng: "day",
    syllables: 1,
    frequency: 90,
    sensitive: false,
    rhymeKey: "ar",
  },
  {
    ar: "عين",
    latn: "3ayn",
    eng: "eye",
    syllables: 1,
    frequency: 90,
    sensitive: false,
    rhymeKey: "ayn",
  },
  {
    ar: "زين",
    latn: "zayn",
    eng: "beauty",
    syllables: 1,
    frequency: 90,
    sensitive: false,
    rhymeKey: "ayn",
  },
];

describe("GameEngine (Pure Headless State Machine)", () => {
  it("initializes with default state", () => {
    const engine = new GameEngine({ bpm: 90, totalBars: 16 });
    const state = engine.getState();
    expect(state.bpm).toBe(90);
    expect(state.totalBars).toBe(16);
    expect(state.isPlaying).toBe(false);
    expect(state.currentBar).toBe(1);
    expect(state.currentBeat).toBe(1);
  });

  it("updates beats and bars based on injectable time source", () => {
    const mockTime = new MockTimeSource();
    const engine = new GameEngine({
      bpm: 60, // 1 second per beat, 4 seconds per bar
      totalBars: 8,
      wordsPool: mockWords,
      timeSource: mockTime,
    });

    mockTime.time = 0;
    engine.start(0);

    let state = engine.getState();
    expect(state.isPlaying).toBe(true);
    expect(state.currentBar).toBe(1);
    expect(state.currentBeat).toBe(1);

    // Advance 1.1 seconds -> beat 2
    engine.updateAtTime(1.1);
    state = engine.getState();
    expect(state.currentBar).toBe(1);
    expect(state.currentBeat).toBe(2);

    // Advance 3.5 seconds -> beat 4 (delivery beat)
    engine.updateAtTime(3.5);
    state = engine.getState();
    expect(state.currentBar).toBe(1);
    expect(state.currentBeat).toBe(4);

    // Advance 4.2 seconds -> bar 2, beat 1
    engine.updateAtTime(4.2);
    state = engine.getState();
    expect(state.currentBar).toBe(2);
    expect(state.currentBeat).toBe(1);
  });

  it("follows AABB rhyme pairing across bars", () => {
    const mockTime = new MockTimeSource();
    const engine = new GameEngine({
      bpm: 60,
      totalBars: 4,
      wordsPool: mockWords,
      timeSource: mockTime,
    });

    engine.start(0);

    // Bar 1 sound
    const bar1Sound = engine.getState().currentSoundKey;

    // Advance to Bar 2 (4 seconds)
    engine.updateAtTime(4.1);
    const bar2Sound = engine.getState().currentSoundKey;
    // Bar 1 and Bar 2 should share the same rhyme sound in AABB
    expect(bar2Sound).toBe(bar1Sound);

    // Advance to Bar 3 (8 seconds)
    engine.updateAtTime(8.1);
    const bar3Sound = engine.getState().currentSoundKey;
    // Bar 3 should switch to sound B
    expect(bar3Sound).not.toBe(bar1Sound);

    // Advance to Bar 4 (12 seconds)
    engine.updateAtTime(12.1);
    const bar4Sound = engine.getState().currentSoundKey;
    // Bar 4 should share sound B with Bar 3
    expect(bar4Sound).toBe(bar3Sound);
  });
});
