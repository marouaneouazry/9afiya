import { normalizePhonetic } from "./normalizer";
import { PhoneticAnalysis, RhymeQuality } from "@/types/rhyme";

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

// Phonetically related consonants for near-rhymes (codas)
const CODA_CLASSES: Record<string, string> = {
  m: "nasal",
  n: "nasal",
  b: "bilabial_stop",
  p: "bilabial_stop",
  d: "dental_stop",
  t: "dental_stop",
  T: "dental_stop",
  s: "sibilant",
  z: "sibilant",
  S: "sibilant",
  sh: "postalveolar_fricative",
  j: "postalveolar_fricative",
  f: "labiodental",
  v: "labiodental",
  r: "liquid",
  l: "liquid",
  k: "velar",
  g: "velar",
  "9": "uvular_stop",
  x: "velar_fricative",
  gh: "uvular_fricative",
  "7": "pharyngeal_fricative",
  "3": "pharyngeal_voiced",
  h: "glottal",
  "2": "glottal",
};

/**
 * Extracts the rhyme key and phonetic analysis for a Darija word.
 */
export function analyzeWord(word: string): PhoneticAnalysis {
  const norm = normalizePhonetic(word);

  if (!norm) {
    return {
      original: word,
      normalized: "",
      rhymeKey: "",
      vowelNucleus: "",
      coda: "",
      syllableCount: 1,
      patternType: "closed_coda",
    };
  }

  // Count vowel pulses for approximate syllable count
  const vowelMatches = norm.match(/[aeiouy]+/g);
  const syllableCount = vowelMatches ? Math.max(1, vowelMatches.length) : 1;

  // Case 1: Open vowel ending (-a, -i, -u, -e, -o)
  if (norm.endsWith("a") || norm.endsWith("i") || norm.endsWith("u")) {
    const vowel = norm[norm.length - 1];
    // Include preceding consonant / semivowel (e.g., -wa, -la, -ya, -ra, -ti)
    const prevChar = norm.length > 1 ? norm[norm.length - 2] : "";
    const coda = prevChar ? prevChar + vowel : vowel;
    return {
      original: word,
      normalized: norm,
      rhymeKey: coda,
      vowelNucleus: vowel,
      coda,
      syllableCount,
      patternType: "open_vowel",
    };
  }

  // Case 2: Closed syllable with vowel nucleus (e.g., -ar, -ayn, -am, -ad, -il, -uj)
  // Check for diphthongs 'ay' or 'aw' followed by non-vowel codas
  const diphthongMatch = norm.match(/(ay|aw)([^aeiou]*)$/);
  if (diphthongMatch) {
    const nucleus = diphthongMatch[1];
    const coda = diphthongMatch[2];
    return {
      original: word,
      normalized: norm,
      rhymeKey: nucleus + coda,
      vowelNucleus: nucleus,
      coda,
      syllableCount,
      patternType: "closed_coda",
    };
  }

  // Single vowel nucleus followed by non-vowel coda consonants
  const vowelMatch = norm.match(/([aeiou]+)([^aeiou]+)$/);
  if (vowelMatch) {
    const nucleus = vowelMatch[1];
    const coda = vowelMatch[2];
    return {
      original: word,
      normalized: norm,
      rhymeKey: nucleus + coda,
      vowelNucleus: nucleus,
      coda,
      syllableCount,
      patternType: "closed_coda",
    };
  }

  // Case 3: Vowelless consonant cluster (e.g. drb, chrb, 9lb)
  // Darija words with elided vowels rhyme by the cluster coda with implicit schwa 'e'
  const lastCluster = norm.length >= 2 ? norm.slice(-2) : norm;
  return {
    original: word,
    normalized: norm,
    rhymeKey: "e" + lastCluster,
    vowelNucleus: "e",
    coda: lastCluster,
    syllableCount: 1,
    patternType: "cluster",
  };
}

/**
 * Compares two phonetic analyses and returns their rhyme quality.
 */
export function compareRhyme(
  a: PhoneticAnalysis,
  b: PhoneticAnalysis
): { matches: boolean; quality: RhymeQuality; similarity: number } {
  if (!a.rhymeKey || !b.rhymeKey) {
    return { matches: false, quality: "near", similarity: 0 };
  }

  // Perfect rhyme: Identical rhyme key
  if (a.rhymeKey === b.rhymeKey) {
    return { matches: true, quality: "perfect", similarity: 1.0 };
  }

  // Near rhyme: Identical vowel nucleus + codas from the same phonetic class
  if (a.vowelNucleus && a.vowelNucleus === b.vowelNucleus) {
    const classA = CODA_CLASSES[a.coda] || a.coda;
    const classB = CODA_CLASSES[b.coda] || b.coda;
    if (classA === classB) {
      return { matches: true, quality: "near", similarity: 0.85 };
    }
    // Partial coda overlap (e.g., -ar vs -ard)
    if (a.coda.includes(b.coda) || b.coda.includes(a.coda)) {
      return { matches: true, quality: "near", similarity: 0.75 };
    }
  }

  return { matches: false, quality: "near", similarity: 0 };
}
