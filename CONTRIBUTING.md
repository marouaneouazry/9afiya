# Contributing to 9afiya (قافية)

Thank you for your interest in contributing to 9afiya! We welcome contributions to the audio engine, Darija rhyme linguistics, UI components, and educational guides.

---

## 1. Branching Strategy

- All development is branch-based. Never push directly to `main`.
- Create short-lived feature branches branched from an up-to-date `main`:
  - `feat/audio-engine`
  - `feat/rhyme-index`
  - `feat/classic-mode`
  - `fix/beat-drift`
  - `docs/architecture`
  - `chore/ci`
  - `data/curated-loanwords`

---

## 2. Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short imperative summary>

[optional body explaining why and context]

[optional footer, e.g. Closes #12]
```

### Allowed Types:
- `feat`: A new user-facing feature or game mode
- `fix`: A bug fix
- `docs`: Documentation changes only
- `style`: Changes that do not affect the meaning of the code (formatting, linting)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process, auxiliary tools, or libraries
- `data`: Updates to Darija phonetic rules, rhyme dictionaries, or beat metadata
- `ci`: CI configuration and scripts

---

## 3. Pull Request Process

1. Ensure all linting, typechecks, and unit tests pass locally:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   ```
2. Open a Pull Request into `main` using the PR template.
3. Link the associated issue (e.g., `Closes #14`).
4. Wait for automated CI checks to pass.
5. Merges into `main` should use **Squash and Merge** or **Rebase and Merge** to maintain a clean linear history.

---

## 4. Local Development Setup

```bash
# Clone the repository
git clone https://github.com/marouaneouazry/9afiya.git
cd 9afiya

# Install dependencies
npm install

# Run the local development server
npm run dev

# Run unit tests
npm run test
```
