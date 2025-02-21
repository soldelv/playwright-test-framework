import { test, expect } from '@playwright/test'
import { UserApi } from '../../src/api/userApi'
import { newUser, updatedUser } from './data/testData'
import { User } from '../../src/models/user'
import { BasicResponse } from '../../src/models/basicResponse'

test.describe('API Test: PetStore User', () => {

    test('test create new user', async () => {
        const api = new UserApi()

        const response = await api.createNewUser(newUser)
        expect(await response.status()).toBe(200)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toBe(`${newUser.id}`)
    })

    test('test log in user', async () => {
        const api = new UserApi()
        await api.createNewUser(newUser)

        const response = await api.loginUser(newUser)
        expect(await response.status()).toBe(200)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toContain('logged in user session')
    })

    test('test get user by username', async () => {
        const api = new UserApi()
        await api.createNewUser(newUser)

        const response = await api.getUserByUsername(newUser.username)
        expect(await response.status()).toBe(200)

        const responseBody: User = await response.json()
        expect(responseBody).toEqual(newUser)
    })

    test('test update user', async () => {
        const api = new UserApi()
        await api.createNewUser(newUser)

        const response = await api.updateUser(updatedUser)
        expect(await response.status()).toBe(200)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toEqual(`${newUser.id}`)
    })

    test('test delete an user', async () => {
        const api = new UserApi()
        await api.createNewUser(newUser)

        const response = await api.deleteUser(newUser.username)
        expect(await response.status()).toBe(200)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toEqual(newUser.username)
    })

    test('test try to delete a non-existing user', async () => {
        const api = new UserApi()

        const response = await api.deleteUser("johnnyBravo123")
        expect(await response.status()).toBe(404)
    })

});