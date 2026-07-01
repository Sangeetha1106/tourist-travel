const Hotel = require('./hotel.model');

const createHotel = async (data) => {
  return await Hotel.create(data);
};

const getAllHotels = async () => {
  return await Hotel.findAll();
};

const getHotelById = async (id) => {
  const hotel = await Hotel.findByPk(id);
  if (!hotel) throw new Error('Hotel not found');
  return hotel;
};

const updateHotel = async (id, data) => {
  const hotel = await getHotelById(id);
  return await hotel.update(data);
};

const deleteHotel = async (id) => {
  const hotel = await getHotelById(id);
  await hotel.destroy();
  return { message: 'Hotel deleted successfully' };
};

module.exports = {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel
};
