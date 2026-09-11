import { test, expect } from '@playwright/test';

test.describe('Phase 7 — Divisional Charts Engine & Navamsa (D9) Analysis E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Scenario 1: Calculates chart, navigates to Divisional Charts tab, and verifies D9 Navamsa display', async ({ page }) => {
    // Fill birth details
    await page.fill('#dob-input', '1990-01-01');
    await page.fill('#tob-input', '10:30');

    await page.click('#calculate-btn');

    // Click on 6. Divisional Charts tab
    const divisionalTab = page.locator('#tab-divisional');
    await expect(divisionalTab).toBeVisible({ timeout: 10000 });
    await divisionalTab.click();

    // Verify D9 Divisional content container
    const divisionalContent = page.locator('#divisional-content');
    await expect(divisionalContent).toBeVisible();
    await expect(divisionalContent).toContainText('Divisional Charts Engine — D9 Navamsa');

    // Verify Vargottama section
    const vargottamaSection = page.locator('#vargottama-section');
    await expect(vargottamaSection).toBeVisible();
    await expect(vargottamaSection).toContainText('Ascendant');

    // Verify D9 comparison table
    const d9Table = page.locator('#d9-comparison-table');
    await expect(d9Table).toBeVisible();
    await expect(d9Table).toContainText('D1 Sign');
    await expect(d9Table).toContainText('D9 Sign');
  });

  test('Scenario 2: Recalculating with new birth time updates D9 Navamsa chart results', async ({ page }) => {
    await page.fill('#dob-input', '1990-01-01');
    await page.fill('#tob-input', '06:00');
    await page.click('#calculate-btn');

    const divisionalTab = page.locator('#tab-divisional');
    await expect(divisionalTab).toBeVisible({ timeout: 10000 });
    await divisionalTab.click();

    const d9Table = page.locator('#d9-comparison-table');
    await expect(d9Table).toBeVisible();
    const initialText = await d9Table.textContent();

    // Update birth time to 18:00
    await page.fill('#tob-input', '18:00');
    await page.click('#calculate-btn');

    await divisionalTab.click();
    await expect(d9Table).toBeVisible();
    const updatedText = await d9Table.textContent();

    // D9 planet/lagna positions should recalculate
    expect(updatedText).not.toEqual(initialText);
  });
});
