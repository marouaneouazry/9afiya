import { create } from "zustand";

/**
 * Supported UI languages.
 * - ary-Arab: Darija in Arabic script (default, RTL)
 * - ary-Latn: Darija in Latin/Arabizi script (LTR)
 * - fr: French (LTR)
 * - en: English (LTR)
 */
export type UILanguage = "ary-Arab" | "ary-Latn" | "fr" | "en";

interface LanguageState {
  lang: UILanguage;
  setLang: (lang: UILanguage) => void;
}

const STORAGE_KEY = "9afiya_ui_lang";

function loadSavedLang(): UILanguage {
  if (typeof window === "undefined") return "ary-Arab";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (
      saved === "ary-Arab" ||
      saved === "ary-Latn" ||
      saved === "fr" ||
      saved === "en"
    ) {
      return saved;
    }
  } catch {
    // Ignore errors in private/sandboxed mode
  }
  return "ary-Arab";
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: loadSavedLang(),
  setLang: (lang) => {
    set({ lang });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Fail silently
      }
    }
  },
}));

/** Returns "rtl" for Arabic-script Darija, "ltr" for everything else. */
export function dirForLang(lang: UILanguage): "rtl" | "ltr" {
  return lang === "ary-Arab" ? "rtl" : "ltr";
}

/** Returns the BCP-47 lang tag for the HTML element. */
export function htmlLangForLang(lang: UILanguage): string {
  switch (lang) {
    case "ary-Arab":
    case "ary-Latn":
      return "ary";
    case "fr":
      return "fr";
    case "en":
      return "en";
  }
}
