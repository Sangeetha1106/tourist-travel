const Role = require('./role.model');

const createRole = async (data) => {
  return await Role.create(data);
};

const getAllRoles = async () => {
  return await Role.findAll();
};

const updateRole = async (id, data) => {
  const role = await Role.findByPk(id);
  if (!role) throw new Error('Role not found');
  
  return await role.update(data);
};

const deleteRole = async (id) => {
  const role = await Role.findByPk(id);
  if (!role) throw new Error('Role not found');
  
  await role.destroy();
  return { message: 'Role deleted successfully' };
};

module.exports = {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole
};
