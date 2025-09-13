/**
 * Internal Dependencies
 */
const Tours = require('../models/toursModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./controllerFactory');

//Do: Create Controllers/handlers to handle tours related queries.
// Crete alias Tours middleware.
exports.aliasTopTours = (req, res, next) => {
  // Set default query parameters for top tours.
  req.query = {
    ...req.query,
    limit: req.query.limit || '5',
    sort: req.query.sort || '-ratingsAverage,price',
    fields: req.query.fields || 'name,price,ratingsAverage,summary,difficulty',
  };

  // Note: If you want to set default values for query params, you can also do it like this too.
  // req.query.limit = '5';
  // req.query.sort = '-ratingsAverage,price';
  // req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tours, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Get Tours and send response.
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tours.findById(req.params.id).populate('reviews');

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = factory.createOne(Tours);
exports.updateTour = factory.updateOne(Tours);
exports.deleteTour = factory.deleteOne(Tours);

// Aggregation pipeline example.
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tours.aggregate([
    { $match: { ratingAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year);

  const plan = await Tours.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 }, // Exclude _id field.
    },
    { $sort: { numToursStarts: -1 } }, // Sort by number of tours starting.
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
