import { test, expect } from '@playwright/test';

test.describe('Birth Chart Accuracy Benchmark Developer Dashboard', () => {
  test('should render chart benchmark developer page and execute validation run', async ({ page }) => {
    await page.goto('/benchmark/chart');

    // Header title
    await expect(page.locator('h1')).toContainText('Birth Chart Calculation Benchmark & Quality Dashboard');

    // Case selection dropdown
    const select = page.locator('select').first();
    await expect(select).toBeVisible();
    if (await select.locator('option').count() > 0) {
      await expect(select).toHaveValue('CASE-001');

      // Run Validation button
      const runBtn = page.getByRole('button', { name: 'Run Validation' });
      await expect(runBtn).toBeVisible();
      await runBtn.click();

      // Summary banner appears after calculation
      await expect(page.getByText('Overall:')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Planetary Longitudes Comparison')).toBeVisible();
      await expect(page.getByText('Nakshatra & Pada Comparison')).toBeVisible();
      await expect(page.getByText('Divisional Charts Comparison')).toBeVisible();
    }
  });
});
