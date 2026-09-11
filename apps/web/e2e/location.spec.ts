import { test, expect } from '@playwright/test';

test.describe('Phase 6C — Birth Location Resolution & Manual Override E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Scenario 1: Resolves India (Panipat, Haryana) automatically and calculates chart', async ({ page }) => {
    // Select Country India
    await page.selectOption('#country-select', 'IN');

    // Type Panipat in city search input
    await page.fill('#city-search-input', 'Panipat');

    // Wait for city results dropdown and click Panipat result
    const resultBtn = page.locator('#city-search-results button').first();
    await expect(resultBtn).toBeVisible({ timeout: 10000 });
    await resultBtn.click();

    // Verify selected location summary card
    const summaryCard = page.locator('#selected-location-summary');
    await expect(summaryCard).toContainText('Panipat');
    await expect(summaryCard).toContainText('Asia/Kolkata');

    // Expand Advanced details to verify resolved coordinates
    const advancedToggle = page.getByText('Advanced Location Details & Manual Override');
    await advancedToggle.click();

    const latInput = page.locator('#latitude');
    const lonInput = page.locator('#longitude');
    const tzInput = page.locator('#timezone');

    await expect(latInput).toHaveValue(/29\./);
    await expect(lonInput).toHaveValue(/76\./);
    await expect(tzInput).toHaveValue('Asia/Kolkata');

    // Submit calculation form
    await page.click('#calculate-btn');

    // Verify successful chart calculation results
    await expect(page.locator('#app-header')).toBeVisible();
    await expect(page.locator('h1, h2')).toContainText(/PERSONAL ASTROLOGY ANALYZER|ASTROLOGICAL ANALYSIS/i);
  });

  test('Scenario 2: Resolves United States (New York) automatically with America/New_York', async ({ page }) => {
    await page.selectOption('#country-select', 'US');
    await page.fill('#city-search-input', 'New York');

    const resultBtn = page.locator('#city-search-results button').filter({ hasText: 'New York' }).first();
    await expect(resultBtn).toBeVisible({ timeout: 10000 });
    await resultBtn.click();

    const summaryCard = page.locator('#selected-location-summary');
    await expect(summaryCard).toContainText('New York');
    await expect(summaryCard).toContainText('America/New_York');

    await page.click('#calculate-btn');
    await expect(page.locator('body')).not.toContainText('An unexpected error occurred');
  });

  test('Scenario 3: Displays multiple options for ambiguous city search (e.g. Springfield)', async ({ page }) => {
    await page.selectOption('#country-select', 'US');
    await page.fill('#city-search-input', 'Springfield');

    const resultsDropdown = page.locator('#city-search-results');
    await expect(resultsDropdown).toBeVisible({ timeout: 10000 });

    const resultButtons = page.locator('#city-search-results button');
    const count = await resultButtons.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('Scenario 4: Enables manual coordinate override mode with warning banner', async ({ page }) => {
    const advancedToggle = page.getByText('Advanced Location Details & Manual Override');
    await advancedToggle.click();

    const manualCheckbox = page.locator('#manual-override-checkbox');
    await manualCheckbox.check();

    // Verify warning banner appears
    await expect(
      page.getByText('Warning: Manual location values may produce incorrect astrology calculations if they are inaccurate.')
    ).toBeVisible();

    // Verify latitude input is now editable
    const latInput = page.locator('#latitude');
    await expect(latInput).not.toHaveAttribute('readonly');

    await latInput.fill('27.1751');
    await page.fill('#longitude', '78.0421');
    await page.fill('#timezone', 'Asia/Kolkata');

    await page.click('#calculate-btn');
    await expect(page.locator('#selected-location-summary')).toContainText('27.1751');
  });
});
