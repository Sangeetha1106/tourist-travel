const express = require('express');
const hotelController = require('./hotel.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');
const authorize = require('../../shared/middlewares/role.middleware');
const { ROLES } = require('../../shared/utils/constants');

const router = express.Router();

router.use(authenticate, authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TOUR_MANAGER]));

router.post('/', hotelController.createHotel);
router.get('/', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotelById);
router.put('/:id', hotelController.updateHotel);
router.delete('/:id', authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN]), hotelController.deleteHotel);

module.exports = router;
