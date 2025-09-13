/**
 * External Modules.
 */
const express = require('express');

/**
 * Internal Modules.
 */
const {
  getAllReviews,
  setTourAndUserIds,
  createReview,
  deleteReview,
  updateReview,
  getReview,
} = require('../controllers/reviewController');
const { protect, restrictedAction } = require('../controllers/authController');

// Create Routes.
const router = express.Router({ mergeParams: true });

// Perform operation based on method.
router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictedAction('user'), setTourAndUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(protect, restrictedAction('admin'), updateReview)
  .delete(protect, restrictedAction('admin'), deleteReview);

module.exports = router;
