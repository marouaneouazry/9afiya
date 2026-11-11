"use client";

import React from "react";

interface BeatVisualizerProps {
  currentBeat?: number; // 1, 2, 3, 4 (or 0 / undefined if idle)
  isPlaying?: boolean;
}

export const BeatVisualizer: React.FC<BeatVisualizerProps> = ({
  currentBeat = 0,
  isPlaying = false,
}) => {
  return (
    <div
      dir="ltr"
      className="flex items-center justify-center gap-4 py-2"
      role="progressbar"
      aria-label={isPlaying ? `Beat ${currentBeat} of 4` : "Four beat rhythm dots"}
      aria-valuenow={isPlaying ? currentBeat : 0}
      aria-valuemin={1}
      aria-valuemax={4}
    >
      {[1, 2, 3, 4].map((b) => {
        const isActive = isPlaying && currentBeat === b;
        const isPastOrActive = isPlaying && currentBeat >= b;
        const isBeat4 = b === 4;

        let dotClasses = "w-4 h-4 rounded-full transition-colors duration-100";

        if (!isPlaying) {
          dotClasses += " bg-border";
        } else if (isBeat4) {
          if (isActive) {
            // Saffron on beat 4
            dotClasses += " bg-accent ring-4 ring-accent/30 scale-125";
          } else {
            dotClasses += " bg-border";
          }
        } else {
          if (isActive) {
            dotClasses += " bg-primary ring-4 ring-primary/20 scale-110";
          } else if (isPastOrActive) {
            dotClasses += " bg-primary/70";
          } else {
            dotClasses += " bg-border";
          }
        }

        return (
          <span
            key={b}
            className={dotClasses}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
};
