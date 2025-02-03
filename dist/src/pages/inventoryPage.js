"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryPage = void 0;
const basePage_1 = require("./basePage");
class InventoryPage extends basePage_1.BasePage {
    productList;
    addToCartBtn;
    removeBtn;
    cartBtn;
    constructor(page) {
        super(page);
        this.productList = page.locator('.inventory_item_description');
        this.addToCartBtn = page.locator('[class="btn btn_primary btn_small btn_inventory "]');
        this.removeBtn = page.locator('[class="btn btn_secondary btn_small btn_inventory "]');
        this.cartBtn = page.locator('.shopping_cart_link');
    }
    async checkElementsDisplayedForEachProduct() {
        const productCount = await this.productList.count();
        for (let i = 0; i < productCount; i++) {
            const product = this.productList.nth(i);
            await product.waitFor({ state: 'visible' });
            const title = product.locator('.inventory_item_name ');
            const titleDesc = await title.textContent();
            const price = product.locator('.inventory_item_price');
            const addToCartButton = this.productList.nth(i).locator('button');
            const isTitleVisible = await title.isVisible();
            const isPriceVisible = await price.isVisible();
            const isButtonVisible = await addToCartButton.isVisible();
            if (!isTitleVisible || !isPriceVisible || !isButtonVisible) {
                console.log(`Product ${titleDesc} has an invisible element.`);
                return false;
            }
            console.log(`Product ${titleDesc} is correctly displayed.`);
        }
        return true;
    }
    async addNProductsToCart(products) {
        for (let i = 0; i < products; i++) {
            const product = this.productList.nth(i);
            await product.waitFor({ state: 'visible' });
            await this.productList.nth(i).locator('button').click();
        }
    }
    async checkRemoveButtonIsDisplayedInFirstNProducts(products) {
        for (let i = 0; i < products; i++) {
            const product = this.productList.nth(i);
            await this.page.waitForTimeout(50);
            //await product.waitFor({ state: 'visible' });
            const buttonText = await this.productList.nth(i).locator('button').textContent();
            if (buttonText != 'Remove') {
                return false;
            }
        }
        return true;
    }
    async checkCartIconContainsProductsSelected(products) {
        return await this.cartBtn.locator('.shopping_cart_badge').textContent() === products.toString();
    }
}
exports.InventoryPage = InventoryPage;
