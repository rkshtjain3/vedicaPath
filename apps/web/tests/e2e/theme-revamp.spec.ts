import { test, expect } from '@playwright/test';

test.describe('UI Theme Revamp & Light/Dark Mode Contrast Tests', () => {
  test('verifies light mode eliminates dark components and provides high-contrast readable content', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await page.goto('/');

    // 1. Initial State: Switch to Light Theme
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    await page.waitForTimeout(400);

    // Verify root html has class 'light'
    const isLight = await page.evaluate(() => document.documentElement.classList.contains('light'));
    expect(isLight).toBe(true);

    // 2. Selected Birth Location Card in Light Mode
    const locationSummary = page.locator('#selected-location-summary');
    await expect(locationSummary).toBeVisible();
    const locBg = await locationSummary.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    // Should be warm light cream/amber, not black/slate-950
    expect(locBg).not.toBe('rgb(2, 6, 23)'); // slate-950
    expect(locBg).not.toBe('rgb(15, 23, 42)'); // slate-900

    // 3. Compute chart via Contemporary Seeker (Rakshit Jain)
    const contemporaryBtn = page.locator('#sample-profile-contemporary');
    await expect(contemporaryBtn).toBeVisible();
    await contemporaryBtn.click();
    await page.waitForTimeout(800);

    // Wait for calculation to finish and switch to Life Navigator
    const lifeNavTab = page.locator('#tab-life-analysis');
    await expect(lifeNavTab).toBeVisible({ timeout: 15000 });
    await lifeNavTab.click();
    await page.waitForTimeout(400);

    const heroTrio = page.locator('#life-navigator-hero-trio');
    await expect(heroTrio).toBeVisible({ timeout: 15000 });

    // 4. Verify 7 Domain Cards in Light Mode
    const careerCard = page.locator('#domain-card-career');
    await expect(careerCard).toBeVisible();
    const cardBg = await careerCard.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    // Should be pure white (rgb(255, 255, 255))
    expect(cardBg).toBe('rgb(255, 255, 255)');

    const careerTitle = careerCard.locator('h3').first();
    const titleColor = await careerTitle.evaluate((el) => window.getComputedStyle(el).color);
    // Should be dark slate, not light gray/white
    expect(titleColor).toBe('rgb(15, 23, 42)');

    // 5. Verify Astrological Proof Drawer in Light Mode
    const proofBtn = page.locator('#btn-why-proof-career');
    if (await proofBtn.isVisible()) {
      await proofBtn.click();
      const modal = page.locator('#proof-drawer-modal');
      await expect(modal).toBeVisible();
      const modalBg = await modal.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      expect(modalBg).toBe('rgb(255, 255, 255)');
      
      const modalHeader = modal.locator('h2').first();
      const headerColor = await modalHeader.evaluate((el) => window.getComputedStyle(el).color);
      expect(headerColor).toBe('rgb(15, 23, 42)');

      await page.locator('#close-domain-modal').click();
      await page.waitForTimeout(300);
    }

    // 6. Verify Ask Vedica in Light Mode
    const queryTab = page.locator('#tab-query');
    await queryTab.click();
    await page.waitForTimeout(400);

    const askTitle = page.locator('h2:has-text("Ask Vedica")');
    await expect(askTitle).toBeVisible();
    const askTitleColor = await askTitle.evaluate((el) => window.getComputedStyle(el).color);
    // Must be dark slate (#0f172a)
    expect(askTitleColor).toBe('rgb(15, 23, 42)');

    // 7. Verify Timeline in Light Mode
    const timelineTab = page.locator('#tab-timeline');
    await timelineTab.click();
    await page.waitForTimeout(400);

    const timelineHeading = page.locator('h2:has-text("Vimshottari Dasha Hierarchy")');
    await expect(timelineHeading).toBeVisible();
    const headingColor = await timelineHeading.evaluate((el) => window.getComputedStyle(el).color);
    expect(headingColor).toBe('rgb(15, 23, 42)');

    // 8. Toggle Back to Dark Mode
    await themeToggle.click();
    await page.waitForTimeout(400);
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(isDark).toBe(true);
  });
});
