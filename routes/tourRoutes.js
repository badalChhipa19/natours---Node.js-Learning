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
  setTour,
  updateTour,
  deleteTour,
} = require('./../controllers/tourControllers');

// Create Routes.
// Note: Now we will use express's provided route and make our app's rout mount on that.
const toursRoute = express.Router();
toursRoute.route('/').get(getAllTours).post(setTour);
toursRoute.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = toursRoute;
