import { test, expect } from '@playwright/test'
import { PetApi } from '../../src/api/petApi'
import { newPet, petToFind, petId, invalidId, createListPets, getCurrentDatetime } from './data/testData'
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

    test('test delete a pet by id', async () => {
        const api = new PetApi()
        await api.createNewPet(newPet)

        const response = await api.deletePet(`${newPet.id}`)
        expect(await response.status()).toBe(200)

        const responseBody: BasicResponse = await response.json()
        expect(responseBody.message).toEqual(`${newPet.id}`)
    })

    test('test try to delete a non-existing pet', async () => {
        const api = new PetApi()

        const response = await api.deletePet(invalidId)
        expect(await response.status()).toBe(404);
    })

    test('test create and remove list of pets', async () => {

        const api = new PetApi()
        const statusName = `test_status${getCurrentDatetime()}`
        let pets: Pet[] = createListPets(10, statusName)
        await api.createNPets(pets)

        // for (const pet of pets) {
        //     const response = await api.getPetById(`${pet.id}`)
        //     expect(await response.status()).toBe(200)
        // }

        await Promise.all(
            pets.map(async (pet) => {
                const response = await api.getPetById(`${pet.id}`)
                expect(response.status()).toBe(200)
            })
        )

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