import { test, expect } from '@playwright/test'
import { PetApi } from '../../src/api/petApi'
import { addPet, newPet, petToFind, petId, invalidId, createListPets, getCurrentDatetime } from './data/testData'
import { Pet } from '../../src/models/pet'
import { BasicResponse } from '../../src/models/basicResponse'

test.describe('API Test: PetStore Pet', () => {

    let api: PetApi

    test.beforeEach(async ({}, testInfo) => {
        api = new PetApi()
    })

    test('test create new pet', async () => {

        const response = await api.createNewPet(newPet)
        expect(await response.status()).toBe(200)

        const responseBody: Pet = await response.json()
        const updatedPet = Object.assign({}, newPet, { id: responseBody.id })
        expect(responseBody).toEqual(updatedPet)
    })

    test('test upload image to PetStore', async () => {

        const response = await api.uploadImage(petId)
        expect(await response.status()).toBe(200)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toContain("./file, 32966 bytes")
    })

    test('test try to get pet by non-existing id', async () => {

        const response = await api.getPetById(invalidId)
        expect(await response.status()).toBe(404)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toEqual("Pet not found")
    })

    test('test update pet', async () => {
        await api.createNewPet(newPet)

        const updatedPet = Object.assign({}, newPet, { name: "Winnie" })

        const response = await api.updatePet(updatedPet)
        expect(await response.status()).toBe(200)

        const responseBody: Pet = await response.json()
        expect(responseBody).toEqual(updatedPet)
    })

    test('test search pet on findByStatus response', async () => {
        const createResponse = await api.createNewPet(petToFind)
        expect(await createResponse.status()).toBe(200)

        let addedPet;
        let attempts = 3;

        while (attempts-- > 0) {
            const response = await api.findPetByStatus("pending");
            expect(response.status()).toBe(200);

            const petsList = await response.json();
            addedPet = petsList.find(pet => pet.id === petToFind.id);

            if (addedPet) break;
            await new Promise(res => setTimeout(res, 1000)); // Wait 1s before retrying
        }

        expect(addedPet).toBeDefined()
        expect(addedPet?.name).toBe(petToFind.name)
        expect(addedPet?.status).toBe(petToFind.status)
    })

    test('test get pet by id', async () => {
        const createResponse = await api.createNewPet(addPet)
        expect(await createResponse.status()).toBe(200)

        const getResponse = await api.getPetById(`${addPet.id}`)
        const responseBody: Pet = await getResponse.json()
        expect(responseBody).toEqual(addPet)
    })

    test('test delete a pet by id', async () => {
        const createResponse = await api.createNewPet(addPet)
        expect(await createResponse.status()).toBe(200)

        const response = await api.deletePet(`${addPet.id}`)
        expect(await response.status()).toBe(200)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toEqual(`${addPet.id}`)
    })

    test('test try to delete a non-existing pet', async () => {

        const response = await api.deletePet(invalidId)
        expect(await response.status()).toBe(404);
    })

    test('test create and remove list of pets', async () => {

        const statusName = `test_status${getCurrentDatetime()}`
        let pets: Pet[] = createListPets(4, statusName)
        await api.createNPets(pets)

        let responsePet = await api.findPetByStatus(statusName)
        expect(responsePet.status()).toBe(200)
        let petsList: Pet[] = await responsePet.json()
        expect(petsList.length).toBe(pets.length)

        await api.deleteNPets(pets)

        responsePet = await api.findPetByStatus(statusName)
        expect(responsePet.status()).toBe(200)
        petsList = await responsePet.json()
        expect(petsList).toHaveLength(0)
    })

});