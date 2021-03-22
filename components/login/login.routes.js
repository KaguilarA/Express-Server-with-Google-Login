// Requires
const express = require('express');
const loginController = require('./login.controller');
const auth = require('./../../helpers/auth.helper');

// Initialization
const router = express();

// Routes
router.post(`/`, loginController.logIn);

router.post(`/google`, loginController.logInGoogle);

router.get(`/renew`, loginController.renewToken);

module.exports = router;