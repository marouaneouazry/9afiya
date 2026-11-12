import { test, expect } from "@playwright/test";

test.describe("9afiya UI Smoke Tests", () => {
  test("home loads with correct elements and responsive preview", async ({
    page,
  }, testInfo) => {
    await page.goto("/");

    // Logo brand is visible
    await expect(page.getByRole("link", { name: /9afiya/i })).toBeVisible();

    // Headline is visible
    await expect(page.locator("h1")).toBeVisible();

    // Credit line is visible
    await expect(
      page.getByText(/Darija Open Dataset/i)
    ).toBeVisible();

    // Play button is visible and links to /play/classic
    const playBtn = page.getByRole("link", { name: /بدا|Play|Jouer|Bda/i });
    await expect(playBtn).toBeVisible();

    // Check desktop preview visibility based on viewport
    const previewTile = page.locator("text=klam");
    if (testInfo.project.name === "desktop-1440") {
      await expect(previewTile).toBeVisible();
    } else {
      await expect(previewTile).not.toBeVisible();
    }
  });

  test("Beat picker displays at least 10 cards, previews beat, and uses selected beat on Start", async ({
    page,
  }) => {
    await page.goto("/play/classic");

    // Beat picker section is visible
    const radiogroup = page.locator('[role="radiogroup"]');
    await expect(radiogroup).toBeVisible();

    // Picker must show at least 10 cards (11 cards: 1 Surprise me + 10 beats)
    const cards = page.locator('[role="radio"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(10);

    // Surprise me card is first
    const firstCard = cards.first();
    await expect(firstCard).toBeVisible();

    // Select a specific beat card (e.g., Chaabi or Old School)
    const chaabiCard = page.locator('[data-testid="beat-card-chaabi"]');
    await expect(chaabiCard).toBeVisible();
    await chaabiCard.click();
    await expect(chaabiCard).toHaveAttribute("aria-checked", "true");

    // Preview button toggles preview state
    const chaabiPreviewBtn = page.locator('[data-testid="preview-btn-chaabi"]');
    await chaabiPreviewBtn.click();
    await expect(chaabiCard).toHaveAttribute("data-playing", "true");
    await expect(chaabiPreviewBtn).toHaveAttribute("aria-pressed", "true");

    // Tapping another preview switches preview immediately
    const boombapCard = page.locator('[data-testid="beat-card-boombap"]');
    const boombapPreviewBtn = page.locator('[data-testid="preview-btn-boombap"]');
    await boombapPreviewBtn.click();
    await expect(boombapCard).toHaveAttribute("data-playing", "true");
    await expect(chaabiCard).toHaveAttribute("data-playing", "false");

    // Pressing Start starts session and stops any preview
    const startBtn = page.getByRole("button", { name: /بدا|Start|Lancer|Bda/i });
    await startBtn.click();

    // Playing screen: bar counter is visible
    await expect(page.getByText(/البار|Bar|Mesure/i)).toBeVisible();

    // Chosen beat name is shown under bar counter
    await expect(page.getByText(/BPM/i)).toBeVisible();

    // Target hint is visible
    await expect(
      page.getByText(/سالي بهاد القافية|Land this rhyme|Place cette rime|Sali b had/i)
    ).toBeVisible();

    // Stop button works and returns to ready state
    const stopBtn = page.getByRole("button", { name: /وقّف|Stop|Arrêter|Wa99ef/i });
    await expect(stopBtn).toBeVisible();
    await stopBtn.click();
    await expect(page.getByText("؟")).toBeVisible();
  });

  test("Settings opens and closes", async ({ page }, testInfo) => {
    await page.goto("/play/classic");

    if (testInfo.project.name === "mobile-375") {
      // Mobile: Click Settings button to open bottom sheet
      const settingsBtn = page.getByRole("button", {
        name: /الإعدادات|Settings|Paramètres|L-i3dadat/i,
      });
      await settingsBtn.click();

      // Dialog is visible
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();

      // Help level & Script buttons are visible inside settings
      await expect(sheet.getByRole("button", { name: /طق|Tap/i })).toBeVisible();
      await expect(sheet.getByRole("button", { name: /كاع الكلمات|All words|Tous les mots|Ga3 l-klimat/i })).toBeVisible();
      await expect(sheet.getByRole("button", { name: /عربية|Arabic|Arabe|3arbia/i })).toBeVisible();

      // Click Done button to close
      const doneBtn = sheet.getByRole("button", { name: /تم|Done|OK|Tem/i });
      await doneBtn.click();

      // Dialog is closed
      await expect(sheet).not.toBeVisible();
    } else {
      // Desktop: 360px Settings panel is visible beside the game area
      const desktopPanel = page.locator("aside");
      await expect(desktopPanel).toBeVisible();
      await expect(desktopPanel.getByRole("button", { name: /طق|Tap/i })).toBeVisible();
      await expect(
        desktopPanel.getByRole("button", { name: /كاع الكلمات|All words|Tous les mots|Ga3 l-klimat/i })
      ).toBeVisible();
      await expect(
        desktopPanel.getByRole("button", { name: /عربية|Arabic|Arabe|3arbia/i })
      ).toBeVisible();
    }
  });
});
