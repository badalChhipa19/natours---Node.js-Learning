/**
 * External Dependencies
 */
const express = require('express');

/**
 * Internal Dependencies
 */
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourControllers');
const reviewRouter = require('./reviewRoutes');

const { protect, restrictedAction } = require('../controllers/authController');

// Create Routes.
const router = express.Router();

router.use('/:tourId/review', reviewRouter);

// Perform operation based on method.
router.route('/top-5-tours').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(protect, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictedAction('admin'), deleteTour);

module.exports = router;
