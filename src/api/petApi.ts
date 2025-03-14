import { APIResponse } from '@playwright/test'
import { Pet } from '../models/pet'
import { config } from './config/config'
import { BaseApi } from './baseApi'
import * as path from 'path'

export class PetApi extends BaseApi {
    static readonly BASE_URL: string = `${config.baseUrl}/pet`

    async createNewPet(pet: Pet): Promise<APIResponse> {
        return this.post(PetApi.BASE_URL, pet)
    }

    async createNPets(pets: Pet[]): Promise<void> {
        await Promise.all(pets.map(pet => this.createNewPet(pet)))
    }

    async uploadImage(petId: String): Promise<APIResponse> {
        const url = `${PetApi.BASE_URL}/${petId}/uploadImage`

        const imagePath = path.join(__dirname, '../../resources/', 'images', 'pet-image2.webp')
        return this.postImage(url, imagePath)
    }

    async getPetById(petId: String): Promise<APIResponse> {
        const url = `${PetApi.BASE_URL}/${petId}`
        return this.get(url, {
            headers: config.headers
        })
    }

    async updatePet(pet: Pet): Promise<APIResponse> {
        return this.put(PetApi.BASE_URL, pet)
    }

    async findPetByStatus(status: string): Promise<APIResponse> {
        const url = `${PetApi.BASE_URL}/findByStatus`

        return this.get(url, {
            params: { status: status },
            headers: config.headers
        })
    }

    async deletePet(petId: String): Promise<APIResponse> {
        const url = `${PetApi.BASE_URL}/${petId}`
        return this.delete(url)
    }

    async deleteNPets(pets: Pet[]): Promise<void> {
        await Promise.all(pets.map(pet => this.deletePet(`${pet.id}`)))
    }

}


