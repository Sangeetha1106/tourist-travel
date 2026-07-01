const hotelService = require('./hotel.service');
const { successResponse } = require('../../shared/utils/response');

const createHotel = async (req, res, next) => {
  try {
    const hotel = await hotelService.createHotel(req.body);
    return successResponse(res, 201, 'Hotel created successfully', hotel);
  } catch (error) { next(error); }
};

const getAllHotels = async (req, res, next) => {
  try {
    const hotels = await hotelService.getAllHotels();
    return successResponse(res, 200, 'Hotels fetched successfully', hotels);
  } catch (error) { next(error); }
};

const getHotelById = async (req, res, next) => {
  try {
    const hotel = await hotelService.getHotelById(req.params.id);
    return successResponse(res, 200, 'Hotel fetched successfully', hotel);
  } catch (error) { next(error); }
};

const updateHotel = async (req, res, next) => {
  try {
    const hotel = await hotelService.updateHotel(req.params.id, req.body);
    return successResponse(res, 200, 'Hotel updated successfully', hotel);
  } catch (error) { next(error); }
};

const deleteHotel = async (req, res, next) => {
  try {
    await hotelService.deleteHotel(req.params.id);
    return successResponse(res, 200, 'Hotel deleted successfully');
  } catch (error) { next(error); }
};

module.exports = {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel
};
