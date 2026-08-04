# Día 6 — Page Object Model y alternativas ✅

**Objetivo:** saber estructurar el código de tests y elegir el patrón según el caso.

## El mismo flujo, 3 estilos (para comparar)

Los tres hacen lo mismo (login → agregar al carrito → verificar el badge), pero
con distinta arquitectura. Abrilos en orden y compará la legibilidad:

1. [`1-classic-pom.spec.ts`](1-classic-pom.spec.ts) — **POM clásico**: una clase por pantalla.
2. [`2-app-actions.spec.ts`](2-app-actions.spec.ts) — **App Actions**: funciones simples.
3. [`3-composed-fixtures.spec.ts`](3-composed-fixtures.spec.ts) — **Fixtures compuestas**: Playwright inyecta todo listo.

## Cuándo usar cada uno

| Patrón | Brilla cuando… | Es sobre-ingeniería cuando… |
|--------|----------------|------------------------------|
| **POM clásico** | Muchas pantallas, mucha reutilización, UI estable | Proyecto chico, flujos de una sola vez |
| **App Actions** | Pensás en *acciones del usuario*, querés menos ceremonia | Necesitás encapsular mucho estado por pantalla |
| **Fixtures compuestas** | Querés tests ultra-finos, con setup reutilizable inyectado | El setup es trivial (agrega indirección sin beneficio) |
| **Screenplay** | Suites grandes, mucha reutilización, lenguaje de negocio | Casi siempre — es potente pero verboso |

> **Screenplay** (solo awareness): actores que ejecutan tareas —
> `actor.attemptsTo(Login.withCredentials(user, pass))`. Muy expresivo, rara vez
> tu primera opción. Sirve conocerlo para una entrevista.

## La regla de oro 🏅

> **Si tu Page Object tiene assertions adentro, lo hiciste mal.**

El POM dice **cómo** interactuar; el test dice **qué** se espera.

```ts
// ❌ MAL — el Page Object "sabe" qué se espera. No es reutilizable.
class InventoryPage {
  async addToCartAndExpectBadge(product: string) {
    await this.addToCart(product);
    await expect(this.cartBadge).toHaveText("1"); // ← assertion adentro
  }
}

// ✅ BIEN — el Page Object solo actúa; el test verifica.
class InventoryPage {
  addToCart(product: string) { /* ...click... */ }
  readonly cartBadge = /* ...locator... */;
}
// en el test:
await inventory.addToCart("Sauce Labs Backpack");
await expect(inventory.cartBadge).toHaveText("1");
```

Por qué importa: si el `expect` vive en el POM, cada test que reusa ese método
queda atado a *esa* expectativa. El POM deja de servir para casos distintos y se
vuelve un método por escenario. Separando, el mismo `addToCart` sirve para "1",
para "2", o para verificar otra cosa.

## Correr
```bash
npx playwright test day-6 --project=chromium
```
