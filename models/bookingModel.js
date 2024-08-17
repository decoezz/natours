const moongoose = require('mongoose');

const bookingSchema = new moongoose.Schema({
  tour: {
    type: moongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Bokking must belong to a Tour!'],
  },
  user: {
    type: moongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Bokking must belong to a User!'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

const Booking = moongoose.model('Booking', bookingSchema);

module.exports = Booking;
