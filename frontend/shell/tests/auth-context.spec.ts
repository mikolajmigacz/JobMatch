import { test, expect } from '@playwright/test';

test.describe('Auth Context', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('shows Login and Register when not authenticated', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  });

  test('restores user from localStorage', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        'auth_user',
        JSON.stringify({
          userId: '123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'job_seeker',
        })
      );
      localStorage.setItem('auth_token', 'token');
    });
    await page.reload();
    await expect(page.getByText('Test User')).toBeVisible({ timeout: 3000 });
  });

  test('logout clears state', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        'auth_user',
        JSON.stringify({
          userId: '123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'job_seeker',
        })
      );
      localStorage.setItem('auth_token', 'token');
    });
    await page.reload();
    await page.getByRole('button', { name: 'Test User' }).click();
    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible({ timeout: 3000 });
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeNull();
  });
});
