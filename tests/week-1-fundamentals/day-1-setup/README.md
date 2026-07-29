# Día 1 — Setup y TypeScript mínimo viable ✅

**Objetivo:** dejar el entorno listo y el repo con base sólida.

## Del plan
- Node LTS, npm, VS Code + extensión de Playwright.
- TypeScript, solo lo necesario: tipos básicos, interfaces, `async/await`,
  promesas, arrow functions, módulos, destructuring, optional chaining.
- Git en serio: branches, rebase, PRs.

## Qué se hizo
- Repo `qa-portfolio` inicializado (identidad personal `gianceliberti@gmail.com`)
  y publicado en GitHub (privado).
- Playwright + TypeScript instalados; `playwright.config.ts` con 3 browsers,
  trace/screenshot/video on-failure.
- CI de GitHub Actions ([`.github/workflows/playwright.yml`](../../../.github/workflows/playwright.yml)).
- `.gitignore`, `README.md` del portfolio, y [`atajos.sh`](../../../atajos.sh)
  (atajos para UI mode y reporte HTML).

> Nota: los tests de "primer contacto" (SauceDemo login con Page Object, TodoMVC
> y la suite de API) se armaron junto con el setup y viven en el
> [Día 2](../day-2-first-contact/) y en el
> [Día 8 (API)](../../week-2-architecture-api-cicd/day-8-api-testing/).
