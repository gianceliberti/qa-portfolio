import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object for the SauceDemo login page (https://www.saucedemo.com/).
 * Groups all the login-screen locators and actions in one place, so the
 * spec files read like plain English and don't repeat selectors.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // SauceDemo exposes stable `data-test` attributes — ideal for automation.
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /** Open the login page. */
  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/');
  }

  /** Fill both fields and submit. */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Assert the login failed with the expected error text. */
  async expectError(text: string): Promise<void> {
    await expect(this.errorMessage).toContainText(text);
  }
}
