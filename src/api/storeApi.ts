import { APIResponse } from '@playwright/test'
import { Order } from '../models/order'
import { config } from './config/config'
import { BaseApi } from './baseApi'

export class StoreApi extends BaseApi {
    static readonly BASE_URL: string = `${config.baseUrl}/store`

    async createOrder(order: Order): Promise<APIResponse> {
        const url = `${StoreApi.BASE_URL}/order`
        return this.post(url, order)
    }

    async getOrderById(orderId: String): Promise<APIResponse> {
        const url = `${StoreApi.BASE_URL}/order/${orderId}`
        return this.get(url, {
            headers: config.headers
        })
    }

    async getInventory(): Promise<APIResponse> {
        const url = `${StoreApi.BASE_URL}/inventory`

        return this.get(url, {
            headers: config.headers
        })
    }

    async getInventoryByStatus(): Promise<APIResponse> {
        const url = `${StoreApi.BASE_URL}/findByStatus`

        return this.get(url, {
            headers: config.headers
        })
    }

    async deleteOrder(orderId: String): Promise<APIResponse> {
        const url = `${StoreApi.BASE_URL}/order/${orderId}`
        return this.delete(url)
    }

}


