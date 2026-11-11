/**
 * build_rhyme_index.ts
 * Ingests DODa CSVs, extracts clean single-word Darija terms, applies phonetic
 * normalization, computes rhyme keys, and generates compact static JSON files for 9afiya.
 */

import fs from "fs";
import path from "path";
import { analyzeWord } from "../src/lib/rhyme/rhymeKey";
import { RhymeWord } from "../src/types/game";

const RAW_DIR = path.join(process.cwd(), "data", "raw");
const OUTPUT_DIR = path.join(process.cwd(), "public", "data");
const DOCS_DIR = path.join(process.cwd(), "docs");

// Expanded sensitive words and profanity in Arabizi, Latin, and Arabic script
const SENSITIVE_WORDS = new Set([
  "9ehba",
  "qehba",
  "9ahba",
  "qahba",
  "kahba",
  "97ba",
  "قهبة",
  "قحبة",
  "zamel",
  "zammel",
  "zaml",
  "zmel",
  "زامل",
  "زمل",
  "nik",
  "nek",
  "nayk",
  "nique",
  "نيك",
  "tezz",
  "tiz",
  "tterm",
  "term",
  "terma",
  "ترمة",
  "طيز",
  "zeb",
  "zabb",
  "zbi",
  "zebi",
  "zob",
  "زبي",
  "زب",
  "hmar",
  "7mar",
  "lahmar",
  "la7mar",
  "حمار",
  "klb",
  "kelb",
  "lkelb",
  "كلب",
  "khra",
  "xra",
  "mewkhel",
  "خرا",
  "tabon",
  "taboun",
  "tboun",
  "طابون",
  "qlawi",
  "9lawi",
  "qlaoui",
  "قلاوي",
  "7wa",
  "7way",
  "حوى",
  "حواي",
  "dayous",
  "dallal",
  "ديوث",
  "mkhannaz",
  "mxnnez",
  "مخنز",
  "khenz",
  "xenz",
  "خنز",
  "bouzbal",
  "بوزبال",
  "mankou7",
  "mnkou7",
  "منكوح",
  "khanzir",
  "xanzir",
  "خنزير",
  "shmata",
  "chmata",
  "شماتة",
  "bghal",
  "بغل",
  "fday7",
  "fdi7a",
  "فضيحة",
  "msety",
  "msetti",
  "مسطي",
  "hbil",
  "7bil",
  "هبيل",
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

function isCleanSingleWord(text: string): boolean {
  if (!text || text.length < 2) return false;
  // Disallow spaces, hyphens, slashes, brackets, parentheticals, punctuation
  if (/[\s\-\/\(\)\[\]\.\,\;\:\?\!\'\"]/.test(text)) {
    return false;
  }
  return true;
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
    const arRaw = arIdx !== -1 ? cols[arIdx] || "" : "";
    const eng = engIdx !== -1 ? cols[engIdx] || "" : "";

    // Pick primary clean Latin spelling
    let latn = "";
    for (const idx of latnIndices) {
      const candidate = (cols[idx] || "").trim();
      if (candidate.length > 0 && isCleanSingleWord(candidate)) {
        latn = candidate;
        break;
      }
    }

    const ar = arRaw.trim();

    // Exclude multi-word entries, phrases, compound expressions
    if (!isCleanSingleWord(latn) || !isCleanSingleWord(ar)) {
      continue;
    }

    // Deduplicate
    const keyStr = (latn + "|" + ar).toLowerCase();
    if (seen.has(keyStr)) continue;
    seen.add(keyStr);

    const analysis = analyzeWord(latn || ar);
    if (!analysis.rhymeKey) continue;

    // Check sensitive list across Arabizi, normalized form, and Arabic
    const isSensitive =
      SENSITIVE_WORDS.has(analysis.normalized) ||
      SENSITIVE_WORDS.has(latn.toLowerCase()) ||
      SENSITIVE_WORDS.has(ar);

    // Heuristic frequency score based on syllable count and entry richness
    const frequency = Math.max(50, Math.min(99, 100 - analysis.syllableCount * 10));

    words.push({
      ar,
      latn,
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
  fs.mkdirSync(DOCS_DIR, { recursive: true });

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
    // Filter loanwords through single-word check and normalize rhyme keys
    const cleanLoans = loans
      .filter((l) => isCleanSingleWord(l.latn) && isCleanSingleWord(l.ar))
      .map((l) => {
        const analysis = analyzeWord(l.latn || l.ar);
        return {
          ...l,
          rhymeKey: analysis.rhymeKey,
          syllables: analysis.syllableCount,
        };
      });
    allWords.push(...cleanLoans);
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

  // Sample 10 real rhyme groups to regenerate docs/sample_rhyme_index.json
  const sampleKeys = ["ar", "am", "ad", "wa", "la", "il", "as", "uj", "at", "an"];
  const sampleData = sampleKeys
    .filter((k) => validGroups[k] && validGroups[k].length >= 2)
    .map((k) => {
      const words = validGroups[k].slice(0, 5);
      const firstAnalysis = analyzeWord(words[0].latn || words[0].ar);
      return {
        rhymeKey: k,
        phoneticEnding: `-${k} (${words.slice(0, 3).map((w) => w.ar).join(" / ")})`,
        type: "perfect",
        vowelNucleus: firstAnalysis.vowelNucleus,
        coda: firstAnalysis.coda,
        words: words.map((w) => ({
          ar: w.ar,
          latn: w.latn,
          eng: w.eng,
          syllables: w.syllables,
          frequency: w.frequency,
          sensitive: w.sensitive,
        })),
      };
    });

  const samplePath = path.join(DOCS_DIR, "sample_rhyme_index.json");
  fs.writeFileSync(samplePath, JSON.stringify(sampleData, null, 2), "utf-8");

  console.log(`[SUCCESS] Generated rhyme index:`);
  console.log(` - Total unique single-word entries: ${uniqueWords.length}`);
  console.log(` - Valid rhyme groups (>= 2 words): ${Object.keys(validGroups).length}`);
  console.log(` - Master index saved to: ${masterIndexPath}`);
  console.log(` - Themes saved to: ${themesPath}`);
  console.log(` - Regenerated 10-example sample saved to: ${samplePath}`);
}

if (require.main === module || process.argv[1]?.includes("build_rhyme_index")) {
  buildIndex();
}
