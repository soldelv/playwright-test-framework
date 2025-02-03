import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/loginPage'
import { ProductsPage } from '../pages/productsPage'
import { CartPage } from '../pages/cartPage'

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
        await cartPage.removeNProductsToCart(2)
        expect(await cartPage.removeBtn.isVisible()).toBeFalsy()
    });

    // remove 1 product from cart, cart icon decrease by 1

    // continue shopping button by clicking in checkout button

});

