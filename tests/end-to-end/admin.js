const chai = require('chai');

const { expect } = chai;
const { describe, it } = require('mocha');

const request = require('supertest');

const app = require('../../src/app');

describe("Admin Functionality", () => {
  it("Authenticates an admin", (done) => { });
  it("Get a random client via /clients", (done) => { });
  it("Get this client's data via /clients/{client ID}/", (done) => { });
  it("Search for this client's name in /clients?name={client Name}", (done) => { });
  it("Verify that all data matches", (done) => { });
});
