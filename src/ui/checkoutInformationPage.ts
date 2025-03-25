import { BasePage } from './basePage'
import { Locator, Page } from '@playwright/test'
import { CheckoutOverviewPage } from '../../src/ui/checkoutOverviewPage'
import { CheckoutInfo } from '../../src/models/checkoutInfo'

export class CheckoutInformationPage extends BasePage {

    readonly firstname: Locator
    readonly lastname: Locator
    readonly zipcode: Locator
    readonly continueBtn: Locator
    readonly cancelBtn: Locator

    constructor(page: Page) {
        super(page);
        this.firstname = page.getByPlaceholder('First Name')
        this.lastname = page.getByPlaceholder('Last Name')
        this.zipcode = page.getByPlaceholder('Zip/Postal Code')
        this.continueBtn = page.locator('#continue')
        this.cancelBtn = page.locator('#cancel')
    }

    async completeCheckoutInformation(checkoutInfo: CheckoutInfo): Promise<CheckoutOverviewPage> {
        await this.firstname.fill(checkoutInfo.firstname)
        await this.lastname.fill(checkoutInfo.lastname)
        await this.zipcode.fill(checkoutInfo.zipcode)
        await this.continueBtn.click()

        return new CheckoutOverviewPage(this.page)
    }

}