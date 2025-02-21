import { User } from '../../../src/models/user'
import { Pet, Category, Tag } from '../../../src/models/pet'
import { Order } from '../../../src/models/order'

export const newUser = new User(
    12345,
    "lalotester",
    "lalo",
    "landa",
    "lalo@test.com",
    "abc123",
    "123123123",
    1
)

export const updatedUser = new User(
    12345,
    "lalotester2",
    "lalo",
    "landa",
    "lalo@test.com",
    "abc123",
    "123123123",
    1
)

export const petId = "9223372036854775807"
export const invalidId = "000000000000000000"

export const newPet = new Pet(
    Math.floor(1000000000000000 + Math.random() * 9000000000000000),
    new Category(0, "string"),
    "necoma",
    ["string"],
    [new Tag(0, "string")],
    "available"
)

export const petToFind = new Pet(
    Math.floor(1000000000000000 + Math.random() * 9000000000000000),
    new Category(1, "buddy"),
    "Marley",
    ["string"],
    [new Tag(0, "test")],
    "available"
)

export const newOrder = new Order (
    Math.floor(1000000000000000 + Math.random() * 9000000000000000),
    0,
    1,
    new Date().toISOString().replace("Z", "+0000"),
    "placed",
    true
)