import { test, expect } from "@playwright/test";

/**
 * DÍA 2 — Primer contacto con Playwright  (RESUELTO Y COMENTADO)
 *
 * App bajo prueba: https://www.saucedemo.com
 * Usuario normal: standard_user / secret_sauce
 *
 * Cómo correr:
 *   npx playwright test dia2                 → headless, los 3 browsers
 *   npx playwright test dia2 --ui            → modo UI (el mejor para estudiar)
 *   npx playwright test dia2 --project=chromium --headed
 *   npx playwright show-report               → reporte HTML del último run
 */

// Constantes: guardamos las credenciales una vez y las reusamos.
// Si mañana cambian, se tocan acá en un solo lugar (no en cada test).
const USER = "standard_user";
const PASS = "secret_sauce";

// ─────────────────────────────────────────────────────────────
// TEST 1 — Smoke: ¿la página carga?
// El test más aburrido y el más valioso. Si este falla, todos
// los demás son ruido.
// ─────────────────────────────────────────────────────────────
test("la página de login carga correctamente", async ({ page }) => {
  // page.goto() navega el navegador a esa URL. Lleva await porque
  // "cargar una página" tarda: esperamos a que termine antes de seguir.
  await page.goto("https://www.saucedemo.com/");

  // TODO 1 — RESUELTO
  // getByRole("button", { name: "Login" }) LOCALIZA el botón por su rol
  // (button) y su texto (Login). Es un localizador "como lo ve el usuario".
  // expect(...).toBeVisible() es la ASERCIÓN: comprueba que el botón se ve.
  // Es "web-first": reintenta sola durante 5s hasta que aparezca o falle.
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});

// ─────────────────────────────────────────────────────────────
// TEST 2 — Happy path: login exitoso
// ─────────────────────────────────────────────────────────────
test("standard_user puede iniciar sesión", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  // TODO 2 — RESUELTO (el patrón de login: 3 acciones encadenadas)
  // getByPlaceholder("Username") localiza el campo por su texto de ayuda.
  // .fill(USER) escribe el valor dentro del campo. await: teclear tarda.
  await page.getByPlaceholder("Username").fill(USER);
  // Lo mismo para la contraseña, usando la constante PASS.
  await page.getByPlaceholder("Password").fill(PASS);
  // Localizamos el botón Login y hacemos click. await: el click dispara
  // navegación y hay que esperar la respuesta del servidor.
  await page.getByRole("button", { name: "Login" }).click();

  // TODO 3 — RESUELTO
  // Tras un login OK, SauceDemo te manda a /inventory.html.
  // expect(page).toHaveURL(...) verifica la URL actual de la página.
  // /inventory/ es un REGEX (texto entre 2 barras) = "que CONTENGA inventory".
  await expect(page).toHaveURL(/inventory/);
});

// ─────────────────────────────────────────────────────────────
// TEST 3 — Camino negativo: usuario bloqueado
// Los juniors testean el happy path. Los seniors viven acá.
// ─────────────────────────────────────────────────────────────
test("locked_out_user recibe un mensaje de error", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  // TODO 4 — RESUELTO (mismo patrón que TODO 2, pero con un usuario bloqueado)
  // Acá el usuario NO es la constante USER: es un string distinto,
  // "locked_out_user", que SauceDemo tiene marcado como bloqueado.
  // La contraseña sí es la misma (PASS = secret_sauce).
  await page.getByPlaceholder("Username").fill("locked_out_user");
  await page.getByPlaceholder("Password").fill(PASS);
  await page.getByRole("button", { name: "Login" }).click();

  // TODO 5 — RESUELTO
  // Con un usuario bloqueado NO cambiamos de página: aparece un cartel de error.
  // page.locator('[data-test="error"]') localiza ese cartel por su atributo.
  // toContainText("locked out") verifica que el texto del cartel CONTENGA
  // "locked out" (no que sea exactamente igual). El mensaje real completo es:
  // "Epic sadface: Sorry, this user has been locked out."
  await expect(page.locator('[data-test="error"]')).toContainText("locked out");
});

// ─────────────────────────────────────────────────────────────
// TEST 4 — Cambio de estado: agregar al carrito
// ─────────────────────────────────────────────────────────────
test("agregar un producto actualiza el contador del carrito", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await page.getByPlaceholder("Username").fill(USER);
  await page.getByPlaceholder("Password").fill(PASS);
  await page.getByRole("button", { name: "Login" }).click();

  // TODO 6 — RESUELTO
  // En la grilla hay MUCHOS productos, cada uno con su botón "Add to cart".
  // Si buscáramos el botón directo, Playwright encontraría varios y fallaría.
  // Por eso ACOTAMOS la búsqueda en 3 pasos encadenados:
  //   1) locator('[data-test="inventory-item"]') → todas las tarjetas de producto
  //   2) .filter({ hasText: "Sauce Labs Backpack" }) → nos quedamos con LA que
  //      contiene ese texto (una sola tarjeta)
  //   3) .getByRole("button", { name: "Add to cart" }) → el botón DENTRO de esa
  //      tarjeta. Y .click() lo presiona.
  await page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: "Sauce Labs Backpack" })
    .getByRole("button", { name: "Add to cart" })
    .click();

  // TODO 7 — RESUELTO
  // Al agregar 1 producto, el ícono del carrito muestra un globito con "1".
  // toHaveText("1") verifica que ese globito diga exactamente "1".
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(
    "1"
  );
});

// ─────────────────────────────────────────────────────────────
// TEST 5 — Listas: ordenar productos
// Assertions sobre colecciones, no sobre un solo elemento.
// ─────────────────────────────────────────────────────────────
test("los productos se pueden ordenar por precio ascendente", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await page.getByPlaceholder("Username").fill(USER);
  await page.getByPlaceholder("Password").fill(PASS);
  await page.getByRole("button", { name: "Login" }).click();

  // TODO 8 — RESUELTO
  // El orden se cambia con un <select> (desplegable). selectOption("lohi")
  // elige la opción cuyo value es "lohi" = "Price (low to high)".
  // (El value "lohi" es interno del HTML; lo ve el navegador, no el usuario.)
  await page
    .locator('[data-test="product-sort-container"]')
    .selectOption("lohi");

  // TODO 9 — RESUELTO (verificar una LISTA, no un solo elemento)
  // 1) Leemos el texto de TODOS los precios de golpe.
  //    allTextContents() devuelve un array de strings: ["$7.99", "$9.99", ...]
  const textos = await page
    .locator('[data-test="inventory-item-price"]')
    .allTextContents();

  // 2) Convertimos cada string a número: le sacamos el "$" y parseamos.
  //    .map() transforma cada elemento del array. Resultado: [7.99, 9.99, ...]
  const precios = textos.map((t) => parseFloat(t.replace("$", "")));

  // 3) Hacemos una COPIA ([...precios]) y la ordenamos de menor a mayor.
  //    sort((a,b) => a-b) ordena numéricamente (sin esto ordenaría como texto).
  //    Usamos copia para no alterar el array original y poder compararlos.
  const ordenados = [...precios].sort((a, b) => a - b);

  // 4) La aserción: los precios TAL COMO vinieron de la página deben ser
  //    iguales a la versión ordenada. Si la página ordenó bien, coinciden.
  //    toEqual compara arrays elemento por elemento (no es web-first: opera
  //    sobre datos que ya tenemos en memoria, por eso no lleva await).
  expect(precios).toEqual(ordenados);
});

// ─────────────────────────────────────────────────────────────
// TEST 6 — LA TRAMPA. No lo modifiques: corrélo y observá.
//
// Este test afirma que existe un botón que NO existe en la página.
// Debería fallar. Va a pasar en verde.
//
// ¿Por qué? isVisible() devuelve Promise<boolean>, no boolean.
// Una Promise siempre es truthy. La assertion nunca evalúa el
// valor real. Este es el bug silencioso #1 en suites reales:
// tests verdes que no testean nada.
//
// Después de verlo pasar, reescribilo bien en TEST 7 y comprobá
// que ahí sí falla.
// ─────────────────────────────────────────────────────────────
test("TRAMPA: este test miente y pasa igual", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  const botonInventado = page.getByRole("button", {
    name: "Este botón no existe en ningún lado",
  });

  // ❌ Falta el await, y expect() envuelve la Promise en vez del booleano
  expect(botonInventado.isVisible()).toBeTruthy();
});

// ─────────────────────────────────────────────────────────────
// TEST 7 — La versión correcta de la trampa.
// ─────────────────────────────────────────────────────────────
test("versión correcta: acá sí falla como corresponde", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  const botonInventado = page.getByRole("button", {
    name: "Este botón no existe en ningún lado",
  });

  // TODO 10 — RESUELTO (la versión CORRECTA de la aserción)
  //
  // La diferencia con la trampa del TEST 6:
  //   TEST 6:  expect( botonInventado.isVisible() ).toBeTruthy()
  //            → expect recibe una Promise (siempre truthy) → PASA en falso.
  //   TEST 7:  expect( botonInventado ).toBeVisible()
  //            → expect recibe el LOCATOR y toBeVisible() comprueba de verdad
  //              si el elemento está visible. Como el botón NO existe, la
  //              aserción reintenta 5s y falla con un timeout claro.
  //
  // Este test DEBE fallar: ese es el objetivo de la lección.
  // Lo dejo ACTIVO a propósito para que veas el fallo en el reporte.
  // Si más adelante querés la suite 100% verde, comentá la línea de abajo.
  await expect(botonInventado).toBeVisible();
});
