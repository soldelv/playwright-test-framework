import { APIResponse } from '@playwright/test'
import { UserRole } from '../models/userRole'
import { config } from './config/config'
import { BaseApi } from './baseApi'

export class UserApi extends BaseApi {
    static readonly BASE_URL: string = `${config.baseUrl}/users`

    async getUsers(page: number): Promise<APIResponse> {
        const url = `${UserApi.BASE_URL}?page=${page}`

        return this.get(url, {
            headers: config.headers
        })
    }

    async getUsersWithDelay(delay: number): Promise<APIResponse> {
        const url = `${UserApi.BASE_URL}?delay=${delay}`

        return this.get(url, {
            headers: config.headers
        })
    }

    async getUserById(id: number): Promise<APIResponse> {
        const url = `${UserApi.BASE_URL}/${id}`

        return this.get(url, {
            headers: config.headers
        })
    }

    async createNewUser(user: UserRole): Promise<APIResponse> {
        return this.post(UserApi.BASE_URL, user)
    }

    async updateUser(id: number, update: UserRole): Promise<APIResponse> {
        const url = `${UserApi.BASE_URL}/${id}`

        return this.put(url, update)
    }

    async deleteUser(id: number): Promise<APIResponse> {
        const url = `${UserApi.BASE_URL}/${id}`

        return this.delete(url)
    }

}


