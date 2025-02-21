import { APIResponse } from '@playwright/test'
import { User } from '../models/user'
import { config } from './config/config'
import { BaseApi } from './baseApi'

export class UserApi extends BaseApi {
    static readonly BASE_URL: string = `${config.baseUrl}/user`

    async createNewUser(user: User): Promise<APIResponse> {
        return this.post(UserApi.BASE_URL, user)
    }

    async loginUser(user: User): Promise<APIResponse> {
        const url = `${UserApi.BASE_URL}/login`

        return this.get(url, {
            params: {
                username: user.username,
                password: user.password
            },
            headers: config.headers
        })
    }

    async getUserByUsername(username: String): Promise<APIResponse> {
        const url = `${UserApi.BASE_URL}/${username}`

        return this.get(url, {
            headers: config.headers
        })
    }

    async updateUser(user: User): Promise<APIResponse> {
        const url = `${UserApi.BASE_URL}/${user.username}`

        return this.put(url, user)
    }

    async deleteUser(username: String): Promise<APIResponse> {
        const url = `${UserApi.BASE_URL}/${username}`

        return this.delete(url)
    }

}


