# Día 3 — Locators: CSS frágil vs. roles robustos

Demostración medible de por qué elegir bien los locators decide si una suite
sobrevive a los cambios del equipo de desarrollo.

## La idea

Dos versiones de la **misma** pantalla de login, idénticas para el usuario,
con las **clases CSS renombradas** (como en un rediseño real):

- [`fixtures/login-v1.html`](fixtures/login-v1.html) → clases originales
- [`fixtures/login-v2.html`](fixtures/login-v2.html) → clases renombradas

El mismo test escrito de dos formas ([`locators-fragiles-vs-roles.spec.ts`](locators-fragiles-vs-roles.spec.ts)):

| Enfoque | Cómo busca | Sobrevive al rediseño |
|--------|-----------|:---:|
| CSS frágil (`.login-submit`) | por clase de estilo | ❌ |
| Roles robustos (`getByRole`/`getByLabel`) | como lo ve el usuario | ✅ |

## Cómo reproducirlo

```bash
# Ronda 1 — clases originales: pasa todo
npx playwright test dia3 --project=chromium

# Ronda 2 — clases renombradas: el CSS se rompe, los roles sobreviven
APP_VERSION=v2 npx playwright test dia3 --project=chromium
```

## El resultado (la medición)

Con **un solo** rediseño de clases:

- Enfoque por **roles**: 0 / 3 selectores rotos.
- Enfoque por **CSS**: 3 / 3 selectores muertos.
- Bonus: la ronda con CSS roto tarda ~16× más, porque cada selector
  inexistente espera su timeout de 5s (auto-waiting).

## Ver la evidencia del fallo

```bash
APP_VERSION=v2 npx playwright test dia3 --project=chromium   # genera el fallo
npx playwright show-report                                   # screenshot + video + traza
```
