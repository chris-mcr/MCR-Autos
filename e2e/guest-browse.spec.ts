import { test, expect } from '@playwright/test';

test.describe('Guest browsing', () => {
  test('can search the shop without logging in', async ({ page }) => {
    await page.goto('/shop');
    await expect(page.getByTestId('search-input')).toBeVisible();
    await expect(page).toHaveURL('/shop');
  });

  test('can view a product, but add to cart asks for login', async ({ page }) => {
    await page.goto('/product/item-1');
    await expect(page.getByTestId('product-title-item-1')).toBeVisible();
    await page.getByTestId('add-to-cart-item-1').click();
    await expect(page).toHaveURL('/login');
  });
});
