import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message, err.stack));

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);
  await browser.close();
}

main().catch(console.error);
