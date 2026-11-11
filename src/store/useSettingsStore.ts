import { create } from "zustand";
import { BeatStyle } from "@/lib/audio/BeatScheduler";

export type ScriptDisplayMode = "arabic" | "arabizi" | "both";

interface SettingsState {
  script: ScriptDisplayMode;
  beatStyle: BeatStyle;
  includeSensitive: boolean;
  volume: number;
  setScript: (script: ScriptDisplayMode) => void;
  setBeatStyle: (style: BeatStyle) => void;
  setIncludeSensitive: (include: boolean) => void;
  setVolume: (volume: number) => void;
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
  includeSensitive: initial.includeSensitive || false,
  volume: initial.volume ?? 0.8,

  setScript: (script) => {
    set({ script });
    persistSettings({ ...get(), script });
  },

  setBeatStyle: (beatStyle) => {
    set({ beatStyle });
    persistSettings({ ...get(), beatStyle });
  },

  setIncludeSensitive: (includeSensitive) => {
    set({ includeSensitive });
    persistSettings({ ...get(), includeSensitive });
  },

  setVolume: (volume) => {
    set({ volume });
    persistSettings({ ...get(), volume });
  },
}));
