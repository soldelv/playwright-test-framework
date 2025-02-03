import { BasePage } from './basePage';
import { Page, Locator } from '@playwright/test';

export class LoginPage extends BasePage {

    readonly usernameField: Locator
    readonly passwordField: Locator
    readonly loginButton: Locator
    readonly errorMessage: Locator
    readonly errorIcon: Locator

    constructor(page: Page) {
        super(page);
        this.usernameField = page.getByPlaceholder('Username')
        this.passwordField = page.getByPlaceholder('Password')
        this.loginButton = page.locator('#login-button')
        this.errorMessage = page.locator('h3[data-test="error"]')
        this.errorIcon = page.locator('.fa-times-circle')
    }

    async login(username: string, password: string) {
        await this.usernameField.fill(username)
        await this.passwordField.fill(password)
        await this.loginButton.click()
    }

    async getErrorMessage(): Promise<string> {
        return (await this.errorMessage.textContent()) ?? ''
    }

    async successLogin(): Promise<boolean> {
        return (await this.logoTextField.textContent()) === 'Swag Labs'
    }

    async checkErrorIconsVisibility(): Promise<boolean> {
        return (await this.errorIcon.count()) === 2
    }
}