/**
 * External Dependencies
 */
const express = require('express');
const morgan = require('morgan');
const qs = require('qs');

/**
 * Internal Dependencies
 */
const usersRoute = require('./routes/userRoutes');
const toursRoute = require('./routes/tourRoutes');

// Initialize the app.
const app = express();

// Add middleware.
if (process.env.NODE_ENV === 'developer') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.set('query parser', (str) => qs.parse(str));

app.use('/api/v1/tours', toursRoute);
app.use('/api/v1/users', usersRoute);

module.exports = app;
