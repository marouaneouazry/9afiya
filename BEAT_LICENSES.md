# Beat Licensing Policy & Attribution Log

**Project:** 9afiya (قافية)  
**Last Updated:** November 2026  

---

## 1. Beat Licensing Policy

High-tempo musical rhythm is fundamental to freestyle rap, but music copyright carries strict legal liabilities. 9afiya enforces a zero-tolerance policy against unverified or ambiguous audio licenses:

1. **Strictly Prohibited Sources**:
   - 🚫 **"Free Beats" on YouTube / BeatStars / SoundCloud**: "Free for non-profit use with credit" is legally hazardous. It does not permit commercial hosting, risks automated Content ID takedowns, and subjects the project to copyright strikes or retroactive license fees.
   - 🚫 **Uncredited Ripped Audio**: No unauthorized sampling of copyrighted master recordings.
2. **Permitted Sources**:
   - ✅ **Procedurally Synthesized Beats**: In-browser Web Audio synthesis (synthesized kicks, 808 sub-bass, snares, hats, and Moroccan percussion). Zero copyright, zero licensing risk, infinite seamless duration.
   - ✅ **Creative Commons Zero (CC0) / Public Domain**: Fully dedicated to the public domain without commercial restrictions.
   - ✅ **Verified Commercial Creative Commons (CC BY 4.0)**: Permitting commercial reuse and modification with explicit attribution.
   - ✅ **Exclusive Producer Written Agreements**: Direct written licensing agreements from Moroccan beatmakers granting royalty-free, perpetual distribution rights.

---

## 2. In-Engine Procedural Beats (Zero Licensing Risk)

The 9afiya audio engine includes a Web Audio procedural synthesizer capable of generating authentic hip-hop and Moroccan rhythms on the fly without loading external audio files:

| Pattern ID | Style / Rhythm | Default BPM | Instruments Used |
| :--- | :--- | :--- | :--- |
| `procedural-boombap-01` | Classic 90s Boom Bap | 88 | Synth Kick, Lowpass Snare, Closed Hat, Sub 808 |
| `procedural-chaabi-trap` | Moroccan Chaabi Trap | 102 | Trap 808, Darbouka Dum/Tek, Krakeb Shaker, Clap |
| `procedural-lofi-derb` | Chill Lofi Casablanca | 80 | Soft Kick, Brushes/Snap, Krakeb Pulse, Filtered Bass |

---

## 3. Beat Catalog Log (`public/beats/beats.json`)

All static audio files included in `/public/beats/` must be cataloged in the table below and mirrored in `public/beats/beats.json`:

| ID | Title | Producer | BPM | Key | License | Source URL | Attribution Text | Date Added |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *sample-01* | *Darbouka Boom Bap* | *9afiya Procedural Synth* | 90 | Dm | CC0 1.0 Universal | Built-in Web Audio API | Generated procedurally by 9afiya Audio Engine | 2026-11-11 |
| *sample-02* | *Casablanca Nightliner* | *9afiya Procedural Synth* | 95 | Am | CC0 1.0 Universal | Built-in Web Audio API | Generated procedurally by 9afiya Audio Engine | 2026-11-11 |
| *sample-03* | *Derb Sultan Chaabi* | *9afiya Procedural Synth* | 104 | Gm | CC0 1.0 Universal | Built-in Web Audio API | Generated procedurally by 9afiya Audio Engine | 2026-11-11 |

*(Additional external CC0 and licensed community beats will be logged here as verified).*

---

## 4. Producer Submission Guidelines & Outreach Workflow

To support the Moroccan hip-hop scene, 9afiya hosts a dedicated `/submit-beat` portal.

### Submission Terms:
- **Loop Format**: High-quality stereo WAV or 320kbps MP3, seamless 4-bar or 8-bar loop.
- **BPM Range**: 70 to 110 BPM (with exact BPM and musical key metadata supplied).
- **Rights Grant**: Producers must grant an irrevocable, non-exclusive, worldwide, royalty-free license for 9afiya to stream and distribute the audio within the application.
- **Attribution Guarantee**: The producer's name, Instagram/YouTube/Spotify link, and beat title will be prominently displayed on the game screen whenever their beat plays.
- **Moderation**: No beat is automatically published. Every submission is audited for copyright clearance, audio clipping, and seamless looping before entering `beats.json`.
