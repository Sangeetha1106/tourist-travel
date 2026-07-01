const guideService = require('./guide.service');
const { successResponse } = require('../../shared/utils/response');
const Booking = require('../booking/booking.model');
const Package = require('../package/package.model');
const Destination = require('../destination/destination.model');
const User = require('../auth/user.model');
const Notification = require('../notification/notification.model');
const { hashPassword } = require('../../shared/utils/bcrypt');
const { Op } = require('sequelize');

// ---- GUIDE TERMINAL ENDPOINTS ----

const getGuideDashboard = async (req, res, next) => {
  try {
    const guideId = req.user.id;
    const trips = await Booking.findAll({ where: { assignedGuideId: guideId } });

    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const assignedTours = trips.filter(t => t.bookingStatus === 'GUIDE_ASSIGNED').length;
    const todaysTrips = trips.filter(t => t.bookingStatus === 'READY_FOR_TOUR' && new Date(t.travelDate).getTime() >= today.getTime() && new Date(t.travelDate).getTime() < tomorrow.getTime()).length;
    const upcomingTrips = trips.filter(t => t.bookingStatus === 'READY_FOR_TOUR' && new Date(t.travelDate).getTime() >= tomorrow.getTime()).length;
    const inProgressTours = trips.filter(t => t.bookingStatus === 'IN_PROGRESS').length;
    const completedTrips = trips.filter(t => t.bookingStatus === 'COMPLETED').length;
    const cancelledTours = trips.filter(t => t.bookingStatus === 'CANCELLED' || t.bookingStatus === 'REJECTED').length;
    
    // Unique assigned customers
    const uniqueCustomers = new Set(trips.map(t => t.userId)).size;
    
    const unreadNotifications = await Notification.count({ where: { userId: guideId, isRead: false } });

    const dashboardData = {
      assignedTours,
      todaysTrips,
      upcomingTrips,
      inProgressTours,
      completedTrips,
      cancelledTours,
      travellersCount: uniqueCustomers,
      unreadNotifications
    };
    return successResponse(res, 200, 'Dashboard fetched successfully', dashboardData);
  } catch (error) {
    next(error);
  }
};

const getFilteredGuideBookings = async (res, whereClause, message) => {
  const bookings = await Booking.findAll({
    where: whereClause,
    include: [
      { model: User, attributes: ['firstName', 'lastName', 'email', 'phone'] },
      { model: Package, attributes: ['packageName'], include: [{ model: Destination, attributes: ['name'] }] }
    ],
    order: [['travelDate', 'ASC']]
  });
  return successResponse(res, 200, message, bookings);
};

const getAssignedTours = async (req, res, next) => {
  try {
    await getFilteredGuideBookings(res, { assignedGuideId: req.user.id, bookingStatus: 'GUIDE_ASSIGNED' }, 'Assigned tours fetched');
  } catch (error) { next(error); }
};

const getTodayTours = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    await getFilteredGuideBookings(res, { assignedGuideId: req.user.id, bookingStatus: 'READY_FOR_TOUR', travelDate: { [Op.gte]: today, [Op.lt]: tomorrow } }, 'Today tours fetched');
  } catch (error) { next(error); }
};

const getUpcomingTours = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    await getFilteredGuideBookings(res, { assignedGuideId: req.user.id, bookingStatus: 'READY_FOR_TOUR', travelDate: { [Op.gte]: tomorrow } }, 'Upcoming tours fetched');
  } catch (error) { next(error); }
};

const getInProgressTours = async (req, res, next) => {
  try {
    await getFilteredGuideBookings(res, { assignedGuideId: req.user.id, bookingStatus: 'IN_PROGRESS' }, 'In Progress tours fetched');
  } catch (error) { next(error); }
};

const getCompletedTours = async (req, res, next) => {
  try {
    await getFilteredGuideBookings(res, { assignedGuideId: req.user.id, bookingStatus: 'COMPLETED' }, 'Completed tours fetched');
  } catch (error) { next(error); }
};

const getCancelledTours = async (req, res, next) => {
  try {
    await getFilteredGuideBookings(res, { assignedGuideId: req.user.id, bookingStatus: { [Op.in]: ['CANCELLED', 'REJECTED'] } }, 'Cancelled tours fetched');
  } catch (error) { next(error); }
};

const getGuideTrips = async (req, res, next) => {
  try {
    await getFilteredGuideBookings(res, { assignedGuideId: req.user.id }, 'All assigned trips fetched');
  } catch (error) {
    next(error);
  }
};

const getGuideTripById = async (req, res, next) => {
  try {
    const trip = await Booking.findOne({
      where: { id: req.params.id, assignedGuideId: req.user.id },
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email', 'phone'] },
        { model: Package, include: [{ model: Destination, attributes: ['name'] }] }
      ]
    });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    return successResponse(res, 200, 'Trip details fetched', trip);
  } catch (error) {
    next(error);
  }
};

const acceptTour = async (req, res, next) => {
  try {
    const trip = await Booking.findOne({ where: { id: req.params.bookingId, assignedGuideId: req.user.id } });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    trip.bookingStatus = 'READY_FOR_TOUR';
    await trip.save();
    return successResponse(res, 200, 'Tour accepted successfully', trip);
  } catch (error) { next(error); }
};

const startTour = async (req, res, next) => {
  try {
    const trip = await Booking.findOne({ where: { id: req.params.bookingId, assignedGuideId: req.user.id } });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    trip.bookingStatus = 'IN_PROGRESS';
    trip.tripStartTime = new Date();
    
    const progress = trip.tripProgress || [];
    progress.push({ day: '1', place: 'Pickup', remarks: 'Trip Started', time: new Date().toISOString() });
    trip.tripProgress = progress;

    await trip.save();
    
    // Notify Customer
    await Notification.create({
      userId: trip.userId,
      title: 'Trip Started',
      message: `Your trip to ${trip.packageName} has started!`,
      type: 'INFO'
    });

    return successResponse(res, 200, 'Tour started successfully', trip);
  } catch (error) {
    next(error);
  }
};

const completeTour = async (req, res, next) => {
  try {
    const trip = await Booking.findOne({ where: { id: req.params.bookingId, assignedGuideId: req.user.id } });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    trip.bookingStatus = 'COMPLETED';
    trip.tripEndTime = new Date();
    
    const progress = trip.tripProgress || [];
    progress.push({ day: 'Final', place: 'Drop', remarks: 'Trip Completed', time: new Date().toISOString() });
    trip.tripProgress = progress;

    await trip.save();
    
    // Notify Customer
    await Notification.create({
      userId: trip.userId,
      title: 'Trip Completed',
      message: `Your trip to ${trip.packageName} has been completed successfully. Please leave a review!`,
      type: 'SUCCESS'
    });

    return successResponse(res, 200, 'Tour completed successfully', trip);
  } catch (error) {
    next(error);
  }
};

const updateProgress = async (req, res, next) => {
  try {
    const trip = await Booking.findOne({ where: { id: req.params.id, assignedGuideId: req.user.id } });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const { day, place, arrivalTime, departureTime, remarks } = req.body;
    
    const progress = trip.tripProgress || [];
    progress.push({ day, place, arrivalTime, departureTime, remarks, time: new Date().toISOString() });
    
    trip.tripProgress = progress;
    if (trip.bookingStatus === 'ACCEPTED' || trip.bookingStatus === 'TRIP_STARTED') {
      trip.bookingStatus = 'IN_PROGRESS';
    }
    
    await trip.save();
    return successResponse(res, 200, 'Progress logged successfully', trip);
  } catch (error) {
    next(error);
  }
};

const uploadPhotos = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No photos uploaded.' });
    }
    const paths = req.files.map(file => `/uploads/trips/${file.filename}`);
    
    const { tripId } = req.body;
    if (tripId) {
       const trip = await Booking.findOne({ where: { id: tripId, assignedGuideId: req.user.id } });
       if (trip) {
          const existingPhotos = trip.tripPhotos || [];
          trip.tripPhotos = [...existingPhotos, ...paths];
          await trip.save();
       }
    }

    return successResponse(res, 200, 'Photos uploaded successfully', paths);
  } catch (error) {
    next(error);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const trips = await Booking.findAll({
      where: { assignedGuideId: req.user.id },
      include: [
        { model: Package, attributes: ['packageName'] },
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] }
      ]
    });

    const customers = trips.map(t => ({
      id: t.userId,
      name: t.customerName,
      email: t.email,
      phone: t.phone,
      package: t.Package?.packageName,
      travelDate: t.travelDate,
      emergencyContactName: t.emergencyContactName,
      emergencyContactNumber: t.emergencyContactNumber
    }));

    return successResponse(res, 200, 'Customers fetched', customers);
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    return successResponse(res, 200, 'Notifications fetched', notifications);
  } catch (error) {
    next(error);
  }
};

const readNotification = async (req, res, next) => {
  try {
    const notif = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
    
    notif.isRead = true;
    await notif.save();
    return successResponse(res, 200, 'Notification marked read', notif);
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.update({ isRead: true }, { where: { userId: req.user.id, isRead: false } });
    return successResponse(res, 200, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const notif = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
    
    await notif.destroy();
    return successResponse(res, 200, 'Notification deleted successfully');
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const { firstName, lastName, phone, address, bio, experience, languages } = req.body;
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    
    await user.save();
    return successResponse(res, 200, 'Profile updated', user);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ success: false, message: 'Password is required' });

    user.password = await hashPassword(newPassword);
    await user.save();
    
    return successResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

// ---- ADMIN/MANAGER GUIDE ENDPOINTS ----

const createGuide = async (req, res, next) => {
  try {
    const guide = await guideService.createGuide(req.body);
    return successResponse(res, 201, 'Guide created successfully', guide);
  } catch (error) {
    next(error);
  }
};

const getAllGuides = async (req, res, next) => {
  try {
    const guides = await guideService.getAllGuides();
    return successResponse(res, 200, 'Guides fetched successfully', guides);
  } catch (error) {
    next(error);
  }
};

const getGuideById = async (req, res, next) => {
  try {
    const guide = await guideService.getGuideById(req.params.id);
    return successResponse(res, 200, 'Guide fetched successfully', guide);
  } catch (error) {
    next(error);
  }
};

const updateGuideAdmin = async (req, res, next) => {
  try {
    const guide = await guideService.updateGuide(req.params.id, req.body);
    return successResponse(res, 200, 'Guide updated successfully', guide);
  } catch (error) {
    next(error);
  }
};

const deleteGuideAdmin = async (req, res, next) => {
  try {
    await guideService.deleteGuide(req.params.id);
    return successResponse(res, 200, 'Guide deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGuideDashboard,
  getGuideTrips,
  getAssignedTours,
  getTodayTours,
  getUpcomingTours,
  getInProgressTours,
  getCompletedTours,
  getCancelledTours,
  getGuideTripById,
  acceptTour,
  startTour,
  completeTour,
  updateProgress,
  uploadPhotos,
  getCustomers,
  getNotifications,
  readNotification,
  markAllNotificationsRead,
  deleteNotification,
  updateProfile,
  changePassword,

  createGuide,
  getAllGuides,
  getGuideById,
  updateGuideAdmin,
  deleteGuideAdmin
};
