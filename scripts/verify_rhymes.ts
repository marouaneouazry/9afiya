import assert from "assert";
import fs from "fs";
import path from "path";
import { analyzeWord, compareRhyme } from "../src/lib/rhyme/rhymeKey";
import { RhymeWord } from "../src/types/game";

const indexPath = path.join(process.cwd(), "public", "data", "rhyme_index.json");
const themesPath = path.join(process.cwd(), "public", "data", "themes.json");
const samplePath = path.join(process.cwd(), "docs", "sample_rhyme_index.json");

console.log("==> Running strict validation on 9afiya rhyme data...");

// 1. Assert file presence
assert(fs.existsSync(indexPath), "public/data/rhyme_index.json must exist!");
assert(fs.existsSync(themesPath), "public/data/themes.json must exist!");
assert(fs.existsSync(samplePath), "docs/sample_rhyme_index.json must exist!");

const groups = JSON.parse(fs.readFileSync(indexPath, "utf-8")) as Record<string, RhymeWord[]>;
const themes = JSON.parse(fs.readFileSync(themesPath, "utf-8")) as Record<string, RhymeWord[]>;
const sample = JSON.parse(fs.readFileSync(samplePath, "utf-8")) as Array<{
  rhymeKey: string;
  words: RhymeWord[];
}>;

const groupKeys = Object.keys(groups);
console.log(`Auditing ${groupKeys.length} rhyme keys and ${sample.length} sample groups...`);

// 2. Assert minimum valid rhyme group threshold
assert(groupKeys.length >= 50, `Expected at least 50 rhyme groups, found ${groupKeys.length}`);

// 3. Assert essential canonical Moroccan rhyme groups exist with >= 5 words
const essentialKeys = ["ar", "am", "ad", "wa", "la", "il", "as", "at", "an"];
for (const key of essentialKeys) {
  assert(
    groups[key] && groups[key].length >= 5,
    `Essential rhyme key '-${key}' must exist with >= 5 words! (found: ${groups[key]?.length || 0})`
  );
}

// 4. Assert all words in all groups are clean single words and match their rhyme key
let totalWordsChecked = 0;

for (const [key, wordList] of Object.entries(groups)) {
  assert(
    wordList.length >= 2,
    `Rhyme key '-${key}' must contain at least 2 words (found ${wordList.length})`
  );

  for (const word of wordList) {
    totalWordsChecked++;

    // Strict single word check: no whitespace, hyphens, slashes, or brackets
    assert(
      !/\s/.test(word.latn),
      `Multi-word entry detected in latn: '${word.latn}' (group: -${key})`
    );
    assert(
      !/\s/.test(word.ar),
      `Multi-word entry detected in ar: '${word.ar}' (group: -${key})`
    );
    assert(
      !/[\/\(\)\[\]\.\,]/.test(word.latn),
      `Punctuation/annotation detected in latn: '${word.latn}'`
    );
    assert(
      !/[\/\(\)\[\]\.\,]/.test(word.ar),
      `Punctuation/annotation detected in ar: '${word.ar}'`
    );

    // Required fields check
    assert(word.latn.length >= 2, `Word latn too short: '${word.latn}'`);
    assert(word.ar.length >= 2, `Word ar too short: '${word.ar}'`);
    assert(word.eng.length > 0, `Word eng gloss missing for: '${word.latn}'`);
    assert(word.syllables >= 1, `Invalid syllables for: '${word.latn}'`);
    assert(typeof word.sensitive === "boolean", `Sensitive flag missing for: '${word.latn}'`);

    // Phonetic rhyme match check
    const analysis = analyzeWord(word.latn || word.ar);
    assert(
      analysis.rhymeKey === key,
      `Word '${word.latn}' (computed: -${analysis.rhymeKey}) does not match group '-${key}'`
    );
  }
}

// 5. Assert theme lists have valid single words
const themeNames = Object.keys(themes);
assert(themeNames.length >= 4, `Expected at least 4 themes, found ${themeNames.length}`);
for (const [theme, list] of Object.entries(themes)) {
  assert(list.length >= 5, `Theme '${theme}' must have at least 5 words`);
  for (const item of list) {
    assert(!/\s/.test(item.latn), `Theme word has spaces: '${item.latn}' in theme '${theme}'`);
  }
}

// 6. Assert regenerated sample in docs/sample_rhyme_index.json matches real index
assert(sample.length === 10, `docs/sample_rhyme_index.json must contain exactly 10 groups`);
for (const sampleGroup of sample) {
  assert(
    groups[sampleGroup.rhymeKey],
    `Sample group '-${sampleGroup.rhymeKey}' must exist in master index!`
  );
  assert(
    sampleGroup.words.length >= 2,
    `Sample group '-${sampleGroup.rhymeKey}' must have >= 2 words`
  );
  for (const sw of sampleGroup.words) {
    const matchedInMaster = groups[sampleGroup.rhymeKey].some(
      (mw) => mw.latn === sw.latn && mw.ar === sw.ar
    );
    assert(
      matchedInMaster,
      `Word '${sw.latn}' from docs/sample_rhyme_index.json not found in master index group '-${sampleGroup.rhymeKey}'`
    );
  }
}

console.log(`[PASS] All strict data assertions passed!`);
console.log(` - Validated ${groupKeys.length} rhyme groups`);
console.log(` - Validated ${totalWordsChecked} single-word entries with 0 multi-word leaks`);
console.log(` - Validated ${themeNames.length} topic cypher themes`);
console.log(` - Validated docs/sample_rhyme_index.json matches real master index`);
