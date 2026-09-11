import { test, expect } from '@playwright/test';

test.describe('Deterministic Personalized Query Engine & Evidence Explorer E2E Tests', () => {
  test('should submit chart calculation, switch to ASK VEDICA tab, execute queries, display evidence, and trace WHY modal', async ({ page }) => {
    await page.goto('/');

    // Fill birth form if needed
    const nameInput = page.locator('#full-name-input');
    if (await nameInput.isVisible()) {
      await nameInput.fill('Query Test User');
    }

    // Submit calculation
    const calculateBtn = page.locator('button:has-text("Calculate Birth Chart"), button:has-text("Calculate")').first();
    await calculateBtn.click();

    // Wait for ASK VEDICA tab (#tab-query) to appear
    const queryTab = page.locator('#tab-query');
    await expect(queryTab).toBeVisible({ timeout: 20000 });

    // Switch to ASK VEDICA tab
    await queryTab.click();

    // Verify Ask Vedica title banner
    await expect(page.locator('h2:has-text("Ask Vedica")')).toBeVisible();

    // Fill search input with career query
    const searchInput = page.locator('input[placeholder*="career" i]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('What does my chart show about career?');

    // Click Explore button
    const exploreBtn = page.locator('button:has-text("Explore")');
    await exploreBtn.click();

    // Verify Query Result
    await expect(page.locator('span:has-text("DOMAIN")').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('h3:has-text("What does my chart show about career?")')).toBeVisible();

    // Click example chip for Saturn
    const saturnChip = page.locator('button:has-text("Tell me about Saturn.")');
    if (await saturnChip.isVisible()) {
      await saturnChip.click();
      await expect(page.locator('span:has-text("PLANET")').first()).toBeVisible({ timeout: 5000 });
      await expect(page.locator('h3:has-text("Tell me about Saturn.")')).toBeVisible();
    }

    // Test WHY Trace modal
    const whyTraceBtn = page.locator('button:has-text("WHY Trace")').first();
    if (await whyTraceBtn.isVisible()) {
      await whyTraceBtn.click();
      await expect(page.locator('h4:has-text("Evidence WHY Chain Trace"), div:has-text("Step-by-Step Calculation Path")').first()).toBeVisible();
      const closeBtn = page.locator('button:has-text("Close Trace")');
      await closeBtn.click();
    }
  });
});
