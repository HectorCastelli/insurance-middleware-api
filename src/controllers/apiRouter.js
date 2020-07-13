const express = require('express');

const router = new express.Router();

// Get Secret key
const secretKey = process.env.JWT_KEY || 'secret';

// Setup Body Parser for JSON bodies
const bodyParser = require('body-parser');

router.use(bodyParser.json());

// Setup Morgan
const morgan = require('morgan');

router.use(morgan(':method => :url [:status] :response-time ms - :res[content-length]'));

const expressjwt = require('express-jwt');

const roleChecker = require('../middleware/roleChecker');

// Login Router
const loginRouter = require('./login');

router.use('/login', loginRouter);
// Clients Router
const clientsRouter = require('./clients');

router.use('/clients', expressjwt({ secret: secretKey, algorithms: ['HS256'], requestProperty: 'auth' }), roleChecker('user', 'admin'), clientsRouter);
// Policies Router
const policiesRouter = require('./policies');

router.use('/policies', expressjwt({ secret: secretKey, algorithms: ['HS256'], requestProperty: 'auth' }), roleChecker('user', 'admin'), policiesRouter);

module.exports = router;
