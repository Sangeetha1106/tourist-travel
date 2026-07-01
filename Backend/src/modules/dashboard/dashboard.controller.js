const dashboardService = require('./dashboard.service');
const { successResponse } = require('../../shared/utils/response');

const getAdminDashboard = async (req, res, next) => {
  try {
    const stats = await dashboardService.getAdminDashboardStats();
    return successResponse(res, 200, 'Dashboard stats fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard
};
