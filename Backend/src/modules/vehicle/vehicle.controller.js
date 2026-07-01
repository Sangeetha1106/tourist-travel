const vehicleService = require('./vehicle.service');
const { successResponse } = require('../../shared/utils/response');

const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    return successResponse(res, 201, 'Vehicle created successfully', vehicle);
  } catch (error) {
    next(error);
  }
};

const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    return successResponse(res, 200, 'Vehicles fetched successfully', vehicles);
  } catch (error) {
    next(error);
  }
};

const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    return successResponse(res, 200, 'Vehicle fetched successfully', vehicle);
  } catch (error) {
    next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    return successResponse(res, 200, 'Vehicle updated successfully', vehicle);
  } catch (error) {
    next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    return successResponse(res, 200, 'Vehicle deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};
