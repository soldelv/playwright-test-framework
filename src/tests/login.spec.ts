import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';


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

    // TODO: the following tests are the same, need to improve the code and apply parameterization

    test('should display error for invalid credentials', async () => {
        await loginPage.login('standard_user', 'invalid_password');
        expect(loginPage.checkErrorIconsVisibility()).toBeTruthy();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
    });

    test('should display error for missing username', async () => {
        await loginPage.login('', 'secret_sauce');
        expect(loginPage.checkErrorIconsVisibility()).toBeTruthy();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: Username is required');
    });

    test('should display error for missing password', async () => {
        await loginPage.login('invalid_user', '');
        expect(loginPage.checkErrorIconsVisibility()).toBeTruthy();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: Password is required');
    });

    test('should display error for locked user', async () => {
        await loginPage.login('locked_out_user', 'secret_sauce');
        expect(loginPage.checkErrorIconsVisibility()).toBeTruthy();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out.');
    });

});

