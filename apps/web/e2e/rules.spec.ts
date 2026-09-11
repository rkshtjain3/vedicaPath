import { test, expect } from '@playwright/test';

test('Calculates chart, navigates to Life Analysis tab, and expands rule evidence breakdown', async ({ page }) => {
  await page.goto('/');

  // Fill in form inputs
  await page.fill('input[type="date"]', '1990-01-01');
  await page.fill('input[type="time"]', '12:00');

  // Submit calculation form
  await page.click('button[type="submit"]');

  // Wait for results tab bar to render
  const tabsContainer = page.locator('#results-tabs');
  await expect(tabsContainer).toBeVisible({ timeout: 15000 });

  // Click on "3. Life Analysis" tab
  const rulesTab = page.locator('#tab-rules');
  await expect(rulesTab).toBeVisible();
  await rulesTab.click();

  // Verify Rules content is displayed
  const rulesContent = page.locator('#rules-content');
  await expect(rulesContent).toBeVisible();

  // Verify all 4 Domain cards are present
  await expect(page.locator('#domain-card-career')).toBeVisible();
  await expect(page.locator('#domain-card-wealth')).toBeVisible();
  await expect(page.locator('#domain-card-relationships')).toBeVisible();
  await expect(page.locator('#domain-card-property')).toBeVisible();

  // Expand CAREER rule breakdown
  const careerWhyBtn = page.locator('#why-btn-career');
  await expect(careerWhyBtn).toBeVisible();
  await careerWhyBtn.click();

  // Verify rule evidence list is revealed
  await expect(page.locator('text=Evaluated Astrological Rules Evidence')).toBeVisible();
});
