import { BasePage } from './basePage';
import { Locator, Page } from '@playwright/test';

export class InventoryPage extends BasePage {

    readonly productList: Locator
    readonly addToCartBtn: Locator
    readonly removeBtn: Locator

    constructor(page: Page) {
        super(page);
        this.productList = page.locator('.inventory_item')
        this.addToCartBtn = page.locator('[class="btn btn_primary btn_small btn_inventory "]')
        this.removeBtn = page.locator('[class="btn btn_secondary btn_small btn_inventory "]')
    }

    async checkElementsDisplayedForEachProduct(): Promise<boolean> {
        const productCount = await this.productList.count()

        for (let i = 0; i < productCount; i++) {
            const product = this.productList.nth(i);
            await product.waitFor({ state: 'visible' });

            const title = product.locator('.inventory_item_name ')
            const titleDesc = await title.textContent()
            const price = product.locator('.inventory_item_price')
            const addToCartButton = this.productList.nth(i).locator('button')
            const isTitleVisible = await title.isVisible()
            const isPriceVisible = await price.isVisible()
            const isButtonVisible = await addToCartButton.isVisible()

            if (!isTitleVisible || !isPriceVisible || !isButtonVisible) {
                console.log(`Product ${titleDesc} has an invisible element.`)
                return false
            }
            console.log(`Product ${titleDesc} is correctly displayed.`)
        }
        return true
    }

    async addNProductsToCart(products: number) {
        await this.page.waitForLoadState('domcontentloaded');
        const buttons = await this.addToCartBtn.count();
        if (buttons === 0) {
            for (let i = 0; i < products; i++) {
                const product = await this.addToCartBtn.nth(i);
                await product.isVisible();
                await product.click();
            }
        }
    }

    async checkRemoveButtonIsDisplayedInFirstNProducts(products: number): Promise<boolean> {
        const buttons = await this.removeBtn.count();
        if (buttons === 0) {
            for (let i = 0; i < products; i++) {
                const product = await this.removeBtn.nth(i);

                if (!product.isVisible()) {
                    return false
                }
            }
            return true
        }
        return false
    }

    async checkCartIconContainsProductsSelected(products: number): Promise<boolean> {
        const cartBtn = await this.cartBtn.textContent()
        return Number(cartBtn) === products
    }

    // TODO: select 2 random products and get the price
}