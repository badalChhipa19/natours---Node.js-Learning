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
  .delete(protect, restrictedAction('admin'), deleteReview)
  .patch(protect, restrictedAction('admin'), updateReview);

module.exports = router;
