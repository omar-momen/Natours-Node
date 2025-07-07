import Review from '../models/review.js';
import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

import { deleteOne, updateOne, createOne } from "./handlerFactory.js"

export const getAllReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query);
  features.filter().sort().limitingFields().paginate();

  const final_query = req.params.tourId ? features.mongo_query.find({
    tour: req.params.tourId
  }) : features.mongo_query

  const reviews = await final_query;

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews,
  });
});
export const getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: review,
  });
});
export const setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user.id
  next()
}

export const createReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);