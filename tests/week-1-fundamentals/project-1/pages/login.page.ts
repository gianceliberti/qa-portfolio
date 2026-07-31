import { type Page, type Locator } from "@playwright/test";

/**
 * Page Object del login de SauceDemo.
 * Regla que seguimos (adelanto del Día 6): el Page Object EXPONE locators y
 * ACCIONES, pero NO tiene assertions adentro. Las verificaciones viven en los
 * tests. Así el POM es reutilizable y los tests dicen qué se espera.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder("Username");
    this.passwordInput = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto(): Promise<void> {
    await this.page.goto("/"); // baseURL = https://www.saucedemo.com
  }

  /** Completa credenciales y envía el formulario. */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
