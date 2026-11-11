# Changelog

All notable changes to the **9afiya** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-11-11

### Added
- **Web Audio API Beat Scheduler**: Zero-drift hardware clock lookahead scheduling (Chris Wilson model) with sub-millisecond precision.
- **Procedural Audio Synthesizer**: In-browser zero-licensing audio synthesizer for boom bap, Moroccan chaabi (darbouka dum/tek + krakeb), and lofi beats.
- **Phonetic Rhyme Engine**: Full Darija phonetic normalization supporting Arabic script and Arabizi numerals (3, 7, 9, 8, 5, 2) with 43 passing unit tests and 32 hand-verified Moroccan rhyme sets.
- **Pure Headless Game Engine**: Turn-based state machine in pure TypeScript (`src/lib/game`) with injectable `TimeSource` interface for future networked multiplayer.
- **Classic Cypher Game Mode**: AABB couplets with 4 difficulty levels (all shown, first of pair, blind drop, and 4-bar single sound AAAA).
- **Zellige Tile Rhyme Lane**: Distinct Moroccan visual identity with tile lock animations, Majorelle blue, saffron, and terracotta palettes.
- **Accessible Visual Beat Indicator**: 4-beat visualizer designed for deaf and hard-of-hearing MCs.
- **Data Pipeline**: Precomputed build-time JSON rhyme index (~3,180 words, 291 rhyme groups) derived from the Darija Open Dataset (DODa, CC BY-NC 4.0) and curated loanwords.
- **GitHub Workflow**: Conventional commits, issue & PR templates, and GitHub Actions CI workflow for linting, typechecking, testing, and production building.
