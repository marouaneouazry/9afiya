import { create } from "zustand";
import { DifficultyLevel } from "@/types/game";
import { siteConfig } from "@/config/site";
import { getBeatById } from "@/lib/audio/beatDefinitions";

export type ScriptDisplayMode = "arabic" | "arabizi" | "both";

interface SettingsState {
  script: ScriptDisplayMode;
  selectedBeatId: string;
  bpm: number;
  isManualBpm: boolean;
  level: DifficultyLevel;
  setScript: (script: ScriptDisplayMode) => void;
  setSelectedBeatId: (id: string) => void;
  setBpm: (bpm: number, manual?: boolean) => void;
  setLevel: (level: DifficultyLevel) => void;
}

const STORAGE_KEY = "9afiya_user_settings";

function loadSavedSettings(): Partial<SettingsState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistSettings(data: Partial<SettingsState>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Fail silently in private/sandboxed mode
  }
}

const initial = loadSavedSettings();

export const useSettingsStore = create<SettingsState>((set, get) => ({
  script: initial.script || "both",
  selectedBeatId: initial.selectedBeatId || "boombap",
  bpm: initial.bpm || siteConfig.defaultBpm,
  isManualBpm: initial.isManualBpm || false,
  level: initial.level || "all_shown",

  setScript: (script) => {
    set({ script });
    persistSettings({ ...get(), script });
  },

  setSelectedBeatId: (selectedBeatId) => {
    const { isManualBpm } = get();
    if (!isManualBpm && selectedBeatId !== "random") {
      const beat = getBeatById(selectedBeatId);
      if (beat) {
        set({ selectedBeatId, bpm: beat.bpm });
        persistSettings({ ...get(), selectedBeatId, bpm: beat.bpm });
        return;
      }
    }
    set({ selectedBeatId });
    persistSettings({ ...get(), selectedBeatId });
  },

  setBpm: (bpm, manual = true) => {
    set({ bpm, isManualBpm: manual });
    persistSettings({ ...get(), bpm, isManualBpm: manual });
  },

  setLevel: (level) => {
    set({ level });
    persistSettings({ ...get(), level });
  },
}));
