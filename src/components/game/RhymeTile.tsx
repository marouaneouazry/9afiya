import React from "react";
import { RhymeWord } from "@/types/game";
import { useSettingsStore } from "@/store/useSettingsStore";

interface RhymeTileProps {
  word: RhymeWord | null;
  status: "active" | "next" | "locked";
  barIndex: number;
  pattern: "A" | "B";
  revealed?: boolean;
}

export const RhymeTile: React.FC<RhymeTileProps> = ({
  word,
  status,
  barIndex,
  pattern,
  revealed = true,
}) => {
  const { script } = useSettingsStore();

  const isPatternA = pattern === "A";
  const borderTone = isPatternA
    ? "border-majorelle shadow-majorelle/20"
    : "border-terracotta shadow-terracotta/20";

  const badgeBg = isPatternA
    ? "bg-majorelle text-white"
    : "bg-terracotta text-white";

  if (!word || !revealed) {
    return (
      <div
        className={`w-full max-w-sm h-40 rounded-2xl border-2 border-dashed border-zinc-700 bg-surface/50 flex flex-col items-center justify-center p-6 text-zinc-500 transition-all`}
      >
        <div className="text-xs uppercase font-bold tracking-wider mb-2">
          Bar {barIndex} • Pattern {pattern}
        </div>
        <div className="text-sm italic">
          {revealed ? "Loading word..." : "??? (Hidden until drop)"}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-sm rounded-2xl border-2 ${borderTone} bg-surface p-6 shadow-xl flex flex-col justify-between relative overflow-hidden transition-all duration-200 ${
        status === "active" ? "scale-105 ring-2 ring-saffron" : "opacity-90"
      }`}
    >
      {/* Decorative Zellige Corner */}
      <div
        className={`absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none`}
      >
        <div
          className={`w-16 h-16 transform rotate-45 -translate-y-8 translate-x-8 opacity-20 ${
            isPatternA ? "bg-majorelle" : "bg-terracotta"
          }`}
        />
      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider ${badgeBg}`}
        >
          Bar {barIndex} • Sound {pattern} (-{word.rhymeKey})
        </span>

        {word.theme && (
          <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
            {word.theme}
          </span>
        )}
      </div>

      {/* Rhyme Words Display */}
      <div className="flex flex-col items-center justify-center py-2 text-center">
        {/* Arabic Script */}
        {(script === "arabic" || script === "both") && (
          <div className="text-3xl sm:text-4xl font-black text-foreground font-arabic leading-relaxed">
            {word.ar}
          </div>
        )}

        {/* Arabizi / Latin Script */}
        {(script === "arabizi" || script === "both") && (
          <div
            className={`text-xl sm:text-2xl font-bold tracking-wide mt-1 ${
              script === "both" ? "text-saffron" : "text-foreground"
            }`}
          >
            {word.latn}
          </div>
        )}

        {/* English Gloss */}
        <div className="text-xs sm:text-sm text-zinc-400 mt-2 font-medium">
          &ldquo;{word.eng}&rdquo;
        </div>
      </div>

      {/* Beat 4 Punchline Target Indicator */}
      <div className="mt-4 pt-3 border-t border-borderMuted flex items-center justify-between text-[11px] text-zinc-400">
        <span>Syllables: {word.syllables}</span>
        <span className="font-semibold text-saffron">
          Land on Beat 4 🎯
        </span>
      </div>
    </div>
  );
};
