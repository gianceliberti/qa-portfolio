# Día 8 — API testing como código 🟡

**Ventaja tuya:** user provisioning y a billing API ya te dan contexto.

- `request` fixture de Playwright: tests de API sin browser.
- Estructura: contract → happy path → edge cases → auth → error handling.
- Códigos HTTP, headers, paginación, rate limiting, idempotencia.
- Postman/Newman: exportar colecciones a CI.
- Awareness: contract testing con Pact (concepto, no implementar aún).

**Ejercicio con tu contexto:** tests de API para un flujo user provisioning
(create user → update → deactivate → verificar). Queda espectacular en portfolio.

## Ya en esta carpeta
- [`posts.spec.ts`](posts.spec.ts) — arranque temprano: GET/POST contra
  JSONPlaceholder, validación de status, shape y caso 404.
