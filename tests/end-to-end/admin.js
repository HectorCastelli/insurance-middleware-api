const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
const {
  describe, it, before, after,
} = require('mocha');

chai.use(chaiHttp);

const { request } = chai;

const app = require('../../src/app');

const validAdminCredentials = {
  username: 'inesblankenship@quotezart.com',
  password: 'password',
};

describe('Admin Functionality', () => {
  let auth;
  before('Authenticates an admin', (done) => {
    request(app).post('/api/v1/login').send(validAdminCredentials)
      .end((error, response) => {
        auth = response.body;
        done();
      });
  });
  let randomClient;
  let secondInstanceOfClient;
  let thirdInstanceOfClient;
  describe('step 1', () => {
    before('Get a random client via /clients', (done) => {
      request(app).get('/api/v1/clients')
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          randomClient = response.body.items.pop();
          done();
        });
    });
    it("Get this client's data via /clients/{client ID}/", (done) => {
      request(app).get(`/api/v1/clients/${randomClient.id}`)
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          secondInstanceOfClient = response.body;
          done();
        });
    });
    it("Search for this client's name in /clients?name={client Name}", (done) => {
      request(app).get(`/api/v1/clients?name=${randomClient.name}`)
        .set('Authorization', `${auth.type} ${auth.token}`)
        .end((error, response) => {
          thirdInstanceOfClient = response.body.items.pop();
          done();
        });
    });
  });
  after('Verify that all data matches', (done) => {
    expect(randomClient).to.eql(secondInstanceOfClient);
    expect(secondInstanceOfClient).to.eql(thirdInstanceOfClient);
    done();
  });
});
