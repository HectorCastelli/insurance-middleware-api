const chai = require('chai');

const { expect } = chai;
const { describe, it } = require('mocha');

const request = require('supertest');

const app = require('../../src/app');

const userClientId = '';
const userName = '';
const listLimit = 2;

describe('Clients Controller', () => {
  it('When sending a request without authentication, then receive a 403 error.', (done) => {
    request(app).post('/clients').expect(403)
      .then((response) => {
        expect(response.body).to.have.property('code', '403')
          .and.to.have.property('message');
        done();
      });
  });
  describe('With "user" role', () => {
    before((done) => {
      // TODO: Perform authentication flow
    });
    it('When sending a request, redirect to /clients/{id} where id = this clients id.' done => {
      request(app).post('/clients').expect(302)
        .expect('Location', '/clients/' + userClientId)
    });
  });
  describe('With "admin" role', () => {
    before((done) => {
      // TODO: Perform authentication flow
    });
    it('When sending a request, then receive a list of up to 10 clients with their policies.' done => {
      request(app).post('/clients').expect(200)
        .then((response) => {
          expect(response.body).to.be('array')
            .and.to.have.length.of.at.most(10);
          done();
        });
    });
    it('When sending a request with parameter limit = n, hen receive a list of n clients with their policies.', (done) => {
      request(app).post(`/clients?limit=${listLimit}`).expect(200)
        .then((response) => {
          expect(response.body).to.be('array')
            .and.to.have.length.of.at.most(listLimit);
          done();
        });
    });
    it('When sending a request with parameter name = <?>, then receive a list of up to 10 clients with the name = <?>.', (done) => {
      request(app).post(`/clients?name=${userName}`).expect(200)
        .then((response) => {
          expect(response.body).to.be('array')
            .and.to.have.length.of.at.most(10)
            .and.to.have.deep.property('name', userName);
          done();
        });
    });
  });
});
