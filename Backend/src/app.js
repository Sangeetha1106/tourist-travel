const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const errorHandler = require('./shared/middlewares/error.middleware');

// Route Imports
const authRoutes = require('./modules/auth/auth.routes');
const roleRoutes = require('./modules/role/role.routes');
const destinationRoutes = require('./modules/destination/destination.routes');
const packageRoutes = require('./modules/package/package.routes');
const bookingRoutes = require('./modules/booking/booking.routes');
const paymentRoutes = require('./modules/payment/payment.routes');
const guideRoutes = require('./modules/guide/guide.routes');
const vehicleRoutes = require('./modules/vehicle/vehicle.routes');
const tourManagerRoutes = require('./modules/tourManager/tourManager.routes');
const reviewRoutes = require('./modules/review/review.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const reportRoutes = require('./modules/report/report.routes');
const placeRoutes = require('./modules/place/place.routes');
const uploadRoutes = require('./modules/upload/upload.routes');
const hotelRoutes = require('./modules/hotel/hotel.routes');

const app = express();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
const adminRoutes = require('./modules/admin/admin.routes');
const managerRoutes = require('./modules/manager/manager.routes');

app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/guide', guideRoutes); // Alias for frontend
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/tour-managers', tourManagerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/hotels', hotelRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Welcome to Tourist Travel Management System API');
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
