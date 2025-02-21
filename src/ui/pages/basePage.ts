import { Locator, Page } from '@playwright/test';

export abstract class BasePage {
    protected page: Page;
    readonly pageTitle: Locator
    readonly logoTextField: Locator
    readonly cartBtn: Locator
    readonly errorMessage: Locator


    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.locator('.title')
        this.logoTextField = page.locator('.app_logo')
        this.cartBtn = page.locator('.shopping_cart_link')
        this.errorMessage = page.locator('h3[data-test="error"]')
    }

    async navigate() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async goToCartPage() {
        await this.cartBtn.click();
    }

    async checkCartIconContainsProductsSelected(products: number): Promise<boolean> {
        const cartBtn = await this.cartBtn.textContent()
        return Number(cartBtn) === products
    }

    async getErrorMessage(): Promise<string> {
        return (await this.errorMessage.textContent()) ?? ''
    }
}