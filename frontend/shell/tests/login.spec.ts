import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/login');
  });

  test('renders login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('shows validation errors for invalid email', async ({ page }) => {
    await page.fill('input[placeholder="Email"]', 'invalid');
    await page.fill('input[placeholder="Password"]', 'password');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText(/invalid|email/i)).toBeVisible({ timeout: 3000 });
  });

  test('shows error on failed login', async ({ page }) => {
    await page.route('**/api/auth/login', (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ message: 'Invalid credentials' }) })
    );
    await page.fill('input[placeholder="Email"]', 'test@example.com');
    await page.fill('input[placeholder="Password"]', 'wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText(/invalid|failed|credentials/i)).toBeVisible({ timeout: 5000 });
  });

  test('redirects to job-seeker on success', async ({ page }) => {
    await page.route('**/api/auth/login', (route) =>
      route.fulfill({
        status: 200,
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
    await page.fill('input[placeholder="Password"]', 'password');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/job-seeker/, { timeout: 5000 });
  });
});
