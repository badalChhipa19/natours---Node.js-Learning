/**
 * Internal Dependencies
 */
const Tour = require('../models/toursModel');

// Create Controllers/handlers to handle tours related queries.
exports.getAllTours = async (req, res) => {
  try {
    // Do: Filtering.
    // 1. get query params.
    const queryObj = { ...req.query };

    // 2. remove special queries. - Filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2.1 Advance Filtering.
    let queryString = JSON.stringify(queryObj);
    queryString = JSON.parse(
      queryString.replace(/\b(lte|lt|gte|gt)\b/g, (match) => `$${match}`),
    );

    let query = Tour.find(queryString);

    // 3. Sort.
    if (req.query.sort) {
      const sortQuery = req.query.sort.split(',').join(' ');
      query = query.sort(sortQuery);
    } else {
      query = query.sort('createdAt');
    }

    //4. Select Fields.
    if (req.query.fields) {
      const selectedFields = req.query.fields.split(',').join(' ');
      query = query.select(selectedFields);
    } else {
      query = query.select('-__v');
    }

    // Get Tours and send response.
    const tours = await query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); // Similar of doing .find({id: "id"});
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
