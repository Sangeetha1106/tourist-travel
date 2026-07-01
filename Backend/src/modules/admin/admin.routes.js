const express = require('express');
const adminController = require('./admin.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');
const authorize = require('../../shared/middlewares/role.middleware');
const { ROLES } = require('../../shared/utils/constants');

const router = express.Router();

router.use(authenticate, authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN]));

router.get('/bookings', adminController.getAllBookings);
router.get('/bookings/:id', adminController.getBookingById);
router.put('/bookings/:id', adminController.updateBooking);
router.delete('/bookings/:id', adminController.deleteBooking);
router.patch('/bookings/:id/cancel', adminController.cancelBooking);
router.patch('/bookings/:id/approve', adminController.approveBooking);
router.patch('/bookings/:id/reject', adminController.rejectBooking);

module.exports = router;
