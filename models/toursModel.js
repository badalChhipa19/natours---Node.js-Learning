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
  setTimeout(() => {
    this.slug = sligify(this.name, { lower: true });
  }, 2000);
  console.log(`Slug is: ${this.slug}`);
});

// tourSchema.pre('save', function () {
//   console.log(`Will save document: ${this.name}`);
// });

// tourSchema.post('save', (doc) => {
//   console.log(`Document saved: ${doc}`);
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
