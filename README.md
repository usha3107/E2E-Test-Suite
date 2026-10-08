# Playwright E2E Test Suite for E-Commerce Checkout Flow

This repository contains an end-to-end (E2E) automated test suite built with [Playwright](https://playwright.dev/) and TypeScript for testing an e-commerce checkout flow. The project implements the Page Object Model (POM) design pattern to achieve clean, maintainable, and scalable test architecture.

---

## 🏗️ Project Architecture & POM Structure

The test suite follows the Page Object Model (POM) design pattern, separating UI selectors and interactions from test logic.

```
.
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI Workflow
├── tests/
│   ├── pages/                     # Page Object Model Classes
│   │   ├── LoginPage.ts           # Login page locators & methods
│   │   ├── ProductsPage.ts        # Products page locators & methods
│   │   ├── CartPage.ts            # Cart page locators & methods
│   │   ├── CheckoutPage.ts        # Checkout page locators & methods
│   │   └── ConfirmationPage.ts    # Confirmation page locators & methods
│   └── specs/                     # End-to-End Test Specifications
│       └── checkout.spec.ts       # Test cases (Happy path, empty cart, expired session)
├── server.js                      # Target E-Commerce Mock Server
├── playwright.config.ts           # Playwright Configuration & Failure Artifacts
├── package.json                   # Dependencies & Scripts
└── README.md                      # Project documentation
```

---

## 📦 Setup

Follow these steps to set up the project locally:

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd E2E-Test-Suite
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npx playwright install --with-deps
   ```

---

## 🚀 Running Tests

### 1. Run all Playwright E2E tests:
```bash
npx playwright test
```

> **Note:** The target application server (`server.js`) is automatically launched on `http://localhost:8080` by Playwright's `webServer` configuration before tests run.

### 2. Run tests in UI mode (Interactive Debugger):
```bash
npx playwright test --ui
```

### 3. Run tests in headed browser mode:
```bash
npx playwright test --headed
```

### 4. View Test HTML Report:
```bash
npx playwright show-report
```

---

## 📊 Debugging Failure Artifacts

The test suite is configured in `playwright.config.ts` to automatically capture rich debugging artifacts when tests fail:
- **Screenshots**: Saved on test failure (`screenshot: 'only-on-failure'`).
- **Videos**: Recorded on test failure (`video: 'retain-on-failure'`).
- **Traces**: Captured on first retry (`trace: 'on-first-retry'`).

View detailed traces using:
```bash
npx playwright show-trace path/to/trace.zip
```

---

## ⚙️ CI/CD Integration

The repository includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that automatically:
1. Runs on every push or pull request to `main` / `master`.
2. Installs Node.js and dependencies using `npm ci`.
3. Installs Playwright browser binaries with system dependencies.
4. Executes `npx playwright test`.
5. Uploads the `playwright-report/` artifact on test run completion (`if: always()`).
