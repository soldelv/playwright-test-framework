export class CreateResponse {
    name: string
    id: number
    createdAt: string

    constructor(name: string, id: number, createdAt: string) {
        this.name = name
        this.id = id
        this.createdAt = createdAt
    }
}