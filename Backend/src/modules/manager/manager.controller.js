const Booking = require('../booking/booking.model');
const Package = require('../package/package.model');
const Destination = require('../destination/destination.model');
const User = require('../auth/user.model');
const Notification = require('../notification/notification.model');
const { successResponse } = require('../../shared/utils/response');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll();
    const stats = {
      pendingAssignments: bookings.filter(b => b.bookingStatus === 'CONFIRMED').length,
      guideAssigned: bookings.filter(b => b.bookingStatus === 'GUIDE_ASSIGNED').length,
      upcomingTours: bookings.filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'GUIDE_ASSIGNED' || b.bookingStatus === 'READY_FOR_TOUR').length,
      ongoingTours: bookings.filter(b => b.bookingStatus === 'IN_PROGRESS').length,
      completedTours: bookings.filter(b => b.bookingStatus === 'COMPLETED').length,
      cancelledTours: bookings.filter(b => b.bookingStatus === 'CANCELLED' || b.bookingStatus === 'REJECTED').length
    };
    return successResponse(res, 200, 'Dashboard stats fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};

const getManagerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email', 'phone'] },
        { 
          model: Package, 
          attributes: ['packageName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    // Can filter for specific statuses in the frontend, or here. Let's return all so manager can see history.
    return successResponse(res, 200, 'Bookings fetched successfully', bookings);
  } catch (error) {
    next(error);
  }
};

const getManagerBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email', 'phone'] },
        { 
          model: Package
        }
      ]
    });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    return successResponse(res, 200, 'Booking details fetched', booking);
  } catch (error) {
    next(error);
  }
};

const getFilteredBookings = async (res, whereClause, message) => {
  const bookings = await Booking.findAll({
    where: whereClause,
    include: [
      { model: User, attributes: ['firstName', 'lastName', 'email', 'phone'] },
      { model: Package, attributes: ['packageName'] }
    ],
    order: [['createdAt', 'DESC']]
  });
  return successResponse(res, 200, message, bookings);
};

const getUpcomingTours = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    await getFilteredBookings(res, { travelDate: { [Op.gt]: today } }, 'Upcoming tours fetched successfully');
  } catch (error) { next(error); }
};

const getOngoingTours = async (req, res, next) => {
  try {
    await getFilteredBookings(res, { bookingStatus: 'IN_PROGRESS' }, 'Ongoing tours fetched successfully');
  } catch (error) { next(error); }
};

const getCompletedTours = async (req, res, next) => {
  try {
    await getFilteredBookings(res, { bookingStatus: 'COMPLETED' }, 'Completed tours fetched successfully');
  } catch (error) { next(error); }
};

const getCancelledTours = async (req, res, next) => {
  try {
    await getFilteredBookings(res, { bookingStatus: { [Op.in]: ['CANCELLED', 'REJECTED'] } }, 'Cancelled tours fetched successfully');
  } catch (error) { next(error); }
};

const approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.bookingStatus = 'CONFIRMED';
    await booking.save();

    await Notification.create({
      userId: booking.userId,
      title: 'Booking Approved',
      message: `Your booking for ${booking.packageName} has been approved!`,
      type: 'SUCCESS'
    });

    return successResponse(res, 200, 'Booking approved successfully', booking);
  } catch (error) {
    next(error);
  }
};

const rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.bookingStatus = 'REJECTED';
    booking.rejectionReason = req.body.rejectionReason || 'No reason provided';
    await booking.save();

    await Notification.create({
      userId: booking.userId,
      title: 'Booking Rejected',
      message: `Your booking for ${booking.packageName} was rejected. Reason: ${booking.rejectionReason}`,
      type: 'DANGER'
    });

    return successResponse(res, 200, 'Booking rejected successfully', booking);
  } catch (error) {
    next(error);
  }
};

// Generic helper to assign a field
const assignField = async (req, res, fieldName, fieldValue, message) => {
  const booking = await Booking.findByPk(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  
  booking[fieldName] = fieldValue;
  
  // Auto-transition to READY_FOR_TOUR if all 4 logistics are assigned
  const hasGuide = !!booking.guideId;
  const hasVehicle = !!booking.vehicleNumber;
  const hasHotel = !!booking.hotelName;
  const hasItinerary = booking.itinerary && booking.itinerary.length > 0;

  if (hasGuide && hasVehicle && hasHotel && hasItinerary) {
    booking.bookingStatus = 'READY_FOR_TOUR';
  } else if (booking.bookingStatus === 'CONFIRMED' && booking.guideId) {
    booking.bookingStatus = 'GUIDE_ASSIGNED';
  }
  
  await booking.save();
  return successResponse(res, 200, message, booking);
};

const assignGuide = async (req, res, next) => {
  try {
    await assignField(req, res, 'guideId', req.body.guideId, 'Guide assigned successfully');
    
    // Notify customer and guide if a guide is assigned
    if (req.body.guideId) {
       await Notification.create({
         userId: req.body.guideId,
         title: 'New Trip Assigned',
         message: `You have been assigned a new trip! Booking ID: ${req.params.id}`,
         type: 'INFO'
       });
    }
  } catch (error) { next(error); }
};

const assignDriver = async (req, res, next) => {
  try { await assignField(req, res, 'driverName', req.body.driverName, 'Driver assigned successfully'); } 
  catch (error) { next(error); }
};

const assignVehicle = async (req, res, next) => {
  try { await assignField(req, res, 'vehicleNumber', req.body.vehicleNumber, 'Vehicle assigned successfully'); } 
  catch (error) { next(error); }
};

const assignHotel = async (req, res, next) => {
  try { await assignField(req, res, 'hotelName', req.body.hotelName, 'Hotel assigned successfully'); } 
  catch (error) { next(error); }
};

const assignLogistics = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    const { guideId, driverName, vehicleNumber, hotelName, pickupLocation, pickupTime } = req.body;
    
    if (guideId) booking.guideId = guideId;
    if (driverName) booking.driverName = driverName;
    if (vehicleNumber) booking.vehicleNumber = vehicleNumber;
    if (hotelName) booking.hotelName = hotelName;
    if (pickupLocation) booking.pickupLocation = pickupLocation;
    if (pickupTime) booking.pickupTime = pickupTime;
    
    const hasGuide = !!booking.guideId;
    const hasVehicle = !!booking.vehicleNumber;
    const hasHotel = !!booking.hotelName;
    const hasItinerary = booking.itinerary && booking.itinerary.length > 0;

    if (hasGuide && hasVehicle && hasHotel && hasItinerary) {
      booking.bookingStatus = 'READY_FOR_TOUR';
    } else {
      booking.bookingStatus = 'GUIDE_ASSIGNED';
    }
    await booking.save();
    
    if (guideId) {
       await Notification.create({
         userId: guideId,
         title: 'New Trip Assigned',
         message: `You have been assigned a new trip! Booking ID: ${req.params.id}`,
         type: 'INFO'
       });
    }
    
    await Notification.create({
      userId: booking.userId,
      title: 'Logistics Assigned',
      message: `Your trip logistics have been finalized. Check your itinerary!`,
      type: 'SUCCESS'
    });

    return successResponse(res, 200, 'Logistics assigned successfully', booking);
  } catch (error) {
    next(error);
  }
};

const getManagerCustomers = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { bookingStatus: 'CONFIRMED' },
      include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] }],
      attributes: ['id', 'totalAmount', 'travelDate', 'packageId']
    });
    
    // Deduplicate customers
    const customersMap = new Map();
    for (const b of bookings) {
      if (b.User) {
        customersMap.set(b.User.id, {
          id: b.User.id,
          customerName: `${b.User.firstName} ${b.User.lastName}`,
          phone: b.User.phone,
          email: b.User.email,
          travelDate: b.travelDate,
          paymentStatus: 'Completed',
          bookingId: b.id
        });
      }
    }
    
    return successResponse(res, 200, 'Customers fetched', Array.from(customersMap.values()));
  } catch (error) { next(error); }
};

const saveItinerary = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    booking.itinerary = req.body.itinerary;

    const hasGuide = !!booking.guideId;
    const hasVehicle = !!booking.vehicleNumber;
    const hasHotel = !!booking.hotelName;
    const hasItinerary = booking.itinerary && booking.itinerary.length > 0;

    if (hasGuide && hasVehicle && hasHotel && hasItinerary) {
      booking.bookingStatus = 'READY_FOR_TOUR';
    }

    await booking.save();
    
    return successResponse(res, 200, 'Itinerary saved successfully', booking);
  } catch (error) { next(error); }
};

module.exports = {
  getManagerBookings,
  getManagerBookingById,
  approveBooking,
  rejectBooking,
  assignGuide,
  assignDriver,
  assignVehicle,
  assignHotel,
  assignLogistics,
  getDashboardStats,
  getManagerCustomers,
  saveItinerary,
  getUpcomingTours,
  getOngoingTours,
  getCompletedTours,
  getCancelledTours
};
