import { test, expect } from '@playwright/test'
import { LoginApi } from '../../src/api/loginApi'
import { userCredentials, invalidCredentials } from './data/testData'

test.describe('API Test: Reqres User', () => {
    let api: LoginApi

    test.beforeEach(async () => {
        api = new LoginApi()
    })

    test('test successful login', async () => {
        const response = await api.login(userCredentials)
        expect(await response.status()).toBe(200)

        const responseBody = await response.json()
        expect(responseBody.token).toBeDefined()
    })

    test('test unsuccessful login', async () => {
        const response = await api.login(invalidCredentials)
        
        expect(await response.status()).toBe(400)
        const responseBody = await response.json()
        expect(responseBody.error).toBe('user not found')
    })

});