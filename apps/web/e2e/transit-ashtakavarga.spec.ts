import { test, expect } from '@playwright/test';

test.describe('Phase 11 — Ashtakavarga-Aware Transit Analysis E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Scenario 1: Calculates chart, navigates to TIMING & TRANSITS tab, and verifies Transit Ashtakavarga section', async ({ page }) => {
    await page.fill('#dob-input', '1990-05-15');
    await page.fill('#tob-input', '14:30');
    await page.click('#calculate-btn');

    // Click TIMING & TRANSITS tab
    const timingTab = page.locator('#tab-timing');
    await expect(timingTab).toBeVisible({ timeout: 10000 });
    await timingTab.click();

    // Verify main timing container and Transit Ashtakavarga section
    const timingContent = page.locator('#timing-content');
    await expect(timingContent).toBeVisible();

    const transitA8Section = page.locator('#transit-ashtakavarga-section');
    await expect(transitA8Section).toBeVisible();
    await expect(transitA8Section).toContainText('TRANSIT ASHTAKAVARGA CONTEXT');
    await expect(transitA8Section).toContainText('Neutral factual bindu evidence for transiting planets');
  });

  test('Scenario 2: Verifies Jupiter and Saturn transit Ashtakavarga cards & neutral position pills', async ({ page }) => {
    await page.fill('#dob-input', '1990-05-15');
    await page.fill('#tob-input', '14:30');
    await page.click('#calculate-btn');

    const timingTab = page.locator('#tab-timing');
    await expect(timingTab).toBeVisible({ timeout: 10000 });
    await timingTab.click();

    // Jupiter Card Checks
    const jupiterCard = page.locator('#transit-a8-card-jupiter');
    await expect(jupiterCard).toBeVisible();
    await expect(jupiterCard).toContainText('JUPITER TRANSIT');
    await expect(jupiterCard).toContainText('JUPITER BAV');
    await expect(jupiterCard).toContainText('Sign SAV');
    await expect(jupiterCard).toContainText('CHART AVERAGE');

    // Saturn Card Checks
    const saturnCard = page.locator('#transit-a8-card-saturn');
    await expect(saturnCard).toBeVisible();
    await expect(saturnCard).toContainText('SATURN TRANSIT');
    await expect(saturnCard).toContainText('SATURN BAV');
    await expect(saturnCard).toContainText('Sign SAV');
    await expect(saturnCard).toContainText('CHART AVERAGE');
  });

  test('Scenario 3: Expands WHY evidence panel for Jupiter and inspects traceable evidence lines', async ({ page }) => {
    await page.fill('#dob-input', '1990-05-15');
    await page.fill('#tob-input', '14:30');
    await page.click('#calculate-btn');

    const timingTab = page.locator('#tab-timing');
    await expect(timingTab).toBeVisible({ timeout: 10000 });
    await timingTab.click();

    const whyBtnJupiter = page.locator('#why-btn-jupiter');
    await expect(whyBtnJupiter).toBeVisible();
    await whyBtnJupiter.click();

    const jupiterEvidencePanel = page.locator('#why-evidence-panel-jupiter');
    await expect(jupiterEvidencePanel).toBeVisible();
    await expect(jupiterEvidencePanel).toContainText('JUPITER Transit Ashtakavarga Traceable Evidence');
    await expect(jupiterEvidencePanel).toContainText('Transit Planet: JUPITER');
    await expect(jupiterEvidencePanel).toContainText('Natal JUPITER BAV Chart Average');
    await expect(jupiterEvidencePanel).toContainText('Natal SAV Chart Average');
  });
});
