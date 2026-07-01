const Booking = require('./booking.model');
const Package = require('../package/package.model');
const User = require('../auth/user.model');
const Payment = require('../payment/payment.model');

const createBooking = async (data) => {
  const packageDetails = await Package.findByPk(data.packageId);
  if (!packageDetails) throw new Error('Package not found');
  
  let mealAddonPerPerson = 0;
  if (data.hasBreakfast) mealAddonPerPerson += 1000;
  if (data.hasLunch) mealAddonPerPerson += 1500;
  if (data.hasDinner) mealAddonPerPerson += 2000;

  const basePrice = parseFloat(packageDetails.price) || 0;
  const totalAmount = (basePrice + mealAddonPerPerson) * (data.totalPersons || 1);
  
  const bookingData = {
    ...data,
    packageName: packageDetails.packageName,
    totalAmount
  };
  
  return await Booking.create(bookingData);
};

const getAllBookings = async () => {
  return await Booking.findAll({ include: [User, Package, Payment] });
};

const getBookingById = async (id) => {
  const booking = await Booking.findByPk(id, { include: [User, Package, Payment] });
  if (!booking) throw new Error('Booking not found');
  return booking;
};

const updateBooking = async (id, data) => {
  const booking = await getBookingById(id);
  return await booking.update(data);
};

const deleteBooking = async (id) => {
  const booking = await getBookingById(id);
  await booking.destroy();
  return { message: 'Booking deleted successfully' };
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking
};
