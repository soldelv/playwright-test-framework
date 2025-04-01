import { test, expect } from '@playwright/test'
import { LoginPage } from '../../src/ui/loginPage'
import { ProductPage } from '../../src/ui/productPage'
import { validUser } from './data/testData';

test.describe('Products Page Suite', () => {

    let productPage: ProductPage

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)

        await loginPage.navigate()
        productPage = await loginPage.login(validUser.username, validUser.password)
    });

    test('verify after click on add to cart, remove button is displayed instead', async ({ page }) => {
        await productPage.addNProductsToCart(2)
        expect(await productPage.checkRemoveButtonIsDisplayedInFirstNProducts(2)).toBeTruthy()
    });

    test('verify cart icon number is updated when remove a product from inventory', async ({ page }) => {
        await productPage.addNProductsToCart(3)
        expect(await productPage.checkCartIconContainsProductsSelected(3)).toBeTruthy()

        await productPage.removeNProductsFromCart(1)
        expect(await productPage.checkCartIconContainsProductsSelected(2)).toBeTruthy()
    });

    test('Sort items by name Z-A and validate sorting', async ({ page }) => {

        await productPage.sortProducts('za')

        expect(await productPage.checkProductsAreSorted()).toBeTruthy()
    });

});

