# 9afiya (قافية) 🎙️🇲🇦

> **9afiya** (pronounced *Qafiya* / قافية, Arabic for "rhyme") is a Moroccan Darija freestyle rap browser game and training platform.

Words arrive rhythmically in time with authentic hip-hop and Moroccan rhythms (AABB bars). MCs, rappers, and Darija learners train their flow, vocabulary, and improvisation by delivering punchlines ending on beat 4.

---

## ✨ Features

- **🎯 Classic Mode**: Practice AABB bars with escalating difficulty levels (all words shown, first word of pair shown, last bar only, or 4-bar single sound AAAA).
- **🏙️ Topic Cypher**: Thematic vocabulary drills (Casablanca streets, taxi drivers, football, Ramadan, school, and more).
- **🔄 Code-Switching**: Mix Darija with French and Spanish loanwords commonly used in Moroccan rap (e.g., *rwina*, *derb*, *capot*, *guichet*, *camaron*).
- **📅 Daily Challenge**: Synchronized daily beat and rhyme word sets with personal streak tracking.
- **⚔️ Battle Mode (Local 2-Player)**: Turn-based bar trading with active shot-clocks.
- **🔬 Rhyme Lab**: Interactive Darija rhyming dictionary searching both Arabic script (`دار`) and Arabizi/Latin (`dar`).
- **🎧 Web Audio Lookahead Engine**: Zero-drift beat scheduler powered by Web Audio API (`currentTime`), featuring Moroccan percussion patterns (darbouka, krakeb, chaabi rhythms) and licensed lo-fi/boom-bap loops.
- **🌐 Multilingual & RTL**: Full support for Moroccan Darija (Arabic & Latin script), English, and French, with automatic bidirectional layout.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js](https://nextjs.org/) (App Router) + TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a Moroccan street culture palette (Majorelle blue, saffron, terracotta, deep teal, plaster white)
- **Audio Engine**: Custom Web Audio API lookahead scheduler with sub-millisecond precision
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with resilient `localStorage` sync
- **Rhyme Pipeline**: Build-time static JSON index derived from the [Darija Open Dataset (DODa)](https://github.com/darija-open-dataset/dataset) and curated loanword lists
- **Testing**: [Vitest](https://vitest.dev/) for unit and phonetic timing tests; [Playwright](https://playwright.dev/) for cross-browser E2E sessions
- **PWA**: Installable web application with offline asset caching

For in-depth technical documentation, refer to:
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — System architecture, data flow, timing engine, and risk mitigation
- [`DATA_SOURCES.md`](./DATA_SOURCES.md) — Dataset licenses (DODa CC BY-NC 4.0), citations, and frequency corpus details
- [`BEAT_LICENSES.md`](./BEAT_LICENSES.md) — Audio licensing audit, CC0/PD verification, and attribution logs

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18.0.0 (v20+ or v24 LTS recommended)
- **npm** >= 9.0.0 (or `pnpm` / `yarn`)

### Installation

```bash
# Clone the repository
git clone https://github.com/marouaneouazry/9afiya.git
cd 9afiya

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Running Tests

```bash
# Run unit & phonetic engine tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run Playwright end-to-end tests
npm run test:e2e
```

---

## 📁 Repository Structure

```
├── .github/              # Issue/PR templates, CI workflows
├── data/
│   ├── raw/              # Untouched source datasets (git-ignored)
│   └── build/            # Generated static rhyme indexes & themes
├── docs/                 # Architecture, beat licensing, and guides
├── public/
│   ├── beats/            # Beat audio loops & beats.json metadata
│   └── icons/            # PWA icons & app artwork
├── scripts/              # Data processing and rhyme index generation
├── src/
│   ├── app/              # Next.js App Router routes & layouts
│   ├── components/       # UI components (tiles, lane, beat visualizer)
│   ├── config/           # Site configuration (name, branding, constants)
│   ├── lib/
│   │   ├── audio/        # Lookahead Web Audio scheduler & synth
│   │   ├── game/         # Headless pure TypeScript game engine
│   │   ├── i18n/         # Darija/Arabic/French/English translations
│   │   └── rhyme/        # Phonetic normalizer, rhyme key & ranker
│   └── types/            # TypeScript interfaces
├── ARCHITECTURE.md
├── DATA_SOURCES.md
├── BEAT_LICENSES.md
└── README.md
```

---

## 📜 Roadmap & Milestones

- [x] **Phase 0: Foundation**: Repo setup, architecture specifications, dataset licensing review, and rhyme algorithm prototype.
- [ ] **Phase 1: MVP**: Web Audio engine, procedural Moroccan beats, Classic game mode (AABB), static rhyme index, and mobile-first zellige tile UI.
- [ ] **Phase 2: Growth**: Rhyme Lab search engine, Topic Cypher, Code-Switching mode, Daily Challenge, beat library, and PWA offline mode.
- [ ] **Phase 3: Community**: Local 2-player battle mode, community word submissions with moderation, and Supabase integration.

---

## 📄 License & Attribution

- Application code is licensed under the chosen open-source license (see [`LICENSE`](./LICENSE)).
- Linguistic data includes derivations from the **Darija Open Dataset (DODa)**, licensed under **CC BY-NC 4.0** (Non-Commercial). See [`DATA_SOURCES.md`](./DATA_SOURCES.md) for full citations and commercial usage terms.
- Audio beats are verified CC0 / Public Domain or procedurally synthesized in-browser. See [`BEAT_LICENSES.md`](./BEAT_LICENSES.md).
