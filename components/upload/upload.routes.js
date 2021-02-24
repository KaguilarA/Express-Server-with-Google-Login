// Requires
const express = require('express');
const uploadController = require('./upload.controller.js');
const upload = require('./../../helpers/multer.helper');

// Initialization
const router = express();

router.put(`/:type/:id`, upload.single(`photo`), uploadController.upImage);

module.exports = router;