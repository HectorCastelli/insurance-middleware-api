const { validationResult } = require('express-validator/check');
const APIError = require('../types/APIError');

function validationErrorMiddleware(req, res, next) {
  const validationErrors = validationResult(req).array();
  if (validationErrors.length) {
    let errorMessage = 'This Request contains Validation Errors:\n';
    validationErrors.map((validationError) => `${validationError.param} : ${validationError.msg}`).forEach((error) => { errorMessage += `\n${error}`; });
    res.status(400).send(new APIError(400, errorMessage));
  } else {
    next();
  }
}

/**
 * This function is a helper for express-validator that receives validators as input and
 * returns an object that can be parsed by an express router to create behavior that:
 * validates all the validators in order, then responds to the request with an error
 * if there is any problems, otherwise, continue with the defined logic
 *
 * @param {validator} validators one or more validators for the request to be matched against
 * @returns {array<validator|function>} returns an array containing all the validators, plus
 * a function for error checking/throwing, before executing the rest of the route's logic
 */
function inputValidation(...validators) {
  return [...validators, validationErrorMiddleware];
}

module.exports = inputValidation;
