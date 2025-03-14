import { test, expect } from '@playwright/test'
import { StoreApi } from '../../src/api/storeApi'
import { PetApi } from '../../src/api/petApi'
import { invalidId, newOrder, createListPets, getCurrentDatetime } from './data/testData'
import { Pet } from '../../src/models/pet'
import { Order } from '../../src/models/order'
import { BasicResponse } from '../../src/models/basicResponse'

test.describe('API Test: PetStore Store & Orders', () => {

    let api: StoreApi

    test.beforeEach(async () => {
        api = new StoreApi()
    })

    test('test create new order', async () => {
        const response = await api.createOrder(newOrder)
        expect(await response.status()).toBe(200)

        const responseBody: Order = await response.json()
        expect(responseBody.petId).toEqual(newOrder.petId)
    })

    test('test get order by id', async () => {
        const createResponse = await api.createOrder(newOrder)
        expect(await createResponse.status()).toBe(200)

        const response = await api.getOrderById(`${newOrder.id}`)
        expect(await response.status()).toBe(200)

        const responseBody: Order = await response.json()
        expect(responseBody.petId).toEqual(newOrder.petId)
    })

    test.skip('test delete an order', async () => {
        const createResponse = await api.createOrder(newOrder)
        expect(await createResponse.status()).toBe(200)

        const response = await api.deleteOrder(`${newOrder.id}`)
        expect(await response.status()).toBe(200)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toEqual(`${newOrder.id}`)
    })

    test('test try to get order by non-existing id', async () => {

        const response = await api.getOrderById(invalidId)
        expect(await response.status()).toBe(404)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toEqual("Order not found")
    })

    test('test try to delete a non-existing order', async () => {

        const response = await api.deleteOrder(invalidId)
        expect(await response.status()).toBe(404)
    })

    test.skip('check inventory before and after create & remove list of pets', async () => {
        const petApi = new PetApi()
        const statusName = `test_status${getCurrentDatetime()}`

        let pets: Pet[] = createListPets(10, statusName)
        await petApi.createNPets(pets)

        let storeResponse = await api.getInventory()
        expect(await storeResponse.status()).toBe(200)

        let responseBody = await storeResponse.json()
        expect(responseBody).toHaveProperty(statusName)
        expect(responseBody[statusName]).toBe(pets.length)

        await petApi.deleteNPets(pets)

        storeResponse = await api.getInventory()
        expect(await storeResponse.status()).toBe(200)

        responseBody = await storeResponse.json()
        expect(responseBody[statusName]).toBeUndefined()
    })

})
