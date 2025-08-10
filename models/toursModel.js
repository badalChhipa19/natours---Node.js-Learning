/**
 * External Dependencies
 */
const mongoose = require('mongoose');
const sligify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
    },
    slug: String,
    durations: {
      type: Number,
      require: [true, 'A tour must have specified duration'],
    },
    maxGroupSize: {
      type: Number,
      require: [true, 'A tour must a Group Size defined'],
    },
    difficulty: {
      type: String,
      require: [true, 'A tour must have defined difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summery: {
      type: String,
      trim: true,
      require: [true, 'A tour must have summery'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      require: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.durations / 7;
});

// DO: Test of middlewares/hooks* in DB.
tourSchema.pre('save', function () {
  this.slug = sligify(this.name, { lower: true });
}); // Note: This kind of hooks are called document hooks as these are executed for manipulating the document before saving it to the database.

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  next();
}); // Note: This is a query middleware, which means it will run before any find query that starts with 'find'. we also have post hooks, which run after the query is executed.

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
