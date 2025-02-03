import { BasePage } from './basePage';
import { Locator, Page } from '@playwright/test';

export class CartPage extends BasePage {

    readonly continueShoppingBtn: Locator
    readonly checkoutBtn: Locator
    readonly removeBtn: Locator

    constructor(page: Page) {
        super(page);
        this.continueShoppingBtn = page.getByText('Continue Shopping')
        this.checkoutBtn = page.getByText('Checkout')
        this.removeBtn = page.getByText('Remove')
    }

    async removeNProductsToCart(products: number) {
        const buttons = await this.removeBtn.count();
        if (buttons === 0) {
            for (let i = 0; i < products; i++) {
                const product = await this.removeBtn.nth(i);
                await product.isVisible();
                await product.click();
            }
        }
    }

    // remove 1 product from cart, cart icon decrease by 1

    // continue shopping button by clicking in checkout button
}