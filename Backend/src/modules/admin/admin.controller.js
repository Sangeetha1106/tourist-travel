const Booking = require('../booking/booking.model');
const Package = require('../package/package.model');
const Destination = require('../destination/destination.model');
const User = require('../auth/user.model');
const Notification = require('../notification/notification.model');
const { successResponse } = require('../../shared/utils/response');

const getAllBookings = async (req, res, next) => {
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
    return successResponse(res, 200, 'Bookings fetched successfully', bookings);
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
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

const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Allow editing specific fields
    const { travelDate, totalPersons, specialRequests, hotelName, pickupTime } = req.body;
    
    if (travelDate) booking.travelDate = travelDate;
    if (totalPersons) booking.totalPersons = totalPersons;
    if (specialRequests !== undefined) booking.specialRequests = specialRequests;
    if (hotelName) booking.hotelName = hotelName;
    if (pickupTime) booking.pickupTime = pickupTime;

    await booking.save();
    return successResponse(res, 200, 'Booking updated successfully', booking);
  } catch (error) {
    next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    await booking.destroy();
    return successResponse(res, 200, 'Booking deleted successfully');
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.bookingStatus = 'CANCELLED';
    await booking.save();

    // Notify customer
    await Notification.create({
      userId: booking.userId,
      title: 'Booking Cancelled',
      message: `Your booking #${booking.id} has been cancelled by the admin.`,
      type: 'WARNING'
    });

    return successResponse(res, 200, 'Booking cancelled successfully', booking);
  } catch (error) {
    next(error);
  }
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
      message: `Your booking for ${booking.packageName} has been approved by the Admin!`,
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
      message: `Your booking for ${booking.packageName} was rejected by the Admin. Reason: ${booking.rejectionReason}`,
      type: 'DANGER'
    });

    return successResponse(res, 200, 'Booking rejected successfully', booking);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  cancelBooking,
  approveBooking,
  rejectBooking
};
