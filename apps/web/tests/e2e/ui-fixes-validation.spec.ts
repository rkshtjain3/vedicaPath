import { test, expect } from '@playwright/test';
import path from 'path';

const artifactsDir = '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0';

test.describe('UI Fixes & Responsiveness Verification Suite', () => {
  test('verifies Portal Tooltip, Light Mode Yellow Text Contrast, Hindi Mode, and Mobile Responsiveness', async ({ page }) => {
    // 1. Desktop Light Mode & Hindi Verification
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(500);

    // Switch to Light Mode via #theme-toggle
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    await page.waitForTimeout(300);

    // Verify html has class 'light'
    const isLight = await page.locator('html').evaluate((el) => el.classList.contains('light'));
    expect(isLight).toBe(true);

    // Switch to Hindi Mode
    const hindiBtn = page.locator('#lang-btn-hi');
    await expect(hindiBtn).toBeVisible();
    await hindiBtn.click();
    await page.waitForTimeout(400);

    // Load Contemporary Profile (Rakshit Jain)
    const contemporaryBtn = page.locator('#sample-profile-contemporary');
    await expect(contemporaryBtn).toBeVisible();
    await contemporaryBtn.click();
    await page.waitForTimeout(300);

    // Calculate Chart
    await page.locator('#calculate-btn').click();
    await page.waitForTimeout(1000);

    // Wait for calculation results
    const strengthTab = page.locator('#tab-strength');
    await expect(strengthTab).toBeVisible({ timeout: 15000 });
    await strengthTab.click();
    await page.waitForTimeout(600);

    // Verify Strength Tab content is rendered in Hindi
    const strengthContent = page.locator('#strength-content');
    await expect(strengthContent).toBeVisible();
    await expect(strengthContent).toContainText('ग्रहीय बल एवं संबंध विश्लेषण इंजन');
    await expect(strengthContent).toContainText('ग्रह बल विहंगावलोकन');

    // Verify high-contrast text color in Light Mode (Not washed out yellow rgb(251, 191, 36))
    const scoreElem = page.locator('#strength-content .font-mono.font-bold').first();
    await expect(scoreElem).toBeVisible();
    const scoreColor = await scoreElem.evaluate((el) => window.getComputedStyle(el).color);
    console.log('Light Mode Computed Score Text Color:', scoreColor);
    // Should be rgb(146, 64, 14) (#92400e)
    expect(scoreColor).toBe('rgb(146, 64, 14)');

    // Expand Strength Factors WHY button
    const firstWhy = page.locator('[id^="why-strength-"]').first();
    await expect(firstWhy).toBeVisible();
    await firstWhy.click();
    await page.waitForTimeout(300);

    // Take Desktop Light Mode Planetary Strength Screenshot
    await page.screenshot({
      path: path.join(artifactsDir, 'light_mode_hindi_planetary_strength.png'),
      fullPage: false,
    });

    // 2. Mobile Viewport (375x812) Responsiveness & Portal Tooltip Test
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(400);

    // Switch to Life Navigator Tab
    const lifeTab = page.locator('#tab-life-analysis');
    await expect(lifeTab).toBeVisible();
    await lifeTab.click();
    await page.waitForTimeout(500);

    // Check Hero Tooltip
    const tooltipTrigger = page.locator('button[aria-label^="Explanation for"]').first();
    await expect(tooltipTrigger).toBeVisible({ timeout: 10000 });
    await tooltipTrigger.scrollIntoViewIfNeeded();
    await tooltipTrigger.click();
    await page.waitForTimeout(500);

    const tooltipPopup = page.locator('div[role="tooltip"]');
    await expect(tooltipPopup).toBeVisible({ timeout: 5000 });

      // Check Tooltip Bounding Box is within viewport
      const bounding = await tooltipPopup.boundingBox();
      console.log('Mobile Tooltip Bounding Box:', bounding);
      expect(bounding).not.toBeNull();
      if (bounding) {
        expect(bounding.x).toBeGreaterThanOrEqual(0);
        expect(bounding.x + bounding.width).toBeLessThanOrEqual(375);
      }

      await page.screenshot({
        path: path.join(artifactsDir, 'mobile_portal_tooltip_fixed.png'),
        fullPage: false,
      });

      // Close tooltip
      await tooltipTrigger.click();
      await page.waitForTimeout(200);

    // Switch to Planetary Strength on Mobile to test Planetary Strength Mobile Layout
    await strengthTab.scrollIntoViewIfNeeded();
    await strengthTab.click();
    await page.waitForTimeout(500);

    // Check that mobile body has NO horizontal scroll blowout
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowInnerWidth = await page.evaluate(() => window.innerWidth);
    console.log(`Mobile Body scrollWidth: ${bodyScrollWidth}, innerWidth: ${windowInnerWidth}`);
    expect(bodyScrollWidth).toBeLessThanOrEqual(windowInnerWidth);

    await page.screenshot({
      path: path.join(artifactsDir, 'mobile_planetary_strength_responsive.png'),
      fullPage: false,
    });
  });
});
