import { Locator, Page } from '@playwright/test';

export class LoginPage {

    readonly page: Page
    readonly logoTextField: Locator
    readonly usernameField: Locator
    readonly passwordField: Locator
    readonly loginButton: Locator
    readonly errorMessage: Locator
    readonly errorIcon: Locator

    constructor(page: Page) {
        this.page = page
        this.logoTextField = page.locator('.app_logo')
        this.usernameField = page.getByPlaceholder('Username')
        this.passwordField = page.getByPlaceholder('Password')
        this.loginButton = page.locator('#login-button')
        this.errorMessage = page.locator('h3[data-test="error"]')
        this.errorIcon = page.locator('.fa-times-circle')
    }

    async navigate() {
        await this.page.goto('https://www.saucedemo.com/');
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