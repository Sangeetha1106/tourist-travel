const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const Package = sequelize.define('Package', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  destinationId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  placeId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  packageName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'packages',
  timestamps: true
});

module.exports = Package;
