import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('renders correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Find Your Perfect Job or Hire the Best Talent')).toBeVisible();
    await expect(page.getByText('JobMatch connects job seekers with employers')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse Jobs' })).toBeVisible();
  });

  test('shows navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse Jobs' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  });
});
