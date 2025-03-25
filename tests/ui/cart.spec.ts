import { test, expect } from '@playwright/test'
import { LoginPage } from '../../src/ui/loginPage'
import { ProductPage } from '../../src/ui/productPage'
import { CartPage } from '../../src/ui/cartPage'
import { validUser } from './data/testData'

test.describe('Cart Page Suite', () => {
    let productPage: ProductPage
    let cartPage: CartPage

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)
        
        await loginPage.navigate()
        productPage = await loginPage.login(validUser.username, validUser.password)
        cartPage = new CartPage(page)
    });

    test('add and remove all products from cart', async ({ page }) => {
        await productPage.addNProductsToCart(2)
        await productPage.checkRemoveButtonIsDisplayedInFirstNProducts(2)

        await cartPage.goToCartPage()
        await cartPage.removeNProductsFromCart(2)
        expect(await cartPage.removeBtn.isVisible()).toBeFalsy()
    });

    test('verify cart icon number is updated when remove a product from cart', async ({ page }) => {
        await productPage.addNProductsToCart(3)
        await cartPage.goToCartPage()
        expect(await cartPage.checkCartIconContainsProductsSelected(3)).toBeTruthy()

        await cartPage.removeNProductsFromCart(1)
        expect(await cartPage.checkCartIconContainsProductsSelected(2)).toBeTruthy()
    });

});

