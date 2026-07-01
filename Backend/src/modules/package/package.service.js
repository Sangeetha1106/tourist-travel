const Package = require('./package.model');
const Destination = require('../destination/destination.model');
const Place = require('../place/place.model');

const createPackage = async (data) => {
  let placeIds = [];
  if (data.placeIds) {
    try {
      placeIds = typeof data.placeIds === 'string' ? JSON.parse(data.placeIds) : data.placeIds;
    } catch (e) {
      placeIds = data.placeIds.split(',').map(id => parseInt(id.trim()));
    }
  }
  
  const pkg = await Package.create(data);
  
  if (placeIds && placeIds.length > 0) {
    await pkg.setPlaces(placeIds);
  }
  return pkg;
};

const getAllPackages = async (query = {}) => {
  const where = {};
  if (query.destinationId) {
    where.destinationId = query.destinationId;
  }
  if (query.placeId) {
    // This query is trickier with many-to-many, we'd need to use a subquery or include filter
    // For now, we fetch all and include Places.
  }
  return await Package.findAll({ where, include: [Destination, { model: Place, through: { attributes: [] } }] });
};

const getPackageById = async (idOrSlug) => {
  let pkg;
  if (isNaN(idOrSlug)) {
    pkg = await Package.findOne({ where: { slug: idOrSlug }, include: [Destination, { model: Place, through: { attributes: [] } }] });
  } else {
    pkg = await Package.findByPk(idOrSlug, { include: [Destination, { model: Place, through: { attributes: [] } }] });
  }
  
  if (!pkg) {
    const error = new Error('Package not found');
    error.statusCode = 404;
    throw error;
  }
  return pkg;
};

const updatePackage = async (id, data) => {
  const pkg = await getPackageById(id);
  await pkg.update(data);
  
  if (data.placeIds !== undefined) {
    let placeIds = [];
    try {
      placeIds = typeof data.placeIds === 'string' ? JSON.parse(data.placeIds) : data.placeIds;
    } catch (e) {
      placeIds = typeof data.placeIds === 'string' ? data.placeIds.split(',').map(id => parseInt(id.trim())) : [];
    }
    await pkg.setPlaces(placeIds);
  }
  
  return await getPackageById(id);
};

const deletePackage = async (id) => {
  const pkg = await getPackageById(id);
  await pkg.destroy();
  return { message: 'Package deleted successfully' };
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage
};
