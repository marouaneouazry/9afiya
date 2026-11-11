import React, { useRef, useState } from "react";
import { Play, Square, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { BeatStyle } from "@/lib/audio/BeatScheduler";
import { DifficultyLevel } from "@/types/game";
import { useSettingsStore, ScriptDisplayMode } from "@/store/useSettingsStore";

interface AudioControlsProps {
  isPlaying: boolean;
  bpm: number;
  onPlay: () => void;
  onStop: () => void;
  onBpmChange: (bpm: number) => void;
  beatStyle: BeatStyle;
  onBeatStyleChange: (style: BeatStyle) => void;
  level: DifficultyLevel;
  onLevelChange: (level: DifficultyLevel) => void;
  totalBars: number;
  onTotalBarsChange: (bars: number) => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  bpm,
  onPlay,
  onStop,
  onBpmChange,
  beatStyle,
  onBeatStyleChange,
  level,
  onLevelChange,
  totalBars,
  onTotalBarsChange,
}) => {
  const { script, setScript } = useSettingsStore();
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
      onBpmChange(clamped);
    }

    if (tapTimeoutRef.current) window.clearTimeout(tapTimeoutRef.current);
    tapTimeoutRef.current = window.setTimeout(() => setTapTimes([]), 2500);
  };

  return (
    <div className="w-full max-w-md bg-surface border border-borderMuted rounded-2xl p-5 shadow-sm flex flex-col gap-5">
      {/* Play / Stop Master Button */}
      <div className="flex items-center gap-3">
        {!isPlaying ? (
          <button
            onClick={onPlay}
            className="flex-1 py-4 px-6 rounded-xl bg-majorelle text-white font-black text-lg shadow-lg shadow-majorelle/30 hover:bg-majorelle-600 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>Drop Beat (بدا السايكل)</span>
          </button>
        ) : (
          <button
            onClick={onStop}
            className="flex-1 py-4 px-6 rounded-xl bg-terracotta text-white font-black text-lg shadow-lg shadow-terracotta/30 hover:bg-terracotta-600 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Square className="w-5 h-5 fill-current" />
            <span>Stop Session</span>
          </button>
        )}

        <button
          onClick={handleTapTempo}
          className="py-4 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-saffron font-bold text-xs hover:bg-zinc-700 active:scale-95 transition-all flex flex-col items-center justify-center min-w-[70px]"
          title="Tap repeatedly to set tempo"
        >
          <span className="text-[10px] uppercase tracking-wider text-zinc-400">Tap</span>
          <span className="font-mono text-sm">{bpm}</span>
        </button>
      </div>

      {/* BPM Slider */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
          <span>Tempo / Speed</span>
          <span className="text-foreground font-mono">{bpm} BPM</span>
        </div>
        <input
          type="range"
          min="60"
          max="125"
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          className="w-full accent-majorelle cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>60 (Slow Lofi)</span>
          <span>88 (Boom Bap)</span>
          <span>102 (Chaabi)</span>
          <span>125 (Fast)</span>
        </div>
      </div>

      {/* Beat Style Selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-400">Rhythm / Beat Style</label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: "boombap", label: "Boom Bap", bpm: 88 },
              { id: "chaabi", label: "Chaabi", bpm: 102 },
              { id: "lofi", label: "Derb Lofi", bpm: 80 },
            ] as const
          ).map((b) => (
            <button
              key={b.id}
              onClick={() => {
                onBeatStyleChange(b.id);
                onBpmChange(b.bpm);
              }}
              className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors ${
                beatStyle === b.id
                  ? "bg-majorelle text-white border-majorelle"
                  : "bg-surface border-borderMuted text-zinc-400 hover:text-foreground"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Session Length & Level */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-borderMuted">
        <div>
          <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
            Bars Length
          </label>
          <select
            value={totalBars}
            onChange={(e) => onTotalBarsChange(Number(e.target.value))}
            className="w-full py-1.5 px-2 rounded-lg bg-surface border border-borderMuted text-xs font-semibold text-foreground focus:outline-none focus:border-majorelle"
          >
            <option value={8}>8 Bars (Quick)</option>
            <option value={16}>16 Bars (Standard)</option>
            <option value={32}>32 Bars (Marathon)</option>
            <option value={Infinity}>Endless Cypher</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
            Difficulty Level
          </label>
          <select
            value={level}
            onChange={(e) => onLevelChange(e.target.value as DifficultyLevel)}
            className="w-full py-1.5 px-2 rounded-lg bg-surface border border-borderMuted text-xs font-semibold text-foreground focus:outline-none focus:border-majorelle"
          >
            <option value="all_shown">L1: All Shown (AABB)</option>
            <option value="first_of_pair">L2: 1st of Pair</option>
            <option value="last_bar_only">L3: Blind Drop</option>
            <option value="four_bars_same_sound">L4: 4 Bars (AAAA)</option>
          </select>
        </div>
      </div>

      {/* Script Toggle */}
      <div className="pt-2 border-t border-borderMuted flex items-center justify-between text-xs">
        <span className="text-zinc-400 font-semibold">Script Display</span>
        <div className="inline-flex rounded-lg bg-zinc-800 p-0.5 border border-zinc-700">
          {(
            [
              { id: "both", label: "Both" },
              { id: "arabic", label: "العربية" },
              { id: "arabizi", label: "Latin/3" },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => setScript(s.id as ScriptDisplayMode)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                script === s.id ? "bg-majorelle text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
