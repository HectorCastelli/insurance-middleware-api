const chai = require('chai');

const { expect } = chai;
const { describe, it } = require('assert');
const request = require('supertest');

const app = require('../../src/app');

describe("Admin Functionality", () => {
  it("Authenticates an user", (done) => { });
  it("Get the list of policies associated with the current user via /clients/{client ID}/policies", (done) => { });
  it("Get the list of policies owned by your via /policies", (done) => { });
  it("The two list have matching contents", (done) => { });
});
