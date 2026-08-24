---
name: generate-api-tests-from-spec
description: 'Generate Playwright API test cases from an OpenAPI/Swagger spec while following the same project structure and testing style already used in this repository.'
---

# Generate API tests from an API specification

Use this agent when the user says things like:

- generate API tests from this OpenAPI spec
- create API tests from Swagger YAML/JSON
- create contract tests for this endpoint
- generate API test cases for this API
- produce API tests following the existing project structure

The goal is to generate test coverage based on an API spec while matching the project conventions already used in this repository:

- API client classes live under `src/api/<serviceName>/`
- shared base logic lives in `src/api/baseApi.ts`
- models live under `src/models/`
- test data lives under `tests/api/<serviceName>/data/testData.ts`
- test files live under `tests/api/<serviceName>/*.test.ts`
- test style uses `test.describe(...)` + `test.beforeEach(...)` + `expect(...)`

## Required project structure to follow

Before generating code, read these files first:

- `src/api/baseApi.ts`
- `src/api/loginApi.ts`
- `src/api/userApi.ts`
- `tests/api/reqres/testLogin.test.ts`
- `tests/api/reqres/testUser.test.ts`
- `tests/api/reqres/data/testData.ts`
- `src/models/*.ts`

Follow the same patterns exactly:

- API methods call `this.get`, `this.post`, `this.put`, or `this.delete`
- each service must have its own folder under `src/api/<serviceName>/` and `tests/api/<serviceName>/`
- each resource has its own class like `LoginApi` or `UserApi`
- each test file is focused on one domain/resource within that service folder
- tests validate status codes and JSON payloads
- test data is centralized in `tests/api/<serviceName>/data/testData.ts`
- tests are grouped in `test.describe('<domain>')`
- use `test.beforeEach` to create a new API client instance
- prefer explicit assertions like `expect(await response.status()).toBe(200)`
- parse JSON to typed models when the project already has a corresponding model
- create the service folder structure automatically when the spec is for a new API domain

## Step-by-step procedure

### 1. Locate the API specification in the project

Default project location for API specs is:

- `resources/specifications/*.yaml`
- `resources/specifications/*.yml`
- `resources/specifications/*.json`

If the user has not provided a spec file or URL, look in `resources/specifications` first and ask them to confirm the target file if multiple options exist.

If the user provides a file path, read it. If they provide JSON/YAML content, use it directly.

### 2. Read the API specification and identify the target endpoints

Extract from the spec:

- endpoint path
- HTTP method
- request body schema
- required fields
- optional fields
- response status codes
- success response schema
- error response schema
- enums
- validation constraints like minLength, maxLength, pattern, format

If the spec is not valid/complete, ask the user for a better version instead of guessing.

### 3. Infer the service name and create the service folder structure

Create the service folder structure before generating any files, following the example pattern used by Reqres:

- `src/api/<serviceName>/`
- `tests/api/<serviceName>/`
- `tests/api/<serviceName>/data/`

Examples:

- `src/api/reqres/`
- `tests/api/reqres/`
- `tests/api/reqres/data/`

Then create or update a class inside `src/api/<serviceName>/` following the existing convention:

- `LoginApi` for auth/login
- `UserApi` for users
- a new class such as `OrderApi`, `ProductApi`, or `CustomerApi` for other resources

The class should extend `BaseApi` and expose typed methods such as:

- `getUsers(page: number)`
- `getUserById(id: number)`
- `createNewUser(payload: UserRole)`
- `updateUser(id: number, payload: UserRole)`
- `deleteUser(id: number)`

Use the same naming convention as the existing repository. Do not place new service files directly in the root `src/api/` or `tests/api/` folders unless the spec specifically targets an existing root-level API namespace already present in the project.

### 4. Generate or reuse models

Check whether the project already contains a matching type under `src/models/`.

If a model already exists, reuse it.
If a model is missing and is clearly required by the API contract, create the corresponding TypeScript interface/class in `src/models/`.

Examples from the current repo:

- `user.ts`
- `credentials.ts`
- `listUserResponse.ts`
- `createResponse.ts`
- `updateResponse.ts`

Follow the naming pattern already used in the project.

### 5. Update or create test data

Use `tests/api/<serviceName>/data/testData.ts` as the central place for sample payloads and constants.

Add:

- valid payloads
- invalid payloads
- edge-case payloads
- IDs used for not-found or invalid cases
- timestamp helpers if needed

Do not hardcode test values directly inside the test file if they belong in shared test data.

### 6. Generate the test file in the same style

Create or update a file under `tests/api/<serviceName>/` named like:

- `testLogin.test.ts`
- `testUser.test.ts`
- `testOrders.test.ts`
- `testProducts.test.ts`

The test file must follow the same pattern:

```ts
import { test, expect } from '@playwright/test'
import { ResourceApi } from '../../src/api/resourceApi'
import { validPayload, invalidPayload, invalidId } from './data/testData'

test.describe('API Test: Resource', () => {
    let api: ResourceApi

    test.beforeEach(async () => {
        api = new ResourceApi()
    })

    test('test retrieve a list of resources', async () => {
        const response = await api.getResources(1)
        expect(await response.status()).toBe(200)

        // assertions on response body
    })

    test('test invalid request', async () => {
        const response = await api.createResource(invalidPayload)
        expect(await response.status()).toBe(400)
    })
})
```

### 7. Cover the standard API cases

For each endpoint, generate the most relevant cases based on the API spec and existing style. At minimum, include:

- successful retrieval
- successful creation
- successful update
- successful delete
- missing or invalid required field
- invalid ID / missing resource
- validation failures for enums, lengths, or patterns
- error response checking
- happy path + negative path

For each case, assert:

- HTTP status code
- response body shape
- key attribute existence or equality
- list length or page value when applicable

### 8. Respect the repository conventions

When generating code:

- keep the project style consistent with the existing files
- use TypeScript types and interfaces where appropriate
- create typed response objects instead of using `any` when a model exists
- do not add unnecessary abstractions
- do not invent unrelated endpoints
- only generate tests that are directly supported by the spec

### 9. Validate and refine

After generating code:

- check if the API client methods and names are consistent with the pattern in `src/api/*.ts`
- ensure imports are correct
- ensure `BaseApi` methods are reused instead of duplicating request logic
- ensure the tests are readable and consistent with the existing repo

## Output expectations

The generated result should include all of the following when applicable:

1. `src/api/<serviceName>/<resource>Api.ts` with CRUD methods for the endpoints
2. `src/models/<resource>.ts` or reused existing model files
3. `tests/api/<serviceName>/data/testData.ts` additions for payloads, IDs, and invalid cases
4. `tests/api/<serviceName>/test<Resource>.test.ts` with the API scenarios corresponding to the spec
5. a service folder created under `src/api/<serviceName>/` and `tests/api/<serviceName>/` whenever the spec represents a new API domain

Follow the same layout as the Reqres example:

- `tests/api/reqres/testLogin.test.ts`
- `tests/api/reqres/testUser.test.ts`
- `tests/api/reqres/data/testData.ts`
- `src/api/reqres/loginApi.ts`
- `src/api/reqres/userApi.ts`

## Final rule

Do not generate speculative or unsupported behavior. Only create tests that are grounded in the provided API spec and the current project conventions.

If the API spec is incomplete, clearly state which parts are missing and ask for the missing details before generating the final test suite.
