const Review = require('./review.model');
const Package = require('../package/package.model');
const User = require('../auth/user.model');

const createReview = async (data) => {
  return await Review.create(data);
};

const getAllReviews = async () => {
  return await Review.findAll({ include: [User, Package] });
};

module.exports = {
  createReview,
  getAllReviews
};
