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
}
