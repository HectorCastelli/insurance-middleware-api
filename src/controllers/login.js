const express = require('express');

const router = new express.Router();

const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const inputValidation = require('../middleware/inputValidation');
const APIError = require('../types/APIError');

const DareAPI = require('../services/DareAPI');

router.post('/', inputValidation(body('username').isEmail().normalizeEmail(), body('password').isAlphanumeric()), (req, res, next) => {
  const loginObject = req.body;
  new DareAPI().initialize().then((dareAPI) => {
    if (dareAPI.clients.some((client) => client.email === loginObject.username)) {
      const authClient = dareAPI.clients.filter((client) => client.email === loginObject.username).pop();
      // Pretend to check if the user email+password combination matches.
      if (loginObject.password !== 'password') {
        throw new APIError(401, 'The credentials do not match');
      } else {
        const currentEpoch = Math.round(new Date().getTime() / 1000);
        const claim = {
          sub: authClient.id,
          role: authClient.role,
          iat: currentEpoch,
          exp: currentEpoch + 3600,
        };
        const token = jwt.sign(claim, 'secretKey');
        res.status(200).send({
          token,
          type: 'Bearer',
          expires_in: 3600,
        });
      }
    } else {
      throw new APIError(401, 'This username is not valid');
    }
  }).catch((err) => { next(err); });
});

module.exports = router;
