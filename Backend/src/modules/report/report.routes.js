const express = require('express');
const reportController = require('./report.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');
const authorize = require('../../shared/middlewares/role.middleware');
const { ROLES } = require('../../shared/utils/constants');

const router = express.Router();

router.use(authenticate, authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TOUR_MANAGER]));

router.get('/bookings', reportController.getBookingReport);

module.exports = router;
