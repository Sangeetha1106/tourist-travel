const express = require('express');
const paymentController = require('./payment.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);

module.exports = router;
