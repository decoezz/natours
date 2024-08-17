const authController = require('../controllers/authController.js');
const bookingController = require('../controllers/bookingController.js');
const express = require('express');
const router = express.Router();

// Apply authController.protect to all routes
router.use(authController.protect);

router.get('/checkout-session/:tourID', bookingController.getCheckoutSession);

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(
    authController.restrictTo('admin', 'lead-guide'), // Restrict this route
    bookingController.getBooking,
  )
  .patch(
    authController.restrictTo('admin', 'lead-guide'), // Restrict this route
    bookingController.updateBooking,
  )
  .delete(
    authController.restrictTo('admin', 'lead-guide'), // Restrict this route
    bookingController.deleteBooking,
  );

module.exports = router;
