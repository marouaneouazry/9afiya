# Data Sources & Licensing Manifest

**Project:** 9afiya (قافية)  
**Last Updated:** November 2026  

This document logs all lexical datasets, curated vocabularies, and licensing terms used by the 9afiya Darija rhyme engine.

---

## 1. Primary Dataset: Darija Open Dataset (DODa)

- **Source Repository:** [https://github.com/darija-open-dataset/dataset](https://github.com/darija-open-dataset/dataset)
- **Primary Authors:** Aissam Outchakoucht & Hamza Es-Samaali
- **License:** **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**
- **Verbatim License Text:**

```
Creative Commons Attribution-NonCommercial 4.0 International License

Copyright (c) 2024 aissam & hamza

Permission is hereby granted, free of charge, to any person obtaining a copy
of this Dataset and associated documentation files, to:

- **Share** — copy and redistribute the material in any medium or format

- **Adapt** — remix, transform, and build upon the material

Under the following terms:

- **Attribution** — You must give appropriate credit, provide a link to the license, 
and indicate if changes were made. You may do so in any reasonable manner, 
but not in any way that suggests the licensor endorses you or your use.

- **NonCommercial** — You may not use the material for commercial purposes.

- **No additional restrictions** — You may not apply legal terms or technological 
measures that legally restrict others from doing anything the license permits.


The licensor cannot revoke these freedoms as long as you follow the license terms.

For commercial use or inquiries related to commercial licensing, please contact 
the copyright holders aissam or hamza.

THE DATASET IS PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### ⚠️ Commercial Restriction Flag
> [!WARNING]
> **Commercial Use Restriction**: DODa is licensed strictly under **CC BY-NC 4.0**. Personal, research, and educational use is free. If **9afiya** ever introduces **advertisements, paid subscriptions, in-app purchases, or commercial sponsorships**, the project maintainers **MUST** contact the copyright holders (Aissam Outchakoucht and Hamza Es-Samaali) to obtain written commercial licensing permission.

### Ingested DODa Files & Themes
The build pipeline (`scripts/fetch_doda.py` and `scripts/build_rhyme_index.ts`) ingests the following files:

1. **Syntactic Categories (`syntactic categories/`)**:
   - `nouns.csv`: Noun headwords with Arabizi spellings (`n1, n2, n3...`), Arabic script (`darija_ar`), and English glosses (`eng`).
   - `verbs.csv`: Root verbs and verbal forms.
   - `adjectives.csv`: Descriptive vocabulary for punchlines.

2. **Thematic Semantic Categories (`semantic categories/`)**:
   - `food.csv`: Food, drinks, and culinary terms.
   - `clothes.csv`: Clothing, footwear, and garments.
   - `animals.csv`: Animals and wildlife.
   - `humanbody.csv`: Anatomical and physical terms.
   - `emotions.csv`: Psychological states and emotional expressions.

### Required Citations & Attribution

Include the following citations on the `/data-credits` page:

```bibtex
@misc{outchakoucht2024evolution,
      title={The Evolution of Darija Open Dataset: Introducing Version 2}, 
      author={Aissam Outchakoucht and Hamza Es-Samaali},
      year={2024},
      eprint={2405.13016},
      archivePrefix={arXiv},
      primaryClass={cs.CL}
}

@misc{outchakoucht2021moroccan,
      title={Moroccan Dialect -Darija- Open Dataset},
      author={Aissam Outchakoucht and Hamza Es-Samaali},
      year={2021},
      eprint={2103.09687},
      archivePrefix={arXiv},
      primaryClass={cs.CL}
}
```

---

## 2. Word Frequency Scoring

In the current implementation, word frequency is computed **heuristically at build time** without ingesting external text corpora:
- Base score is computed inversely from syllable count: shorter 1-syllable and 2-syllable words receive higher baseline scores (80–90) as they are the natural cadence of freestyle punchlines.
- Multi-syllable words (3+ syllables) receive lower frequency ranks.
- *(Note: External token frequency analysis via Hugging Face web crawls is NOT currently ingested. It is scheduled for a future release to preserve an ultra-lightweight, reproducible build).*

---

## 3. Curated Lexical Additions

### A. Curated French & Spanish Loanwords (53 terms)
Moroccan rap frequently uses code-switching with French and Spanish loanwords. We maintain a curated single-word list in `data/raw/curated_loanwords.json` containing **53 verified terms** (e.g., *rwina*, *capot*, *guichet*, *pneu*, *tomobil*, *birou*, *tilifoun*, *semana*, *camaron*, *fila*, *sebbat*, *kuzina*).
- **Native Darija Exclusions**: Terms native to Darija/Arabic (such as *derb* / درب) are strictly excluded from the loanword dictionary and retained in the general vocabulary.
- **License**: Public Domain dedication (**CC0 1.0 Universal**).

### B. Sensitive & Profanity Word Filtering
To provide a clean default experience while supporting uninhibited rap freestyle, an expanded list of 30+ Moroccan Darija sensitive, vulgar, and profanity roots (covering Arabic script and Arabizi numerals `3, 7, 9, 8, 5, 2`) is maintained in `scripts/build_rhyme_index.ts`.
- `sensitive: false` (Default): General public and educational cyphers.
- `sensitive: true`: Filtered out unless explicitly unlocked by the user in settings.

---

## 4. Summary Table of Data Sources

| Source | File / Collection | Items | License | Commercial Permitted? | Attribution Required? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DODa Syntactic** | `nouns.csv`, `verbs.csv`, `adjectives.csv` | ~3,100 clean words | CC BY-NC 4.0 | ❌ (Needs Author Permission) | ✅ (Visible on site & BibTeX) |
| **DODa Semantic** | `food`, `clothes`, `animals`, `body`, `emotions` | 5 themes | CC BY-NC 4.0 | ❌ (Needs Author Permission) | ✅ (Visible on site & BibTeX) |
| **Curated Loanwords** | `curated_loanwords.json` | 53 words | CC0 1.0 | ✅ | None required |
| **Profanity Filter** | In-pipeline filter list | 30+ roots | CC0 1.0 | ✅ | None required |
