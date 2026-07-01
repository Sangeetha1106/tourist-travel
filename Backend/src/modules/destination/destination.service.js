const Destination = require('./destination.model');
const { Op } = require('sequelize');

const createDestination = async (data) => {
  return await Destination.create(data);
};

const getAllDestinations = async (query = {}) => {
  const where = {};
  if (query.category) {
    where.category = {
      [Op.iLike]: `%${query.category}%`
    };
  }
  return await Destination.findAll({ where });
};

const getDestinationById = async (idOrName) => {
  let destination;
  if (isNaN(idOrName)) {
    // If it's a string like 'ooty', lookup by name (case insensitive)
    destination = await Destination.findOne({ 
      where: { 
        name: { 
          [Op.iLike]: idOrName.replace(/-/g, ' ') 
        } 
      } 
    });
  } else {
    destination = await Destination.findByPk(idOrName);
  }
  
  if (!destination) {
    const error = new Error('Destination not found');
    error.statusCode = 404;
    throw error;
  }
  return destination;
};

const updateDestination = async (id, data) => {
  const destination = await getDestinationById(id);
  return await destination.update(data);
};

const deleteDestination = async (id) => {
  const destination = await getDestinationById(id);
  await destination.destroy();
  return { message: 'Destination deleted successfully' };
};

module.exports = {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination
};
