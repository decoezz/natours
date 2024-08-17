const express = require('express');
const authController = require('../controllers/authController.js');
const reviewController = require('../controllers/reviewController.js');
const router = express.Router({ mergeParams: true });
router.use(authController.protect);
router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  );
module.exports = router;
