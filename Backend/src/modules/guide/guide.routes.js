const express = require('express');
const guideController = require('./guide.controller');
const authenticate = require('../../shared/middlewares/auth.middleware');
const authorize = require('../../shared/middlewares/role.middleware');
const { ROLES } = require('../../shared/utils/constants');
const upload = require('../../shared/middlewares/upload.middleware');

const router = express.Router();

router.use(authenticate);

// ============================================
// TOUR GUIDE ROUTES
// ============================================
router.get('/dashboard', authorize([ROLES.TOUR_GUIDE]), guideController.getGuideDashboard);
router.get('/trips', authorize([ROLES.TOUR_GUIDE]), guideController.getGuideTrips); // Keeping this for backward compatibility
router.get('/assigned', authorize([ROLES.TOUR_GUIDE]), guideController.getAssignedTours);
router.get('/today', authorize([ROLES.TOUR_GUIDE]), guideController.getTodayTours);
router.get('/upcoming', authorize([ROLES.TOUR_GUIDE]), guideController.getUpcomingTours);
router.get('/in-progress', authorize([ROLES.TOUR_GUIDE]), guideController.getInProgressTours);
router.get('/completed', authorize([ROLES.TOUR_GUIDE]), guideController.getCompletedTours);
router.get('/cancelled', authorize([ROLES.TOUR_GUIDE]), guideController.getCancelledTours);

router.get('/trips/:id', authorize([ROLES.TOUR_GUIDE]), guideController.getGuideTripById);

// Actions
router.put('/:bookingId/accept', authorize([ROLES.TOUR_GUIDE]), guideController.acceptTour);
router.put('/:bookingId/start', authorize([ROLES.TOUR_GUIDE]), guideController.startTour);
router.put('/:bookingId/complete', authorize([ROLES.TOUR_GUIDE]), guideController.completeTour);
router.patch('/trips/:id/progress', authorize([ROLES.TOUR_GUIDE]), guideController.updateProgress);

// POST /api/guide/photos (Accept multiple photos)
router.post('/photos', authorize([ROLES.TOUR_GUIDE]), upload.array('photos', 10), guideController.uploadPhotos);

router.get('/customers', authorize([ROLES.TOUR_GUIDE]), guideController.getCustomers);
router.get('/notifications', authorize([ROLES.TOUR_GUIDE]), guideController.getNotifications);
router.patch('/notifications/:id/read', authorize([ROLES.TOUR_GUIDE]), guideController.readNotification);
router.put('/notifications/read-all', authorize([ROLES.TOUR_GUIDE]), guideController.markAllNotificationsRead);
router.delete('/notifications/:id', authorize([ROLES.TOUR_GUIDE]), guideController.deleteNotification);

router.put('/profile', authorize([ROLES.TOUR_GUIDE]), guideController.updateProfile);
router.put('/change-password', authorize([ROLES.TOUR_GUIDE]), guideController.changePassword);

// ============================================
// ADMIN / MANAGER ROUTES (Managing Guides)
// ============================================
router.get('/', guideController.getAllGuides);
router.get('/:id', guideController.getGuideById);

router.use(authorize([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TOUR_MANAGER]));
router.post('/', guideController.createGuide);
router.put('/:id', guideController.updateGuideAdmin);
router.delete('/:id', guideController.deleteGuideAdmin);

module.exports = router;
