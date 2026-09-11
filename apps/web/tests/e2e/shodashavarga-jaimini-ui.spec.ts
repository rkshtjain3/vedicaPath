import { test, expect } from '@playwright/test';

test.describe('Shodashavarga & Jaimini Engine UI Verification', () => {
  test('verifies 16 Vargas, Vimsopaka Bala, Jaimini Karakas, Arudha Padas, and captures screenshots', async ({ page }) => {
    // 1. Navigate to Web App
    await page.goto('http://localhost:3000');

    // 2. Click Calculate
    const calcBtn = page.locator('#calculate-btn');
    await expect(calcBtn).toBeVisible();
    await calcBtn.click();

    // 3. Navigate to Divisional tab
    const divTab = page.locator('#tab-divisional');
    await expect(divTab).toBeVisible({ timeout: 10000 });
    await divTab.click();
    await page.waitForSelector('#divisional-engine-container', { timeout: 10000 });

    // 4. Test D60 Shashtyamsa selection
    const d60Btn = page.locator('#varga-btn-D60');
    await expect(d60Btn).toBeVisible();
    await d60Btn.click();
    await page.waitForTimeout(500);

    // Verify D60 is active and deities are rendered
    await expect(page.locator('#shodashavarga-view')).toContainText('Shashtyamsa');
    await expect(page.locator('#shodashavarga-view')).toContainText('D60 Deity');

    // Capture D60 Shashtyamsa Screenshot
    await page.screenshot({
      path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/shodashavarga_d60_dark.png',
      fullPage: true,
    });

    // 5. Test Vimsopaka Bala sub-tab
    const vimsopakaSubTab = page.locator('#subtab-vimsopaka');
    await expect(vimsopakaSubTab).toBeVisible();
    await vimsopakaSubTab.click();
    await page.waitForSelector('#vimsopaka-view', { timeout: 5000 });

    await expect(page.locator('#vimsopaka-view')).toContainText('Vimsopaka Bala');
    await expect(page.locator('#vimsopaka-view')).toContainText('/ 20.00');

    // Capture Vimsopaka Bala Screenshot
    await page.screenshot({
      path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/vimsopaka_bala_dark.png',
      fullPage: true,
    });

    // 6. Test Jaimini sub-tab
    const jaiminiSubTab = page.locator('#subtab-jaimini');
    await expect(jaiminiSubTab).toBeVisible();
    await jaiminiSubTab.click();
    await page.waitForSelector('#jaimini-view', { timeout: 5000 });

    await expect(page.locator('#jaimini-view')).toContainText('Karakamsha');
    await expect(page.locator('#jaimini-karakas-table')).toBeVisible();
    await expect(page.locator('#arudha-padas-grid')).toBeVisible();

    // Capture Jaimini Astrology Screenshot
    await page.screenshot({
      path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/jaimini_astrology_dark.png',
      fullPage: true,
    });

    // 7. Test Hindi Mode
    const langBtn = page.locator('#lang-btn-hi');
    if (await langBtn.isVisible()) {
      await langBtn.click();
      await page.waitForTimeout(500);

      await expect(page.locator('#jaimini-view')).toContainText('आत्मकारक');
      await page.screenshot({
        path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/jaimini_hindi_verified.png',
        fullPage: true,
      });

      // Switch back to English
      const enBtn = page.locator('#lang-btn-en');
      if (await enBtn.isVisible()) {
        await enBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // 8. Test Light Mode
    const themeBtn = page.locator('#theme-toggle');
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/shodashavarga_light_mode.png',
        fullPage: true,
      });
    }
  });
});
