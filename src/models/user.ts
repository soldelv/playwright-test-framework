export class User {
    id: number
    email: string
    first_name: string
    last_name: string
    avatar: string

    constructor(id: number, email: string, firstName: string, lastName: string, avatar: string,) {
        this.id = id
        this.email = email
        this.first_name = firstName
        this.last_name = lastName
        this.avatar = avatar
    }

    static fromJson(data: any): User {
        return new User(
            data.id ?? 0,
            data.email ?? "",
            data.first_name ?? "",
            data.last_name ?? "",
            data.avatar ?? ""
        );
    }
}
