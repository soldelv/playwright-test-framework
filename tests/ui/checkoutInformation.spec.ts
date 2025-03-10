import { test, expect } from '@playwright/test'
import { LoginPage } from '../../src/ui/loginPage'
import { ProductsPage } from '../../src/ui/productsPage'
import { CartPage } from '../../src/ui/cartPage'
import { CheckoutInformationPage } from '../../src/ui/checkoutInformationPage'

test.describe('Checkout: Your Information Page Suite', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)
        const productsPage = new ProductsPage(page)
        const cartPage = new CartPage(page)

        await loginPage.navigate()
        await loginPage.login('standard_user', 'secret_sauce')
        await productsPage.addNProductsToCart(1)
        await cartPage.goToCartPage()
        await cartPage.goToCheckoutPage()
    });

    [
        { firstname: '', lastname: '', zipcode: '', expectedError: 'Error: First Name is required' },
        { firstname: 'John', lastname: '', zipcode: '', expectedError: 'Error: Last Name is required' },
        { firstname: 'John', lastname: 'Smith', zipcode: '', expectedError: 'Error: Postal Code is required' },
    ].forEach(({ firstname, lastname, zipcode, expectedError }) => {
        test(`test invalid checkout information with expectedError: "${expectedError}"`, async ({ page }) => {

            const checkoutInformation = new CheckoutInformationPage(page)
            await checkoutInformation.completeCheckoutInformation(firstname, lastname, zipcode)
            const errorMessage = await checkoutInformation.getErrorMessage()
            expect(errorMessage).toContain(expectedError)
        });
    });

});

