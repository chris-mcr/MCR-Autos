import { Page } from '@playwright/test';

export const TEST_IDS = {
  nav: {
    home: 'nav-home',
    shop: 'nav-shop',
    cart: 'nav-cart',
    account: 'nav-account',
    dashboard: 'nav-dashboard',
    login: 'nav-login',
  },
  login: {
    email: 'email-input',
    password: 'password-input',
    submit: 'login-button',
    error: 'error-message',
  },
  cart: {
    quantity: 'cart-quantity',
    items: 'cart-item',
    checkout: 'cart-checkout',
    add: 'cart-add',
  },
  product: {
    addToCart: 'product-add-to-cart',
    title: 'product-title',
    price: 'product-price',
  },
} as const;

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByTestId(TEST_IDS.login.email).fill(email);
  await page.getByTestId(TEST_IDS.login.password).fill(password);
  await page.getByTestId(TEST_IDS.login.submit).click();
  await page.waitForURL('/dashboard');
}

export async function addToCart(page: Page, productId: string, quantity = 1) {
  await page.goto(`/product/${productId}`);
  await page.getByTestId(TEST_IDS.product.addToCart).click();
  if (quantity > 1) {
    for (let i = 0; i < quantity - 1; i++) {
      await page.getByTestId('cart-increase').click();
    }
  }
}

export async function logout(page: Page) {
  await page.goto('/account');
  await page.getByTestId('logout-button').click();
  await page.waitForURL('/');
}

export async function navigateToShop(page: Page) {
  await page.getByTestId(TEST_IDS.nav.shop).click();
}

export async function navigateToCart(page: Page) {
  await page.getByTestId(TEST_IDS.nav.cart).click();
}

export async function navigateToAccount(page: Page) {
  await page.getByTestId(TEST_IDS.nav.account).click();
}

export async function navigateToDashboard(page: Page) {
  await page.getByTestId(TEST_IDS.nav.dashboard).click();
}