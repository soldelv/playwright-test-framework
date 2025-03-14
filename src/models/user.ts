export class User {
    id: number
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string
    userStatus: number

    constructor(
        id: number,
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        phone: string,
        userStatus: number
    ) {
        this.id = id
        this.username = username
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.password = password
        this.phone = phone
        this.userStatus = userStatus
    }

    static fromJson(data: any): User {
        return new User(
            data.id ?? 0,
            data.username ?? "",
            data.firstName ?? "",
            data.lastName ?? "",
            data.email ?? "",
            data.password ?? "",
            data.phone ?? "",
            data.userStatus ?? 0
        );
    }
}
