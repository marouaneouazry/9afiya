/**
 * 9afiya Site Configuration
 * Central configuration file for the product title, branding, and metadata.
 * Rename here to update the name across the entire application.
 */
export const siteConfig = {
  name: "9afiya",
  arabicName: "قافية",
  tagline: "Freestyle Rap Training in Moroccan Darija",
  arabicTagline: "تدريب على الفريستايل بالدارجة المغربية",
  description:
    "Master your rhyme flow and punchlines in Darija. Timed rhyme tiles on the beat, AABB bars, and authentic Moroccan hip-hop rhythms.",
  url: "https://9afiya.vercel.app",
  repository: "https://github.com/marouaneouazry/9afiya",
  author: {
    name: "Marouane Ouazry",
    url: "https://github.com/marouaneouazry",
  },
  defaultBpm: 88,
  minBpm: 60,
  maxBpm: 125,
  defaultSessionBars: 16,
  supportedLanguages: ["ary-Arab", "ary-Latn", "en", "fr"] as const,
  defaultScript: "both" as "arabic" | "arabizi" | "both",
};

export type SiteConfig = typeof siteConfig;
