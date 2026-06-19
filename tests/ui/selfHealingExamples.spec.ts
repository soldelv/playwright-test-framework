import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/ui/loginPage'
import { ProductPage } from '../../src/ui/productPage'
import { CartPage } from '../../src/ui/cartPage'
import { SelfHealingLocator } from '../../src/utils/selfHealing';
import { validUser } from './data/testData';

test.describe('Self-Healing Tests', () => {

  test('Login with self-healing, using multiple locator strategies', async ({ page }) => {

    const selfHealingLogin = new SelfHealingLocator(
      page,
      '#wrong-login-button', // Make it incorrect intentionally to test self-healing, correct one is #login-button
      'button:has-text("Login")',
      'input[type="submit"]'
    );

    const usernameHealing = new SelfHealingLocator(
      page,
      '#wrong-user-name', // correct one is #user-name
      'input[data-test="wrong-username"]',
      'input[placeholder="Username"]'
    );

    const passwordHealing = new SelfHealingLocator(
      page,
      '#wrong-password', // correct one is #password
      'input[data-test="wrong-password"]',
      'input[placeholder="Password"]',
      'input:nth-of-type(2)'
    );

    await page.goto('/');

    await usernameHealing.fill(validUser.username);

    await passwordHealing.fill(validUser.password);

    await selfHealingLogin.click();

    expect(await page.locator('.app_logo').textContent()).toBe('Swag Labs');
  });

  test('Add products to cart with self-healing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(validUser.username, validUser.password);

    const addToCartHealing = new SelfHealingLocator(
      page,
      'button:has-text("Not add to cart")',
      'button[data-test*="add-to-cart"]',
      'button.btn_primary'
    );

    const locator = await addToCartHealing.findElement();
    await locator.nth(1).click();
    await locator.nth(2).click();

    const cartCount = await page.locator('.shopping_cart_badge').textContent();
    expect(cartCount).toBe('2');
  });

  test('Checkout with self-healing of multiple elements', async ({ page }) => {
    const loginPage = new LoginPage(page);
    let productPage = new ProductPage(page);
    const cartPage = new CartPage(page)

    const checkoutHealing = new SelfHealingLocator(
      page,
      'button:has-text("wrong-Checkout")',
      'button[data-test="wrong-checkout"]',
      '.checkout_button'
    );

    await loginPage.navigate();
    await loginPage.login(validUser.username, validUser.password);
    await productPage.addToCartNProducts(3)
    await cartPage.goToCartPage()
    await checkoutHealing.click();

    await expect(page).toHaveURL('/checkout-step-one.html');
  });
});