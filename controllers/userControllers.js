/**
 * Internal Dependencies
 */
const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Create Controller for user related queries.
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();

  if (!user) return next(new AppError('No users found', 404));

  res.status(200).json({
    status: 'success',
    results: user.length,
    data: {
      user,
    },
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Pending',
    message: 'Handler yet to be configured',
  });
};
exports.setUser = (req, res) => {
  res.status(500).json({
    status: 'Pending',
    message: 'Handler yet to be configured',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Pending',
    message: 'Handler yet to be configured',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Pending',
    message: 'Handler yet to be configured',
  });
};
