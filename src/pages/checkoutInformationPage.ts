import { BasePage } from './basePage';
import { Locator, Page } from '@playwright/test';

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

    async completeCheckoutInformation(firstname: string, lastname: string, zipcode: string) {
        await this.firstname.fill(firstname)
        await this.lastname.fill(lastname)
        await this.zipcode.fill(zipcode)
        await this.continueBtn.click()
    }

}