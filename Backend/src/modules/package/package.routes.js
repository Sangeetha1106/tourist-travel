const express = require('express');
const packageController = require('./package.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');
const authorize = require('../../shared/middlewares/role.middleware');
const upload = require('../../shared/middlewares/upload.middleware');
const { ROLES } = require('../../shared/utils/constants');

const router = express.Router();

// Public routes
router.get('/', packageController.getAllPackages);
router.get('/:id', packageController.getPackageById);

// Protected routes
router.use(authenticate, authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TOUR_MANAGER]));

router.post('/', upload.single('image'), packageController.createPackage);
router.put('/:id', upload.single('image'), packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);

module.exports = router;
