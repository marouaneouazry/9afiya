import { describe, it, expect } from "vitest";
import { BEAT_DEFINITIONS, getBeatById, getRandomBeat } from "../beatDefinitions";
import fs from "fs";
import path from "path";

describe("Beat Definitions & Catalog Integrity", () => {
  const KNOWN_INSTRUMENTS = new Set([
    "kick",
    "snare",
    "hat_closed",
    "hat_open",
    "sub_bass",
    "darbouka_dum",
    "darbouka_tek",
    "krakeb",
    "bendir",
    "clap",
    "guembri_bass",
    "pad",
  ]);

  it("should contain exactly 10 distinct procedural beat styles", () => {
    expect(BEAT_DEFINITIONS.length).toBe(10);
    const ids = new Set(BEAT_DEFINITIONS.map((b) => b.id));
    expect(ids.size).toBe(10);
  });

  it("should enforce all BPM values strictly between 70 and 110", () => {
    for (const beat of BEAT_DEFINITIONS) {
      expect(beat.bpm).toBeGreaterThanOrEqual(70);
      expect(beat.bpm).toBeLessThanOrEqual(110);
    }
  });

  it("should provide localized names in ary-Arab, ary-Latn, en, and fr for every beat", () => {
    for (const beat of BEAT_DEFINITIONS) {
      expect(beat.name["ary-Arab"]).toBeTruthy();
      expect(beat.name["ary-Latn"]).toBeTruthy();
      expect(beat.name["en"]).toBeTruthy();
      expect(beat.name["fr"]).toBeTruthy();
    }
  });

  it("should define valid 16-step patterns with known instruments only", () => {
    for (const beat of BEAT_DEFINITIONS) {
      expect(beat.loopBars === 4 || beat.loopBars === 8).toBe(true);

      const instruments = Object.keys(beat.patterns);
      expect(instruments.length).toBeGreaterThan(0);

      for (const inst of instruments) {
        expect(KNOWN_INSTRUMENTS.has(inst), `Unknown instrument ${inst} in beat ${beat.id}`).toBe(true);

        const steps = beat.patterns[inst];
        expect(Array.isArray(steps)).toBe(true);
        expect(steps!.length).toBe(16);

        for (const velocity of steps!) {
          expect(velocity).toBeGreaterThanOrEqual(0);
          expect(velocity).toBeLessThanOrEqual(1);
        }
      }

      if (beat.bassNotes) {
        expect(beat.bassNotes.length).toBe(16);
      }
      if (beat.padChords) {
        expect(beat.padChords.length).toBe(16);
      }
    }
  });

  it("should find beats by ID and return a random beat", () => {
    const boombap = getBeatById("boombap");
    expect(boombap).toBeDefined();
    expect(boombap?.bpm).toBe(88);

    const randomBeat = getRandomBeat();
    expect(randomBeat).toBeDefined();
    expect(BEAT_DEFINITIONS.some((b) => b.id === randomBeat.id)).toBe(true);
  });

  it("should match public/beats/beats.json metadata", () => {
    const beatsJsonPath = path.resolve(__dirname, "../../../../public/beats/beats.json");
    expect(fs.existsSync(beatsJsonPath)).toBe(true);

    const raw = fs.readFileSync(beatsJsonPath, "utf-8");
    const catalog = JSON.parse(raw);
    expect(Array.isArray(catalog)).toBe(true);
    expect(catalog.length).toBe(10);

    for (const item of catalog) {
      expect(item.id).toBeTruthy();
      expect(item.bpm).toBeGreaterThanOrEqual(70);
      expect(item.bpm).toBeLessThanOrEqual(110);
      expect(item.license).toBe("CC0 1.0 Universal");
      expect(item.name["ary-Arab"]).toBeTruthy();
      expect(item.name["en"]).toBeTruthy();
    }
  });
});
