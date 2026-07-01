const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'roles',
  timestamps: true
});

module.exports = Role;
