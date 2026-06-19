// scripts/analyzeApp.ts
import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

/**
 * Analyzes your application and extracts:
 * - Main components
 * - User flows
 * - Interactive elements
 * - Possible errors
 */
export async function analyzeApp() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("🔍 Analyzing application...");

  // 1️⃣ LOGIN PAGE
  console.log("\n📄 Analyzing Login Page...");
  await page.goto("https://www.saucedemo.com/");

  const loginElements = {
    url: page.url(),
    title: await page.title(),
    inputs: await page.locator("input").count(),
    buttons: await page.locator("button").count(),
    errorMessages: await page.locator('[data-test="error"]').count(),
  };

  const loginData = {
    page: "Login",
    elements: loginElements,
    possibleTests: [
      "Login with valid credentials",
      "Login with invalid credentials",
      "Validate empty field errors",
      "Verify locked out user message",
    ],
  };

  console.log("✅ Login Page:", loginData);

  // 2️⃣ PRODUCT PAGE (after login)
  console.log("\n📄 Analyzing Product Page...");
  await page.fill('input[placeholder="Username"]', "standard_user");
  await page.fill('input[placeholder="Password"]', "secret_sauce");
  await page.click("#login-button");
  await page.waitForLoadState("networkidle");

  const productElements = {
    url: page.url(),
    products: await page.locator(".inventory_item").count(),
    addToCartButtons: await page.locator('button:has-text("Add to cart")').count(),
    sortOptions: await page.locator(".product_sort_container").count(),
  };

  const productData = {
    page: "Product",
    elements: productElements,
    possibleTests: [
      "Add multiple products to cart",
      "Remove products from cart",
      "Sort products by price",
      "Verify product information",
    ],
  };

  console.log("✅ Product Page:", productData);

  // 3️⃣ CART PAGE
  console.log("\n📄 Analyzing Cart Page...");
  await page.click(".shopping_cart_link");

  const cartElements = {
    url: page.url(),
    items: await page.locator(".cart_item").count(),
    checkoutButton: await page.locator('button:has-text("Checkout")').isVisible(),
  };

  const cartData = {
    page: "Cart",
    elements: cartElements,
    possibleTests: [
      "View products in cart",
      "Remove products from cart",
      "Proceed to checkout",
    ],
  };

  console.log("✅ Cart Page:", cartData);

  // 4️⃣ COMPILE ANALYSIS
  const appAnalysis = {
    appName: "SauceDemo",
    url: "https://www.saucedemo.com/",
    pages: [loginData, productData, cartData],
    generatedAt: new Date().toISOString(),
    recommendedTestCases: [
      {
        name: "End-to-End: Login → Add Products → Checkout",
        priority: "HIGH",
        steps: [
          "Login with valid credentials",
          "Add 5 different products",
          "Verify cart shows 5",
          "Proceed to checkout",
          "Fill shipping information",
          "Complete purchase",
        ],
      },
      {
        name: "Validation: Checkout form errors",
        priority: "MEDIUM",
        steps: [
          "Login",
          "Add 1 product",
          "Go to cart",
          "Proceed to checkout",
          "Leave fields empty",
          "Verify error messages",
        ],
      },
      {
        name: "Edge Case: Locked out user",
        priority: "MEDIUM",
        steps: [
          "Attempt login with locked_out_user",
          "Verify appropriate error message",
        ],
      },
    ],
  };

  await browser.close();

  return appAnalysis;
}

// Execute analysis
analyzeApp().then((analysis) => {
  console.log("\n" + "=".repeat(60));
  console.log("📊 COMPLETE APPLICATION ANALYSIS");
  console.log("=".repeat(60));
  console.log(JSON.stringify(analysis, null, 2));

  // Save analysis
  const outputPath = path.join(process.cwd(), "app-analysis.json");
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
  console.log("\n✅ Analysis saved to: app-analysis.json");
});
