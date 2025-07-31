/**
 * External Dependencies
 */
const express = require('express');
const morgan = require('morgan');

/**
 * Internal Dependencies
 */
const usersRoute = require('./routes/userRoutes');
const toursRoute = require('./routes/tourRoutes');

// Initialize the app.
const app = express();

// Add middleware.
if (process.env.NODE_ENV === 'developer') {
  app.use(express.json());
}
app.use(morgan('dev'));

app.use('/api/v1/tours', toursRoute);
app.use('/api/v1/users', usersRoute);

module.exports = app;
