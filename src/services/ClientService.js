const DareAPI = require('./DareAPI');
const APIError = require('../types/APIError');
const PolicyService = require('./PolicyService');

class ClientService {
  static async getPolicies(client) {
    const newClient = client;
    const policies = await PolicyService.getPoliciesByClientId(newClient.id);
    newClient.policies = policies;
    return newClient;
  }

  static async getClientByName(name) {
    const dareAPI = await new DareAPI().initialize();
    let clients;
    if (name) {
      clients = dareAPI.clients.filter((client) => client.name === name);
    } else {
      clients = dareAPI.clients;
    }

    if (clients.length === 0) {
      throw new APIError(404, 'No Clients found for this user');
    } else {
      return clients;
    }
  }

  static async getClientById(id) {
    const dareAPI = await new DareAPI().initialize();
    let myClient = dareAPI.clients.find((client) => client.id === id);
    if (myClient) {
      // Add policies object to client
      myClient = this.getPolicies(myClient);
      return myClient;
    }
    throw new APIError(404, 'No Client found with this Id');
  }
}

module.exports = ClientService;
