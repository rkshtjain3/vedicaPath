import { test, expect } from '@playwright/test';

test.describe('Phase 8 — Planetary Strength & Relationship Engine E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Scenario 1: Calculates chart, navigates to Planet Strength tab, and verifies overview cards & comparison table', async ({ page }) => {
    await page.click('#calculate-btn');

    // Wait for API calculation to complete and tabs container to appear
    const resultsTabs = page.locator('#results-tabs');
    await expect(resultsTabs).toBeVisible({ timeout: 30000 });

    // Click on 7. PLANET STRENGTH tab
    const strengthTab = page.locator('#tab-strength');
    await expect(strengthTab).toBeVisible();
    await strengthTab.click();

    // Verify Strength content container
    const strengthContent = page.locator('#strength-content');
    await expect(strengthContent).toBeVisible();
    await expect(strengthContent).toContainText('Planetary Strength & Relationship Engine');

    // Verify Overview Cards Grid
    const cardsGrid = page.locator('#planet-strength-cards');
    await expect(cardsGrid).toBeVisible();
    await expect(cardsGrid).toContainText('Jupiter');
    await expect(cardsGrid).toContainText('Sun');

    // Verify Comparison Table
    const compTable = page.locator('#strength-comparison-table');
    await expect(compTable).toBeVisible();
    await expect(compTable).toContainText('Overall Strength');
    await expect(compTable).toContainText('D1 Dignity');
  });

  test('Scenario 2: Toggles WHY evidence button and verifies traceable factors and score contribution', async ({ page }) => {
    await page.click('#calculate-btn');

    const resultsTabs = page.locator('#results-tabs');
    await expect(resultsTabs).toBeVisible({ timeout: 30000 });

    const strengthTab = page.locator('#tab-strength');
    await expect(strengthTab).toBeVisible();
    await strengthTab.click();

    // Click WHY button for Jupiter
    const whyJupiter = page.locator('#why-strength-jupiter');
    await expect(whyJupiter).toBeVisible();
    await whyJupiter.click();

    // Verify expanded factors container displays evidence
    await expect(page.locator('#strength-content')).toContainText('Traceable Factors for Jupiter');
    await expect(page.locator('#strength-content')).toContainText('DIGNITY');
  });

  test('Scenario 3: Verifies Planetary Relationship Matrix and dropdown selector', async ({ page }) => {
    await page.click('#calculate-btn');

    const resultsTabs = page.locator('#results-tabs');
    await expect(resultsTabs).toBeVisible({ timeout: 30000 });

    const strengthTab = page.locator('#tab-strength');
    await expect(strengthTab).toBeVisible();
    await strengthTab.click();

    // Verify Relationship Section
    const relSection = page.locator('#relationship-matrix-section');
    await expect(relSection).toBeVisible();
    await expect(relSection).toContainText('Planetary Relationship Matrix (Panchadha Maitri)');

    // Change dropdown selector to Mars
    const select = page.locator('#relationship-planet-select');
    await expect(select).toBeVisible();
    await select.selectOption('Mars');

    // Verify cards update for Mars
    const relCards = page.locator('#relationship-cards');
    await expect(relCards).toBeVisible();
    await expect(relCards).toContainText('Mars →');
  });
});
