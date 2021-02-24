// Requires
const express = require('express');
const appController = require('./app.controller');

// Initialization
const router = express();

// Routes
router.get(`/`, appController.basicGet);

module.exports = router;