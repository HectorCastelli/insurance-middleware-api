const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
const { describe, it, before } = require('mocha');

chai.use(chaiHttp);

const { request } = chai;

const app = require('../../../src/app');

const listLimit = 2;

const validUserCredentials = {
  username: 'manningblankenship@quotezart.com',
  password: 'password',
};
const validAdminCredentials = {
  username: 'inesblankenship@quotezart.com',
  password: 'password',
};

describe('Policies/ Controller', () => {
  it('When sending a request without authentication, then receive a 401 error', (done) => {
    request(app).post('/api/v1/policies')
      .end((error, response) => {
        expect(response).to.have.status(401);
        expect(response.body).to.have.property('code', '401');
        expect(response.body).to.have.property('message');
        done();
      });
  });
  describe('With "user" role', () => {
    let auth;
    before((done) => {
      request(app).post('/api/v1/login').send(validUserCredentials)
        .end((error, response) => {
          auth = response.body;
          done();
        });
    });
    it('When sending a request, then receive a list of up to 10 of my own policies', (done) => {
      request(app).get('/api/v1/policies')
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body.items).to.have.length.of.at.most(10);
          done();
        });
    });
  });
  describe('With "admin" role', () => {
    let auth;
    before((done) => {
      request(app).post('/api/v1/login').send(validAdminCredentials)
        .end((error, response) => {
          auth = response.body;
          done();
        });
    });
    it('When sending a request with parameter limit = n, then receive a list of n policies for all users', (done) => {
      request(app).get(`/api/v1/policies?limit=${listLimit}`)
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body.items).to.have.length.of.at.most(listLimit);
          done();
        });
    });
  });
});
