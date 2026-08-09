import {
  test as base,
  expect,
  type Page,
} from "@playwright/test";
import path from "node:path";
import fs from "node:fs";
import { InventoryPage } from "./pages/inventory.page";
import { CheckoutPage } from "./pages/checkout.page";

/**
 * Arquitectura completa (Día 6 + Día 5): fixtures compuestas.
 *
 * - workerStorageState (worker): login UNA vez por worker, guarda la sesión.
 * - authedPage (test): una página que arranca YA en el catálogo, logueada.
 * - inventoryPage / checkoutPage (test): Page Objects listos sobre authedPage.
 *
 * Resultado: los tests no tienen login ni construcción de POMs — piden lo que
 * necesitan y ya viene servido.
 */
type TestFixtures = {
  authedPage: Page;
  inventoryPage: InventoryPage;
  checkoutPage: CheckoutPage;
};
type WorkerFixtures = {
  workerStorageState: string;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Sesión reutilizada por todos los tests del worker (Día 5 / Proyecto 1).
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [
    async ({ browser }, use) => {
      const id = test.info().parallelIndex;
      const file = path.resolve(
        test.info().project.outputDir,
        `.auth/p2-${id}.json`
      );
      if (fs.existsSync(file)) {
        await use(file);
        return;
      }
      const context = await browser.newContext({ storageState: undefined });
      const page = await context.newPage();
      await page.goto("https://www.saucedemo.com/");
      await page.getByPlaceholder("Username").fill("standard_user");
      await page.getByPlaceholder("Password").fill("secret_sauce");
      await page.getByRole("button", { name: "Login" }).click();
      await expect(page).toHaveURL(/inventory/);
      await context.storageState({ path: file });
      await context.close();
      await use(file);
    },
    { scope: "worker" },
  ],

  // Página ya logueada, parada en el catálogo.
  authedPage: async ({ page }, use) => {
    await page.goto("/inventory.html"); // baseURL = saucedemo (config)
    await use(page);
  },

  // Page Objects inyectados sobre la página autenticada.
  inventoryPage: async ({ authedPage }, use) => {
    await use(new InventoryPage(authedPage));
  },
  checkoutPage: async ({ authedPage }, use) => {
    await use(new CheckoutPage(authedPage));
  },
});

export { expect };
