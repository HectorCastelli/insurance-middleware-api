const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
const { describe, it, before } = require('mocha');

chai.use(chaiHttp);

const { request } = chai;

const app = require('../../../src/app');

const userClientId = 'a0ece5db-cd14-4f21-812f-966633e7be86';
const adminClientId = 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb';
const inexistentClientId = '000';

const validUserCredentials = {
  username: 'britneyblankenship@quotezart.com',
  password: 'password',
};
const validAdminCredentials = {
  username: 'manningblankenship@quotezart.com',
  password: 'password',
};

describe('Clients/{id}/Policies Controller', () => {
  it('When sending a request without authentication, then receive a 401 error', (done) => {
    request(app).get(`/api/v1/clients/${userClientId}/policies`)
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
      request(app).get(`/api/v1/clients/${userClientId}/policies`)
        .set('Authorization', `${auth.type} ${auth.token}`).end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body.items).to.have.length.of.at.most(10);
          done();
        });
    });
    // TODO: Since no Client with role = "user" owns a policy, this test-case can never succeed
    it.skip('When sending a request with a client id owned by another user, then receive a 403 error', (done) => {
      request(app).get(`/api/v1/clients/${adminClientId}/policies`)
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
      request(app).get(`/api/v1/clients/${inexistentClientId}/policies`)
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.have.property('code', '404');
          expect(response.body).to.have.property('message');
          done();
        });
    });
    it('When sending a request with the users client id, then receive the associated client data', (done) => {
      request(app).get(`/api/v1/clients/${adminClientId}/policies`)
        .set('Authorization', `${auth.type} ${auth.token}`).end((error, response) => {
          expect(response.body.items).to.have.length.of.at.most(10);
          done();
        });
    });
    it('When sending a request with a client id owned by another user, then receive that client data', (done) => {
      request(app).get(`/api/v1/clients/${userClientId}/policies`)
        .set('Authorization', `${auth.type} ${auth.token}`).end((error, response) => {
          expect(response.body.items).to.have.length.of.at.most(10);
          done();
        });
    });
  });
});
