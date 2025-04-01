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

    async checkTotalPrice(expectedPriceTotal: number): Promise<boolean> {
        const totalPrice = await this.page.locator('.summary_subtotal_label').textContent()
        const totalPriceValue = parseFloat(totalPrice?.replace('Item total: $', '') ?? '0')

        return totalPriceValue == expectedPriceTotal
    }

    async checkTaxAndTotal(expectedPriceTotal: number): Promise<boolean> {
        const expectedTax = parseFloat((expectedPriceTotal * 0.08).toFixed(2))
        const expectedTotal = expectedPriceTotal + expectedTax

        const tax = await this.page.locator('.summary_tax_label').textContent()
        const taxValue = parseFloat(tax?.replace('Tax: $', '') ?? '0')
        const total = await this.page.locator('.summary_total_label').textContent()
        const totalValue = parseFloat(total?.replace('Total: $', '') ?? '0')

        return taxValue === expectedTax && totalValue === expectedTotal
    }

    async completeCheckout(): Promise<CheckoutCompletePage> {
        await this.finishBtn.click()
        return new CheckoutCompletePage(this.page)
    }

}