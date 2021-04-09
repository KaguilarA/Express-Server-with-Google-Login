// Requires
const express = require('express');

// Routes
const userRoutes = require('./user/user.routes');
const roleRoutes = require('./role/role.routes');
const logInRoutes = require('./login/login.routes');
const hospitalRoutes = require('./hospital/hospital.routes');
const doctorRoutes = require('./doctor/doctor.routes');
const searchRoutes = require('./search/search.routes');
const uploadRoutes = require('./upload/upload.routes');
const appRoutes = require('./app/app.routes');

// Initialization
const router = express();

// Routes
router.use('/login', logInRoutes);
router.use('/role', roleRoutes);
router.use('/hospital', hospitalRoutes);
router.use('/doctor', doctorRoutes);
router.use('/user', userRoutes);
router.use('/search', searchRoutes);
router.use('/upload', uploadRoutes);
router.use('/', appRoutes);

module.exports = router;