const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
const { describe, it, before } = require('mocha');

chai.use(chaiHttp);

const { request } = chai;

const app = require('../../src/app');

const userId = 'a3b8d425-2b60-4ad7-becc-bedf2ef860bd';
const userName = 'Britney';
const listLimit = 2;

const validUserCredentials = {
  username: 'barnettblankenship@quotezart.com',
  password: 'password',
};
const validAdminCredentials = {
  username: 'inesblankenship@quotezart.com',
  password: 'password',
};

describe('Clients Controller', () => {
  it('When sending a request without authentication, then receive a 401 error', (done) => {
    request(app).get('/api/v1/clients')
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
    it('When sending a request, redirect to /clients/{id} where id = this clients id', (done) => {
      request(app).get('/api/v1/clients')
        .redirects(0)
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          expect(response).to.have.status(302);
          expect(response).to.have.header('Location', `./clients/${userId}`);
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
    it('When sending a request, then receive a list of up to 10 clients with their policies', (done) => {
      request(app).get('/api/v1/clients')
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body.items).to.have.length.of.at.most(10);
          done();
        });
    });
    it('When sending a request with parameter limit = n, hen receive a list of n clients with their policies', (done) => {
      request(app).get(`/api/v1/clients?limit=${listLimit}`)
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body.items).to.have.length.of.at.most(listLimit);
          done();
        });
    });
    it('When sending a request with parameter name = <?>, then receive a list of up to 10 clients with the name = <?>', (done) => {
      request(app).get(`/api/v1/clients?name=${userName}`)
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body.items).to.have.length.of.at.most(10);
          expect(response.body.items[0]).to.have.property('name', userName);
          done();
        });
    });
  });
});
