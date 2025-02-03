"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
exports.default = (0, test_1.defineConfig)({
    testDir: './src/tests',
    timeout: 30 * 1000,
    retries: 0,
    reporter: 'html',
    use: {
        browserName: 'chromium',
        headless: true,
        baseURL: 'https://www.saucedemo.com/',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
});
