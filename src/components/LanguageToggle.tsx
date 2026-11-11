"use client";

import React from "react";
import { useLanguageStore, type UILanguage } from "@/lib/i18n";

const LANGUAGES: { id: UILanguage; label: string; title: string }[] = [
  { id: "ary-Arab", label: "عربية", title: "الدارجة بالحرف العربي" },
  { id: "ary-Latn", label: "Darija", title: "Darija b l-Latin" },
  { id: "fr", label: "FR", title: "Français" },
  { id: "en", label: "EN", title: "English" },
];

export function LanguageToggle() {
  const { lang, setLang } = useLanguageStore();

  return (
    <nav
      aria-label="Language selector"
      className="inline-flex items-center rounded-lg border border-border bg-surface p-1 text-sm font-semibold"
    >
      {LANGUAGES.map((item) => {
        const isActive = lang === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLang(item.id)}
            title={item.title}
            aria-pressed={isActive}
            className={`min-h-[38px] px-2.5 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-colors ${
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
