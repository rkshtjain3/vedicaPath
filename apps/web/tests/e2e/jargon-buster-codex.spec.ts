import { test, expect } from '@playwright/test';

test.describe('Jargon-Buster Codex & Superstition-Free Jyotish E2E Tests', () => {
  test('should open Superstition Freedom modal, browse Codex tab, search terms, and test tooltips', async ({ page }) => {
    await page.goto('/');

    // 1. Check Superstition-Free header button and open modal before calculation
    const headerSuperstitionBtn = page.locator('#header-superstition-btn');
    if (await headerSuperstitionBtn.isVisible()) {
      await headerSuperstitionBtn.click();
      await expect(page.locator('#superstition-modal-title')).toBeVisible();
      await expect(page.locator('text=Astrology Without Superstition')).toBeVisible();
      await expect(page.locator('text=The 50/50 Vedic Rule')).toBeVisible();
      await expect(page.locator('text=Manglik Dosha')).toBeVisible();
      
      // Close modal
      const closeBtn = page.locator('#close-superstition-modal');
      await closeBtn.click();
      await expect(page.locator('#superstition-modal-title')).not.toBeVisible();
    }

    // 2. Submit calculation form
    const nameInput = page.locator('#full-name-input');
    if (await nameInput.isVisible()) {
      await nameInput.fill('Codex Explorer');
    }
    const calculateBtn = page.locator('#calculate-btn, button:has-text("Calculate Birth Chart"), button:has-text("Calculate")').first();
    await calculateBtn.click();

    // 3. Verify JARGON BUSTER tab appears
    const codexTab = page.locator('#tab-codex');
    await expect(codexTab).toBeVisible({ timeout: 20000 });
    await codexTab.click();

    // 4. Verify Jargon Buster Header & Search Bar
    await expect(page.locator('h2:has-text("The Jargon-Buster & Vedic Wisdom Archive")')).toBeVisible();
    const searchInput = page.locator('#codex-search-input');
    await expect(searchInput).toBeVisible();

    // Search for "Manglik"
    await searchInput.fill('Manglik');
    await expect(page.locator('#codex-card-manglik-dosha')).toBeVisible();
    await expect(page.locator('text=High Mars Energy & Passionate Drive')).toBeVisible();

    // Expand Manglik card to see myth debunking
    const toggleManglikBtn = page.locator('#toggle-card-manglik-dosha');
    await toggleManglikBtn.click();
    await expect(page.locator('text=Superstitious Myth vs. Vedic Reality')).toBeVisible();
    await expect(page.locator('text=Common Fear:')).toBeVisible();
    await expect(page.locator('text=Vedic Truth:')).toBeVisible();

    // Clear search
    await searchInput.fill('');

    // Filter by Category: Houses & Architecture
    const housesFilter = page.locator('#filter-codex-houses_arch');
    await expect(housesFilter).toBeVisible();
    await housesFilter.click();
    await expect(page.locator('#codex-card-kendra')).toBeVisible();
    await expect(page.locator('#codex-card-trikona')).toBeVisible();

    // 5. Check micro-tooltips in Life Navigator Tab
    const lifeAnalysisTab = page.locator('#tab-life-analysis');
    await lifeAnalysisTab.click();
    await expect(page.locator('#life-navigator-dashboard')).toBeVisible();

    // Hover or click on a tooltip
    const lagnaTooltipBtn = page.locator('button[aria-label*="Lagna"]').first();
    if (await lagnaTooltipBtn.isVisible()) {
      await lagnaTooltipBtn.click();
      await expect(page.locator('[role="tooltip"]')).toBeVisible();
    }
  });
});
