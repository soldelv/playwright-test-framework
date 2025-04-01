import { BasePage } from './basePage'
import { Locator, Page } from '@playwright/test'
import { Product } from '../models/product'

export class ProductPage extends BasePage {

    readonly productList: Locator
    readonly addToCartBtn: Locator
    readonly removeBtn: Locator
    readonly sortDropdown: Locator

    constructor(page: Page) {
        super(page);
        this.productList = page.locator('.inventory_item')
        this.addToCartBtn = page.getByText('Add to cart')
        this.removeBtn = page.getByText('Remove')
        this.sortDropdown = page.locator('.product_sort_container')
    }

    async addToCartNProducts(products: number): Promise<Product[]> {

        let productList: Product[] = []

        for (let i = 0; i < products; i++) {
            const product = this.productList.nth(i)

            await (await product.locator('button')).click()

            const title = product.locator('.inventory_item_name ')
            const titleText = (await title.textContent()) ?? ''
            const description = product.locator('.inventory_item_desc ')
            const descriptionText = (await description.textContent()) ?? ''
            const price = product.locator('.inventory_item_price')
            const priceText = (await price.textContent()) ?? ''

            productList.push(new Product(titleText, descriptionText, priceText))
        }
        return productList
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

    async checkRemoveButtonIsDisplayedInFirstNProducts(products: number): Promise<boolean> {
        for (let i = 0; i < products; i++) {
            const product = await this.removeBtn.nth(i);
            if (!product.isVisible()) return false
        }
        return true
    }

    async sortProducts(sortType: string): Promise<void> {
        await this.sortDropdown.selectOption(sortType)

        await this.page.waitForTimeout(1000)
    }

    async checkProductsAreSorted(): Promise<boolean> {
        const productCount = await this.productList.count()
        let productNames: string[] = []

        for (let i = 0; i < productCount; i++) {
            const product = this.productList.nth(i)
            const title = product.locator('.inventory_item_name ')
            const titleDesc = await title.textContent()

            productNames.push(titleDesc ?? '')
        }

        const sortedNames = productNames.sort((a, b) => b.localeCompare(a))

        return productNames == sortedNames
    }

    extractPrices(products: Product[]): string[] {
        return products.map(product => product.price.replace('$', ''));
    }

    calculateTotalPrice(prices: string[]): number {

        return prices
            .map(price => parseFloat(price))
            .filter(price => !isNaN(price))
            .reduce((sum, price) => sum + price, 0)
    }

}