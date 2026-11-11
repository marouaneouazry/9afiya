/**
 * Phonetic Normalizer for Moroccan Darija
 * Maps Arabic script and Arabizi numerals (3, 7, 9, 8, 5, 2)
 * into a unified phonetic representation.
 */

// Arabic character to phonetic mapping
const ARABIC_TO_PHONETIC: Record<string, string> = {
  // Consonants
  "ء": "2",
  "ا": "a",
  "آ": "a",
  "أ": "2",
  "إ": "i",
  "ؤ": "2",
  "ئ": "2",
  "ى": "a",
  "ب": "b",
  "ت": "t",
  "ث": "t",
  "ج": "j",
  "ح": "7",
  "خ": "x",
  "د": "d",
  "ذ": "d",
  "ر": "r",
  "ز": "z",
  "س": "s",
  "ش": "sh",
  "ص": "S",
  "ض": "D",
  "ط": "T",
  "ظ": "D",
  "ع": "3",
  "غ": "gh",
  "ف": "f",
  "ق": "9",
  "ك": "k",
  "ل": "l",
  "م": "m",
  "ن": "n",
  "ه": "h",
  "و": "u", // Contextually handled (w or u)
  "ي": "i", // Contextually handled (y or i)
  "ة": "a", // Ta' marbuta
  "پ": "p",
  "ڤ": "v",
  "گ": "g",
  "كـ": "k",
};

/**
 * Checks if a string contains Arabic script characters.
 */
export function isArabicScript(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

/**
 * Transliterates Arabic script to phonetic Arabizi representation.
 */
export function arabicToPhonetic(text: string): string {
  let result = "";
  const cleaned = text.trim();

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    // Remove Arabic diacritics / tashkeel (fatha, damma, kasra, sukun, shaddah)
    if (/[\u064B-\u065F\u0670]/.test(char)) {
      continue;
    }
    // Handle special dipthongs for و and ي
    if (char === "و") {
      const prev = i > 0 ? cleaned[i - 1] : "";
      const next = i < cleaned.length - 1 ? cleaned[i + 1] : "";
      if (prev === "ا") {
        result += "w"; // aw
      } else if (!next || /[\s\p{P}]/u.test(next)) {
        result += "u"; // final vowel
      } else {
        result += "w";
      }
    } else if (char === "ي") {
      const prev = i > 0 ? cleaned[i - 1] : "";
      const next = i < cleaned.length - 1 ? cleaned[i + 1] : "";
      if (prev === "ا") {
        result += "y"; // ay
      } else if (!next || /[\s\p{P}]/u.test(next)) {
        result += "i"; // final vowel
      } else if (ARABIC_TO_PHONETIC[next] && next !== "ا" && next !== "و" && next !== "ي") {
        result += "i"; // medial vowel between consonants e.g. عين -> 3in, بيت -> bit
      } else {
        result += "y";
      }
    } else if (ARABIC_TO_PHONETIC[char]) {
      result += ARABIC_TO_PHONETIC[char];
    } else if (/[a-zA-Z0-9]/.test(char)) {
      result += char;
    }
  }

  return result;
}

/**
 * Normalizes Arabizi and phonetic text:
 * - standardizes vowel variations (ee -> i, oo -> u, aa -> a, ou -> u)
 * - merges diphthong spellings (ay, ey, ai -> ay; aw, au -> aw)
 * - standardizes consonant digraphs (kh -> x, ch -> sh)
 */
export function normalizePhonetic(raw: string): string {
  let text = raw.trim();

  // If in Arabic script, transliterate first
  if (isArabicScript(text)) {
    text = arabicToPhonetic(text);
  }

  // Normalize case (preserve capital emphatic consonants T, S, D if present, or normalize to lower)
  let lower = text.toLowerCase();

  // Replace kh and 5 with x (خ)
  lower = lower.replace(/kh|5/g, "x");
  // Replace sh and ch with sh (ش)
  lower = lower.replace(/ch/g, "sh");
  // Replace gh with gh (غ)
  lower = lower.replace(/rgh/g, "gh");

  // Vowel normalization:
  // Long vowels
  lower = lower.replace(/ee+|iy|ii/g, "i");
  lower = lower.replace(/oo+|ou+|uu/g, "u");
  lower = lower.replace(/aa+/g, "a");

  // Diphthongs
  lower = lower.replace(/ai|ey|ei/g, "ay");
  lower = lower.replace(/au/g, "aw");

  // Remove trailing or leading non-alphanumeric except numbers 2-9
  lower = lower.replace(/[^a-z0-9]/g, "");

  return lower;
}
