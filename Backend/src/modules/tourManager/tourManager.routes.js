const express = require('express');
const tourManagerController = require('./tourManager.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');
const authorize = require('../../shared/middlewares/role.middleware');
const { ROLES } = require('../../shared/utils/constants');

const router = express.Router();

router.use(authenticate, authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TOUR_MANAGER]));

router.get('/dashboard', tourManagerController.getTourManagerDashboard);

router.post('/', tourManagerController.createTourManager);
router.get('/', tourManagerController.getAllTourManagers);
router.get('/:id', tourManagerController.getTourManagerById);
router.put('/:id', tourManagerController.updateTourManager);
router.delete('/:id', tourManagerController.deleteTourManager);

module.exports = router;
