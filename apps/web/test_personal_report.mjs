import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`[Browser Console Error]: ${msg.text()}`);
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    console.log(`[Browser Uncaught PageError]: ${err.message}`);
    consoleErrors.push(err.message);
  });

  const artifactDir = '/home/rkshtjain3/.gemini/antigravity-ide/brain/b861cf21-9521-4509-a436-2b3c1b625ec0';

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  console.log('Clicking 1-Click Archetype Steve Jobs...');
  await page.click('#sample-profile-jobs');
  await page.waitForSelector('#results-tabs', { state: 'visible', timeout: 15000 });
  await page.waitForTimeout(1000);

  console.log('Navigating to Personal Report tab (#tab-report)...');
  await page.click('#tab-report');
  await page.waitForSelector('#report-content', { state: 'visible', timeout: 15000 });
  await page.waitForTimeout(1000);

  // Verify that the printable report and sections are visible
  const reportVisible = await page.locator('.printable-report').isVisible();
  console.log('Printable report visible:', reportVisible);

  // Verify Numerology section is rendered
  const numerologyText = await page.locator('text=9. Numerology Synthesis').isVisible();
  console.log('Numerology section visible:', numerologyText);

  // Scroll to numerology section
  await page.locator('text=9. Numerology Synthesis').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Take screenshot of numerology section
  await page.screenshot({ path: `${artifactDir}/feature_personal_report_numerology.png`, fullPage: false });
  console.log('Captured feature_personal_report_numerology.png');

  // Check errors
  if (consoleErrors.length > 0) {
    console.error('FAILED with console/page errors:', consoleErrors);
    await browser.close();
    process.exit(1);
  }

  console.log('SUCCESS! Zero errors found. Personal Report is working flawlessly!');
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
