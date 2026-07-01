const express = require('express');
const dashboardController = require('./dashboard.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');
const authorize = require('../../shared/middlewares/role.middleware');
const { ROLES } = require('../../shared/utils/constants');

const router = express.Router();

router.use(authenticate, authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN]));

router.get('/admin', dashboardController.getAdminDashboard);

module.exports = router;
