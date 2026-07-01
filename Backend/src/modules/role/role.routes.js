const express = require('express');
const roleController = require('./role.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');
const authorize = require('../../shared/middlewares/role.middleware');
const { ROLES } = require('../../shared/utils/constants');

const router = express.Router();

// Only SUPER_ADMIN can manage roles
router.use(authenticate, authorize([ROLES.SUPER_ADMIN]));

router.post('/', roleController.createRole);
router.get('/', roleController.getAllRoles);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = router;
