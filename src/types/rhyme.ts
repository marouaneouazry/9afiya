import { RhymeWord } from "./game";

export type RhymeQuality = "perfect" | "near";

export interface RhymeMatch {
  word: RhymeWord;
  quality: RhymeQuality;
  similarityScore: number;
}

export interface RhymeGroup {
  rhymeKey: string;
  phoneticEnding: string;
  type: RhymeQuality;
  vowelNucleus: string;
  coda: string;
  words: RhymeWord[];
}

export interface PhoneticAnalysis {
  original: string;
  normalized: string;
  rhymeKey: string;
  vowelNucleus: string;
  coda: string;
  syllableCount: number;
  patternType: "closed_coda" | "open_vowel" | "cluster";
}
