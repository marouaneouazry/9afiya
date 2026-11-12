"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BeatScheduler } from "@/lib/audio/BeatScheduler";
import { getBeatById, getRandomBeat, BEAT_DEFINITIONS } from "@/lib/audio/beatDefinitions";
import { previewManager } from "@/lib/audio/previewManager";
import { GameEngine } from "@/lib/game/GameEngine";
import { DifficultyLevel, RhymeWord } from "@/types/game";
import { BeatVisualizer } from "@/components/game/BeatVisualizer";
import { RhymeTile } from "@/components/game/RhymeTile";
import { BeatPicker } from "@/components/game/BeatPicker";
import { SettingsContent } from "@/components/game/SettingsContent";
import { SettingsSheet } from "@/components/game/SettingsSheet";
import { useSettingsStore } from "@/store/useSettingsStore";
import { siteConfig } from "@/config/site";
import { useTranslation } from "@/lib/i18n";
import { BeatDefinition } from "@/types/audio";

export default function PlayModePage() {
  const { t, lang } = useTranslation();
  const { script, selectedBeatId, bpm, level, setBpm, setLevel } =
    useSettingsStore();

  const [wordsPool, setWordsPool] = useState<RhymeWord[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [currentSessionBeat, setCurrentSessionBeat] = useState<BeatDefinition>(BEAT_DEFINITIONS[0]);

  const [currentBar, setCurrentBar] = useState<number>(1);
  const [currentBeat, setCurrentBeat] = useState<number>(1);
  const [activeWord, setActiveWord] = useState<RhymeWord | null>(null);
  const [nextWord, setNextWord] = useState<RhymeWord | null>(null);

  const totalBars = siteConfig.defaultSessionBars;
  const schedulerRef = useRef<BeatScheduler | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // 1. Fetch precomputed static words
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/data/rhyme_index.json");
        const groups = await res.json();
        const flattened: RhymeWord[] = [];
        for (const list of Object.values(groups)) {
          flattened.push(...(list as RhymeWord[]));
        }
        setWordsPool(flattened);
      } catch (err) {
        console.error("Failed to load rhyme words:", err);
      }
    }
    loadData();
  }, []);

  // 2. Initialize Game Engine
  useEffect(() => {
    const engine = new GameEngine({
      mode: "classic",
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
    });

    return () => {
      unsubscribe();
      if (schedulerRef.current) {
        schedulerRef.current.stop();
      }
      previewManager.stop();
    };
  }, [level, bpm, totalBars, wordsPool]);

  // 3. Connect BeatScheduler hardware audio clock to GameEngine
  const handleStartSession = () => {
    // Stop any active preview
    previewManager.stop();

    // Determine session beat (resolve random if chosen)
    let beatToPlay: BeatDefinition;
    if (selectedBeatId === "random") {
      beatToPlay = getRandomBeat();
    } else {
      beatToPlay = getBeatById(selectedBeatId) || BEAT_DEFINITIONS[0];
    }
    setCurrentSessionBeat(beatToPlay);

    if (!schedulerRef.current) {
      schedulerRef.current = new BeatScheduler(beatToPlay, bpm);
    }
    const scheduler = schedulerRef.current;
    scheduler.setBeat(beatToPlay);
    scheduler.setBpm(bpm);

    scheduler.subscribe((_bar, _beat, audioTime) => {
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

  const handleOpenSettings = () => {
    previewManager.stop();
    setIsSettingsOpen(true);
  };

  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm, true);
    schedulerRef.current?.setBpm(newBpm);
    engineRef.current?.setBpm(newBpm);
  };

  const handleLevelChange = (newLevel: DifficultyLevel) => {
    setLevel(newLevel);
    engineRef.current?.setLevel(newLevel);
  };

  // Determine visibility based on difficulty level
  const isTargetRevealed = useMemo(() => {
    if (level === "all_shown" || level === "four_bars_same_sound") return true;
    if (level === "first_of_pair") {
      return currentBar % 2 === 1 || currentBeat >= 1;
    }
    if (level === "last_bar_only") {
      return currentBeat >= 3;
    }
    return true;
  }, [level, currentBar, currentBeat]);

  const activeBeatName = currentSessionBeat.name[lang] || currentSessionBeat.name["en"];

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-8 max-w-[1200px] mx-auto w-full">
      {/* ================= HEADER ROW ================= */}
      <header className="w-full flex items-center justify-between min-h-[48px]">
        {!isPlaying ? (
          <>
            {/* Back button */}
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[48px] px-4 rounded-xl border border-border bg-surface text-foreground font-bold text-sm hover:bg-border/30 transition-colors"
            >
              ← {t("game.back")}
            </Link>

            {/* Mode name */}
            <div className="font-bold text-base sm:text-lg text-foreground">
              {t("game.mode.classic")}
            </div>

            {/* Settings button */}
            <button
              type="button"
              onClick={handleOpenSettings}
              className="inline-flex items-center justify-center min-h-[48px] px-4 rounded-xl border border-border bg-surface text-foreground font-bold text-sm hover:bg-border/30 transition-colors"
              aria-label={t("game.settings")}
            >
              ⚙ {t("game.settings")}
            </button>
          </>
        ) : (
          /* Header while playing: bar counter and small muted chosen beat name */
          <div className="w-full flex flex-col items-center justify-center text-center">
            <span className="text-base sm:text-lg font-bold text-foreground">
              {t("game.bar", {
                n: currentBar,
                total: totalBars === Infinity ? "∞" : totalBars,
              })}
            </span>
            <span className="text-xs sm:text-sm text-muted font-medium">
              {activeBeatName} • {bpm} BPM
            </span>
          </div>
        )}
      </header>

      {/* ================= MAIN AREA ================= */}
      <main className="w-full my-auto py-6 flex-1 flex flex-col items-center justify-center">
        {!isPlaying ? (
          /* ---------- BEFORE START ---------- */
          <div className="w-full flex flex-col min-[900px]:flex-row items-start justify-center gap-10">
            {/* Center / Left Column (Placeholder, Instructions, Dots, Beat Picker, Start Button) */}
            <div className="w-full flex-1 flex flex-col items-center justify-center text-center gap-6">
              {/* Large placeholder "؟" */}
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-surface border-2 border-border flex items-center justify-center text-6xl font-bold font-arabic text-muted/60 select-none shadow-xs"
                aria-hidden="true"
              >
                ؟
              </div>

              {/* Instruction sentence */}
              <p className="text-base sm:text-lg text-muted max-w-md leading-relaxed">
                {t("game.ready.hint")}
              </p>

              {/* Four idle beat dots */}
              <BeatVisualizer isPlaying={false} />

              {/* Beat Picker Section (Cards with audio preview) */}
              <div className="w-full max-w-2xl text-start">
                <BeatPicker />
              </div>

              {/* Primary Start button */}
              <button
                type="button"
                onClick={handleStartSession}
                className="w-full sm:w-[260px] min-h-[48px] px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center text-center mt-2"
              >
                {t("game.start")}
              </button>
            </div>

            {/* Desktop-only Settings Panel (360px on right) */}
            <aside
              aria-label={t("game.settings")}
              className="hidden min-[900px]:block w-[360px] bg-surface border border-border rounded-2xl p-6 shadow-xs shrink-0"
            >
              <h2 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">
                {t("game.settings")}
              </h2>
              <SettingsContent
                onBpmChange={handleBpmChange}
                onLevelChange={handleLevelChange}
              />
            </aside>
          </div>
        ) : (
          /* ---------- PLAYING ---------- */
          <div className="w-full max-w-lg flex flex-col items-center justify-center gap-6 text-center">
            {/* Small hint line */}
            <p className="text-sm sm:text-base text-muted font-medium">
              {t("game.target")}
            </p>

            {/* Saffron tile with the rhyme word */}
            <RhymeTile
              word={activeWord}
              revealed={isTargetRevealed}
              isBeat4={currentBeat === 4}
            />

            {/* Four beat dots (the 4th turns saffron on beat 4) */}
            <BeatVisualizer isPlaying={true} currentBeat={currentBeat} />

            {/* Muted "Next: ..." line */}
            <p className="text-sm sm:text-base text-muted min-h-[24px]">
              {nextWord ? (
                <>
                  <span className="font-semibold">{t("game.next")}</span>{" "}
                  <span>
                    {script === "arabizi" ? nextWord.latn : nextWord.ar}
                  </span>
                </>
              ) : (
                ""
              )}
            </p>

            {/* Secondary outlined Stop button */}
            <button
              type="button"
              onClick={handleStopSession}
              className="min-h-[48px] px-8 py-2.5 rounded-xl border-2 border-primary text-primary hover:bg-primary/10 font-bold text-base transition-colors flex items-center justify-center text-center mt-2"
            >
              {t("game.stop")}
            </button>
          </div>
        )}
      </main>

      {/* Footer spacer for layout balance */}
      <footer className="w-full min-h-[24px]" />

      {/* Mobile Settings Bottom Sheet */}
      <SettingsSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onBpmChange={handleBpmChange}
        onLevelChange={handleLevelChange}
      />
    </div>
  );
}
