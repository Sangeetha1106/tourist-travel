const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const Hotel = sequelize.define('Hotel', {
  hotelId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hotelName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  starRating: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  roomType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  availableRooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  checkInTime: {
    type: DataTypes.STRING,
    allowNull: true
  },
  checkOutTime: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'AVAILABLE' // Using string or ENUM, but request just said "status". Let's use ENUM to be consistent if needed, but STRING is safer. User said "status" under Fields but didn't specify ENUM for Hotel. I will use string.
  }
}, {
  tableName: 'hotels',
  timestamps: true
});

module.exports = Hotel;
