import { test, expect } from '@playwright/test';

test.describe('Life Domain Analysis E2E Tests', () => {
  test('should render 7 life domain cards and allow interactive detail exploration', async ({ page }) => {
    await page.goto('/');

    // Fill form fields if required
    const nameInput = page.locator('#full-name-input');
    if (await nameInput.isVisible()) {
      await nameInput.fill('Playwright Test User');
    }

    // Submit calculation form
    const calculateBtn = page.locator('button:has-text("Calculate Birth Chart"), button:has-text("Calculate")').first();
    await calculateBtn.click();

    // Wait for LIFE ANALYSIS tab button to appear
    const lifeAnalysisTab = page.locator('#tab-life-analysis');
    await expect(lifeAnalysisTab).toBeVisible({ timeout: 20000 });

    // Click LIFE ANALYSIS tab
    await lifeAnalysisTab.click();

    // Verify 7 domain cards exist
    const careerCard = page.locator('#domain-card-career');
    const wealthCard = page.locator('#domain-card-wealth');
    const relationshipsCard = page.locator('#domain-card-relationships');
    const healthCard = page.locator('#domain-card-health');
    const educationCard = page.locator('#domain-card-education');
    const propertyCard = page.locator('#domain-card-property');
    const spiritualityCard = page.locator('#domain-card-spirituality');

    await expect(careerCard).toBeVisible();
    await expect(wealthCard).toBeVisible();
    await expect(relationshipsCard).toBeVisible();
    await expect(healthCard).toBeVisible();
    await expect(educationCard).toBeVisible();
    await expect(propertyCard).toBeVisible();
    await expect(spiritualityCard).toBeVisible();

    // Click career domain card to open detail modal
    await careerCard.click();

    // Check tabs in modal
    const overviewTab = page.locator('#domain-tab-overview');
    const supportTab = page.locator('#domain-tab-support');
    const challengeTab = page.locator('#domain-tab-challenge');
    const whyTab = page.locator('#domain-tab-why');

    await expect(overviewTab).toBeVisible();
    await expect(supportTab).toBeVisible();
    await expect(challengeTab).toBeVisible();
    await expect(whyTab).toBeVisible();

    // Click WHY tab to inspect evidence trace
    await whyTab.click();
    await expect(page.locator('h4:has-text("WHY Evidence Traces")')).toBeVisible();

    // Close modal
    const closeBtn = page.locator('#close-domain-modal');
    await closeBtn.click();
    await expect(overviewTab).not.toBeVisible();
  });
});
