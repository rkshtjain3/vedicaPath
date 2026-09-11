import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 }
  });
  const page = await context.newPage();

  const artifactDir = '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0';

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. Initial Page with Sample Profiles Bar
  await page.waitForSelector('#sample-profiles-bar', { state: 'visible' });
  await page.screenshot({ path: `${artifactDir}/feature_sample_profiles_bar.png` });
  console.log('Captured feature_sample_profiles_bar.png');

  // 2. Click Steve Jobs 1-Click Archetype
  console.log('Clicking Steve Jobs archetype...');
  await page.click('#sample-profile-jobs');
  await page.waitForSelector('#results-tabs', { state: 'visible', timeout: 15000 });
  await page.waitForTimeout(1000);

  // Capture Two-Tier Navigation & Compass Bar
  await page.locator('#results-tabs').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${artifactDir}/feature_tabs_compass_and_observatory.png` });
  console.log('Captured feature_tabs_compass_and_observatory.png');

  // 3. Scroll to Sattvic Habit Tracker in Life Navigator
  await page.waitForSelector('#sattvic-habit-tracker', { state: 'visible', timeout: 15000 });
  await page.locator('#sattvic-habit-tracker').scrollIntoViewIfNeeded();

  // Click 3 of the habit checkboxes to see progress advance to 75%
  await page.click('#habit-checkbox-surya-light');
  await page.waitForTimeout(400);
  await page.click('#habit-checkbox-chandra-breath');
  await page.waitForTimeout(400);
  await page.click('#habit-checkbox-saturn-seva');
  await page.waitForTimeout(600);

  await page.screenshot({ path: `${artifactDir}/feature_sattvic_habit_tracker.png` });
  console.log('Captured feature_sattvic_habit_tracker.png');

  // 4. Switch Language to Hindi
  console.log('Switching to Hindi...');
  await page.click('#lang-btn-hi');
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  await page.screenshot({ path: `${artifactDir}/feature_hindi_localization.png` });
  console.log('Captured feature_hindi_localization.png');

  await browser.close();
  console.log('All feature screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
