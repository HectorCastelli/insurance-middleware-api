/**
 * Checks if a role is on the list of acceptedRoles
 *
 * @param {string} role The current client Role
 * @param {array<string>} acceptedRoles The list of accepted Roles
 * @return {boolean}
 */
function checkPermission(role, acceptedRoles) {
  return acceptedRoles.indexOf(role) > -1;
}

const APIError = require('../types/APIError');

/**
 * Creates a middleware that verifies the Request's Authentication header against a list of roles.
 *
 * @param {array<string>} acceptedRoles The list of roles accepted by this endpoint
 * @return {function} A Express.JS middleware
 */
function authenticationMiddleware(...acceptedRoles) {
  return (request, response, next) => {
    const decodedJWT = request.auth;
    if (checkPermission(decodedJWT.role, acceptedRoles)) {
      next();
    } else {
      response.status(403).send(new APIError(403, 'You do not have enough access for this operation.'));
    }
  };
}

module.exports = authenticationMiddleware;
