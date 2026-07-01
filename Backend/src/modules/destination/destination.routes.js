const express = require('express');
const destinationController = require('./destination.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');
const authorize = require('../../shared/middlewares/role.middleware');
const upload = require('../../shared/middlewares/upload.middleware');
const { ROLES } = require('../../shared/utils/constants');

const router = express.Router();

// Public routes
router.get('/', destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestinationById);

// Protected routes
router.use(authenticate, authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TOUR_MANAGER]));

router.post('/', upload.single('image'), destinationController.createDestination);
router.put('/:id', upload.single('image'), destinationController.updateDestination);
router.delete('/:id', destinationController.deleteDestination);

module.exports = router;
