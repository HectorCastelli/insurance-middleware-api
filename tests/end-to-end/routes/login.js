const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
const { describe, it } = require('mocha');

chai.use(chaiHttp);

const { request } = chai;

const app = require('../../../src/app');

const validUserCredentials = {
  username: 'britneyblankenship@quotezart.com',
  password: 'password',
};

const inexistentUserCredentials = {
  username: 'test@domain.com',
  password: 'password',
};

const invalidUserCredentials = {
  a: '1',
  b: '2',
};

describe('Login Controller', () => {
  it('When sending valid user credentials, then receive valid authentication token', (done) => {
    request(app).post('/api/v1/login').send(validUserCredentials)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.keys('token', 'type', 'expires_in');
        done();
      });
  });
  it('When sending credentials for a user that does not exist, then receive an error 401', (done) => {
    request(app).post('/api/v1/login').send(inexistentUserCredentials)
      .end((error, response) => {
        expect(response).to.have.status(401);
        expect(response.body).to.haveOwnProperty('code', '401');
        expect(response.body).to.have.keys('code', 'message', 'isAPIError');
        done();
      });
  });
  it('When sending an invalid request, then receive an error 400', (done) => {
    request(app).post('/api/v1/login').send(invalidUserCredentials)
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body).to.haveOwnProperty('code', '400');
        expect(response.body).to.have.keys('code', 'message', 'isAPIError');
        done();
      });
  });
});
