const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    minlength: 8,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm Password is required'],
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

const User = mongoose.model('Users', userSchema);

module.exports = User;
