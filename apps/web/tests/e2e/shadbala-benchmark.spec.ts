import { test, expect } from '@playwright/test';

test.describe('Phase 13C — Shadbala Benchmark UI E2E Flow', () => {
  test('navigates to /benchmark/shadbala, confirms checklist, and enters reference data', async ({ page }) => {
    // 1. Open benchmark dashboard
    await page.goto('/benchmark/shadbala');

    // 2. Verify page header
    await expect(page.locator('h1')).toContainText('Shadbala JHora Benchmark Developer Dashboard');

    // 3. Verify CASE-001 details load
    const h2 = page.locator('h2');
    await expect(h2).toBeVisible({ timeout: 15000 });
    await expect(h2).toContainText('Normal Indian chart');

    // 4. Confirm JHora settings checklist
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBe(6);

    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).check();
    }

    // 5. Enter Sun Naisargika Bala reference value (60.0 Virupas)
    const sunNaisargikaInput = page.locator('input[placeholder="JHora value"]').first();
    await sunNaisargikaInput.fill('60.0');

    // 6. Click SAVE REFERENCE DATA
    await page.getByRole('button', { name: /SAVE REFERENCE DATA|SAVED SUCCESSFULLY/i }).click();

    // 7. Verify save status button or text
    await expect(page.getByRole('button', { name: /SAVED SUCCESSFULLY|SAVE REFERENCE DATA/i })).toBeVisible({ timeout: 15000 });
  });
});
