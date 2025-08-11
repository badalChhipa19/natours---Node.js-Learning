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
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Initialize the app.
const app = express();

// Add middleware.
if (process.env.NODE_ENV === 'developer') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.set('query parser', 'extended');

app.use('/api/v1/tours', toursRoute);
app.use('/api/v1/users', usersRoute);

// Handle 404 errors.
app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
