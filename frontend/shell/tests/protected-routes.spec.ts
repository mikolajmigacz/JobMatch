import { test, expect } from '@playwright/test';

test.describe('Protected Routes', () => {
  test('redirects to login when accessing job-seeker unauthenticated', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('/job-seeker');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('redirects to login when accessing employer unauthenticated', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('/employer');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});
