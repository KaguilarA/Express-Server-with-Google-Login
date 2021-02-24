// Requires
const express = require('express');
const searchController = require('./search.controller');
const auth = require('./../../helpers/auth.helper');

// Initialization
const router = express();

// Routes
router.get(
  `/all/:search`,
  auth.validateToken,
  searchController.getAll
);

router.get(
  `/bycollection/:table/:search`,
  auth.validateToken,
  searchController.getByTable);

module.exports = router;