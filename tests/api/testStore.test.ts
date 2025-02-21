import { test, expect } from '@playwright/test'
import { StoreApi } from '../../src/api/storeApi'
import { PetApi } from '../../src/api/petApi'
import { invalidId, newOrder } from './data/testData'
import { Pet } from '../../src/models/pet'
import { Order } from '../../src/models/order'
import { BasicResponse } from '../../src/models/basicResponse'

test.describe('API Test: PetStore Store & Orders', () => {

    let api: StoreApi
    let updatedNewOrder: Order

    test.beforeEach(async () => {
        const petApi = new PetApi()
        const responsePet = await petApi.findPetByStatus("available")
        expect(responsePet.status()).toBe(200);
        const petsList: Pet[] = await responsePet.json()
        updatedNewOrder = Object.assign({}, newOrder, { petId: petsList[0].id })

        api = new StoreApi()
    });

    test('test create new order', async () => {
        const response = await api.createOrder(updatedNewOrder)
        expect(await response.status()).toBe(200)

        const responseBody: Order = await response.json()
        expect(responseBody).toEqual(updatedNewOrder)
    })

    test('test get pet by id', async () => {
        await api.createOrder(updatedNewOrder)
        const response = await api.getOrderById(`${newOrder.id}`)
        expect(await response.status()).toBe(200)

        const responseBody: Order = await response.json()
        expect(responseBody).toEqual(updatedNewOrder)
    })

    test('test delete an order', async () => {
        await api.createOrder(updatedNewOrder)

        const response = await api.deleteOrder(`${updatedNewOrder.id}`)
        expect(await response.status()).toBe(200)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toEqual(`${updatedNewOrder.id}`)
    })

});


test.describe('API Test: Invalid scenarios Store & Orders', () => {

    test('test try to get order by non-existing id', async () => {
        const api = new StoreApi()

        const response = await api.getOrderById(invalidId)
        expect(await response.status()).toBe(404)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toEqual("Order not found")
    })

    test('test try to delete a non-existing order', async () => {
        const api = new StoreApi()

        const response = await api.deleteOrder(invalidId)
        expect(await response.status()).toBe(404)
    })

});