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
  updateCurrentUserData,
  deleteMe,
  deleteUser,
} = require('../controllers/userControllers');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictedAction,
} = require('../controllers/authController');

// Create a users Router.
const router = express.Router();

// Define routes and attach controller functions to them. (modularizing routes)
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protect, updatePassword);
router.patch('/updateCurrentUserData', protect, updateCurrentUserData);
router.delete('/deleteMe', protect, deleteMe);
router.delete('/:id', protect, restrictedAction('admin'), deleteUser);

// (old way)
router.route('/login').post(login);
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser);

module.exports = router;
