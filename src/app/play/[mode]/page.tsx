"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Volume2, Info } from "lucide-react";
import { BeatScheduler, BeatStyle } from "@/lib/audio/BeatScheduler";
import { GameEngine } from "@/lib/game/GameEngine";
import { DifficultyLevel, GameMode, RhymeWord } from "@/types/game";
import { BeatVisualizer } from "@/components/game/BeatVisualizer";
import { RhymeTile } from "@/components/game/RhymeTile";
import { AudioControls } from "@/components/game/AudioControls";
import { useSettingsStore } from "@/store/useSettingsStore";
import { siteConfig } from "@/config/site";

export default function PlayModePage() {
  const params = useParams();
  const router = useRouter();
  const rawMode = (params.mode as string) || "classic";
  const mode = (
    ["classic", "topic", "code-switch", "daily", "battle", "lab"].includes(rawMode)
      ? rawMode
      : "classic"
  ) as GameMode;

  const { beatStyle, setBeatStyle } = useSettingsStore();

  const [bpm, setBpm] = useState<number>(siteConfig.defaultBpm);
  const [level, setLevel] = useState<DifficultyLevel>("all_shown");
  const [totalBars, setTotalBars] = useState<number>(siteConfig.defaultSessionBars);

  const [wordsPool, setWordsPool] = useState<RhymeWord[]>([]);
  const [isLoadingWords, setIsLoadingWords] = useState<boolean>(true);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBar, setCurrentBar] = useState<number>(1);
  const [currentBeat, setCurrentBeat] = useState<number>(1);
  const [activeWord, setActiveWord] = useState<RhymeWord | null>(null);
  const [nextWord, setNextWord] = useState<RhymeWord | null>(null);
  const [soundKey, setSoundKey] = useState<string>("");

  const schedulerRef = useRef<BeatScheduler | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // 1. Fetch precomputed static words based on game mode
  useEffect(() => {
    async function loadData() {
      setIsLoadingWords(true);
      try {
        if (mode === "topic") {
          const res = await fetch("/data/themes.json");
          const themes = await res.json();
          // Combine themes
          const combined: RhymeWord[] = [];
          for (const list of Object.values(themes)) {
            combined.push(...(list as RhymeWord[]));
          }
          setWordsPool(combined);
        } else {
          const res = await fetch("/data/rhyme_index.json");
          const groups = await res.json();
          const flattened: RhymeWord[] = [];
          for (const list of Object.values(groups)) {
            flattened.push(...(list as RhymeWord[]));
          }
          setWordsPool(flattened);
        }
      } catch (err) {
        console.error("Failed to load rhyme words:", err);
      } finally {
        setIsLoadingWords(false);
      }
    }
    loadData();
  }, [mode]);

  // 2. Initialize Game Engine and Audio Scheduler
  useEffect(() => {
    const engine = new GameEngine({
      mode,
      level,
      bpm,
      totalBars,
      wordsPool,
    });
    engineRef.current = engine;

    const unsubscribe = engine.subscribe((st) => {
      setIsPlaying(st.isPlaying);
      setCurrentBar(st.currentBar);
      setCurrentBeat(st.currentBeat);
      setActiveWord(st.activeWord);
      setNextWord(st.nextWord);
      setSoundKey(st.currentSoundKey);
    });

    return () => {
      unsubscribe();
      if (schedulerRef.current) {
        schedulerRef.current.stop();
      }
    };
  }, [mode, level, bpm, totalBars, wordsPool]);

  // 3. Connect BeatScheduler hardware audio clock to GameEngine
  const handleStartSession = () => {
    if (!schedulerRef.current) {
      schedulerRef.current = new BeatScheduler(bpm, beatStyle);
    }
    const scheduler = schedulerRef.current;
    scheduler.setBpm(bpm);
    scheduler.setStyle(beatStyle);

    // Audio beat callback updates the game state
    scheduler.subscribe((bar, beat, audioTime) => {
      if (engineRef.current) {
        engineRef.current.updateAtTime(audioTime);
      }
    });

    scheduler.start();
    const startTime = scheduler.getCurrentAudioTime();
    engineRef.current?.start(startTime);
    setIsPlaying(true);
  };

  const handleStopSession = () => {
    if (schedulerRef.current) {
      schedulerRef.current.stop();
    }
    engineRef.current?.stop();
    setIsPlaying(false);
  };

  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    schedulerRef.current?.setBpm(newBpm);
    engineRef.current?.setBpm(newBpm);
  };

  const handleBeatStyleChange = (newStyle: BeatStyle) => {
    setBeatStyle(newStyle);
    schedulerRef.current?.setStyle(newStyle);
  };

  const handleLevelChange = (newLevel: DifficultyLevel) => {
    setLevel(newLevel);
    engineRef.current?.setLevel(newLevel);
  };

  const handleTotalBarsChange = (bars: number) => {
    setTotalBars(bars);
  };

  // Determine current bar pattern (A or B) in AABB
  const currentPattern = Math.floor((currentBar - 1) / 2) % 2 === 0 ? "A" : "B";
  const nextPattern = Math.floor(currentBar / 2) % 2 === 0 ? "A" : "B";

  // Determine visibility based on difficulty level
  const isTargetRevealed = useMemo(() => {
    if (level === "all_shown" || level === "four_bars_same_sound") return true;
    if (level === "first_of_pair") {
      // Reveal first bar, second only on bar 2
      return currentBar % 2 === 1 || currentBeat >= 1;
    }
    if (level === "last_bar_only") {
      // Blind drop: reveal right before punchline on beat 3
      return currentBeat >= 3;
    }
    return true;
  }, [level, currentBar, currentBeat]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-4 md:p-8 max-w-4xl mx-auto w-full">
      {/* Top Navigation */}
      <header className="w-full flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-foreground transition-colors px-3 py-1.5 rounded-lg bg-surface border border-borderMuted"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-black px-2.5 py-1 rounded bg-majorelle/15 text-majorelle border border-majorelle/20">
            {mode.toUpperCase()} MODE
          </span>
        </div>
      </header>

      {/* Main Cypher Play Area */}
      <main className="w-full flex flex-col items-center gap-6 my-auto">
        {/* Beat Visualizer Bar */}
        <BeatVisualizer
          currentBar={currentBar}
          totalBars={totalBars}
          currentBeat={currentBeat}
          bpm={bpm}
          soundKey={soundKey}
        />

        {/* Rhyme Tiles Lane */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Active Punchline Tile */}
          <div className="w-full sm:w-1/2 flex flex-col items-center">
            <span className="text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <span>🎯 Current Target (Beat 4)</span>
            </span>
            <RhymeTile
              word={activeWord}
              status="active"
              barIndex={currentBar}
              pattern={currentPattern}
              revealed={isTargetRevealed}
            />
          </div>

          {/* Upcoming Next Bar Tile */}
          <div className="w-full sm:w-1/2 flex flex-col items-center opacity-85">
            <span className="text-[11px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">
              Upcoming Bar {currentBar + 1}
            </span>
            <RhymeTile
              word={nextWord}
              status="next"
              barIndex={currentBar + 1}
              pattern={nextPattern}
              revealed={level === "all_shown"}
            />
          </div>
        </div>

        {/* Audio & Game Controls */}
        <AudioControls
          isPlaying={isPlaying}
          bpm={bpm}
          onPlay={handleStartSession}
          onStop={handleStopSession}
          onBpmChange={handleBpmChange}
          beatStyle={beatStyle}
          onBeatStyleChange={handleBeatStyleChange}
          level={level}
          onLevelChange={handleLevelChange}
          totalBars={totalBars}
          onTotalBarsChange={handleTotalBarsChange}
        />
      </main>

      {/* Mobile-Friendly Hint */}
      <footer className="w-full text-center text-xs text-zinc-500 pt-4">
        <span>Tip: Speak or rap your line on beats 1-3, and deliver the rhyme tile on beat 4!</span>
      </footer>
    </div>
  );
}
