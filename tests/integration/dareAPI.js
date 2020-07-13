const chai = require('chai');

const { expect } = chai;
const {
  describe, it, before, after,
} = require('mocha');

const nock = require('nock');
const DareAPI = require('../../src/services/DareAPI');

const apiPath = 'http://dare-nodejs-assessment.herokuapp.com/api';

describe('DareAPI Service', () => {
  let apiInstance;
  before((done) => {
    nock(apiPath)
      .post('/login', {
        client_id: 'axa',
        client_secret: 's3cr3t',
      }).reply(200, {
        token: 'token',
        type: 'Bearer',
      });

    nock(apiPath)
      .get('/clients').reply(200,
        [
          {
            id: 'a0ece5db-cd14-4f21-812f-966633e7be86',
            name: 'Britney',
            email: 'britneyblankenship@quotezart.com',
            role: 'admin',
          },
          {
            id: 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb',
            name: 'Manning',
            email: 'manningblankenship@quotezart.com',
            role: 'admin',
          },
          {
            id: 'a3b8d425-2b60-4ad7-becc-bedf2ef860bd',
            name: 'Barnett',
            email: 'barnettblankenship@quotezart.com',
            role: 'user',
          },
          {
            id: '44e44268-dce8-4902-b662-1b34d2c10b8e',
            name: 'Merrill',
            email: 'merrillblankenship@quotezart.com',
            role: 'user',
          },
        ]);

    nock(apiPath)
      .get('/policies').reply(200, [
        {
          id: '64cceef9-3a01-49ae-a23b-3761b604800b',
          amountInsured: '1825.89',
          email: 'inesblankenship@quotezart.com',
          inceptionDate: '2016-06-01T03:33:32Z',
          installmentPayment: true,
          clientId: 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb',
        },
        {
          id: '7b624ed3-00d5-4c1b-9ab8-c265067ef58b',
          amountInsured: '399.89',
          email: 'inesblankenship@quotezart.com',
          inceptionDate: '2015-07-06T06:55:49Z',
          installmentPayment: true,
          clientId: 'a0ece5db-cd14-4f21-812f-966633e7be86',
        },
        {
          id: '56b415d6-53ee-4481-994f-4bffa47b5239',
          amountInsured: '2301.98',
          email: 'inesblankenship@quotezart.com',
          inceptionDate: '2014-12-01T05:53:13Z',
          installmentPayment: false,
          clientId: 'e8fd159b-57c4-4d36-9bd7-a59ca13057bb',
        },
        {
          id: '6f514ec4-1726-4628-974d-20afe4da130c',
          amountInsured: '697.04',
          email: 'inesblankenship@quotezart.com',
          inceptionDate: '2014-09-12T12:10:23Z',
          installmentPayment: false,
          clientId: 'a0ece5db-cd14-4f21-812f-966633e7be86',
        },
        {
          id: '25202f31-fff0-481c-acfd-1f3ff2a9bcbe',
          amountInsured: '2579.16',
          email: 'inesblankenship@quotezart.com',
          inceptionDate: '2016-05-03T04:58:48Z',
          installmentPayment: false,
          clientId: 'a0ece5db-cd14-4f21-812f-966633e7be86',
        }]);

    new DareAPI().initialize().then((api) => {
      apiInstance = api;
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
    expect(apiInstance.clients).to.have.lengthOf(4);
    done();
  });
  after((done) => {
    nock.cleanAll();
    done();
  });
});
