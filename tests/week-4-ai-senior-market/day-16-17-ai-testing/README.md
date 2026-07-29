# Día 16–17 — IA aplicada a testing ⚪

Separar lo real de los "wrappers de GPT":

- **a) Generación con agentes:** Playwright MCP server (`npx @playwright/mcp@latest`)
  + Claude Code. El agente ve la página viva y genera locators contra el DOM real.
  Disciplina de review obligatoria: roles/testId en vez de selectores frágiles,
  assertions que comprueban resultados, correr 3× en verde antes de commitear.
- **b) Self-healing:** DOM-based (frágil) vs intención cacheada. Postura crítica:
  puede ocultar bugs reales.
- **c) Testing agéntico:** planner/generator/healer. AI-assisted vs agentic.
- **d) Análisis de fallos:** clustering, root cause, selección por riesgo.
- **e) Testear sistemas con IA (el skill emergente):** no-determinismo, evals
  (golden datasets, LLM-as-judge), prompt injection, alucinaciones, regresión.

> Ventaja tuya: ya construís skills de Claude (`bug-report generator`,
> `release-notes generator`). Eso YA es IA aplicada a QA. Empaquetalo y contalo.
