import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

const app = express();

// comment from omarr

// ===================== Middlewares
// Security HTTP headers middleware
app.use(helmet());

// Debugging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Parsing body data from requests
app.use(
  express.json({
    limit: '10kb',
  }),
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution (duplicate query parameters)
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Serving static files
app.use(express.static(`${import.meta.dirname}/public`));

// ===================== Routes
import tourRouter from './routes/tour.js';
app.use('/api/v1/tours', tourRouter);

import userRouter from './routes/user.js';
app.use('/api/v1/users', userRouter);

import reviewsRouter from './routes/review.js';
app.use('/api/v1/reviews', reviewsRouter);

// ===================== Error handling
import AppError from './utils/appError.js';
// Catching unhandled routes
app.all('*', (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});

// Global error handling middleware
import errorHandler from './controllers/error.js';
app.use(errorHandler);

export default app;
