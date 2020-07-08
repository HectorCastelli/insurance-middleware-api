const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
const { describe, it } = require('mocha');

chai.use(chaiHttp);

const { request } = chai;

const app = require('../../src/app');

const validPolicyId = '';
const inexistentPolicyId = '';
const validAdminPolicyId = '';

describe('Policies Controller', () => {
  it('When sending a request without authentication, then receive a 403 error', (done) => {
    request(app).post(`/policies/${validPolicyId}`).expect(403)
      .end((error, response) => {
        expect(response.body).to.have.property('code', '403')
          .and.to.have.property('message');
        done();
      });
  });
  describe('With "user" role', () => {
    before((done) => {
      // TODO: Perform authentication flow
    });
    it('When the id does not exist, then receive a 404 error', (done) => {
      request(app).post(`/policies/${inexistentPolicyId}`).expect(404)
        .end((error, response) => {
          expect(response.body).to.have.property('code', '404')
            .and.to.have.property('message');
          done();
        });
    });
    it('When sending a request with one of the users policy, then receive that policy', (done) => {
      request(app).post(`/policies/${validPolicyId}`).expect(200)
        .end((error, response) => {
          expect(response.body).to.have.property('id', validPolicyId)
            .and.to.have.property('amountInsured')
            .and.to.have.property('email')
            .and.to.have.property('inceptionDate')
            .and.to.have.property('installmentPayment');
          done();
        });
    });
    it('When sending a request with a policy id owned by another user, then receive a 401 error', (done) => {
      request(app).post(`/policies/${validAdminPolicyId}`).expect(401)
        .end((error, response) => {
          expect(response.body).to.have.property('code', '401')
            .and.to.have.property('message');
          done();
        });
    });
  });
  describe('With "admin" role', () => {
    before((done) => {
      // TODO: Perform authentication flow
    });
    it('When sending a request with one of the users policy, then receive that policy', (done) => {
      request(app).post(`/policies/${validPolicyId}`).expect(200)
        .end((error, response) => {
          expect(response.body).to.have.property('id', validPolicyId)
            .and.to.have.property('amountInsured')
            .and.to.have.property('email')
            .and.to.have.property('inceptionDate')
            .and.to.have.property('installmentPayment');
          done();
        });
    });
    it('When sending a request with a policy id owned by another user, then receive that policy', (done) => {
      request(app).post(`/policies/${validAdminPolicyId}`).expect(401)
        .end((error, response) => {
          expect(response.body).to.have.property('id', validAdminPolicyId)
            .and.to.have.property('amountInsured')
            .and.to.have.property('email')
            .and.to.have.property('inceptionDate')
            .and.to.have.property('installmentPayment');
          done();
        });
    });
  });
});
