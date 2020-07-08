const chai = require('chai');

const { expect } = chai;
const { describe, it, beforeEach } = require('mocha');

const DareAPI = require('../../../src/services/DareAPI');

describe('DareAPI Service', () => {
  let apiInstance;
  beforeEach((done) => {
    new DareAPI().updateToken().then((dare) => {
      apiInstance = dare;
      done();
    });
  });
  it('Request a valid authentication when constructed'', (done) => {
    expect(apiInstance.authToken).to.be.a('string')
      .and.to.contain('Bearer');
  done();
});
it('Is able to request data from the 3rd party API'', (done) => {
    apiInstance.getClients().then((clients) => {
  expect(clients).to.be.a('array').with.lengthOf.at.least(1);
  done();
});
  });
it('Uses the previously cached data when re-fetching from the API'', (done) => {
    apiInstance.getClients().then((clients) => {
  expect(clients).to.be.a('array').with.lengthOf.at.least(1);
  done();
});
  });
});
