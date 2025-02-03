"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const basePage_1 = require("./basePage");
class LoginPage extends basePage_1.BasePage {
    logoTextField;
    usernameField;
    passwordField;
    loginButton;
    errorMessage;
    errorIcon;
    constructor(page) {
        super(page);
        this.logoTextField = page.locator('.app_logo');
        this.usernameField = page.getByPlaceholder('Username');
        this.passwordField = page.getByPlaceholder('Password');
        this.loginButton = page.locator('#login-button');
        this.errorMessage = page.locator('h3[data-test="error"]');
        this.errorIcon = page.locator('.fa-times-circle');
    }
    async login(username, password) {
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }
    async getErrorMessage() {
        return (await this.errorMessage.textContent()) ?? '';
    }
    async successLogin() {
        return (await this.logoTextField.textContent()) === 'Swag Labs';
    }
    async checkErrorIconsVisibility() {
        return (await this.errorIcon.count()) === 2;
    }
}
exports.LoginPage = LoginPage;
