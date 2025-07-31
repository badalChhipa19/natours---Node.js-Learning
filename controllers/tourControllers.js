/**
 * External dependencies.
 */
const fs = require('fs');

// Read data from files.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// Create Controllers/handlers to handle tours related queries.
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);

  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });

  res.status(200).json({
    ststus: 'success',
    data: {
      tour,
    },
  });
};

exports.setTour = (req, res) => {
  let newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  res.status(500).json({
    status: 'Panding',
    message: 'Handler yet to be configured',
  });
};

exports.deleteTour = (req, res) => {
  res.status(500).json({
    status: 'Panding',
    message: 'Handler yet to be configured',
  });
};
