const User = require('../auth/user.model');
const Booking = require('../booking/booking.model');
const Package = require('../package/package.model');
const Destination = require('../destination/destination.model');

const getAdminDashboardStats = async () => {
  const totalUsers = await User.count();
  const totalBookings = await Booking.count();
  const totalPackages = await Package.count();
  const totalDestinations = await Destination.count();

  // calculate total revenue
  const bookings = await Booking.findAll({ attributes: ['totalAmount', 'bookingStatus'] });
  const totalRevenue = bookings
    .filter(b => b.bookingStatus === 'COMPLETED' || b.bookingStatus === 'CONFIRMED')
    .reduce((acc, curr) => acc + parseFloat(curr.totalAmount), 0);

  const pendingPayments = bookings.filter(b => b.bookingStatus === 'PENDING').length;
  const successfulPayments = bookings.filter(b => b.bookingStatus === 'COMPLETED' || b.bookingStatus === 'CONFIRMED').length;
  const failedPayments = 0; // Keeping 0 for now as failures are not tracked heavily yet
  const totalPayments = successfulPayments + failedPayments;

  return {
    totalUsers,
    totalBookings,
    totalPackages,
    totalDestinations,
    totalRevenue,
    totalPayments,
    successfulPayments,
    failedPayments,
    pendingPayments
  };
};

module.exports = {
  getAdminDashboardStats
};
