/**
 * External Dependencies
 */
const express = require('express');

/**
 * Internal Dependencies.
 */
const {
  getAllUsers,
  getUser,
  setUser,
  updateUser,
  deleteUser,
} = require('../controllers/userControllers');
const { signup } = require('../controllers/authController');

// Create a users Router.
const router = express.Router();
router.route('/signup').post(signup);
router.route('/').get(getAllUsers).post(setUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
