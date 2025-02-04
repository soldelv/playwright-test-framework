import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/loginPage'


test.describe('Login Page Suite', () => {
    let loginPage: LoginPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page)
        await loginPage.navigate()
    });

    test('test login successfully with valid credentials', async () => {
        await loginPage.login('standard_user', 'secret_sauce')
        expect(await loginPage.successLogin()).toBeTruthy()
    });

    [
        { username: 'standard_user', password: 'invalid_password', expectedError: 'Epic sadface: Username and password do not match any user in this service' },
        { username: '', password: 'secret_sauce', expectedError: 'Epic sadface: Username is required' },
        { username: 'invalid_user', password: '', expectedError: 'Epic sadface: Password is required' },
        { username: 'locked_out_user', password: 'secret_sauce', expectedError: 'Epic sadface: Sorry, this user has been locked out.' },
    ].forEach(({ username, password, expectedError }) => {
        test(`test invalid login with ${expectedError}`, async () => {
            await loginPage.login(username, password)
            expect(await loginPage.checkErrorIconsVisibility()).toBeTruthy()
            const errorMessage = await loginPage.getErrorMessage()
            expect(errorMessage).toContain(expectedError)
        });
    });

});