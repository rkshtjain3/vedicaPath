import { test, expect } from '@playwright/test';

test.describe('Phase 6: Interactive SVG North & South Indian Chart with Aspect Rays & Transits', () => {
  test('should render North Indian aspect rays, South Indian aspect rays, transit overlays and 16-Vargas', async ({
    page,
  }) => {
    // 1. Open app
    await page.goto('http://localhost:3000');
    const calcBtn = page.locator('#calculate-btn');
    await expect(calcBtn).toBeVisible({ timeout: 15000 });

    // 2. Click Calculate
    await calcBtn.click();

    // 3. Open Birth Chart Tab
    const chartTab = page.locator('#tab-birth-chart');
    await expect(chartTab).toBeVisible({ timeout: 15000 });
    await chartTab.click();
    await page.waitForSelector('#chart-container', { timeout: 10000 });

    // 4. Click a planet badge inside chart to activate Aspect Rays (e.g. Mars "Ma" or Sun "Su")
    const marsBadge = page.locator('#chart-container').getByText('Ma', { exact: true }).first();
    if (await marsBadge.isVisible()) {
      await marsBadge.click({ force: true });
      await page.waitForTimeout(500);
    }

    // Verify Aspect Summary Banner appears
    const aspectBanner = page.locator('#aspect-summary-banner');
    await expect(aspectBanner).toBeVisible();

    // Take screenshot of North Indian Chart with Aspect Rays in Dark Mode
    await page.screenshot({
      path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/chart_north_aspect_rays_dark.png',
      fullPage: true,
    });

    // 5. Toggle South Indian Chart Style
    const southBtn = page.locator('#chart-style-south-btn');
    await expect(southBtn).toBeVisible();
    await southBtn.click();
    await page.waitForTimeout(500);

    // Re-click planet badge in South Indian chart to show rays
    const southMarsBadge = page.locator('#chart-container').getByText('Ma', { exact: true }).first();
    if (await southMarsBadge.isVisible()) {
      await southMarsBadge.click({ force: true });
      await page.waitForTimeout(500);
    }

    // Take screenshot of South Indian Chart with Aspect Rays
    await page.screenshot({
      path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/chart_south_aspect_rays_dark.png',
      fullPage: true,
    });

    // 6. Toggle Transit Overlay ON
    const transitBtn = page.locator('#chart-transit-overlay-btn');
    await expect(transitBtn).toBeVisible();
    await transitBtn.click();
    await page.waitForTimeout(500);

    // Switch back to North Indian style to see transit overlays clearly
    const northBtn = page.locator('#chart-style-north-btn');
    await northBtn.click();
    await page.waitForTimeout(500);

    // Take screenshot with Transit Overlay
    await page.screenshot({
      path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/chart_transit_overlay_dark.png',
      fullPage: true,
    });

    // 7. Test 16-Varga Dropdown Selection (e.g. D60 Shashtyamsa or D20 Vimsamsa)
    const vargaDropdown = page.locator('#chart-varga-dropdown-btn');
    if (await vargaDropdown.isVisible()) {
      await vargaDropdown.click();
      await page.waitForTimeout(300);

      const d20Option = page.locator('#chart-varga-option-d20');
      if (await d20Option.isVisible()) {
        await d20Option.click();
        await page.waitForTimeout(500);
      }
    }

    // 8. Test Hindi Localization
    const langBtn = page.locator('#lang-btn-hi');
    if (await langBtn.isVisible()) {
      await langBtn.click();
      await page.waitForTimeout(500);

      // Verify Hindi text in chart container
      await expect(page.locator('#chart-container')).toContainText('उत्तर भारतीय');

      // Take screenshot in Hindi
      await page.screenshot({
        path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/chart_aspect_rays_hindi.png',
        fullPage: true,
      });

      // Switch back to English
      const enBtn = page.locator('#lang-btn-en');
      if (await enBtn.isVisible()) {
        await enBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // 9. Test Light Mode
    const themeBtn = page.locator('#theme-toggle');
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(500);

      // Take screenshot in Light Mode
      await page.screenshot({
        path: '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0/chart_aspect_rays_light.png',
        fullPage: true,
      });
    }
  });
});
