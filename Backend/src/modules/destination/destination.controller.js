const destinationService = require('./destination.service');
const { successResponse } = require('../../shared/utils/response');

const createDestination = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = req.file.path;
    }
    const destination = await destinationService.createDestination(data);
    return successResponse(res, 201, 'Destination created successfully', destination);
  } catch (error) {
    next(error);
  }
};

const getAllDestinations = async (req, res, next) => {
  try {
    const destinations = await destinationService.getAllDestinations(req.query);
    return successResponse(res, 200, 'Destinations fetched successfully', destinations);
  } catch (error) {
    next(error);
  }
};

const getDestinationById = async (req, res, next) => {
  try {
    const destination = await destinationService.getDestinationById(req.params.id);
    return successResponse(res, 200, 'Destination fetched successfully', destination);
  } catch (error) {
    next(error);
  }
};

const updateDestination = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = req.file.path;
    }
    const destination = await destinationService.updateDestination(req.params.id, data);
    return successResponse(res, 200, 'Destination updated successfully', destination);
  } catch (error) {
    next(error);
  }
};

const deleteDestination = async (req, res, next) => {
  try {
    await destinationService.deleteDestination(req.params.id);
    return successResponse(res, 200, 'Destination deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination
};
