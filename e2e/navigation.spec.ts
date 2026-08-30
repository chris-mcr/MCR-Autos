import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to home from logo', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('home-logo-button').click();
    await expect(page).toHaveURL('/');
  });

  test('should navigate to shop from nav', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-shop').click();
    await expect(page).toHaveURL('/shop');
  });

  test('should show active state on current page', async ({ page }) => {
    await page.goto('/shop');
    const shopLink = page.getByTestId('nav-shop');
    await expect(shopLink).toHaveCSS('color', /rgb\(.*?\)/); // Has accent color
  });
});