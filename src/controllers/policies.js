const express = require('express');

const router = new express.Router();

const { query } = require('express-validator');
const DareAPI = require('../services/DareAPI');
const paginate = require('../middleware/pagination');
const inputValidation = require('../middleware/inputValidation');
const APIError = require('../types/APIError');

router.get('/', inputValidation(query('limit').isNumeric().optional(), query('page').isNumeric().optional()), (req, res, next) => {
  new DareAPI().initialize().then((dareAPI) => {
    let { policies } = dareAPI;
    if (req.auth.role === 'user') {
      // Get list of own policies
      policies = policies.filter((policy) => policy.email === req.auth.id);
    }

    if (policies.length === 0) {
      throw new APIError(404, 'No Policies found for this user');
    }
    const body = paginate(policies, req);

    res.status(200).send(body);
  }).catch((err) => { next(err); });
});

router.get('/:id', (req, res, next) => {
  new DareAPI().initialize().then((dareAPI) => {
    let policies = dareAPI.policies.filter((policy) => policy.id === req.params.id);
    if (req.auth.role === 'user') {
      // Get list of own policies
      policies = policies.filter((policy) => policy.clientId === req.auth.sub);
    }

    if (policies.length === 0) {
      throw new APIError(404, 'No Policy found with this id');
    }
    res.status(200).send(policies.pop());
  }).catch((err) => { next(err); });
});

module.exports = router;
