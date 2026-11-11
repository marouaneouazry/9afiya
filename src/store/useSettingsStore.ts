import { create } from "zustand";
import { BeatStyle } from "@/lib/audio/BeatScheduler";
import { DifficultyLevel } from "@/types/game";
import { siteConfig } from "@/config/site";

export type ScriptDisplayMode = "arabic" | "arabizi" | "both";

interface SettingsState {
  script: ScriptDisplayMode;
  beatStyle: BeatStyle;
  bpm: number;
  level: DifficultyLevel;
  setScript: (script: ScriptDisplayMode) => void;
  setBeatStyle: (style: BeatStyle) => void;
  setBpm: (bpm: number) => void;
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
  beatStyle: initial.beatStyle || "boombap",
  bpm: initial.bpm || siteConfig.defaultBpm,
  level: initial.level || "all_shown",

  setScript: (script) => {
    set({ script });
    persistSettings({ ...get(), script });
  },

  setBeatStyle: (beatStyle) => {
    set({ beatStyle });
    persistSettings({ ...get(), beatStyle });
  },

  setBpm: (bpm) => {
    set({ bpm });
    persistSettings({ ...get(), bpm });
  },

  setLevel: (level) => {
    set({ level });
    persistSettings({ ...get(), level });
  },
}));
