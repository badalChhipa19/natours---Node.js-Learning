/**
 * External Dependencies
 */
const jwt = require('jsonwebtoken');
// const { promisify } = require('util');

/**
 * Internal Dependencies
 */
const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * Sign JWT Token.
 *
 * @param {string} id - User ID.
 *
 * @return {string} - Signed JWT token.
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

/**
 * User Signup Handler.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware function.
 *
 * @return {Promise<void>} - Returns a promise that resolves to void.
 */
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.confirmPassword,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

/**
 * User Login Handler.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware function.
 *
 * @return {Promise<void>} - Returns a promise that resolves to void.
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

/**
 * Validate JWT Token.
 *
 * @param {string} token - JWT token to validate.
 * @param {string} secrets - Secret key to verify the token.
 * @return {Promise<Object>} - Returns a promise that resolves to the decoded token.
 *
 * @return {Promise<Object>} - Returns a promise that resolves to the decoded token.
 */
const validateToken = (token, secrets) =>
  new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, secrets);
      resolve(decoded);
    } catch (error) {
      reject(new AppError(error, 401));
    }
  });

/**
 * Protect Middleware.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware function.
 *
 * @return {Promise<void>} - Returns a promise that resolves to void.
 */
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  // 2) Verification token
  // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const decoded = await validateToken(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  // 4) Check if user changed password after the token was issued.
  if (currentUser.isPasswordChanged(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  // Grant access to protected route
  req.user = currentUser;

  next();
});

/**
 * Restrict Access to Certain Roles.
 *
 * @param {...string} roles - Roles that are allowed to access the route.
 *
 * @return {Function} - Middleware function that checks user role.
 */
exports.restrictedAction =
  (...roles) =>
  (req, res, next) => {
    // roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };
