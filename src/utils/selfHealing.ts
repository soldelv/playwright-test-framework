import { Page, Locator } from '@playwright/test';

export class SelfHealingLocator {
  private page: Page;
  private strategies: string[];

  constructor(page: Page, ...selectors: string[]) {
    this.page = page;
    this.strategies = selectors; // Alternative selectors in order of preference
  }

  /**
   * Try to find an element using multiple strategies
   * If one fails, try the next automatically
   */
  async findElement(): Promise<Locator> {
    for (const selector of this.strategies) {

      try {
        const locator = this.page.locator(selector);

        await locator.first().waitFor({ state: 'attached', timeout: 2000 })
        console.log(`✅  Selector found: ${selector}`)

        return locator

      } catch (error) {
        console.log(`⚠️  Selector did not work: ${selector}. Trying the next one...`)
      }
    }

    throw new Error(`❌ No element found with any of the strategies: ${this.strategies.join(', ')}`)
  }

  async click(): Promise<void> {
    const element = await this.findElement()
    await element.click()
  }

  async fill(text: string): Promise<void> {
    const element = await this.findElement()
    await element.fill(text)
  }

  async getText(): Promise<string> {
    const element = await this.findElement()
    return (await element.textContent()) ?? ''
  }
}