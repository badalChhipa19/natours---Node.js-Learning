/**
 * @module userControllers
 * @description Controller for handling user-related operations.
 */

/**
 * Internal Dependencies
 */
const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

/**
 *@function getAllUsers
 * @description Retrieves all users from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {Promise<void>}
 * @throws {AppError} If no users are found.
 */
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

/**
 * @function updateUserData
 * @description Updates user data for the currently logged-in user.
 *
 * @param {Object} req - Express request object containing user data.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {Promise<void>}
 * @throws {AppError} If user is not found or update fails.
 */
exports.updateCurrentUserData = catchAsync(async (req, res, next) => {
  const user = await req.user;
  if (!user) return next(new AppError('User not found', 404));

  // Filter out unwanted fields names that are not allowed to be updated
  const filterBody = filterObj(req.body, 'name', 'email');

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
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

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
