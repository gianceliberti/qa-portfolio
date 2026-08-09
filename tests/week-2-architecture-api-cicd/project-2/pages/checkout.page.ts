import { type Page, type Locator } from "@playwright/test";
import { type Customer } from "../factories";

/**
 * Page Object del checkout (SauceDemo). Cubre desde el botón "Checkout" del
 * carrito hasta la confirmación. Sin assertions adentro.
 */
export class CheckoutPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly totalLabel: Locator;
  readonly errorMessage: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    this.firstName = page.getByPlaceholder("First Name");
    this.lastName = page.getByPlaceholder("Last Name");
    this.postalCode = page.getByPlaceholder("Zip/Postal Code");
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.finishButton = page.getByRole("button", { name: "Finish" });
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.completeHeader = page.getByText("Thank you for your order!");
  }

  /** Desde el carrito, entra al paso 1 del checkout. */
  async start(): Promise<void> {
    await this.checkoutButton.click();
  }

  /** Completa los datos del comprador (a partir de una Customer) y continúa. */
  async fillInformation(customer: Customer): Promise<void> {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
