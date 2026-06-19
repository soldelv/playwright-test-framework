# Playwright Test Automation Framework with AI

A modern test automation framework built with [Playwright](https://playwright.dev/), [TypeScript](https://www.typescriptlang.org/), and the Page Object Model (POM) design pattern. Enhanced with AI-powered test generation and self-healing locators.

⭐ Designed to automate test scenarios for: [Sauce Demo](https://www.saucedemo.com/) | [Petstore APIs](https://petstore.swagger.io/#/)


## Features

### Core Testing
- **Modern Testing Framework**: Playwright + TypeScript for reliable E2E testing
- **Page Object Model (POM)**: Clean, maintainable test architecture
- **Cross-Browser Support**: Chromium, Firefox, WebKit
- **Headless & Headed Modes**: Flexible execution options
- **API Testing**: Petstore API automation included
- **HTML Reporting**: Beautiful test reports with screenshots & traces

### 🤖 AI Features
- **AI Test Generation**: Claude automatically generates 5 complete tests in 5 minutes
- **Self-Healing Locators**: Automatically recover from broken selectors
- **App Analysis**: Inspects your app structure to generate relevant tests
- **Free Alternatives**: Use Copilot, Claude Web, or Gemini for test generation

## 📋 Table of Contents

- [Set Up Guide](#installation)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [🤖 AI Test Generation](#-ai-test-generation)
- [Self-Healing Locators](#self-healing-locators)
- [Adding New Features](#adding-new-features-with-ai)
- [Test Reports](#viewing-test-reports)
- [CI/CD](#continuous-integration)
- [Documentation](#documentation)

## Installation
- See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete setup instructions

## Project Structure
```css
playwright-test-framework/
├── 📄 README.md                      # This file
├── 📄 SETUP_GUIDE.md                 # Detailed setup instructions
├── 📄 QUICK_START.md                 # Guide for adding new features
├── 📄 AI_TEST_GENERATION.md          # Technical reference
├── 📄 .env                           # Environment variables
├── 📄 .gitignore                     # Git ignore rules
│
├── 📁 scripts/                       # AI Test Generation Scripts
│   ├── analyzeApp.ts                 # Analyzes app structure
│   ├── generateTestsWithClaude.ts    # Claude AI integration
│   └── generateTestsWithAI.ts        # Local simulation
│
├── 📁 src/                           # Source code
│   ├── 📁 api/                       # API testing
│   │   ├── baseApi.ts                # Base API class
│   │   ├── loginApi.ts               # Login API
│   │   ├── userApi.ts                # User API
│   │   └── config/config.ts          # API config
│   │
│   ├── 📁 models/                    # Data models
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── credentials.ts
│   │   └── ...
│   │
│   └── 📁 ui/                        # UI Page Objects (POM)
│       ├── basePage.ts               # Base page class
│       ├── loginPage.ts              # Login page
│       ├── productPage.ts            # Products page
│       ├── cartPage.ts               # Cart page
│       ├── checkoutInformationPage.ts
│       ├── checkoutOverviewPage.ts
│       └── checkoutCompletePage.ts
│
├── 📁 tests/                         # Test files
│   ├── 📁 api/                       # API tests
│   │   ├── testLogin.test.ts
│   │   ├── testUser.test.ts
│   │   └── data/testData.ts
│   │
│   └── 📁 ui/                        # UI tests
│       ├── login.spec.ts
│       ├── products.spec.ts
│       ├── cart.spec.ts
│       ├── checkout.spec.ts
│       ├── selfHealingExamples.spec.ts
│       ├── aiGeneratedTests.spec.ts
│       ├── claudeGeneratedTests.spec.ts
│       └── data/testData.ts
│
├── 📁 resources/
│   └── 📁 images/                    # Test images
│
├── 📁 playwright-report/             # Generated test reports
│
├── 📄 playwright.config.ts           # Playwright configuration
├── 📄 tsconfig.json                  # TypeScript configuration
├── 📄 eslint.config.mjs              # ESLint configuration
├── 📄 package.json                   # Project dependencies
└── 📄 package-lock.json              # Locked dependency versions
```

## Running Tests
Run All Tests
```bash
npx playwright test
```
Run Tests in Headed Mode (Browser Visible)
```bash
npm run test:headed
```
Run Specific Test File
```bash
npm run test -- tests/ui/login.spec.ts
```
Run Tests with UI Mode (Interactive)
```bash
npx playwright test --ui
```
Run Tests with Debug Mode
```bash
npx playwright test --debug
```
Run API Tests Only
```bash
npm run test -- tests/api/
```
Run UI Tests Only
```bash
npm run test -- tests/ui/
```

## 🤖 AI Test Generation
#### Feature Overview
Automatically generate complete, functional test cases without writing code manually.

#### How It Works
```css
1. npm run analyze:app
   └─ Scans your app structure
   └─ Creates: app-analysis.json

2. npm run generate:claude-tests (or generate:ai-tests)
   └─ Sends analysis to Claude
   └─ Claude generates 5 complete tests
   └─ Creates: tests/ui/claudeGeneratedTests.spec.ts

3. npm run test:claude
   └─ Executes generated tests
   └─ All tests pass ✅
```
- See [AI_TEST_GENERATION.md](AI_TEST_GENERATION.md) for complete technical details

## Self-Healing Locators
#### What Problem Does It Solve?
When UI changes, selectors break. Self-Healing automatically finds the element using fallback strategies.
#### How to Use
```typescript
import { SelfHealingLocator } from '../../src/utils/selfHealing';

const loginButton = new SelfHealingLocator(
  page,
  'button:has-text("Login")',        // Primary strategy
  'button[data-test="login"]',       // Fallback 1
  '#login-button'                     // Fallback 2
);

await loginButton.click(0);  // Clicks the first matching element
```

#### **Features:**
- Multiple selector strategies
- Automatic fallback on failure
- Semantic selectors support
- Index-based selection (nth element)
#### **Benefits:**
- Reduces maintenance effort
- No manual selector updates needed
- Works with dynamic UIs
- Improves test stability

## Adding New Features with AI
- See [QUICK_START.md](QUICK_START.md) for complete guide

## Viewing Test Reports
Generate & view Report:
```bash
npm run test:report
```
Report Location
```css
playwright-report/
└── index.html  ← Open in browser
```
View GitHub Pages Report: https://soldelv.github.io/playwright-test-framework/


## Continuous Integration
#### CI Pipeline (GitHub Actions)
Automatically runs tests on every push to main branch.

#### Workflow:
1. Checkout code
2. Setup Node.js (v22.13.0)
3. Install dependencies
4. Install Playwright browsers
5. Run tests
6. Upload reports
7. Publish to GitHub Pages

#### View Results:
GitHub Actions tab → Latest workflow run
Or: https://github.com/soldelv/playwright-test-framework/actions

## Documentation
| Document | Purpose    |
| :---:   | :---: |
| README.md | You are here - Overview & features   |
| SETUP_GUIDE.md | Complete setup instructions   |
| QUICK_START.md | Quick reference for developers |
| AI_TEST_GENERATION.md | Technical reference for AI features |
	
	
	