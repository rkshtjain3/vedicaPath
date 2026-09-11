import { test, expect } from '@playwright/test';

test.describe('Shadbala UI E2E Tests', () => {
  test('should calculate and render complete 6-fold Shadbala with all 6 components, strength ratios, and evidence trace', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Click calculate button
    const calcBtn = page.locator('#calculate-btn');
    await expect(calcBtn).toBeVisible();
    await calcBtn.click();

    // Switch to Planetary Strength tab (tab-strength)
    const tabStrength = page.locator('#tab-strength');
    await expect(tabStrength).toBeVisible({ timeout: 10000 });
    await tabStrength.click();

    // Verify 9. SHADBALA section is visible
    const shadbalaSection = page.locator('#shadbala-section');
    await expect(shadbalaSection).toBeVisible({ timeout: 5000 });

    // Verify Status Badge shows COMPLETE
    const statusBadge = page.locator('#shadbala-status-badge');
    await expect(statusBadge).toBeVisible();
    await expect(statusBadge).toContainText(/COMPLETE/i);

    // Verify all 6 components are displayed in the planet cards
    await expect(shadbalaSection).toContainText('1. Sthana Bala');
    await expect(shadbalaSection).toContainText('2. Dig Bala');
    await expect(shadbalaSection).toContainText('3. Kaala Bala');
    await expect(shadbalaSection).toContainText('4. Cheshta Bala');
    await expect(shadbalaSection).toContainText('5. Naisargika');
    await expect(shadbalaSection).toContainText('6. Drik Bala');

    // Scroll to Shadbala section
    await shadbalaSection.scrollIntoViewIfNeeded();

    // Screenshot desktop dark mode
    await page.screenshot({
      path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/shadbala_complete_dark.png',
      fullPage: false,
    });

    // Verify WHY button for Sun
    const sunWhyBtn = page.locator('#why-btn-shadbala-sun');
    await expect(sunWhyBtn).toBeVisible();
    await sunWhyBtn.click();

    // Verify evidence panel opens with 6-fold breakdown
    const sunEvidence = page.locator('#why-evidence-shadbala-sun');
    await expect(sunEvidence).toBeVisible();
    await expect(sunEvidence).toContainText('Classical Shadbala Trace for Sun');
    await expect(sunEvidence).toContainText('Kaala Bala');
    await expect(sunEvidence).toContainText('Drik Bala');

    // Test Hindi mode
    const langBtn = page.locator('#lang-btn-hi');
    if (await langBtn.isVisible()) {
      await langBtn.click();
      await page.waitForTimeout(300);
      await expect(shadbalaSection).toContainText(/षड्बल/);
      await shadbalaSection.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/shadbala_complete_hindi.png',
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
      await shadbalaSection.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/shadbala_complete_light.png',
        fullPage: false,
      });
    }
  });
});
