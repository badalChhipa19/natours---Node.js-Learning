const mongoose = require('mongoose');
const validator = require('validator');

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

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
