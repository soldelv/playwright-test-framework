import { APIResponse, request } from '@playwright/test'
import { config } from './config/config'
import * as fs from 'fs'

export abstract class BaseApi {

    async post(url: string, body: any): Promise<APIResponse> {
        const apiContext = await request.newContext()

        const response = await apiContext.post(url, {
            headers: config.headers,
            data: body
        });

        return response;
    }

    async postImage(url: string, imagePath: string): Promise<APIResponse> {
        const apiContext = await request.newContext()
        const fileBuffer = fs.readFileSync(imagePath)

        const response = await apiContext.post(url, {
            multipart: {
                file: {
                    name: 'file',
                    mimeType: 'image/webp',
                    buffer: fileBuffer,
                },
            },
        })

        return response;
    }

    async get(url: string, content: any): Promise<APIResponse> {
        const apiContext = await request.newContext()

        const response = await apiContext.get(url, content);

        return response;
    }

    async put(url: string, body: any): Promise<APIResponse> {
        const apiContext = await request.newContext()

        const response = await apiContext.put(url, {
            headers: config.headers,
            data: body,
        })

        return response;
    }

    async delete(url: string): Promise<APIResponse> {
        const apiContext = await request.newContext()

        const response = await apiContext.delete(url, {
            headers: config.headers
        })

        return response;
    }

}


