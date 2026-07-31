import { test, expect } from "@playwright/test"; // test BASE: arranca deslogueado
import { LoginPage } from "../pages/login.page";

/**
 * Autenticación y permisos. Cubrimos el happy path y —sobre todo— los caminos
 * negativos, que es donde aparecen los bugs reales.
 */
test.describe("Login", () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.goto();
  });

  test("un usuario válido entra y llega al catálogo", async ({ page }) => {
    await login.login("standard_user", "secret_sauce");
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText("Products")).toBeVisible();
  });

  test("una contraseña incorrecta muestra error y no deja pasar", async ({
    page,
  }) => {
    await login.login("standard_user", "wrong_password");
    await expect(login.errorMessage).toContainText(
      "Username and password do not match"
    );
    await expect(page).not.toHaveURL(/inventory/); // seguimos en el login
  });

  test("un usuario bloqueado recibe un error explicativo", async () => {
    await login.login("locked_out_user", "secret_sauce");
    await expect(login.errorMessage).toContainText("locked out");
  });

  test("enviar el formulario vacío pide el usuario", async () => {
    await login.login("", "");
    await expect(login.errorMessage).toContainText("Username is required");
  });
});
