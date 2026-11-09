# QA Portfolio — Playwright + TypeScript

[![Playwright Tests](https://github.com/gianceliberti/qa-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/gianceliberti/qa-portfolio/actions/workflows/playwright.yml)

End-to-end UI and API test automation with [Playwright](https://playwright.dev/) and TypeScript:
Page Objects, composed fixtures, synthetic test data, Docker, and a sharded CI pipeline running
across Chromium, Firefox and WebKit.

Built by **Gianfranco Celiberti**, QA Engineer · [LinkedIn](https://www.linkedin.com/in/gianfrancoceliberti/)

## Highlights

| Project | What it shows |
|---------|---------------|
| [**Project 1 — SauceDemo E2E suite**](tests/week-1-fundamentals/project-1/) | 17 risk-based tests (login, catalogue sorting, cart, checkout) × 3 browsers. Page Objects with no assertions inside, login once per worker via `storageState`, isolated parallel tests. |
| [**Project 2 — UI + API framework**](tests/week-2-architecture-api-cicd/project-2/) | Composed fixtures that hand tests ready, logged-in Page Objects. Faker factories shared by UI and API. API lifecycle tests (create → update → delete → verify) with auth, plus a 403 negative case. |
| [**CI pipeline**](.github/workflows/playwright.yml) | GitHub Actions on every push and PR: 3 parallel shards, retries with traces, screenshots and video on failure, and one merged HTML report as an artifact. |
| [**Docker**](Dockerfile) | Reproducible runs on the official Playwright image, with browsers included. |

## Design decisions

- **Resilient locators.** Role, label and test-id locators instead of CSS. A [measured demo](tests/week-1-fundamentals/day-3-locators/locators-css-vs-roles.spec.ts) shows role locators surviving a redesign that breaks CSS selectors.
- **Page Objects act, tests assert.** Page Objects expose locators and actions only; expectations stay in the specs.
- **Fast, isolated runs.** The expensive login runs once per worker and is reused; every test gets its own context, so the suite runs in parallel and in any order.
- **Synthetic data.** Factories generate fresh data each run, with overrides to pin what a negative case needs. No real data anywhere.
- **Risk-based coverage.** Tests are prioritised by impact × likelihood of failure, with extra weight on negative paths. Each project README explains what was covered, and what was deliberately left out.

## Getting started

```bash
npm install
npx playwright install
```

## Running tests

```bash
npm test                                  # full suite, 3 browsers
npx playwright test --project=chromium    # one browser (faster)
npx playwright test project-1             # one project or folder
npm run test:ui                           # interactive UI mode
npm run report                            # open the last HTML report
```

With Docker (no local Node or browsers needed):

```bash
docker compose up --build
```

## Systems under test

All public demo services, so the suite runs anywhere with no setup:

| Type | Target |
|------|--------|
| UI | [saucedemo.com](https://www.saucedemo.com) · [TodoMVC](https://demo.playwright.dev/todomvc) |
| API | [Restful Booker](https://restful-booker.herokuapp.com) · [JSONPlaceholder](https://jsonplaceholder.typicode.com) |

## Repository structure

The repo follows a 30-day QA → SDET roadmap. Weeks 1–2 (fundamentals, framework architecture,
API testing, Docker, CI/CD) are complete. Weeks 3–4 (mobile, desktop, performance, accessibility,
AI in testing) are in progress. Each day's folder holds its objective and commented code; see
[`tests/README.md`](tests/README.md) for progress.

## Tech

Playwright Test · TypeScript · Page Object Model · Faker · Docker · GitHub Actions
