const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');
const { PAYMENT_STATUS } = require('../../shared/utils/constants');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentStatus: {
    type: DataTypes.ENUM(Object.values(PAYMENT_STATUS)),
    defaultValue: PAYMENT_STATUS.PENDING
  }
}, {
  tableName: 'payments',
  timestamps: true
});

module.exports = Payment;
