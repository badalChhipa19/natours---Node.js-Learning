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

// Initilaze the app.
const app = express();

// Do: Add middlewhere.
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/tours', toursRoute);
app.use('/api/v1/users', usersRoute);

module.exports = app;
