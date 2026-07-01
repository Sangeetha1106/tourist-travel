const reportService = require('./report.service');
const { successResponse } = require('../../shared/utils/response');

const getBookingReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await reportService.generateBookingReport(startDate, endDate);
    return successResponse(res, 200, 'Report generated successfully', report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookingReport
};
