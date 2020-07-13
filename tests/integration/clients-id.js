const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
const { describe, it, before } = require('mocha');

chai.use(chaiHttp);

const { request } = chai;

const app = require('../../src/app');

const userClientId = 'a3b8d425-2b60-4ad7-becc-bedf2ef860bd';
const adminClientId = '4a0573eb-56d0-45d5-ab36-bebf33c5eb36';
const inexistentClientId = '000';

const validUserCredentials = {
  username: 'barnettblankenship@quotezart.com',
  password: 'password',
};
const validAdminCredentials = {
  username: 'inesblankenship@quotezart.com',
  password: 'password',
};

describe('Clients/{id} Controller', () => {
  it('When sending a request without authentication, then receive a 401 error', (done) => {
    request(app).get(`/api/v1/clients/${userClientId}`)
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
    it('When sending a request with the users client id, then receive the associated client data', (done) => {
      request(app).get(`/api/v1/clients/${userClientId}`)
        .set('Authorization', `${auth.type} ${auth.token}`).end((error, response) => {
          expect(response.body).to.have.property('id', userClientId);
          expect(response.body).to.have.property('name');
          expect(response.body).to.have.property('email');
          expect(response.body).to.have.property('role');
          expect(response.body).to.have.property('policies');
          done();
        });
    });
    it('When using me as the client id, then receive the associated client data', (done) => {
      request(app).get('/api/v1/clients/me')
        .set('Authorization', `${auth.type} ${auth.token}`).end((error, response) => {
          expect(response.body).to.have.property('id', userClientId);
          expect(response.body).to.have.property('name');
          expect(response.body).to.have.property('email');
          expect(response.body).to.have.property('role');
          expect(response.body).to.have.property('policies');
          done();
        });
    });
    it('When sending a request with a client id owned by another user, then receive a 403 error', (done) => {
      request(app).get(`/api/v1/clients/${adminClientId}`)
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          expect(response).to.have.status(403);
          expect(response.body).to.have.property('code', '403');
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
    it('When the id does not exist, then receive a 404 error', (done) => {
      request(app).get(`/api/v1/clients/${inexistentClientId}`)
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.have.property('code', '404');
          expect(response.body).to.have.property('message');
          done();
        });
    });
    it('When sending a request with the users client id, then receive the associated client data', (done) => {
      request(app).get(`/api/v1/clients/${adminClientId}`)
        .set('Authorization', `${auth.type} ${auth.token}`).end((error, response) => {
          expect(response.body).to.have.property('id', adminClientId);
          expect(response.body).to.have.property('name');
          expect(response.body).to.have.property('email');
          expect(response.body).to.have.property('role');
          expect(response.body).to.have.property('policies');
          done();
        });
    });
    it('When sending a request with a client id owned by another user, then receive that client data', (done) => {
      request(app).get(`/api/v1/clients/${userClientId}`)
        .set('Authorization', `${auth.type} ${auth.token}`).end((error, response) => {
          expect(response.body).to.have.property('id', userClientId);
          expect(response.body).to.have.property('name');
          expect(response.body).to.have.property('email');
          expect(response.body).to.have.property('role');
          expect(response.body).to.have.property('policies');
          done();
        });
    });
  });
});
