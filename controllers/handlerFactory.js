import catchAsync from "../utils/catchAsync.js"
import AppError from "../utils/appError.js"
import APIFeatures from "../utils/apiFeatures.js"

export const deleteOne = Model => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError('No review found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    });
}

export const updateOne = Model => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: doc
        });
    });
}

export const createOne = Model => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: doc
        });
    });
}

export const getOne = (Model, populateOptions) => {
    return catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);

        if (populateOptions) query = query.populate(populateOptions);

        const doc = await query;

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: doc
        });
    });
}

export const getAll = (Model) => {
    return catchAsync(async (req, res, next) => {
        const features = new APIFeatures(Model.find(), req.query);
        features.filter().sort().limitingFields().paginate();
        const docs = await features.mongo_query;

        res.status(200).json({
            status: 'success',
            results: docs.length,
            data: docs
        });
    });
}

export const getCurrentUser = (Model) => {
    return catchAsync(async (req, res, next) => {
        const currentUser = await Model.findById(req.user.id);

        res.status(200).json({
            status: 'success',
            data: currentUser
        });
    });
}
