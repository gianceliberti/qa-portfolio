import { type Page, type Locator } from "@playwright/test";

/**
 * Page Object del carrito de SauceDemo.
 */
export class CartPage {
  readonly page: Page;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    this.continueShoppingButton = page.getByRole("button", {
      name: "Continue Shopping",
    });
  }

  async goto(): Promise<void> {
    await this.page.goto("/cart.html");
  }

  /** Quita un producto del carrito por su nombre. */
  async removeItem(productName: string): Promise<void> {
    await this.items
      .filter({ hasText: productName })
      .getByRole("button", { name: "Remove" })
      .click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
