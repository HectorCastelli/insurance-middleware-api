const express = require('express');

const router = new express.Router();

const { body } = require('express-validator');
const inputValidation = require('../middleware/inputValidation');
const APIError = require('../types/APIError');

router.post('/', inputValidation(body('username').isEmail().normalizeEmail(), body('password').isAlphanumeric()), (req, res) => {
  const loginObject = req.body;

  // Check if client with this email exists on the 3rd Party API


  // Pretend to check if the user email+password combination matches.
  if (loginObject.password !== 'password') {
    throw new APIError(401, 'The credentials do not match');
  }

  // TODO: Create new JWT token with claims
});

module.exports = router;
