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
} = require('./../controllers/userControllers');

// Create a users Router.
const usersRoute = express.Router();
usersRoute.route('/').get(getAllUsers).post(setUser);
usersRoute.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = usersRoute;
