import { type Page, type Locator } from "@playwright/test";

/**
 * Page Object del catálogo (inventory) de SauceDemo.
 * Expone los locators de la grilla y acciones como ordenar o agregar al carrito.
 */
export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly sortDropdown: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("Products");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async goto(): Promise<void> {
    await this.page.goto("/inventory.html");
  }

  /** Ordena la grilla. value: "az" | "za" | "lohi" | "hilo". */
  async sortBy(value: "az" | "za" | "lohi" | "hilo"): Promise<void> {
    await this.sortDropdown.selectOption(value);
  }

  /** Agrega un producto por su nombre (acota la tarjeta y clickea su botón). */
  async addToCart(productName: string): Promise<void> {
    await this.items
      .filter({ hasText: productName })
      .getByRole("button", { name: "Add to cart" })
      .click();
  }

  /** Quita un producto por su nombre. */
  async removeFromCart(productName: string): Promise<void> {
    await this.items
      .filter({ hasText: productName })
      .getByRole("button", { name: "Remove" })
      .click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  /** Devuelve los precios como números (sacando el "$"), para verificar orden. */
  async getPrices(): Promise<number[]> {
    const textos = await this.itemPrices.allTextContents();
    return textos.map((t) => parseFloat(t.replace("$", "")));
  }

  /** Devuelve los nombres de los productos como array de strings. */
  async getNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }
}
