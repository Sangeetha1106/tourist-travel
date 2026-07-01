const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const Place = sequelize.define('Place', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  destinationId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
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
  entryFee: {
    type: DataTypes.STRING,
    allowNull: true
  },
  openingTime: {
    type: DataTypes.STRING,
    allowNull: true
  },
  budget: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rating: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bestTime: {
    type: DataTypes.STRING,
    allowNull: true
  },
  hotels: {
    type: DataTypes.STRING,
    allowNull: true
  },
  restaurants: {
    type: DataTypes.STRING,
    allowNull: true
  },
  highlights: {
    type: DataTypes.JSON,
    allowNull: true
  },
  nearbyAttractions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  travelTips: {
    type: DataTypes.JSON,
    allowNull: true
  },
  gallery: {
    type: DataTypes.JSON,
    allowNull: true
  },
  mapLocation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'places',
  timestamps: true
});

module.exports = Place;
