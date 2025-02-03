import { Locator, Page } from '@playwright/test';

export class BasePage {
    protected page: Page;
    readonly logoTextField: Locator
    readonly cartBtn: Locator

    constructor(page: Page) {
        this.page = page;
        this.logoTextField = page.locator('.app_logo')
        this.cartBtn = page.locator('.shopping_cart_link')
    }

    async navigate() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async goToCartPage() {
        await this.cartBtn.isVisible();
        await this.cartBtn.click();
    }
}