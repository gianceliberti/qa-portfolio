import { type Page, type Locator } from "@playwright/test";

/**
 * Page Object del catálogo (SauceDemo). Expone locators + acciones, SIN
 * assertions adentro (Día 6). Los tests verifican; el POM solo actúa.
 */
export class InventoryPage {
  readonly page: Page;
  readonly items: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator('[data-test="inventory-item"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  /** Agrega un producto al carrito por su nombre. */
  async addToCart(product: string): Promise<void> {
    await this.items
      .filter({ hasText: product })
      .getByRole("button", { name: "Add to cart" })
      .click();
  }

  /** Abre el carrito. */
  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
