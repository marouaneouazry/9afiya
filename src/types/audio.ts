export type PercussionType =
  | "kick"
  | "snare"
  | "hat_closed"
  | "hat_open"
  | "sub_bass"
  | "darbouka_dum"
  | "darbouka_tek"
  | "krakeb"
  | "bendir"
  | "clap"
  | "guembri_bass"
  | "pad";

export type MoodKey =
  | "classic"
  | "calm"
  | "festive"
  | "deep"
  | "dark"
  | "bouncy";

export interface BeatPatterns {
  kick?: number[];
  snare?: number[];
  hat_closed?: number[];
  hat_open?: number[];
  darbouka_dum?: number[];
  darbouka_tek?: number[];
  krakeb?: number[];
  bendir?: number[];
  clap?: number[];
  sub_bass?: number[];
  guembri_bass?: number[];
  pad?: number[];
  [instrument: string]: number[] | undefined;
}

export interface BeatDefinition {
  id: string;
  name: {
    "ary-Arab": string;
    "ary-Latn": string;
    en: string;
    fr: string;
  };
  bpm: number;
  key: string;
  swing: number; // 0.0 to 0.5 swing ratio
  mood: string[];
  moodKey: MoodKey;
  type: "procedural" | "file";
  license: string;
  attributionText: string;
  sourceUrl: string;
  dateAdded: string;
  loopBars: 4 | 8;
  patterns: BeatPatterns;
  bassNotes?: (number | null)[]; // Hz frequencies per 16-step bar
  padChords?: (number[] | null)[]; // chord frequencies per 16-step bar
}

export interface BeatMetadata {
  id: string;
  title: string;
  producer: string;
  bpm: number;
  key: string;
  license: string;
  sourceUrl: string;
  attributionText: string;
  dateAdded: string;
  audioUrl?: string;
  isProcedural?: boolean;
}

export interface BeatStep {
  time: number;
  beat: number; // 1, 2, 3, 4
  bar: number;
}
