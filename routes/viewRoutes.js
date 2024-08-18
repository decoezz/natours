const express = require('express');
const viewsController = require('../controllers/viewsController.js');
const authController = require('../controllers/authController.js');
const userController = require('../controllers/userController.js');
const bookingController = require('../controllers/bookingController.js');
const router = express.Router();
router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview,
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/me', authController.protect, viewsController.getAccount);

router.get('/my-tours', authController.protect, viewsController.getMyTours);
// /login
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.getSignupForm);

module.exports = router;
