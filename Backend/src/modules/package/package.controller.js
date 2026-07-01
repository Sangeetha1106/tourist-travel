const packageService = require('./package.service');
const { successResponse } = require('../../shared/utils/response');

const createPackage = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = req.file.path;
    }
    const pkg = await packageService.createPackage(data);
    return successResponse(res, 201, 'Package created successfully', pkg);
  } catch (error) {
    next(error);
  }
};

const getAllPackages = async (req, res, next) => {
  try {
    const packages = await packageService.getAllPackages(req.query);
    return successResponse(res, 200, 'Packages fetched successfully', packages);
  } catch (error) {
    next(error);
  }
};

const getPackageById = async (req, res, next) => {
  try {
    const pkg = await packageService.getPackageById(req.params.id);
    return successResponse(res, 200, 'Package fetched successfully', pkg);
  } catch (error) {
    next(error);
  }
};

const updatePackage = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = req.file.path;
    }
    const pkg = await packageService.updatePackage(req.params.id, data);
    return successResponse(res, 200, 'Package updated successfully', pkg);
  } catch (error) {
    next(error);
  }
};

const deletePackage = async (req, res, next) => {
  try {
    await packageService.deletePackage(req.params.id);
    return successResponse(res, 200, 'Package deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage
};
