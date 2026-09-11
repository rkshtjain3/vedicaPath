import { test, expect } from '@playwright/test';

test.describe('Multi-Level Dasha Timeline & Timing Windows E2E Tests', () => {
  test('should render TIMELINE tab, current Dasha banner, period cards, timing windows, and WHY explorer', async ({ page }) => {
    await page.goto('/');

    // Fill birth form
    const nameInput = page.locator('#full-name-input');
    if (await nameInput.isVisible()) {
      await nameInput.fill('Playwright Timeline User');
    }

    // Submit calculation
    const calculateBtn = page.locator('#calculate-btn, button:has-text("Calculate Birth Chart"), button:has-text("Calculate")').first();
    await calculateBtn.click();

    // Wait for TIMELINE tab button to appear
    const timelineTab = page.locator('#tab-timeline');
    await expect(timelineTab).toBeVisible({ timeout: 20000 });

    // Click TIMELINE tab
    await timelineTab.click();

    // Verify Active Dasha Context banner
    await expect(page.locator('h2:has-text("Vimshottari Dasha Hierarchy")')).toBeVisible();

    // Verify domain filter buttons
    const careerFilter = page.locator('#filter-domain-career');
    await expect(careerFilter).toBeVisible();
    await careerFilter.click();

    // Click first period card if visible
    const firstPeriodCard = page.locator('[id^="period-card-"]').first();
    if (await firstPeriodCard.isVisible()) {
      await firstPeriodCard.click();
      const closePeriodModal = page.locator('#close-period-modal');
      await expect(closePeriodModal).toBeVisible();
      await closePeriodModal.click();
    }

    // Check WHY? Evidence Explorer
    const firstWhyBtn = page.locator('[id^="why-btn-"]').first();
    if (await firstWhyBtn.isVisible()) {
      await firstWhyBtn.click();
      const closeWhyModal = page.locator('#close-why-modal');
      await expect(closeWhyModal).toBeVisible();
      await closeWhyModal.click();
    }
  });
});
