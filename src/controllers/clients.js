const express = require('express');

const router = new express.Router();

const { query } = require('express-validator');
const ClientService = require('../services/ClientService');
const paginate = require('../middleware/pagination');
const inputValidation = require('../middleware/inputValidation');
const APIError = require('../types/APIError');

router.get('/',
  inputValidation(query('name').isAlphanumeric().optional(), query('limit').isNumeric().optional(), query('page').isNumeric().optional()),
  async (req, res, next) => {
    try {
      let clients;
      if (req.auth.role === 'user') {
        clients = await ClientService.getClientById(req.auth.sub);
      } else {
        clients = await ClientService.getClientByName(req.query.name);
        clients = paginate(clients, req);
        clients.items = await Promise.all(clients.items
          .map((client) => ClientService.getPolicies(client)));
      }
      res.status(200).send(clients);
    } catch (error) {
      next(error);
    }
  });

router.get('/:id', async (req, res, next) => {
  try {
    let client;
    if (req.auth.role === 'user' && req.params.id !== 'me' && req.params.id !== req.auth.sub) {
      throw new APIError(403, 'You do not have permission to access this Client');
    } else if (req.params.id === 'me') {
      client = await ClientService.getClientById(req.auth.sub);
    } else {
      client = await ClientService.getClientById(req.params.id);
    }
    res.status(200).send(client);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/policies', async (req, res, next) => {
  try {
    let client;
    if (req.auth.role === 'user' && req.params.id !== 'me' && req.params.id !== req.auth.sub) {
      throw new APIError(403, 'You do not have permission to access this Client');
    } else if (req.params.id === 'me') {
      client = await ClientService.getClientById(req.auth.sub);
    } else {
      client = await ClientService.getClientById(req.params.id);
    }
    const body = paginate(client.policies, req);
    res.status(200).send(body);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
