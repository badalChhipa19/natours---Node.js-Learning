/**
 * Internal Dependencies
 */
const Tour = require('../models/toursModel');

// Create Controllers/handlers to handle tours related queries.
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    //   results: tours.length,
    //   data: {
    //     tours,
    //   },
  });
};

exports.getTour = (req, res) => {
  // const id = req.params.id * 1;
  // const tour = tours.find((tour) => tour.id === id);
  // if (!tour)
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
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

exports.updateTour = (req, res) => {
  res.status(500).json({
    status: 'Pending',
    message: 'Handler yet to be configured',
  });
};

exports.deleteTour = (req, res) => {
  res.status(500).json({
    status: 'Pending',
    message: 'Handler yet to be configured',
  });
};
