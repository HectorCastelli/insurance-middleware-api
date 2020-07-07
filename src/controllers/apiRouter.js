const express = require('express');

const router = new express.Router();

// Setup Morgan
const morgan = require('morgan');

router.use(morgan('combined'));
// Login Router
const loginRouter = require('./login');

router.use('/login', loginRouter);
// Clients Router
const clientsRouter = require('./clients');

router.use('/clients', clientsRouter);
// Policies Router
const policiesRouter = require('./policies');

router.use('/policies', policiesRouter);

module.exports = router;
