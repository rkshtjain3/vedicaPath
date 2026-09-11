import { test, expect } from '@playwright/test';

test.describe('Astrology Timing & Transits Tab E2E Test', () => {
  test('calculates chart, navigates to Timing & Transits tab, switches timeline domain, and expands evidence breakdown', async ({ page }) => {
    await page.goto('/');

    // Fill form
    await page.fill('input[type="date"]', '1992-05-15');
    await page.fill('input[type="time"]', '14:30');

    // Submit calculation
    await page.click('button[type="submit"]');

    // Wait for results tab
    await page.waitForSelector('#results-tabs', { timeout: 10000 });

    // Click "4. Timing & Transits" tab
    await page.click('#tab-timing');

    // Verify Timing content is visible
    const timingContent = page.locator('#timing-content');
    await expect(timingContent).toBeVisible();

    // Check version string metadata presence
    await expect(page.locator('text=personal-timing-v1').first()).toBeVisible();

    // Check current domain activity cards presence
    await expect(page.locator('h4:has-text("CAREER")')).toBeVisible();
    await expect(page.locator('h4:has-text("WEALTH")')).toBeVisible();

    // Switch timeline filter tab to WEALTH
    await page.click('#timeline-tab-wealth');

    // Expand [ WHY? ] button for the first timeline window
    const whyButton = page.locator('#why-window-0');
    await expect(whyButton).toBeVisible();
    await whyButton.click();

    // Verify evidence details expanded
    await expect(page.locator('h5:has-text("Multi-Level Dasha Domain Activation")')).toBeVisible();
    await expect(page.getByText('MAHADASHA', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('ANTARDASHA', { exact: true }).first()).toBeVisible();
  });
});
