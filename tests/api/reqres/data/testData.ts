import { UserRole } from '../../../src/models/userRole'
import { Credentials } from '../../../src/models/credentials'

export const invalidId: number = 10000000000

export const updateUser = new UserRole("morpheus", "zion resident")

export const newUser = new UserRole("manolo", "leader")

export const userCredentials = new Credentials("eve.holt@reqres.in", "cityslicka")
export const invalidCredentials = new Credentials("11111", "11111")

export function getCurrentDatetime(): string {
    return new Date().toISOString()
}