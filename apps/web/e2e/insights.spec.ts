import { test, expect } from '@playwright/test';

test.describe('Astrology Insights & Explanations Tab E2E Test', () => {
  test('calculates chart, navigates to 5. Insights tab, verifies domain cards, and expands [ WHY AM I SEEING THIS? ] breakdown', async ({ page }) => {
    await page.goto('/');

    // Fill form
    await page.fill('input[type="date"]', '1992-05-15');
    await page.fill('input[type="time"]', '14:30');

    // Submit calculation
    await page.click('button[type="submit"]');

    // Wait for results tab bar to render
    await page.waitForSelector('#results-tabs', { timeout: 15000 });

    // Click on "5. Insights" tab
    const insightsTab = page.locator('#tab-interpretation');
    await expect(insightsTab).toBeVisible();
    await insightsTab.click();

    // Verify Interpretation content is displayed
    const interpretationContent = page.locator('#interpretation-content');
    await expect(interpretationContent).toBeVisible();

    // Check version string metadata presence
    await expect(page.locator('text=personal-interpretation-v1').first()).toBeVisible();

    // Check domain insight cards presence
    await expect(page.locator('#insight-card-career')).toBeVisible();
    await expect(page.locator('#insight-card-wealth')).toBeVisible();
    await expect(page.locator('#insight-card-relationships')).toBeVisible();
    await expect(page.locator('#insight-card-property')).toBeVisible();

    // Expand CAREER explanation panel
    const careerWhyBtn = page.locator('#why-insights-career');
    await expect(careerWhyBtn).toBeVisible();
    await careerWhyBtn.click();

    // Verify explanation details revealed
    await expect(page.locator('text=Explanation & Evidence Breakdown').first()).toBeVisible();
    await expect(page.locator('text=Confidence Model Rationale').first()).toBeVisible();
    await expect(page.locator('text=Source Astrological Rules & Transits').first()).toBeVisible();
  });
});
