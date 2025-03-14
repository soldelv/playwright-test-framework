export class Pet {
    id: number
    category: Category
    name: string
    photoUrls: string[]
    tags: Tag[]
    status: string

    constructor(id: number, category: Category, name: string, photoUrls: string[], tags: Tag[], status: string) {
        this.id = id
        this.category = category
        this.name = name
        this.photoUrls = photoUrls
        this.tags = tags
        this.status = status
    }

    static fromJson(data: any): Pet {
        return new Pet(
            data.id ?? 0,
            new Category(data.category?.id ?? 0, data.category?.name ?? ""), // Convert category properly
            data.name ?? "",
            data.photoUrls ?? [],
            (data.tags ?? []).map((tag: any) => new Tag(tag.id ?? 0, tag.name ?? "")), // Convert tags properly
            data.status ?? ""
        );
    }
}

export class Category {
    id: number
    name: string

    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }
}

export class Tag {
    id: number
    name: string

    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }
}

