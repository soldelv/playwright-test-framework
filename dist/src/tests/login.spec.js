"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const loginPage_1 = require("../pages/loginPage");
test_1.test.describe('Login Page Suite', () => {
    let loginPage;
    test_1.test.beforeEach(async ({ page }) => {
        loginPage = new loginPage_1.LoginPage(page);
        await loginPage.navigate();
    });
    (0, test_1.test)('should login successfully with valid credentials', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        (0, test_1.expect)(await loginPage.successLogin()).toBeTruthy();
    });
    // TODO: the following tests are the same, need to improve the code and apply parameterization
    (0, test_1.test)('should display error for invalid credentials', async () => {
        await loginPage.login('standard_user', 'invalid_password');
        (0, test_1.expect)(loginPage.checkErrorIconsVisibility()).toBeTruthy();
        const errorMessage = await loginPage.getErrorMessage();
        (0, test_1.expect)(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
    });
    (0, test_1.test)('should display error for missing username', async () => {
        await loginPage.login('', 'secret_sauce');
        (0, test_1.expect)(loginPage.checkErrorIconsVisibility()).toBeTruthy();
        const errorMessage = await loginPage.getErrorMessage();
        (0, test_1.expect)(errorMessage).toContain('Epic sadface: Username is required');
    });
    (0, test_1.test)('should display error for missing password', async () => {
        await loginPage.login('invalid_user', '');
        (0, test_1.expect)(loginPage.checkErrorIconsVisibility()).toBeTruthy();
        const errorMessage = await loginPage.getErrorMessage();
        (0, test_1.expect)(errorMessage).toContain('Epic sadface: Password is required');
    });
    (0, test_1.test)('should display error for locked user', async () => {
        await loginPage.login('locked_out_user', 'secret_sauce');
        (0, test_1.expect)(loginPage.checkErrorIconsVisibility()).toBeTruthy();
        const errorMessage = await loginPage.getErrorMessage();
        (0, test_1.expect)(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out.');
    });
});
