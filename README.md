# Playwright Test Automation Framework

This project is a test automation framework built with [Playwright](https://playwright.dev/), [TypeScript](https://www.typescriptlang.org/), and the Page Object Model (POM) design pattern. The framework is designed to automate test scenarios for the [Sauce Demo](https://www.saucedemo.com/) website and API tests for the Petstore APIs [Swagger Petstore](https://petstore.swagger.io/#/).

---

## Features

- **Modern Testing Framework**: Uses Playwright and TypeScript for reliable and fast end-to-end testing.
- **Page Object Model (POM)**: Implements POM to keep test cases clean and maintainable.
- **Cross-Browser Support**: Runs tests in Chromium, Firefox, and WebKit browsers.
- **Headless Mode**: Supports headless and headed browser modes.
- **API Testing**: Includes API tests for Petstore APIs [Swagger Petstore](https://petstore.swagger.io/#/).
- **Reporting**: Generates HTML reports for both UI and API test results.
- **Continuous Integration**: GitHub Actions pipeline to run tests on every push.

---

## Prerequisites
Before setting up the project, ensure you have the following installed:
- **Node.js** (version 22.13.0 or higher)
- **npm** (comes with Node.js)

## Installation

**1. Clone the Repository**
```bash
git clone https://github.com/soldelv/playwright-test-framework.git
cd playwright-test-framework
```
**2. Navigate to the project directory**
```bash
cd playwright-test-framework
```

**3. Install Dependencies**
```bash
npm install
```

**4. Install Playwright browsers**
```bash
npx playwright install
```

## Project Structure
```css
playwright-test-framework/
├── resources/
│   └── images/                  # Images for tests
├── src/
│   └── api/                   
│   │   └── config/       
│   │   └── baseApi.ts       
│   │   └── petApi.ts      
│   │   └── storeApi.ts  
│   │   └── userApi.ts      
│   └── models/               
│   │   └── basicResponse.ts       
│   └── ui/                      # Page Object Models                   
│       └── basePage.ts     
│       └── cartPage.ts     
│       └── loginPage.ts       
├── tests/
│   └── api/                     
│   │   └── testPet.test.ts      # Example api test file     
│   └── ui/                   
│       └── login.spec.ts        # Example ui    test file              
├── .gitignore
├── README.md
├── eslint.config.mjs
├── package-lock.json
├── package.json
├── playwright.config.ts         # Playwright configuration
└── tsconfig.json                # TypeScript configuration
```
- playwright-report/: Directory where test reports are generated.
- resources/images/: Stores images used in tests.
- src/ui/: Contains Page Object Model classes.
- tests/: Directory for test files.
- playwright.config.ts: Configuration file for Playwright.
- tsconfig.json: Configuration file for TypeScript.

## Running Tests
To execute the tests, run:
```bash
npx playwright test
```
This command will run all tests located in the tests/ directory using the configuration specified in playwright.config.ts.

## Viewing Test Reports
After running the tests, an HTML report is generated in the playwright-report/ directory. To view the report:
```bash
npx playwright show-report
```
This will open the test report in your default web browser.

After every pipeline run the results are published in the Actions tab in the repository.

Last report is available via the following link: https://soldelv.github.io/playwright-test-framework/

## Continuous Integration
This project is set up with GitHub Actions for Continuous Integration (CI). The workflow file located at .github/workflows/pipeline.yml is configured to run the tests on each push to the master branch. The CI pipeline performs the following steps:

- Checks out the repository.
- Sets up Node.js (version 22.13.0).
- Installs project dependencies.
- Installs Playwright browsers.
- Executes the tests.
- Uploads the test report.
