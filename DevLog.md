# DevLog

## Table of Contents

- [DevLog](#devlog)
  - [Table of Contents](#table-of-contents)
  - [Session 0 - Planning](#session-0---planning)
    - [Testing](#testing)
    - [Structure](#structure)
    - [Importing the Swagger structure](#importing-the-swagger-structure)
      - [End-To-End](#end-to-end)
      - [Integration](#integration)
      - [Unit Tests](#unit-tests)
  - [Session 1 - Basic Setup](#session-1---basic-setup)
    - [Testing frameworks](#testing-frameworks)
    - [Auxiliary Types](#auxiliary-types)
    - [Next Steps](#next-steps)
  - [Session 2 - Authentication](#session-2---authentication)
    - [Validating Requests](#validating-requests)
    - [Validating users email](#validating-users-email)
    - [Creating authentication middleware](#creating-authentication-middleware)
    - [Moving on](#moving-on)

## Session 0 - Planning

After setting up this repository and bringing over the list of requirements, I want to take my time to plan my development process.

### Testing

To ensure I can focus on solving the problem, not on validating if it works, I will start the development process by setting up a test-suite to give me peace of mind. I will add integration, unit and end-to-end tests in that order.

This will be so I can focus on first setting up my routes correctly, then making sure the data returned per-route is correct. As a final step, I want to simulate how a user would use the API, focusing on a couple of imaginary use-cases.

### Structure

I want to keep my codebase easy to understand and maintain.

To help me with this I want to do two things:

- Use a clear organization structure
- Remove as much responsibility from the API as possible

To achieve the first point, I will separate my code into a couple of folders:

- controllers: where all routing will be done
- services: where the business logic lives
- middleware: where custom middleware will be placed
- utilities: where utilitarian code will live
- types: where "types" and validation-related objects will live.

Note that, since this is not a Typescript project, the types folder is not what you would normally expect. In this case, I will store mostly request/object validation data and create Classes that I can use to map data into.

To achieve my second point, I plan on using already existing packages.

This is the list of packages I plan on integrating from the start, along with their purpose:

- [eslint](https://www.npmjs.com/package/eslint): To provide a standard for the code-base
- [apicache](https://www.npmjs.com/package/apicache): To implement caching on the API endpoints
- [express-validator](https://www.npmjs.com/package/express-validator): To add request body validation
- [express-jwt](https://www.npmjs.com/package/express-jwt): To add JWT validation for the API
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit): To implement rate-limits into the API (useful if this was a real API)
- [helmet](https://www.npmjs.com/package/helmet): Apply a comprehensive set of security patches
- [superagent](https://www.npmjs.com/package/superagent): Useful to make HTTP requests
- [morgan](https://www.npmjs.com/package/morgan): A logging middleware for debugging
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express): A nice rendered for Swagger file output
- [http-status](https://www.npmjs.com/package/http-status): A nice helper library to give HTTP status "human" names

### Importing the Swagger structure

To get started on good footing, I imported the Swagger file from the assignment into the project.

After analyzing the file that should mirror my API I've decided on creating the following tests:

#### End-To-End

- With "user" role
  1. Authenticate an user
  2. Get the list of policies associated with the current user via /clients/{client ID}/policies
  3. Get the list of policies owned by your via /policies
  4. The two list have matching contents
- With "admin" role
  1. Authenticate an admin
  2. Get a random client via /clients
  3. Get this client's data via /clients/{client ID}/
  4. Search for this client's name in /clients?name={client Name}
  5. Verify that all data matches

#### Integration

- POST /login
  - When sending valid user credentials, then receive valid authentication token
  - When sending credentials for a user that does not exist, then receive an error 401
  - When sending an invalid request, then receive a 400 error with message
- GET /policies
  - When sending a request without authentication, then receive a 403 error.
  - With "user" role
    - When sending a request, then receive a list of up to 10 of my own policies
    - When sending a request with parameter limit = n, then receive a list of n of my own policies
  - With "admin" role
    - When sending a request, then receive a list of up to 10 of policies for all users
    - When sending a request with parameter limit = n, then receive a list of n policies for all users
- GET /policies/{id}
  - When sending a request without authentication, then receive a 403 error.
  - With "user" role
    - When the id does not exist, then receive a 404 error
    - When sending a request with one of the users policy, then receive that policy
    - When sending a request with a policy id owned by another user, then receive a 401 error
  - With "admin" role
    - When sending a request with one of the users policy, then receive that policy
    - When sending a request with a policy id owned by another user, then receive that policy
- GET /clients
  - When sending a request without authentication, then receive a 403 error.
  - With "user" role
    - When sending a request, redirect to /clients/{id} where id = this client's id
  - With "admin" role
    - When sending a request, then receive a list of up to 10 clients with their policies
    - When sending a request with parameter limit = n, then receive a list of n clients with their policies
    - When sending a request with parameter name = <?>, then receive a list of up to 10 clients with the name = <?>
- GET /clients/{id}
  - When sending a request without authentication, then receive a 403 error.
  - With "user" role
    - When sending a request with the users client id, then receive the associated client data
    - When sending a request with a client id owned by another user, then receive a 401 error
  - With "admin" role
    - When the id does not exist, then receive a 404 error
    - When sending a request with an inexistent client id, then receive a 404 error
    - When sending a request with one of the users client id, then receive that client data
    - When sending a request with a client id owned by another user, then receive that client data
- GET /clients/{id}/policies
  - When sending a request without authentication, then receive a 403 error.
  - With "user" role
    - When sending a request with the users client id, then receive the associated policy data
    - When sending a request with a client id owned by another user, then receive a 401 error
  - With "admin" role
    - When sending a request with one of the users client id, then receive that policy data
    - When sending a request with a client id owned by another user, then receive that policy data

#### Unit Tests

Since the methods that will be available are yet to be defined, I will revisit this topic at a later date.

## Session 1 - Basic Setup

For this session I aim to setup the basic app and to create tests mentioned above (with the exception of unit tests, since the logic of the services has still TBD).

I decided to create one test file per use-case on the end-to-end tests and one test file per route when creating integration tests. This way, it should be easier to diagnose where the issues lie and each test file will be minimal, only requiring the data relevant to it's own scopes.

### Testing frameworks

I've decided to use [mocha](https://www.npmjs.com/package/mocha) as my test runner due to it's popularity.

For my integration and end-to-end testing, I will use [supertest](https://www.npmjs.com/package/supertest) to get and validate http requests, as well as [chai](https://www.npmjs.com/package/chai) to use the `expect` syntax.

### Auxiliary Types

To simplify any manipulation I may want to perform, I also created some base classes for each of the types I will be using during development.

### Next Steps

For my next session my priority is the authentication flow.

Here is a rough list of topics I want to cover in the next session:

- Implement authentication flow
  - Receive user email and password
  - Verify email exists on API
  - Pretend to check validity of user-password combination
  - Create temporary API token with information about user, role and expiry date
- Implement authentication middleware
- Implement TTL checks

## Session 2 - Authentication

Since the requirements explain that we need to authenticate users with OAuth2.0, and while this protocol recommends two-steps, the RFC understands that there are moments where you want to have a single step for authentication:

> In some cases, a client can directly present its own credentials to an authorization server to obtain an access token without having to first obtain an authorization grant from a resource owner. [¹](https://tools.ietf.org/html/rfc6750#section-1.3)

### Validating Requests

Before moving on to implementation, I want to make sure I have strong request body validation in-place. To achieve this I used [express-validator](https://www.npmjs.com/package/express-validator) and implemented a new middleware responsible for returning a validation error if there is any.

Since the library does not offer a middleware by itself and it requires developers to add logic to each route for aborting a request based on errors, I will create one. After a little bit of research, I have found [this issue](https://github.com/express-validator/express-validator/issues/636#issuecomment-424483540) that discussed what I want to achieve, so, due to time-constraints, I will borrow some of that code.

### Validating users email

To verify that a user exists, we need to connect to the 3rd party API and check if there is a Client with that email.

To achieve this is a way that would be easy for developers, I will create a service that will do all the necessary lifting to connect to the 3rd party API and exposes easy to use methods for common use-cases.

This service will look like a database layer for the uninterested eyes, removing the overhead of working with an external API.

Timeouts and retries will be incorporated, so, no errors should be thrown back into the developer's face unless the 3rd party API is completely unavailable.

### Creating authentication middleware

This middleware will use the JWT decoded token added to the request by the [express-jwt](https://www.npmjs.com/package/express-jwt) library and will verify if the role matches any role in a list of string.

If the role doesn't match, it will short-circuit the request with an authentication error.

### Moving on

Now that the authentication mechanism works and there is a layer to access the 3rd party API in place, I can focus on implementing the rest of the API logic.

Here are the tasks I want to do on the next session:

- Implement Policies operations
  - Implement /policies endpoint
  - Implement /policies/{id} endpoint
  - Update Integration Tests
- Implement Clients operations
  - Implement /clients endpoint
  - Implement /clients/{id} endpoint
  - Implement /clients/{id}/policies endpoint
  - Update Integration Tests
- Implement end-to-end tests
