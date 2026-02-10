import { test, expect } from '@playwright/test';

test.describe('Register', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/register');
  });

  test('renders register form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Full Name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Job Seeker' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Employer' })).toBeVisible();
  });

  test('shows company fields when employer selected', async ({ page }) => {
    await page.getByRole('button', { name: 'Employer' }).click();
    await expect(page.getByPlaceholder('Company Name')).toBeVisible();
  });

  test('shows validation errors for invalid data', async ({ page }) => {
    await page.fill('input[placeholder="Email"]', 'invalid');
    await page.fill('input[placeholder="Full Name"]', 'A');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText(/invalid|least|required/i)).toBeVisible({ timeout: 3000 });
  });

  test('redirects on success', async ({ page }) => {
    await page.route('**/api/auth/register/**', (route) =>
      route.fulfill({
        status: 201,
        body: JSON.stringify({
          token: 'test-token',
          user: {
            userId: '123',
            email: 'test@example.com',
            name: 'Test User',
            role: 'job_seeker',
          },
        }),
      })
    );
    await page.fill('input[placeholder="Email"]', 'test@example.com');
    await page.fill('input[placeholder*="Password"]', 'TestPassword123!');
    await page.fill('input[placeholder="Full Name"]', 'Test User');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page).toHaveURL(/\/job-seeker/, { timeout: 5000 });
  });
});
