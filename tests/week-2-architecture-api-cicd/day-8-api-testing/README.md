# Día 8 — API testing como código ✅

Testear la API directamente es **rápido**, **estable** (no se rompe por cambios de
UI) y **profundo**: la mayoría de los bugs críticos viven en esta capa.

## Qué hay en esta carpeta

- [`helpers/api.ts`](helpers/api.ts) — base URL, factory `makeBooking` (Faker) y
  `getAuthToken` (las operaciones que modifican datos exigen token).
- [`booking-api.spec.ts`](booking-api.spec.ts) — suite estructurada contra
  restful-booker (CRUD + auth reales):
  - **Contract** — status, headers y forma del recurso.
  - **Ciclo de vida** — create → update → deactivate → verify (aprovisionamiento de un recurso).
  - **Auth** — token válido; DELETE sin token → 403.
  - **Errores** — GET inexistente → 404.
- [`posts.spec.ts`](posts.spec.ts) — arranque temprano (JSONPlaceholder).

## La estructura profesional de un test de API
```
Contract    → ¿la respuesta tiene la forma y el status correctos?
Happy path  → el flujo principal funciona
Edge cases  → 404, límites, datos que no existen
Auth        → sin token te rechaza; con token te deja
Errors      → payloads inválidos, códigos de error correctos
```

## Códigos HTTP (el idioma de las APIs)
- **2xx** todo bien (200 OK, 201 Created) · **4xx** culpa del cliente (400, 401/403, 404)
  · **5xx** culpa del servidor (500).

## El patrón de aprovisionamiento (lifecycle)
`create → update → deactivate → verify` aparece en casi cualquier sistema que
gestione usuarios o recursos: identidad, facturación, reservas, catálogos.
Es uno de los patrones más reutilizables del testing de APIs: si lo dominás, lo
aplicás a casi cualquier servicio.

## Conceptos a conocer (awareness)
- **Idempotencia:** repetir una operación no rompe el estado. Acá cada test usa
  datos únicos (Faker) y limpia lo que crea.
- **Paginación / rate limiting:** APIs reales devuelven páginas y limitan pedidos;
  los tests deben respetarlos.
- **Postman/Newman:** Postman para explorar a mano; **Newman** corre esas
  colecciones en CI. El mercado todavía lo pide — sabé exportar/ejecutar.
- **Pact (contract testing):** verifica que consumidor y proveedor coincidan en el
  contrato. Útil con microservicios / múltiples consumidores. Solo concepto por ahora.

## Correr
```bash
npx playwright test day-8 --project=chromium
```
