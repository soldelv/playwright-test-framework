// tests/ui/cartOperations.spec.ts (generado por IA)
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/ui/loginPage';
import { ProductPage } from '../../src/ui/productPage'

test('Add multiple products to cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  
  await loginPage.navigate();
  await loginPage.login('standard_user', 'secret_sauce');
  
  // IA genera los pasos óptimos
  const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
  for (const product of products) {
    await productPage.addProductByName(product);
  }
  
  expect(await productPage.getCartCount()).toBe(3);
});