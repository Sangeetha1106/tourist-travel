const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const Vehicle = sequelize.define('Vehicle', {
  vehicleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vehicleName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vehicleType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  vehicleNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  driverName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  driverPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fuelType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'INACTIVE'),
    defaultValue: 'AVAILABLE'
  },
  insuranceExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'vehicles',
  timestamps: true
});

module.exports = Vehicle;
