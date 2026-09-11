import { test, expect } from '@playwright/test';

test.describe('Vedic Analyzer Calculation Flow, Analysis & Dasha Timeline', () => {
  test('should render form, calculate chart, navigate tabs, and verify Yoga condition breakdown', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#app-header')).toContainText('PERSONAL ASTROLOGY ANALYZER');

    await page.fill('#birth-date', '1996-09-23');
    await page.fill('#birth-time', '14:30:00');
    await page.fill('#city-search-input', 'New Delhi');

    await page.click('#calculate-btn');

    await expect(page.locator('#results-tabs')).toBeVisible({ timeout: 15000 });

    // 1. Positions Tab
    await expect(page.locator('#tab-astrology')).toBeVisible();
    await expect(page.locator('#planet-table')).toBeVisible();

    // 2. Analysis & Yogas Tab
    await page.click('#tab-analysis');
    await expect(page.locator('#analysis-content')).toBeVisible();
    await expect(page.locator('#subtab-yogas')).toBeVisible();

    // Check Yogas subtab
    await expect(page.locator('#yogas-list')).toBeVisible();
    await expect(page.getByText('Budha-Aditya Yoga')).toBeVisible();

    // Click [ Why? ] button on Budha-Aditya Yoga to verify condition breakdown
    const whyButton = page.locator('button:has-text("[ Why? ]")').first();
    await whyButton.click();
    await expect(page.getByText('Evaluated Conditions Breakdown:')).toBeVisible();

    // 3. Vimshottari Dasha Tab
    await page.click('#tab-dasha');
    await expect(page.locator('#dasha-content')).toBeVisible();
    await expect(page.getByText('Current Active Dasha')).toBeVisible();
    await expect(page.getByText('How was my starting Dasha calculated?')).toBeVisible();

    // 4. Numerology Tab
    await page.click('#tab-numerology');
    await expect(page.locator('#numerology-content')).toBeVisible();
  });
});
