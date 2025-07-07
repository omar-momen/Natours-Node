import { protect, restrictTo } from '../controllers/auth.js';

import {
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  setTourUserIds,
} from '../controllers/review.js';

import { Router } from 'express';
const router = Router({ mergeParams: true });

router.route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(updateReview)
  .delete(protect, restrictTo('admin'), deleteReview);

export default router;
