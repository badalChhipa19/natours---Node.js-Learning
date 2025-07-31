/**
 * External Dependencies
 */
const express = require('express');

/**
 * Internal Dependencies
 */
const {
  checkID,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = require('./../controllers/tourControllers');

// Create middleware to verify if req have name and price in it or not while sending new tour.
const checkValidation = (req, res, next) => {
  if (!req.body.name && !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Incomplete data. name and price is require',
    });
  }

  next();
};

// Create Routes.
const router = express.Router();

// Add middleware based on param.
router.param('id', checkID);

// Perform operation based on method.
router.route('/').get(getAllTours).post(checkValidation, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
