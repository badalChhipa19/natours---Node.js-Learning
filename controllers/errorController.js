module.exports = (err, req, res, next) => {
  // Set default status code to 500 if not provided.
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  // Send the error response.
  res.status(statusCode).json({
    status,
    message: err.message,
    ...(process.env.NODE_ENV === 'developer' && { stack: err.stack }),
  });
};
