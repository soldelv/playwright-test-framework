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

    async goToCheckoutPage(): Promise<boolean> {
        await this.checkoutBtn.click();
        return (await this.pageTitle.textContent()) === 'Checkout: Your Information'
    }

    async removeFirstProductFromCart() {
        const product = await this.removeBtn.first()
        await product.click()
    }

    async removeNProductsFromCart(products: number) {
        while (products-- > 0) {
            await (await this.removeBtn.first()).click();
        }
    }

}