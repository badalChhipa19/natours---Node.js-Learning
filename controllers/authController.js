/**
 * @module authController
 * @description Contains authentication and authorization logic for user management.
 */

/**
 * External Dependencies
 */
const jwt = require('jsonwebtoken');
const crypt = require('crypto');

/**
 * Internal Dependencies
 */
const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

/**
 * @function Sign JWT token.
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
 * Create and send JWT token to the client.
 *
 * @param {Object} user - User object.
 * @param {number} statusCode - HTTP status code.
 * @param {Object} res - Response object.
 *
 */
const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

/**
 * @async
 * @function signup.
 * @description Registers a new user and sends back a JWT token.
 *
 * @param {Object} req - Express request object containing user data.
 * @param {Object} res - Express response object used to send response.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {Promise<void>}
 * @throws {AppError} If user creation fails or validation errors occur.
 */
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role,
  });

  createAndSendToken(newUser, 201, res);
});

/**
 * @async
 * @function login
 * @description Authenticates user credentials and returns a JWT token.
 *
 * @param {Object} req - Express request object with email and password.
 * @param {Object} res - Express response object used to send token.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {Promise<void>}
 * @throws {AppError} If credentials are missing or incorrect.
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

  createAndSendToken(user, 200, res);
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
 * @async
 * @function protect
 * @description Middleware to protect routes by verifying JWT token.
 *
 * @param {Object} req - Express request object with authorization header.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {Promise<void>}
 * @throws {AppError} If token is missing, invalid, or user no longer exists.
 */
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there.
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
 * @function restrictTo
 * @description Middleware to restrict access based on user roles.
 *
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'lead-guide').
 *
 * @returns {Function} Express middleware function.
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

/**
 * @async
 * @function forgotPassword
 * @description Sends password reset token to user's email.
 *
 * @param {Object} req - Express request object with user's email.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {Promise<void>}
 * @throws {AppError} If user not found or email sending fails.
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Check if email is provided.
  if (!req.body || !req.body.email) {
    // Return an error if email is not provided.
    return next(new AppError('Please provide your email address', 400));
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('No user found with that email address', 404));
  }

  // Generate a reset token and save it to the user.
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. If you didn't forget your password, please ignore this email!`;

  try {
    sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email!',
  });
});

/**
 * @async
 * @function resetPassword
 * @description Resets user's password using the token from email.
 *
 * @param {Object} req - Express request object with token and new password.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {Promise<void>}
 * @throws {AppError} If token is invalid or expired.
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypt
    .createHash('SHA256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  if (!req.body || !req.body.password || !req.body.confirmPassword) {
    return next(
      new AppError('Please provide password and confirm password', 400),
    );
  }

  // 2) If token has not expired, and there is user, set the new password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: true });
  // 3) Update changedPasswordAt property for the user
  // (This is handled by the pre-save hook in the user model)
  // 4) Log the user in, send JWT
  createAndSendToken(user, 200, res);
});

/**
 * @async
 * @function updatePassword
 * @description Allows logged-in users to update their password.
 *
 * @param {Object} req - Express request object with current and new passwords.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {Promise<void>}
 * @throws {AppError} If current password is incorrect or update fails.
 */
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  console.log('Updating password for user:', req.user);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }
  // 3) If so, update password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save(); // This will trigger the pre-save hook to hash the password
  // 4) Log user in, send JWT
  createAndSendToken(user, 200, res);
});
