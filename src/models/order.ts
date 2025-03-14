export class Order {
    id: number
    petId: number
    quantity: number
    shipDate: string
    status: string
    complete: boolean

    constructor(
        id: number,
        petId: number,
        quantity: number,
        shipDate: string,
        status: string,
        complete: boolean
    ) {
        this.id = id
        this.petId = petId
        this.quantity = quantity
        this.shipDate = shipDate
        this.status = status
        this.complete = complete
    }

    static fromJson(data: any): Order {
        return new Order(
            data.id ?? 0,
            data.petId ?? 0,
            data.quantity ?? 0,
            data.shipDate ?? "",
            data.status ?? "",
            data.complete ?? false
        );
    }
}
