const Booking = require('../booking/booking.model');
const Package = require('../package/package.model');
const User = require('../auth/user.model');

const generateBookingReport = async (startDate, endDate) => {
  // A simple implementation fetching all bookings
  // Ideally, add filtering by dates
  return await Booking.findAll({ include: [User, Package] });
};

module.exports = {
  generateBookingReport
};
