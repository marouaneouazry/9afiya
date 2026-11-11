import { describe, it, expect } from "vitest";
import { normalizePhonetic, arabicToPhonetic } from "../normalizer";
import { analyzeWord, compareRhyme } from "../rhymeKey";

describe("Phonetic Normalizer", () => {
  it("normalizes Arabizi numerals to phonemes", () => {
    expect(normalizePhonetic("3ayn")).toBe("3ayn");
    expect(normalizePhonetic("7elwa")).toBe("7elwa");
    expect(normalizePhonetic("9ahwa")).toBe("9ahwa");
    expect(normalizePhonetic("5obz")).toBe("xobz");
    expect(normalizePhonetic("khobz")).toBe("xobz");
  });

  it("normalizes Arabic script to phonetic representation", () => {
    expect(arabicToPhonetic("دار")).toBe("dar");
    expect(arabicToPhonetic("نهار")).toBe("nhar");
    expect(arabicToPhonetic("عين")).toBe("3in");
    expect(arabicToPhonetic("قهوة")).toBe("9hwa");
  });

  it("standardizes vowel variants and diphthongs", () => {
    expect(normalizePhonetic("3eyn")).toBe("3ayn");
    expect(normalizePhonetic("fayn")).toBe("fayn");
    expect(normalizePhonetic("drari")).toBe("drari");
  });
});

describe("Darija Rhyme Groups - 30+ Hand-Checked Moroccan Rhyme Sets", () => {
  const rhymeGroups = [
    { name: "Group 1 (-ar)", words: ["dar", "nhar", "jar", "nar"] },
    { name: "Group 2 (-ayn)", words: ["3ayn", "zayn", "bayn", "fayn"] },
    { name: "Group 3 (-am)", words: ["klam", "slam", "hlam", "hram"] },
    { name: "Group 4 (-ad)", words: ["blad", "wlad", "3bad", "3wad"] },
    { name: "Group 5 (-wa)", words: ["9ahwa", "chhwa", "da3wa", "fatwa"] },
    { name: "Group 6 (-la)", words: ["tabla", "hebla", "rebla", "hafla"] },
    { name: "Group 7 (-erb/-rb)", words: ["derb", "hreb", "Dreb", "ghreb"] },
    { name: "Group 8 (-il)", words: ["lil", "Twil", "qlil", "tqil"] },
    { name: "Group 9 (-as)", words: ["ras", "nas", "kas", "n3as"] },
    { name: "Group 10 (-uj)", words: ["mouj", "khrouj", "drouj", "zouj"] },
    { name: "Group 11 (-if)", words: ["sif", "rif", "dif", "xfif"] },
    { name: "Group 12 (-ab)", words: ["bab", "shbab", "7bab", "ktab"] },
    { name: "Group 13 (-u9)", words: ["sou9", "dhou9", "fou9", "3rou9"] },
    { name: "Group 14 (-it)", words: ["bit", "khit", "zit", "chrit"] },
    { name: "Group 15 (-9a)", words: ["zen9a", "wer9a", "fer9a", "zer9a"] },
    { name: "Group 16 (-ra)", words: ["mra", "chra", "kra", "bra"] },
    { name: "Group 17 (-a7)", words: ["sba7", "nba7", "rba7", "sla7"] },
    { name: "Group 18 (-id)", words: ["3id", "b3id", "jdid", "7did"] },
    { name: "Group 19 (-ur)", words: ["nour", "sour", "stour", "ghrour"] },
    { name: "Group 20 (-ma)", words: ["sma", "3ma", "dma"] },
    { name: "Group 21 (-lu)", words: ["walou", "galou", "zalou"] },
    { name: "Group 22 (-elb)", words: ["9elb", "kelb"] },
    { name: "Group 23 (-i9)", words: ["tri9", "sdi9", "Dyi9", "fri9"] },
    { name: "Group 24 (-uf)", words: ["shouf", "khouf", "syouf"] },
    { name: "Group 25 (-out)", words: ["mout", "sout", "7out"] },
    { name: "Group 26 (-an)", words: ["zman", "mkan", "dokan"] },
    { name: "Group 27 (-al)", words: ["7al", "mal", "ghzal"] },
    { name: "Group 28 (-im)", words: ["ghim", "dim", "9dim"] },
    { name: "Group 29 (-a9)", words: ["wra9", "fra9", "sla9"] },
    { name: "Group 30 (-ax)", words: ["frax", "srax", "drax"] },
    { name: "Group 31 (-ir)", words: ["kbir", "sghir", "Tir"] },
    { name: "Group 32 (-ous)", words: ["flous", "kabous", "droos"] },
  ];

  rhymeGroups.forEach(({ name, words }) => {
    it(`correctly rhymes all pairs in ${name}`, () => {
      const analyses = words.map((w) => analyzeWord(w));
      const first = analyses[0];

      for (let i = 1; i < analyses.length; i++) {
        const result = compareRhyme(first, analyses[i]);
        expect(
          result.matches,
          `Expected '${words[0]}' (key: ${first.rhymeKey}) and '${words[i]}' (key: ${analyses[i].rhymeKey}) to rhyme in ${name}`
        ).toBe(true);
      }
    });
  });

  it("distinguishes non-rhyming words", () => {
    const wordA = analyzeWord("dar");
    const wordB = analyzeWord("zen9a");
    const result = compareRhyme(wordA, wordB);
    expect(result.matches).toBe(false);
  });
});
