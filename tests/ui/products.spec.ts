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

    test('each products should display title, description and cart button', async ({page}) => {
        expect(await productPage.checkElementsDisplayedForEachProduct()).toBeTruthy()
    });

    test('verify after click on add to cart, remove button is displayed instead', async ({page}) => {
        await productPage.addNProductsToCart(2)
        expect(await productPage.checkRemoveButtonIsDisplayedInFirstNProducts(2)).toBeTruthy()
    });

    test('verify cart icon contains number of products selected', async ({page}) => {
        await productPage.addNProductsToCart(2)
        expect(await productPage.checkCartIconContainsProductsSelected(2)).toBeTruthy()
    });

    test('verify cart icon number is updated when remove a product from inventory', async ({page}) => {
        await productPage.addNProductsToCart(3)
        expect(await productPage.checkCartIconContainsProductsSelected(3)).toBeTruthy()

        await productPage.removeNProductsFromCart(1)
        expect(await productPage.checkCartIconContainsProductsSelected(2)).toBeTruthy()
    });

});

