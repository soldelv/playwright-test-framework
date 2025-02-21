import { test, expect } from '@playwright/test'
import { PetApi } from '../../src/api/petApi'
import { newPet, petToFind, petId, invalidId } from './data/testData'
import { Pet } from '../../src/models/pet'
import { BasicResponse } from '../../src/models/basicResponse'

test.describe('API Test: PetStore Pet', () => {

    test('test create new pet', async () => {
        const api = new PetApi()

        const response = await api.createNewPet(newPet)
        expect(await response.status()).toBe(200)

        const responseBody: Pet = await response.json()
        const updatedPet = Object.assign({}, newPet, { id: responseBody.id })
        expect(responseBody).toEqual(updatedPet)
    })

    test('test upload image to PetStore', async () => {
        const api = new PetApi()
        const response = await api.uploadImage(petId)
        expect(await response.status()).toBe(200)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toContain("./file, 32966 bytes")
    })

    test('test get pet by id', async () => {
        const api = new PetApi()
        await api.createNewPet(newPet)
        const response = await api.getPetById(`${newPet.id}`)
        expect(await response.status()).toBe(200)

        const responseBody: Pet = await response.json()
        expect(responseBody).toEqual(newPet)
    })

    test('test try to get pet by non-existing id', async () => {
        const api = new PetApi()

        const response = await api.getPetById(invalidId)
        expect(await response.status()).toBe(404)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toEqual("Pet not found")
    })

    test('test update pet', async () => {
        const api = new PetApi()
        await api.createNewPet(newPet)

        const updatedPet = Object.assign({}, newPet, { name: "Winnie" })

        const response = await api.updatePet(updatedPet)
        expect(await response.status()).toBe(200)

        const responseBody: Pet = await response.json()
        expect(responseBody).toEqual(updatedPet)
    })

    test('test search pet on findByStatus response', async () => {
        const api = new PetApi()
        await api.createNewPet(petToFind)

        const response = await api.findPetByStatus("available")
        expect(response.status()).toBe(200);

        const petsList: Pet[] = await response.json()

        const addedPet = petsList.find(pet => pet.id === petToFind.id)
        expect(addedPet).toBeDefined()

        expect(addedPet?.name).toBe(petToFind.name)
        expect(addedPet?.status).toBe(petToFind.status)
    })

    test('test delete an user', async () => {
        const api = new PetApi()
        await api.createNewPet(newPet)

        const response = await api.deleteUPet(`${newPet.id}`)
        expect(await response.status()).toBe(200)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toEqual(`${newPet.id}`)
    })

    test('test try to delete a non-existing pet', async () => {
        const api = new PetApi()

        const response = await api.deleteUPet(invalidId)
        expect(await response.status()).toBe(404);
    })

});