import { type Page, type Locator } from "@playwright/test";

/**
 * Page Object del checkout de SauceDemo (dos pasos: datos y resumen).
 */
export class CheckoutPage {
  readonly page: Page;
  // Paso 1: datos del comprador
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;
  // Paso 2: resumen
  readonly finishButton: Locator;
  readonly totalLabel: Locator;
  // Confirmación
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.getByPlaceholder("First Name");
    this.lastName = page.getByPlaceholder("Last Name");
    this.postalCode = page.getByPlaceholder("Zip/Postal Code");
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.errorMessage = page.locator('[data-test="error"]');
    this.finishButton = page.getByRole("button", { name: "Finish" });
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.completeHeader = page.getByText("Thank you for your order!");
  }

  /** Completa los 3 campos del paso 1 y continúa. */
  async fillInformation(
    first: string,
    last: string,
    zip: string
  ): Promise<void> {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(zip);
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
