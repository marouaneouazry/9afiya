import aryArab from "./ary-Arab.json";
import aryLatn from "./ary-Latn.json";
import en from "./en.json";
import fr from "./fr.json";
import { useLanguageStore, type UILanguage } from "./store";

export type { UILanguage } from "./store";
export { useLanguageStore, dirForLang, htmlLangForLang } from "./store";

type StringKey = keyof typeof en;

const messages: Record<UILanguage, Record<string, string>> = {
  "ary-Arab": aryArab,
  "ary-Latn": aryLatn,
  en,
  fr,
};

/**
 * Interpolate variables like `{n}` and `{total}` into a template string.
 */
function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`,
  );
}

/**
 * Returns a translation function `t(key, vars?)` bound to the current
 * UI language. Falls back to English if the key is missing.
 *
 * Usage:
 * ```tsx
 * const { t } = useTranslation();
 * <p>{t("game.bar", { n: 3, total: 16 })}</p>
 * ```
 */
export function useTranslation() {
  const lang = useLanguageStore((s) => s.lang);
  const dict = messages[lang];
  const fallback = messages["en"];

  function t(key: StringKey, vars?: Record<string, string | number>): string {
    const raw = dict[key] ?? fallback[key] ?? key;
    return interpolate(raw, vars);
  }

  return { t, lang };
}
