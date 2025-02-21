export class BasicResponse {
    code: number;
    type: string;
    message: string;

    constructor(
        code: number,
        type: string,
        message: string,
    ) {
        this.code = code;
        this.type = type;
        this.message = message;
    }
}