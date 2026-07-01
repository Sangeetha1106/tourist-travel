const Role = require('../modules/role/role.model');
const User = require('../modules/auth/user.model');
const Destination = require('../modules/destination/destination.model');
const Place = require('../modules/place/place.model');
const Package = require('../modules/package/package.model');
const Booking = require('../modules/booking/booking.model');
const Payment = require('../modules/payment/payment.model');
const Guide = require('../modules/guide/guide.model');
const Vehicle = require('../modules/vehicle/vehicle.model');
const TourManager = require('../modules/tourManager/tourManager.model');
const Review = require('../modules/review/review.model');
const Notification = require('../modules/notification/notification.model');

const initializeAssociations = () => {
  // Role & User
  Role.hasMany(User, { foreignKey: 'roleId' });
  User.belongsTo(Role, { foreignKey: 'roleId' });

  // Destination & Place
  Destination.hasMany(Place, { foreignKey: 'destinationId' });
  Place.belongsTo(Destination, { foreignKey: 'destinationId' });

  // Destination & Package
  Destination.hasMany(Package, { foreignKey: 'destinationId' });
  Package.belongsTo(Destination, { foreignKey: 'destinationId' });

  // User & Booking
  User.hasMany(Booking, { foreignKey: 'userId' });
  Booking.belongsTo(User, { foreignKey: 'userId' });

  // Place & Package (Many-to-Many)
  Place.belongsToMany(Package, { through: 'PackagePlaces', foreignKey: 'placeId' });
  Package.belongsToMany(Place, { through: 'PackagePlaces', foreignKey: 'packageId' });

  // Package & Booking
  Package.hasMany(Booking, { foreignKey: 'packageId' });
  Booking.belongsTo(Package, { foreignKey: 'packageId' });

  // Booking & Payment
  Booking.hasOne(Payment, { foreignKey: 'bookingId' });
  Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

  // User & Review
  User.hasMany(Review, { foreignKey: 'userId' });
  Review.belongsTo(User, { foreignKey: 'userId' });

  // Package & Review
  Package.hasMany(Review, { foreignKey: 'packageId' });
  Review.belongsTo(Package, { foreignKey: 'packageId' });

  // User & Notification
  User.hasMany(Notification, { foreignKey: 'userId' });
  Notification.belongsTo(User, { foreignKey: 'userId' });

  return {
    Role,
    User,
    Destination,
    Place,
    Package,
    Booking,
    Payment,
    Guide,
    Vehicle,
    TourManager,
    Review,
    Notification
  };
};

module.exports = initializeAssociations;
