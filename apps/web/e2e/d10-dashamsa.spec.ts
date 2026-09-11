import { test, expect } from '@playwright/test';

test.describe('Phase 9 — D10 Dashamsa & Career Cross-Chart E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Scenario 1: Navigates to D10 Dashamsa sub-tab and verifies D10 comparison table', async ({ page }) => {
    await page.fill('#dob-input', '1990-01-01');
    await page.fill('#tob-input', '10:30');
    await page.click('#calculate-btn');

    // Click 6. Divisional Charts tab
    const divisionalTab = page.locator('#tab-divisional');
    await expect(divisionalTab).toBeVisible({ timeout: 10000 });
    await divisionalTab.click();

    // Verify sub-tabs selector
    const subtabs = page.locator('#divisional-subtabs');
    await expect(subtabs).toBeVisible();

    // Click D10 Dashamsa sub-tab
    const d10Subtab = page.locator('#subtab-d10');
    await expect(d10Subtab).toBeVisible();
    await d10Subtab.click();

    // Verify D10 view & comparison table
    const d10View = page.locator('#d10-view');
    await expect(d10View).toBeVisible();
    await expect(d10View).toContainText('Divisional Charts Engine — D10 Dashamsa');

    const d10Table = page.locator('#d10-comparison-table');
    await expect(d10Table).toBeVisible();
    await expect(d10Table).toContainText('D1 Sign');
    await expect(d10Table).toContainText('D10 Sign');
    await expect(d10Table).toContainText('Same D1/D10 Sign');
  });

  test('Scenario 2: Navigates to Career Cross-Chart sub-tab and expands WHY calculation trace', async ({ page }) => {
    await page.fill('#dob-input', '1990-01-01');
    await page.fill('#tob-input', '10:30');
    await page.click('#calculate-btn');

    const divisionalTab = page.locator('#tab-divisional');
    await expect(divisionalTab).toBeVisible({ timeout: 10000 });
    await divisionalTab.click();

    // Click Career Cross-Chart Facts sub-tab
    const careerSubtab = page.locator('#subtab-career');
    await expect(careerSubtab).toBeVisible();
    await careerSubtab.click();

    // Verify Career view, summary cards, and planet matrix
    const careerView = page.locator('#career-cross-chart-view');
    await expect(careerView).toBeVisible();
    await expect(careerView).toContainText('Career Cross-Chart Facts');

    const summaryCards = page.locator('#career-cross-chart-summary');
    await expect(summaryCards).toBeVisible();
    await expect(summaryCards).toContainText('D1 10th House');
    await expect(summaryCards).toContainText('D10 10th House');

    const careerTable = page.locator('#career-cross-chart-table');
    await expect(careerTable).toBeVisible();

    // Click WHY button for Sun
    const whySunBtn = page.locator('#why-career-sun');
    await expect(whySunBtn).toBeVisible();
    await whySunBtn.click();

    // Verify expanded WHY evidence container
    const whyEvidencePanel = page.locator('#why-career-evidence-Sun');
    await expect(whyEvidencePanel).toBeVisible();
    await expect(whyEvidencePanel).toContainText('Traceable Calculation Logic for Sun');
  });
});
