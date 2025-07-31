const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Do: Add middlewhere.
app.use(express.json()); // ? Put and Patch are not included yet.

// Todo. #Method 2.
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
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

const setTour = (req, res) => {
  // Note: In order too do create operation We have to use middlewheres.
  // Create ID.
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

// To call.
app.route('/api/v1/tours').get(getAllTours).post(setTour);
app.route('/api/v1/tours/:id').get(getTour);

// Do: Listening to server.
app.listen(PORT, () => {
  console.log(`Listening at poart ${PORT}...`);
});
