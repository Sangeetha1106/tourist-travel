const Guide = require('./guide.model');

const createGuide = async (data) => {
  return await Guide.create(data);
};

const getAllGuides = async () => {
  return await Guide.findAll();
};

const getGuideById = async (id) => {
  const guide = await Guide.findByPk(id);
  if (!guide) throw new Error('Guide not found');
  return guide;
};

const updateGuide = async (id, data) => {
  const guide = await getGuideById(id);
  return await guide.update(data);
};

const deleteGuide = async (id) => {
  const guide = await getGuideById(id);
  await guide.destroy();
  return { message: 'Guide deleted successfully' };
};

module.exports = {
  createGuide,
  getAllGuides,
  getGuideById,
  updateGuide,
  deleteGuide
};
