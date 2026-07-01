const express = require('express');
const reviewController = require('./review.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');
const authorize = require('../../shared/middlewares/role.middleware');
const { ROLES } = require('../../shared/utils/constants');

const router = express.Router();

router.get('/', reviewController.getAllReviews);

router.use(authenticate);
router.post('/', authorize([ROLES.CUSTOMER]), reviewController.createReview);

module.exports = router;
