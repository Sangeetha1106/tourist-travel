const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');
const { BOOKING_STATUS } = require('../../shared/utils/constants');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  packageName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  travelDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  totalPersons: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  hasBreakfast: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  hasLunch: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  hasDinner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: true
  },
  childrenCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  emergencyContactName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  emergencyContactNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  idProofType: {
    type: DataTypes.ENUM('Aadhaar', 'Passport'),
    allowNull: true
  },
  idProofFront: {
    type: DataTypes.STRING,
    allowNull: true
  },
  idProofBack: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passportNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passportExpiry: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  bookingNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assignedGuideId: { type: DataTypes.INTEGER, allowNull: true },
  assignedGuideName: { type: DataTypes.STRING, allowNull: true },
  assignedAt: { type: DataTypes.DATE, allowNull: true },
  assignedBy: { type: DataTypes.INTEGER, allowNull: true },
  
  assignedVehicleId: { type: DataTypes.INTEGER, allowNull: true },
  vehicleId: { type: DataTypes.INTEGER, allowNull: true },
  vehicleName: { type: DataTypes.STRING, allowNull: true },
  driverName: { type: DataTypes.STRING, allowNull: true },
  vehicleNumber: { type: DataTypes.STRING, allowNull: true },

  assignedHotelId: { type: DataTypes.INTEGER, allowNull: true },
  hotelId: { type: DataTypes.INTEGER, allowNull: true },
  hotelName: { type: DataTypes.STRING, allowNull: true },
  roomType: { type: DataTypes.STRING, allowNull: true },

  pickupLocation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pickupTime: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rejectionReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tripProgress: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  tripPhotos: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  itineraryId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  itinerary: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  tripStartTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tripEndTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  bookingStatus: {
    type: DataTypes.ENUM(Object.values(BOOKING_STATUS)),
    defaultValue: BOOKING_STATUS.PENDING
  }
}, {
  tableName: 'bookings',
  timestamps: true
});

module.exports = Booking;
