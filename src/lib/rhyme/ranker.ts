import { RhymeWord } from "@/types/game";
import { RhymeMatch } from "@/types/rhyme";
import { analyzeWord, compareRhyme } from "./rhymeKey";

export interface RankerOptions {
  includeSensitive?: boolean;
  maxSyllables?: number;
  minFrequency?: number;
}

/**
 * Searches and ranks candidate rhymes for a given query word.
 */
export function rankRhymes(
  queryWord: string,
  wordPool: RhymeWord[],
  options: RankerOptions = {}
): RhymeMatch[] {
  const {
    includeSensitive = false,
    maxSyllables = 3,
    minFrequency = 0,
  } = options;

  const queryAnalysis = analyzeWord(queryWord);
  if (!queryAnalysis.rhymeKey) {
    return [];
  }

  const matches: RhymeMatch[] = [];

  for (const candidate of wordPool) {
    // Filter sensitive words unless explicitly requested
    if (candidate.sensitive && !includeSensitive) {
      continue;
    }

    // Filter rare words if requested
    if (candidate.frequency < minFrequency) {
      continue;
    }

    // Filter words with too many syllables for rap delivery
    if (candidate.syllables > maxSyllables) {
      continue;
    }

    // Avoid self-match
    if (
      candidate.latn.toLowerCase() === queryAnalysis.normalized ||
      candidate.ar === queryWord
    ) {
      continue;
    }

    const candidateAnalysis = analyzeWord(candidate.latn || candidate.ar);
    const result = compareRhyme(queryAnalysis, candidateAnalysis);

    if (result.matches) {
      // Compute overall ranking score:
      // - Perfect vs near weight
      // - Frequency weight
      // - Syllable penalty if > 2
      const qualityBase = result.quality === "perfect" ? 100 : 50;
      const freqBonus = candidate.frequency * 0.4;
      const syllableScore = candidate.syllables <= 2 ? 10 : 0;
      const totalScore = qualityBase + freqBonus + syllableScore;

      matches.push({
        word: candidate,
        quality: result.quality,
        similarityScore: totalScore,
      });
    }
  }

  // Sort descending by score
  return matches.sort((a, b) => b.similarityScore - a.similarityScore);
}
