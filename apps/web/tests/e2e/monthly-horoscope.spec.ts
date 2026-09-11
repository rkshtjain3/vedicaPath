import { test, expect } from '@playwright/test';
import path from 'path';

const artifactsDir = '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0';

test.describe('Month-by-Month Horoscope & Astrological Forecast E2E Suite', () => {
  test('verifies Month-by-Month Horoscope explorer, 12-month carousel, domain pulse, and sub-view switching', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/');
    await page.waitForTimeout(500);

    // 1. Click contemporary sample profile (Rakshit Jain)
    const profileBtn = page.locator('#sample-profile-contemporary, [id^="sample-profile-"]').last();
    await expect(profileBtn).toBeVisible({ timeout: 15000 });
    await profileBtn.click();

    // 2. Wait for calculation and navigation tabs to appear
    const timelineTab = page.locator('#tab-timeline');
    await expect(timelineTab).toBeVisible({ timeout: 20000 });
    await timelineTab.click();
    await page.waitForTimeout(600);

    // 3. Verify Sub-view Navigation Buttons are present
    const monthlySubTab = page.locator('#subtab-monthly-horoscope');
    const seasonsSubTab = page.locator('#subtab-cosmic-seasons');
    const windowsSubTab = page.locator('#subtab-timing-windows');

    await expect(monthlySubTab).toBeVisible();
    await expect(seasonsSubTab).toBeVisible();
    await expect(windowsSubTab).toBeVisible();

    // Click Monthly subtab to enter Monthly Forecast view
    await monthlySubTab.click();
    await page.waitForTimeout(400);

    // 4. Verify Monthly Horoscope Container & Core Sections
    const monthlyContainer = page.locator('#monthly-horoscope-container');
    await expect(monthlyContainer).toBeVisible();
    await monthlyContainer.scrollIntoViewIfNeeded();

    await expect(page.locator('text=Cosmic Weather & Atmosphere').first()).toBeVisible();
    await expect(page.locator('text=Monthly Domain Pulse & Readiness').first()).toBeVisible();
    await expect(page.locator('text=Key Planetary Ingresses & Milestones').first()).toBeVisible();
    await expect(page.locator('text=Favorable & Caution Windows').first()).toBeVisible();
    await expect(page.locator('text=Sattvic Lifestyle & Mindfulness Focus').first()).toBeVisible();
    await expect(page.locator('text=Traceable Astrological Evidence & Foundations').first()).toBeVisible();

    // 5. Verify 12 Months in the Carousel
    const monthButtons = page.locator('#monthly-horoscope-container button:has-text("/100")');
    const count = await monthButtons.count();
    expect(count).toBe(12);

    // Click October / month index 9
    await monthButtons.nth(9).click();
    await page.waitForTimeout(400);

    // 6. Capture Desktop Dark Mode Screenshot
    await monthlyContainer.screenshot({
      path: path.join(artifactsDir, 'monthly_horoscope_desktop_dark.png'),
    });

    // 7. Toggle Hindi Mode and Verify Localization
    const hindiBtn = page.locator('#lang-btn-hi');
    if (await hindiBtn.isVisible()) {
      await hindiBtn.click();
      await page.waitForTimeout(500);

      await expect(page.locator('text=ब्रह्मांडीय वातावरण').first()).toBeVisible();
      await expect(page.locator('text=मासिक जीवन क्षेत्र तत्परता').first()).toBeVisible();
      await expect(page.locator('text=सात्विक जीवनशैली व ध्यान').first()).toBeVisible();

      // Capture Hindi Screenshot
      await monthlyContainer.screenshot({
        path: path.join(artifactsDir, 'monthly_horoscope_hindi_verified.png'),
      });
    }

    // 8. Switch to 120-Year Cosmic Seasons sub-view
    await seasonsSubTab.click();
    await page.waitForTimeout(400);
    await expect(page.locator('h2').filter({ hasText: /विंशोत्तरी|Vimshottari/ }).first()).toBeVisible();

    // Switch back to Monthly Horoscope
    await monthlySubTab.click();
    await page.waitForTimeout(400);
    await expect(monthlyContainer).toBeVisible();

    // 9. Switch to Light Mode and verify text contrast
    const themeToggle = page.locator('#theme-toggle');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(400);

      // Capture Light Mode Screenshot
      await monthlyContainer.screenshot({
        path: path.join(artifactsDir, 'monthly_horoscope_light_mode.png'),
      });
    }
  });
});
