import { test, expect } from '@playwright/test';
import { config } from '../api/config/config';
import { newPetRequest } from '../api/data/testData';


test.describe('Petstore API Tests', () => {

    test('test get list of available pets', async ({ request }) => {
        const response = await request.get(config.baseUrl + '/pet/findByStatus?status=available')

        expect(response.status()).toBe(200)
        const data = await response.json()
        console.log(data)
    });

    test('Get pet by id', async ({ request }) => {
        const responsePets = await request.get(config.baseUrl + '/pet/findByStatus?status=available')
        const dataPets = await responsePets.json()

        const petId = dataPets[0].id
        const response = await request.get(config.baseUrl + '/pet/' + petId)

        expect(response.status()).toBe(200)
        const data = await response.json()
        console.log(data)
    });

    test('Create a new pet', async ({ request }) => {

        const response = await request.post(config.baseUrl + '/pet', {
            headers: config.headers,
            data: newPetRequest,
        })

        expect(response.status()).toBe(200)
        const data = await response.json()
        console.log(data);
        //expect(data).toBe(newPetRequest)
        expect(data.id).toBe(newPetRequest.id)
        expect(data.name).toBe(newPetRequest.name)
        expect(data.status).toBe(newPetRequest.status)
        expect(data.category.name).toBe(newPetRequest.category.name)
    });
});

