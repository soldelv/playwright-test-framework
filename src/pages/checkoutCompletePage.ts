import { BasePage } from './basePage';
import { Locator, Page } from '@playwright/test';

export class CheckoutCompletePage extends BasePage {

    readonly successTitle: Locator
    readonly successDescription: Locator
    readonly backHomeBtn: Locator

    constructor(page: Page) {
        super(page);
        this.successTitle = page.getByText('Thank you for your order!')
        this.successDescription = page.getByText('Your order has been dispatched, and will arrive just as fast as the pony can get there!')
        this.backHomeBtn = page.getByText('Back Home')
    }

    async successCheckoutMessageIsDisplayed(): Promise<boolean> {
        return (await this.successTitle.isVisible() && await this.successDescription.isVisible())
    }

    async goBackToHomePage(): Promise<boolean> {
        await this.backHomeBtn.click();
        return (await this.pageTitle.textContent()) === 'Products'
    }
}