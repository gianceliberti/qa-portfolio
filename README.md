# QA Portfolio — Playwright + TypeScript

End-to-end and API test automation showcase built with [Playwright](https://playwright.dev/) and TypeScript.

## What's inside

| Area | File | Demonstrates |
|------|------|--------------|
| UI E2E | [`tests/ui/todo.spec.ts`](tests/ui/todo.spec.ts) | User flows via the Page Object Model, cross-browser runs, reload persistence |
| Page Object | [`tests/pages/todo.page.ts`](tests/pages/todo.page.ts) | Encapsulated locators and actions for maintainable specs |
| API | [`tests/api/posts.spec.ts`](tests/api/posts.spec.ts) | Status codes, payload/shape assertions, GET/POST, negative cases |
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
npx playwright test tests/api/posts.spec.ts
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
