const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypt = require('crypto');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, 'Please enter a valid email address'],
  },
  photo: {
    type: String,
    default: 'https://example.com/default-photo.png',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'lead-guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Password and confirm password aren't the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // Remove confirmPassword field
  this.confirmPassword = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('find', function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.isPasswordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Create Password Reset Token.
 *
 * @returns {string} - The hashed token.
 */
userSchema.methods.createPasswordResetToken = function () {
  // Generate a random token.
  const resetToken = crypt.randomBytes(16).toString('hex');

  // Hash the token and set it to passwordResetToken field.
  this.passwordResetToken = crypt
    .createHash('SHA256')
    .update(resetToken)
    .digest('hex');

  // Set the expiration time for the token.
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log('Reset Token:', { resetToken }, this.passwordResetToken);

  // Return the plain token.
  return resetToken;
};

const User = mongoose.model('Users', userSchema);

module.exports = User;
