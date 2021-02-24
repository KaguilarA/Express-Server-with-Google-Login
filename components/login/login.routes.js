// Requires
const express = require('express');
const loginController = require('./login.controller');

// Initialization
const router = express();

// Routes
router.post(`/`, loginController.logIn);

router.post(`/google`, loginController.logInGoogle);

module.exports = router;