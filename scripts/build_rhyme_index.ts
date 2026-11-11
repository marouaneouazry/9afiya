/**
 * build_rhyme_index.ts
 * Ingests DODa CSVs, extracts Darija terms, applies phonetic normalization,
 * computes rhyme keys, and generates compact static JSON files for 9afiya.
 */

import fs from "fs";
import path from "path";
import { analyzeWord } from "../src/lib/rhyme/rhymeKey";
import { RhymeWord } from "../src/types/game";

const RAW_DIR = path.join(process.cwd(), "data", "raw");
const OUTPUT_DIR = path.join(process.cwd(), "public", "data");

const SENSITIVE_WORDS = new Set([
  "9ehba",
  "zamel",
  "hmar",
  "klb",
  "nik",
  "tezz",
  "zeb",
]);

function parseCSVLine(line: string): string[] {
  const parts: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      parts.push(current.trim());
      current = "";
    } else {
      current += c;
    }
  }
  parts.push(current.trim());
  return parts;
}

function processCSVFile(
  filePath: string,
  themeName?: string
): RhymeWord[] {
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] File not found: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const header = parseCSVLine(lines[0]);
  const arIdx = header.indexOf("darija_ar");
  const engIdx = header.indexOf("eng");

  // Collect Latin variant column indices (n1, n2, n3...)
  const latnIndices: number[] = [];
  for (let i = 0; i < header.length; i++) {
    if (/^n\d+$/.test(header[i])) {
      latnIndices.push(i);
    }
  }

  const words: RhymeWord[] = [];
  const seen = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const ar = arIdx !== -1 ? cols[arIdx] || "" : "";
    const eng = engIdx !== -1 ? cols[engIdx] || "" : "";

    // Pick primary Latin spelling
    let latn = "";
    for (const idx of latnIndices) {
      if (cols[idx] && cols[idx].trim().length > 0) {
        latn = cols[idx].trim();
        break;
      }
    }

    if (!latn && !ar) continue;
    if (!latn) latn = ar;

    // Deduplicate
    const keyStr = (latn + "|" + ar).toLowerCase();
    if (seen.has(keyStr)) continue;
    seen.add(keyStr);

    const analysis = analyzeWord(latn || ar);
    if (!analysis.rhymeKey) continue;

    const isSensitive = SENSITIVE_WORDS.has(analysis.normalized);
    // Baseline frequency score based on entry position and length
    const frequency = Math.max(50, Math.min(99, 100 - analysis.syllableCount * 10));

    words.push({
      ar: ar || latn,
      latn: latn || ar,
      eng: eng || "—",
      syllables: analysis.syllableCount,
      frequency,
      sensitive: isSensitive,
      rhymeKey: analysis.rhymeKey,
      theme: themeName,
    });
  }

  return words;
}

export function buildIndex(): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allWords: RhymeWord[] = [];

  // Syntactic categories
  allWords.push(...processCSVFile(path.join(RAW_DIR, "nouns.csv")));
  allWords.push(...processCSVFile(path.join(RAW_DIR, "verbs.csv")));
  allWords.push(...processCSVFile(path.join(RAW_DIR, "adjectives.csv")));

  // Semantic categories (Topic Cypher themes)
  const themesMap: Record<string, RhymeWord[]> = {};
  const semanticFiles: Record<string, string> = {
    food: "food.csv",
    clothes: "clothes.csv",
    animals: "animals.csv",
    body: "humanbody.csv",
    emotions: "emotions.csv",
  };

  for (const [theme, filename] of Object.entries(semanticFiles)) {
    const themeWords = processCSVFile(path.join(RAW_DIR, filename), theme);
    themesMap[theme] = themeWords;
    allWords.push(...themeWords);
  }

  // Curated loanwords
  const loanwordsPath = path.join(RAW_DIR, "curated_loanwords.json");
  if (fs.existsSync(loanwordsPath)) {
    const loans = JSON.parse(fs.readFileSync(loanwordsPath, "utf-8")) as RhymeWord[];
    allWords.push(...loans);
  }

  // Deduplicate by normalized text
  const uniqueWords: RhymeWord[] = [];
  const seenSet = new Set<string>();
  for (const w of allWords) {
    const id = `${w.latn.toLowerCase()}-${w.ar}`;
    if (!seenSet.has(id)) {
      seenSet.add(id);
      uniqueWords.push(w);
    }
  }

  // Group by rhymeKey
  const rhymeGroups: Record<string, RhymeWord[]> = {};
  for (const w of uniqueWords) {
    if (!rhymeGroups[w.rhymeKey]) {
      rhymeGroups[w.rhymeKey] = [];
    }
    rhymeGroups[w.rhymeKey].push(w);
  }

  // Filter to rhyme keys with at least 2 words
  const validGroups: Record<string, RhymeWord[]> = {};
  for (const [key, list] of Object.entries(rhymeGroups)) {
    if (list.length >= 2) {
      // Sort words within group by frequency descending
      validGroups[key] = list.sort((a, b) => b.frequency - a.frequency);
    }
  }

  // Write outputs
  const masterIndexPath = path.join(OUTPUT_DIR, "rhyme_index.json");
  fs.writeFileSync(masterIndexPath, JSON.stringify(validGroups, null, 2), "utf-8");

  const themesPath = path.join(OUTPUT_DIR, "themes.json");
  fs.writeFileSync(themesPath, JSON.stringify(themesMap, null, 2), "utf-8");

  console.log(`[SUCCESS] Generated rhyme index:`);
  console.log(` - Total unique words: ${uniqueWords.length}`);
  console.log(` - Valid rhyme groups (>= 2 words): ${Object.keys(validGroups).length}`);
  console.log(` - Saved to: ${masterIndexPath}`);
  console.log(` - Themes saved to: ${themesPath}`);
}

if (require.main === module || process.argv[1]?.includes("build_rhyme_index")) {
  buildIndex();
}
