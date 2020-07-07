const chai = require('chai');

const { expect } = chai;
const { describe, it } = require('assert');
const request = require('supertest');

const app = require('../../src/app');

const listLimit = 2;

describe('Policies/{id} Controller', () => {
  it('When sending a request without authentication, then receive a 403 error.', (done) => {
    request(app).post('/policies').expect(403)
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
    it('When sending a request, then receive a list of up to 10 of my own policies.', (done) => {
      request(app).post('/policies').expect(200)
        .then((response) => {
          expect(response.body).to.be('array')
            .and.to.have.length.of.at.most(10);
          done();
        });
    });
    it('When sending a request with parameter limit = n, then receive a list of n policies for all users.', (done) => {
      request(app).post(`/policies?limit=${listLimit}`).expect(200)
        .then((response) => {
          expect(response.body).to.be('array')
            .and.to.have.length.of.at.most(listLimit);
          done();
        });
    });
  });
  describe('With "admin" role', () => {
    before((done) => {
      // TODO: Perform authentication flow
    });
    it('When sending a request, then receive a list of up to 10 of my own policies.', (done) => {
      request(app).post('/policies').expect(200)
        .then((response) => {
          expect(response.body).to.be('array')
            .and.to.have.length.of.at.most(10);
          done();
        });
    });
    it('When sending a request with parameter limit = n, then receive a list of n policies for all users.', (done) => {
      request(app).post(`/policies?limit=${listLimit}`).expect(200)
        .then((response) => {
          expect(response.body).to.be('array')
            .and.to.have.length.of.at.most(listLimit);
          done();
        });
    });

  });
});
