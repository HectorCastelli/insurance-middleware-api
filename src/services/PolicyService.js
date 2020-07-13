const DareAPI = require('./DareAPI');
const APIError = require('../types/APIError');

class PolicyService {
  static async getPolicyById(id) {
    const dareAPI = await new DareAPI().initialize();
    const myPolicy = dareAPI.policies.find((policy) => policy.id === id);
    if (myPolicy) {
      return myPolicy;
    }
    throw new APIError(404, 'No Policy found with this id');
  }

  static async getPoliciesByClientId(clientId) {
    const dareAPI = await new DareAPI().initialize();
    const policies = dareAPI.policies.filter((policy) => policy.clientId === clientId);
    return policies;
  }

  static async getPolicyByIdForClientId(id, clientId) {
    const policies = await this.getPolicyById(id).filter((policy) => policy.clientId === clientId);
    if (policies.length > 0) {
      return policies;
    }
    throw new APIError(404, 'No Policy found with this id');
  }

  static async getPolicies() {
    const dareAPI = await new DareAPI().initialize();
    return dareAPI.policies;
  }
}

module.exports = PolicyService;
