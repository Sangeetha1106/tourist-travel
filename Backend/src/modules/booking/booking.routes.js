const express = require('express');
const bookingController = require('./booking.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');
const authorize = require('../../shared/middlewares/role.middleware');
const { ROLES } = require('../../shared/utils/constants');

const router = express.Router();

router.use(authenticate);

// ALL authenticated users can create bookings
router.post('/', authorize([ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TOUR_MANAGER, ROLES.TOUR_GUIDE]), bookingController.createBooking);
router.get('/', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TOUR_MANAGER, ROLES.TOUR_GUIDE, ROLES.CUSTOMER]), bookingController.getAllBookings);
router.get('/my-bookings', authorize([ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.TOUR_MANAGER, ROLES.TOUR_GUIDE]), bookingController.getMyBookings);
router.get('/:id', bookingController.getBookingById);

// Only ADMIN, SUPER_ADMIN, and TOUR_MANAGER can update or delete generically
router.put('/:id', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TOUR_MANAGER]), bookingController.updateBooking);
router.delete('/:id', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TOUR_MANAGER]), bookingController.deleteBooking);

// Tour Manager specific assignment routes
router.put('/:bookingId/assign-guide', authorize([ROLES.TOUR_MANAGER, ROLES.SUPER_ADMIN, ROLES.ADMIN]), bookingController.assignGuide);
router.put('/:bookingId/assign-vehicle', authorize([ROLES.TOUR_MANAGER, ROLES.SUPER_ADMIN, ROLES.ADMIN]), bookingController.assignVehicle);
router.put('/:bookingId/assign-hotel', authorize([ROLES.TOUR_MANAGER, ROLES.SUPER_ADMIN, ROLES.ADMIN]), bookingController.assignHotel);
router.post('/:bookingId/itinerary', authorize([ROLES.TOUR_MANAGER, ROLES.SUPER_ADMIN, ROLES.ADMIN]), bookingController.saveItinerary);

// Guide specific routes
router.get('/guide/trips', authorize([ROLES.TOUR_GUIDE]), bookingController.getAssignedTrips);
router.patch('/:id/start-trip', authorize([ROLES.TOUR_GUIDE, ROLES.SUPER_ADMIN]), bookingController.startTrip);
router.patch('/:id/update-progress', authorize([ROLES.TOUR_GUIDE, ROLES.SUPER_ADMIN]), bookingController.updateProgress);
router.patch('/:id/complete-trip', authorize([ROLES.TOUR_GUIDE, ROLES.SUPER_ADMIN]), bookingController.completeTrip);

module.exports = router;
