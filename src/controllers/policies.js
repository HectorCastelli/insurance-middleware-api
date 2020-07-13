const express = require('express');

const router = new express.Router();

const { query } = require('express-validator');
const PolicyService = require('../services/PolicyService');
const paginate = require('../middleware/pagination');
const inputValidation = require('../middleware/inputValidation');

router.get('/', inputValidation(query('limit').isNumeric().optional(), query('page').isNumeric().optional()), async (req, res, next) => {
  try {
    let policies;
    if (req.auth.role === 'user') {
      policies = await PolicyService.getPoliciesByClientId(req.auth.sub);
    } else {
      policies = await PolicyService.getPolicies();
    }
    const body = paginate(policies, req);

    res.status(200).send(body);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let policies;
    if (req.auth.role === 'user') {
      policies = await PolicyService.getPolicyByIdForClientId(req.params.id, req.auth.sub);
    } else {
      policies = await PolicyService.getPolicyById(req.params.id);
    }
    const body = paginate(policies, req);

    res.status(200).send(body);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
