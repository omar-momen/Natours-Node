import User from '../models/user.js';
import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

import { createOne, deleteOne, updateOne } from "./handlerFactory.js"

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword.',
        400,
      ),
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = {};
  const allowedFields = ['name', 'email'];
  Object.keys(req.body).forEach((el) => {
    if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
  });

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});
export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });
  res.status(204).json({
    status: 'success',
    message: 'User has been deleted successfully',
  });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query);
  features.filter().sort().limitingFields().paginate();
  const users = await features.mongo_query;

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

export const createUser = createOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
