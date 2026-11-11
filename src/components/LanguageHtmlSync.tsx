"use client";

import { useEffect } from "react";
import { useLanguageStore, dirForLang, htmlLangForLang } from "@/lib/i18n";

export function LanguageHtmlSync() {
  const lang = useLanguageStore((s) => s.lang);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = htmlLangForLang(lang);
      document.documentElement.dir = dirForLang(lang);
    }
  }, [lang]);

  return null;
}
