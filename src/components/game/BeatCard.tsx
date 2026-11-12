"use client";

import React from "react";
import { BeatDefinition } from "@/types/audio";
import { useTranslation, UILanguage } from "@/lib/i18n";

interface BeatCardProps {
  beat?: BeatDefinition;
  isRandom?: boolean;
  isSelected: boolean;
  isPlayingPreview: boolean;
  previewProgress: number; // 0 to 1
  onSelect: () => void;
  onTogglePreview?: () => void;
  lang: UILanguage;
}

export const BeatCard: React.FC<BeatCardProps> = ({
  beat,
  isRandom = false,
  isSelected,
  isPlayingPreview,
  previewProgress,
  onSelect,
  onTogglePreview,
  lang,
}) => {
  const { t } = useTranslation();

  const beatName = isRandom
    ? t("beats.random")
    : beat?.name[lang] || beat?.name["en"] || "Beat";

  const moodWord = beat
    ? t(`mood.${beat.moodKey}` as any) || beat.mood[0]
    : "🎲";

  const subtitle = isRandom
    ? t("mood.bouncy")
    : `${beat?.bpm} BPM • ${moodWord}`;

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      data-testid={`beat-card-${isRandom ? "random" : beat?.id}`}
      data-playing={isPlayingPreview ? "true" : "false"}
      className={`relative min-w-[150px] w-[150px] min-[900px]:w-full h-[96px] min-h-[96px] snap-start rounded-xl p-3 flex flex-col justify-between cursor-pointer select-none transition-all duration-150 overflow-hidden ${
        isSelected
          ? "border-2 border-primary bg-primary/5 shadow-xs"
          : "border border-border bg-surface hover:bg-border/20"
      }`}
    >
      {/* Top row: Name & Selection checkmark */}
      <div className="flex items-start justify-between gap-1">
        <span className="text-base font-bold text-foreground truncate leading-tight">
          {beatName}
        </span>
        {isSelected && (
          <span
            aria-hidden="true"
            className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black shrink-0"
          >
            ✓
          </span>
        )}
      </div>

      {/* Bottom row: Subtitle & Preview Button */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs sm:text-sm text-muted truncate">
          {subtitle}
        </span>

        {/* 48px Touch-target Round Preview button */}
        {onTogglePreview && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePreview();
            }}
            aria-label={
              isPlayingPreview
                ? t("beats.stop")
                : `${t("beats.preview")} ${beatName}`
            }
            aria-pressed={isPlayingPreview}
            data-testid={`preview-btn-${isRandom ? "random" : beat?.id}`}
            className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-full border border-border flex items-center justify-center transition-colors shadow-2xs ${
              isPlayingPreview
                ? "bg-primary text-white border-primary"
                : "bg-surface text-foreground hover:bg-border/30"
            }`}
          >
            {isPlayingPreview ? (
              // Pause icon
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              // Play icon
              <svg
                className="w-4 h-4 fill-current translate-x-0.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Thin audio preview progress bar */}
      {isPlayingPreview && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-border/40 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="h-full bg-primary transition-all duration-75"
            style={{ width: `${Math.round(previewProgress * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};
