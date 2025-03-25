import { BasePage } from './basePage';
import { Locator, Page } from '@playwright/test';
import { CheckoutInformationPage } from '../../src/ui/checkoutInformationPage'

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

    async goToCheckoutPage(): Promise<CheckoutInformationPage> {
        await this.checkoutBtn.click();
        return new CheckoutInformationPage(this.page)
    }

    async removeFirstProductFromCart() {
        const product = await this.removeBtn.first()
        await product.click()
    }

    async removeNProductsFromCart(products: number) {
        while (products-- > 0) {
            await (await this.removeBtn.first()).click()
        }
    }

}