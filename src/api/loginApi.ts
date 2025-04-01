import { APIResponse } from '@playwright/test'
import { Credentials } from '../models/credentials'
import { config } from './config/config'
import { BaseApi } from './baseApi'

export class LoginApi extends BaseApi {

    async login(credentials: Credentials): Promise<APIResponse> {
        const url = `${config.baseUrl}/login`

        return this.post(url, credentials)
    }

}


