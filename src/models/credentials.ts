export class Credentials {
    email: string
    password: string

    constructor(email: string, password: string) {
        this.email = email
        this.password = password
    }

    static fromJson(data: any): Credentials {
        return new Credentials(
            data.email ?? "",
            data.password ?? ""
        );
    }
}