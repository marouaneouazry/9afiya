import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Mic, Flame, Sparkles, BookOpen, Music2, Search, Shuffle, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-between p-4 md:p-8 max-w-5xl mx-auto w-full">
      {/* Header & Brand */}
      <header className="w-full flex items-center justify-between py-4 border-b border-borderMuted mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-majorelle flex items-center justify-center text-white shadow-md font-bold text-xl">
            ق
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <span>{siteConfig.name}</span>
              <span className="text-saffron font-arabic text-xl">({siteConfig.arabicName})</span>
            </h1>
            <p className="text-xs text-zinc-400 hidden sm:block">
              {siteConfig.arabicTagline} • {siteConfig.tagline}
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Link
            href="/lab"
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface border border-borderMuted hover:border-majorelle transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-majorelle" />
            <span>Rhyme Lab</span>
          </Link>
          <Link
            href="/beats"
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface border border-borderMuted hover:border-saffron transition-colors flex items-center gap-1.5"
          >
            <Music2 className="w-3.5 h-3.5 text-saffron" />
            <span>Beats</span>
          </Link>
        </nav>
      </header>

      {/* Hero / Quick Play Banner */}
      <section className="w-full bg-surface border border-borderMuted rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden zellige-pattern mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-majorelle/10 text-majorelle text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Moroccan Freestyle Rap Training • تدريب الفريستايل</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3">
          ضبط القافية مع البيت <br className="hidden sm:inline" />
          <span className="text-terracotta">Flow On The 4th Beat</span>
        </h2>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mb-6">
          Train your Darija rhymes on authentic boom-bap, lofi, and Moroccan chaabi rhythms.
          Rhyme tiles lock into place on beat 4 of each bar.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/play/classic"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-majorelle text-white font-bold text-base shadow-lg shadow-majorelle/25 hover:bg-majorelle-600 transition-all flex items-center justify-center gap-2"
          >
            <Mic className="w-5 h-5" />
            <span>Start Cypher (بدا الراب)</span>
          </Link>

          <Link
            href="/daily"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface border border-saffron/40 text-saffron font-bold text-base hover:bg-saffron/10 transition-colors flex items-center justify-center gap-2"
          >
            <Flame className="w-5 h-5" />
            <span>Daily Challenge</span>
          </Link>
        </div>
      </section>

      {/* Game Modes Grid */}
      <section className="w-full mb-10">
        <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
          <span>Game Modes</span>
          <span className="text-xs px-2 py-0.5 rounded bg-surface text-zinc-400 border border-borderMuted">
            طرق اللعب
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Classic Mode */}
          <Link
            href="/play/classic"
            className="p-5 rounded-xl bg-surface border border-borderMuted hover:border-majorelle transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-majorelle/15 text-majorelle flex items-center justify-center font-bold text-sm mb-3">
                AABB
              </div>
              <h4 className="font-bold text-base group-hover:text-majorelle transition-colors">
                Classic Cypher
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Standard 2-bar rhyming couplets (AABB). Four difficulty levels from full reveal to blind punchlines.
              </p>
            </div>
            <div className="text-xs font-semibold text-majorelle mt-4 flex items-center gap-1">
              <span>Play Classic</span> &rarr;
            </div>
          </Link>

          {/* Topic Cypher */}
          <Link
            href="/play/topic"
            className="p-5 rounded-xl bg-surface border border-borderMuted hover:border-saffron transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-saffron/15 text-saffron flex items-center justify-center font-bold text-sm mb-3">
                🏙️
              </div>
              <h4 className="font-bold text-base group-hover:text-saffron transition-colors">
                Topic Cypher (الموضوع)
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Rap on specific themes: Casablanca streets, taxi drivers, football, Ramadan, and school life.
              </p>
            </div>
            <div className="text-xs font-semibold text-saffron mt-4 flex items-center gap-1">
              <span>Pick Theme</span> &rarr;
            </div>
          </Link>

          {/* Code-Switch Mode */}
          <Link
            href="/play/code-switch"
            className="p-5 rounded-xl bg-surface border border-borderMuted hover:border-terracotta transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-terracotta/15 text-terracotta flex items-center justify-center font-bold text-sm mb-3">
                <Shuffle className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-base group-hover:text-terracotta transition-colors">
                Code-Switching
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Mix Moroccan Darija with French and Spanish loanwords commonly used in Casablanca street rap.
              </p>
            </div>
            <div className="text-xs font-semibold text-terracotta mt-4 flex items-center gap-1">
              <span>Mix Languages</span> &rarr;
            </div>
          </Link>

          {/* Daily Challenge */}
          <Link
            href="/daily"
            className="p-5 rounded-xl bg-surface border border-borderMuted hover:border-tealMedina transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-tealMedina/15 text-tealMedina flex items-center justify-center font-bold text-sm mb-3">
                <Flame className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-base group-hover:text-tealMedina transition-colors">
                Daily Challenge
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                The exact same beat and rhyme word progression for every Moroccan MC today. Keep your streak alive!
              </p>
            </div>
            <div className="text-xs font-semibold text-tealMedina mt-4 flex items-center gap-1">
              <span>View Today&apos;s Beat</span> &rarr;
            </div>
          </Link>

          {/* Rhyme Lab */}
          <Link
            href="/lab"
            className="p-5 rounded-xl bg-surface border border-borderMuted hover:border-majorelle transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-majorelle/15 text-majorelle flex items-center justify-center font-bold text-sm mb-3">
                <Search className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-base group-hover:text-majorelle transition-colors">
                Rhyme Lab (مختبر القوافي)
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Darija rhyming dictionary. Search any word in Arabic or Arabizi and view ranked perfect & near rhymes.
              </p>
            </div>
            <div className="text-xs font-semibold text-majorelle mt-4 flex items-center gap-1">
              <span>Open Dictionary</span> &rarr;
            </div>
          </Link>

          {/* Learn & Rhyme Basics */}
          <Link
            href="/learn"
            className="p-5 rounded-xl bg-surface border border-borderMuted hover:border-zinc-400 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-sm mb-3">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-base group-hover:text-zinc-200 transition-colors">
                Guides & Basics
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                How to freestyle, Darija rhyme meter, counting bars, and writing in Arabic and Arabizi script.
              </p>
            </div>
            <div className="text-xs font-semibold text-zinc-300 mt-4 flex items-center gap-1">
              <span>Read Guides</span> &rarr;
            </div>
          </Link>
        </div>
      </section>

      {/* Footer & Attribution */}
      <footer className="w-full border-t border-borderMuted pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <div className="flex items-center gap-2">
          <span>{siteConfig.name} © 2026</span>
          <span>•</span>
          <Link href="/about" className="hover:text-foreground">About</Link>
          <span>•</span>
          <Link href="/data-credits" className="hover:text-foreground">Data & Beats</Link>
          <span>•</span>
          <Link href="/submit-beat" className="hover:text-foreground">Submit Beat</Link>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-tealMedina" />
          <span>Derived from Darija Open Dataset (CC BY-NC 4.0)</span>
        </div>
      </footer>
    </main>
  );
}
