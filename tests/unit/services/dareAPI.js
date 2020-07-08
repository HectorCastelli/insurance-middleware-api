const chai = require('chai');

const { expect } = chai;
const { describe, it, beforeEach } = require('mocha');

const DareAPI = require('../../../src/services/DareAPI');

describe('DareAPI Service', () => {
  let apiInstance;
  beforeEach((done) => {
    new DareAPI().initialize().then((dareAPI) => {
      apiInstance = dareAPI;
      done();
    });
  });
  it('Request a valid authentication when constructed', (done) => {
    expect(apiInstance.authToken).to.be.a('string')
      .and.to.contain('Bearer');
    done();
  });
  it('Is able to request data from the 3rd party API', (done) => {
    expect(apiInstance.clients).to.have.length.of.at.least(1);
    done();
  });
});
