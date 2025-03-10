import { test, expect } from '@playwright/test'
import { LoginPage } from '../../src/ui/loginPage'
import { ProductsPage } from '../../src/ui//productsPage'
import { CartPage } from '../../src/ui/cartPage'
import { CheckoutInformationPage } from '../../src/ui/checkoutInformationPage'
import { CheckoutOverviewPage } from '../../src/ui/checkoutOverviewPage'
import { CheckoutCompletePage } from '../../src/ui/checkoutCompletePage'

test.describe('E2E Test for Checkout', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.navigate()
        await loginPage.login('standard_user', 'secret_sauce')
    });

    test('test successfully checkout', async ({ page }) => {
        const productsPage = new ProductsPage(page)
        await productsPage.addNProductsToCart(1)
        await productsPage.checkRemoveButtonIsDisplayedInFirstProduct()

        const cartPage = new CartPage(page)
        await cartPage.goToCartPage()
        expect(await cartPage.goToCheckoutPage()).toBeTruthy()
        
        const checkoutInformation = new CheckoutInformationPage(page)
        await checkoutInformation.completeCheckoutInformation("John", "Smith", "1000MX")
        
        const checkoutOverviewPage = new CheckoutOverviewPage(page)
        expect(await checkoutOverviewPage.checkNumberOfProductsOnCart(1))
        await checkoutOverviewPage.completeCheckout()
        
        const checkoutCompletePage = new CheckoutCompletePage(page)
        expect(await checkoutCompletePage.successCheckoutMessageIsDisplayed()).toBeTruthy()
    });

});

