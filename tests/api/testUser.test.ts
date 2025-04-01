import { test, expect } from '@playwright/test'
import { UserApi } from '../../src/api/userApi'
import { updateUser, newUser, getCurrentDatetime, invalidId } from './data/testData'
import { User } from '../../src/models/user'
import { ListUserResponse } from '../../src/models/listUserResponse'
import { CreateResponse } from '../../src/models/createResponse'
import { UpdateResponse } from '../../src/models/updateResponse'

test.describe('API Test: Reqres User', () => {

    let api: UserApi

    test.beforeEach(async () => {
        api = new UserApi()
    })

    test('test retrieve a list of users', async () => {
        const response = await api.getUsers(2)
        expect(await response.status()).toBe(200)

        const responseBody: ListUserResponse = await response.json()
        expect(responseBody.data.length).toBeGreaterThan(0)
        expect(responseBody.page).toEqual(2)
    })

    test('test retrieve a list of users with delay', async () => {
        const startTime = performance.now()
        const response = await api.getUsersWithDelay(3)
        const endTime = performance.now()
        const requestTime = parseFloat((endTime - startTime).toFixed(2))

        expect(await response.status()).toBe(200)
        expect(requestTime).toBeGreaterThan(3000)
        expect(requestTime).toBeLessThan(4000)
    })

    test('test update an user', async () => {
        const response = await api.getUsers(1)
        expect(await response.status()).toBe(200)

        const responseListUsers: ListUserResponse = await response.json()
        const user: User = responseListUsers.data[0]

        const responseUpdate = await api.updateUser(user.id, updateUser)
        const actualResponse: UpdateResponse = await responseUpdate.json()
        const actualResponseParsed = Object.assign({}, actualResponse, { updatedAt: actualResponse.updatedAt.slice(0, 16)})
        const expectedResponse: UpdateResponse = new UpdateResponse(updateUser.name, updateUser.job, getCurrentDatetime().slice(0, 16))

        expect(await responseUpdate.status()).toBe(200)
        expect(actualResponseParsed).toEqual(expectedResponse)
    })

    test('test delete an user', async () => {
        const createResponse = await api.createNewUser(newUser)
        expect(await createResponse.status()).toBe(201)

        const responseBody: CreateResponse = await createResponse.json()
        const deleteResponse = await api.deleteUser(responseBody.id)

        expect(await deleteResponse.status()).toBe(204)
    })

    test('test try to get a non-existing id', async () => {
        const response = await api.getUserById(invalidId)

        expect(await response.status()).toBe(404)
    })

});