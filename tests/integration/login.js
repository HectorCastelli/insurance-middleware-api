const chai = require('chai');

const { expect } = chai;
const { describe, it } = require('mocha');

const request = require('supertest');

const app = require('../../src/app');

const validUserCredentials = {
  username: 'testUsername',
  password: 'password',
};

const inexistentUserCredentials = {
  username: 'inexistent-user',
  password: 'password',
};

const invalidUserCredentials = {
  a: "1",
  b: "2",
};

describe('Login Controller', () => {
  it('When sending valid user credentials, then receive valid authentication token.', (done) => {
    request(app).post('/login').send(validUserCredentials).expect(200)
      .then((response) => {
        expect(response.body).to.have.property('token')
          .and.to.have.property('type')
          .and.to.have.property('expires_id');
        done();
      });
  });
  it('When sending credentials for a user that does not exist, then receive an error 401.', (done) => {
    request(app).post('/login').send(inexistentUserCredentials).expect(401)
      .then((response) => {
        expect(response.body).to.have.property('code', '401')
          .and.to.have.property('message');
        done();
      });
  });
  it('When sending an invalid request, then receive an error 400.', (done) => {
    request(app).post('/login').send(invalidUserCredentials).expect(400)
      .then((response) => {
        expect(response.body).to.have.property('code', '400')
          .and.to.have.property('message');
        done();
      });
  });
});
