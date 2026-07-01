const placeService = require('./place.service');
const { successResponse } = require('../../shared/utils/response');

const getAllPlaces = async (req, res, next) => {
  try {
    const places = await placeService.getAllPlaces(req.query);
    return successResponse(res, 200, 'Places fetched successfully', places);
  } catch (error) {
    next(error);
  }
};

const getPlaceById = async (req, res, next) => {
  try {
    const place = await placeService.getPlaceById(req.params.id);
    return successResponse(res, 200, 'Place fetched successfully', place);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPlaces,
  getPlaceById
};
