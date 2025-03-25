import { test, expect } from '@playwright/test'
import { LoginPage } from '../../src/ui/loginPage'
import { ProductPage } from '../../src/ui/productPage'
import { CartPage } from '../../src/ui/cartPage'
import { validUser, checkoutInfo } from './data/testData'

test.describe('E2E Test for Checkout', () => {
    let productsPage: ProductPage

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)
        
        await loginPage.navigate()
        productsPage = await loginPage.login(validUser.username, validUser.password)
    });

    test('test successfully checkout', async ({ page }) => {
        await productsPage.addNProductsToCart(1)
        await productsPage.checkRemoveButtonIsDisplayedInFirstProduct()

        const cartPage = new CartPage(page)
        await cartPage.goToCartPage()
        const checkoutInformation = await cartPage.goToCheckoutPage()

        const checkoutOverviewPage = await checkoutInformation.completeCheckoutInformation(checkoutInfo)

        expect(await checkoutOverviewPage.checkNumberOfProductsOnCart(1))
        const checkoutCompletePage = await checkoutOverviewPage.completeCheckout()

        expect(await checkoutCompletePage.successCheckoutMessageIsDisplayed()).toBeTruthy()
    });

});

