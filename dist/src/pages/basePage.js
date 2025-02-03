"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePage = void 0;
class BasePage {
    page;
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto('https://www.saucedemo.com/');
    }
}
exports.BasePage = BasePage;
