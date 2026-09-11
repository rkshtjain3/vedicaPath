import { test, expect } from '@playwright/test';
import path from 'path';

const artifactsDir = '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0';

test.describe('Hindi Mode Localization E2E Suite', () => {
  test('switches to Hindi mode and verifies all astrological results are rendered in authentic Hindi', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1080 });
    await page.goto('/');

    // 1. Switch to Hindi Mode
    const hindiBtn = page.locator('#lang-btn-hi');
    await expect(hindiBtn).toBeVisible();
    await hindiBtn.click();
    await page.waitForTimeout(400);

    // Verify header in Hindi
    const headerTitle = page.locator('#app-header');
    await expect(headerTitle).toContainText('वैदिक पथ');

    // 2. Load Steve Jobs Profile and Calculate
    const sampleJobs = page.locator('#sample-profile-jobs');
    await expect(sampleJobs).toBeVisible();
    await sampleJobs.click();
    await page.waitForTimeout(300);

    const calcBtn = page.locator('#calculate-btn');
    await calcBtn.click();

    // Wait for Life Navigator to appear
    const lifeNavTab = page.locator('#tab-life-analysis');
    await expect(lifeNavTab).toBeVisible({ timeout: 20000 });
    await expect(lifeNavTab).toContainText('जीवन मार्गदर्शक');
    await lifeNavTab.click();
    await page.waitForTimeout(400);

    // 3. Verify Life Navigator Hero Trio in Devanagari Hindi
    const heroTrio = page.locator('#life-navigator-hero-trio');
    await expect(heroTrio).toBeVisible();
    // Lagna, Moon sign, Sun sign should show Hindi sign names
    const heroText = await heroTrio.textContent();
    expect(heroText).toMatch(/(सिंह|मीन|धनु|मेष|कन्या|वृषभ|कर्क|तुला|वृश्चिक|मकर|कुम्भ|मिथुन)/);

    // Verify Active Cosmic Season
    const activeSeason = page.locator('#active-cosmic-season-hero');
    await expect(activeSeason).toBeVisible();
    const seasonText = await activeSeason.textContent();
    expect(seasonText).toContain('वर्तमान सक्रिय ब्रह्मांडीय कालचक्र');

    // Take screenshot of Life Navigator Hero & Cosmic Season
    await page.screenshot({
      path: path.join(artifactsDir, 'hindi_mode_life_navigator.png'),
      fullPage: false,
    });

    // 4. Verify 7 Life Crossroads Cards in Hindi
    const careerCard = page.locator('#domain-card-career');
    await expect(careerCard).toBeVisible();
    await expect(careerCard).toContainText('आजीविका एवं करियर');

    const wealthCard = page.locator('#domain-card-wealth');
    await expect(wealthCard).toBeVisible();
    await expect(wealthCard).toContainText('धन एवं आर्थिक समृद्धि');

    // Scroll to 7 domains and capture screenshot
    await careerCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(artifactsDir, 'hindi_mode_domain_cards.png'),
      fullPage: false,
    });

    // 5. Open Astrological Proof Drawer Modal and Verify Hindi Evidence
    const proofBtn = page.locator('#btn-why-proof-career');
    if (await proofBtn.isVisible()) {
      await proofBtn.click();
      const proofModal = page.locator('#proof-drawer-modal');
      await expect(proofModal).toBeVisible();
      await expect(proofModal).toContainText('शास्त्रीय प्रमाण');
      await page.screenshot({
        path: path.join(artifactsDir, 'hindi_mode_proof_modal.png'),
        fullPage: false,
      });
      // Close modal
      await page.locator('#close-domain-modal').click();
      await page.waitForTimeout(300);
    }

    // 6. Verify Ask Vedica Tab in Hindi
    const askTab = page.locator('#tab-query');
    await expect(askTab).toBeVisible();
    await askTab.click();
    await page.waitForTimeout(500);

    const askContainer = page.locator('#tab-query-container');
    await expect(askContainer).toBeVisible();
    await expect(askContainer).toContainText('वेदिका से पूछें');

    // Click first query chip
    const firstChip = page.locator('.query-chip').first();
    if (await firstChip.isVisible()) {
      await firstChip.click();
      await page.waitForTimeout(1000);
      const pillarContainer = page.locator('#query-pillars-container');
      await expect(pillarContainer).toBeVisible();
      await expect(pillarContainer).toContainText('ग्रहीय अनुकूलता');
    }

    await page.screenshot({
      path: path.join(artifactsDir, 'hindi_mode_ask_vedica.png'),
      fullPage: false,
    });

    // 7. Verify Timeline Tab in Hindi
    const timelineTab = page.locator('#tab-timeline');
    await expect(timelineTab).toBeVisible();
    await timelineTab.click();
    await page.waitForTimeout(500);

    const timelineContainer = page.locator('#tab-timeline-container');
    await expect(timelineContainer).toBeVisible();
    await expect(timelineContainer).toContainText('विंशोत्तरी दशा प्रणाली');

    await page.screenshot({
      path: path.join(artifactsDir, 'hindi_mode_timeline.png'),
      fullPage: false,
    });

    // 8. Verify Personal Report Tab in Hindi
    const reportTab = page.locator('#tab-report');
    await expect(reportTab).toBeVisible();
    await reportTab.click();
    await page.waitForTimeout(500);

    const reportContainer = page.locator('.printable-report');
    await expect(reportContainer).toBeVisible();
    await expect(reportContainer).toContainText('१. जीवन सारांश');

    await page.screenshot({
      path: path.join(artifactsDir, 'hindi_mode_personal_report.png'),
      fullPage: false,
    });
  });
});
