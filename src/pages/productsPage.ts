import { BasePage } from './basePage';
import { Locator, Page } from '@playwright/test';

export class ProductsPage extends BasePage {

    readonly productList: Locator
    readonly addToCartBtn: Locator
    readonly removeBtn: Locator

    constructor(page: Page) {
        super(page);
        this.productList = page.locator('.inventory_item')
        this.addToCartBtn = page.getByText('Add to cart')
        this.removeBtn = page.getByText('Remove')
    }

    async checkElementsDisplayedForEachProduct(): Promise<boolean> {
        const productCount = await this.productList.count()

        for (let i = 0; i < productCount; i++) {
            const product = this.productList.nth(i);
            const title = product.locator('.inventory_item_name ')
            const titleDesc = await title.textContent()
            const price = product.locator('.inventory_item_price')
            const addToCartButton = this.productList.nth(i).locator('button')
            const isTitleVisible = await title.isVisible()
            const isPriceVisible = await price.isVisible()
            const isButtonVisible = await addToCartButton.isVisible()

            if (!isTitleVisible || !isPriceVisible || !isButtonVisible) return false
            console.log(`Product ${titleDesc} is correctly displayed.`)
        }
        return true
    }

    async addNProductsToCart(products: number) {
        while (products-- > 0) {
            const index = this.addToCartBtn
            await (await index.first()).click();
        }
    }

    async removeNProductsFromCart(products: number) {
        while (products-- > 0) {
            const index = this.removeBtn
            await (await index.first()).click();
        }
    }

    async checkRemoveButtonIsDisplayedInFirstProduct(): Promise<boolean> {
        const product = await this.removeBtn.first();
        return product.isVisible()
    }

    async checkRemoveButtonIsDisplayedInFirstNProducts(products: number): Promise<boolean> {
        for (let i = 0; i < products; i++) {
            const product = await this.removeBtn.nth(i);
            if (!product.isVisible()) return false
        }
        return true
    }

}