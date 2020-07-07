const express = require('express');

const router = new express.Router();

// Setup Morgan
const morgan = require('morgan');

router.use(morgan('combined'));

// TODO: Add API routes

module.exports = router;
