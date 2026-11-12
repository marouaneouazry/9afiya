"use client";

import React, { useEffect, useState } from "react";
import { BEAT_DEFINITIONS, getRandomBeat } from "@/lib/audio/beatDefinitions";
import { previewManager } from "@/lib/audio/previewManager";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTranslation } from "@/lib/i18n";
import { BeatCard } from "./BeatCard";

interface BeatPickerProps {
  onSelectBeat?: (beatId: string) => void;
}

export const BeatPicker: React.FC<BeatPickerProps> = ({ onSelectBeat }) => {
  const { t, lang } = useTranslation();
  const { selectedBeatId, setSelectedBeatId } = useSettingsStore();

  const [previewState, setPreviewState] = useState<{
    playingBeatId: string | null;
    progress: number;
  }>({
    playingBeatId: null,
    progress: 0,
  });

  useEffect(() => {
    const unsub = previewManager.subscribe((st) => {
      setPreviewState(st);
    });
    return () => {
      unsub();
      previewManager.stop();
    };
  }, []);

  const handleSelect = (id: string) => {
    setSelectedBeatId(id);
    onSelectBeat?.(id);
  };

  const handleTogglePreview = (id: string) => {
    if (id === "random") {
      const randomBeat = getRandomBeat();
      previewManager.togglePreview(randomBeat);
    } else {
      previewManager.togglePreview(id);
    }
  };

  return (
    <section
      aria-label={t("beats.title")}
      className="w-full flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-foreground">
          {t("beats.title")}
        </h3>
      </div>

      {/* Responsive Container: Horizontally scrollable snap row on mobile, grid on desktop */}
      <div
        role="radiogroup"
        aria-label={t("beats.title")}
        className="flex min-[900px]:grid min-[900px]:grid-cols-3 min-[1100px]:grid-cols-4 gap-3 overflow-x-auto snap-x snap-mandatory pb-2 min-[900px]:pb-0 w-full"
      >
        {/* 1. First card: "Surprise me" (Random) */}
        <BeatCard
          isRandom={true}
          isSelected={selectedBeatId === "random"}
          isPlayingPreview={previewState.playingBeatId === "random"}
          previewProgress={previewState.progress}
          onSelect={() => handleSelect("random")}
          onTogglePreview={() => handleTogglePreview("random")}
          lang={lang}
        />

        {/* 2. Procedural Beat Cards (10 distinct styles) */}
        {BEAT_DEFINITIONS.map((beat) => (
          <BeatCard
            key={beat.id}
            beat={beat}
            isSelected={selectedBeatId === beat.id}
            isPlayingPreview={previewState.playingBeatId === beat.id}
            previewProgress={previewState.progress}
            onSelect={() => handleSelect(beat.id)}
            onTogglePreview={() => handleTogglePreview(beat.id)}
            lang={lang}
          />
        ))}
      </div>
    </section>
  );
};
