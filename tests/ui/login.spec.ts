import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

/**
 * SauceDemo login tests — Day 2 practice.
 * SauceDemo publishes its own test users on the login page:
 *   standard_user / secret_sauce  (valid)
 *   locked_out_user / secret_sauce (blocked account)
 */
test.describe('SauceDemo - login', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.goto(); // ARRANGE: start on the login page before every test
  });

  test('a valid user can log in and reach the products page', async ({ page }) => {
    // ACT: type the credentials and submit
    await login.login('standard_user', 'secret_sauce');

    // ASSERT: we landed on the inventory page and the catalogue is shown
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('a wrong password shows an error and stays on the login page', async ({ page }) => {
    // ACT: submit invalid credentials
    await login.login('standard_user', 'wrong_password');

    // ASSERT: an error is shown and we did NOT navigate away
    await login.expectError('Username and password do not match');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('a locked-out user is blocked with an explanatory error', async () => {
    // ACT: a known blocked account
    await login.login('locked_out_user', 'secret_sauce');

    // ASSERT: SauceDemo returns a specific "locked out" message
    await login.expectError('this user has been locked out');
  });
});
