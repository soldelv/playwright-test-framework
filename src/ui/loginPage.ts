import { BasePage } from './basePage';
import { Page, Locator } from '@playwright/test';
import { ProductPage } from './productPage'

export class LoginPage extends BasePage {

    readonly usernameField: Locator
    readonly passwordField: Locator
    readonly loginButton: Locator
    readonly errorIcon: Locator

    constructor(page: Page) {
        super(page);
        this.usernameField = page.getByPlaceholder('Username')
        this.passwordField = page.getByPlaceholder('Password')
        this.loginButton = page.locator('#login-button')
        this.errorIcon = page.locator('.fa-times-circle')
    }

    async login(username: string, password: string): Promise<ProductPage> {
        await this.usernameField.fill(username)
        await this.passwordField.fill(password)
        await this.loginButton.click()

        return new ProductPage(this.page);
    }

    async successLogin(): Promise<boolean> {
        return (await this.logoTextField.textContent()) === 'Swag Labs'
    }

    async checkErrorIconsVisibility(): Promise<boolean> {
        return (await this.errorIcon.count()) === 2
    }
}