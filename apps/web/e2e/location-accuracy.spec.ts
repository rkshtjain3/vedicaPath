import { test, expect } from '@playwright/test';

test.describe('Phase 6D — Real-World Accuracy & Historical Time E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Scenario 1: Differentiates London UK vs London Ontario Canada', async ({ page }) => {
    // Search London in Canada
    await page.selectOption('#country-select', 'CA');
    await page.fill('#city-search-input', 'London');

    const caResult = page.locator('#city-search-results button').first();
    await expect(caResult).toBeVisible({ timeout: 10000 });
    await caResult.click();

    const summaryCard = page.locator('#selected-location-summary');
    await expect(summaryCard).toContainText('London');
    await expect(summaryCard).toContainText('America/Toronto');

    // Search London in UK
    await page.selectOption('#country-select', 'GB');
    await page.fill('#city-search-input', 'London');

    const ukResult = page.locator('#city-search-results button').first();
    await expect(ukResult).toBeVisible({ timeout: 10000 });
    await ukResult.click();

    await expect(summaryCard).toContainText('Europe/London');
  });

  test('Scenario 2: Displays DST ambiguous prompt for duplicate local time', async ({ page }) => {
    await page.selectOption('#country-select', 'US');
    await page.fill('#city-search-input', 'New York');
    const nyBtn = page.locator('#city-search-results button').first();
    await expect(nyBtn).toBeVisible();
    await nyBtn.click();

    // Set date to 2026-11-01 (DST fall-back day) and time 01:30
    await page.fill('#dob-input', '2026-11-01');
    await page.fill('#tob-input', '01:30');

    await page.click('#calculate-btn');

    const prompt = page.locator('#dst-ambiguous-prompt');
    await expect(prompt).toBeVisible({ timeout: 10000 });
    await expect(prompt).toContainText(/occurred more than once/i);
  });

  test('Scenario 3: Blocks calculation for non-existent DST spring-forward time', async ({ page }) => {
    await page.selectOption('#country-select', 'US');
    await page.fill('#city-search-input', 'New York');
    const nyBtn = page.locator('#city-search-results button').first();
    await expect(nyBtn).toBeVisible();
    await nyBtn.click();

    // Set date to 2026-03-08 (DST spring-forward day) and time 02:30
    await page.fill('#dob-input', '2026-03-08');
    await page.fill('#tob-input', '02:30');

    await page.click('#calculate-btn');

    const errorBanner = page.locator('#dst-non-existent-banner');
    await expect(errorBanner).toBeVisible({ timeout: 10000 });
    await expect(errorBanner).toContainText(/did not exist due to a daylight-saving transition/i);
  });

  test('Scenario 4: Calculates chart and renders Calculation Audit Details & Fingerprint', async ({ page }) => {
    await page.click('#calculate-btn');

    const auditContainer = page.locator('#calculation-audit-details');
    await expect(auditContainer).toBeVisible({ timeout: 10000 });

    // Expand details
    await auditContainer.locator('button').click();

    const fpDisplay = page.locator('#input-fingerprint-display');
    const reprDisplay = page.locator('#reproducibility-hash-display');

    await expect(fpDisplay).toBeVisible();
    await expect(reprDisplay).toBeVisible();

    const initialFp = await fpDisplay.textContent();
    expect(initialFp?.length).toBeGreaterThan(10);
  });
});
