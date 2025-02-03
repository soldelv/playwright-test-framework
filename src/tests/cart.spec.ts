import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/loginPage'
import { InventoryPage } from '../pages/inventoryPage'
import { CartPage } from '../pages/cartPage'

test.describe('Cart Page Suite', () => {
    let inventoryPage: InventoryPage
    let loginPage: LoginPage
    let cartPage: CartPage

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page)
        loginPage = new LoginPage(page)
        cartPage = new CartPage(page)
        await inventoryPage.navigate()
        await loginPage.login('standard_user', 'secret_sauce')
        expect(loginPage.checkErrorIconsVisibility()).toBeTruthy()
    });

    test('remove all products from cart', async () => {
        inventoryPage.addNProductsToCart(1)
        cartPage.goToCartPage()
        cartPage.removeNProductsToCart(1)
        const product = await cartPage.removeBtn;
        expect(await product.isVisible()).toBeFalsy()
    });

    // remove 1 product from cart, cart icon decrease by 1

    // continue shopping button by clicking in checkout button

});

