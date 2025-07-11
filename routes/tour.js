import { protect, restrictTo } from '../controllers/auth.js';

import {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} from '../controllers/tour.js';

import ReviewRouter from "./review.js"

import { Router } from 'express';
const router = Router();

router.route('/top-5-tours').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin'), deleteTour)

// Points to Review Router 
router.use('/:tourId/reviews', ReviewRouter)

export default router;
