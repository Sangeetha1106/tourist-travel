const TourManager = require('./tourManager.model');

const createTourManager = async (data) => {
  return await TourManager.create(data);
};

const getAllTourManagers = async () => {
  return await TourManager.findAll();
};

const getTourManagerById = async (id) => {
  const manager = await TourManager.findByPk(id);
  if (!manager) throw new Error('Tour Manager not found');
  return manager;
};

const updateTourManager = async (id, data) => {
  const manager = await getTourManagerById(id);
  return await manager.update(data);
};

const deleteTourManager = async (id) => {
  const manager = await getTourManagerById(id);
  await manager.destroy();
  return { message: 'Tour Manager deleted successfully' };
};

module.exports = {
  createTourManager,
  getAllTourManagers,
  getTourManagerById,
  updateTourManager,
  deleteTourManager
};
