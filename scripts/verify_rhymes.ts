import fs from "fs";
import path from "path";
import { RhymeWord } from "../src/types/game";

const indexPath = path.join(process.cwd(), "public", "data", "rhyme_index.json");
if (!fs.existsSync(indexPath)) {
  console.error("Index not found! Run npm run data:build first.");
  process.exit(1);
}

const groups = JSON.parse(fs.readFileSync(indexPath, "utf-8")) as Record<string, RhymeWord[]>;

console.log(`Auditing generated rhyme index with ${Object.keys(groups).length} rhyme keys...`);

const sampleKeys = ["ar", "ayn", "am", "ad", "wa", "la", "il", "as"];
for (const key of sampleKeys) {
  if (groups[key]) {
    const words = groups[key].map((w) => `${w.latn} (${w.ar})`).slice(0, 5).join(", ");
    console.log(`[PASS] Key '-${key}': ${groups[key].length} words -> ${words}`);
  } else {
    console.warn(`[WARN] Key '-${key}' not found in index.`);
  }
}
