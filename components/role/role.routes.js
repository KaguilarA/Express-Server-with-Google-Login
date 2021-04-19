// Dependencies
const express = require('express');
const auth = require('./../../helpers/auth.helper');

//Controller
const controller = require('./role.controller');

//Router
const router = express();

//Routes
router.get('/', auth.validateToken, controller.getAll);
router.get('/:id', auth.validateToken, controller.getById);
router.post('/', auth.validateToken, controller.register);
router.put('/:id', auth.validateToken, controller.update);
router.delete('/:id', [auth.validateToken, auth.validateAdminRole], controller.delete);

//Export
module.exports = router;