import React from "react";

interface BeatVisualizerProps {
  currentBar: number;
  totalBars: number;
  currentBeat: number; // 1, 2, 3, 4
  bpm: number;
  soundKey: string;
}

export const BeatVisualizer: React.FC<BeatVisualizerProps> = ({
  currentBar,
  totalBars,
  currentBeat,
  bpm,
  soundKey,
}) => {
  return (
    <div
      className="w-full max-w-md bg-surface border border-borderMuted rounded-2xl p-4 shadow-sm flex flex-col gap-3"
      role="region"
      aria-label="Rhythm and beat visualizer"
    >
      {/* Top Metadata */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-black text-sm">
            Bar {currentBar}
          </span>
          <span>/ {totalBars === Infinity ? "∞" : totalBars}</span>
        </div>

        <div className="flex items-center gap-2">
          {soundKey && (
            <span className="px-2 py-0.5 rounded bg-majorelle/15 text-majorelle font-mono text-[11px]">
              Key: -{soundKey}
            </span>
          )}
          <span className="font-mono text-zinc-400">{bpm} BPM</span>
        </div>
      </div>

      {/* 4-Beat Visual Bar for Accessibility & Timing */}
      <div
        className="grid grid-cols-4 gap-2.5 h-12"
        role="progressbar"
        aria-valuenow={currentBeat}
        aria-valuemin={1}
        aria-valuemax={4}
        aria-label={`Beat ${currentBeat} of 4`}
      >
        {[1, 2, 3, 4].map((b) => {
          const isActive = currentBeat === b;
          const isBeat4 = b === 4;

          let colorClass = "bg-zinc-800 border-zinc-700 text-zinc-500";
          if (isActive) {
            if (isBeat4) {
              // Punchline Beat
              colorClass =
                "bg-terracotta border-terracotta text-white shadow-lg shadow-terracotta/40 scale-105 animate-pulse-beat";
            } else {
              colorClass =
                "bg-majorelle border-majorelle text-white shadow-md shadow-majorelle/30 scale-102";
            }
          }

          return (
            <div
              key={b}
              className={`rounded-xl border flex flex-col items-center justify-center font-black transition-all duration-100 ${colorClass}`}
            >
              <span className="text-sm">{b}</span>
              <span className="text-[9px] uppercase tracking-tighter opacity-80">
                {isBeat4 ? "Punchline" : b === 1 ? "Start" : "Flow"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
