const bookingService = require('./booking.service');
const { successResponse } = require('../../shared/utils/response');
const { ROLES } = require('../../shared/utils/constants');
const Booking = require('./booking.model');
const User = require('../auth/user.model');
const Notification = require('../notification/notification.model');

const createBooking = async (req, res, next) => {
  try {
    const data = { ...req.body, userId: req.user.id };
    const booking = await bookingService.createBooking(data);
    return successResponse(res, 201, 'Booking created successfully', booking);
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();
    return successResponse(res, 200, 'Bookings fetched successfully', bookings);
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const allBookings = await bookingService.getAllBookings();
    const myBookings = allBookings.filter(b => b.userId === req.user.id);
    return successResponse(res, 200, 'My Bookings fetched successfully', myBookings);
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    
    // Authorization check
    if (req.user.role === ROLES.CUSTOMER && booking.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    return successResponse(res, 200, 'Booking fetched successfully', booking);
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    return successResponse(res, 200, 'Booking updated successfully', booking);
  } catch (error) {
    next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    await bookingService.deleteBooking(req.params.id);
    return successResponse(res, 200, 'Booking deleted successfully');
  } catch (error) {
    next(error);
  }
};

const approveBooking = async (req, res, next) => {
  try {
    const updated = await bookingService.updateBooking(req.params.id, { bookingStatus: 'CONFIRMED' });
    return successResponse(res, 200, 'Booking approved', updated);
  } catch (error) { next(error); }
};

const rejectBooking = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const updated = await bookingService.updateBooking(req.params.id, { 
      bookingStatus: 'REJECTED',
      rejectionReason 
    });
    return successResponse(res, 200, 'Booking rejected', updated);
  } catch (error) { next(error); }
};

const checkReadyForTour = async (booking) => {
  const hasGuide = !!booking.assignedGuideId;

  if (booking.bookingStatus === 'CONFIRMED' && hasGuide) {
    booking.bookingStatus = 'GUIDE_ASSIGNED';
  }
  await booking.save();
};

const assignGuide = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const guideId = req.body.guideId;
    if (guideId) {
      const Guide = require('../guide/guide.model');
      const guide = await Guide.findByPk(guideId);
      if (!guide) return res.status(404).json({ success: false, message: 'Guide profile not found' });
      
      const user = await User.findOne({ where: { email: guide.email } });
      if (!user) {
         return res.status(400).json({ success: false, message: `Guide ${guide.fullName} has not registered a user account. They must register before being assigned.` });
      }

      booking.assignedGuideId = user.id;

      booking.assignedGuideName = guide.fullName;
      booking.assignedAt = new Date();
      booking.assignedBy = req.user.id;
      
      await Notification.create({
        userId: user.id,
        title: 'New Tour Assigned',
        message: `You have been assigned a new tour for customer ${booking.customerName}.`,
        type: 'INFO',
        bookingId: booking.bookingNumber
      });
    }

    await checkReadyForTour(booking);
    return successResponse(res, 200, 'Guide assigned successfully', booking);
  } catch (error) { next(error); }
};

const assignVehicle = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.assignedVehicleId = req.body.vehicleId || req.body.assignedVehicleId;
    booking.vehicleId = req.body.vehicleId;
    booking.vehicleName = req.body.vehicleName || req.body.vehicleNumber; 
    booking.driverName = req.body.driverName;
    booking.vehicleNumber = req.body.vehicleNumber;

    if (booking.assignedGuideId) {
      await Notification.create({
        userId: booking.assignedGuideId,
        title: 'Vehicle Assigned',
        message: `${booking.vehicleName || booking.vehicleNumber} has been assigned for your tour.`,
        type: 'INFO',
        bookingId: booking.bookingNumber
      });
    }

    await checkReadyForTour(booking);
    return successResponse(res, 200, 'Vehicle assigned successfully', booking);
  } catch (error) { next(error); }
};

const assignHotel = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.assignedHotelId = req.body.hotelId || req.body.assignedHotelId;
    booking.hotelId = req.body.hotelId;
    booking.hotelName = req.body.hotelName;
    booking.roomType = req.body.roomType;

    if (booking.assignedGuideId) {
      await Notification.create({
        userId: booking.assignedGuideId,
        title: 'Hotel Assigned',
        message: `${booking.hotelName} has been booked.`,
        type: 'INFO',
        bookingId: booking.bookingNumber
      });
    }

    await checkReadyForTour(booking);
    return successResponse(res, 200, 'Hotel assigned successfully', booking);
  } catch (error) { next(error); }
};

const saveItinerary = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.itineraryId = req.body.itineraryId;
    booking.itinerary = req.body.itinerary;

    if (booking.assignedGuideId) {
      await Notification.create({
        userId: booking.assignedGuideId,
        title: 'Itinerary Ready',
        message: `Your tour itinerary has been finalized.`,
        type: 'INFO',
        bookingId: booking.bookingNumber
      });
    }

    await checkReadyForTour(booking);
    return successResponse(res, 200, 'Itinerary saved successfully', booking);
  } catch (error) { next(error); }
};

const startTrip = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    const updated = await bookingService.updateBooking(req.params.id, {
      bookingStatus: 'IN_PROGRESS',
      tripProgress: [...(booking.tripProgress || []), 'Trip Started']
    });
    return successResponse(res, 200, 'Trip started', updated);
  } catch (error) { next(error); }
};

const updateProgress = async (req, res, next) => {
  try {
    const { progressNote } = req.body;
    const booking = await bookingService.getBookingById(req.params.id);
    const updated = await bookingService.updateBooking(req.params.id, {
      bookingStatus: 'IN_PROGRESS',
      tripProgress: [...(booking.tripProgress || []), progressNote]
    });
    return successResponse(res, 200, 'Trip progress updated', updated);
  } catch (error) { next(error); }
};

const completeTrip = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    const updated = await bookingService.updateBooking(req.params.id, {
      bookingStatus: 'COMPLETED',
      tripProgress: [...(booking.tripProgress || []), 'Trip Completed']
    });
    return successResponse(res, 200, 'Trip completed', updated);
  } catch (error) { next(error); }
};

const getAssignedTrips = async (req, res, next) => {
  try {
    const assigned = await Booking.findAll({ where: { assignedGuideId: req.user.id }});
    return successResponse(res, 200, 'Assigned trips fetched', assigned);
  } catch (error) { next(error); }
};

module.exports = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  approveBooking,
  rejectBooking,
  assignGuide,
  assignVehicle,
  assignHotel,
  saveItinerary,
  startTrip,
  updateProgress,
  completeTrip,
  getAssignedTrips
};
