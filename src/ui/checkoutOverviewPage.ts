import { BasePage } from './basePage';
import { Locator, Page } from '@playwright/test';
import { CheckoutCompletePage } from '../../src/ui/checkoutCompletePage'

export class CheckoutOverviewPage extends BasePage {

    readonly cartItem: Locator
    readonly finishBtn: Locator
    readonly cancelBtn: Locator

    constructor(page: Page) {
        super(page);
        this.cartItem = page.locator('.cart_item')
        this.finishBtn = page.locator('#finish')
        this.cancelBtn = page.locator('#cancel')
    }

    async checkNumberOfProductsOnCart(products: number): Promise<boolean> {
        return (await this.cartItem.count()) === products
    }

    async completeCheckout(): Promise<CheckoutCompletePage> {
        await this.finishBtn.click()
        return new CheckoutCompletePage(this.page)
    }

}