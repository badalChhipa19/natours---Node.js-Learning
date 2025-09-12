/**
 * External Modules.
 */
const express = require('express');

/**
 * Internal Modules.
 */
const {
  getAllReviews,
  createReview,
} = require('../controllers/reviewController');
const { protect, restrictedAction } = require('../controllers/authController');

// Create Routes.
const router = express.Router();

// Perform operation based on method.
router.route('/').get(getAllReviews);
router
  .route('/addReview')
  .post(protect, restrictedAction('user'), createReview);

module.exports = router;
