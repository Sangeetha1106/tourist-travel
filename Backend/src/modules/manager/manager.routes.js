const express = require('express');
const managerController = require('./manager.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');
const authorize = require('../../shared/middlewares/role.middleware');
const { ROLES } = require('../../shared/utils/constants');

const router = express.Router();

router.use(authenticate, authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TOUR_MANAGER]));

router.get('/dashboard-stats', managerController.getDashboardStats);
router.get('/customers', managerController.getManagerCustomers);
router.get('/upcoming', managerController.getUpcomingTours);
router.get('/ongoing', managerController.getOngoingTours);
router.get('/completed', managerController.getCompletedTours);
router.get('/cancelled', managerController.getCancelledTours);
router.get('/bookings', managerController.getManagerBookings);
router.get('/bookings/:id', managerController.getManagerBookingById);

router.patch('/bookings/:id/approve', managerController.approveBooking);
router.patch('/bookings/:id/reject', managerController.rejectBooking);

// Individual patches
router.patch('/bookings/:id/assign-guide', managerController.assignGuide);
router.patch('/bookings/:id/assign-driver', managerController.assignDriver);
router.patch('/bookings/:id/assign-vehicle', managerController.assignVehicle);
router.patch('/bookings/:id/assign-hotel', managerController.assignHotel);

// Combined patch for UI ease
// Combined patch for UI ease
router.patch('/bookings/:id/assign-logistics', managerController.assignLogistics);

router.patch('/bookings/:id/itinerary', managerController.saveItinerary);

module.exports = router;
