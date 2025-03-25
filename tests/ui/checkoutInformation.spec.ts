import { test, expect } from '@playwright/test'
import { LoginPage } from '../../src/ui/loginPage'
import { CartPage } from '../../src/ui/cartPage'
import { CheckoutInformationPage } from '../../src/ui/checkoutInformationPage'
import { CheckoutInfo } from '../../src/models/checkoutInfo'
import { validUser } from './data/testData'

test.describe('Checkout: Your Information Page Suite', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)
        const cartPage = new CartPage(page)

        await loginPage.navigate()
        const productPage = await loginPage.login(validUser.username, validUser.password)

        await productPage.addNProductsToCart(1)
        await cartPage.goToCartPage()
        await cartPage.goToCheckoutPage()
    });

    [
        { checkoutInfo: new CheckoutInfo('', '', ''), expectedError: 'Error: First Name is required' },
        { checkoutInfo: new CheckoutInfo('John', '', ''), expectedError: 'Error: Last Name is required' },
        { checkoutInfo: new CheckoutInfo('John', 'Smith', ''), expectedError: 'Error: Postal Code is required' },

    ].forEach(({ checkoutInfo, expectedError }) => {
        test(`test invalid checkout information with expectedError: "${expectedError}"`, async ({ page }) => {

            const checkoutInformation = new CheckoutInformationPage(page)
            await checkoutInformation.completeCheckoutInformation(checkoutInfo)
            const errorMessage = await checkoutInformation.getErrorMessage()
            expect(errorMessage).toContain(expectedError)
        });
    });

});

