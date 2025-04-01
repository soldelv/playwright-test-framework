export class UpdateResponse {
    name: string
    job: string
    updatedAt: string

    constructor(name: string, job: string, updatedAt: string) {
        this.name = name
        this.job = job
        this.updatedAt = updatedAt
    }
}