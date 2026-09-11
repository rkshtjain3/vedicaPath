import { test, expect } from '@playwright/test';

test.describe('Phase 10 — Ashtakavarga Engine (BAV & SAV) E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Scenario 1: Calculates chart, navigates to Ashtakavarga tab, and verifies SAV validation badge', async ({ page }) => {
    await page.fill('#dob-input', '1990-05-15');
    await page.fill('#tob-input', '14:30');
    await page.click('#calculate-btn');

    // Click 8. ASHTAKAVARGA tab
    const ashtakavargaTab = page.locator('#tab-ashtakavarga');
    await expect(ashtakavargaTab).toBeVisible({ timeout: 10000 });
    await ashtakavargaTab.click();

    // Verify main content container
    const content = page.locator('#ashtakavarga-content');
    await expect(content).toBeVisible();
    await expect(content).toContainText('Ashtakavarga Engine — BAV & SAV Foundation');

    // Verify validation badge
    const valBadge = page.locator('#sav-validation-badge');
    await expect(valBadge).toBeVisible();
    await expect(valBadge).toContainText('[ VALIDATED ] SAV Total: 337');
  });

  test('Scenario 2: Navigates to BAV sub-tab, selects planet & sign, and inspects WHY evidence panel', async ({ page }) => {
    await page.fill('#dob-input', '1990-05-15');
    await page.fill('#tob-input', '14:30');
    await page.click('#calculate-btn');

    const ashtakavargaTab = page.locator('#tab-ashtakavarga');
    await expect(ashtakavargaTab).toBeVisible({ timeout: 10000 });
    await ashtakavargaTab.click();

    // Click BAV sub-tab
    const bavSubtab = page.locator('#subtab-a8-bav');
    await expect(bavSubtab).toBeVisible();
    await bavSubtab.click();

    // Verify planet selector & matrix table
    const planetSelect = page.locator('#bav-planet-select');
    await expect(planetSelect).toBeVisible();
    await expect(planetSelect).toContainText('Select Target Planet');

    const matrixTable = page.locator('#bav-matrix-table');
    await expect(matrixTable).toBeVisible();

    // Click bindu button for JUPITER in Aries
    const whyJupiterAries = page.locator('#why-bindu-jupiter-aries');
    await expect(whyJupiterAries).toBeVisible();
    await whyJupiterAries.click();

    // Verify WHY evidence panel
    const evidencePanel = page.locator('#why-bindu-evidence');
    await expect(evidencePanel).toBeVisible();
    await expect(evidencePanel).toContainText('Traceable Contributor Logic for JUPITER in Aries');
    await expect(evidencePanel).toContainText('Lagna');
    await expect(evidencePanel).toContainText('Sun');
    await expect(evidencePanel).toContainText('Moon');
  });

  test('Scenario 3: Navigates to SAV sub-tab and verifies 12-sign distribution bars & full matrix', async ({ page }) => {
    await page.fill('#dob-input', '1990-05-15');
    await page.fill('#tob-input', '14:30');
    await page.click('#calculate-btn');

    const ashtakavargaTab = page.locator('#tab-ashtakavarga');
    await expect(ashtakavargaTab).toBeVisible({ timeout: 10000 });
    await ashtakavargaTab.click();

    // Click SAV sub-tab
    const savSubtab = page.locator('#subtab-a8-sav');
    await expect(savSubtab).toBeVisible();
    await savSubtab.click();

    // Verify SAV bars & matrix table
    const savBars = page.locator('#sav-bars');
    await expect(savBars).toBeVisible();
    await expect(savBars).toContainText('Aries');
    await expect(savBars).toContainText('Pisces');

    const savMatrix = page.locator('#sav-matrix-table');
    await expect(savMatrix).toBeVisible();
    await expect(savMatrix).toContainText('SAV TOTAL');
    await expect(savMatrix).toContainText('337');
  });
});
