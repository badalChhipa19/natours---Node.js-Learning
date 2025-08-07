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
} = require('../controllers/tourControllers');

// Create Routes.
const router = express.Router();

router.route('/top-5-tours').get(aliasTopTours, getAllTours);
// Perform operation based on method.
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
