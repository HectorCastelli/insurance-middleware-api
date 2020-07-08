const apiPath = 'dare-nodejs-assessment.herokuapp.com/api';

const clientId = 'axa';
const clientSecret = 's3cr3t';

// Require and instantiate a cache module
const CacheModule = require('cache-service-cache-module');

const cache = new CacheModule({ storage: 'local' });
// Require superagent-cache-plugin and pass your cache module
const superagentCache = require('superagent-cache-plugin')(cache);

const request = require('superagent');
const APIError = require('../types/APIError');

class DareApi {
  constructor() {
    this.token = null;
  }

  async updateToken() {
    const token = await request.post(`${apiPath}/login`).send({
      client_id: clientId,
      client_secret: clientSecret,
    }).then((res) => res.body).catch((err) => {
      throw new APIError(500, `There was a problem authenticating with the DareAPI:${err}`);
    });
    this.token = token;
    return this;
  }

  get authToken() {
    return `${this.token.type} ${this.token.token}`;
  }

  async getClients() {
    const clients = await request.get(`${apiPath}/clients`)
      .set('Authorization', this.authToken)
      .use(superagentCache)
      .then((res) => res.body)
      .catch((err) => {
        throw new APIError(500, `There was a problem fetching the Client Data: ${err}`);
      });
    this.clients = clients;
    return this.clients;
  }

  async getPolicies() {
    const policies = await request.get(`${apiPath}/policies`)
      .set('Authorization', this.authToken)
      .use(superagentCache)
      .then((res) => res.body)
      .catch((err) => {
        throw new APIError(500, `There was a problem fetching the Policy Data: ${err}`);
      });
    this.policies = policies;
    return this.policies;
  }
}

module.exports = DareApi;
