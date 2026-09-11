import { test, expect } from '@playwright/test';

test.describe('Phase 15 — Real JHora Benchmark Dashboard & Detail E2E Suite', () => {
  test('loads benchmark dashboard and lists all 12 JHora scenario cases', async ({ page }) => {
    await page.goto('/benchmark');

    // Wait for data fetching to complete
    await expect(page.getByText('Loading benchmark engine statistics...')).not.toBeVisible({ timeout: 10000 });

    // Check title
    await expect(page.locator('h1')).toContainText('Benchmark');

    // Check presence of JHora cases table
    await expect(page.getByText('Real Jagannatha Hora (JHora) Benchmark Suite')).toBeVisible();
    await expect(page.getByText('JHORA-001')).toBeVisible();
    await expect(page.getByText('JHORA-012')).toBeVisible();

    // Check export and import controls
    await expect(page.locator('#export-dataset-btn')).toBeVisible();
    await expect(page.locator('#import-dataset-label')).toBeVisible();
  });

  test('navigates to JHORA-001 detail page and displays case parameters', async ({ page }) => {
    await page.goto('/benchmark');
    await expect(page.getByText('Loading benchmark engine statistics...')).not.toBeVisible({ timeout: 10000 });

    await page.click('#view-jhora-case-JHORA-001');

    await expect(page.locator('h1')).toContainText('Normal Indian Birth');
    await expect(page.getByText('1996-09-23')).toBeVisible();
    await expect(page.getByText('New Delhi, India')).toBeVisible();
    await expect(page.getByText('LAHIRI')).toBeVisible();
  });

  test('opens manual JHora reference entry modal and submits partial data', async ({ page }) => {
    await page.goto('/benchmark/jhora/JHORA-001');

    await page.click('#open-data-entry-btn');
    await expect(page.getByText('Manual JHora Benchmark Entry')).toBeVisible();

    // Fill in Sun longitude
    await page.fill('#entry-sun', '156.8912');
    await page.click('#save-jhora-ref-btn');

    // Verify modal closes and page updates
    await expect(page.getByText('Manual JHora Benchmark Entry')).not.toBeVisible();
  });
});
