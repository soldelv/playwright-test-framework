# Playwright Test Automation Framework

This project is a test automation framework built with [Playwright](https://playwright.dev/), [TypeScript](https://www.typescriptlang.org/), and the Page Object Model (POM) design pattern. The framework is designed to automate test scenarios for the [Sauce Demo](https://www.saucedemo.com/) website.

---

## Features

- **Modern Testing Framework**: Uses Playwright and TypeScript for reliable and fast end-to-end testing.
- **Page Object Model (POM)**: Implements POM to keep test cases clean and maintainable.
- **Cross-Browser Support**: Runs tests in Chromium, Firefox, and WebKit browsers.
- **Headless Mode**: Supports headless and headed browser modes.
- **Reports**: Generates HTML reports for test results.
- **Retry Mechanism**: Automatically retries failed tests.

---

## Installation

### **1. Clone the Repository**
```bash
git clone https://github.com/soldelv/playwright-test-framework.git
cd playwright-test-framework
```
### **2. Install Dependencies**
Make sure you have Node.js installed. Then, run:
```bash
npm install
```

## Usage
#### **Run All Tests**
To execute all test cases:
```bash
npx playwright test
```
#### **Run Tests in Headed Mode**
To see the browser during test execution:
```bash
npx playwright test --headed
```

#### **Run a Single Test**
Specify a single test file to run:
```bash
npx playwright test tests/login.spec.ts
```

#### **Generate HTML Reports**
After running tests, view the report:
```bash
npx playwright show-report
```

## Project Structure
```css
project-root/
├── src/
│   ├── pages/                  # Page Object Model files
│   │   ├── LoginPage.ts        # Login page actions and locators
│   │   ├── ProductPage.ts      # Product page actions and locators
│   ├── tests/                  # Test files
│       ├── login.spec.ts     # Example test case
├── playwright.config.ts        # Playwright configuration
├── package.json                # Project metadata and dependencies
├── .gitignore                  # Files to ignore in Git
```
## Example Test
``` typescript
import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/loginPage'


test.describe('Login Page Suite', () => {
    let loginPage: LoginPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('should login successfully with valid credentials', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        expect(await loginPage.successLogin()).toBeTruthy();
    });

});
``` 

## Requirements
- Node.js (v16 or later)
- npm (installed with Node.js)
