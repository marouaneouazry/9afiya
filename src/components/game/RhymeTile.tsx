"use client";

import React from "react";
import { RhymeWord } from "@/types/game";
import { useSettingsStore } from "@/store/useSettingsStore";

interface RhymeTileProps {
  word: RhymeWord | null;
  revealed?: boolean;
  isBeat4?: boolean;
}

export const RhymeTile: React.FC<RhymeTileProps> = ({
  word,
  revealed = true,
  isBeat4 = false,
}) => {
  const { script } = useSettingsStore();

  if (!word || !revealed) {
    return (
      <div className="w-full max-w-lg min-h-[200px] sm:min-h-[240px] rounded-2xl border-2 border-border bg-surface flex flex-col items-center justify-center p-6 text-muted">
        <span className="text-4xl font-bold font-arabic opacity-40">؟</span>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-lg rounded-2xl border-2 border-accent bg-accent-surface/40 p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-sm transition-transform duration-200 ${
        isBeat4 ? "animate-tile-lock" : ""
      }`}
    >
      {/* Arabic Script Word (88px phone, 120px desktop) */}
      {(script === "arabic" || script === "both") && (
        <div className="text-[88px] min-[900px]:text-[120px] font-black text-foreground font-arabic leading-none my-2 select-none">
          {word.ar}
        </div>
      )}

      {/* Latin / Arabizi Spelling */}
      {(script === "arabizi" || script === "both") && (
        <div
          className={`font-bold select-none ${
            script === "arabizi"
              ? "text-[64px] min-[900px]:text-[96px] text-foreground leading-none my-2"
              : "text-2xl min-[900px]:text-3xl text-accent mt-2 font-mono"
          }`}
        >
          {word.latn}
        </div>
      )}

      {/* English Meaning */}
      {word.eng && (
        <div className="text-base min-[900px]:text-lg text-muted mt-2 font-medium">
          &ldquo;{word.eng}&rdquo;
        </div>
      )}
    </div>
  );
};
