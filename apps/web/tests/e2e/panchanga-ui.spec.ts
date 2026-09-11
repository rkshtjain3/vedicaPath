import { test, expect } from '@playwright/test';

test.describe('Panchanga UI E2E Tests', () => {
  test('renders 5 classical limbs of Panchanga, daily Muhurtha windows, Upagrahas, and evidence trace', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Click calculate button
    const calcBtn = page.locator('#calculate-btn');
    await expect(calcBtn).toBeVisible();
    await calcBtn.click();

    // Switch to Birth Chart tab
    const tabBirthChart = page.locator('#tab-birth-chart');
    await expect(tabBirthChart).toBeVisible({ timeout: 10000 });
    await tabBirthChart.click();

    // Verify Panchanga section is visible
    const panchangaSection = page.locator('#panchanga-section');
    await expect(panchangaSection).toBeVisible({ timeout: 5000 });

    // Verify all 5 Limbs are present in the limbs grid
    await expect(panchangaSection).toContainText('1. Tithi');
    await expect(panchangaSection).toContainText('2. Vara');
    await expect(panchangaSection).toContainText('3. Nakshatra');
    await expect(panchangaSection).toContainText('4. Yoga');
    await expect(panchangaSection).toContainText('5. Karana');

    // Verify Muhurtha windows
    await expect(panchangaSection).toContainText('Abhijit Muhurta');
    await expect(panchangaSection).toContainText('Brahma Muhurta');
    await expect(panchangaSection).toContainText('Rahu Kalam');
    await expect(panchangaSection).toContainText('Yamaganda');
    await expect(panchangaSection).toContainText('Gulika Kalam');

    // Verify Upagrahas
    await expect(panchangaSection).toContainText('Gulika:');
    await expect(panchangaSection).toContainText('Mandi:');

    // Scroll to Panchanga section and capture dark mode screenshot
    await panchangaSection.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/panchanga_desktop_dark.png',
      fullPage: false,
    });

    // Expand WHY evidence panel
    const evidenceBtn = page.locator('#panchanga-evidence-btn');
    await expect(evidenceBtn).toBeVisible();
    await evidenceBtn.click();

    const evidencePanel = page.locator('#why-evidence-panchanga');
    await expect(evidencePanel).toBeVisible();
    await expect(evidencePanel).toContainText('Classical Panchanga Evaluation');
    await expect(evidencePanel).toContainText('Tithi');
    await expect(evidencePanel).toContainText('Muhurtha & Daily Kaala Windows');

    // Test Hindi mode
    const langBtn = page.locator('#lang-btn-hi');
    if (await langBtn.isVisible()) {
      await langBtn.click();
      await page.waitForTimeout(300);
      await expect(panchangaSection).toContainText(/पञ्चाङ्ग/);
      await panchangaSection.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/panchanga_hindi_verified.png',
        fullPage: false,
      });
      // Switch back to English
      const enBtn = page.locator('#lang-btn-en');
      if (await enBtn.isVisible()) await enBtn.click();
      await page.waitForTimeout(300);
    }

    // Test Light mode
    const themeToggle = page.locator('#theme-toggle');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(400);
      await panchangaSection.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/panchanga_light_mode.png',
        fullPage: false,
      });
    }
  });
});
