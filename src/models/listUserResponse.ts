import { User } from "./user"

export class ListUserResponse {
    page: number
    per_page: number
    total: number
    total_pages: number
    data: User[]
    support: Support

    constructor(
        page: number,
        per_page: number,
        total: number,
        total_pages: number,
        data: User[],
        support: Support

    ) {
        this.page = page
        this.per_page = per_page
        this.total = total
        this.total_pages = total_pages
        this.data = data
        this.support = support
    }
}

export class Support {
    url: string
    text: string

    constructor(url: string, text: string) {
        this.url = url
        this.text = text
    }
}