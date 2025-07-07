// Purpose: To catch any errors that occur in the async function and pass them to the error handler middleware.
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(err)
    });
  };
};

export default catchAsync;