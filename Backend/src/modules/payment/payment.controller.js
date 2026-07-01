const paymentService = require('./payment.service');
const { successResponse } = require('../../shared/utils/response');
const { ROLES } = require('../../shared/utils/constants');

const createPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    return successResponse(res, 201, 'Payment processed successfully', payment);
  } catch (error) {
    next(error);
  }
};

const getAllPayments = async (req, res, next) => {
  try {
    let payments;
    if (req.user.role === ROLES.CUSTOMER) {
       // Filter payments for CUSTOMER in real app (needs user join via Booking)
       const allPayments = await paymentService.getAllPayments();
       payments = allPayments.filter(p => p.Booking && p.Booking.userId === req.user.id);
    } else {
       payments = await paymentService.getAllPayments();
    }
    return successResponse(res, 200, 'Payments fetched successfully', payments);
  } catch (error) {
    next(error);
  }
};

const getPaymentById = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    return successResponse(res, 200, 'Payment fetched successfully', payment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById
};
