const Payment = require('./payment.model');
const Booking = require('../booking/booking.model');
const { BOOKING_STATUS, PAYMENT_STATUS } = require('../../shared/utils/constants');

const createPayment = async (data) => {
  const { bookingId, amount, paymentMethod } = data;
  
  const booking = await Booking.findByPk(bookingId);
  if (!booking) throw new Error('Booking not found');
  if (booking.bookingStatus !== BOOKING_STATUS.PENDING) {
    throw new Error('Booking is not in pending state');
  }

  // Generate mock transaction ID
  const transactionId = 'TXN' + Math.floor(1000000000 + Math.random() * 9000000000);

  const paymentData = {
    bookingId,
    amount,
    paymentMethod,
    transactionId,
    paymentStatus: PAYMENT_STATUS.COMPLETED
  };

  const payment = await Payment.create(paymentData);

  // Update booking status and generate tracking numbers
  await booking.update({ 
    bookingStatus: BOOKING_STATUS.PENDING,
    bookingNumber: 'BKG' + Math.floor(100000 + Math.random() * 900000),
    invoiceNumber: 'INV' + Math.floor(10000 + Math.random() * 90000)
  });

  return payment;
};

const getAllPayments = async () => {
  return await Payment.findAll({ include: Booking });
};

const getPaymentById = async (id) => {
  const payment = await Payment.findByPk(id, { include: Booking });
  if (!payment) throw new Error('Payment not found');
  return payment;
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById
};
