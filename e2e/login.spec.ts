import { test, expect } from '@playwright/test';
import { login, logout } from '../src/lib/playwright';

test.describe('Login flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await login(page, 'test@example.com', 'password123');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByTestId('nav-dashboard')).toBeVisible();
  });

  test('should show validation error for empty email', async ({ page }) => {
    await page.getByTestId('email-input').fill('');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('email-error')).toHaveText('Email is required');
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    await page.getByTestId('email-input').fill('invalid-email');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('email-error')).toHaveText('Please enter a valid email address');
  });

  test('should show validation error for short password', async ({ page }) => {
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('short');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByTestId('password-error')).toBeVisible();
    await expect(page.getByTestId('password-error')).toHaveText('Password must be at least 6 characters');
  });

  test('should logout successfully', async ({ page }) => {
    await login(page, 'test@example.com', 'password123');
    await logout(page);
    
    await expect(page).toHaveURL('/login');
  });
});