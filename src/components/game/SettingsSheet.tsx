"use client";

import React, { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { SettingsContent } from "./SettingsContent";
import { DifficultyLevel } from "@/types/game";

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onBpmChange?: (bpm: number) => void;
  onLevelChange?: (level: DifficultyLevel) => void;
}

export const SettingsSheet: React.FC<SettingsSheetProps> = ({
  isOpen,
  onClose,
  onBpmChange,
  onLevelChange,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("game.settings")}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-foreground/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
    >
      {/* Backdrop tap to close */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Content */}
      <div className="relative w-full sm:max-w-md bg-surface border border-border rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-xl font-bold text-foreground">
            {t("game.settings")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-foreground text-sm font-bold min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <SettingsContent
          onBpmChange={onBpmChange}
          onLevelChange={onLevelChange}
        />

        {/* Done Button on sheet */}
        <div className="pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-base transition-colors flex items-center justify-center text-center shadow-sm"
          >
            {t("settings.done")}
          </button>
        </div>
      </div>
    </div>
  );
};
