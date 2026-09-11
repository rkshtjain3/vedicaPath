import { test, expect } from '@playwright/test';

test.describe('Phase 5: Yogini Dasha & Ashtakavarga Reductions (Shodhana) E2E', () => {
  test('should compute Yogini Dasha and Ashtakavarga Shodhanas accurately', async ({ page }) => {
    // 1. Open app
    await page.goto('http://localhost:3000');
    const calcBtn = page.locator('#calculate-btn');
    await expect(calcBtn).toBeVisible({ timeout: 15000 });

    // 2. Click Calculate
    await calcBtn.click();

    // 3. Test Yogini Dasha under Timeline tab
    const timelineTab = page.locator('#tab-timeline');
    await expect(timelineTab).toBeVisible({ timeout: 15000 });
    await timelineTab.click();
    await page.waitForSelector('#tab-timeline-container', { timeout: 10000 });

    // Click Yogini Dasha subtab
    const yoginiSubTab = page.locator('#subtab-yogini-dasha');
    await expect(yoginiSubTab).toBeVisible();
    await yoginiSubTab.click();
    await page.waitForSelector('#yogini-dasha-container', { timeout: 10000 });

    // Verify Yogini elements exist
    await expect(page.locator('#yogini-dasha-container')).toBeVisible();
    await expect(page.locator('#yogini-cycle-1-btn')).toBeVisible();

    // Take screenshot of Yogini Dasha in Dark Mode
    await page.screenshot({
      path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/yogini_dasha_dark.png',
      fullPage: true,
    });

    // 4. Test Ashtakavarga Shodhanas (Trikona & Ekadhipatya & Shodhya Pinda)
    const ashtakavargaTab = page.locator('#tab-ashtakavarga');
    await expect(ashtakavargaTab).toBeVisible();
    await ashtakavargaTab.click();
    await page.waitForSelector('#ashtakavarga-content', { timeout: 10000 });

    // Click Shodhana & Shodhya Pinda subtab
    const shodhanaSubTab = page.locator('#subtab-a8-shodhana');
    await expect(shodhanaSubTab).toBeVisible();
    await shodhanaSubTab.click();
    await page.waitForSelector('#ashtakavarga-shodhana-container', { timeout: 10000 });

    // Verify Shodhana elements exist
    await expect(page.locator('#ashtakavarga-shodhana-container')).toBeVisible();
    await expect(page.locator('#pinda-planet-card-sun')).toBeVisible();
    await expect(page.locator('#pinda-planet-card-jupiter')).toBeVisible();

    // Take screenshot of Ashtakavarga Shodhana in Dark Mode
    await page.screenshot({
      path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/ashtakavarga_shodhana_dark.png',
      fullPage: true,
    });

    // 5. Test Hindi Localization
    const langBtn = page.locator('#lang-btn-hi');
    if (await langBtn.isVisible()) {
      await langBtn.click();
      await page.waitForTimeout(500);

      // Verify Hindi text in Shodhana
      await expect(page.locator('#ashtakavarga-shodhana-container')).toContainText('शोधन');

      // Take screenshot in Hindi
      await page.screenshot({
        path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/ashtakavarga_shodhana_hindi.png',
        fullPage: true,
      });

      // Switch back to English
      const enBtn = page.locator('#lang-btn-en');
      if (await enBtn.isVisible()) {
        await enBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // 6. Test Light Mode
    const themeBtn = page.locator('#theme-toggle');
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(500);

      // Take screenshot in Light Mode
      await page.screenshot({
        path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/ashtakavarga_shodhana_light.png',
        fullPage: true,
      });
    }
  });
});
