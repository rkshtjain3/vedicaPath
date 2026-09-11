import { test, expect } from '@playwright/test';

test.describe('Phase 16 — Classical Yoga Engine E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Scenario 1: Calculates chart, navigates to Classical Yogas tab, and verifies 24 Yogas container', async ({ page }) => {
    await page.click('#calculate-btn');

    // Wait for calculation to finish and tab bar to appear
    const resultsTabs = page.locator('#results-tabs');
    await expect(resultsTabs).toBeVisible({ timeout: 30000 });

    // Click on Classical Yogas tab
    const yogaTab = page.locator('#tab-yogas');
    await expect(yogaTab).toBeVisible();
    await yogaTab.click();

    // Verify Yogas content container & header
    const yogaContent = page.locator('#yogas-content');
    await expect(yogaContent).toBeVisible();
    await expect(yogaContent).toContainText('Classical Yoga Engine');
    await expect(yogaContent).toContainText('personal-yoga-v1');

    // Verify Category Filter Buttons exist
    const categoryFilters = page.locator('#yoga-category-filters');
    await expect(categoryFilters).toBeVisible();
    await expect(categoryFilters).toContainText('All Categories');
    await expect(categoryFilters).toContainText('MAHAPURUSHA');
    await expect(categoryFilters).toContainText('RAJA');
    await expect(categoryFilters).toContainText('DHANA');
    await expect(categoryFilters).toContainText('LUNAR');
    await expect(categoryFilters).toContainText('SPECIAL');
  });

  test('Scenario 2: Toggles Category Filter Pills and verifies Yoga cards grid updates', async ({ page }) => {
    await page.click('#calculate-btn');

    const resultsTabs = page.locator('#results-tabs');
    await expect(resultsTabs).toBeVisible({ timeout: 30000 });

    const yogaTab = page.locator('#tab-yogas');
    await yogaTab.click();

    // Filter by MAHAPURUSHA
    const mahapurushaFilter = page.locator('#yoga-filter-mahapurusha');
    await expect(mahapurushaFilter).toBeVisible();
    await mahapurushaFilter.click();

    const grid = page.locator('#yogas-grid-container');
    await expect(grid).toContainText('Hamsa Yoga');
    await expect(grid).toContainText('Ruchaka Yoga');
    await expect(grid).toContainText('Bhadra Yoga');

    // Filter by SPECIAL
    const specialFilter = page.locator('#yoga-filter-special');
    await expect(specialFilter).toBeVisible();
    await specialFilter.click();

    await expect(grid).toContainText('Budha-Aditya Yoga');
    await expect(grid).toContainText('Neecha-Bhanga Raja Yoga');
  });

  test('Scenario 3: Toggles WHY button and verifies condition breakdown and evidence graph', async ({ page }) => {
    await page.click('#calculate-btn');

    const resultsTabs = page.locator('#results-tabs');
    await expect(resultsTabs).toBeVisible({ timeout: 30000 });

    const yogaTab = page.locator('#tab-yogas');
    await yogaTab.click();

    // Click Why button for Budha-Aditya Yoga
    const whyButton = page.locator('#yoga-why-BUDHA_ADITYA_YOGA');
    await expect(whyButton).toBeVisible();
    await whyButton.click();

    // Verify condition breakdown container displays PASS/FAIL and evidence
    const card = page.locator('#yoga-card-BUDHA_ADITYA_YOGA');
    await expect(card).toContainText('Evaluation Conditions');
    await expect(card).toContainText('BUDHA_ADITYA_CONJUNCTION');
  });
});
