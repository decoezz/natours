const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim: true,
      unique: true,
      maxlength: [40, 'A tour must have at most 40 characters'],
      minlength: [10, 'A tour must have at least 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'hard', 'difficult'],
        message: 'Difficulty is either: easy, medium, hard',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
      set: (val) => Math.round(val * 10) / 10, //4.6666,46.666,47,4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price; //250<200
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true, //will remove all the white spaces in the begginggs and in the end
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      time: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
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
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], //longitude , lattitude
      address: String,
      description: String,
    },
    //embded document of locations
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, //convert virtual properties into real properties
  },
);
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.virtual('duartionWeeks').get(function () {
  return this.duration / 7;
});
//Document Middleware:runs before the .save() command and the .create() command
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); //convert the name to slug
  next();
});

//emdedding guides
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => {
//     return await User.findById(id);
//   });
//   this.guides = await Promise.all(guidesPromises); //since guidesPromises is an array full of promises we need to use Promise.all to finsish all the promises
//   next();
// });

// tourSchema.pre('save', function (next) {
//   console.log('Will save Document..');
//   next();
// });
// tourSchema.post('save', function (doc, next) {
//   console.log('New Tour has been saved', doc);
//   next();
// });
//Query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now(); //get the current time before the query starts
  next();
});
//a middleware to give the amount of time it took to do a query
// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   next();
// });
// //Aggregation middleware
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //add a $match stage to the pipeline
//   console.log(this.pipeline());
//   next();
// });
//Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', //the name of reference inside the reviewModel
  localField: '_id', //the name of tour inside our tourModel(_id refers to a certain tour that we want)
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v-passwordChangedAt',
  });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
