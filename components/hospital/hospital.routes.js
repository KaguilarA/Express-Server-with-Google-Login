// Requires
const express = require('express');
const hospitalController = require('./hospital.controller');

const auth = require('./../../helpers/auth.helper');

// Initialization
const router = express();

// Routes
router.get(`/`, auth.validateToken, hospitalController.getAll);

router.post(
  `/:id`,
  auth.validateToken,
  hospitalController.getById
);

router.post(
  `/`,
  auth.validateToken,
  hospitalController.register
);

router.put(
  `/:id`,
  auth.validateToken,
  hospitalController.updateById
);

router.delete(
  `/:id`,
  [auth.validateToken, auth.validateAdminRole],
  hospitalController.delete
);

module.exports = router;