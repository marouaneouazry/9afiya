import {
  DifficultyLevel,
  GameEngineConfig,
  GameEngineState,
  GameListener,
  GameMode,
  RhymeWord,
  TimeSource,
} from "@/types/game";

export class DefaultTimeSource implements TimeSource {
  getCurrentTime(): number {
    return typeof performance !== "undefined" ? performance.now() / 1000 : 0;
  }
}

export class GameEngine {
  private config: GameEngineConfig;
  private state: GameEngineState;
  private listeners: Set<GameListener> = new Set();
  private startTime: number = 0;
  private soundQueue: { soundKey: string; words: RhymeWord[] }[] = [];
  private currentPairIndex: number = 0;

  constructor(config: Partial<GameEngineConfig> = {}) {
    const timeSource = config.timeSource || new DefaultTimeSource();
    const totalBars = config.totalBars ?? 16;
    this.config = {
      mode: config.mode || "classic",
      level: config.level || "all_shown",
      totalBars,
      bpm: config.bpm || 88,
      wordsPool: config.wordsPool || [],
      timeSource,
    };

    this.state = {
      mode: this.config.mode,
      level: this.config.level,
      bpm: this.config.bpm,
      totalBars,
      currentBar: 1,
      currentBeat: 1,
      isPlaying: false,
      activeWord: null,
      nextWord: null,
      currentSoundKey: "",
      barHistory: [],
      streak: 0,
    };

    if (this.config.wordsPool.length > 0) {
      this.rebuildSoundQueue();
    }
  }

  public setWordsPool(words: RhymeWord[]): void {
    this.config.wordsPool = words;
    this.rebuildSoundQueue();
  }

  private rebuildSoundQueue(): void {
    // Group words by rhymeKey
    const byKey: Record<string, RhymeWord[]> = {};
    for (const w of this.config.wordsPool) {
      if (!byKey[w.rhymeKey]) {
        byKey[w.rhymeKey] = [];
      }
      byKey[w.rhymeKey].push(w);
    }

    // Filter to keys that have at least 2 words (for AABB pairs) or 4 words (for AAAA)
    const validKeys = Object.keys(byKey).filter((k) => byKey[k].length >= 2);
    // Shuffle keys
    const shuffledKeys = [...validKeys].sort(() => Math.random() - 0.5);

    this.soundQueue = shuffledKeys.map((k) => ({
      soundKey: k,
      words: [...byKey[k]].sort(() => Math.random() - 0.5),
    }));
    this.currentPairIndex = 0;
    this.prepareBarWords(1);
  }

  private prepareBarWords(barNumber: number): void {
    if (this.soundQueue.length === 0) return;

    // Classic mode: AABB (2 bars per rhyme sound)
    // Level 4 (four_bars_same_sound): AAAA (4 bars per rhyme sound)
    const barsPerSound =
      this.state.level === "four_bars_same_sound" ? 4 : 2;

    const soundIdx =
      Math.floor((barNumber - 1) / barsPerSound) % this.soundQueue.length;
    const currentGroup = this.soundQueue[soundIdx];
    const nextSoundIdx =
      Math.floor(barNumber / barsPerSound) % this.soundQueue.length;
    const nextGroup = this.soundQueue[nextSoundIdx];

    const wordOffset = (barNumber - 1) % barsPerSound;
    const active =
      currentGroup.words[wordOffset % currentGroup.words.length] || null;

    const nextOffset = barNumber % barsPerSound;
    const next =
      nextGroup.words[nextOffset % nextGroup.words.length] || null;

    this.state.currentSoundKey = currentGroup.soundKey;
    this.state.activeWord = active;
    this.state.nextWord = next;
  }

  public start(startTime?: number): void {
    this.startTime =
      startTime ?? this.config.timeSource.getCurrentTime();
    this.state.isPlaying = true;
    this.state.currentBar = 1;
    this.state.currentBeat = 1;
    this.prepareBarWords(1);
    this.emit();
  }

  public stop(): void {
    this.state.isPlaying = false;
    this.emit();
  }

  /**
   * Ticks the engine against a precise hardware audio or network time.
   * Can be driven either locally by WebAudio or remotely by multiplayer clock.
   */
  public updateAtTime(timeSeconds: number): void {
    if (!this.state.isPlaying) return;

    const elapsed = timeSeconds - this.startTime;
    if (elapsed < 0) return;

    const secondsPerBeat = 60 / this.state.bpm;
    const secondsPerBar = secondsPerBeat * 4;

    const totalBarsElapsed = Math.floor(elapsed / secondsPerBar);
    const newBar = totalBarsElapsed + 1;
    const timeInCurrentBar = elapsed % secondsPerBar;
    const newBeat = Math.min(
      4,
      Math.floor(timeInCurrentBar / secondsPerBeat) + 1
    );

    let changed = false;

    if (newBar !== this.state.currentBar) {
      if (
        this.state.totalBars !== Infinity &&
        newBar > this.state.totalBars
      ) {
        this.state.isPlaying = false;
        this.emit();
        return;
      }
      this.state.currentBar = newBar;
      this.prepareBarWords(newBar);
      changed = true;
    }

    if (newBeat !== this.state.currentBeat) {
      this.state.currentBeat = newBeat;
      changed = true;
    }

    if (changed) {
      this.emit();
    }
  }

  public setBpm(bpm: number): void {
    this.state.bpm = bpm;
    this.config.bpm = bpm;
    this.emit();
  }

  public setLevel(level: DifficultyLevel): void {
    this.state.level = level;
    this.config.level = level;
    this.prepareBarWords(this.state.currentBar);
    this.emit();
  }

  public setMode(mode: GameMode): void {
    this.state.mode = mode;
    this.config.mode = mode;
    this.emit();
  }

  public getState(): Readonly<GameEngineState> {
    return this.state;
  }

  public subscribe(listener: GameListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    const readonlyState = Object.freeze({ ...this.state });
    this.listeners.forEach((l) => l(readonlyState));
  }
}
