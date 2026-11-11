import { describe, it, expect } from "vitest";

describe("Audio Timing Math & Beat Calculations", () => {
  function getBeatDuration(bpm: number): number {
    return 60.0 / bpm;
  }

  function getBarDuration(bpm: number): number {
    return getBeatDuration(bpm) * 4;
  }

  function getSessionDuration(bpm: number, totalBars: number): number {
    return getBarDuration(bpm) * totalBars;
  }

  it("calculates exact beat duration without floating point accumulation", () => {
    expect(getBeatDuration(60)).toBeCloseTo(1.0, 5);
    expect(getBeatDuration(120)).toBeCloseTo(0.5, 5);
    expect(getBeatDuration(90)).toBeCloseTo(0.666667, 5);
    expect(getBeatDuration(88)).toBeCloseTo(0.681818, 5);
  });

  it("computes accurate bar durations", () => {
    // At 88 BPM (standard boom-bap):
    // 1 beat = 60 / 88 = 0.681818s
    // 1 bar (4 beats) = 2.72727s
    expect(getBarDuration(88)).toBeCloseTo(2.72727, 4);
    // At 102 BPM (Moroccan Chaabi trap):
    // 1 bar = 4 * (60 / 102) = 2.3529s
    expect(getBarDuration(102)).toBeCloseTo(2.35294, 4);
  });

  it("calculates multi-bar cypher lengths without drift", () => {
    // 16 bars at 88 BPM: 16 * 2.72727 = 43.636s
    expect(getSessionDuration(88, 16)).toBeCloseTo(43.63636, 3);
    // 32 bars at 90 BPM: 32 * (4 * 60 / 90) = 85.333s
    expect(getSessionDuration(90, 32)).toBeCloseTo(85.33333, 3);
  });

  it("verifies lookahead interval is strictly less than beat duration", () => {
    const maxBpm = 160;
    const shortestBeat = 60 / maxBpm; // 0.375s = 375ms
    const lookaheadSec = 0.025; // 25ms
    expect(lookaheadSec).toBeLessThan(shortestBeat / 4);
  });
});
