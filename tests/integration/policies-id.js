const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
const { describe, it, before } = require('mocha');

chai.use(chaiHttp);

const { request } = chai;

const app = require('../../src/app');

const validPolicyId = '7b624ed3-00d5-4c1b-9ab8-c265067ef58b';
const inexistentPolicyId = '000';
const validAdminPolicyId = '64cceef9-3a01-49ae-a23b-3761b604800b';

const validUserCredentials = {
  username: 'britneyblankenship@quotezart.com',
  password: 'password',
};
const validAdminCredentials = {
  username: 'inesblankenship@quotezart.com',
  password: 'password',
};

describe('Policies/{id} Controller', () => {
  it('When sending a request without authentication, then receive a 401 error', (done) => {
    request(app).get(`/api/v1/policies/${validPolicyId}`)
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
    it('When the id does not exist, then receive a 404 error', (done) => {
      request(app).get(`/api/v1/policies/${inexistentPolicyId}`)
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.have.property('code', '404');
          expect(response.body).to.have.property('message');
          done();
        });
    });
    it('When sending a request with one of the users policy, then receive that policy', (done) => {
      request(app).get(`/api/v1/policies/${validPolicyId}/`)
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.property('id', validPolicyId);
          expect(response.body).to.have.property('amountInsured');
          expect(response.body).to.have.property('email');
          expect(response.body).to.have.property('inceptionDate');
          expect(response.body).to.have.property('installmentPayment');
          done();
        });
    });
    // TODO: Since no Client with role = "user" owns a policy, this test-case can never suceed
    it.skip('When sending a request with a policy id owned by another user, then receive a 401 error', (done) => {
      request(app).get(`/api/v1/policies/${validAdminPolicyId}`)
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          expect(response).to.have.status(401);
          expect(response.body).to.have.property('code', '401');
          expect(response.body).to.have.property('message');
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
    it('When sending a request with one of the users policy, then receive that policy', (done) => {
      request(app).get(`/api/v1/policies/${validPolicyId}`)
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.property('id', validPolicyId);
          expect(response.body).to.have.property('amountInsured');
          expect(response.body).to.have.property('email');
          expect(response.body).to.have.property('inceptionDate');
          expect(response.body).to.have.property('installmentPayment');
          done();
        });
    });
    it('When sending a request with a policy id owned by another user, then receive that policy', (done) => {
      request(app).get(`/api/v1/policies/${validAdminPolicyId}`)
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.property('id', validAdminPolicyId);
          expect(response.body).to.have.property('amountInsured');
          expect(response.body).to.have.property('email');
          expect(response.body).to.have.property('inceptionDate');
          expect(response.body).to.have.property('installmentPayment');
          done();
        });
    });
  });
});
