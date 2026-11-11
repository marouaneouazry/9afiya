"use client";

import React, { useRef, useState } from "react";
import { BeatStyle } from "@/lib/audio/BeatScheduler";
import { DifficultyLevel } from "@/types/game";
import { useSettingsStore, ScriptDisplayMode } from "@/store/useSettingsStore";
import { useTranslation } from "@/lib/i18n";

interface SettingsContentProps {
  onBpmChange?: (bpm: number) => void;
  onBeatStyleChange?: (style: BeatStyle) => void;
  onLevelChange?: (level: DifficultyLevel) => void;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({
  onBpmChange,
  onBeatStyleChange,
  onLevelChange,
}) => {
  const { t } = useTranslation();
  const { script, beatStyle, bpm, level, setScript, setBeatStyle, setBpm, setLevel } =
    useSettingsStore();

  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const tapTimeoutRef = useRef<number | null>(null);

  const handleTapTempo = () => {
    const now = performance.now();
    const newTaps = [...tapTimes, now].filter((t) => now - t < 3000).slice(-4);
    setTapTimes(newTaps);

    if (newTaps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgMs);
      const clamped = Math.max(60, Math.min(125, calculatedBpm));
      setBpm(clamped);
      onBpmChange?.(clamped);
    }

    if (tapTimeoutRef.current) window.clearTimeout(tapTimeoutRef.current);
    tapTimeoutRef.current = window.setTimeout(() => setTapTimes([]), 2500);
  };

  const updateBpm = (newBpm: number) => {
    setBpm(newBpm);
    onBpmChange?.(newBpm);
  };

  const updateBeatStyle = (style: BeatStyle, defaultBpm: number) => {
    setBeatStyle(style);
    onBeatStyleChange?.(style);
    updateBpm(defaultBpm);
  };

  const updateLevel = (newLevel: DifficultyLevel) => {
    setLevel(newLevel);
    onLevelChange?.(newLevel);
  };

  return (
    <div className="flex flex-col gap-6 text-foreground">
      {/* 1. Beat Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-muted">
          {t("settings.beat")}
        </label>
        <div
          role="group"
          aria-label={t("settings.beat")}
          className="grid grid-cols-3 gap-2"
        >
          {(
            [
              { id: "boombap", label: "Boom Bap", defaultBpm: 88 },
              { id: "chaabi", label: "Chaabi", defaultBpm: 102 },
              { id: "lofi", label: "Lofi", defaultBpm: 80 },
            ] as const
          ).map((item) => {
            const isSelected = beatStyle === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateBeatStyle(item.id, item.defaultBpm)}
                aria-pressed={isSelected}
                className={`min-h-[48px] px-3 py-2 rounded-xl text-sm font-bold border transition-colors flex items-center justify-center text-center ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-surface border-border text-foreground hover:bg-border/30"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Tempo (Slider + Tap button) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm font-bold">
          <span className="text-muted">{t("settings.tempo")}</span>
          <span className="font-mono text-primary text-base">{bpm} BPM</span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min={60}
            max={125}
            value={bpm}
            onChange={(e) => updateBpm(Number(e.target.value))}
            aria-label={t("settings.tempo")}
            className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          />

          <button
            type="button"
            onClick={handleTapTempo}
            title={t("settings.tap")}
            className="min-h-[48px] min-w-[64px] px-3 py-2 rounded-xl border border-border bg-surface text-foreground font-bold text-sm hover:bg-border/30 active:scale-95 transition-all flex items-center justify-center"
          >
            {t("settings.tap")}
          </button>
        </div>
      </div>

      {/* 3. Help Level */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-muted">
          {t("settings.help")}
        </label>
        <div
          role="group"
          aria-label={t("settings.help")}
          className="grid grid-cols-3 gap-2"
        >
          {(
            [
              { id: "all_shown", label: t("settings.help.all") },
              { id: "first_of_pair", label: t("settings.help.first") },
              { id: "last_bar_only", label: t("settings.help.last") },
            ] as const
          ).map((item) => {
            const isSelected = level === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateLevel(item.id)}
                aria-pressed={isSelected}
                className={`min-h-[48px] px-2 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors flex items-center justify-center text-center ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-surface border-border text-foreground hover:bg-border/30"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Script */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-muted">
          {t("settings.script")}
        </label>
        <div
          role="group"
          aria-label={t("settings.script")}
          className="grid grid-cols-3 gap-2"
        >
          {(
            [
              { id: "arabic", label: t("settings.script.ar") },
              { id: "arabizi", label: t("settings.script.lat") },
              { id: "both", label: t("settings.script.both") },
            ] as const
          ).map((item) => {
            const isSelected = script === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setScript(item.id as ScriptDisplayMode)}
                aria-pressed={isSelected}
                className={`min-h-[48px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors flex items-center justify-center text-center ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-surface border-border text-foreground hover:bg-border/30"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
