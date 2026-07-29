# QA Portfolio — Playwright + TypeScript

End-to-end and API test automation showcase built with [Playwright](https://playwright.dev/) and TypeScript, organised as a **30-day QA→SDET roadmap**.

> 📍 **Roadmap and progress:** see [`tests/README.md`](tests/README.md). The repo is
> structured by week and day; each folder holds that day's objective and commented code.

## What's inside

| Area | File | Demonstrates |
|------|------|--------------|
| UI E2E | [`todomvc.spec.ts`](tests/week-1-fundamentals/day-2-first-contact/todomvc.spec.ts) | User flows via the Page Object Model, cross-browser runs, reload persistence |
| Page Object | [`login.page.ts`](tests/week-1-fundamentals/day-2-first-contact/pages/login.page.ts) | Encapsulated locators and actions for maintainable specs |
| Locators | [`locators-css-vs-roles.spec.ts`](tests/week-1-fundamentals/day-3-locators/locators-css-vs-roles.spec.ts) | Measured demo: role-based locators survive a CSS redesign, CSS selectors don't |
| API | [`posts.spec.ts`](tests/week-2-architecture-api-cicd/day-8-api-testing/posts.spec.ts) | Status codes, payload/shape assertions, GET/POST, negative cases |
| CI | [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) | Automated runs on every push/PR with report artifacts |

## Getting started

```bash
npm install
npx playwright install
```

## Running tests

```bash
npm test              # run the full suite (chromium, firefox, webkit)
npm run test:ui       # interactive UI mode
npm run test:headed   # watch the browser
npm run test:debug    # step-through debugger
npm run report        # open the last HTML report
```

Run a single project or file:

```bash
npx playwright test --project=chromium
npx playwright test day-2        # filter by path (e.g. a given day)
```

## Tech

- **Playwright Test** — runner, assertions, tracing, HTML reporting
- **TypeScript** — typed specs and page objects
- **Page Object Model** — separation of test intent from page details
- **GitHub Actions** — continuous integration across Chromium, Firefox and WebKit

## Test targets

The suite runs against public demo services so it works anywhere with no setup:

- UI: `https://demo.playwright.dev/todomvc`
- API: `https://jsonplaceholder.typicode.com`
