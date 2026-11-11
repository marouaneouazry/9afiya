"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useTranslation } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-8 max-w-[1200px] mx-auto w-full">
      {/* Top Bar: Logo top-left + Language toggle */}
      <header className="w-full flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span>{siteConfig.name}</span>
          <span className="font-arabic font-bold text-primary">
            {siteConfig.arabicName}
          </span>
        </Link>

        <LanguageToggle />
      </header>

      {/* Main Content Area */}
      <main className="w-full my-auto py-8">
        {/* Desktop 2-column layout (>= 900px), collapses to single column below 900px */}
        <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-10 min-[900px]:gap-12 items-center">
          {/* Left Column (Headline, Sentence, Play Button) */}
          <div className="flex flex-col gap-6">
            <h1 className="text-[40px] min-[900px]:text-[64px] font-bold text-foreground leading-[1.1] tracking-tight">
              {t("home.headline")}
            </h1>

            <p className="text-[18px] min-[900px]:text-[20px] text-muted leading-relaxed max-w-xl">
              {t("home.sub")}
            </p>

            <div className="pt-2">
              <Link
                href="/play/classic"
                className="w-full min-[900px]:w-[260px] min-h-[48px] px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center text-center"
              >
                {t("home.play")}
              </Link>
            </div>
          </div>

          {/* Right Column: Static Preview of Game (Desktop only, >= 900px) */}
          <div className="hidden min-[900px]:flex flex-col items-center justify-center">
            <div className="w-full max-w-[380px] bg-surface border-2 border-accent rounded-2xl p-6 shadow-sm flex flex-col items-center gap-5">
              {/* Saffron word tile */}
              <div className="w-full bg-accent-surface rounded-xl p-6 border border-accent/40 flex flex-col items-center justify-center text-center">
                <span className="text-6xl font-black font-arabic text-foreground mb-1">
                  كلام
                </span>
                <span className="text-lg font-bold text-accent">klam</span>
                <span className="text-sm text-muted mt-1">&ldquo;words&rdquo;</span>
              </div>

              {/* 4 beat dots with 4th highlighted (Always LTR) */}
              <div
                dir="ltr"
                className="flex items-center justify-center gap-3 w-full pt-1"
                aria-label="Beat timing preview"
              >
                <div
                  className="w-5 h-5 rounded-full bg-border"
                  title="Beat 1"
                />
                <div
                  className="w-5 h-5 rounded-full bg-border"
                  title="Beat 2"
                />
                <div
                  className="w-5 h-5 rounded-full bg-border"
                  title="Beat 3"
                />
                <div
                  className="w-6 h-6 rounded-full bg-accent shadow-sm ring-4 ring-accent/25"
                  title="Beat 4 (Rhyme Drop)"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Credit Line */}
      <footer className="w-full py-4 text-center sm:text-start text-sm text-muted">
        <p>{t("home.credit")}</p>
      </footer>
    </div>
  );
}
