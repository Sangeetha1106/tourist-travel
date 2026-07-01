const Vehicle = require('./vehicle.model');

const createVehicle = async (data) => {
  return await Vehicle.create(data);
};

const getAllVehicles = async () => {
  return await Vehicle.findAll();
};

const getVehicleById = async (id) => {
  const vehicle = await Vehicle.findByPk(id);
  if (!vehicle) throw new Error('Vehicle not found');
  return vehicle;
};

const updateVehicle = async (id, data) => {
  const vehicle = await getVehicleById(id);
  return await vehicle.update(data);
};

const deleteVehicle = async (id) => {
  const vehicle = await getVehicleById(id);
  await vehicle.destroy();
  return { message: 'Vehicle deleted successfully' };
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};
