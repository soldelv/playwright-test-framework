import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/loginPage'
import { ProductsPage } from '../../pages/productsPage'
import { CartPage } from '../../pages/cartPage'

test.describe('Cart Page Suite', () => {
    let cartPage: CartPage

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.navigate()
        await loginPage.login('standard_user', 'secret_sauce')
    });

    test('add and remove all products from cart', async ({ page }) => {
        const productsPage = new ProductsPage(page)
        await productsPage.addNProductsToCart(2)
        await productsPage.checkRemoveButtonIsDisplayedInFirstNProducts(2)

        const cartPage = new CartPage(page)
        await cartPage.goToCartPage()
        await cartPage.removeNProductsFromCart(2)
        expect(await cartPage.removeBtn.isVisible()).toBeFalsy()
    });

    test('verify cart icon number is updated when remove a product from cart', async ({ page }) => {
        const productPage = new ProductsPage(page)
        cartPage = new CartPage(page)

        await productPage.addNProductsToCart(3)
        await cartPage.goToCartPage()
        expect(await cartPage.checkCartIconContainsProductsSelected(3)).toBeTruthy()

        await cartPage.removeNProductsFromCart(1)
        expect(await cartPage.checkCartIconContainsProductsSelected(2)).toBeTruthy()
    });

});

