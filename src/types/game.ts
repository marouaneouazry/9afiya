export type GameMode =
  | "classic"
  | "topic"
  | "code-switch"
  | "daily"
  | "battle"
  | "lab";

export type DifficultyLevel =
  | "all_shown" // Level 1: All rhyme words visible
  | "first_of_pair" // Level 2: First word shown, second hidden until beat 1 of bar
  | "last_bar_only" // Level 3: Words only revealed right before delivery
  | "four_bars_same_sound"; // Level 4: AAAA single rhyme sound for 4 bars

export interface RhymeWord {
  ar: string;
  latn: string;
  eng: string;
  syllables: number;
  frequency: number;
  sensitive: boolean;
  rhymeKey: string;
  theme?: string;
  isLoanword?: boolean;
}

export interface BarState {
  barIndex: number;
  pattern: "A" | "B";
  soundKey: string;
  targetWord: RhymeWord | null;
  revealed: boolean;
  isPunchlineBar: boolean;
}

export interface TimeSource {
  getCurrentTime(): number;
}

export interface GameEngineConfig {
  mode: GameMode;
  level: DifficultyLevel;
  totalBars?: number; // 8, 16, 32, or Infinity (endless)
  bpm: number;
  wordsPool: RhymeWord[];
  timeSource: TimeSource;
}

export type GameListener = (state: Readonly<GameEngineState>) => void;

export interface GameEngineState {
  mode: GameMode;
  level: DifficultyLevel;
  bpm: number;
  totalBars: number;
  currentBar: number;
  currentBeat: number; // 1, 2, 3, 4
  isPlaying: boolean;
  activeWord: RhymeWord | null;
  nextWord: RhymeWord | null;
  currentSoundKey: string;
  barHistory: BarState[];
  streak: number;
}
