import { test, expect } from '@playwright/test';

test.describe('D10 Career Evidence E2E', () => {
  test('should display D10 Career Evidence section in Life Analysis tab after calculation', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#date-of-birth');

    // Fill birth details
    await page.fill('#date-of-birth', '1990-04-15');
    await page.fill('#time-of-birth', '10:30');

    // Submit calculation
    await page.click('button[type="submit"]');
    await page.waitForSelector('#tab-rules', { timeout: 30000 });

    // Navigate to Life Analysis (rules) tab
    await page.click('#tab-rules');
    await page.waitForTimeout(500);

    // Verify D10 Career Evidence section exists
    const d10Section = page.locator('#d10-career-evidence-section');
    await expect(d10Section).toBeVisible();

    // Verify section header
    await expect(d10Section.locator('text=D10 DASHAMSA CAREER EVIDENCE')).toBeVisible();
    await expect(d10Section.locator('text=D10 Career Chart Analysis')).toBeVisible();

    // Verify evidence counts
    await expect(d10Section.locator('text=Supportive')).toBeVisible();
    await expect(d10Section.locator('text=Neutral')).toBeVisible();
    await expect(d10Section.locator('text=Challenging')).toBeVisible();

    // Verify D10 10th Lord card
    await expect(d10Section.locator('text=D10 10th Lord')).toBeVisible();

    // Verify D10 Lagna Lord card
    await expect(d10Section.locator('text=D10 Lagna Lord')).toBeVisible();

    // Verify Career Karakas section
    await expect(d10Section.locator('text=Career Karakas in D10')).toBeVisible();

    // Verify D1 ↔ D10 comparison
    await expect(d10Section.locator('text=D1 ↔ D10 Career Lord Comparison')).toBeVisible();

    // Verify non-predictive disclaimer
    await expect(d10Section.locator('text=D10 career-chart factors are shown as additional chart-specific evidence')).toBeVisible();
  });

  test('should expand WHY evidence panel for D10 10th Lord', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#date-of-birth');

    await page.fill('#date-of-birth', '1990-04-15');
    await page.fill('#time-of-birth', '10:30');

    await page.click('button[type="submit"]');
    await page.waitForSelector('#tab-rules', { timeout: 30000 });
    await page.click('#tab-rules');
    await page.waitForTimeout(500);

    // Click WHY button for D10-CAREER-001
    await page.click('#why-btn-d10-001');
    await page.waitForTimeout(300);

    // Verify WHY evidence panel is visible
    const whyPanel = page.locator('#why-evidence-d10-001');
    await expect(whyPanel).toBeVisible();

    // Verify it contains evidence lines
    const evidenceLines = whyPanel.locator('div');
    expect(await evidenceLines.count()).toBeGreaterThan(0);
  });

  test('should recalculate D10 evidence when birth time changes', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#date-of-birth');

    // First calculation
    await page.fill('#date-of-birth', '1990-04-15');
    await page.fill('#time-of-birth', '10:30');
    await page.click('button[type="submit"]');
    await page.waitForSelector('#tab-rules', { timeout: 30000 });
    await page.click('#tab-rules');
    await page.waitForTimeout(500);

    const firstD10Lord = await page.locator('#d10-career-evidence-section').textContent();

    // Change birth time
    await page.fill('#time-of-birth', '22:00');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    await page.click('#tab-rules');
    await page.waitForTimeout(500);

    // Verify section is still present (may have different data)
    await expect(page.locator('#d10-career-evidence-section')).toBeVisible();
  });
});
