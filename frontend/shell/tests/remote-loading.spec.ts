import { test, expect } from '@playwright/test';

test.describe('Module Federation - Remote Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        'auth_user',
        JSON.stringify({
          userId: '1',
          email: 'test@test.com',
          name: 'Test',
          role: 'job_seeker',
        })
      );
      localStorage.setItem('auth_token', 'token');
    });
  });

  test('job-seeker page loads and stays on route', async ({ page }) => {
    await page.goto('/job-seeker');
    await expect(page).toHaveURL(/\/job-seeker/);
  });

  test('employer page loads and stays on route', async ({ page }) => {
    await page.evaluate(() => {
      const user = JSON.parse(localStorage.getItem('auth_user')!);
      user.role = 'employer';
      localStorage.setItem('auth_user', JSON.stringify(user));
    });
    await page.goto('/employer');
    await expect(page).toHaveURL(/\/employer/);
  });
});
