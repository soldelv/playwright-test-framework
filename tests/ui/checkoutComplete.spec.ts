import { test, expect } from '@playwright/test'
import { LoginPage } from '../../src/ui/loginPage'
import { ProductPage } from '../../src/ui/productPage'
import { CartPage } from '../../src/ui/cartPage'
import { validUser, checkoutInfo } from './data/testData'
import { Product } from '../../src/models/product'

test.describe('Test Full Checkout', () => {

    let productPage: ProductPage

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)

        await loginPage.navigate()
        productPage = await loginPage.login(validUser.username, validUser.password)
    });

    test('test successfully checkout', async ({ page }) => {
        const productList: Product[] = await productPage.addToCartNProducts(3)
        const totalPrice: number = productPage.calculateTotalPrice(productPage.extractPrices(productList))

        const cartPage = new CartPage(page)
        await cartPage.goToCartPage()
        const checkoutInformation = await cartPage.goToCheckoutPage()

        const checkoutOverviewPage = await checkoutInformation.completeCheckoutInformation(checkoutInfo)

        expect(await checkoutOverviewPage.checkTotalPrice(totalPrice)).toBeTruthy()
        expect(await checkoutOverviewPage.checkTaxAndTotal(totalPrice)).toBeTruthy()
        const checkoutCompletePage = await checkoutOverviewPage.completeCheckout()

        expect(await checkoutCompletePage.successCheckoutMessageIsDisplayed()).toBeTruthy()

    });

});