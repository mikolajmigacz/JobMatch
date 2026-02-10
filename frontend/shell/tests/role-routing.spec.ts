import { test, expect } from '@playwright/test';

test.describe('Role-based Routing', () => {
  test('redirects job seeker from employer to job-seeker', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        'auth_user',
        JSON.stringify({
          userId: '1',
          email: 'js@test.com',
          name: 'Job Seeker',
          role: 'job_seeker',
        })
      );
      localStorage.setItem('auth_token', 'token');
    });
    await page.goto('/employer');
    await expect(page).toHaveURL(/\/job-seeker/, { timeout: 5000 });
  });

  test('redirects employer from job-seeker to employer', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        'auth_user',
        JSON.stringify({
          userId: '2',
          email: 'emp@test.com',
          name: 'Employer',
          role: 'employer',
        })
      );
      localStorage.setItem('auth_token', 'token');
    });
    await page.goto('/job-seeker');
    await expect(page).toHaveURL(/\/employer/, { timeout: 5000 });
  });
});
