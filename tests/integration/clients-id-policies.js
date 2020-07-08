const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
const { describe, it } = require('mocha');

chai.use(chaiHttp);

const { request } = chai;

const app = require('../../src/app');

const userClientId = '';
const adminClientId = '';
const inexistentClientId = '';

describe('Clients/{id} Controller', () => {
  it('When sending a request without authentication, then receive a 403 error', (done) => {
    request(app).post('/clients' + "/policies").expect(403)
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
    it('When sending a request with the users client id, then receive the associated client data done => {
      request(app).post('/clients/' + userClientId + "/policies").expect(200).end((error, response) => {
      expect(response.body).to.be('array');
    });
  });
  it('When sending a request with a client id owned by another user, then receive a 401 error', (done) => {
    request(app).post('/clients/' + adminClientId + "/policies").expect(401)
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
  it('When the id does not exist, then receive a 404 error', (done) => {
    request(app).post('/clients/' + inexistentClientId + "/policies").expect(404)
      .end((error, response) => {
        expect(response.body).to.have.property('code', '404')
          .and.to.have.property('message');
        done();
      });
  });
  it('When sending a request with the users client id, then receive the associated client data done => {
      request(app).post('/clients/' + adminClientId + "/policies").expect(200).end((error, response) => {
    expect(response.body).to.be('array');
  });
});
it('When sending a request with a client id owned by another user, then receive that client data done => {
      request(app).post('/clients/' + userClientId + "/policies").expect(200).end((error, response) => {
  expect(response.body).to.be('array');
});
    });
  });
});
