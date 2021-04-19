// Requires
const express = require('express');
const controller = require('./user.controller');
const auth = require('./../../helpers/auth.helper');

// Initialization
const router = express();

// Routes
router.get(`/`, auth.validateToken, controller.getAll);

router.get(`/:id`, auth.validateToken, controller.getById);

router.post(`/`, controller.register);

router.put(`/:id`, auth.validateToken, controller.updateById);

router.delete(`/:id`, [auth.validateToken, auth.validateAdminRole], controller.deleteById);

module.exports = router;