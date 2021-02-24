// Requires
const express = require('express');
const DoctorController = require('./doctor.controller');

const auth = require('./../../helpers/auth.helper');

// Initialization
const router = express();

// Routes
router.get(`/`,
  auth.validateToken,
  DoctorController.getAll
);

router.get(
  `/:id`,
  auth.validateToken,
  DoctorController.getById
);

router.post(
  `/`,
  auth.validateToken,
  DoctorController.register
);

router.put(
  `/:id`,
  auth.validateToken,
  DoctorController.updateById
);

router.delete(
  `/:id`,
  auth.validateToken,
  DoctorController.delete
);

module.exports = router;