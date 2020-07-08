const express = require('express');

const router = new express.Router();

const { query } = require('express-validator');
const DareAPI = require('../services/DareAPI');
const paginate = require('../middleware/pagination');
const inputValidation = require('../middleware/inputValidation');
const APIError = require('../types/APIError');

router.get('/', inputValidation(query('name').isAlphanumeric().optional(), query('limit').isNumeric().optional(), query('page').isNumeric().optional()), (req, res, next) => {
  if (req.auth.role === 'user') {
    res.redirect(`./clients/${req.auth.sub}`);
  } else {
    new DareAPI().initialize().then((dareAPI) => {
      let { clients } = dareAPI;

      if (req.params.name) {
        clients = clients.filter((client) => client.name === req.params.name);
      }

      // Add policies object to each client
      clients = clients.map((client) => {
        const newClient = client;
        newClient.policies = dareAPI.policies.filter((policy) => policy.clientId === client.id);
        return newClient;
      });

      if (clients.length === 0) {
        throw new APIError(404, 'No Clients found for this user');
      }
      const body = paginate(clients, req);

      res.status(200).send(body);
    }).catch((err) => { next(err); });
  }
});

router.get('/:id', (req, res, next) => {
  if (req.auth.role === 'user' && req.params.id !== req.auth.sub) {
    throw new APIError(403, 'You do not have permission to access this Client');
  } else {
    console.warn(req.params.id, req.auth.role, req.auth.sub);
    new DareAPI().initialize().then((dareAPI) => {
      let clients = dareAPI.clients.filter((client) => client.id === req.params.id);

      // Add policies object to each client
      clients = clients.map((client) => {
        const newClient = client;
        newClient.policies = dareAPI.policies.filter((policy) => policy.clientId === client.id);
        return newClient;
      });

      if (clients.length === 0) {
        throw new APIError(404, 'No Client found with this Id');
      }

      res.status(200).send(clients.pop());
    }).catch((err) => { next(err); });
  }
});

router.get('/:id/policies', (req, res, next) => {
  if (req.auth.role === 'user' && req.params.id !== req.auth.sub) {
    throw new APIError(403, 'You do not have permission to access this Client');
  } else {
    new DareAPI().initialize().then((dareAPI) => {
      const policies = dareAPI.policies.filter((policy) => policy.clientId === req.params.id);

      if (policies.length === 0) {
        throw new APIError(404, 'No Policies found for this Client');
      }
      const body = paginate(policies, req);

      res.status(200).send(body);
    }).catch((err) => { next(err); });
  }
});

module.exports = router;
