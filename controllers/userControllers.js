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
const factory = require('./controllerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateCurrentUser = catchAsync(async (req, res, next) => {
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

exports.setUser = (req, res) => {
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

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
