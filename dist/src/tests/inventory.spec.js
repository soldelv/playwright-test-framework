"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const loginPage_1 = require("../pages/loginPage");
const inventoryPage_1 = require("../pages/inventoryPage");
test_1.test.describe('Inventory Page Suite', () => {
    let inventoryPage;
    let loginPage;
    test_1.test.beforeEach(async ({ page }) => {
        inventoryPage = new inventoryPage_1.InventoryPage(page);
        loginPage = new loginPage_1.LoginPage(page);
        await inventoryPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        (0, test_1.expect)(loginPage.checkErrorIconsVisibility()).toBeTruthy();
    });
    (0, test_1.test)('each products should display title, description and cart button', async () => {
        (0, test_1.expect)(inventoryPage.checkElementsDisplayedForEachProduct()).toBeTruthy();
    });
    (0, test_1.test)('verify after click on add to cart, remove button is displayed instead', async () => {
        inventoryPage.addNProductsToCart(2);
        (0, test_1.expect)(inventoryPage.checkRemoveButtonIsDisplayedInFirstNProducts(2)).toBeTruthy();
    });
    (0, test_1.test)('verify cart icon contains product selected', async () => {
        inventoryPage.addNProductsToCart(2);
        (0, test_1.expect)(inventoryPage.checkCartIconContainsProductsSelected(2)).toBeTruthy();
    });
});
