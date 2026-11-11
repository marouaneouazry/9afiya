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

  test("Play starts a game, shows only playing elements, and stops", async ({
    page,
  }) => {
    await page.goto("/");

    // Click Play to enter game
    const playBtn = page.getByRole("link", { name: /بدا|Play|Jouer|Bda/i });
    await playBtn.click();
    await expect(page).toHaveURL(/\/play\/classic/);

    // Before start: placeholder "؟" and instruction sentence
    await expect(page.getByText("؟")).toBeVisible();
    const startBtn = page.getByRole("button", { name: /بدا|Start|Lancer|Bda/i });
    await expect(startBtn).toBeVisible();

    // Start session
    await startBtn.click();

    // Playing screen: bar counter is visible
    await expect(page.getByText(/البار|Bar|Mesure/i)).toBeVisible();

    // Target hint is visible
    await expect(
      page.getByText(/سالي بهاد القافية|Land this rhyme|Place cette rime|Sali b had/i)
    ).toBeVisible();

    // Four beat dots visualizer
    const beatDots = page.locator('[role="progressbar"]');
    await expect(beatDots).toBeVisible();

    // Stop button is visible
    const stopBtn = page.getByRole("button", { name: /وقّف|Stop|Arrêter|Wa99ef/i });
    await expect(stopBtn).toBeVisible();

    // Clicking Stop returns to ready state
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

      // Beat styles are visible inside settings
      await expect(sheet.getByRole("button", { name: "Boom Bap" })).toBeVisible();
      await expect(sheet.getByRole("button", { name: "Chaabi" })).toBeVisible();
      await expect(sheet.getByRole("button", { name: "Lofi" })).toBeVisible();

      // Click Done button to close
      const doneBtn = sheet.getByRole("button", { name: /تم|Done|OK|Tem/i });
      await doneBtn.click();

      // Dialog is closed
      await expect(sheet).not.toBeVisible();
    } else {
      // Desktop: 360px Settings panel is visible beside the game area
      const desktopPanel = page.locator("aside");
      await expect(desktopPanel).toBeVisible();
      await expect(
        desktopPanel.getByRole("button", { name: "Boom Bap" })
      ).toBeVisible();
      await expect(
        desktopPanel.getByRole("button", { name: "Chaabi" })
      ).toBeVisible();
      await expect(
        desktopPanel.getByRole("button", { name: "Lofi" })
      ).toBeVisible();
    }
  });
});

