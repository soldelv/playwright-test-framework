import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/loginPage'
import { ProductsPage } from '../pages/productsPage'

test.describe('Inventory Page Suite', () => {
    

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.navigate()
        await loginPage.login('standard_user', 'secret_sauce')
        expect(loginPage.checkErrorIconsVisibility()).toBeTruthy()
    });

    test('each products should display title, description and cart button', async ({page}) => {
        const inventoryPage = new ProductsPage(page)
        expect(inventoryPage.checkElementsDisplayedForEachProduct()).toBeTruthy()
    });

    test('verify after click on add to cart, remove button is displayed instead', async ({page}) => {
        const inventoryPage = new ProductsPage(page)
        inventoryPage.addNProductsToCart(2)
        expect(inventoryPage.checkRemoveButtonIsDisplayedInFirstNProducts(2)).toBeTruthy()
    });

    test('verify cart icon contains product selected', async ({page}) => {
        const inventoryPage = new ProductsPage(page)
        inventoryPage.addNProductsToCart(2)
        expect(inventoryPage.checkCartIconContainsProductsSelected(2)).toBeTruthy()
    });

});

