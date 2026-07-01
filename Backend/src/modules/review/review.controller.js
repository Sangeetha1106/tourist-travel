const reviewService = require('./review.service');
const { successResponse } = require('../../shared/utils/response');

const createReview = async (req, res, next) => {
  try {
    const data = { ...req.body, userId: req.user.id };
    const review = await reviewService.createReview(data);
    return successResponse(res, 201, 'Review submitted successfully', review);
  } catch (error) {
    next(error);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getAllReviews();
    return successResponse(res, 200, 'Reviews fetched successfully', reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getAllReviews
};
