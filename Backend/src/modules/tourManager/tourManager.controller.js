const tourManagerService = require('./tourManager.service');
const { successResponse } = require('../../shared/utils/response');

const getTourManagerDashboard = async (req, res, next) => {
  try {
    // Return mock statistics for Tour Manager dashboard
    const dashboardData = {
      totalAssignedTours: 12,
      totalPackagesManaged: 5,
      totalBookings: 150,
      upcomingTours: 3,
      assignedTourGuides: 8,
      recentBookings: 25,
      totalRevenue: 450000
    };
    return successResponse(res, 200, 'Dashboard fetched successfully', dashboardData);
  } catch (error) {
    next(error);
  }
};

const createTourManager = async (req, res, next) => {
  try {
    const manager = await tourManagerService.createTourManager(req.body);
    return successResponse(res, 201, 'Tour Manager created successfully', manager);
  } catch (error) {
    next(error);
  }
};

const getAllTourManagers = async (req, res, next) => {
  try {
    const managers = await tourManagerService.getAllTourManagers();
    return successResponse(res, 200, 'Tour Managers fetched successfully', managers);
  } catch (error) {
    next(error);
  }
};

const getTourManagerById = async (req, res, next) => {
  try {
    const manager = await tourManagerService.getTourManagerById(req.params.id);
    return successResponse(res, 200, 'Tour Manager fetched successfully', manager);
  } catch (error) {
    next(error);
  }
};

const updateTourManager = async (req, res, next) => {
  try {
    const manager = await tourManagerService.updateTourManager(req.params.id, req.body);
    return successResponse(res, 200, 'Tour Manager updated successfully', manager);
  } catch (error) {
    next(error);
  }
};

const deleteTourManager = async (req, res, next) => {
  try {
    await tourManagerService.deleteTourManager(req.params.id);
    return successResponse(res, 200, 'Tour Manager deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTourManagerDashboard,
  createTourManager,
  getAllTourManagers,
  getTourManagerById,
  updateTourManager,
  deleteTourManager
};
