# Data Sources & Licensing Manifest

**Project:** 9afiya (قافية)  
**Last Updated:** November 2026  

This document logs all linguistic datasets, frequency corpora, and lexical sources utilized by the 9afiya Darija rhyme engine, including their exact license terms, commercial use restrictions, and mandatory attribution citations.

---

## 1. Primary Dataset: Darija Open Dataset (DODa)

- **Source Repository:** [https://github.com/darija-open-dataset/dataset](https://github.com/darija-open-dataset/dataset)
- **Primary Authors:** Aissam Outchakoucht & Hamza Es-Samaali
- **Size:** ~150,000 human-annotated lexical and syntactic entries; ~49,000 parallel sentences; 500k extended synthetic translation corpus.
- **License:** **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**
- **License Copy on File:**
  > Permission is hereby granted, free of charge, to any person obtaining a copy of this Dataset and associated documentation files, to:
  > - **Share** — copy and redistribute the material in any medium or format
  > - **Adapt** — remix, transform, and build upon the material
  > Under the following terms:
  > - **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
  > - **NonCommercial** — You may not use the material for commercial purposes.
  > "For commercial use or inquiries related to commercial licensing, please contact the copyright holders Aissam or Hamza."

### ⚠️ Critical Commercial Restriction Flag
> [!WARNING]
> **Commercial Use Restriction**: DODa is licensed strictly under **CC BY-NC 4.0**. Personal, research, and educational use is completely free. However, if **9afiya** introduces **advertisements, paid subscriptions, in-app purchases, or commercial sponsorships**, the project creator **MUST** contact the copyright holders (Aissam Outchakoucht and Hamza Es-Samaali) for written commercial licensing permission before launching monetization.

### Ingested DODa Subdirectories
1. `syntactic categories/`:
   - `nouns.csv`: Base Darija nouns with Latin spellings (`n1, n2, n3`), Arabic script, and English glosses.
   - `verbs.csv`: Root verbs and conjugations.
   - `adjectives.csv`: Descriptive adjectives used for punchlines.
2. `semantic categories/`:
   - `food.csv`, `animals.csv`, `clothes.csv`, `humanbody.csv`, `economy.csv`, `education.csv`, `emotions.csv`, `environment.csv`, `health.csv`: Ingested to power the **Topic Cypher** mode.

### Required Citations & Attribution

Include the following citations in academic credits and the `/data-credits` page:

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

## 2. Secondary Datasets: Word Frequency Estimation

To ensure that the freestyle game presents natural, everyday rhyming words rather than obscure archaic terms, we employ frequency counting from open Darija text corpora to rank candidate rhyme words.

| Dataset Name | Source / Collection | Primary License | Permitted Usage | Function in 9afiya |
| :--- | :--- | :--- | :--- | :--- |
| **Darija Informative Corpus** | [Hugging Face: JasperV13/darija-datasets](https://huggingface.co/collections/JasperV13/darija-datasets) | Apache 2.0 / CC BY 4.0 | Frequency extraction | Token frequency histogram used during build time to compute `frequencyScore` (1-100). |
| **Moroccan Darija Web Crawl Samples** | Open NLP Corpora | CC BY 4.0 | Non-commercial research / text mining | Weighting commonly used conversational Arabizi spellings. |

*Note: Raw text from these corpora is NEVER redistributed or bundled into the application. Only derived, aggregated frequency weights are compiled into the static JSON dictionary.*

---

## 3. Curated Lexical Additions

### A. French & Spanish Loanwords (Code-Switching Mode)
Moroccan rap heavily incorporates code-switching. A hand-curated dictionary of ~250 loanwords with Moroccan phonetic adaptations is integrated in `data/raw/curated_loanwords.json`.
- **License:** Dedicated to the public domain under **CC0 1.0 Universal**.
- **Examples:**
  - *Rwina* (ruin/chaos)
  - *Capot* (car hood / ruined)
  - *Guichet* (counter / ATM)
  - *Pneu* (tire)
  - *Facteur* (postman)
  - *Semana* (week - Spanish)
  - *Camaron* (shrimp - Spanish)
  - *Fila* (line/queue - Spanish)

### B. Profanity & Sensitive Term Lexicon
freestyle rap frequently touches upon street slang. To ensure child and classroom safety while preserving raw hip-hop authenticity, sensitive words are flagged:
- `sensitive: false` (Default): General public and Daily Challenge word pool.
- `sensitive: true`: Unlocked only when the user explicitly toggles "Street / Explicit Slang" in settings.

---

## 4. Summary Table of Licenses

| Asset | Source | License | Commercial Permitted? | Attribution Required? |
| :--- | :--- | :--- | :--- | :--- |
| **DODa** | Outchakoucht & Es-Samaali | CC BY-NC 4.0 | ❌ (Needs Author Permission) | ✅ (Visible on site & BibTeX) |
| **Frequency Corpora** | HF JasperV13 / Public Crawls | Apache 2.0 / CC BY 4.0 | ✅ (Aggregated metrics only) | ✅ (Listed on `/data-credits`) |
| **Loanwords & Slang** | 9afiya Hand-Curated | CC0 1.0 Universal | ✅ | None required |
