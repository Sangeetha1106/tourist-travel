const roleService = require('./role.service');
const { successResponse } = require('../../shared/utils/response');

const createRole = async (req, res, next) => {
  try {
    const role = await roleService.createRole(req.body);
    return successResponse(res, 201, 'Role created successfully', role);
  } catch (error) {
    next(error);
  }
};

const getAllRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getAllRoles();
    return successResponse(res, 200, 'Roles fetched successfully', roles);
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);
    return successResponse(res, 200, 'Role updated successfully', role);
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    await roleService.deleteRole(req.params.id);
    return successResponse(res, 200, 'Role deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole
};
