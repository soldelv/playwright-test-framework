import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/loginPage'
import { InventoryPage } from '../pages/inventoryPage'

test.describe('Inventory Page Suite', () => {
    let inventoryPage: InventoryPage
    let loginPage: LoginPage

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page)
        loginPage = new LoginPage(page)
        await inventoryPage.navigate()
        await loginPage.login('standard_user', 'secret_sauce')
        expect(loginPage.checkErrorIconsVisibility()).toBeTruthy()
    });

    test('each products should display title, description and cart button', async () => {
        expect(inventoryPage.checkElementsDisplayedForEachProduct()).toBeTruthy()
    });

    test('verify after click on add to cart, remove button is displayed instead', async () => {
        inventoryPage.addNProductsToCart(2)
        expect(inventoryPage.checkRemoveButtonIsDisplayedInFirstNProducts(2)).toBeTruthy()
    });

    test('verify cart icon contains product selected', async () => {
        inventoryPage.addNProductsToCart(2)
        expect(inventoryPage.checkCartIconContainsProductsSelected(2)).toBeTruthy()
    });

});

