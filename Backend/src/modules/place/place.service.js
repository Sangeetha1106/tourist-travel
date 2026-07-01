const Place = require('./place.model');
const Destination = require('../destination/destination.model');

const Package = require('../package/package.model');

const getAllPlaces = async (query = {}) => {
  const where = {};
  if (query.destinationId) {
    where.destinationId = query.destinationId;
  }
  return await Place.findAll({ where, include: [Destination, { model: Package, through: { attributes: [] } }] });
};

const getPlaceById = async (idOrSlug) => {
  let place;
  if (isNaN(idOrSlug)) {
    place = await Place.findOne({ where: { slug: idOrSlug }, include: Destination });
  } else {
    place = await Place.findByPk(idOrSlug, { include: Destination });
  }
  
  if (!place) {
    const error = new Error('Place not found');
    error.statusCode = 404;
    throw error;
  }
  
  return place;
};

module.exports = {
  getAllPlaces,
  getPlaceById
};
