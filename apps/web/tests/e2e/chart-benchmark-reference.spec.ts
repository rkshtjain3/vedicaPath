import { test, expect } from '@playwright/test';

test.describe('Phase 21 Birth Chart Reference, Quality & Certification E2E', () => {
  test('should render dashboard, view quality score, run benchmarks, and view certification', async ({ page }) => {
    await page.goto('/benchmark/chart');

    // Page title
    await expect(page.locator('h1')).toContainText('Birth Chart Calculation Benchmark & Quality Dashboard');

    // Quality Score Button
    const qualityBtn = page.getByRole('button', { name: /Quality Score/i });
    await expect(qualityBtn).toBeVisible();
    await qualityBtn.click();

    // Verify Quality Modal opens
    await expect(page.getByText('BENCHMARK_QUALITY_V1')).toBeVisible();
    await expect(page.getByText('Quality Factor Evaluation Evidence')).toBeVisible();

    // Close Quality Modal
    const closeQualityBtn = page.getByRole('button', { name: 'Close' });
    await closeQualityBtn.click();

    // Run all benchmarks button
    const runAllBtn = page.getByRole('button', { name: '🚀 Run All Benchmarks' });
    await runAllBtn.click();

    // Open Certification Report Modal
    const certBtn = page.getByRole('button', { name: '📜 Certification Report' });
    await certBtn.click();

    await expect(page.getByText('Formal Accuracy Certification Report')).toBeVisible();
    await expect(page.getByText('VEDICA CALCULATION ACCURACY CERTIFICATION')).toBeVisible();

    // Close modal
    const closeCertBtn = page.getByRole('button', { name: 'Close' });
    await closeCertBtn.click();
  });
});
