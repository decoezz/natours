const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Bookings = require('../models/bookingModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.getOverview = catchAsync(async (req, res, next) => {
  //1)Get tour data from collection
  const tours = await Tour.find();
  //2)Build template

  //3)render that template using tour data from 1
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});
// exports.getTour = catchAsync(async (req, res, next) => {
//   //1)get the data, for the requested tour (including reviews and guides
//   try {
//     const tour = await Tour.findOne({ slug: req.params.slug }).populate({
//       path: 'reviews',
//       fields: 'review rating user',
//     });
//     //2)Build template
//     if (!tour) {
//       return next(new AppError('There is no tour with that name', 404));
//     }
//     //3)Render template using data ffrom 1
//     res.status(200).render('tour', {
//       title: `${tour.name} tours`,
//       tour,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });
exports.getTour = catchAsync(async (req, res, next) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      fields: 'review rating user',
    });

    if (!tour) {
      return next(new AppError('There is no tour with that name', 404));
    }

    res.status(200).render('tour', {
      title: `${tour.name} tour`,
      tour: tour, // Ensure this is correctly populated
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});
exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  //1)Finad all bookings
  const bookings = await Bookings.find({ user: req.user.id });
  //2)Finad tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } }); //it will select all the tours that has tourIDs in our array
  res.status(200).render('overview', {
    tite: 'My Tours',
    tours,
  });
});